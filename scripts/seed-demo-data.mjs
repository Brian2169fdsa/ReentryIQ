// Seed the Supabase `releases` table with the demo dataset so the app runs on
// "live" data end-to-end. Replace this with your real ADCRR ingestion when ready.
//
// Usage:
//   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-demo-data.mjs
//
// Real-data ingestion follows the exact same shape: map your source rows to the
// columns below and upsert on doc_number.

import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}
const supabase = createClient(url, key)

// ── Same deterministic generator as lib/releases.ts ────────────────────────
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rnd = mulberry32(20260610)
const pick = a => a[Math.floor(rnd() * a.length)]
const between = (lo, hi) => lo + Math.floor(rnd() * (hi - lo + 1))

const FIRST = ['Marcus','Daniel','Andre','Jerome','Travis','Carlos','Devon','Tyler','Brandon','Shawn','Derrick','Antonio','Miguel','Jordan','Keith','Ricardo','Damian','Curtis','Lamar','Victor','Crystal','Tanya','Monica','Jasmine','Rebecca','Sandra','Latoya','Vanessa','Angela','Renee','Dustin','Cody','Wyatt','Hunter','Garrett','Trevor','Mason','Logan','Caleb','Austin']
const LAST = ['Whitfield','Ramos','Delgado','Hawkins','Brennan','Castillo','Okafor','Vega','Sanderson','Pruitt','Mercer','Calloway','Estrada','Tran','Bowen','Acosta','Reyes','Holloway','Salazar','Fontaine','Ackerman','Munoz','Boyd','Cervantes','Driscoll','Yates','Nakamura','Childress','Ibarra','Schaefer','Lott','Aguirre','Booker','Ferrell','Quintero','Mathis','Bautista','Crowder','Espinoza','Tillman']
const FACILITIES = [
  { name: 'ASPC-Lewis', unit: 'Buckley', county: 'Maricopa' },
  { name: 'ASPC-Perryville', unit: 'Santa Cruz', county: 'Maricopa' },
  { name: 'ASPC-Eyman', unit: 'Browning', county: 'Pinal' },
  { name: 'ASPC-Florence', unit: 'Central', county: 'Pinal' },
  { name: 'ASPC-Tucson', unit: 'Rincon', county: 'Pima' },
  { name: 'ASPC-Phoenix', unit: 'Flamenco', county: 'Maricopa' },
  { name: 'ASPC-Yuma', unit: 'Cheyenne', county: 'Yuma' },
  { name: 'ASPC-Douglas', unit: 'Gila', county: 'Cochise' },
  { name: 'ASPC-Safford', unit: 'Graham', county: 'Graham' },
  { name: 'ASPC-Winslow', unit: 'Kaibab', county: 'Navajo' },
]
const COUNTY_WEIGHTS = { Maricopa: 42, Pima: 18, Pinal: 10, Yuma: 6, Cochise: 5, Yavapai: 5, Mohave: 4, Navajo: 4, Graham: 3, Coconino: 3 }
const OFFENSE_CLASS = ['Class 4','Class 5','Class 6','Class 3','Class 2']
const CUSTODY = ['Minimum','Medium','Close']
const SUPERVISION = ['Community Supervision','Standard Probation','Absolute Discharge']

function weightedCounty() {
  const entries = Object.entries(COUNTY_WEIGHTS)
  const total = entries.reduce((s, [, w]) => s + w, 0)
  let r = rnd() * total
  for (const [c, w] of entries) if ((r -= w) <= 0) return c
  return 'Maricopa'
}

const TODAY = new Date()
TODAY.setHours(0, 0, 0, 0)
const DAY_MS = 86400000

function dayVolume(d) {
  const date = new Date(TODAY.getTime() + d * DAY_MS)
  const dow = date.getDay()
  let base = 4.2
  if (dow === 0 || dow === 6) base *= 0.35
  base *= 1 + 0.35 * Math.sin((d / 180) * Math.PI * 2)
  base *= 1 + 0.18 * Math.sin((d / 30) * Math.PI * 2)
  base += (rnd() - 0.5) * 1.4
  return Math.max(0, Math.round(base))
}

const rows = []
for (let d = 0; d < 180; d++) {
  const n = dayVolume(d)
  const releaseDate = new Date(TODAY.getTime() + d * DAY_MS).toISOString().slice(0, 10)
  for (let k = 0; k < n; k++) {
    const fac = pick(FACILITIES)
    const county = rnd() < 0.62 ? fac.county : weightedCounty()
    rows.push({
      first_name: pick(FIRST),
      last_name: pick(LAST),
      doc_number: String(between(180000, 399999)),
      county,
      facility: fac.name,
      unit: fac.unit,
      release_date: releaseDate,
      offense_class: pick(OFFENSE_CLASS),
      custody: pick(CUSTODY),
      supervision: pick(SUPERVISION),
      sentence_years: between(6, 96) / 12,
      match_score: Math.min(99, Math.max(31, Math.round(58 + (rnd() - 0.5) * 50 + (county === 'Maricopa' ? 8 : 0)))),
      age: between(21, 58),
    })
  }
}

console.log(`Seeding ${rows.length} demo releases…`)
for (let i = 0; i < rows.length; i += 500) {
  const { error } = await supabase.from('releases').insert(rows.slice(i, i + 500))
  if (error) {
    console.error('Insert failed:', error.message)
    process.exit(1)
  }
  console.log(`  ${Math.min(i + 500, rows.length)} / ${rows.length}`)
}
console.log('Done. The app will now show source: live.')
