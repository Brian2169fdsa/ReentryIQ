'use client'

import { useMemo } from 'react'
import { Icon } from '@/components/ui/Icon'
import { LineChart } from '@/components/charts/LineChart'
import { Donut } from '@/components/charts/Donut'
import { COUNTY_COLORS } from '@/lib/data'
import type { Release } from '@/lib/data-source'
import { type Filters, SAVED_SEARCHES, applyFilters } from './types'

const RAMP = ['var(--po-ramp-1)', 'var(--po-ramp-2)', 'var(--po-ramp-3)', 'var(--po-ramp-4)', 'var(--po-ramp-5)']

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div className="card" style={{ background: 'var(--po-panel)', padding: '18px 20px', ...style }}>{children}</div>
}

function Delta({ up, text, good }: { up: boolean; text: string; good: boolean }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: good ? 'var(--po-sage)' : 'var(--po-danger)' }}>
      <span aria-hidden style={{ fontSize: 11 }}>{up ? '↑' : '↓'}</span>{text}
    </span>
  )
}

export function DashboardHome({ rows, onGoSearch, onRunSaved }: {
  rows: Release[]
  onGoSearch: (patch?: Partial<Filters>) => void
  onRunSaved: (f: Filters) => void
}) {
  const stats = useMemo(() => {
    const next60 = rows.filter(r => r.days_out >= 0 && r.days_out < 60)
    const maricopa60 = next60.filter(r => r.county === 'Maricopa')
    const avgScore = next60.length ? Math.round(next60.reduce((s, r) => s + r.score, 0) / next60.length) : 0
    const avgDays = rows.length ? Math.round(rows.reduce((s, r) => s + Math.max(0, r.days_out), 0) / rows.length) : 0
    const withDates = rows.length ? Math.round((rows.filter(r => !!r.release_date).length / rows.length) * 100) : 0
    const highMaricopa = next60.filter(r => r.county === 'Maricopa' && r.score >= 70).length
    return { next60: next60.length, maricopa60: maricopa60.length, avgScore, avgDays, withDates, highMaricopa }
  }, [rows])

  // 180-day horizon density
  const horizon = useMemo(() => {
    const days = Array.from({ length: 180 }, () => 0)
    for (const r of rows) if (r.days_out >= 0 && r.days_out < 180) days[r.days_out]++
    return days
  }, [rows])
  const maxDay = Math.max(...horizon, 1)
  const months = useMemo(() => {
    const out: string[] = []
    for (let i = 0; i < 6; i++) {
      const d = new Date()
      d.setMonth(d.getMonth() + i)
      out.push(d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }))
    }
    return out
  }, [])

  // Releases over time: monthly counts per top-4 county + Other
  const { series, labels } = useMemo(() => {
    const countyTotals: Record<string, number> = {}
    for (const r of rows) countyTotals[r.county] = (countyTotals[r.county] ?? 0) + 1
    const top = Object.entries(countyTotals).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([c]) => c)
    const nMonths = 6
    const buckets: Record<string, number[]> = {}
    for (const c of [...top, 'Other']) buckets[c] = Array.from({ length: nMonths }, () => 0)
    for (const r of rows) {
      const m = Math.min(nMonths - 1, Math.max(0, Math.floor(r.days_out / 30)))
      const key = top.includes(r.county) ? r.county : 'Other'
      buckets[key][m]++
    }
    return {
      labels: Array.from({ length: nMonths }, (_, i) => {
        const d = new Date()
        d.setMonth(d.getMonth() + i)
        return d.toLocaleDateString('en-US', { month: 'short' })
      }),
      series: [...top, 'Other'].map(c => ({
        label: c,
        color: COUNTY_COLORS[c] ?? COUNTY_COLORS.Other,
        points: buckets[c],
      })),
    }
  }, [rows])

  const donutData = useMemo(() => {
    const next60 = rows.filter(r => r.days_out >= 0 && r.days_out < 60)
    const counts: Record<string, number> = {}
    for (const r of next60) counts[r.county] = (counts[r.county] ?? 0) + 1
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
    const top = sorted.slice(0, 4)
    const other = sorted.slice(4).reduce((s, [, n]) => s + n, 0)
    const total = next60.length || 1
    const segs = top.map(([label, value]) => ({ label, value, color: COUNTY_COLORS[label] ?? COUNTY_COLORS.Other, pct: `${Math.round((value / total) * 100)}%` }))
    if (other > 0) segs.push({ label: 'Other', value: other, color: COUNTY_COLORS.Other, pct: `${Math.round((other / total) * 100)}%` })
    return { segs, total: next60.length }
  }, [rows])

  const today = new Date()
  const end = new Date(today.getTime() + 180 * 86400000)
  const rangeLabel = `${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Title row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
        <div>
          <h1 className="po-display" style={{ fontSize: 26, fontWeight: 700, color: 'var(--po-text)', margin: 0 }}>Dashboard</h1>
          <p style={{ fontSize: 13.5, color: 'var(--po-text-2)', margin: '4px 0 0' }}>Real-time insights into upcoming releases and opportunities to help.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 38, padding: '0 14px', borderRadius: 'var(--po-r)', border: '1px solid var(--po-line-strong)', background: 'var(--po-panel)', fontSize: 13, color: 'var(--po-text)' }}>
            {rangeLabel} <Icon name="chevronDown" size={14} stroke="var(--po-text-3)" />
          </span>
          <button onClick={() => onGoSearch()} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 38, padding: '0 14px', borderRadius: 'var(--po-r)', border: '1px solid var(--po-line-strong)', background: 'var(--po-panel)', fontSize: 13, fontWeight: 600, color: 'var(--po-text)', cursor: 'pointer', fontFamily: 'inherit' }}>
            <Icon name="layers" size={15} stroke="var(--po-text-2)" /> Filters
          </button>
        </div>
      </div>

      {/* Release Horizon */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 9 }}>
            <h2 className="po-display" style={{ fontSize: 16, fontWeight: 600, color: 'var(--po-text)', margin: 0 }}>Release Horizon</h2>
            <span style={{ fontSize: 12, color: 'var(--po-text-3)' }}>Next 180 Days</span>
          </div>
          <div style={{ display: 'flex', gap: 26 }}>
            <div style={{ textAlign: 'right' }}>
              <div className="po-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--po-text)', lineHeight: 1 }}>{rows.length.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: 'var(--po-text-3)', marginTop: 3 }}>People Tracked</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="po-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--po-sage)', lineHeight: 1 }}>{stats.withDates}%</div>
              <div style={{ fontSize: 11, color: 'var(--po-text-3)', marginTop: 3 }}>With Release Dates</div>
            </div>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', top: -4, left: 0, fontSize: 11, fontWeight: 600, color: 'var(--po-text-2)' }}>Today</span>
          <div style={{ position: 'absolute', top: 12, bottom: 22, left: 0, width: 1, background: 'var(--po-text-3)' }} />
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 110, paddingTop: 14 }}>
            {horizon.map((c, i) => (
              <div key={i} title={`+${i}d: ${c}`} style={{ flex: 1, minWidth: 0, height: `${(c / maxDay) * 100}%`, minHeight: c > 0 ? 2 : 0, background: RAMP[Math.min(4, Math.floor((c / maxDay) * 5))], borderRadius: '1px 1px 0 0' }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 7 }}>
            {months.map(m => <span key={m} style={{ fontSize: 11, color: 'var(--po-text-3)' }}>{m}</span>)}
          </div>
        </div>
      </Card>

      {/* KPI row */}
      <div className="dash-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Upcoming Releases', sub: 'Next 60 Days', value: String(stats.next60), icon: 'users', delta: <Delta up good text="18% vs prior 60 days" /> },
          { label: 'Average Release Score', sub: '(Outreach Likelihood)', value: String(stats.avgScore), icon: 'target', delta: <Delta up good text="8 pts vs prior 60 days" /> },
          { label: 'Maricopa County', sub: 'Next 60 Days', value: String(stats.maricopa60), icon: 'mapPin', delta: <span style={{ fontSize: 12, color: 'var(--po-text-2)' }}>{stats.next60 ? Math.round((stats.maricopa60 / stats.next60) * 100) : 0}% of upcoming releases</span> },
          { label: 'Avg. Days Until Release', sub: '(All Active)', value: String(stats.avgDays), icon: 'clock', delta: <Delta up={false} good={false} text="6 days vs prior 60 days" /> },
        ].map(k => (
          <Card key={k.label} style={{ padding: '15px 17px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--po-text)' }}>{k.label}</div>
                <div style={{ fontSize: 11, color: 'var(--po-text-3)', marginTop: 1 }}>{k.sub}</div>
              </div>
              <span style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--po-blue-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={k.icon} size={16} stroke="var(--po-blue-700)" />
              </span>
            </div>
            <div className="po-display" style={{ fontSize: 30, fontWeight: 700, color: 'var(--po-text)', margin: '8px 0 6px', lineHeight: 1 }}>{k.value}</div>
            {k.delta}
          </Card>
        ))}
      </div>

      {/* Insight band */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', background: 'var(--po-blue-100)', border: '1px solid var(--po-copper-line)', borderRadius: 'var(--po-r)', padding: '14px 18px' }}>
        <span style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--po-panel)', border: '1px solid var(--po-copper-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name="sparkles" size={16} stroke="var(--po-blue)" />
        </span>
        <div style={{ flex: 1, minWidth: 220, fontSize: 13.5, lineHeight: 1.5, color: 'var(--po-text)' }}>
          <b style={{ color: 'var(--po-blue-700)' }}>{stats.highMaricopa} high-propensity individuals</b> are releasing from Maricopa County in the next 60 days.
          <span style={{ display: 'block', fontSize: 12.5, color: 'var(--po-text-2)' }}>That&apos;s 18% more opportunities than the previous 60 days.</span>
        </div>
        <button
          onClick={() => onGoSearch({ counties: ['Maricopa'], range: { start: 0, end: 59 }, minScore: 70 })}
          style={{ height: 38, padding: '0 18px', borderRadius: 'var(--po-r)', border: 'none', background: 'var(--po-blue)', color: 'var(--po-accent-fg)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          View Matches
        </button>
      </div>

      {/* Two-up: line chart + donut */}
      <div className="l-pgrid" style={{ display: 'grid', gridTemplateColumns: '1.45fr 1fr', gap: 16 }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
            <h2 className="po-display" style={{ fontSize: 16, fontWeight: 600, color: 'var(--po-text)', margin: 0 }}>Releases Over Time</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--po-text-3)' }}>
              Group by
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 30, padding: '0 11px', borderRadius: 'var(--po-r-sm)', border: '1px solid var(--po-line-strong)', color: 'var(--po-text)', fontWeight: 600 }}>
                County <Icon name="chevronDown" size={13} stroke="var(--po-text-3)" />
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 6 }}>
            {series.map(s => (
              <span key={s.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--po-text-2)' }}>
                <i style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, display: 'inline-block' }} />{s.label}
              </span>
            ))}
          </div>
          <LineChart series={series} labels={labels} height={200} yMax={Math.max(50, Math.ceil(Math.max(...series.flatMap(s => s.points)) / 50) * 50)} />
        </Card>

        <Card>
          <div style={{ marginBottom: 6 }}>
            <h2 className="po-display" style={{ fontSize: 16, fontWeight: 600, color: 'var(--po-text)', margin: 0 }}>Releases by County</h2>
            <span style={{ fontSize: 12, color: 'var(--po-text-3)' }}>Next 60 Days</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Donut segments={donutData.segs} total={String(donutData.total)} size={148} stroke={24} />
            <div style={{ flex: 1, minWidth: 140, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {donutData.segs.map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
                  <i style={{ width: 9, height: 9, borderRadius: '50%', background: s.color, display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ flex: 1, color: 'var(--po-text-2)' }}>{s.label}</span>
                  <span className="po-mono" style={{ fontWeight: 600, color: 'var(--po-text)' }}>{s.value}</span>
                  <span style={{ color: 'var(--po-text-3)', fontSize: 11.5 }}>({s.pct})</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => onGoSearch({ range: { start: 0, end: 59 } })} style={{ width: '100%', marginTop: 12, height: 36, borderRadius: 'var(--po-r-sm)', border: '1px solid var(--po-line-strong)', background: 'var(--po-panel)', color: 'var(--po-text)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            View Full Report
          </button>
        </Card>
      </div>

      {/* Saved searches + alerts */}
      <div className="l-pgrid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <h2 className="po-display" style={{ fontSize: 16, fontWeight: 600, color: 'var(--po-text)', margin: '0 0 12px' }}>Saved Searches</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {SAVED_SEARCHES.slice(0, 3).map(s => (
              <button key={s.id} onClick={() => onRunSaved(s.filters)} style={{ textAlign: 'left', border: '1px solid var(--po-line)', borderRadius: 'var(--po-r-sm)', background: 'var(--po-panel)', padding: '11px 13px', cursor: 'pointer', fontFamily: 'inherit' }}>
                <span className="po-mono" style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--po-sage)', background: 'var(--po-sage-wash)', border: '1px solid var(--po-sage-line)', borderRadius: 4, padding: '2px 6px' }}>LIVE</span>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--po-text)', margin: '7px 0 3px' }}>{s.name}</div>
                <div className="po-mono" style={{ fontSize: 11.5, color: 'var(--po-text-3)' }}>{applyFilters(rows, s.filters).length} matches</div>
              </button>
            ))}
            <button onClick={() => onGoSearch()} style={{ border: '1px dashed var(--po-line-strong)', borderRadius: 'var(--po-r-sm)', background: 'transparent', color: 'var(--po-text-3)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 84 }}>
              <Icon name="plus" size={16} stroke="var(--po-text-3)" /> New Search
            </button>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 className="po-display" style={{ fontSize: 16, fontWeight: 600, color: 'var(--po-text)', margin: 0 }}>Recent Alerts</h2>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--po-blue-700)' }}>View All Alerts</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { title: 'New matches for Maricopa County, Next 60 Days', sub: '23 new matches', t: '2m ago', tone: 'var(--po-blue)' },
              { title: 'High Score (70+), Next 90 Days', sub: '15 new matches', t: '1h ago', tone: 'var(--po-sage)' },
            ].map(a => (
              <div key={a.title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ width: 32, height: 32, borderRadius: '50%', background: a.tone, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="bell" size={15} stroke="var(--po-accent-fg)" />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--po-text)', lineHeight: 1.4 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--po-text-3)', marginTop: 2 }}>{a.sub}</div>
                </div>
                <span style={{ fontSize: 11.5, color: 'var(--po-text-3)', flexShrink: 0 }}>{a.t}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', padding: '6px 2px 4px', fontSize: 12, color: 'var(--po-text-3)' }}>
        <span>© 2026 ReentryIQ. All rights reserved.</span>
        <span style={{ display: 'flex', gap: 16 }}>
          <a href="/privacy" style={{ color: 'var(--po-text-2)', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="/terms" style={{ color: 'var(--po-text-2)', textDecoration: 'none' }}>Terms of Service</a>
          <a href="/acceptable-use" style={{ color: 'var(--po-text-2)', textDecoration: 'none' }}>Acceptable Use</a>
        </span>
        <span>Public Data · Privacy First · Second Chances</span>
      </div>
    </div>
  )
}
