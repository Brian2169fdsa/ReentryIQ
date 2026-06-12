// Single data access layer for release records.
// Uses Supabase when configured; falls back to the deterministic demo dataset
// so every page works end-to-end before real data lands.
//
// To connect real data: set NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY,
// run supabase/migrations/*.sql, then load rows into `public.releases`
// (see scripts/seed-demo-data.mjs for the expected shape).

import { RECORDS, type ReleaseRecord } from '@/lib/releases'

export interface Release {
  id: string
  doc_number: string
  first_name: string
  last_name: string
  name: string
  county: string
  facility: string
  unit: string
  release_date: string
  /** Days from "today" until release (computed) */
  days_out: number
  offense_class: string
  custody: string
  supervision: string
  sentence_years: number
  score: number
  age: number
}

export type DataSource = 'live' | 'demo'

function fromDemo(r: ReleaseRecord): Release {
  return {
    id: r.id,
    doc_number: r.docNumber,
    first_name: r.first,
    last_name: r.last,
    name: r.name,
    county: r.county,
    facility: r.facility,
    unit: r.unit,
    release_date: r.releaseDate,
    days_out: r.releaseDayIdx,
    offense_class: r.offenseClass,
    custody: r.custody,
    supervision: r.supervision,
    sentence_years: r.sentenceYears,
    score: r.score,
    age: r.age,
  }
}

function daysFromToday(iso: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(iso + 'T00:00:00')
  return Math.round((d.getTime() - today.getTime()) / 86400000)
}

export const supabaseConfigured = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/**
 * Fetch all upcoming releases. Client-safe (anon key + RLS).
 * Falls back to demo data if Supabase is unset, errors, or has no rows.
 */
export async function fetchReleases(): Promise<{ rows: Release[]; source: DataSource }> {
  if (supabaseConfigured()) {
    try {
      const { createBrowserClient } = await import('@supabase/ssr')
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )
      const { data, error } = await supabase
        .from('releases')
        .select('*')
        .gte('release_date', new Date().toISOString().slice(0, 10))
        .order('release_date', { ascending: true })
        .limit(5000)
      if (!error && data && data.length > 0) {
        const rows: Release[] = data.map((d: Record<string, unknown>) => ({
          id: String(d.id),
          doc_number: String(d.doc_number ?? ''),
          first_name: String(d.first_name ?? ''),
          last_name: String(d.last_name ?? ''),
          name: `${d.first_name ?? ''} ${d.last_name ?? ''}`.trim(),
          county: String(d.county ?? ''),
          facility: String(d.facility ?? ''),
          unit: String(d.unit ?? ''),
          release_date: String(d.release_date ?? ''),
          days_out: daysFromToday(String(d.release_date ?? '')),
          offense_class: String(d.offense_class ?? ''),
          custody: String(d.custody ?? ''),
          supervision: String(d.supervision ?? ''),
          sentence_years: Number(d.sentence_years ?? 0),
          score: Number(d.match_score ?? d.score ?? 0),
          age: Number(d.age ?? 0),
        }))
        return { rows, source: 'live' }
      }
    } catch {
      // fall through to demo
    }
  }
  return { rows: RECORDS.map(fromDemo), source: 'demo' }
}
