# Pancyat POS

A point-of-sale system with a cashier dashboard and an admin dashboard, built with React (Vite) + Supabase.

## Structure

```
pancyat/
├── supabase/
│   └── schema.sql          # tables, RLS policies, atomic checkout function, seed data
├── src/
│   ├── lib/supabaseClient.js
│   ├── context/AuthContext.jsx
│   ├── components/
│   │   ├── shared/         # Navbar, ProtectedRoute
│   │   ├── admin/          # Sidebar, DashboardStats, ProductManagement,
│   │   │                     CategoryManagement, OrdersOverview, UserManagement
│   │   └── pos/             # CategoryFilter, ProductGrid, Cart, PaymentModal, OrderHistory
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── UserDashboard.jsx   # the POS screen
│   ├── App.jsx              # routes + role-based redirect
│   └── main.jsx
├── .env.example
└── package.json
```

## 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Open **SQL Editor** → paste the contents of `supabase/schema.sql` → **Run**.
   This creates:
   - `profiles`, `categories`, `products`, `orders`, `order_items` tables
   - a trigger that auto-creates a `profiles` row (role `cashier`) whenever someone signs up
   - `create_order()` — a single Postgres function that atomically inserts the order, its
     line items, and decrements stock (so a sale can never partially fail)
   - Row Level Security policies: cashiers can read the catalog and their own orders;
     only admins can write products/categories or change staff roles
   - a little seed data so the POS screen isn't empty on first run

3. Go to **Project Settings → API** and copy the **Project URL** and **anon public key**.

## 2. Configure the app

```bash
cp .env.example .env
```

Fill in:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-PUBLIC-KEY
```

## 3. Install and run

```bash
npm install
npm run dev
```

Open the printed local URL (default `http://localhost:5173`).

## 4. Create your first admin

1. In the app, click **Create account** on the login screen and sign up.
   (Supabase may require email confirmation depending on your project's Auth settings.)
2. Every new sign-up starts as `role = 'cashier'`. Promote yourself to admin by running
   this in the Supabase SQL editor:

```sql
update public.profiles set role = 'admin' where id = '<your-user-uuid-from-auth.users>';
```

3. Log back in — you'll land on `/admin` instead of `/pos`.

## How roles work

- **Admin** (`/admin`): sales overview + weekly chart, product CRUD, category CRUD,
  full order history across all cashiers, and staff role management.
- **Cashier** (`/pos`): the POS screen — browse products by category, build a cart,
  take a payment (cash / card / wallet), and see their own recent sales.
- Admins can also open `/pos` to ring up sales themselves.
- Route access and data access are both enforced: `ProtectedRoute` gates the pages,
  and Supabase RLS policies gate the data no matter which client calls the API.

## Checkout flow

`UserDashboard.jsx` builds a cart in local state, then calls the `create_order` RPC with
the cart as JSON. That single database function validates stock, computes totals,
inserts the order + items, and decrements inventory — all in one transaction — so
concurrent cashiers can't oversell a product.

## Notes

- Tax rate is set as a constant (`TAX_RATE = 0.08`) in `UserDashboard.jsx` — change it
  there, or move it into a `settings` table if you want it admin-editable.
- Payment methods are cash / card / wallet as a simple selector; there's no real
  payment processor wired in — swap `PaymentModal.jsx`'s confirm handler for a real
  gateway call if you need actual payment processing.
- Styling uses Tailwind with a small custom token set (see `tailwind.config.js`) —
  no UI kit dependency.
