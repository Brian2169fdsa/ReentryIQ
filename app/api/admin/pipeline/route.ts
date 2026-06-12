import { NextResponse } from 'next/server'
import { configured, requireAdmin, serviceClient } from '../_lib'

export const dynamic = 'force-dynamic'

export interface PipelinePayload {
  scraper: 'operational' | 'unreachable'
  last_sync: string | null
  inmates: number | null
  detail: string
  source: 'live' | 'demo'
}

async function probeScraper(): Promise<{ ok: boolean; body: Record<string, unknown> | null }> {
  const base = process.env.SCRAPER_BASE_URL ?? 'http://127.0.0.1:8000'
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 3000)
  try {
    const res = await fetch(`${base}/health`, { signal: controller.signal, cache: 'no-store' })
    if (!res.ok) return { ok: false, body: null }
    const body = (await res.json().catch(() => null)) as Record<string, unknown> | null
    return { ok: true, body }
  } catch {
    return { ok: false, body: null }
  } finally {
    clearTimeout(timer)
  }
}

export async function GET() {
  if (!configured()) {
    // Demo: scraper unreachable is the expected local state.
    const probe = await probeScraper()
    return NextResponse.json({
      scraper: probe.ok ? 'operational' : 'unreachable',
      last_sync: probe.ok ? new Date().toISOString() : '2026-06-12T06:00:00Z',
      inmates: 18432,
      detail: probe.ok ? 'Scraper responded to /health.' : 'Scraper not reachable — expected without a running worker.',
      source: 'demo',
    } satisfies PipelinePayload)
  }

  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const probe = await probeScraper()

  let inmates: number | null = null
  try {
    const svc = await serviceClient()
    const { count } = await svc.from('inmates').select('id', { count: 'exact', head: true })
    inmates = count ?? null
  } catch {
    inmates = null
  }

  const lastSync = (probe.body?.last_sync as string | undefined)
    ?? (probe.body?.lastSync as string | undefined)
    ?? (probe.ok ? new Date().toISOString() : null)

  return NextResponse.json({
    scraper: probe.ok ? 'operational' : 'unreachable',
    last_sync: lastSync ?? null,
    inmates,
    detail: probe.ok ? 'Scraper responded to /health.' : 'Scraper /health did not respond within 3s.',
    source: 'live',
  } satisfies PipelinePayload)
}
