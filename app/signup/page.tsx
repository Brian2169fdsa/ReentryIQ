import type { Metadata } from 'next'
import { Wordmark } from '@/components/ui/Wordmark'
import { SignUpForm } from '@/components/auth/SignUpForm'

export const metadata: Metadata = {
  title: 'Create account — ReentryIQ',
  description: 'Start free on ReentryIQ. No credit card required.',
}

export default function SignUpPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--po-bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}
    >
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Wordmark */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <Wordmark size={20} href="/" />
        </div>

        {/* Form card */}
        <SignUpForm />

        {/* Footer */}
        <div
          style={{
            marginTop: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            flexWrap: 'wrap',
          }}
        >
          <a href="/terms" style={{ fontSize: 12, color: 'var(--po-text-3)', textDecoration: 'none' }}>
            Terms
          </a>
          <a href="/privacy" style={{ fontSize: 12, color: 'var(--po-text-3)', textDecoration: 'none' }}>
            Privacy
          </a>
          <a href="/" style={{ fontSize: 12, color: 'var(--po-text-3)', textDecoration: 'none' }}>
            ← Back to reentryiq.com
          </a>
        </div>
      </div>
    </div>
  )
}
