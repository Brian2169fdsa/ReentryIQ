import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { Icon } from '@/components/ui/Icon'

export const metadata = {
  title: 'System Status — ReentryIQ',
  description: 'Current operational status for all ReentryIQ services — web app, API, data pipeline, alerts, and AI assistant.',
}

const SERVICES = [
  {
    name: 'Web application',
    description: 'Dashboard, search, record views, saved searches',
    lastEvent: 'No incidents',
  },
  {
    name: 'REST API',
    description: 'Programmatic access for Enterprise accounts',
    lastEvent: 'No incidents',
  },
  {
    name: 'Data pipeline',
    description: 'Daily ADCRR data refresh',
    lastEvent: 'Last refresh: Today 6:00 AM MST',
  },
  {
    name: 'Alerts delivery',
    description: 'Saved-search email and CRM push notifications',
    lastEvent: 'Last dispatch: Today 6:22 AM MST',
  },
  {
    name: 'CRM connectors',
    description: 'Salesforce, KIPU, Sunwave, and webhook push',
    lastEvent: 'No incidents',
  },
  {
    name: 'AI assistant',
    description: 'Natural language data queries (Enterprise)',
    lastEvent: 'No incidents',
  },
]

export default function StatusPage() {
  return (
    <div style={{ background: 'var(--po-bg)', minHeight: '100vh' }}>
      <SiteNav />
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '56px 32px 72px' }}>

        {/* Eyebrow + Hero */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              display: 'inline-block', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--po-blue)', background: 'var(--po-copper-wash)',
              border: '1px solid var(--po-copper-line)', padding: '5px 12px', borderRadius: 999, marginBottom: 18,
            }}
          >
            System Status
          </div>
          <h1 className="po-display" style={{ fontSize: 40, lineHeight: 1.1, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 14px', letterSpacing: '-0.02em' }}>
            Service status
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: 'var(--po-text-2)', margin: 0 }}>
            Current operational status for all ReentryIQ services. Updated after each system event.
          </p>
        </div>

        {/* All systems operational banner */}
        <div
          style={{
            background: 'var(--po-sage-wash)', border: '1px solid var(--po-sage-line)',
            borderRadius: 'var(--po-r)', padding: '20px 24px', marginBottom: 32,
            display: 'flex', gap: 14, alignItems: 'center',
          }}
        >
          <Icon name="checkCircle" size={24} stroke="var(--po-sage)" style={{ flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 2px' }}>
              All systems operational
            </p>
            <p style={{ fontSize: 13, color: 'var(--po-text-2)', margin: 0 }}>
              Last checked: June 12, 2026 — no incidents or degraded service reported
            </p>
          </div>
        </div>

        {/* Service list */}
        <div
          style={{
            background: 'var(--po-panel)', border: '1px solid var(--po-line)',
            borderRadius: 'var(--po-r)', overflow: 'hidden', marginBottom: 32,
          }}
        >
          {/* Table header */}
          <div
            style={{
              display: 'grid', gridTemplateColumns: '1fr auto',
              padding: '12px 20px', borderBottom: '1px solid var(--po-line)',
              background: 'var(--po-bg)',
            }}
          >
            <span className="po-label" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--po-text-3)' }}>
              Service
            </span>
            <span className="po-label" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--po-text-3)' }}>
              Status
            </span>
          </div>

          {/* Service rows */}
          {SERVICES.map((service, i) => (
            <div
              key={service.name}
              style={{
                display: 'grid', gridTemplateColumns: '1fr auto',
                padding: '16px 20px', alignItems: 'center', gap: 20,
                borderBottom: i < SERVICES.length - 1 ? '1px solid var(--po-line)' : 'none',
              }}
            >
              <div>
                <p style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--po-text)', margin: '0 0 3px' }}>
                  {service.name}
                </p>
                <p style={{ fontSize: 12.5, color: 'var(--po-text-3)', margin: '0 0 3px' }}>
                  {service.description}
                </p>
                <p style={{ fontSize: 12, color: 'var(--po-text-3)', margin: 0 }}>
                  {service.lastEvent}
                </p>
              </div>
              <div
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'var(--po-sage-wash)', border: '1px solid var(--po-sage-line)',
                  borderRadius: 999, padding: '4px 12px', whiteSpace: 'nowrap',
                }}
              >
                <div
                  style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: 'var(--po-sage)', flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--po-sage)' }}>
                  Operational
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Data pipeline detail */}
        <div
          style={{
            background: 'var(--po-panel)', border: '1px solid var(--po-line)',
            borderRadius: 'var(--po-r)', padding: '22px 24px', marginBottom: 28,
          }}
        >
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
            <Icon name="refresh" size={18} stroke="var(--po-blue)" style={{ marginTop: 2 }} />
            <h2 className="po-display" style={{ fontSize: 16, fontWeight: 700, color: 'var(--po-text)', margin: 0 }}>
              Data pipeline schedule
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Daily ADCRR fetch', time: '~5:00 AM MST' },
              { label: 'Data normalization & deduplication', time: '~5:30 AM MST' },
              { label: 'Dashboard & search index updated', time: '~6:00 AM MST' },
              { label: 'Saved-search alerts dispatched', time: '~6:15 AM MST' },
              { label: 'CRM push for matching records', time: '~6:20 AM MST' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, fontSize: 13.5 }}>
                <span style={{ color: 'var(--po-text-2)' }}>{row.label}</span>
                <span className="po-mono" style={{ color: 'var(--po-text-3)', whiteSpace: 'nowrap' }}>{row.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Incident history note */}
        <div
          style={{
            background: 'var(--po-bg)', border: '1px solid var(--po-line)',
            borderRadius: 'var(--po-r)', padding: '16px 20px',
            display: 'flex', gap: 12, alignItems: 'center',
          }}
        >
          <Icon name="clock" size={16} stroke="var(--po-text-3)" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: 13.5, color: 'var(--po-text-3)', margin: 0, lineHeight: 1.55 }}>
            Live incident history and uptime tracking are coming soon. For urgent issues,
            email <a href="mailto:brian@manageai.io" style={{ color: 'var(--po-blue)', textDecoration: 'none' }}>brian@manageai.io</a> with
            &ldquo;urgent&rdquo; in the subject line.
          </p>
        </div>

      </main>
      <SiteFooter />
    </div>
  )
}
