interface HorizonDay {
  count: number
}

interface HorizonBarsProps {
  days: HorizonDay[]
  todayIdx?: number
  height?: number
}

export function HorizonBars({ days, todayIdx = 14, height = 150 }: HorizonBarsProps) {
  const max = Math.max(...days.map(d => d.count), 1)
  const ticks = [0, 50, 100, 150]
  const months = ['Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026', 'Nov 2026']
  const todayPct = (todayIdx / days.length) * 100

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'relative', height, marginLeft: 30 }}>
        {/* Y-axis ticks */}
        {ticks.map(t => (
          <div
            key={t}
            style={{
              position: 'absolute',
              left: -30,
              right: 0,
              bottom: (t / 150) * height,
              borderTop: '1px solid var(--po-line)',
            }}
          >
            <span
              className="po-mono"
              style={{
                position: 'absolute',
                left: 0,
                top: -8,
                fontSize: 10,
                color: 'var(--po-text-3)',
              }}
            >
              {t}
            </span>
          </div>
        ))}

        {/* Today marker */}
        <div
          style={{
            position: 'absolute',
            top: -2,
            bottom: 0,
            left: todayPct + '%',
            width: 1,
            background: 'var(--po-text-3)',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: -16,
              left: -16,
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--po-text-2)',
              whiteSpace: 'nowrap',
            }}
          >
            Today
          </span>
        </div>

        {/* Bars */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: '100%' }}>
          {days.map((d, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: (d.count / max) * 100 + '%',
                minWidth: 0,
                background: i < todayIdx ? '#C7D9F2' : '#9CC0F0',
                borderRadius: '2px 2px 0 0',
              }}
            />
          ))}
        </div>
      </div>

      {/* Month labels */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginLeft: 30,
          marginTop: 8,
        }}
      >
        {months.map(m => (
          <span key={m} style={{ fontSize: 11, color: 'var(--po-text-3)' }}>
            {m}
          </span>
        ))}
      </div>
    </div>
  )
}
