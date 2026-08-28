import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext.jsx'

export default function OrderHistory({ refreshKey }) {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [refreshKey])

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('cashier_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)
    setOrders(data || [])
    setLoading(false)
  }

  return (
    <div className="card p-4">
      <h3 className="mb-3 text-sm font-semibold">Your recent sales</h3>
      {loading && <p className="text-sm text-ink/40">Loading…</p>}
      {!loading && orders.length === 0 && <p className="text-sm text-ink/40">No sales yet today.</p>}
      <ul className="space-y-2">
        {orders.map((o) => (
          <li key={o.id} className="flex justify-between text-sm">
            <span className="text-ink/60">{new Date(o.created_at).toLocaleTimeString()}</span>
            <span className="capitalize text-ink/60">{o.payment_method}</span>
            <span className="font-medium">${Number(o.total_amount).toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
