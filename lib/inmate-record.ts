// Full inmate record loader for the slide-out panel.
// Mirrors the scraper's SECTION_SCHEMAS layout: header → release block →
// demographics → custody/location → seven child record tables, plus raw jsonb
// for anything not promoted. Reads Supabase `inmates` + child tables keyed on
// adc_number; falls back to a deterministic demo record set (including test
// record ADC 380700, Vallene Smith) when the schema isn't reachable.

import { RECORDS } from '@/lib/releases'

export interface InmateRecord {
  adc_number: string
  last_name: string
  first_name: string
  middle_initial: string | null
  status: string | null            // Active | Inactive | Released | Hold | Deceased
  custody_class: string | null
  // Release block
  prison_release_date: string | null
  release_type: string | null
  admission_date: string | null
  projected_eligible_release_date: string | null
  // Demographics
  gender: string | null
  age: number | null
  height: string | null
  weight: string | null
  hair: string | null
  eye: string | null
  ethnic_origin: string | null
  // Custody & location
  complex: string | null
  unit: string | null
  last_movement: string | null
  as_of_date: string | null
  // Child tables, in SECTION_SCHEMAS order
  sections: InmateSection[]
  raw: Record<string, unknown> | null
}

export interface InmateSection {
  key: string
  title: string
  rows: Record<string, unknown>[]
}

/** SECTION_SCHEMAS order — authoritative section list and Supabase table names. */
export const SECTION_TABLES: { key: string; title: string; table: string }[] = [
  { key: 'sentences', title: 'Commitment & Sentences', table: 'inmate_sentences' },
  { key: 'disciplinary', title: 'Disciplinary Infractions', table: 'inmate_disciplinary' },
  { key: 'appeals', title: 'Disciplinary Appeals', table: 'inmate_disciplinary_appeals' },
  { key: 'classification', title: 'Profile Classification', table: 'inmate_classifications' },
  { key: 'parole', title: 'Parole Actions', table: 'inmate_parole_actions' },
  { key: 'work', title: 'Work Programs', table: 'inmate_work_programs' },
  { key: 'detainers', title: 'Detainers / Warrants', table: 'inmate_detainers' },
]

const configured = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function fetchInmateRecord(
  adc: string,
): Promise<{ record: InmateRecord | null; source: 'live' | 'demo' }> {
  if (configured()) {
    try {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = createClient()
      const { data: inmate, error } = await supabase
        .from('inmates')
        .select('*')
        .eq('adc_number', adc)
        .maybeSingle()

      if (!error && inmate) {
        const sections: InmateSection[] = []
        for (const s of SECTION_TABLES) {
          const { data } = await supabase.from(s.table).select('*').eq('adc_number', adc).limit(200)
          sections.push({
            key: s.key,
            title: s.title,
            rows: (data ?? []).map(r => {
              const { adc_number: _a, id: _i, ...rest } = r as Record<string, unknown>
              return rest
            }),
          })
        }
        const i = inmate as Record<string, unknown>
        return {
          source: 'live',
          record: {
            adc_number: String(i.adc_number),
            last_name: String(i.last_name ?? ''),
            first_name: String(i.first_name ?? ''),
            middle_initial: (i.middle_initial as string) ?? null,
            status: (i.status as string) ?? null,
            custody_class: (i.custody_class as string) ?? (i.custody as string) ?? null,
            prison_release_date: (i.prison_release_date as string) ?? null,
            release_type: (i.release_type as string) ?? null,
            admission_date: (i.admission_date as string) ?? null,
            projected_eligible_release_date: (i.projected_eligible_release_date as string) ?? null,
            gender: (i.gender as string) ?? null,
            age: (i.age as number) ?? null,
            height: (i.height as string) ?? null,
            weight: (i.weight as string) ?? null,
            hair: (i.hair as string) ?? null,
            eye: (i.eye as string) ?? null,
            ethnic_origin: (i.ethnic_origin as string) ?? null,
            complex: (i.complex as string) ?? (i.facility as string) ?? null,
            unit: (i.unit as string) ?? null,
            last_movement: (i.last_movement as string) ?? null,
            as_of_date: (i.as_of_date as string) ?? null,
            sections,
            raw: (i.raw as Record<string, unknown>) ?? null,
          },
        }
      }
    } catch {
      // fall through to demo
    }
  }
  return { record: demoRecord(adc), source: 'demo' }
}

