'use client'

import { useEffect, useMemo, useState } from 'react'
import { fetchReleases, type Release, type DataSource } from '@/lib/data-source'
import {
  type Filters,
  type VisualMetric,
  EMPTY_FILTERS,
  applyFilters,
} from './types'
import { TopBar, AiPanel } from './Shell'
import { FilterRail } from './FilterRail'
import { VisualArea } from './VisualArea'
import { RecordDrawer } from './RecordDrawer'
import { SavedView, ConnectorsView, SettingsView } from './views'

/* ── Loading skeleton ──────────────────────────────────────────────── */
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
      <div className="dash-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="card" style={{ padding: '16px 18px' }}>
            <Bar w={90} h={10} />
            <div style={{ height: 14 }} />
            <Bar w={70} h={26} />
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: '18px 20px' }}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <Bar w={110} h={12} />
            <Bar w={`${70 - i * 8}%`} h={22} />
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

/* ── Root ──────────────────────────────────────────────────────────── */
export function DashboardApp() {
  const [nav, setNav] = useState('dashboard')
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [aiOpen, setAiOpen] = useState(false)
  const [drawerRecord, setDrawerRecord] = useState<Release | null>(null)

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

  const runSaved = (f: Filters) => {
    setFilters(f)
    setNav('dashboard')
  }

  // Clicking a chart bar narrows the active filter to that group.
  const onBarFilter = (metric: VisualMetric, key: string) => {
    if (metric === 'county') {
      setFilters(f => ({ ...f, counties: [key] }))
    } else if (metric === 'next30') {
      // key is a facility name within the 30-day window.
      setFilters(f => ({ ...f, facility: key, range: { start: 0, end: 29 } }))
    } else {
      // score band — set a minimum score floor.
      const floor = key === 'lt50' ? 0 : Number(key)
      setFilters(f => ({ ...f, minScore: floor }))
    }
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--po-bg)' }}>
      <TopBar nav={nav} setNav={setNav} source={source} onAskAi={() => setAiOpen(true)} />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {nav === 'dashboard' && (
          <>
            <FilterRail
              filters={filters}
              setFilters={setFilters}
              byCounty={byCounty}
              counties={counties}
              facilities={facilities}
              allRows={allRows}
              onRunSaved={runSaved}
            />
            {loading ? (
              <LoadingCanvas />
            ) : (
              <VisualArea rows={rows} source={source} onOpen={setDrawerRecord} onBarFilter={onBarFilter} />
            )}
          </>
        )}
        {nav === 'saved' && <SavedView allRows={allRows} onRun={runSaved} />}
        {nav === 'connectors' && <ConnectorsView />}
        {nav === 'settings' && <SettingsView />}
      </div>

      <RecordDrawer record={drawerRecord} onClose={() => setDrawerRecord(null)} />
      <AiPanel open={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  )
}
