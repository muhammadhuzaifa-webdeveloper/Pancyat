const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'products', label: 'Products' },
  { id: 'categories', label: 'Categories' },
  { id: 'orders', label: 'Orders' },
  { id: 'users', label: 'Staff & Users' }
]

export default function Sidebar({ active, onChange }) {
  return (
    <aside className="w-56 shrink-0 border-r border-line bg-panel p-4">
      <nav className="space-y-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`w-full rounded-card px-3 py-2 text-left text-sm font-medium transition-colors ${
              active === tab.id ? 'bg-brand-50 text-brand-700' : 'text-ink/70 hover:bg-paper'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
