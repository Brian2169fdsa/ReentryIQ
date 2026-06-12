// Synthetic release records used when Supabase isn't configured or the
// `releases` table doesn't exist yet, so the agent demos end-to-end.

function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rnd = mulberry32(20260612)

const FIRST = ['Marcus', 'David', 'Anthony', 'James', 'Robert', 'Michael', 'Carlos', 'Jose', 'Daniel', 'Christopher', 'Brandon', 'Eric', 'Kevin', 'Steven', 'Ryan', 'Angel', 'Juan', 'Luis', 'Tyler', 'Aaron', 'Maria', 'Jessica', 'Ashley', 'Amanda', 'Sarah', 'Nicole', 'Crystal', 'Vanessa']
const LAST = ['Johnson', 'Williams', 'Garcia', 'Martinez', 'Rodriguez', 'Hernandez', 'Smith', 'Brown', 'Davis', 'Miller', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'White', 'Ramirez', 'Torres', 'Flores', 'Rivera', 'Gomez', 'Diaz', 'Reyes']
const FACILITIES = ['ASPC-Eyman', 'ASPC-Florence', 'ASPC-Lewis', 'ASPC-Perryville', 'ASPC-Phoenix', 'ASPC-Tucson', 'ASPC-Yuma', 'ASPC-Douglas', 'ASPC-Safford', 'ASPC-Winslow']
const OFFENSE_CLASSES = ['Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6']

const COUNTY_WEIGHTS: [string, number][] = [
  ['Maricopa', 42], ['Pima', 18], ['Pinal', 10], ['Yuma', 6], ['Cochise', 5],
  ['Yavapai', 5], ['Mohave', 4], ['Navajo', 4], ['Graham', 3], ['Coconino', 3],
]

function weightedCounty() {
  const total = COUNTY_WEIGHTS.reduce((s, [, w]) => s + w, 0)
  let r = rnd() * total
  for (const [c, w] of COUNTY_WEIGHTS) {
    if ((r -= w) <= 0) return c
  }
  return 'Maricopa'
}

export interface DemoRelease {
  id: number
  first_name: string
  last_name: string
  county: string
  facility: string
  release_date: string
  offense_class: string
  match_score: number
}

const BASE = new Date(2026, 5, 12) // June 12 2026
const DAY_MS = 86400000

export const DEMO_RELEASES: DemoRelease[] = Array.from({ length: 640 }, (_, i) => {
  const daysOut = Math.floor(rnd() * rnd() * 180) // front-loaded toward near-term
  const d = new Date(BASE.getTime() + daysOut * DAY_MS)
  return {
    id: i + 1,
    first_name: FIRST[Math.floor(rnd() * FIRST.length)],
    last_name: LAST[Math.floor(rnd() * LAST.length)],
    county: weightedCounty(),
    facility: FACILITIES[Math.floor(rnd() * FACILITIES.length)],
    release_date: d.toISOString().slice(0, 10),
    offense_class: OFFENSE_CLASSES[Math.floor(rnd() * OFFENSE_CLASSES.length)],
    match_score: 40 + Math.floor(rnd() * 59),
  }
}).sort((a, b) => a.release_date.localeCompare(b.release_date))

export function demoSearch(opts: {
  county?: string
  name?: string
  from_date?: string
  to_date?: string
  facility?: string
  limit?: number
}) {
  let rows = DEMO_RELEASES
  if (opts.county) rows = rows.filter(r => r.county.toLowerCase().includes(opts.county!.toLowerCase()))
  if (opts.facility) rows = rows.filter(r => r.facility.toLowerCase().includes(opts.facility!.toLowerCase()))
  if (opts.from_date) rows = rows.filter(r => r.release_date >= opts.from_date!)
  if (opts.to_date) rows = rows.filter(r => r.release_date <= opts.to_date!)
  if (opts.name) {
    const q = opts.name.toLowerCase()
    rows = rows.filter(r => r.first_name.toLowerCase().includes(q) || r.last_name.toLowerCase().includes(q))
  }
  return rows.slice(0, opts.limit ?? 20)
}

export function demoFilter(opts: { county?: string; from_date?: string; to_date?: string }) {
  let rows = DEMO_RELEASES
  if (opts.county) rows = rows.filter(r => r.county.toLowerCase().includes(opts.county!.toLowerCase()))
  if (opts.from_date) rows = rows.filter(r => r.release_date >= opts.from_date!)
  if (opts.to_date) rows = rows.filter(r => r.release_date <= opts.to_date!)
  return rows
}
