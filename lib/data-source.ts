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
 * Fetch all upcoming releases THROUGH THE SERVER-SIDE DATA GATE
 * (/api/data/releases → lib/data-gate.ts). The client never decides sample
 * vs real and never queries release tables directly. source: 'live' only when
 * the caller's org is entitled (active/comped + attested); everything else is
 * the sample dataset, which the UI labels with the "Sample data" pill.
 */
export async function fetchReleases(): Promise<{ rows: Release[]; source: DataSource }> {
  try {
    const res = await fetch('/api/data/releases', { cache: 'no-store' })
    if (res.ok) {
      const d = await res.json()
      if (Array.isArray(d.rows) && d.rows.length) {
        return { rows: d.rows as Release[], source: d.mode === 'real' ? 'live' : 'demo' }
      }
    }
  } catch {
    // fall through to local sample
  }
  return { rows: RECORDS.map(fromDemo), source: 'demo' }
}
