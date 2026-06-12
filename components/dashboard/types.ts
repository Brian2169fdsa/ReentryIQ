import type { Release } from '@/lib/data-source'

export interface Filters {
  q: string
  counties: string[]
  range: { start: number; end: number } | null
  facility: string
  offenseClass: string
  minScore: number
}

export const EMPTY_FILTERS: Filters = {
  q: '',
  counties: [],
  range: null,
  facility: '',
  offenseClass: '',
  minScore: 0,
}

export const WINDOW_CHIPS = [
  { id: 'w30', label: 'Next 30 days', range: { start: 0, end: 29 } },
  { id: 'w90', label: '30–90 days', range: { start: 30, end: 89 } },
  { id: 'w180', label: '90–180 days', range: { start: 90, end: 179 } },
] as const

export const SAVED_SEARCHES = [
  { id: 's1', name: 'Maricopa · score 80+', alert: true, filters: { ...EMPTY_FILTERS, counties: ['Maricopa'], minScore: 80 } },
  { id: 's2', name: 'Pima next 30 days', alert: true, filters: { ...EMPTY_FILTERS, counties: ['Pima'], range: { start: 0, end: 29 } } },
  { id: 's3', name: 'ASPC-Lewis releases', alert: false, filters: { ...EMPTY_FILTERS, facility: 'ASPC-Lewis' } },
]

export const HORIZON_DAYS = 180

export const OFFENSE_CLASSES = ['Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6']

/** Usage meter — fictional plan numbers, single source of truth. */
export const USAGE = { used: 1847, included: 2500 }

export type ViewMode = 'visual' | 'table' | 'compact'
export type VisualMetric = 'next30' | 'county' | 'score'

export function applyFilters(rows: Release[], filters: Filters): Release[] {
  return rows.filter(r => {
    if (filters.q) {
      const q = filters.q.toLowerCase()
      if (!r.name.toLowerCase().includes(q) && !r.doc_number.includes(filters.q)) return false
    }
    if (filters.counties.length && !filters.counties.includes(r.county)) return false
    if (filters.range && (r.days_out < filters.range.start || r.days_out > filters.range.end)) return false
    if (filters.facility && r.facility !== filters.facility) return false
    if (filters.offenseClass && r.offense_class !== filters.offenseClass) return false
    if (filters.minScore > 0 && r.score < filters.minScore) return false
    return true
  })
}

export function fmtDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function fmtLongDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

/** Quintile-graduated blue ramp by intensity (1 = lightest, 5 = darkest). */
export const RAMP = [
  'var(--po-ramp-1)',
  'var(--po-ramp-2)',
  'var(--po-ramp-3)',
  'var(--po-ramp-4)',
  'var(--po-ramp-5)',
] as const

/** Map a value within [0, max] to a ramp color (low -> light, high -> dark). */
export function rampFor(value: number, max: number): string {
  if (max <= 0 || value <= 0) return RAMP[0]
  const idx = Math.max(0, Math.min(4, Math.round((value / max) * 4)))
  return RAMP[idx]
}

export interface ScoreTier {
  label: string
  color: string
  bg: string
  border: string
}

export function scoreTier(score: number): ScoreTier {
  if (score >= 80) return { label: 'Strong', color: 'var(--po-sage)', bg: 'var(--po-sage-wash)', border: 'var(--po-sage-line)' }
  if (score >= 65) return { label: 'Good', color: 'var(--po-blue-700)', bg: 'var(--po-copper-wash)', border: 'var(--po-copper-line)' }
  if (score >= 50) return { label: 'Fair', color: 'var(--po-text-2)', bg: 'var(--po-panel-2)', border: 'var(--po-line)' }
  return { label: 'Low', color: 'var(--po-text-3)', bg: 'var(--po-track)', border: 'var(--po-line)' }
}
