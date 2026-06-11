import { Donut } from '@/components/charts/Donut'
import { LineChart } from '@/components/charts/LineChart'
import { COUNTY_DATA, LINE_SERIES, LINE_LABELS } from '@/lib/data'

export function ProductPreview() {
  return (
    <section style={{ padding: '64px 0' }}>
      <div className="section-inner">
        <SectionHead
          eyebrow="The dashboard"
          title="Your whole pipeline, at a glance"
          sub="Every upcoming release, scored and mapped — the same view your team works from every morning."
        />
        <div
          className="l-pgrid"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 18 }}
        >
          {/* Donut: Releases by County */}
          <div
            style={{
              background: 'var(--po-panel)',
              border: '1px solid var(--po-line)',
              borderRadius: 'var(--po-r)',
              padding: '18px 20px',
            }}
          >
            <div style={{ marginBottom: 6 }}>
              <h3 className="po-display" style={{ fontSize: 15, fontWeight: 600, color: 'var(--po-text)', margin: 0 }}>
                Releases by County
              </h3>
              <div style={{ fontSize: 12.5, color: 'var(--po-text-3)', marginTop: 3 }}>Next 60 Days</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 6 }}>
              <Donut segments={COUNTY_DATA} total="612" size={150} stroke={24} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {COUNTY_DATA.map(s => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <i style={{ width: 9, height: 9, borderRadius: '50%', background: s.color, flexShrink: 0, display: 'inline-block' }} />
                    <span style={{ flex: 1, fontSize: 13, color: 'var(--po-text-2)' }}>{s.label}</span>
                    <span className="po-mono" style={{ fontSize: 13, color: 'var(--po-text)', fontWeight: 500 }}>{s.value}</span>
                    <span style={{ fontSize: 12, color: 'var(--po-text-3)', width: 34, textAlign: 'right' }}>({s.pct})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Line chart: Releases Over Time */}
          <div
            style={{
              background: 'var(--po-panel)',
              border: '1px solid var(--po-line)',
              borderRadius: 'var(--po-r)',
              padding: '18px 20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
              <h3 className="po-display" style={{ fontSize: 15, fontWeight: 600, color: 'var(--po-text)', margin: 0 }}>
                Releases Over Time
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {LINE_SERIES.map(s => (
                  <span key={s.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--po-text-2)' }}>
                    <i style={{ width: 9, height: 9, borderRadius: '50%', background: s.color, flexShrink: 0, display: 'inline-block' }} />
                    {s.label}
                  </span>
                ))}
              </div>
            </div>
            <LineChart series={LINE_SERIES} labels={LINE_LABELS} height={210} />
          </div>
        </div>
      </div>
    </section>
  )
}

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 30, maxWidth: 640 }}>
      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--po-blue)', marginBottom: 12 }}>
        {eyebrow}
      </div>
      <h2 className="po-display" style={{ fontSize: 32, lineHeight: 1.15, fontWeight: 700, color: 'var(--po-text)', margin: 0, letterSpacing: '-0.02em' }}>
        {title}
      </h2>
      {sub && <p style={{ fontSize: 15.5, lineHeight: 1.6, color: 'var(--po-text-2)', margin: '12px 0 0' }}>{sub}</p>}
    </div>
  )
}
