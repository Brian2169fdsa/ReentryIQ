import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/admin'

export const dynamic = 'force-dynamic'

const configured = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !!process.env.SUPABASE_SERVICE_ROLE_KEY

/** Returns the caller's profile if they are an authenticated admin, else null. */
async function requireAdmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  if (isAdminEmail(user.email)) return user
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  return profile?.role === 'admin' ? user : null
}

async function serviceClient() {
  const { createClient: createServiceClient } = await import('@supabase/supabase-js')
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  )
}

export async function GET() {
  if (!configured()) {
    return NextResponse.json({ error: 'Supabase is not configured', users: [], source: 'demo' }, { status: 200 })
  }
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const svc = await serviceClient()
  const { data, error } = await svc
    .from('profiles')
    .select('id, email, org_name, org_type, role, status, attested_permitted_use, attested_at, created_at')
    .order('created_at', { ascending: false })
    .limit(500)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ users: data, source: 'live' })
}

export async function PATCH(req: Request) {
  if (!configured()) {
    return NextResponse.json({ error: 'Supabase is not configured' }, { status: 400 })
  }
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { id, role, status } = body as { id?: string; role?: string; status?: string }
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const patch: Record<string, string> = { updated_at: new Date().toISOString() }
  if (role && ['admin', 'member'].includes(role)) patch.role = role
  if (status && ['active', 'suspended'].includes(status)) patch.status = status

  // The designated admin account cannot be demoted or suspended.
  const svc = await serviceClient()
  const { data: target } = await svc.from('profiles').select('email').eq('id', id).single()
  if (target && isAdminEmail(target.email) && (patch.role === 'member' || patch.status === 'suspended')) {
    return NextResponse.json({ error: 'The platform admin account cannot be demoted or suspended.' }, { status: 400 })
  }

  const { error } = await svc.from('profiles').update(patch).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
