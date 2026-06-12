'use client'

import { useState } from 'react'

/* ── Shared primitives ─────────────────────────────────────────── */

export function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 130,
        background: 'var(--po-panel-2)',
        border: '1px solid var(--po-line)',
        borderRadius: 'var(--po-r-sm)',
        padding: '12px 14px',
      }}
    >
      <div className="po-label" style={{ fontSize: 10, marginBottom: 6 }}>{label}</div>
      <div className="po-display" style={{ fontSize: 22, fontWeight: 700, color: accent ?? 'var(--po-text)', lineHeight: 1.1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 11.5, color: 'var(--po-text-3)', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

export function TogglePills({ options, active, onChange }: { options: string[]; active: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {options.map(o => {
        const on = o === active
        return (
          <button
            key={o}
            onClick={() => onChange(o)}
            style={{
              padding: '7px 15px',
              borderRadius: 999,
              border: on ? '1px solid var(--po-navy)' : '1px solid var(--po-line-strong)',
              background: on ? 'var(--po-navy)' : 'var(--po-panel)',
              color: on ? '#fff' : 'var(--po-text-2)',
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.12s',
            }}
          >
            {o}
          </button>
        )
      })}
    </div>
  )
}

export function InsightBar({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        borderLeft: '3px solid var(--po-blue)',
        background: 'var(--po-blue-100)',
        borderRadius: '0 var(--po-r-sm) var(--po-r-sm) 0',
        padding: '10px 14px',
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--po-text)',
        lineHeight: 1.5,
      }}
    >
      {children}
    </div>
  )
}

function ScoreBadge({ score }: { score: number }) {
  const high = score >= 80
  const mid = score >= 60 && score < 80
  return (
    <span
      className="po-mono"
      style={{
        display: 'inline-block',
        padding: '2px 9px',
        borderRadius: 999,
        fontSize: 11.5,
        fontWeight: 600,
        background: high ? 'var(--po-sage-wash)' : mid ? 'var(--po-copper-wash)' : 'var(--po-track)',
        color: high ? 'var(--po-sage)' : mid ? 'var(--po-blue-700)' : 'var(--po-text-2)',
        border: `1px solid ${high ? 'var(--po-sage-line)' : mid ? 'var(--po-copper-line)' : 'var(--po-line)'}`,
      }}
    >
      {score}
    </span>
  )
}

