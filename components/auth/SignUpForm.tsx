'use client'

import { useState } from 'react'
import { Icon } from '@/components/ui/Icon'

const isSupabaseConfigured = () =>
  typeof process !== 'undefined' &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

type OrgType = 'treatment_center' | 'reentry_program' | 'sober_living' | 'other' | ''

interface Step1Data {
  orgName: string
  email: string
  password: string
  orgType: OrgType
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

const labelStyle: React.CSSProperties = {
  fontSize: 12.5,
  fontWeight: 600,
  color: 'var(--po-text-2)',
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
}

function StepIndicator({ step }: { step: 1 | 2 }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        marginBottom: 24,
        fontSize: 12.5,
        fontWeight: 600,
      }}
    >
      {/* Step 1 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: step >= 1 ? 'var(--po-blue)' : 'var(--po-line)',
            color: step >= 1 ? '#fff' : 'var(--po-text-3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {step > 1 ? <Icon name="check" size={12} stroke="#fff" /> : '1'}
        </div>
        <span style={{ color: step === 1 ? 'var(--po-text)' : 'var(--po-text-3)' }}>Account</span>
      </div>

      {/* Connector */}
      <div
        style={{
          flex: 1,
          height: 1,
          background: step > 1 ? 'var(--po-blue)' : 'var(--po-line)',
          margin: '0 10px',
          minWidth: 24,
        }}
      />

      {/* Step 2 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: step === 2 ? 'var(--po-blue)' : 'var(--po-line)',
            color: step === 2 ? '#fff' : 'var(--po-text-3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          2
        </div>
        <span style={{ color: step === 2 ? 'var(--po-text)' : 'var(--po-text-3)' }}>Permitted use</span>
      </div>
    </div>
  )
}

function Step1({
  data,
  onNext,
}: {
  data: Step1Data
  onNext: (d: Step1Data) => void
}) {
  const [orgName, setOrgName] = useState(data.orgName)
  const [email, setEmail] = useState(data.email)
  const [password, setPassword] = useState(data.password)
  const [orgType, setOrgType] = useState<OrgType>(data.orgType)
  const [pwError, setPwError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      setPwError('Password must be at least 8 characters.')
      return
    }
    setPwError('')
    onNext({ orgName, email, password, orgType })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label htmlFor="org-name" className="po-label" style={labelStyle}>
          Organization name
        </label>
        <input
          id="org-name"
          type="text"
          required
          value={orgName}
          onChange={e => setOrgName(e.target.value)}
          placeholder="Phoenix Rising Treatment Center"
          style={inputStyle}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label htmlFor="signup-email" className="po-label" style={labelStyle}>
          Work email
        </label>
        <input
          id="signup-email"
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
        <label htmlFor="signup-password" className="po-label" style={labelStyle}>
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={e => { setPassword(e.target.value); if (pwError) setPwError('') }}
          placeholder="Min. 8 characters"
          style={{
            ...inputStyle,
            borderColor: pwError ? 'rgba(194,94,94,0.6)' : undefined,
          }}
        />
        {pwError && (
          <p style={{ fontSize: 12.5, color: '#A14848', margin: 0 }}>{pwError}</p>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label htmlFor="org-type" className="po-label" style={labelStyle}>
          Organization type
        </label>
        <select
          id="org-type"
          required
          value={orgType}
          onChange={e => setOrgType(e.target.value as OrgType)}
          style={{
            ...inputStyle,
            appearance: 'none',
            WebkitAppearance: 'none',
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23888\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 14px center',
            paddingRight: 40,
          }}
        >
          <option value="" disabled>Select type…</option>
          <option value="treatment_center">Treatment center</option>
          <option value="reentry_program">Reentry program</option>
          <option value="sober_living">Sober living</option>
          <option value="other">Other</option>
        </select>
      </div>

      <button
        type="submit"
        style={{
          height: 48,
          background: 'var(--po-blue)',
          color: '#fff',
          fontWeight: 600,
          fontSize: 15,
          borderRadius: 'var(--po-r)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          marginTop: 4,
        }}
      >
        Continue <Icon name="arrowRight" size={16} stroke="#fff" />
      </button>
    </form>
  )
}

function Step2({
  data,
  onBack,
  onSubmit,
}: {
  data: Step1Data
  onBack: () => void
  onSubmit: () => void
}) {
  const [checks, setChecks] = useState({ c1: false, c2: false, c3: false })
  const [error, setError] = useState('')
  const [demoMode, setDemoMode] = useState(false)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const allChecked = checks.c1 && checks.c2 && checks.c3

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!allChecked) return
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
      const { error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            org_name: data.orgName,
            org_type: data.orgType,
            attested_permitted_use: true,
            attested_at: new Date().toISOString(),
          },
        },
      })
      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }
      setSuccess(true)
      onSubmit()
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div
        style={{
          background: 'var(--po-sage-wash, rgba(100,160,120,0.08))',
          border: '1px solid var(--po-sage-line, rgba(100,160,120,0.3))',
          borderRadius: 'var(--po-r)',
          padding: '28px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Icon name="checkCircle" size={36} stroke="var(--po-sage, #5a9e78)" />
        <h2
          className="po-display"
          style={{ fontSize: 18, fontWeight: 700, color: 'var(--po-text)', margin: 0 }}
        >
          Check your email to confirm
        </h2>
        <p style={{ fontSize: 14, color: 'var(--po-text-2)', margin: 0, lineHeight: 1.55, maxWidth: 320 }}>
          We sent a confirmation link to <strong>{data.email}</strong>. Click it to activate your account and access the dashboard.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Back link */}
      <button
        type="button"
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          color: 'var(--po-text-3)',
          fontSize: 13,
          padding: 0,
          marginBottom: 20,
        }}
      >
        <Icon name="chevronRight" size={14} stroke="var(--po-text-3)" style={{ transform: 'rotate(180deg)' }} />
        Back
      </button>

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

      {/* Attestation card */}
      <div
        style={{
          background: 'var(--po-copper-wash)',
          border: '1px solid var(--po-copper-line)',
          borderRadius: 'var(--po-r)',
          padding: '20px 18px',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Icon name="shield" size={16} stroke="var(--po-text-2)" />
          <span
            className="po-label"
            style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--po-text-2)' }}
          >
            Permitted-use attestation
          </span>
        </div>

        <p style={{ fontSize: 13, color: 'var(--po-text-2)', margin: '0 0 16px', lineHeight: 1.55 }}>
          ReentryIQ is a professional tool for reentry and recovery programs. Before creating your account, please confirm all of the following:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            {
              key: 'c1' as const,
              text: 'I will use ReentryIQ only for outreach, admissions, and program planning.',
            },
            {
              key: 'c2' as const,
              text: 'I will NOT use this data for employment, tenant, credit, or insurance screening, or any FCRA-covered purpose.',
            },
            {
              key: 'c3' as const,
              text: 'I understand release dates come from public records and can change at the agency\'s discretion.',
            },
          ].map(item => (
            <label
              key={item.key}
              style={{
                display: 'flex',
                gap: 10,
                cursor: 'pointer',
                alignItems: 'flex-start',
              }}
            >
              <div style={{ position: 'relative', flexShrink: 0, marginTop: 1 }}>
                <input
                  type="checkbox"
                  checked={checks[item.key]}
                  onChange={e => setChecks(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  style={{ position: 'absolute', opacity: 0, width: 18, height: 18, cursor: 'pointer', margin: 0 }}
                />
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    border: checks[item.key] ? '2px solid var(--po-blue)' : '1.5px solid var(--po-line-strong)',
                    background: checks[item.key] ? 'var(--po-blue)' : 'var(--po-panel)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.12s',
                    pointerEvents: 'none',
                  }}
                >
                  {checks[item.key] && <Icon name="check" size={11} stroke="#fff" strokeWidth={2.5} />}
                </div>
              </div>
              <span style={{ fontSize: 13.5, color: 'var(--po-text)', lineHeight: 1.5 }}>
                {item.text}
              </span>
            </label>
          ))}
        </div>

        <p style={{ fontSize: 12, color: 'var(--po-text-3)', margin: '16px 0 0', lineHeight: 1.5 }}>
          By creating an account you agree to our{' '}
          <a href="/acceptable-use" style={{ color: 'var(--po-blue)', textDecoration: 'none' }}>
            Acceptable Use Policy
          </a>{' '}
          and{' '}
          <a href="/fcra-notice" style={{ color: 'var(--po-blue)', textDecoration: 'none' }}>
            FCRA Notice
          </a>
          .
        </p>
      </div>

      <button
        type="submit"
        disabled={!allChecked || loading}
        style={{
          height: 48,
          background: !allChecked || loading ? 'var(--po-line-strong)' : 'var(--po-blue)',
          color: '#fff',
          fontWeight: 600,
          fontSize: 15,
          borderRadius: 'var(--po-r)',
          border: 'none',
          cursor: !allChecked || loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          opacity: !allChecked ? 0.55 : loading ? 0.7 : 1,
          transition: 'opacity 0.15s, background 0.15s',
        }}
      >
        {loading ? (
          <>
            <Icon name="refresh" size={16} stroke="#fff" />
            Creating account…
          </>
        ) : (
          <>
            Create account <Icon name="arrowRight" size={16} stroke="#fff" />
          </>
        )}
      </button>
    </form>
  )
}

