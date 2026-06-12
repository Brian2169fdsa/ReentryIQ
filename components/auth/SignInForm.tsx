'use client'

import { useState } from 'react'
import { Icon } from '@/components/ui/Icon'

const isSupabaseConfigured = () =>
  typeof process !== 'undefined' &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [demoMode, setDemoMode] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setDemoMode(false)
    setLoading(true)

    if (!isSupabaseConfigured()) {
      setLoading(false)
      setDemoMode(true)
      return
    }

    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }
      window.location.href = '/dashboard'
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    height: 48,
    border: '1px solid var(--po-line-strong)',
    borderRadius: 'var(--po-r)',
    padding: '0 16px',
    fontSize: 14,
    background: 'var(--po-panel)',
    outline: 'none',
    color: 'var(--po-text)',
    width: '100%',
    boxSizing: 'border-box',
  }

  return (
    <div
      style={{
        background: 'var(--po-panel)',
        border: '1px solid var(--po-line)',
        borderRadius: 'var(--po-r)',
        padding: '32px 28px',
      }}
    >
      <h1
        className="po-display"
        style={{ fontSize: 22, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 6px', letterSpacing: '-0.01em' }}
      >
        Sign in
      </h1>
      <p style={{ fontSize: 14, color: 'var(--po-text-2)', margin: '0 0 24px' }}>
        Welcome back to ReentryIQ.
      </p>

      {error && (
        <div
          role="alert"
          style={{
            background: 'rgba(194,94,94,0.08)',
            border: '1px solid rgba(194,94,94,0.35)',
            color: '#A14848',
            borderRadius: 'var(--po-r)',
            padding: '10px 14px',
            fontSize: 13.5,
            marginBottom: 18,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Icon name="x" size={15} stroke="#A14848" />
          {error}
        </div>
      )}

      {demoMode && (
        <div
          role="status"
          style={{
            background: 'var(--po-copper-wash)',
            border: '1px solid var(--po-copper-line)',
            color: 'var(--po-text-2)',
            borderRadius: 'var(--po-r)',
            padding: '14px 16px',
            fontSize: 13.5,
            marginBottom: 18,
          }}
        >
          <p style={{ margin: '0 0 12px', fontWeight: 500, color: 'var(--po-text)' }}>
            Authentication isn&apos;t connected yet — continue to the demo dashboard.
          </p>
          <a
            href="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              height: 36,
              padding: '0 16px',
              background: 'var(--po-blue)',
              color: '#fff',
              fontWeight: 600,
              fontSize: 13,
              borderRadius: 'var(--po-r)',
              textDecoration: 'none',
            }}
          >
            Go to demo dashboard <Icon name="arrowRight" size={14} stroke="#fff" />
          </a>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label
            htmlFor="signin-email"
            className="po-label"
            style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--po-text-2)', letterSpacing: '0.04em', textTransform: 'uppercase' }}
          >
            Work email
          </label>
          <input
            id="signin-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@organization.org"
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label
            htmlFor="signin-password"
            className="po-label"
            style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--po-text-2)', letterSpacing: '0.04em', textTransform: 'uppercase' }}
          >
            Password
          </label>
          <input
            id="signin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            height: 48,
            background: loading ? 'var(--po-line-strong)' : 'var(--po-blue)',
            color: '#fff',
            fontWeight: 600,
            fontSize: 15,
            borderRadius: 'var(--po-r)',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginTop: 4,
            transition: 'opacity 0.15s',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <>
              <Icon name="refresh" size={16} stroke="#fff" />
              Signing in…
            </>
          ) : (
            <>
              Sign in <Icon name="arrowRight" size={16} stroke="#fff" />
            </>
          )}
        </button>
      </form>

      <p style={{ marginTop: 20, fontSize: 13.5, color: 'var(--po-text-3)', textAlign: 'center' }}>
        No account?{' '}
        <a href="/signup" style={{ color: 'var(--po-blue)', textDecoration: 'none', fontWeight: 600 }}>
          Start free
        </a>
      </p>
    </div>
  )
}
