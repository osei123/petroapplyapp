"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { LogIn, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    // Note: In a real app we would check role == 'admin' as well after logging in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/admin/dashboard')
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-[var(--background)] p-4">
      <div className="w-full max-w-md rounded-3xl bg-[var(--surface)] p-8 shadow-[var(--shadow-card)] ring-1 ring-[var(--border)]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary)] text-white">
            <LogIn className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text)]">PetroApply Admin</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">Sign in to manage the platform</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-500/10 p-4 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
              placeholder="admin@petroapply.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-hover)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center rounded-2xl bg-[var(--primary)] px-4 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-[var(--primary-dark)] disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
