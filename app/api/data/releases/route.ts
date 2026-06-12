import { NextResponse } from 'next/server'
import { resolveAccess } from '@/lib/data-gate'
import { RECORDS } from '@/lib/releases'

export const dynamic = 'force-dynamic'

// The ONLY release feed the dashboard reads. Sample vs real is decided here,
// server-side, by the data gate — never by the client.

function sampleRows() {
  return RECORDS.map(r => ({
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
  }))
}

export async function GET() {
  const access = await resolveAccess()

  if (access.mode === 'real') {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
        auth: { persistSession: false },
      })
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      for (const rel of ['records', 'releases']) {
        let q = admin
          .from(rel)
          .select('*')
          .gte('release_date', today.toISOString().slice(0, 10))
          .order('release_date', { ascending: true })
          .limit(5000)
        if (access.counties?.length) q = q.in('county', access.counties)
        const { data, error } = await q
        if (error || !data?.length) continue
        const rows = data.map((d: Record<string, unknown>) => ({
          id: String(d.id ?? d.adc_number ?? d.doc_number ?? ''),
          doc_number: String(d.adc_number ?? d.doc_number ?? ''),
          first_name: String(d.first_name ?? ''),
          last_name: String(d.last_name ?? ''),
          name: String(d.name ?? `${d.first_name ?? ''} ${d.last_name ?? ''}`).trim(),
          county: String(d.county ?? ''),
          facility: String(d.complex ?? d.facility ?? ''),
          unit: String(d.unit ?? ''),
          release_date: String(d.release_date ?? ''),
          days_out: Math.round((new Date(String(d.release_date) + 'T00:00:00').getTime() - today.getTime()) / 86400000),
          offense_class: String(d.offense_class ?? ''),
          custody: String(d.custody ?? d.custody_class ?? ''),
          supervision: String(d.supervision ?? d.release_type ?? ''),
          sentence_years: Number(d.sentence_years ?? 0),
          score: Number(d.match_score ?? d.score ?? 0),
          age: Number(d.age ?? 0),
        }))
        return NextResponse.json({ rows, mode: 'real', org: access.orgName })
      }
    } catch {
      // fall through — an entitled org with an unreachable table degrades to
      // sample rather than erroring, still labeled as sample.
    }
  }

  return NextResponse.json({ rows: sampleRows(), mode: 'sample', reason: access.reason })
}
