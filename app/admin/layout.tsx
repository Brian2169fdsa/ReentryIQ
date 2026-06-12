import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/admin'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Without Supabase configured there are no sessions — show the admin UI in
  // demo mode so it can be previewed before launch.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return <>{children}</>
  }

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  if (!isAdminEmail(user.email)) {
    // Accept platform_admins rows (operator allowlist) via the security-definer RPC.
    const { data: isPlatformAdmin } = await supabase.rpc('is_platform_admin')
    if (isPlatformAdmin !== true) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      if (profile?.role !== 'admin') redirect('/dashboard')
    }
  }

  return <>{children}</>
}
