// Deterministic PRNG so data is stable across server renders and client hydration.
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rnd = mulberry32(20260610)
const pick = <T>(arr: T[]): T => arr[Math.floor(rnd() * arr.length)]
const between = (lo: number, hi: number) => lo + Math.floor(rnd() * (hi - lo + 1))

const TODAY = new Date(2026, 5, 10) // June 10 2026
const DAY_MS = 86400000
const HORIZON_DAYS = 180

const COUNTY_WEIGHTS: Record<string, number> = {
  Maricopa: 42, Pima: 18, Pinal: 10, Yuma: 6, Cochise: 5,
  Yavapai: 5, Mohave: 4, Navajo: 4, Graham: 3, Coconino: 3,
}

function weightedCounty() {
  const entries = Object.entries(COUNTY_WEIGHTS)
  const total = entries.reduce((s, [, w]) => s + w, 0)
  let r = rnd() * total
  for (const [c, w] of entries) {
    if ((r -= w) <= 0) return c
  }
  return 'Maricopa'
}

function dayVolume(dayIdx: number) {
  const date = new Date(TODAY.getTime() + dayIdx * DAY_MS)
  const dow = date.getDay()
  let base = 4.2
  if (dow === 0 || dow === 6) base *= 0.35
  base *= 1 + 0.35 * Math.sin((dayIdx / 180) * Math.PI * 2.0)
  base *= 1 + 0.18 * Math.sin((dayIdx / 30) * Math.PI * 2.0)
  base += (rnd() - 0.5) * 1.4
  return Math.max(0, Math.round(base))
}

const dailyCounts: { dayIdx: number; date: string; count: number }[] = []
for (let d = 0; d < HORIZON_DAYS; d++) {
  const date = new Date(TODAY.getTime() + d * DAY_MS)
  dailyCounts.push({
    dayIdx: d,
    date: date.toISOString().slice(0, 10),
    count: dayVolume(d),
  })
}

// Landing page horizon: amplified for visual drama
export const HORIZON_BARS = dailyCounts.map(d => ({
  count: d.count * 12 + 18 + (d.dayIdx % 6) * 4,
}))

export const TOTAL_RELEASES = dailyCounts.reduce((s, d) => s + d.count, 0)

export const TODAY_DATE = TODAY

// County colors match the prototype
export const COUNTY_COLORS: Record<string, string> = {
  Maricopa: '#4A90E2',
  Pima:     '#7FB0E8',
  Pinal:    '#2E8B6E',
  Yavapai:  '#E0A33A',
  Other:    '#94A3B8',
}

export const COUNTY_DATA = [
  { label: 'Maricopa', value: 317, pct: '52%', color: COUNTY_COLORS.Maricopa },
  { label: 'Pima',     value: 142, pct: '23%', color: COUNTY_COLORS.Pima },
  { label: 'Pinal',    value: 68,  pct: '11%', color: COUNTY_COLORS.Pinal },
  { label: 'Yavapai',  value: 42,  pct: '7%',  color: COUNTY_COLORS.Yavapai },
  { label: 'Other',    value: 43,  pct: '7%',  color: COUNTY_COLORS.Other },
]

export const LINE_SERIES = [
  { label: 'Maricopa', color: COUNTY_COLORS.Maricopa, points: [78, 84, 92, 88, 96, 104, 99, 108, 102, 110, 106, 101] },
  { label: 'Pima',     color: COUNTY_COLORS.Pima,     points: [44, 47, 52, 49, 55, 58, 54, 60, 57, 62, 59, 56] },
  { label: 'Pinal',    color: COUNTY_COLORS.Pinal,    points: [30, 33, 31, 36, 34, 39, 37, 41, 38, 43, 40, 38] },
  { label: 'Yavapai',  color: COUNTY_COLORS.Yavapai,  points: [16, 18, 17, 19, 18, 20, 19, 21, 20, 22, 21, 20] },
  { label: 'Other',    color: COUNTY_COLORS.Other,    points: [9, 10, 9, 11, 10, 11, 10, 12, 11, 12, 11, 11] },
]

export const LINE_LABELS = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
