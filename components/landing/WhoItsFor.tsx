import { Icon } from '@/components/ui/Icon'

const SEGMENTS = [
  {
    icon: 'building',
    title: 'Treatment centers',
    body: 'Fill beds with release-date outreach. One admission pays for the year.',
  },
  {
    icon: 'users',
    title: 'Reentry programs',
    body: 'Reach people before release and report grant-ready outcomes.',
  },
  {
    icon: 'layers',
    title: 'Sober livings',
    body: 'Plan capacity around who is actually coming home, and when.',
  },
]

export function WhoItsFor() {
  return (
    <section style={{ padding: '64px 0' }}>
      <div className="section-inner">
        <SectionHead eyebrow="Who it's for" title="Built for programs that reach people at release" />
        <div className="l-cards3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {SEGMENTS.map(s => (
            <div
              key={s.title}
              className="card"
              style={{ padding: '24px 22px', transition: 'border-color 0.15s' }}
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
