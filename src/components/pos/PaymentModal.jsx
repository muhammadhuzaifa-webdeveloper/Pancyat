import { useState } from 'react'

const METHODS = [
  { id: 'cash', label: 'Cash' },
  { id: 'card', label: 'Card' },
  { id: 'wallet', label: 'Mobile wallet' }
]

export default function PaymentModal({ total, onConfirm, onClose, busy }) {
  const [method, setMethod] = useState('cash')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
      <div className="card w-full max-w-sm p-6">
        <h3 className="text-lg font-semibold">Take payment</h3>
        <p className="mt-1 text-sm text-ink/60">Total due</p>
        <p className="font-display text-3xl font-semibold text-brand-600">${total.toFixed(2)}</p>

        <div className="mt-4 space-y-2">
          {METHODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`w-full rounded-card border px-4 py-2 text-left text-sm font-medium transition-colors ${
                method === m.id ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-line text-ink/70'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="mt-6 flex gap-2">
          <button className="btn-outline flex-1" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button className="btn-primary flex-1" onClick={() => onConfirm(method)} disabled={busy}>
            {busy ? 'Processing…' : 'Complete sale'}
          </button>
        </div>
      </div>
    </div>
  )
}
