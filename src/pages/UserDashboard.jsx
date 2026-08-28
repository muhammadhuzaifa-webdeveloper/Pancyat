import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/shared/Navbar.jsx'
import CategoryFilter from '../components/pos/CategoryFilter.jsx'
import ProductGrid from '../components/pos/ProductGrid.jsx'
import Cart from '../components/pos/Cart.jsx'
import PaymentModal from '../components/pos/PaymentModal.jsx'
import OrderHistory from '../components/pos/OrderHistory.jsx'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext.jsx'

const TAX_RATE = 0.08

export default function UserDashboard() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [cart, setCart] = useState([])
  const [showPayment, setShowPayment] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    loadCatalog()
  }, [])

  async function loadCatalog() {
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from('products').select('*').order('name'),
      supabase.from('categories').select('*').order('name')
    ])
    setProducts(prods || [])
    setCategories(cats || [])
  }

  const filtered = useMemo(
    () => (activeCategory === 'all' ? products : products.filter((p) => p.category_id === activeCategory)),
    [products, activeCategory]
  )

  function addToCart(product) {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }]
    })
  }

  function increase(id) {
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)))
  }

  function decrease(id) {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    )
  }

  function remove(id) {
    setCart((prev) => prev.filter((i) => i.id !== id))
  }

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax

  async function completeSale(paymentMethod) {
    setBusy(true)
    setError('')

    const { error } = await supabase.rpc('create_order', {
      p_cashier_id: user.id,
      p_payment_method: paymentMethod,
      p_tax_amount: Number(tax.toFixed(2)),
      p_items: cart.map((i) => ({ product_id: i.id, quantity: i.quantity, unit_price: i.price }))
    })

    setBusy(false)

    if (error) {
      setError(error.message)
      return
    }

    setCart([])
    setShowPayment(false)
    setRefreshKey((k) => k + 1)
    loadCatalog()
  }

  return (
    <div className="flex h-screen flex-col bg-paper">
      <Navbar title="Point of Sale" />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 space-y-4 overflow-y-auto p-6">
          <CategoryFilter categories={categories} active={activeCategory} onChange={setActiveCategory} />
          <ProductGrid products={filtered} onAdd={addToCart} />
          <OrderHistory refreshKey={refreshKey} />
        </main>

        <aside className="w-96 shrink-0 border-l border-line bg-panel p-4">
          {error && <p className="mb-2 rounded-card bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}
          <Cart
            cart={cart}
            onIncrease={increase}
            onDecrease={decrease}
            onRemove={remove}
            onCheckout={() => setShowPayment(true)}
            subtotal={subtotal}
            tax={tax}
            total={total}
          />
        </aside>
      </div>

      {showPayment && (
        <PaymentModal total={total} busy={busy} onConfirm={completeSale} onClose={() => setShowPayment(false)} />
      )}
    </div>
  )
}
