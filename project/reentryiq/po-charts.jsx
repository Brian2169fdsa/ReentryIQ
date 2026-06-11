// po-charts.jsx — lightweight SVG charts for the ReentryIQ overview dashboard.
const { useMemo: poCUseMemo } = React;

// ---- Donut ----
function Donut({ segments, total, size = 168, stroke = 26 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  const sum = segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--po-track)" strokeWidth={stroke} />
        {segments.map((seg, i) => {
          const frac = seg.value / sum;
          const dash = frac * c;
          const el = (
            <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={seg.color} strokeWidth={stroke}
              strokeDasharray={`${dash} ${c - dash}`} strokeDashoffset={-offset} strokeLinecap="butt" />
          );
          offset += dash;
          return el;
        })}
      </g>
      <text x="50%" y="47%" textAnchor="middle" dominantBaseline="middle"
        style={{ fontFamily: 'var(--po-display)', fontWeight: 700, fontSize: 30, fill: 'var(--po-text)' }}>{total}</text>
      <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle"
        style={{ fontFamily: 'var(--po-body)', fontSize: 12, fill: 'var(--po-text-3)' }}>Total</text>
    </svg>
  );
}

// ---- Multi-line chart ----
function LineChart({ series, labels, width = 520, height = 230, yMax = 150 }) {
  const padL = 34, padB = 28, padT = 12, padR = 8;
  const w = width - padL - padR, h = height - padT - padB;
  const n = series[0].points.length;
  const x = (i) => padL + (i / (n - 1)) * w;
  const y = (v) => padT + h - (v / yMax) * h;
  const ticks = [0, 50, 100, 150];
  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      {ticks.map(t => (
        <g key={t}>
          <line x1={padL} y1={y(t)} x2={width - padR} y2={y(t)} stroke="var(--po-line)" strokeWidth="1" />
          <text x={padL - 8} y={y(t) + 4} textAnchor="end" style={{ fontFamily: 'var(--po-mono)', fontSize: 10, fill: 'var(--po-text-3)' }}>{t}</text>
        </g>
      ))}
      {series.map((s, si) => {
        const d = s.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(p).toFixed(1)}`).join(' ');
        return (
          <g key={si}>
            <path d={d} fill="none" stroke={s.color} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
            {s.points.map((p, i) => <circle key={i} cx={x(i)} cy={y(p)} r="2.6" fill="var(--po-panel)" stroke={s.color} strokeWidth="1.6" />)}
          </g>
        );
      })}
      {labels.map((lab, i) => (
        <text key={i} x={x(i * Math.round((n - 1) / (labels.length - 1)))} y={height - 8} textAnchor="middle"
          style={{ fontFamily: 'var(--po-body)', fontSize: 11, fill: 'var(--po-text-3)' }}>{lab}</text>
      ))}
    </svg>
  );
}

// ---- Release Horizon bars (single soft-blue, Today marker) ----
function HorizonBars({ days, todayIdx = 12, height = 150 }) {
  const max = Math.max(...days.map(d => d.count), 1);
  const ticks = [0, 50, 100, 150];
  const months = ['Jun 2025', 'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025'];
  const todayPct = (todayIdx / days.length) * 100;
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'relative', height, marginLeft: 30 }}>
        {ticks.map(t => (
          <div key={t} style={{ position: 'absolute', left: -30, right: 0, bottom: (t / 150) * height, borderTop: '1px solid var(--po-line)' }}>
            <span style={{ position: 'absolute', left: 0, top: -8, fontFamily: 'var(--po-mono)', fontSize: 10, color: 'var(--po-text-3)' }}>{t}</span>
          </div>
        ))}
        {/* Today marker */}
        <div style={{ position: 'absolute', top: -2, bottom: 0, left: todayPct + '%', width: 1, background: 'var(--po-text-3)' }}>
          <span style={{ position: 'absolute', top: -16, left: -16, fontSize: 11, fontWeight: 600, color: 'var(--po-text-2)' }}>Today</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: '100%' }}>
          {days.map((d, i) => (
            <div key={i} style={{ flex: 1, height: (d.count / max) * 100 + '%', minWidth: 0,
              background: i < todayIdx ? '#C7D9F2' : '#9CC0F0', borderRadius: '2px 2px 0 0' }}></div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: 30, marginTop: 8 }}>
        {months.map(m => <span key={m} style={{ fontSize: 11, color: 'var(--po-text-3)' }}>{m}</span>)}
      </div>
    </div>
  );
}

Object.assign(window, { Donut, LineChart, HorizonBars });
