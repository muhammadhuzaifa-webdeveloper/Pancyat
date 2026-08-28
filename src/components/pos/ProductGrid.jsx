export default function ProductGrid({ products, onAdd }) {
  if (products.length === 0) {
    return <p className="py-12 text-center text-ink/50">No products in this category.</p>
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => {
        const outOfStock = p.stock_quantity <= 0
        return (
          <button
            key={p.id}
            disabled={outOfStock}
            onClick={() => onAdd(p)}
            className="card flex flex-col items-start p-4 text-left transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
          >
            <span className="font-medium">{p.name}</span>
            <span className="mt-1 text-sm text-ink/50">${Number(p.price).toFixed(2)}</span>
            <span className={`mt-2 text-xs ${outOfStock ? 'text-danger' : 'text-ink/40'}`}>
              {outOfStock ? 'Out of stock' : `${p.stock_quantity} in stock`}
            </span>
          </button>
        )
      })}
    </div>
  )
}
