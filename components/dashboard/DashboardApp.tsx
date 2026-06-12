'use client'

import { useEffect, useMemo, useState } from 'react'
import { fetchReleases, type Release, type DataSource } from '@/lib/data-source'
import { type Filters, type VisualMetric, EMPTY_FILTERS, applyFilters } from './types'
import { Sidebar, TopSearchBar } from './Sidebar'
import { DashboardHome } from './DashboardHome'
import { AssistantRail } from './AssistantRail'
import { FilterRail } from './FilterRail'
import { VisualArea } from './VisualArea'
import { InmatePanel } from './InmatePanel'
import { SavedView, ConnectorsView, SettingsView } from './views'
import { Icon } from '@/components/ui/Icon'

/* ── Loading skeleton ─────────────────────────────────────────────── */
function Bar({ w, h = 14 }: { w: number | string; h?: number }) {
  return <div className="dash-skel" style={{ width: w, height: h, borderRadius: 6 }} />
}

function LoadingCanvas() {
  return (
    <div style={{ flex: 1, padding: '20px 24px 40px', minWidth: 0 }}>
      <div className="card" style={{ padding: '18px 20px', marginBottom: 16 }}>
        <Bar w={160} h={12} />
        <div style={{ height: 16 }} />
        <Bar w="100%" h={96} />
      </div>
      <div className="dash-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="card" style={{ padding: '16px 18px' }}>
            <Bar w={90} h={10} />
            <div style={{ height: 14 }} />
            <Bar w={70} h={26} />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes dash-skel-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
        .dash-skel { background: var(--po-track); animation: dash-skel-pulse 1.3s ease-in-out infinite; }
      `}</style>
    </div>
  )
}

function StubView({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ maxWidth: 560, margin: '40px auto', textAlign: 'center' }}>
      <div style={{ width: 46, height: 46, borderRadius: 12, margin: '0 auto 14px', background: 'var(--po-blue-100)', border: '1px solid var(--po-copper-line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="clock" size={20} stroke="var(--po-blue-700)" />
      </div>
      <h2 className="po-display" style={{ fontSize: 19, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 8px' }}>{title}</h2>
      <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--po-text-2)', margin: 0 }}>{body}</p>
    </div>
  )
}

/* ── Root ──────────────────────────────────────────────────────────── */
export function DashboardApp() {
  const [nav, setNav] = useState('home')
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [panelAdc, setPanelAdc] = useState<string | null>(null)

  const [allRows, setAllRows] = useState<Release[]>([])
  const [source, setSource] = useState<DataSource>('demo')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchReleases().then(({ rows, source }) => {
      if (cancelled) return
      setAllRows(rows)
      setSource(source)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  const counties = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const r of allRows) counts[r.county] = (counts[r.county] ?? 0) + 1
    return Object.keys(counts).sort((a, b) => counts[b] - counts[a])
  }, [allRows])

  const facilities = useMemo(() => {
    const set = new Set<string>()
    for (const r of allRows) set.add(r.facility)
    return Array.from(set).sort()
  }, [allRows])

  const rows = useMemo(() => applyFilters(allRows, filters), [allRows, filters])

  // County counts respect all filters except the county scope itself.
  const byCounty = useMemo(() => {
    const scoped = applyFilters(allRows, { ...filters, counties: [] })
    const counts: Record<string, number> = {}
    for (const r of scoped) counts[r.county] = (counts[r.county] ?? 0) + 1
    return counts
  }, [allRows, filters])

  const goSearch = (patch?: Partial<Filters>) => {
    if (patch) setFilters({ ...EMPTY_FILTERS, ...patch })
    setNav('search')
  }

  const runSaved = (f: Filters) => {
    setFilters(f)
    setNav('search')
  }

  // Clicking a chart bar narrows the active filter to that group.
  const onBarFilter = (metric: VisualMetric, key: string) => {
    if (metric === 'county') {
      setFilters(f => ({ ...f, counties: [key] }))
    } else if (metric === 'next30') {
      setFilters(f => ({ ...f, facility: key, range: { start: 0, end: 29 } }))
    } else {
      const floor = key === 'lt50' ? 0 : Number(key)
      setFilters(f => ({ ...f, minScore: floor }))
    }
  }

  return (
    <div style={{ height: '100vh', display: 'flex', background: 'var(--po-bg)' }}>
      <Sidebar nav={nav} setNav={setNav} />

      {/* Center column */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopSearchBar onSearch={q => goSearch({ q })} />

        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
          {nav === 'search' && (
            <FilterRail
              filters={filters}
              setFilters={setFilters}
              byCounty={byCounty}
              counties={counties}
              facilities={facilities}
              allRows={allRows}
              onRunSaved={runSaved}
            />
          )}

          <div style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
            {loading && (nav === 'home' || nav === 'search') ? (
              <LoadingCanvas />
            ) : nav === 'home' ? (
              <div style={{ padding: '22px 24px 40px' }}>
                <DashboardHome rows={allRows} onGoSearch={goSearch} onRunSaved={runSaved} />
              </div>
            ) : nav === 'search' ? (
              <VisualArea rows={rows} source={source} onOpen={r => setPanelAdc(r.doc_number)} onBarFilter={onBarFilter} />
            ) : nav === 'saved' ? (
              <SavedView allRows={allRows} onRun={runSaved} />
            ) : nav === 'alerts' ? (
              <StubView title="Alerts" body="Saved-search alerts fire as new matches land — instant email or webhook. Delivery history appears here once the live data pipeline is connected." />
            ) : nav === 'exports' ? (
              <StubView title="Exports" body="CSV and CRM exports of your current result set. Available once live data is connected." />
            ) : nav === 'recordviews' ? (
              <StubView title="Record Views" body="Your metered record-view history for this billing period appears here." />
            ) : nav === 'reports' ? (
              <StubView title="Reports" body="Grant-ready aggregate reports — county breakdowns, outreach outcomes, monthly trends. Coming online with live data." />
            ) : nav === 'connectors' ? (
              <ConnectorsView />
            ) : (
              <SettingsView />
            )}
          </div>
        </div>
      </div>

      <AssistantRail onViewMatches={() => setNav('search')} />

      <InmatePanel adc={panelAdc} onClose={() => setPanelAdc(null)} />
    </div>
  )
}
