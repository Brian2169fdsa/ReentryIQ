import { Icon } from '@/components/ui/Icon'

const STEPS = [
  {
    icon: 'compass',
    title: 'Search',
    body: 'Filter upcoming releases by date window, county, facility, offense class, or match score — the whole state in one view.',
  },
  {
    icon: 'bell',
    title: 'Alert',
    body: 'Save a search and we watch the gate. Release-date alerts hit your inbox or a signed webhook the moment a match appears.',
  },
  {
    icon: 'plug',
    title: 'Connect',
    body: 'Push matched records straight into Salesforce, KIPU, or Sunwave — or anywhere, via webhook. Your pipeline, automatically.',
  },
]

export function HowItWorks() {
  return (
    <section
      style={{
        padding: '64px 0',
        background: 'var(--po-panel)',
        borderTop: '1px solid var(--po-line)',
        borderBottom: '1px solid var(--po-line)',
      }}
    >
      <div className="section-inner">
        <SectionHead eyebrow="How it works" title="Three steps from public record to your pipeline" />
        <div className="l-cards3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className="card"
              style={{ padding: '24px 22px', position: 'relative', transition: 'border-color 0.15s' }}
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
                <Icon name={s.icon} size={19} stroke="var(--po-blue)" />
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: 24,
                  right: 22,
                  fontFamily: 'var(--font-ibm-plex-mono, monospace)',
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
    </section>
  )
}

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div style={{ marginBottom: 30, maxWidth: 640 }}>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--po-blue)',
          marginBottom: 12,
        }}
      >
        {eyebrow}
      </div>
      <h2
        className="po-display"
        style={{ fontSize: 32, lineHeight: 1.15, fontWeight: 700, color: 'var(--po-text)', margin: 0, letterSpacing: '-0.02em' }}
      >
        {title}
      </h2>
    </div>
  )
}
