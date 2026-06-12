'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Release } from '@/lib/data-source'
import { Icon } from '@/components/ui/Icon'
import {
  type Filters,
  type ViewMode,
  type VisualMetric,
  HORIZON_DAYS,
  USAGE,
  fmtDate,
  rampFor,
  scoreTier,
} from './types'
import { usageColor } from './Shell'

const VIEW_KEY = 'reentryiq.viewMode'

/* ── Score badge for the table ─────────────────────────────────────── */
function ScoreBadge({ score }: { score: number }) {
  const tier = scoreTier(score)
  return (
    <span
      className="po-mono"
      style={{
        display: 'inline-block', padding: '2px 9px', borderRadius: 999, fontSize: 11.5, fontWeight: 600,
        background: tier.bg, color: tier.color, border: `1px solid ${tier.border}`,
      }}
    >
      {score}
    </span>
  )
}

/* ── Release Horizon (180-day density strip, filtered rows) ────────── */
function ReleaseHorizon({ rows }: { rows: Release[] }) {
  const { counts, max, total } = useMemo(() => {
    const c = Array.from({ length: HORIZON_DAYS }, () => 0)
    let t = 0
    for (const r of rows) {
      if (r.days_out >= 0 && r.days_out < HORIZON_DAYS) {
        c[r.days_out]++
        t++
      }
    }
    return { counts: c, max: Math.max(1, ...c), total: t }
  }, [rows])

  return (
    <section className="card" style={{ padding: '18px 20px', marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 14 }}>
        <div>
          <div className="po-label" style={{ marginBottom: 5 }}>Release Horizon</div>
          <span style={{ fontSize: 13, color: 'var(--po-text-2)' }}>Next 180 days · filtered</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="po-mono po-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--po-text)', lineHeight: 1 }}>
            {total.toLocaleString()}
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--po-text-3)', marginTop: 4 }}>in window</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 96 }}>
        {counts.map((c, i) => (
          <div
            key={i}
            title={c > 0 ? `Day ${i + 1}: ${c} release${c === 1 ? '' : 's'}` : undefined}
            style={{
              flex: 1, minWidth: 0,
              height: c > 0 ? `${Math.max(6, (c / max) * 100)}%` : '3px',
              background: c > 0 ? rampFor(c, max) : 'var(--po-track)',
              borderRadius: '1px 1px 0 0',
            }}
          />
        ))}
      </div>
    </section>
  )
}

/* ── KPI row ────────────────────────────────────────────────────────── */
function KpiCard({
  label,
  children,
  icon,
  onClick,
}: {
  label: string
  children: React.ReactNode
  icon: string
  onClick?: () => void
}) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      onClick={onClick}
      className={onClick ? 'card po-hov-card po-hov-lift' : 'card'}
      style={{
        padding: '16px 18px', textAlign: 'left', width: '100%', display: 'block',
        fontFamily: 'inherit', cursor: onClick ? 'pointer' : 'default',
        background: 'var(--po-panel)', border: '1px solid var(--po-line)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <span className="po-label">{label}</span>
        <span style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--po-copper-wash)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name={icon} size={16} stroke="var(--po-blue)" />
        </span>
      </div>
      {children}
    </Tag>
  )
}

