import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function OrdersOverview() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [items, setItems] = useState([])

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('orders')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false })
      .limit(100)
    setOrders(data || [])
    setLoading(false)
  }

  async function toggleExpand(order) {
    if (expanded === order.id) {
      setExpanded(null)
      return
    }
    const { data } = await supabase
      .from('order_items')
      .select('*, products(name)')
      .eq('order_id', order.id)
    setItems(data || [])
    setExpanded(order.id)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Orders</h2>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-paper text-left text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Cashier</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">When</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-ink/50">Loading…</td>
              </tr>
            )}
            {!loading && orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-ink/50">No orders yet.</td>
              </tr>
            )}
            {orders.map((o) => (
              <>
                <tr
                  key={o.id}
                  className="cursor-pointer border-t border-line hover:bg-paper"
                  onClick={() => toggleExpand(o)}
                >
                  <td className="px-4 py-3 font-mono text-xs">#{o.id.slice(0, 8)}</td>
                  <td className="px-4 py-3">{o.profiles?.full_name || '—'}</td>
                  <td className="px-4 py-3 capitalize">{o.payment_method}</td>
                  <td className="px-4 py-3 font-medium">${Number(o.total_amount).toFixed(2)}</td>
                  <td className="px-4 py-3 text-ink/60">{new Date(o.created_at).toLocaleString()}</td>
                </tr>
                {expanded === o.id && (
                  <tr className="border-t border-line bg-paper/60">
                    <td colSpan={5} className="px-4 py-3">
                      <ul className="space-y-1 text-ink/80">
                        {items.map((it) => (
                          <li key={it.id} className="flex justify-between">
                            <span>
                              {it.quantity} × {it.products?.name}
                            </span>
                            <span>${Number(it.line_total).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