/* ── Demo fallback ─────────────────────────────────────────────── */

/** Synthetic-only path — used directly by sample-mode callers (data gate). */
export function demoRecord(adc: string): InmateRecord | null {
  if (adc === '380700') return VALLENE_SMITH

  const r = RECORDS.find(x => x.docNumber === adc)
  if (!r) return null
  return {
    adc_number: r.docNumber,
    last_name: r.last,
    first_name: r.first,
    middle_initial: null,
    status: 'Active',
    custody_class: r.custody,
    prison_release_date: r.releaseDate,
    release_type: r.supervision,
    admission_date: addYears(r.releaseDate, -Math.max(1, Math.round(r.sentenceYears))),
    projected_eligible_release_date: r.releaseDate,
    gender: null,
    age: r.age,
    height: null,
    weight: null,
    hair: null,
    eye: null,
    ethnic_origin: null,
    complex: r.facility,
    unit: r.unit,
    last_movement: null,
    as_of_date: new Date().toISOString().slice(0, 10),
    sections: SECTION_TABLES.map(s => ({ key: s.key, title: s.title, rows: [] })),
    raw: null,
  }
}

function addYears(iso: string, years: number) {
  const d = new Date(iso + 'T00:00:00')
  d.setFullYear(d.getFullYear() + years)
  return d.toISOString().slice(0, 10)
}

/** Test record per spec: ADC 380700, Vallene Smith. Fictional sample data. */
const VALLENE_SMITH: InmateRecord = {
  adc_number: '380700',
  last_name: 'Smith',
  first_name: 'Vallene',
  middle_initial: 'R',
  status: 'Active',
  custody_class: 'Medium',
  prison_release_date: '2026-08-14',
  release_type: 'Community Supervision',
  admission_date: '2023-02-09',
  projected_eligible_release_date: '2026-07-30',
  gender: 'Female',
  age: 34,
  height: `5'06"`,
  weight: '142 lbs',
  hair: 'Brown',
  eye: 'Brown',
  ethnic_origin: 'Caucasian',
  complex: 'ASPC-Perryville',
  unit: 'Santa Cruz',
  last_movement: 'Unit transfer — Santa Cruz',
  as_of_date: '2026-06-11',
  sections: [
    {
      key: 'sentences',
      title: 'Commitment & Sentences',
      rows: [
        { county: 'Maricopa', cause_number: 'CR2022-148503', offense: 'Poss. of Dangerous Drugs', class: 'Class 4', sentence: '3.5 years', date_of_offense: '2022-08-17', sentence_begin: '2023-02-09' },
        { county: 'Maricopa', cause_number: 'CR2021-119276', offense: 'Theft of Means of Transport', class: 'Class 3', sentence: '2.5 years (concurrent)', date_of_offense: '2021-11-02', sentence_begin: '2023-02-09' },
      ],
    },
    {
      key: 'disciplinary',
      title: 'Disciplinary Infractions',
      rows: [
        { date: '2024-03-22', violation: 'Disobeying a verbal order', class: 'Minor', disposition: 'Guilty', penalty: 'Loss of privileges 15 days' },
      ],
    },
    { key: 'appeals', title: 'Disciplinary Appeals', rows: [] },
    {
      key: 'classification',
      title: 'Profile Classification',
      rows: [
        { date: '2025-09-04', custody: 'Medium', internal_risk: '3', public_risk: '2', review_type: 'Annual' },
        { date: '2024-09-06', custody: 'Medium', internal_risk: '3', public_risk: '3', review_type: 'Annual' },
      ],
    },
    {
      key: 'parole',
      title: 'Parole Actions',
      rows: [
        { hearing_date: '2026-04-15', action: 'Community Supervision certified', result: 'Approved', next_review: null },
      ],
    },
    {
      key: 'work',
      title: 'Work Programs',
      rows: [
        { program: 'Kitchen services', assignment_date: '2024-06-01', status: 'Active', hours_week: 30 },
        { program: 'GED coursework', assignment_date: '2023-08-14', status: 'Completed', hours_week: 10 },
      ],
    },
    { key: 'detainers', title: 'Detainers / Warrants', rows: [] },
  ],
  raw: null,
}