function KpiRow({ rows, onOpenTop }: { rows: Release[]; onOpenTop: (r: Release) => void }) {
  const scored = rows.filter(r => r.score >= 50).length
  const pending = rows.length - scored
  const top = useMemo(() => {
    if (!rows.length) return null
    return rows.reduce((best, r) => (r.score > best.score ? r : best), rows[0])
  }, [rows])

  const pct = Math.min(1, USAGE.used / USAGE.included)

  return (
    <div className="dash-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
      <KpiCard label="Records in Scope" icon="layers">
        <div className="po-display" style={{ fontSize: 30, fontWeight: 700, color: 'var(--po-text)', lineHeight: 1 }}>
          {rows.length.toLocaleString()}
        </div>
        <div style={{ fontSize: 12, color: 'var(--po-text-3)', marginTop: 6 }}>matching active filters</div>
      </KpiCard>

      <KpiCard label="Scored / Pending" icon="target">
        <div className="po-display po-mono" style={{ fontSize: 30, fontWeight: 700, color: 'var(--po-text)', lineHeight: 1 }}>
          {scored.toLocaleString()} / {pending.toLocaleString()}
        </div>
        <div style={{ fontSize: 12, color: 'var(--po-text-3)', marginTop: 6 }}>scored vs awaiting review</div>
      </KpiCard>

      <KpiCard label="Top Match Score" icon="dashboard" onClick={top ? () => onOpenTop(top) : undefined}>
        <div className="po-display" style={{ fontSize: 30, fontWeight: 700, color: 'var(--po-blue-700)', lineHeight: 1 }}>
          {top ? top.score : '—'}
        </div>
        <div style={{ fontSize: 12, color: 'var(--po-text-3)', marginTop: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {top ? top.name : 'No matches'}
        </div>
      </KpiCard>

      <KpiCard label="Usage" icon="gauge">
        <div className="po-display po-mono" style={{ fontSize: 26, fontWeight: 700, color: 'var(--po-text)', lineHeight: 1 }}>
          {USAGE.used.toLocaleString()} <span style={{ fontSize: 15, color: 'var(--po-text-3)', fontWeight: 500 }}>/ {USAGE.included.toLocaleString()}</span>
        </div>
        <div style={{ height: 5, borderRadius: 3, background: 'var(--po-track)', overflow: 'hidden', margin: '10px 0 6px' }}>
          <div style={{ width: `${pct * 100}%`, height: '100%', background: usageColor(pct), borderRadius: 3 }} />
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--po-text-3)' }}>Resets Jul 1</div>
      </KpiCard>
    </div>
  )
}

/* ── Visual view: metric pills + horizontal bar chart + insight ────── */
interface BarGroup {
  key: string
  label: string
  value: number
}

function buildGroups(rows: Release[], metric: VisualMetric): BarGroup[] {
  if (metric === 'next30') {
    // Releases within the next 30 days, grouped by facility.
    const inWindow = rows.filter(r => r.days_out >= 0 && r.days_out < 30)
    const m: Record<string, number> = {}
    for (const r of inWindow) m[r.facility] = (m[r.facility] ?? 0) + 1
    return Object.entries(m)
      .map(([label, value]) => ({ key: label, label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)
  }
  if (metric === 'county') {
    const m: Record<string, number> = {}
    for (const r of rows) m[r.county] = (m[r.county] ?? 0) + 1
    return Object.entries(m)
      .map(([label, value]) => ({ key: label, label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)
  }
  // score bands
  const bands: { key: string; label: string; test: (s: number) => boolean }[] = [
    { key: '90', label: '90+', test: s => s >= 90 },
    { key: '80', label: '80–89', test: s => s >= 80 && s < 90 },
    { key: '70', label: '70–79', test: s => s >= 70 && s < 80 },
    { key: '60', label: '60–69', test: s => s >= 60 && s < 70 },
    { key: '50', label: '50–59', test: s => s >= 50 && s < 60 },
    { key: 'lt50', label: '<50', test: s => s < 50 },
  ]
  return bands.map(b => ({ key: b.key, label: b.label, value: rows.filter(r => b.test(r.score)).length }))
}

function insightFor(metric: VisualMetric, groups: BarGroup[], totalRows: number): string {
  const top = groups[0]
  if (metric === 'next30') {
    const sum = groups.reduce((s, g) => s + g.value, 0)
    if (!sum) return 'No records are releasing in the next 30 days under the current filters.'
    if (!top) return 'No releases in the next 30 days under the current filters.'
    return `${top.value.toLocaleString()} of the ${sum.toLocaleString()} releases in the next 30 days come from ${top.label}.`
  }
  if (metric === 'county') {
    if (!top || !totalRows) return 'No records match the current filters.'
    const pct = Math.round((top.value / totalRows) * 100)
    return `${top.label} accounts for ${pct}% of records in scope (${top.value.toLocaleString()} of ${totalRows.toLocaleString()}).`
  }
  const strong = groups.filter(g => g.key === '90' || g.key === '80').reduce((s, g) => s + g.value, 0)
  if (!totalRows) return 'No records match the current filters.'
  const pct = Math.round((strong / totalRows) * 100)
  return `${strong.toLocaleString()} records (${pct}%) score 80 or higher — your strongest outreach candidates.`
}

const METRICS: { id: VisualMetric; label: string }[] = [
  { id: 'next30', label: 'Next 30 days' },
  { id: 'county', label: 'By county' },
  { id: 'score', label: 'By match score' },
]

function VisualView({
  rows,
  totalRows,
  onBarClick,
}: {
  rows: Release[]
  totalRows: number
  onBarClick: (metric: VisualMetric, key: string) => void
}) {
  const [metric, setMetric] = useState<VisualMetric>('county')
  const groups = useMemo(() => buildGroups(rows, metric), [rows, metric])
  const max = Math.max(1, ...groups.map(g => g.value))
  const insight = insightFor(metric, groups, totalRows)

  return (
    <div>
      {/* metric pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {METRICS.map(m => {
          const on = metric === m.id
          return (
            <button
              key={m.id}
              onClick={() => setMetric(m.id)}
              style={{
                padding: '6px 14px', borderRadius: 999, cursor: 'pointer', fontFamily: 'inherit',
                fontSize: 12.5, fontWeight: 600, transition: 'all .12s',
                border: on ? '1px solid var(--po-copper-line)' : '1px solid var(--po-line-strong)',
                background: on ? 'var(--po-copper-wash)' : 'var(--po-panel)',
                color: on ? 'var(--po-blue-700)' : 'var(--po-text-2)',
              }}
            >
              {m.label}
            </button>
          )
        })}
      </div>

      {/* horizontal bar chart */}
      <div className="card" style={{ padding: '18px 20px' }}>
        {groups.length === 0 || groups.every(g => g.value === 0) ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--po-text-3)', fontSize: 13 }}>
            No data for this view under the current filters.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {groups.map(g => (
              <button
                key={g.key}
                onClick={() => onBarClick(metric, g.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, border: 'none', background: 'transparent',
                  padding: 0, cursor: 'pointer', fontFamily: 'inherit', width: '100%',
                }}
              >
                <span
                  style={{
                    width: 120, flexShrink: 0, fontSize: 13, color: 'var(--po-text-2)', textAlign: 'left',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}
                >
                  {g.label}
                </span>
                <span style={{ flex: 1, height: 24, borderRadius: 'var(--po-r-sm)', background: 'var(--po-track)', overflow: 'hidden', minWidth: 0 }}>
                  <span
                    style={{
                      display: 'block', height: '100%', borderRadius: 'var(--po-r-sm)',
                      width: `${Math.max(2, (g.value / max) * 100)}%`,
                      background: rampFor(g.value, max),
                      transition: 'width .25s ease',
                    }}
                  />
                </span>
                <span className="po-mono" style={{ width: 48, flexShrink: 0, textAlign: 'right', fontSize: 13, color: 'var(--po-text)', fontWeight: 500 }}>
                  {g.value.toLocaleString()}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* insight callout */}
        <div
          style={{
            marginTop: 18, padding: '12px 16px', borderRadius: 'var(--po-r-sm)',
            borderLeft: '3px solid var(--po-blue)', background: 'var(--po-blue-100)',
          }}
        >
          <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: 'var(--po-text)', lineHeight: 1.5 }}>
            {insight}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ── Table view ─────────────────────────────────────────────────────── */
const PER = 25

function TableView({ rows, onOpen }: { rows: Release[]; onOpen: (r: Release) => void }) {
  const [sort, setSort] = useState<'date' | 'score'>('date')
  const [page, setPage] = useState(0)

  const sorted = useMemo(() => {
    const s = [...rows]
    if (sort === 'score') s.sort((a, b) => b.score - a.score || a.days_out - b.days_out)
    else s.sort((a, b) => a.days_out - b.days_out || b.score - a.score)
    return s
  }, [rows, sort])

  // Clamp page when the result set shrinks.
  useEffect(() => { setPage(0) }, [rows, sort])

  const pages = Math.max(1, Math.ceil(sorted.length / PER))
  const safePage = Math.min(page, pages - 1)
  const shown = sorted.slice(safePage * PER, safePage * PER + PER)

  const headers = ['Name', 'DOC #', 'Facility', 'County', 'Release date', 'Days', 'Class', 'Supervision', 'Score']

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 12 }}>
        {([['date', 'Soonest release'], ['score', 'Highest score']] as const).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setSort(k)}
            style={{
              padding: '6px 13px', borderRadius: 999, cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 12, fontWeight: 600, transition: 'all .12s',
              border: sort === k ? '1px solid var(--po-navy)' : '1px solid var(--po-line-strong)',
              background: sort === k ? 'var(--po-navy)' : 'var(--po-panel)',
              color: sort === k ? '#fff' : 'var(--po-text-2)',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ overflowX: 'auto', border: '1px solid var(--po-line)', borderRadius: 'var(--po-r-sm)', background: 'var(--po-panel)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--po-navy)' }}>
              {headers.map(h => (
                <th key={h} style={{ padding: '9px 13px', textAlign: 'left', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((r, i) => (
              <tr
                key={r.id}
                onClick={() => onOpen(r)}
                className="po-hov-trow"
                style={{ background: i % 2 ? 'var(--po-panel-2)' : 'var(--po-panel)', cursor: 'pointer' }}
              >
                <td style={{ padding: '8px 13px', whiteSpace: 'nowrap', borderTop: '1px solid var(--po-line)' }}>
                  <b style={{ color: 'var(--po-text)' }}>{r.name}</b>
                </td>
                <td className="po-mono" style={{ padding: '8px 13px', color: 'var(--po-text-2)', borderTop: '1px solid var(--po-line)' }}>{r.doc_number}</td>
                <td style={{ padding: '8px 13px', color: 'var(--po-text)', whiteSpace: 'nowrap', borderTop: '1px solid var(--po-line)' }}>{r.facility}</td>
                <td style={{ padding: '8px 13px', color: 'var(--po-text)', borderTop: '1px solid var(--po-line)' }}>{r.county}</td>
                <td style={{ padding: '8px 13px', color: 'var(--po-text)', whiteSpace: 'nowrap', borderTop: '1px solid var(--po-line)' }}>{fmtDate(r.release_date)}</td>
                <td className="po-mono" style={{ padding: '8px 13px', color: 'var(--po-text-2)', borderTop: '1px solid var(--po-line)' }}>{r.days_out}</td>
                <td style={{ padding: '8px 13px', color: 'var(--po-text-2)', whiteSpace: 'nowrap', borderTop: '1px solid var(--po-line)' }}>{r.offense_class}</td>
                <td style={{ padding: '8px 13px', color: 'var(--po-text-2)', whiteSpace: 'nowrap', borderTop: '1px solid var(--po-line)' }}>{r.supervision}</td>
                <td style={{ padding: '8px 13px', borderTop: '1px solid var(--po-line)' }}><ScoreBadge score={r.score} /></td>
              </tr>
            ))}
            {!shown.length && (
              <tr>
                <td colSpan={headers.length} style={{ padding: '28px 13px', textAlign: 'center', color: 'var(--po-text-3)', borderTop: '1px solid var(--po-line)' }}>
                  No releases match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, fontSize: 12.5, color: 'var(--po-text-2)' }}>
          <span>Page {safePage + 1} of {pages} · showing {shown.length} of {rows.length.toLocaleString()}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={safePage === 0}
              style={{ padding: '6px 14px', borderRadius: 'var(--po-r-sm)', border: '1px solid var(--po-line-strong)', background: 'var(--po-panel)', color: 'var(--po-text-2)', fontSize: 12.5, fontWeight: 600, cursor: safePage === 0 ? 'default' : 'pointer', opacity: safePage === 0 ? 0.5 : 1, fontFamily: 'inherit' }}
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(pages - 1, p + 1))}
              disabled={safePage >= pages - 1}
              style={{ padding: '6px 14px', borderRadius: 'var(--po-r-sm)', border: '1px solid var(--po-line-strong)', background: 'var(--po-panel)', color: 'var(--po-text-2)', fontSize: 12.5, fontWeight: 600, cursor: safePage >= pages - 1 ? 'default' : 'pointer', opacity: safePage >= pages - 1 ? 0.5 : 1, fontFamily: 'inherit' }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Compact cards view ─────────────────────────────────────────────── */
function CompactView({ rows, onOpen }: { rows: Release[]; onOpen: (r: Release) => void }) {
  const [limit, setLimit] = useState(24)
  useEffect(() => { setLimit(24) }, [rows])

  const sorted = useMemo(() => [...rows].sort((a, b) => a.days_out - b.days_out || b.score - a.score), [rows])
  const shown = sorted.slice(0, limit)

  if (!rows.length) {
    return (
      <div className="card" style={{ padding: '40px 0', textAlign: 'center', color: 'var(--po-text-3)', fontSize: 13 }}>
        No releases match the current filters.
      </div>
    )
  }

  return (
    <div>
      <div className="dash-compact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
        {shown.map(r => {
          const tier = scoreTier(r.score)
          return (
            <button
              key={r.id}
              onClick={() => onOpen(r)}
              className="card po-hov-card po-hov-lift"
              style={{ padding: '14px 16px', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', background: 'var(--po-panel)', border: '1px solid var(--po-line)', display: 'flex', flexDirection: 'column', gap: 8 }}
            >
              <span
                className="po-mono"
                style={{
                  alignSelf: 'flex-start', padding: '2px 9px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                  background: tier.bg, color: tier.color, border: `1px solid ${tier.border}`,
                }}
              >
                Score {r.score} · {tier.label}
              </span>
              <div>
                <div className="po-display" style={{ fontSize: 15, fontWeight: 600, color: 'var(--po-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--po-text-3)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.facility} · {r.county} · {r.offense_class}
                </div>
              </div>
              <div style={{ marginTop: 2 }}>
                <div className="po-display po-mono" style={{ fontSize: 20, fontWeight: 700, color: 'var(--po-text)', lineHeight: 1.1 }}>
                  {fmtDate(r.release_date)}
                </div>
                <div style={{ fontSize: 12, color: r.days_out <= 30 ? 'var(--po-blue-700)' : 'var(--po-text-3)', fontWeight: 600, marginTop: 2 }}>
                  in {r.days_out} days
                </div>
              </div>
              <div style={{ display: 'flex', gap: 14, fontSize: 11.5, color: 'var(--po-text-3)', marginTop: 2 }}>
                <span>{r.custody}</span>
                <span>{r.supervision}</span>
              </div>
            </button>
          )
        })}
      </div>
      {shown.length < rows.length && (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button
            onClick={() => setLimit(l => l + 24)}
            style={{ padding: '8px 18px', borderRadius: 'var(--po-r-sm)', border: '1px solid var(--po-line-strong)', background: 'var(--po-panel)', color: 'var(--po-text)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Show more ({(rows.length - shown.length).toLocaleString()} remaining)
          </button>
        </div>
      )}
    </div>
  )
}

/* ── View toggle ────────────────────────────────────────────────────── */
const VIEW_PILLS: { id: ViewMode; label: string; icon: string }[] = [
  { id: 'visual', label: 'Visual', icon: 'dashboard' },
  { id: 'table', label: 'Table', icon: 'list' },
  { id: 'compact', label: 'Compact', icon: 'layers' },
]

/* ── Main canvas ────────────────────────────────────────────────────── */
export function VisualArea({
  rows,
  source,
  onOpen,
  onBarFilter,
}: {
  rows: Release[]
  source: 'live' | 'demo'
  onOpen: (r: Release) => void
  onBarFilter: (metric: VisualMetric, key: string) => void
}) {
  const [view, setView] = useState<ViewMode>('visual')

  // localStorage read in effect only (avoid hydration mismatch).
  useEffect(() => {
    const stored = localStorage.getItem(VIEW_KEY)
    if (stored === 'visual' || stored === 'table' || stored === 'compact') setView(stored)
  }, [])

  const setMode = (m: ViewMode) => {
    setView(m)
    try { localStorage.setItem(VIEW_KEY, m) } catch { /* ignore */ }
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 40px', minWidth: 0 }}>
      <ReleaseHorizon rows={rows} />
      <KpiRow rows={rows} onOpenTop={onOpen} />

      {/* Data area header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <h2 className="po-display" style={{ fontSize: 17, fontWeight: 600, color: 'var(--po-text)', margin: 0 }}>Data</h2>
          <span className="po-mono" style={{ fontSize: 13, color: 'var(--po-text-3)' }}>{rows.length.toLocaleString()} matching</span>
        </div>
        <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 'var(--po-r)', background: 'var(--po-panel-2)', border: '1px solid var(--po-line)' }}>
          {VIEW_PILLS.map(p => {
            const on = view === p.id
            return (
              <button
                key={p.id}
                onClick={() => setMode(p.id)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7, height: 32, padding: '0 13px',
                  borderRadius: 'var(--po-r-sm)', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: 12.5, fontWeight: 600, transition: 'all .12s',
                  background: on ? 'var(--po-navy)' : 'transparent',
                  color: on ? '#fff' : 'var(--po-text-2)',
                }}
              >
                <Icon name={p.icon} size={14} stroke={on ? '#fff' : 'var(--po-text-2)'} />
                {p.label}
              </button>
            )
          })}
        </div>
      </div>

      {view === 'visual' && <VisualView rows={rows} totalRows={rows.length} onBarClick={onBarFilter} />}
      {view === 'table' && <TableView rows={rows} onOpen={onOpen} />}
      {view === 'compact' && <CompactView rows={rows} onOpen={onOpen} />}

      <p style={{ fontSize: 11.5, color: 'var(--po-text-3)', marginTop: 24 }}>
        {source === 'demo' && 'Sample data shown for demonstration. '}
        Sourced from public ADCRR records · release dates subject to change · not for FCRA-covered screening.
      </p>
    </div>
  )
}
