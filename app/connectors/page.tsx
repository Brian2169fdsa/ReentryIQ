import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { CtaBand } from '@/components/layout/CtaBand'
import { Icon } from '@/components/ui/Icon'

export const metadata = {
  title: 'Connectors — ReentryIQ',
  description:
    'Push matched releases straight into Salesforce, KIPU, or Sunwave — or anywhere via signed webhook. Map ReentryIQ fields to your CRM and your pipeline fills itself.',
}

interface Connector {
  icon: string
  name: string
  desc: string
  highlights: string[]
}

const CONNECTORS: Connector[] = [
  {
    icon: 'send',
    name: 'Salesforce',
    desc: 'Push matched releases into Salesforce as Leads — or a custom object that fits your intake model — the moment a saved search hits.',
    highlights: [
      'Create as Lead or custom object',
      'Owner & campaign assignment by rule',
      'De-duplicates on doc number',
    ],
  },
  {
    icon: 'fileText',
    name: 'KIPU',
    desc: 'Create pre-admission records in KIPU so your admissions team can prep a bed before the person walks out the gate.',
    highlights: [
      'Pre-admission record on match',
      'Maps release date to expected arrival',
      'Facility & county carried through',
    ],
  },
  {
    icon: 'layers',
    name: 'Sunwave',
    desc: 'Sync matched records into your Sunwave CRM pipeline so outreach, verification, and admissions stay in one place.',
    highlights: [
      'Drops into your CRM pipeline stage',
      'Match score travels with the record',
      'Keeps your existing workflow intact',
    ],
  },
  {
    icon: 'plug',
    name: 'Webhooks',
    desc: 'A signed JSON POST on every match — wire ReentryIQ into Zapier, a queue, or your own service and route it anywhere.',
    highlights: [
      'JSON POST on every match',
      'HMAC-SHA256 signature header',
      'Retries with backoff on failure',
    ],
  },
]

interface FieldMap {
  source: string
  target: string
}

const FIELD_MAP: FieldMap[] = [
  { source: 'name', target: 'Full Name' },
  { source: 'doc_number', target: 'External ID' },
  { source: 'county', target: 'County / Region' },
  { source: 'facility', target: 'Releasing Facility' },
  { source: 'release_date', target: 'Expected Arrival Date' },
  { source: 'offense_class', target: 'Offense Class' },
  { source: 'match_score', target: 'Match Score' },
]

const PUSH_STEPS = [
  {
    icon: 'bell',
    title: 'Match found',
    body: 'A saved search hits — a new release matches your county, window, and score threshold.',
  },
  {
    icon: 'settings',
    title: 'Mapped to your schema',
    body: 'ReentryIQ fields are translated to your CRM fields using the mapping you configured once.',
  },
  {
    icon: 'checkCircle',
    title: 'Created in your CRM',
    body: 'The record lands in Salesforce, KIPU, Sunwave, or your endpoint — ready for outreach.',
  },
]

const eyebrow: React.CSSProperties = {
  display: 'inline-block',
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--po-blue)',
  background: 'var(--po-copper-wash)',
  border: '1px solid var(--po-copper-line)',
  padding: '5px 12px',
  borderRadius: 999,
  marginBottom: 18,
}

const fieldChip: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  height: 40,
  padding: '0 14px',
  background: 'var(--po-bg)',
  border: '1px solid var(--po-line)',
  borderRadius: 'var(--po-r)',
  fontSize: 13.5,
}

