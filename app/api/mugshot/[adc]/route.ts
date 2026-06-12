import { NextResponse } from 'next/server'

// Server-side proxy to the scraper's mugshot endpoint. The scraper binds to
// loopback only — the browser can never reach it; this route can (when the app
// runs next to the scraper, or via SCRAPER_BASE_URL pointing at a private
// address). Falls back to a neutral SVG silhouette on any failure.

export const dynamic = 'force-dynamic'

const SCRAPER_BASE_URL = process.env.SCRAPER_BASE_URL ?? 'http://127.0.0.1:8000'

const SILHOUETTE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 120" width="96" height="120">
  <rect width="96" height="120" fill="#EDF2F8"/>
  <circle cx="48" cy="44" r="20" fill="#CBD5E1"/>
  <path d="M16 112c0-20 14.3-32 32-32s32 12 32 32v8H16z" fill="#CBD5E1"/>
</svg>`

function fallback(): NextResponse {
  return new NextResponse(SILHOUETTE, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=300',
      'X-Mugshot': 'fallback',
    },
  })
}

export async function GET(_req: Request, { params }: { params: { adc: string } }) {
  const adc = params.adc.replace(/[^0-9A-Za-z-]/g, '')
  if (!adc) return fallback()

  try {
    const res = await fetch(`${SCRAPER_BASE_URL}/inmate/${adc}/mugshot.jpg`, {
      signal: AbortSignal.timeout(4000),
      cache: 'no-store',
    })
    if (!res.ok) return fallback()
    const body = await res.arrayBuffer()
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': res.headers.get('Content-Type') ?? 'image/jpeg',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    })
  } catch {
    return fallback()
  }
}
