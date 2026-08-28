import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function UserManagement() {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('profiles').select('*').order('created_at')
    setProfiles(data || [])
    setLoading(false)
  }

  async function updateRole(id, role) {
    setError('')
    const { error } = await supabase.from('profiles').update({ role }).eq('id', id)
    if (error) return setError(error.message)
    load()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Staff & users</h2>
      <p className="text-sm text-ink/60">
        Promote a cashier to admin, or step an admin back down. New sign-ups default to cashier.
      </p>
      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="card divide-y divide-line">
        {loading && <p className="px-4 py-6 text-center text-ink/50">Loading…</p>}
        {!loading && profiles.length === 0 && (
          <p className="px-4 py-6 text-center text-ink/50">No users yet.</p>
        )}
        {profiles.map((p) => (
          <div key={p.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="font-medium">{p.full_name || 'Unnamed'}</p>
              <p className="text-xs text-ink/50">{p.id}</p>
            </div>
            <select
              className="input w-40"
              value={p.role}
              onChange={(e) => updateRole(p.id, e.target.value)}
            >
              <option value="cashier">Cashier</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}
