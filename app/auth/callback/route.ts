import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  // If Supabase env is not configured or there's no code, redirect to dashboard
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || !code) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = createClient()
    await supabase.auth.exchangeCodeForSession(code)
  } catch {
    // If exchange fails, still redirect to dashboard — don't crash
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.redirect(new URL('/dashboard', request.url))
}
