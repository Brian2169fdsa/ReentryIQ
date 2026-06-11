interface LineSeries {
  label: string
  color: string
  points: number[]
}

interface LineChartProps {
  series: LineSeries[]
  labels: string[]
  width?: number
  height?: number
  yMax?: number
}

export function LineChart({ series, labels, width = 520, height = 230, yMax = 150 }: LineChartProps) {
  const padL = 34, padB = 28, padT = 12, padR = 8
  const w = width - padL - padR
  const h = height - padT - padB
  const n = series[0]?.points.length ?? 1
  const x = (i: number) => padL + (i / (n - 1)) * w
  const y = (v: number) => padT + h - (v / yMax) * h
  const ticks = [0, 50, 100, 150]

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      {ticks.map(t => (
        <g key={t}>
          <line x1={padL} y1={y(t)} x2={width - padR} y2={y(t)} stroke="var(--po-line)" strokeWidth="1" />
          <text
            x={padL - 8}
            y={y(t) + 4}
            textAnchor="end"
            style={{ fontFamily: 'var(--font-ibm-plex-mono, monospace)', fontSize: 10, fill: 'var(--po-text-3)' }}
          >
            {t}
          </text>
        </g>
      ))}
      {series.map((s, si) => {
        const d = s.points
          .map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(p).toFixed(1)}`)
          .join(' ')
        return (
          <g key={si}>
            <path d={d} fill="none" stroke={s.color} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
            {s.points.map((p, i) => (
              <circle key={i} cx={x(i)} cy={y(p)} r="2.6" fill="var(--po-panel)" stroke={s.color} strokeWidth="1.6" />
            ))}
          </g>
        )
      })}
      {labels.map((lab, i) => (
        <text
          key={i}
          x={x(i * Math.round((n - 1) / (labels.length - 1)))}
          y={height - 8}
          textAnchor="middle"
          style={{ fontFamily: 'var(--font-inter, system-ui)', fontSize: 11, fill: 'var(--po-text-3)' }}
        >
          {lab}
        </text>
      ))}
    </svg>
  )
}
