import { Icon } from '@/components/ui/Icon'

export function CtaBand() {
  return (
    <section style={{ maxWidth: 1180, margin: '0 auto', padding: '8px 32px 64px' }}>
      <div
        className="site-cta"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          flexWrap: 'wrap',
          background: 'linear-gradient(120deg, var(--po-blue-100), var(--po-panel))',
          border: '1px solid var(--po-copper-line)',
          borderRadius: 'var(--po-r)',
          padding: '32px 36px',
        }}
      >
        <div>
          <h2
            className="po-display"
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: 'var(--po-text)',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            Reach people the moment they&apos;re coming home.
          </h2>
          <p style={{ fontSize: 15, color: 'var(--po-text-2)', margin: '8px 0 0' }}>
            Start free — no card required. Light up your county and see who&apos;s releasing in minutes.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a
            href="/signup"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              height: 48,
              padding: '0 24px',
              borderRadius: 'var(--po-r)',
              background: 'var(--po-blue)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Start free <Icon name="arrowRight" size={17} stroke="#fff" />
          </a>
          <a
            href="/pricing"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: 48,
              padding: '0 24px',
              borderRadius: 'var(--po-r)',
              background: 'var(--po-panel)',
              color: 'var(--po-text)',
              fontSize: 15,
              fontWeight: 600,
              textDecoration: 'none',
              border: '1px solid var(--po-line-strong)',
              whiteSpace: 'nowrap',
            }}
          >
            See pricing
          </a>
        </div>
      </div>
    </section>
  )
}
