import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

const EMPTY_FORM = {
  id: null,
  name: '',
  sku: '',
  price: '',
  stock_quantity: '',
  low_stock_threshold: 5,
  category_id: ''
}

export default function ProductManagement() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    setLoading(true)
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from('products').select('*, categories(name)').order('name'),
      supabase.from('categories').select('*').order('name')
    ])
    setProducts(prods || [])
    setCategories(cats || [])
    setLoading(false)
  }

  function startEdit(product) {
    setForm({
      id: product.id,
      name: product.name,
      sku: product.sku || '',
      price: product.price,
      stock_quantity: product.stock_quantity,
      low_stock_threshold: product.low_stock_threshold,
      category_id: product.category_id || ''
    })
    setShowForm(true)
  }

  function startNew() {
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const payload = {
      name: form.name,
      sku: form.sku || null,
      price: Number(form.price),
      stock_quantity: Number(form.stock_quantity),
      low_stock_threshold: Number(form.low_stock_threshold),
      category_id: form.category_id || null
    }

    const query = form.id
      ? supabase.from('products').update(payload).eq('id', form.id)
      : supabase.from('products').insert(payload)

    const { error } = await query
    if (error) return setError(error.message)

    setShowForm(false)
    setForm(EMPTY_FORM)
    loadAll()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this product? This cannot be undone.')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) return alert(error.message)
    loadAll()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Products</h2>
        <button className="btn-primary" onClick={startNew}>
          + Add product
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card grid grid-cols-2 gap-4 p-4">
          <div>
            <label className="label">Name</label>
            <input className="input mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="label">SKU</label>
            <input className="input mt-1" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
          </div>
          <div>
            <label className="label">Price</label>
            <input type="number" step="0.01" min="0" className="input mt-1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input mt-1" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
              <option value="">Uncategorized</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Stock quantity</label>
            <input type="number" min="0" className="input mt-1" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} required />
          </div>
          <div>
            <label className="label">Low stock threshold</label>
            <input type="number" min="0" className="input mt-1" value={form.low_stock_threshold} onChange={(e) => setForm({ ...form, low_stock_threshold: e.target.value })} />
          </div>

          {error && <p className="col-span-2 text-sm text-danger">{error}</p>}

          <div className="col-span-2 flex gap-2">
            <button type="submit" className="btn-primary">
              {form.id ? 'Save changes' : 'Create product'}
            </button>
            <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-paper text-left text-xs uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-ink/50">Loading…</td>
              </tr>
            )}
            {!loading && products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-ink/50">No products yet.</td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p.id} className="border-t border-line">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-ink/60">{p.categories?.name || '—'}</td>
                <td className="px-4 py-3">${Number(p.price).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={p.stock_quantity <= p.low_stock_threshold ? 'text-danger font-semibold' : ''}>
                    {p.stock_quantity}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="mr-3 text-brand-600 hover:underline" onClick={() => startEdit(p)}>
                    Edit
                  </button>
                  <button className="text-danger hover:underline" onClick={() => handleDelete(p.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