export function SignUpForm() {
  const [step, setStep] = useState<1 | 2>(1)
  const [submitted, setSubmitted] = useState(false)
  const [step1Data, setStep1Data] = useState<Step1Data>({
    orgName: '',
    email: '',
    password: '',
    orgType: '',
  })

  function handleStep1Next(data: Step1Data) {
    setStep1Data(data)
    setStep(2)
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
        Create your account
      </h1>
      <p style={{ fontSize: 14, color: 'var(--po-text-2)', margin: '0 0 24px' }}>
        Free forever. No credit card required.
      </p>

      {!submitted && <StepIndicator step={step} />}

      {step === 1 && !submitted && (
        <Step1 data={step1Data} onNext={handleStep1Next} />
      )}

      {step === 2 && (
        <Step2
          data={step1Data}
          onBack={() => setStep(1)}
          onSubmit={() => setSubmitted(true)}
        />
      )}

      {!submitted && (
        <p style={{ marginTop: 20, fontSize: 13.5, color: 'var(--po-text-3)', textAlign: 'center' }}>
          Already have an account?{' '}
          <a href="/signin" style={{ color: 'var(--po-blue)', textDecoration: 'none', fontWeight: 600 }}>
            Sign in
          </a>
        </p>
      )}
    </div>
  )
}
