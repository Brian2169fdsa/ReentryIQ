import { Icon } from '@/components/ui/Icon'

export function Compliance() {
  return (
    <section style={{ paddingBottom: 64 }}>
      <div className="section-inner">
        <div
          style={{
            display: 'flex',
            gap: 20,
            alignItems: 'flex-start',
            background: 'var(--po-blue-100)',
            border: '1px solid var(--po-copper-line)',
            borderRadius: 'var(--po-r)',
            padding: '28px 30px',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              flexShrink: 0,
              borderRadius: 12,
              background: 'var(--po-panel)',
              border: '1px solid var(--po-copper-line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="shield" size={24} stroke="var(--po-blue)" />
          </div>
          <div>
            <h3
              className="po-display"
              style={{ fontSize: 18, color: 'var(--po-text)', margin: '0 0 8px' }}
            >
              Sourced from public records. Used for good.
            </h3>
            <p style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--po-text-2)', margin: 0, maxWidth: 820 }}>
              Every record is drawn from public Arizona Department of Corrections data and refreshed daily; release dates
              can change at the agency&apos;s discretion. ReentryIQ is for outreach, admissions, and program planning
              only —{' '}
              <b style={{ color: 'var(--po-text)' }}>
                never for employment, tenant, credit, or insurance screening
              </b>{' '}
              or any other FCRA-covered purpose. Every account attests to permitted use at signup.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
