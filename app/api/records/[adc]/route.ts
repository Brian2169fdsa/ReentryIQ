import { NextResponse } from 'next/server'
import { fetchInmateRecord, demoRecord } from '@/lib/inmate-record'
import { resolveAccess, clampCounties, meterReveal } from '@/lib/data-gate'

export const dynamic = 'force-dynamic'

// Full-record reveal. Sample-mode callers (free/trial/unattested) can ONLY
// ever receive synthetic records — never a row from the live inmates tables.
// Real-mode reveals meter once per org+record+period via the shared dedupe.

export async function GET(_req: Request, { params }: { params: { adc: string } }) {
  const adc = params.adc.replace(/[^0-9A-Za-z-]/g, '')
  if (!adc) return NextResponse.json({ error: 'Invalid ADC number' }, { status: 400 })

  const access = await resolveAccess()

  if (access.mode !== 'real') {
    // Sample mode: serve only the synthetic dataset. A sample-mode caller
    // probing a real ADC number gets 404, not data.
    const record = demoRecord(adc)
    if (!record) return NextResponse.json({ error: 'Record not found' }, { status: 404 })
    return NextResponse.json({ record, source: 'demo' })
  }

  const { record, source } = await fetchInmateRecord(adc)
  if (!record) return NextResponse.json({ error: 'Record not found' }, { status: 404 })

  // Scope guard: sentencing counties outside the org's scope are invisible.
  if (access.counties) {
    const counties = record.sections.find(s => s.key === 'sentences')?.rows.map(r => String(r.county ?? '')) ?? []
    const inScope = counties.length === 0 || counties.some(c => clampCounties(access, c)?.length)
    if (!inScope) return NextResponse.json({ error: 'Record not found' }, { status: 404 })
  }

  // Metered reveal — once per org+record+period (record_reveals PK dedupe).
  await meterReveal(access, adc)

  return NextResponse.json({ record, source })
}
