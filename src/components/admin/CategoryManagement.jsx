import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function CategoryManagement() {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('categories').select('*').order('name')
    setCategories(data || [])
    setLoading(false)
  }

  async function handleAdd(e) {
    e.preventDefault()
    setError('')
    if (!name.trim()) return
    const { error } = await supabase.from('categories').insert({ name: name.trim() })
    if (error) return setError(error.message)
    setName('')
    load()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this category? Products in it become uncategorized.')) return
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) return alert(error.message)
    load()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Categories</h2>

      <form onSubmit={handleAdd} className="card flex gap-2 p-4">
        <input
          className="input"
          placeholder="New category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn-primary" type="submit">
          Add
        </button>
      </form>
      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="card divide-y divide-line">
        {loading && <p className="px-4 py-6 text-center text-ink/50">Loading…</p>}
        {!loading && categories.length === 0 && (
          <p className="px-4 py-6 text-center text-ink/50">No categories yet.</p>
        )}
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-4 py-3">
            <span className="font-medium">{c.name}</span>
            <button className="text-danger hover:underline text-sm" onClick={() => handleDelete(c.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
