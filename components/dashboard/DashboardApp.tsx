'use client'

import { useMemo, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { Wordmark } from '@/components/ui/Wordmark'
import { RECORDS, COUNTIES, FACILITIES, HORIZON_DAYS, type ReleaseRecord } from '@/lib/releases'

/* ── Filters ───────────────────────────────────────────────────── */

interface Filters {
  q: string
  counties: string[]
  range: { start: number; end: number } | null
  facility: string
  offenseClass: string
  minScore: number
}

const EMPTY_FILTERS: Filters = { q: '', counties: [], range: null, facility: '', offenseClass: '', minScore: 0 }

const WINDOW_CHIPS = [
  { id: 'w30', label: 'Next 30 days', range: { start: 0, end: 29 } },
  { id: 'w90', label: '30–90 days', range: { start: 30, end: 89 } },
  { id: 'w180', label: '90–180 days', range: { start: 90, end: 179 } },
]

const SAVED_SEARCHES = [
  { id: 's1', name: 'Maricopa · score 80+', alert: true, filters: { ...EMPTY_FILTERS, counties: ['Maricopa'], minScore: 80 } },
  { id: 's2', name: 'Pima next 30 days', alert: true, filters: { ...EMPTY_FILTERS, counties: ['Pima'], range: { start: 0, end: 29 } } },
  { id: 's3', name: 'ASPC-Lewis releases', alert: false, filters: { ...EMPTY_FILTERS, facility: 'ASPC-Lewis' } },
]

function applyFilters(filters: Filters): ReleaseRecord[] {
  return RECORDS.filter(r => {
    if (filters.q) {
      const q = filters.q.toLowerCase()
      if (!r.name.toLowerCase().includes(q) && !r.docNumber.includes(filters.q)) return false
    }
    if (filters.counties.length && !filters.counties.includes(r.county)) return false
    if (filters.range && (r.releaseDayIdx < filters.range.start || r.releaseDayIdx > filters.range.end)) return false
    if (filters.facility && r.facility !== filters.facility) return false
    if (filters.offenseClass && r.offenseClass !== filters.offenseClass) return false
    if (filters.minScore > 0 && r.score < filters.minScore) return false
    return true
  })
}

function fmtDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/* ── Small pieces ──────────────────────────────────────────────── */

function ScoreBadge({ score }: { score: number }) {
  const high = score >= 80
  const mid = score >= 60 && score < 80
  return (
    <span
      className="po-mono"
      style={{
        display: 'inline-block', padding: '2px 9px', borderRadius: 999, fontSize: 11.5, fontWeight: 600,
        background: high ? 'var(--po-sage-wash)' : mid ? 'var(--po-copper-wash)' : 'var(--po-track)',
        color: high ? 'var(--po-sage)' : mid ? 'var(--po-blue-700)' : 'var(--po-text-2)',
        border: `1px solid ${high ? 'var(--po-sage-line)' : mid ? 'var(--po-copper-line)' : 'var(--po-line)'}`,
      }}
    >
      {score}
    </span>
  )
}

function Section({ label, right, children }: { label: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span className="po-label">{label}</span>
        {right != null && <span style={{ fontSize: 11, color: 'var(--po-blue-700)', fontWeight: 600 }}>{right}</span>}
      </div>
      {children}
    </div>
  )
}

function SelectMenu({ value, options, onChange, placeholder, icon }: {
  value: string
  options: string[]
  onChange: (v: string) => void
  placeholder: string
  icon?: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 9, height: 40, padding: '0 12px',
          borderRadius: 'var(--po-r)', background: 'var(--po-panel)', border: '1px solid var(--po-line-strong)',
          color: 'var(--po-text)', fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        {icon && <Icon name={icon} size={15} stroke="var(--po-text-3)" />}
        <span style={{ flex: 1, textAlign: 'left', color: value ? 'var(--po-text)' : 'var(--po-text-3)' }}>
          {value || placeholder}
        </span>
        <Icon name="chevronDown" size={15} stroke="var(--po-text-3)" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .18s' }} />
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 30 }} onClick={() => setOpen(false)} />
          <div
            style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 31,
              background: 'var(--po-panel)', border: '1px solid var(--po-line-strong)',
              borderRadius: 'var(--po-r)', padding: 5, maxHeight: 240, overflowY: 'auto',
              boxShadow: 'none',
            }}
          >
            {options.map(o => (
              <button
                key={o}
                onClick={() => { onChange(o); setOpen(false) }}
                style={{
                  width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 'var(--po-r-sm)',
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13,
                  background: o === value || (!value && o === options[0]) ? 'var(--po-elevated-2)' : 'transparent',
                  color: o === value || (!value && o === options[0]) ? 'var(--po-text)' : 'var(--po-text-2)',
                }}
              >
                {o}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ── TopBar ────────────────────────────────────────────────────── */

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'saved', label: 'Saved Searches', icon: 'bookmark' },
  { id: 'connectors', label: 'Connectors', icon: 'plug' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
]

function TopBar({ nav, setNav }: { nav: string; setNav: (v: string) => void }) {
  return (
    <header
      style={{
        height: 60, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 22px', borderBottom: '1px solid var(--po-line)', background: 'var(--po-panel)',
        position: 'relative', zIndex: 20,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <Wordmark />
        <nav className="dash-nav" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {NAV_ITEMS.map(it => (
            <button
              key={it.id}
              onClick={() => setNav(it.id)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7, height: 34, padding: '0 13px',
                borderRadius: 'var(--po-r-sm)', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                background: nav === it.id ? 'var(--po-elevated-2)' : 'transparent',
                color: nav === it.id ? 'var(--po-text)' : 'var(--po-text-2)',
                fontSize: 13, fontWeight: 500, transition: 'background .15s, color .15s',
              }}
            >
              <Icon name={it.icon} size={15} />
              <span>{it.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <a
          href="/agent"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7, height: 36, padding: '0 14px',
            borderRadius: 'var(--po-r)', border: 'none', background: 'var(--po-blue)',
            color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none',
          }}
        >
          <Icon name="sparkles" size={15} stroke="#fff" />
          Ask AI
        </a>
        <div
          title="Sanctuary Recovery — Pro plan"
          style={{
            width: 34, height: 34, borderRadius: '50%', background: 'var(--po-sage-wash)',
            border: '1px solid var(--po-sage-line)', color: 'var(--po-sage)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700,
          }}
        >
          SR
        </div>
      </div>
    </header>
  )
}

/* ── FilterRail ────────────────────────────────────────────────── */

function FilterRail({ filters, setFilters, byCounty, onRunSaved }: {
  filters: Filters
  setFilters: (f: Filters) => void
  byCounty: Record<string, number>
  onRunSaved: (f: Filters) => void
}) {
  const set = (patch: Partial<Filters>) => setFilters({ ...filters, ...patch })

  const toggleCounty = (c: string) => {
    const has = filters.counties.includes(c)
    set({ counties: has ? filters.counties.filter(x => x !== c) : [...filters.counties, c] })
  }

  const activeWindow = WINDOW_CHIPS.find(
    w => filters.range && w.range.start === filters.range.start && w.range.end === filters.range.end,
  )

  return (
    <aside
      className="dash-rail"
      style={{
        width: 264, flexShrink: 0, borderRight: '1px solid var(--po-line)',
        background: 'var(--po-panel)', display: 'flex', flexDirection: 'column',
      }}
    >
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 16px 28px' }}>
        {/* Search */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 9, height: 40, padding: '0 12px',
            borderRadius: 'var(--po-r)', background: 'var(--po-bg)', border: '1px solid var(--po-line-strong)',
            marginBottom: 22,
          }}
        >
          <Icon name="search" size={16} stroke="var(--po-text-3)" />
          <input
            value={filters.q}
            onChange={e => set({ q: e.target.value })}
            placeholder="Name or DOC #"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--po-text)', fontSize: 13.5, fontFamily: 'inherit', minWidth: 0 }}
          />
          {filters.q && (
            <button onClick={() => set({ q: '' })} style={{ border: 'none', background: 'transparent', color: 'var(--po-text-3)', display: 'flex', padding: 2, cursor: 'pointer' }}>
              <Icon name="x" size={13} />
            </button>
          )}
        </div>

        {/* County scope */}
        <Section label="County Scope" right={filters.counties.length ? `${filters.counties.length} selected` : 'All'}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {COUNTIES.map(c => {
              const on = filters.counties.includes(c)
              return (
                <button
                  key={c}
                  onClick={() => toggleCounty(c)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 9, height: 30, padding: '0 8px',
                    borderRadius: 'var(--po-r-sm)', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                    background: 'transparent', color: on ? 'var(--po-text)' : 'var(--po-text-2)', fontSize: 13,
                  }}
                >
                  <span
                    style={{
                      width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                      border: on ? '1.5px solid var(--po-blue)' : '1.5px solid var(--po-line-strong)',
                      background: on ? 'var(--po-blue)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {on && <Icon name="check" size={11} stroke="#fff" strokeWidth={2.6} />}
                  </span>
                  <span style={{ flex: 1, textAlign: 'left' }}>{c}</span>
                  <span className="po-mono" style={{ fontSize: 11.5, color: 'var(--po-text-3)' }}>{byCounty[c] || 0}</span>
                </button>
              )
            })}
          </div>
          {filters.counties.length > 0 && (
            <button
              onClick={() => set({ counties: [] })}
              style={{ border: 'none', background: 'transparent', color: 'var(--po-blue-700)', fontSize: 12, fontWeight: 600, padding: '8px 4px 0', fontFamily: 'inherit', cursor: 'pointer' }}
            >
              Clear scope
            </button>
          )}
        </Section>

        {/* Release window */}
        <Section label="Release Window">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {WINDOW_CHIPS.map(w => {
              const on = activeWindow?.id === w.id
              return (
                <button
                  key={w.id}
                  onClick={() => set({ range: on ? null : w.range })}
                  style={{
                    height: 34, borderRadius: 'var(--po-r-sm)', textAlign: 'left', padding: '0 12px',
                    cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, transition: 'all .15s',
                    border: on ? '1px solid var(--po-copper-line)' : '1px solid var(--po-line)',
                    background: on ? 'var(--po-copper-wash)' : 'var(--po-bg)',
                    color: on ? 'var(--po-blue-700)' : 'var(--po-text-2)',
                    fontWeight: on ? 600 : 500,
                  }}
                >
                  {w.label}
                </button>
              )
            })}
          </div>
        </Section>

        {/* Facility */}
        <Section label="Facility">
          <SelectMenu
            value={filters.facility}
            placeholder="All facilities"
            options={['All facilities', ...FACILITIES.map(f => f.name)]}
            onChange={v => set({ facility: v === 'All facilities' ? '' : v })}
            icon="building"
          />
        </Section>

        {/* Offense class */}
        <Section label="Offense Class">
          <SelectMenu
            value={filters.offenseClass}
            placeholder="Any class"
            options={['Any class', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6']}
            onChange={v => set({ offenseClass: v === 'Any class' ? '' : v })}
            icon="layers"
          />
        </Section>

        {/* Match score */}
        <Section label="Match Score" right={filters.minScore > 0 ? `${filters.minScore}+` : 'Any'}>
          <input
            type="range" min={0} max={95} step={5}
            value={filters.minScore}
            onChange={e => set({ minScore: +e.target.value })}
            style={{ width: '100%', accentColor: 'var(--po-blue)' }}
          />
          <div className="po-mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--po-text-3)', marginTop: 4 }}>
            <span>Any</span><span>50</span><span>95+</span>
          </div>
        </Section>

        {/* Saved searches */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingTop: 6, borderTop: '1px solid var(--po-line)' }}>
          <span className="po-label">Saved Searches</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {SAVED_SEARCHES.map(s => {
            const matches = applyFilters(s.filters).length
            return (
              <button
                key={s.id}
                onClick={() => onRunSaved(s.filters)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9, height: 34, padding: '0 8px',
                  borderRadius: 'var(--po-r-sm)', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  background: 'transparent', color: 'var(--po-text-2)', fontSize: 13,
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: s.alert ? 'var(--po-sage)' : 'var(--po-text-3)' }} />
                <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</span>
                {s.alert && <Icon name="bell" size={13} stroke="var(--po-sage)" />}
                <span className="po-mono" style={{ fontSize: 11.5, color: 'var(--po-text-3)' }}>{matches}</span>
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}

/* ── Results: stat cards + horizon + table ─────────────────────── */

function ResultsView({ rows }: { rows: ReleaseRecord[] }) {
  const [sort, setSort] = useState<'date' | 'score'>('date')
  const [page, setPage] = useState(0)
  const PER = 25

  const sorted = useMemo(() => {
    const s = [...rows]
    if (sort === 'score') s.sort((a, b) => b.score - a.score || a.releaseDayIdx - b.releaseDayIdx)
    else s.sort((a, b) => a.releaseDayIdx - b.releaseDayIdx || b.score - a.score)
    return s
  }, [rows, sort])

  const pages = Math.max(1, Math.ceil(sorted.length / PER))
  const safePage = Math.min(page, pages - 1)
  const shown = sorted.slice(safePage * PER, safePage * PER + PER)

  const high = rows.filter(r => r.score >= 80).length
  const next30 = rows.filter(r => r.releaseDayIdx < 30).length
  const byCounty: Record<string, number> = {}
  for (const r of rows) byCounty[r.county] = (byCounty[r.county] ?? 0) + 1
  const topCounty = Object.entries(byCounty).sort((a, b) => b[1] - a[1])[0]

  // Horizon density for current result set
  const horizon = Array.from({ length: HORIZON_DAYS }, () => 0)
  for (const r of rows) horizon[r.releaseDayIdx]++
  const maxDay = Math.max(...horizon, 1)

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 40px', minWidth: 0 }}>
      {/* Stat cards */}
      <div className="dash-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Matches', value: String(rows.length), sub: 'Current filters', color: undefined },
          { label: 'High Propensity', value: String(high), sub: 'Score ≥ 80', color: 'var(--po-sage)' },
          { label: 'Next 30 Days', value: String(next30), sub: 'Releasing soon', color: 'var(--po-blue)' },
          { label: 'Top County', value: topCounty?.[0] ?? '—', sub: topCounty ? `${topCounty[1]} releases` : 'No matches', color: undefined },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '13px 16px' }}>
            <div className="po-label" style={{ fontSize: 10, marginBottom: 6 }}>{s.label}</div>
            <div className="po-display" style={{ fontSize: 22, fontWeight: 700, color: s.color ?? 'var(--po-text)', lineHeight: 1.1 }}>{s.value}</div>
            <div style={{ fontSize: 11.5, color: 'var(--po-text-3)', marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Release horizon for filtered set */}
      <div className="card" style={{ padding: '15px 18px', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h3 className="po-display" style={{ fontSize: 14, fontWeight: 600, color: 'var(--po-text)', margin: 0 }}>
            Release Horizon
          </h3>
          <span style={{ fontSize: 11.5, color: 'var(--po-text-3)' }}>Next 180 days · filtered</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 64 }}>
          {horizon.map((c, i) => (
            <div
              key={i}
              title={`Day ${i + 1}: ${c}`}
              style={{
                flex: 1, minWidth: 0,
                height: `${(c / maxDay) * 100}%`,
                background: c > 0 ? 'var(--po-blue-300)' : 'var(--po-track)',
                borderRadius: '1px 1px 0 0',
                minHeight: 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Table header row: count + sort */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 12, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, color: 'var(--po-text-2)' }}>
          <b className="po-mono" style={{ color: 'var(--po-text)' }}>{rows.length.toLocaleString()}</b> upcoming releases match
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          {([['date', 'Soonest release'], ['score', 'Highest score']] as const).map(([k, label]) => (
            <button
              key={k}
              onClick={() => { setSort(k); setPage(0) }}
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
      </div>

      {/* Results table */}
      <div style={{ overflowX: 'auto', border: '1px solid var(--po-line)', borderRadius: 'var(--po-r-sm)', background: 'var(--po-panel)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--po-navy)' }}>
              {['Name', 'DOC #', 'Facility', 'County', 'Release date', 'Days', 'Class', 'Supervision', 'Score'].map(h => (
                <th key={h} style={{ padding: '9px 13px', textAlign: 'left', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((r, i) => (
              <tr key={r.id} style={{ background: i % 2 ? 'var(--po-panel-2)' : 'var(--po-panel)' }}>
                <td style={{ padding: '8px 13px', whiteSpace: 'nowrap', borderTop: '1px solid var(--po-line)' }}>
                  <b style={{ color: 'var(--po-text)' }}>{r.name}</b>
                </td>
                <td className="po-mono" style={{ padding: '8px 13px', color: 'var(--po-text-2)', borderTop: '1px solid var(--po-line)' }}>{r.docNumber}</td>
                <td style={{ padding: '8px 13px', color: 'var(--po-text)', whiteSpace: 'nowrap', borderTop: '1px solid var(--po-line)' }}>{r.facility}</td>
                <td style={{ padding: '8px 13px', color: 'var(--po-text)', borderTop: '1px solid var(--po-line)' }}>{r.county}</td>
                <td style={{ padding: '8px 13px', color: 'var(--po-text)', whiteSpace: 'nowrap', borderTop: '1px solid var(--po-line)' }}>{fmtDate(r.releaseDate)}</td>
                <td className="po-mono" style={{ padding: '8px 13px', color: 'var(--po-text-2)', borderTop: '1px solid var(--po-line)' }}>{r.releaseDayIdx}</td>
                <td style={{ padding: '8px 13px', color: 'var(--po-text-2)', whiteSpace: 'nowrap', borderTop: '1px solid var(--po-line)' }}>{r.offenseClass}</td>
                <td style={{ padding: '8px 13px', color: 'var(--po-text-2)', whiteSpace: 'nowrap', borderTop: '1px solid var(--po-line)' }}>{r.supervision}</td>
                <td style={{ padding: '8px 13px', borderTop: '1px solid var(--po-line)' }}><ScoreBadge score={r.score} /></td>
              </tr>
            ))}
            {!shown.length && (
              <tr>
                <td colSpan={9} style={{ padding: '28px 13px', textAlign: 'center', color: 'var(--po-text-3)', borderTop: '1px solid var(--po-line)' }}>
                  No releases match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, fontSize: 12.5, color: 'var(--po-text-2)' }}>
          <span>
            Page {safePage + 1} of {pages} · showing {shown.length} of {rows.length.toLocaleString()}
          </span>
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

      <p style={{ fontSize: 11.5, color: 'var(--po-text-3)', marginTop: 18 }}>
        Sample data shown for demonstration. Sourced from public ADCRR records · release dates subject to change · not for FCRA-covered screening.
      </p>
    </div>
  )
}

/* ── Secondary views ───────────────────────────────────────────── */

function SavedView({ onRun }: { onRun: (f: Filters) => void }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
      <h2 className="po-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 16px' }}>Saved Searches</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 620 }}>
        {SAVED_SEARCHES.map(s => {
          const matches = applyFilters(s.filters).length
          return (
            <button
              key={s.id}
              onClick={() => onRun(s.filters)}
              className="card"
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '15px 18px', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}
            >
              <span style={{ width: 9, height: 9, borderRadius: '50%', flexShrink: 0, background: s.alert ? 'var(--po-sage)' : 'var(--po-text-3)' }} />
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--po-text)' }}>{s.name}</span>
              {s.alert && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 600, color: 'var(--po-sage)', background: 'var(--po-sage-wash)', border: '1px solid var(--po-sage-line)', borderRadius: 999, padding: '3px 10px' }}>
                  <Icon name="bell" size={12} stroke="var(--po-sage)" /> Alerts on
                </span>
              )}
              <span className="po-mono" style={{ fontSize: 13, color: 'var(--po-text-2)' }}>{matches} matches</span>
              <Icon name="chevronRight" size={16} stroke="var(--po-text-3)" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ConnectorsView() {
  const items = [
    { name: 'Salesforce', desc: 'Push matched records as Leads or custom objects.', status: 'Connected' },
    { name: 'KIPU', desc: 'Create pre-admission records from matches.', status: 'Available' },
    { name: 'Sunwave', desc: 'Sync matches into your CRM pipeline.', status: 'Available' },
    { name: 'Webhook', desc: 'Signed JSON POST on every new match.', status: 'Connected' },
  ]
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
      <h2 className="po-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 16px' }}>Connectors</h2>
      <div className="dash-stats" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 760 }}>
        {items.map(c => (
          <div key={c.name} className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3 className="po-display" style={{ fontSize: 15, fontWeight: 600, color: 'var(--po-text)', margin: 0 }}>{c.name}</h3>
              <span
                style={{
                  fontSize: 11, fontWeight: 600, borderRadius: 999, padding: '3px 10px',
                  background: c.status === 'Connected' ? 'var(--po-sage-wash)' : 'var(--po-track)',
                  color: c.status === 'Connected' ? 'var(--po-sage)' : 'var(--po-text-2)',
                  border: `1px solid ${c.status === 'Connected' ? 'var(--po-sage-line)' : 'var(--po-line)'}`,
                }}
              >
                {c.status}
              </span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--po-text-2)', margin: 0 }}>{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SettingsView() {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
      <h2 className="po-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 16px' }}>Settings</h2>
      <div className="card" style={{ padding: '18px 20px', maxWidth: 620 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13.5 }}>
          {[
            ['Organization', 'Sanctuary Recovery'],
            ['Plan', 'Pro — 2,500 records / month'],
            ['Alert email', 'team@sanctuaryrecovery.org'],
            ['Data refresh', 'Daily at 6:00 AM MST'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, paddingBottom: 12, borderBottom: '1px solid var(--po-line)' }}>
              <span style={{ color: 'var(--po-text-2)' }}>{k}</span>
              <b style={{ color: 'var(--po-text)' }}>{v}</b>
            </div>
          ))}
          <span style={{ fontSize: 12, color: 'var(--po-text-3)' }}>Account management will be available once authentication is connected.</span>
        </div>
      </div>
    </div>
  )
}

/* ── Root ──────────────────────────────────────────────────────── */

export function DashboardApp() {
  const [nav, setNav] = useState('dashboard')
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)

  const rows = useMemo(() => applyFilters(filters), [filters])

  // County counts respect all filters except the county scope itself,
  // so the rail shows what selecting each county would yield.
  const byCounty = useMemo(() => {
    const scoped = applyFilters({ ...filters, counties: [] })
    const counts: Record<string, number> = {}
    for (const r of scoped) counts[r.county] = (counts[r.county] ?? 0) + 1
    return counts
  }, [filters])

  const runSaved = (f: Filters) => {
    setFilters(f)
    setNav('dashboard')
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--po-bg)' }}>
      <TopBar nav={nav} setNav={setNav} />
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {nav === 'dashboard' && (
          <>
            <FilterRail filters={filters} setFilters={setFilters} byCounty={byCounty} onRunSaved={runSaved} />
            <ResultsView rows={rows} />
          </>
        )}
        {nav === 'saved' && <SavedView onRun={runSaved} />}
        {nav === 'connectors' && <ConnectorsView />}
        {nav === 'settings' && <SettingsView />}
      </div>
    </div>
  )
}