/* Vertical bar chart with gridlines + value labels */
function Bars({ data, color, maxBars = 12 }: { data: { label: string; value: number }[]; color?: string; maxBars?: number }) {
  const shown = data.slice(0, maxBars)
  const max = Math.max(...shown.map(d => d.value), 1)
  const niceMax = Math.ceil(max / 4) * 4 || 4
  const ticks = [0, niceMax / 4, niceMax / 2, (3 * niceMax) / 4, niceMax]
  const H = 180

  return (
    <div style={{ position: 'relative', paddingLeft: 36 }}>
      <div style={{ position: 'relative', height: H }}>
        {ticks.map(t => (
          <div key={t} style={{ position: 'absolute', left: -36, right: 0, bottom: (t / niceMax) * H, borderTop: '1px solid var(--po-line)' }}>
            <span className="po-mono" style={{ position: 'absolute', left: 0, top: -7, fontSize: 10, color: 'var(--po-text-3)' }}>
              {Math.round(t)}
            </span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: '100%', position: 'relative' }}>
          {shown.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', minWidth: 0 }}>
              <span className="po-mono" style={{ fontSize: 10.5, color: 'var(--po-text-2)', marginBottom: 3 }}>{d.value}</span>
              <div
                style={{
                  width: '100%',
                  maxWidth: 56,
                  height: `${(d.value / niceMax) * 100}%`,
                  background: color ?? 'var(--po-blue)',
                  borderRadius: '4px 4px 0 0',
                  minHeight: d.value > 0 ? 3 : 0,
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 7 }}>
        {shown.map((d, i) => (
          <div key={i} style={{ flex: 1, fontSize: 10.5, color: 'var(--po-text-3)', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
            {d.label}
          </div>
        ))}
      </div>
    </div>
  )
}

/* Navy-header data table matching brand */
function Table({ cols, rows }: { cols: string[]; rows: React.ReactNode[][] }) {
  return (
    <div style={{ overflowX: 'auto', border: '1px solid var(--po-line)', borderRadius: 'var(--po-r-sm)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: 'var(--po-navy)' }}>
            {cols.map(c => (
              <th
                key={c}
                style={{
                  padding: '9px 13px',
                  textAlign: 'left',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ background: i % 2 ? 'var(--po-panel-2)' : 'var(--po-panel)' }}>
              {r.map((cell, j) => (
                <td key={j} style={{ padding: '8px 13px', color: 'var(--po-text)', whiteSpace: 'nowrap', borderTop: '1px solid var(--po-line)' }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* Donut for county shares */
function MiniDonut({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const size = 160, stroke = 26
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const sum = segments.reduce((s, x) => s + x.value, 0) || 1
  let offset = 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--po-track)" strokeWidth={stroke} />
          {segments.map((seg, i) => {
            const dash = (seg.value / sum) * c
            const el = (
              <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={seg.color} strokeWidth={stroke}
                strokeDasharray={`${dash} ${c - dash}`} strokeDashoffset={-offset} />
            )
            offset += dash
            return el
          })}
        </g>
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
          style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 26, fill: 'var(--po-text)' }}>
          {sum}
        </text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {segments.map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
            <i style={{ width: 9, height: 9, borderRadius: '50%', background: s.color, display: 'inline-block', flexShrink: 0 }} />
            <span style={{ color: 'var(--po-text-2)' }}>{s.label}</span>
            <span className="po-mono" style={{ color: 'var(--po-text)', fontWeight: 600 }}>{s.value}</span>
            <span style={{ color: 'var(--po-text-3)', fontSize: 11.5 }}>({Math.round((s.value / sum) * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const RAMP = ['#4A90E2', '#7FB0E8', '#2E8B6E', '#E0A33A', '#94A3B8', '#2E6CB8', '#A8C9F0', '#64748B', '#1B4178', '#CBD5E1']

/* ── Tool result shapes ────────────────────────────────────────── */

interface ReleaseRecord {
  id: number
  first_name: string
  last_name: string
  county: string
  facility: string
  release_date: string
  offense_class: string
  match_score: number
}

function fmtDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/* ── searchReleases dashboard ──────────────────────────────────── */

export function ReleasesDash({ result }: { result: { records: ReleaseRecord[]; count: number; source?: string } }) {
  const [view, setView] = useState('Table')
  const recs = result.records ?? []
  if (!recs.length) return <InsightBar>No matching releases found for this query.</InsightBar>

  const byCounty: Record<string, number> = {}
  for (const r of recs) byCounty[r.county] = (byCounty[r.county] ?? 0) + 1
  const countyTop = Object.entries(byCounty).sort((a, b) => b[1] - a[1])
  const avgScore = Math.round(recs.reduce((s, r) => s + r.match_score, 0) / recs.length)
  const high = recs.filter(r => r.match_score >= 80).length
  const window = `${fmtDate(recs[0].release_date)} – ${fmtDate(recs[recs.length - 1].release_date)}`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <StatCard label="Matches" value={String(recs.length)} sub={window} />
        <StatCard label="Top County" value={countyTop[0][0]} sub={`${countyTop[0][1]} releases`} />
        <StatCard label="High Propensity" value={String(high)} sub="Score ≥ 80" accent="var(--po-sage)" />
        <StatCard label="Avg Match Score" value={String(avgScore)} sub="All matches" accent="var(--po-blue)" />
      </div>

      <TogglePills options={['Table', 'By county', 'By score']} active={view} onChange={setView} />

      {view === 'Table' && (
        <Table
          cols={['Name', 'County', 'Facility', 'Release date', 'Class', 'Score']}
          rows={recs.slice(0, 10).map(r => [
            <b key="n">{r.first_name} {r.last_name}</b>,
            r.county,
            r.facility,
            fmtDate(r.release_date),
            r.offense_class,
            <ScoreBadge key="s" score={r.match_score} />,
          ])}
        />
      )}

      {view === 'By county' && (
        <Bars data={countyTop.map(([label, value]) => ({ label, value }))} />
      )}

      {view === 'By score' && (
        <Bars
          color="var(--po-sage)"
          data={[
            { label: '80–100', value: recs.filter(r => r.match_score >= 80).length },
            { label: '60–79', value: recs.filter(r => r.match_score >= 60 && r.match_score < 80).length },
            { label: '40–59', value: recs.filter(r => r.match_score < 60).length },
          ]}
        />
      )}

      <InsightBar>
        {countyTop[0][0]} leads with {countyTop[0][1]} of {recs.length} matches — {high} are high-propensity (score ≥ 80).
      </InsightBar>
    </div>
  )
}

/* ── getCountySummary dashboard ────────────────────────────────── */

export function CountySummaryDash({ result }: { result: { summary: { county: string; count: number }[]; total: number; source?: string } }) {
  const [view, setView] = useState('Bar chart')
  const summary = result.summary ?? []
  if (!summary.length) return <InsightBar>No releases found in this date range.</InsightBar>

  const top = summary[0]
  const topPct = Math.round((top.count / result.total) * 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <StatCard label="Total Releases" value={String(result.total)} sub={`${summary.length} counties`} />
        <StatCard label="Top County" value={top.county} sub={`${top.count} releases`} accent="var(--po-blue)" />
        <StatCard label="Top County Share" value={`${topPct}%`} sub="Of all releases" />
      </div>

      <TogglePills options={['Bar chart', 'Donut', 'Table']} active={view} onChange={setView} />

      {view === 'Bar chart' && <Bars data={summary.map(s => ({ label: s.county, value: s.count }))} maxBars={10} />}

      {view === 'Donut' && (
        <MiniDonut
          segments={summary.slice(0, 5).map((s, i) => ({ label: s.county, value: s.count, color: RAMP[i] })).concat(
            summary.length > 5
              ? [{ label: 'Other', value: summary.slice(5).reduce((a, s) => a + s.count, 0), color: RAMP[5] }]
              : [],
          )}
        />
      )}

      {view === 'Table' && (
        <Table
          cols={['Rank', 'County', 'Releases', 'Share']}
          rows={summary.map((s, i) => [
            <span key="r" className="po-mono">{i + 1}</span>,
            <b key="c">{s.county}</b>,
            <span key="n" className="po-mono">{s.count}</span>,
            `${Math.round((s.count / result.total) * 100)}%`,
          ])}
        />
      )}

      <InsightBar>
        {top.county} accounts for {topPct}% of upcoming releases — {top.count} of {result.total} statewide.
      </InsightBar>
    </div>
  )
}

/* ── getDailyVolume dashboard ──────────────────────────────────── */

export function DailyVolumeDash({ result }: { result: { daily: { date: string; count: number }[]; total: number; source?: string } }) {
  const [view, setView] = useState('Chart')
  const daily = result.daily ?? []
  if (!daily.length) return <InsightBar>No releases found in this date range.</InsightBar>

  // Group by week if span is long, so the chart stays readable
  const byWeek: { label: string; value: number }[] = []
  if (daily.length > 21) {
    const weeks: Record<string, number> = {}
    for (const d of daily) {
      const dt = new Date(d.date + 'T00:00:00')
      const monday = new Date(dt)
      monday.setDate(dt.getDate() - ((dt.getDay() + 6) % 7))
      const key = monday.toISOString().slice(0, 10)
      weeks[key] = (weeks[key] ?? 0) + d.count
    }
    for (const [k, v] of Object.entries(weeks).sort()) {
      const dt = new Date(k + 'T00:00:00')
      byWeek.push({ label: dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: v })
    }
  }
  const chartData = byWeek.length
    ? byWeek
    : daily.map(d => ({ label: fmtDate(d.date).replace(/, \d{4}$/, ''), value: d.count }))

  const peak = chartData.reduce((m, d) => (d.value > m.value ? d : m), chartData[0])
  const avg = Math.round((result.total / chartData.length) * 10) / 10
  const unit = byWeek.length ? 'week' : 'day'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <StatCard label="Total Releases" value={String(result.total)} sub={`${daily.length} days with releases`} />
        <StatCard label={`Peak ${unit}`} value={String(peak.value)} sub={peak.label} accent="var(--po-blue)" />
        <StatCard label={`Avg / ${unit}`} value={String(avg)} sub="Across the range" />
      </div>

      <TogglePills options={['Chart', 'Table']} active={view} onChange={setView} />

      {view === 'Chart' && <Bars data={chartData} maxBars={14} />}

      {view === 'Table' && (
        <Table
          cols={[byWeek.length ? 'Week of' : 'Date', 'Releases']}
          rows={chartData.map(d => [d.label, <span key="n" className="po-mono">{d.value}</span>])}
        />
      )}

      <InsightBar>
        Peak {unit} is {peak.label} with {peak.value} releases — averaging {avg} per {unit} over the range.
      </InsightBar>
    </div>
  )
}
