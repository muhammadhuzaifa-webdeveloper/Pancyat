export default function Cart({ cart, onIncrease, onDecrease, onRemove, onCheckout, subtotal, tax, total }) {
  return (
    <div className="flex h-full flex-col">
      <h2 className="mb-3 text-lg font-semibold">Current order</h2>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {cart.length === 0 && <p className="py-8 text-center text-sm text-ink/40">Tap a product to add it here.</p>}
        {cart.map((item) => (
          <div key={item.id} className="card flex items-center justify-between p-3">
            <div>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-ink/50">${Number(item.price).toFixed(2)} each</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-outline h-7 w-7 p-0" onClick={() => onDecrease(item.id)}>
                −
              </button>
              <span className="w-5 text-center text-sm">{item.quantity}</span>
              <button className="btn-outline h-7 w-7 p-0" onClick={() => onIncrease(item.id)}>
                +
              </button>
              <button className="ml-1 text-xs text-danger hover:underline" onClick={() => onRemove(item.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-1 border-t border-line pt-4 text-sm">
        <div className="flex justify-between text-ink/60">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-ink/60">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <button className="btn-primary mt-4 w-full py-3" disabled={cart.length === 0} onClick={onCheckout}>
        Charge ${total.toFixed(2)}
      </button>
    </div>
  )
}
