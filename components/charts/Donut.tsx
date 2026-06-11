interface DonutSegment {
  label: string
  value: number
  color: string
  pct: string
}

interface DonutProps {
  segments: DonutSegment[]
  total: string
  size?: number
  stroke?: number
}

export function Donut({ segments, total, size = 168, stroke = 26 }: DonutProps) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const sum = segments.reduce((s, x) => s + x.value, 0) || 1
  let offset = 0

  const arcs = segments.map((seg, i) => {
    const frac = seg.value / sum
    const dash = frac * c
    const el = (
      <circle
        key={i}
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={seg.color}
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${c - dash}`}
        strokeDashoffset={-offset}
        strokeLinecap="butt"
      />
    )
    offset += dash
    return el
  })

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--po-track)"
          strokeWidth={stroke}
        />
        {arcs}
      </g>
      <text
        x="50%"
        y="47%"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontFamily: 'var(--font-montserrat, system-ui)',
          fontWeight: 700,
          fontSize: 30,
          fill: 'var(--po-text)',
        }}
      >
        {total}
      </text>
      <text
        x="50%"
        y="60%"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fontFamily: 'var(--font-inter, system-ui)', fontSize: 12, fill: 'var(--po-text-3)' }}
      >
        Total
      </text>
    </svg>
  )
}
