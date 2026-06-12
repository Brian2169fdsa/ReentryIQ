import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/admin'

export const dynamic = 'force-dynamic'

const configured = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !!process.env.SUPABASE_SERVICE_ROLE_KEY

export async function GET() {
  if (!configured()) {
    return NextResponse.json({ source: 'demo' })
  }
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) {
    const { data: profile } = user
      ? await supabase.from('profiles').select('role').eq('id', user.id).single()
      : { data: null }
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { createClient: createServiceClient } = await import('@supabase/supabase-js')
  const svc = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  )

  const [users, attested, releases, counties] = await Promise.all([
    svc.from('profiles').select('id', { count: 'exact', head: true }),
    svc.from('profiles').select('id', { count: 'exact', head: true }).eq('attested_permitted_use', true),
    svc.from('releases').select('id', { count: 'exact', head: true }),
    svc.from('releases').select('county'),
  ])

  const byCounty: Record<string, number> = {}
  for (const row of counties.data ?? []) byCounty[row.county] = (byCounty[row.county] ?? 0) + 1

  return NextResponse.json({
    source: 'live',
    users: users.count ?? 0,
    attested: attested.count ?? 0,
    releases: releases.count ?? 0,
    byCounty: Object.entries(byCounty)
      .sort((a, b) => b[1] - a[1])
      .map(([county, count]) => ({ county, count })),
  })
}
