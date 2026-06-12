// Whitelisted, parameterized release queries — the ONLY query surface the AI
// chat can use. The model picks filters; it never writes SQL. Every call is
// scoped through lib/scope.ts. Reads the `records` view when present, then
// the `releases` table, then the demo dataset.

import { resolveAccess, clampCounties, type Access } from '@/lib/data-gate'
import { RECORDS } from '@/lib/releases'

export interface QueryParams {
  intent: 'count' | 'list' | 'breakdown'
  group_by?: 'county' | 'complex' | 'status' | 'week' | 'score_band'
  county?: string
  complex?: string
  status?: string
  window_days_from?: number
  window_days_to?: number
  min_score?: number
  limit?: number
}

export interface QueryRow {
  adc_number: string
  name: string
  county: string
  complex: string
  status: string
  release_date: string
  days_out: number
  score: number
}

export interface QueryResult {
  intent: QueryParams['intent']
  total: number
  rows?: QueryRow[]
  breakdown?: { label: string; count: number }[]
  window: { from: string; to: string }
  scope_note: string
  source: 'live' | 'demo'
}

const DAY_MS = 86400000

function isoPlusDays(days: number) {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return new Date(d.getTime() + days * DAY_MS).toISOString().slice(0, 10)
}

const configured = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function loadRows(access: Access, p: QueryParams): Promise<{ rows: QueryRow[]; source: 'live' | 'demo' }> {
  const from = isoPlusDays(Math.max(0, p.window_days_from ?? 0))
  const to = isoPlusDays(Math.min(730, p.window_days_to ?? 180))
  const counties = clampCounties(access, p.county ?? null)

  // SAMPLE-mode orgs never touch live tables — the gate decides, not the model.
  if (access.mode === 'real' && configured()) {
    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = createClient()
      // Prefer the `records` view; fall back to `releases`.
      for (const rel of ['records', 'releases']) {
        let q = supabase
          .from(rel)
          .select('*')
          .gte('release_date', from)
          .lte('release_date', to)
          .order('release_date', { ascending: true })
          .limit(5000)
        if (counties && counties.length === 1) q = q.ilike('county', `%${counties[0]}%`)
        if (p.complex) q = q.ilike('facility', `%${p.complex}%`)
        const { data, error } = await q
        if (error || !data || data.length === 0) continue
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        let rows: QueryRow[] = data.map((d: Record<string, unknown>) => ({
          adc_number: String(d.adc_number ?? d.doc_number ?? d.id ?? ''),
          name: String(d.name ?? `${d.first_name ?? ''} ${d.last_name ?? ''}`).trim(),
          county: String(d.county ?? ''),
          complex: String(d.complex ?? d.facility ?? ''),
          status: String(d.status ?? 'Active'),
          release_date: String(d.release_date ?? ''),
          days_out: Math.round((new Date(String(d.release_date) + 'T00:00:00').getTime() - today.getTime()) / DAY_MS),
          score: Number(d.match_score ?? d.score ?? 0),
        }))
        if (counties && counties.length > 1) rows = rows.filter(r => counties.some(c => r.county.toLowerCase() === c.toLowerCase()))
        if (p.status) rows = rows.filter(r => r.status.toLowerCase() === p.status!.toLowerCase())
        if (p.min_score) rows = rows.filter(r => r.score >= p.min_score!)
        return { rows, source: 'live' }
      }
    } catch {
      // fall through
    }
  }

  // Demo fallback
  let rows: QueryRow[] = RECORDS.map(r => ({
    adc_number: r.docNumber,
    name: r.name,
    county: r.county,
    complex: r.facility,
    status: 'Active',
    release_date: r.releaseDate,
    days_out: r.releaseDayIdx,
    score: r.score,
  })).filter(r => r.release_date >= from && r.release_date <= to)
  if (counties) rows = rows.filter(r => counties.some(c => r.county.toLowerCase() === c.toLowerCase()))
  if (p.complex) rows = rows.filter(r => r.complex.toLowerCase().includes(p.complex!.toLowerCase()))
  if (p.status && p.status.toLowerCase() !== 'active') rows = []
  if (p.min_score) rows = rows.filter(r => r.score >= p.min_score!)
  return { rows, source: 'demo' }
}

export async function runQueryReleases(p: QueryParams): Promise<QueryResult> {
  const access = await resolveAccess()
  const { rows, source } = await loadRows(access, p)
  const from = isoPlusDays(Math.max(0, p.window_days_from ?? 0))
  const to = isoPlusDays(Math.min(730, p.window_days_to ?? 180))
  const base = {
    window: { from, to },
    scope_note:
      access.mode === 'sample'
        ? 'Sample data — org not yet entitled to live records'
        : access.counties
          ? `Scoped to ${access.counties.join(', ')}`
          : 'Statewide scope',
    source,
  }

  if (p.intent === 'breakdown') {
    const dim = p.group_by ?? 'county'
    const counts: Record<string, number> = {}
    for (const r of rows) {
      let key: string
      if (dim === 'county') key = r.county || '—'
      else if (dim === 'complex') key = r.complex || '—'
      else if (dim === 'status') key = r.status || '—'
      else if (dim === 'score_band') key = r.score >= 90 ? '90+' : r.score >= 80 ? '80–89' : r.score >= 70 ? '70–79' : r.score >= 60 ? '60–69' : r.score >= 50 ? '50–59' : '<50'
      else {
        const weekStart = new Date()
        weekStart.setHours(0, 0, 0, 0)
        key = `Week of ${isoPlusDays(Math.floor(r.days_out / 7) * 7)}`
        void weekStart
      }
      counts[key] = (counts[key] ?? 0) + 1
    }
    return {
      ...base,
      intent: 'breakdown',
      total: rows.length,
      breakdown: Object.entries(counts)
        .sort((a, b) => (dim === 'week' ? a[0].localeCompare(b[0]) : b[1] - a[1]))
        .map(([label, count]) => ({ label, count })),
    }
  }

  if (p.intent === 'list') {
    const limit = Math.min(25, Math.max(1, p.limit ?? 10))
    return { ...base, intent: 'list', total: rows.length, rows: rows.slice(0, limit) }
  }

  return { ...base, intent: 'count', total: rows.length }
}
