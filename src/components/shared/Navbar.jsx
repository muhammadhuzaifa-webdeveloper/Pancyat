import { useAuth } from '../../context/AuthContext.jsx'

export default function Navbar({ title }) {
  const { profile, signOut } = useAuth()

  return (
    <header className="flex items-center justify-between border-b border-line bg-panel px-6 py-4">
      <div>
        <h1 className="text-lg font-semibold text-ink">{title}</h1>
        <p className="text-xs text-ink/50">Pancyat Point of Sale</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium leading-tight">{profile?.full_name || 'Staff'}</p>
          <p className="text-xs uppercase tracking-wide text-brand-600">{profile?.role}</p>
        </div>
        <button onClick={signOut} className="btn-outline">
          Sign out
        </button>
      </div>
    </header>
  )
}
