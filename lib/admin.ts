// Platform admin allowlist. Mirrors public.is_admin_email() in the database
// (supabase/migrations/0003_profiles_admin.sql) — keep the two in sync.

export const ADMIN_EMAILS = ['brianreinhart3617@gmail.com']

export function isAdminEmail(email: string | null | undefined): boolean {
  return !!email && ADMIN_EMAILS.includes(email.toLowerCase())
}
