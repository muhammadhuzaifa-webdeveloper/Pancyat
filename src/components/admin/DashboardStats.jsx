import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { supabase } from '../../lib/supabaseClient'

export default function DashboardStats() {
  const [stats, setStats] = useState({ todaySales: 0, todayOrders: 0, lowStock: 0, totalProducts: 0 })
  const [weekly, setWeekly] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    setLoading(true)
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const [{ data: todayOrders }, { data: products }, { data: weekOrders }] = await Promise.all([
      supabase.from('orders').select('total_amount').gte('created_at', startOfDay.toISOString()),
      supabase.from('products').select('id, stock_quantity, low_stock_threshold'),
      supabase
        .from('orders')
        .select('total_amount, created_at')
        .gte('created_at', new Date(Date.now() - 6 * 86400000).toISOString())
    ])

    const todaySales = (todayOrders || []).reduce((sum, o) => sum + Number(o.total_amount), 0)
    const lowStock = (products || []).filter((p) => p.stock_quantity <= p.low_stock_threshold).length

    const byDay = {}
    ;(weekOrders || []).forEach((o) => {
      const day = new Date(o.created_at).toLocaleDateString(undefined, { weekday: 'short' })
      byDay[day] = (byDay[day] || 0) + Number(o.total_amount)
    })
    const chartData = Object.entries(byDay).map(([day, total]) => ({ day, total: Number(total.toFixed(2)) }))

    setStats({
      todaySales,
      todayOrders: (todayOrders || []).length,
      lowStock,
      totalProducts: (products || []).length
    })
    setWeekly(chartData)
    setLoading(false)
  }

  const cards = [
    { label: "Today's sales", value: `$${stats.todaySales.toFixed(2)}` },
    { label: "Today's orders", value: stats.todayOrders },
    { label: 'Products in catalog', value: stats.totalProducts },
    { label: 'Low stock alerts', value: stats.lowStock, alert: stats.lowStock > 0 }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card p-4">
            <p className="label">{c.label}</p>
            <p className={`mt-2 text-2xl font-semibold font-display ${c.alert ? 'text-danger' : 'text-ink'}`}>
              {loading ? '—' : c.value}
            </p>
          </div>
        ))}
      </div>

      <div className="card p-4">
        <p className="label mb-4">Sales, last 7 days</p>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E2D8" />
              <XAxis dataKey="day" stroke="#8A8578" fontSize={12} />
              <YAxis stroke="#8A8578" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E7E2D8' }} />
              <Bar dataKey="total" fill="#1F6F5C" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
