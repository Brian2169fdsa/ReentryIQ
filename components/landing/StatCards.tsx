import { Icon } from '@/components/ui/Icon'
import { TOTAL_RELEASES } from '@/lib/data'

const STATS = [
  { icon: 'users',  value: () => `${Math.round(TOTAL_RELEASES / 100) * 100}+`, label: 'Releases tracked' },
  { icon: 'mapPin', value: () => '10',     label: 'Counties covered' },
  { icon: 'refresh',value: () => 'Daily',  label: 'Data refresh' },
  { icon: 'clock',  value: () => '< 30d',  label: 'Release lead time' },
]

export function StatCards() {
  return (
    <div
      className="l-stats"
      style={{
        maxWidth: 1180,
        margin: '0 auto',
        padding: '36px 32px 0',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
      }}
    >
      {STATS.map(s => (
        <div
          key={s.label}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 13,
            background: 'var(--po-panel)',
            border: '1px solid var(--po-line)',
            borderRadius: 'var(--po-r)',
            padding: '16px 18px',
          }}
        >
          <span
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'var(--po-copper-wash)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon name={s.icon} size={18} stroke="var(--po-blue)" />
          </span>
          <div>
            <div
              className="po-display"
              style={{ fontSize: 24, fontWeight: 700, color: 'var(--po-text)', lineHeight: 1, letterSpacing: '-0.01em' }}
            >
              {s.value()}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--po-text-3)', marginTop: 4 }}>{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
