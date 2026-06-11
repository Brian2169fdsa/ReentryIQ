import { Icon } from '@/components/ui/Icon'
import { HorizonBars } from '@/components/charts/HorizonBars'
import { HORIZON_BARS, TOTAL_RELEASES } from '@/lib/data'

export function Hero() {
  return (
    <section style={{ maxWidth: 1180, margin: '0 auto', padding: '56px 32px 8px' }}>
      <div
        className="l-hero"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}
      >
        {/* Left: copy */}
        <div>
          <div
            style={{
              display: 'inline-block',
              whiteSpace: 'nowrap',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--po-blue)',
              background: 'var(--po-copper-wash)',
              border: '1px solid var(--po-copper-line)',
              padding: '5px 12px',
              borderRadius: 999,
              marginBottom: 20,
            }}
          >
            Arizona release intelligence
          </div>

          <h1
            className="po-display l-hero-title"
            style={{
              fontSize: 44,
              lineHeight: 1.1,
              fontWeight: 700,
              color: 'var(--po-text)',
              margin: '0 0 18px',
              letterSpacing: '-0.02em',
            }}
          >
            Know who&apos;s coming home — before anyone else does.
          </h1>

          <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--po-text-2)', margin: '0 0 26px', maxWidth: 470 }}>
            Release intelligence for reentry &amp; recovery programs. Search every upcoming release in the state, get
            alerted as dates land, and push matches into your CRM.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 22 }}>
            <a
              href="/dashboard"
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
              }}
            >
              See pricing
            </a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 12.5, color: 'var(--po-text-3)' }}>
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: 'var(--po-sage-wash)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon name="shield" size={14} stroke="var(--po-sage)" />
            </span>
            Sourced from public records · refreshed daily · not for FCRA screening
          </div>
        </div>

        {/* Right: Release Horizon preview card */}
        <div
          style={{
            background: 'var(--po-panel)',
            border: '1px solid var(--po-line)',
            borderRadius: 'var(--po-r)',
            padding: '18px 20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 14,
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3
                className="po-display"
                style={{ fontSize: 15, fontWeight: 600, color: 'var(--po-text)', margin: 0 }}
              >
                Release Horizon
              </h3>
              <span style={{ fontSize: 11.5, color: 'var(--po-text-3)', whiteSpace: 'nowrap' }}>Next 180 Days</span>
            </div>
            <div style={{ display: 'flex', gap: 24 }}>
              <StatPill value="1,991" label="People Tracked" />
              <StatPill value="93%" label="With Dates" color="var(--po-sage)" />
            </div>
          </div>

          <HorizonBars days={HORIZON_BARS} todayIdx={14} height={132} />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginTop: 16,
              padding: '11px 13px',
              background: 'var(--po-blue-100)',
              border: '1px solid var(--po-copper-line)',
              borderRadius: 'var(--po-r-sm)',
              fontSize: 13,
              color: 'var(--po-text)',
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: 'var(--po-panel)',
                border: '1px solid var(--po-copper-line)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon name="sparkles" size={15} stroke="var(--po-blue)" />
            </span>
            <span>
              <b style={{ color: 'var(--po-blue)' }}>317</b> high-propensity releases into Maricopa in the next 60
              days.
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatPill({ value, label, color }: { value: string; label: string; color?: string }) {
  return (
    <div style={{ textAlign: 'right' }}>
      <div
        className="po-display"
        style={{ fontSize: 19, fontWeight: 700, color: color ?? 'var(--po-text)', lineHeight: 1 }}
      >
        {value}
      </div>
      <div style={{ fontSize: 11, color: 'var(--po-text-3)', marginTop: 3, whiteSpace: 'nowrap' }}>{label}</div>
    </div>
  )
}
