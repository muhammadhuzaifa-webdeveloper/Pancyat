export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange('all')}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
          active === 'all' ? 'bg-brand-500 text-white' : 'bg-panel border border-line text-ink/70'
        }`}
      >
        All
      </button>
      {categories.map((c) => (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            active === c.id ? 'bg-brand-500 text-white' : 'bg-panel border border-line text-ink/70'
          }`}
        >
          {c.name}
        </button>
      ))}
    </div>
  )
}
