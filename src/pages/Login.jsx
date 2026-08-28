import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setInfo('')
    setBusy(true)

    if (mode === 'signin') {
      const { error } = await signIn(email, password)
      setBusy(false)
      if (error) return setError(error.message)
      navigate('/')
    } else {
      const { error } = await signUp(email, password, fullName)
      setBusy(false)
      if (error) return setError(error.message)
      setInfo('Account created. New accounts start as cashiers until an admin promotes them — check your email if confirmation is required.')
      setMode('signin')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-brand-600">Pancyat</h1>
          <p className="mt-1 text-sm text-ink/60">Point of sale, built for the counter.</p>
        </div>

        <div className="card p-6">
          <div className="mb-6 flex rounded-card border border-line p-1 text-sm">
            <button
              className={`flex-1 rounded-[8px] py-1.5 font-medium transition-colors ${mode === 'signin' ? 'bg-brand-500 text-white' : 'text-ink/60'}`}
              onClick={() => setMode('signin')}
              type="button"
            >
              Sign in
            </button>
            <button
              className={`flex-1 rounded-[8px] py-1.5 font-medium transition-colors ${mode === 'signup' ? 'bg-brand-500 text-white' : 'text-ink/60'}`}
              onClick={() => setMode('signup')}
              type="button"
            >
              Create account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="label">Full name</label>
                <input className="input mt-1" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <input type="email" className="input mt-1" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input mt-1" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>

            {error && <p className="rounded-card bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}
            {info && <p className="rounded-card bg-brand-50 px-3 py-2 text-sm text-brand-700">{info}</p>}

            <button type="submit" disabled={busy} className="btn-primary w-full">
              {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