export default function ConnectorsPage() {
  return (
    <div style={{ background: 'var(--po-bg)', minHeight: '100vh' }}>
      <SiteNav />
      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '56px 32px 72px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 52px' }}>
          <div style={eyebrow}>Connectors</div>
          <h1
            className="po-display"
            style={{
              fontSize: 40,
              lineHeight: 1.1,
              fontWeight: 700,
              color: 'var(--po-text)',
              margin: '0 0 16px',
              letterSpacing: '-0.02em',
            }}
          >
            Your pipeline, automatically.
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--po-text-2)', margin: 0 }}>
            Stop copying records by hand. Map ReentryIQ&apos;s release data to your CRM once, and every match flows
            straight into Salesforce, KIPU, Sunwave, or any endpoint you choose — the moment it happens.
          </p>
        </div>

        {/* Connector cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 20,
            marginBottom: 64,
          }}
        >
          {CONNECTORS.map(c => (
            <div
              key={c.name}
              style={{
                background: 'var(--po-panel)',
                border: '1px solid var(--po-line)',
                borderRadius: 'var(--po-r)',
                padding: '26px 24px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'var(--po-copper-wash)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 18,
                }}
              >
                <Icon name={c.icon} size={19} stroke="var(--po-blue)" />
              </div>
              <h2
                className="po-display"
                style={{ fontSize: 19, fontWeight: 600, color: 'var(--po-text)', margin: '0 0 10px' }}
              >
                {c.name}
              </h2>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--po-text-2)', margin: '0 0 18px' }}>
                {c.desc}
              </p>
              <div
                style={{
                  marginTop: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 9,
                  paddingTop: 16,
                  borderTop: '1px solid var(--po-line)',
                }}
              >
                {c.highlights.map(h => (
                  <div
                    key={h}
                    style={{
                      display: 'flex',
                      gap: 9,
                      alignItems: 'flex-start',
                      fontSize: 13.5,
                      color: 'var(--po-text-2)',
                      lineHeight: 1.45,
                    }}
                  >
                    <Icon name="check" size={15} stroke="var(--po-sage)" style={{ marginTop: 2 }} />
                    {h}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Field mapper */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 28px' }}>
            <div className="po-label" style={{ marginBottom: 10 }}>
              Field mapper
            </div>
            <h2
              className="po-display"
              style={{ fontSize: 28, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 12px', letterSpacing: '-0.02em' }}
            >
              Map once. Push forever.
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--po-text-2)', margin: 0 }}>
              Tell us which ReentryIQ field belongs where in your CRM. Every match after that arrives shaped exactly the
              way your team already works.
            </p>
          </div>

          <div
            style={{
              background: 'var(--po-panel)',
              border: '1px solid var(--po-line)',
              borderRadius: 'var(--po-r)',
              padding: '24px 28px',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 44px 1fr',
                alignItems: 'center',
                gap: '0 12px',
                marginBottom: 14,
              }}
            >
              <div className="po-label">ReentryIQ field</div>
              <div />
              <div className="po-label">Your CRM field</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {FIELD_MAP.map(m => (
                <div
                  key={m.source}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 44px 1fr',
                    alignItems: 'center',
                    gap: '0 12px',
                  }}
                >
                  <div style={fieldChip}>
                    <span className="po-mono" style={{ fontSize: 13, color: 'var(--po-text)' }}>
                      {m.source}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Icon name="arrowRight" size={18} stroke="var(--po-blue)" />
                  </div>
                  <div style={{ ...fieldChip, background: 'var(--po-blue-100)', borderColor: 'var(--po-copper-line)' }}>
                    <span style={{ color: 'var(--po-text)', fontWeight: 500 }}>{m.target}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="po-mono" style={{ fontSize: 12, color: 'var(--po-text-3)', margin: '18px 0 0' }}>
              Target field names are illustrative — map to any standard or custom field your CRM exposes.
            </p>
          </div>
        </div>

        {/* How a push works */}
        <div>
          <h2
            className="po-display"
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: 'var(--po-text)',
              textAlign: 'center',
              margin: '0 0 28px',
              letterSpacing: '-0.02em',
            }}
          >
            How a push works
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {PUSH_STEPS.map((s, i) => (
              <div
                key={s.title}
                style={{
                  background: 'var(--po-panel)',
                  border: '1px solid var(--po-line)',
                  borderRadius: 'var(--po-r)',
                  padding: '24px 22px',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'var(--po-sage-wash)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 18,
                  }}
                >
                  <Icon name={s.icon} size={19} stroke="var(--po-sage)" />
                </div>
                <div
                  className="po-mono"
                  style={{
                    position: 'absolute',
                    top: 24,
                    right: 22,
                    fontSize: 13,
                    color: 'var(--po-text-3)',
                    fontWeight: 500,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3
                  className="po-display"
                  style={{ fontSize: 18, fontWeight: 600, color: 'var(--po-text)', margin: '0 0 10px' }}
                >
                  {s.title}
                </h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--po-text-2)', margin: 0 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <CtaBand />
      <SiteFooter />
    </div>
  )
}
