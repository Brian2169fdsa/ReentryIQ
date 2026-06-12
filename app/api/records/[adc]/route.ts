import { NextResponse } from 'next/server'
import { fetchInmateRecord } from '@/lib/inmate-record'
import { getScope, scopeCounties, recordReveal } from '@/lib/scope'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: { adc: string } }) {
  const adc = params.adc.replace(/[^0-9A-Za-z-]/g, '')
  if (!adc) return NextResponse.json({ error: 'Invalid ADC number' }, { status: 400 })

  const scope = getScope()

  // Metered reveal — single chokepoint shared with chat reveals.
  const { allowed } = await recordReveal(scope, adc)
  if (!allowed) return NextResponse.json({ error: 'Record view limit reached' }, { status: 402 })

  const { record, source } = await fetchInmateRecord(adc)
  if (!record) return NextResponse.json({ error: 'Record not found' }, { status: 404 })

  // Scope guard: an org limited to specific counties never sees records
  // whose sentencing county is outside its scope.
  if (scope.counties) {
    const counties = record.sections
      .find(s => s.key === 'sentences')
      ?.rows.map(r => String(r.county ?? '')) ?? []
    const inScope =
      counties.length === 0 || counties.some(c => scopeCounties(scope, c)?.length)
    if (!inScope) return NextResponse.json({ error: 'Record not found' }, { status: 404 })
  }

  return NextResponse.json({ record, source })
}
