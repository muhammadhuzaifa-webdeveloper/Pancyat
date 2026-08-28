import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(undefined)

// Superadmin is a superset of "admin" everywhere in the UI/routes.
function roleSatisfies(actualRole, requiredRole) {
  if (!requiredRole) return true
  if (actualRole === requiredRole) return true
  if (requiredRole === 'admin' && actualRole === 'superadmin') return true
  return false
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  async function loadProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) {
      console.error('Failed to load profile', error)
      setProfile(null)
      return null
    }
    setProfile(data)
    return data
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      if (session?.user) await loadProfile(session.user.id)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      if (session?.user) {
        await loadProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  // expectedRole is the role the person picked on the login screen.
  // Every path is verified server-side (RLS + RPCs) regardless of
  // this check, but checking it here means someone can't even land
  // in the app under the wrong dashboard while their session is
  // getting resolved.
  async function signIn(email, password, expectedRole) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error }

    const user = data.user
    const loadedProfile = await loadProfile(user.id)

    if (!loadedProfile) {
      await supabase.auth.signOut()
      return { error: { message: 'Could not verify this account. Please contact an administrator.' } }
    }

    if (expectedRole && !roleSatisfies(loadedProfile.role, expectedRole)) {
      await supabase.auth.signOut()
      setProfile(null)
      return {
        error: {
          message: `This account isn't registered as ${expectedRole}. Pick the correct role and try again.`
        }
      }
    }

    if (loadedProfile.status === 'rejected' || loadedProfile.status === 'suspended') {
      await supabase.auth.signOut()
      setProfile(null)
      return { error: { message: 'Your account access has been revoked. Contact an administrator.' } }
    }

    return { error: null, profile: loadedProfile }
  }

  // role must be 'admin' or 'cashier' — the server refuses anything
  // else and always ignores an attempt to request 'superadmin'.
  async function signUp(email, password, fullName, role) {
    const requestedRole = role === 'admin' ? 'admin' : 'cashier'
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, requested_role: requestedRole } }
    })
    return { data, error }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setProfile(null)
  }

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    role: profile?.role ?? null,
    status: profile?.status ?? null,
    isApproved: profile?.status === 'approved',
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile: () => session?.user && loadProfile(session.user.id)
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (ctx === undefined) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}