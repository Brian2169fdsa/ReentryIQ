'use client'

import { useEffect, useMemo, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { fetchReleases, type Release } from '@/lib/data-source'
import { ADMIN_EMAILS } from '@/lib/admin'

/* ── Types ─────────────────────────────────────────────────────── */

interface AdminUser {
  id: string
  email: string
  org_name: string | null
  org_type: string | null
  role: 'admin' | 'member'
  status: 'active' | 'suspended'
  attested_permitted_use: boolean
  attested_at: string | null
  created_at: string
}

const DEMO_USERS: AdminUser[] = [
  { id: 'u1', email: ADMIN_EMAILS[0], org_name: 'Manage AI', org_type: 'Other', role: 'admin', status: 'active', attested_permitted_use: true, attested_at: '2026-06-12T16:00:00Z', created_at: '2026-06-12T16:00:00Z' },
  { id: 'u2', email: 'team@sanctuaryrecovery.org', org_name: 'Sanctuary Recovery', org_type: 'Treatment center', role: 'member', status: 'active', attested_permitted_use: true, attested_at: '2026-06-11T19:21:00Z', created_at: '2026-06-11T19:21:00Z' },
  { id: 'u3', email: 'intake@desertpathways.org', org_name: 'Desert Pathways', org_type: 'Reentry program', role: 'member', status: 'active', attested_permitted_use: true, attested_at: '2026-06-10T22:05:00Z', created_at: '2026-06-10T22:05:00Z' },
  { id: 'u4', email: 'ops@newhorizonliving.com', org_name: 'New Horizon Living', org_type: 'Sober living', role: 'member', status: 'suspended', attested_permitted_use: false, attested_at: null, created_at: '2026-06-09T15:44:00Z' },
]

/* ── Small pieces ──────────────────────────────────────────────── */

function Pill({ children, tone }: { children: React.ReactNode; tone: 'sage' | 'blue' | 'gray' | 'red' }) {
  const map = {
    sage: { bg: 'var(--po-sage-wash)', fg: 'var(--po-sage)', line: 'var(--po-sage-line)' },
    blue: { bg: 'var(--po-copper-wash)', fg: 'var(--po-blue-700)', line: 'var(--po-copper-line)' },
    gray: { bg: 'var(--po-track)', fg: 'var(--po-text-2)', line: 'var(--po-line)' },
    red: { bg: 'rgba(194,94,94,0.10)', fg: '#A14848', line: 'rgba(194,94,94,0.32)' },
  }[tone]
  return (
    <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 600, background: map.bg, color: map.fg, border: `1px solid ${map.line}`, whiteSpace: 'nowrap' }}>
      {children}
    </span>
  )
}

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div className="card" style={{ padding: '14px 16px', flex: 1, minWidth: 150 }}>
      <div className="po-label" style={{ fontSize: 10, marginBottom: 6 }}>{label}</div>
      <div className="po-display" style={{ fontSize: 24, fontWeight: 700, color: accent ?? 'var(--po-text)', lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: 'var(--po-text-3)', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

function fmtDateTime(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/* ── Root ──────────────────────────────────────────────────────── */

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'gauge' },
  { id: 'users', label: 'Users', icon: 'users' },
  { id: 'data', label: 'Data', icon: 'layers' },
]

export function AdminApp() {
  const [tab, setTab] = useState('overview')
  const [users, setUsers] = useState<AdminUser[]>(DEMO_USERS)
  const [usersSource, setUsersSource] = useState<'live' | 'demo'>('demo')
  const [releases, setReleases] = useState<Release[]>([])
  const [releasesSource, setReleasesSource] = useState<'live' | 'demo'>('demo')
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(d => {
        if (d.users?.length) {
          setUsers(d.users)
          setUsersSource(d.source ?? 'demo')
        }
      })
      .catch(() => {})
    fetchReleases().then(({ rows, source }) => {
      setReleases(rows)
      setReleasesSource(source)
    })
  }, [])

  const byCounty = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const r of releases) counts[r.county] = (counts[r.county] ?? 0) + 1
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [releases])

  const attestedCount = users.filter(u => u.attested_permitted_use).length

  async function patchUser(id: string, patch: { role?: string; status?: string }) {
    setBusy(id)
    setError(null)
    if (usersSource === 'demo') {
      // Local-only in demo mode.
      setUsers(us => us.map(u => (u.id === id ? { ...u, ...patch } as AdminUser : u)))
      setBusy(null)
      return
    }
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...patch }),
    })
    const d = await res.json()
    if (!res.ok) setError(d.error ?? 'Update failed')
    else setUsers(us => us.map(u => (u.id === id ? { ...u, ...patch } as AdminUser : u)))
    setBusy(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--po-bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Admin topbar — navy, distinct from the member dashboard */}
      <header style={{ height: 60, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px', background: 'var(--po-navy)', borderBottom: '1px solid rgba(226,232,240,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <a href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" stroke="var(--po-blue)" strokeWidth="1.9" />
              <path d="M8 14.5l2.5-3 2 2.2L16 9" stroke="var(--po-blue)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="po-display" style={{ fontSize: 16, fontWeight: 600, color: '#F1F5F9' }}>
              Reentry<span style={{ color: 'var(--po-blue)', fontWeight: 700 }}>IQ</span>
            </span>
          </a>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0F172A', background: 'var(--po-blue)', padding: '3px 10px', borderRadius: 999 }}>
            Admin
          </span>
          <nav style={{ display: 'flex', gap: 2 }}>
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7, height: 34, padding: '0 13px',
                  borderRadius: 'var(--po-r-sm)', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  background: tab === t.id ? 'rgba(255,255,255,0.10)' : 'transparent',
                  color: tab === t.id ? '#F1F5F9' : '#94A3B8', fontSize: 13, fontWeight: 500,
                }}
              >
                <Icon name={t.icon} size={15} />
                {t.label}
              </button>
            ))}
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {usersSource === 'demo' && (
            <span style={{ fontSize: 11, fontWeight: 600, color: '#E0A33A', border: '1px solid rgba(224,163,58,0.4)', background: 'rgba(224,163,58,0.12)', padding: '3px 10px', borderRadius: 999 }}>
              Demo mode — connect Supabase
            </span>
          )}
          <a href="/dashboard" style={{ fontSize: 13, fontWeight: 500, color: '#94A3B8', textDecoration: 'none' }}>
            ← Member dashboard
          </a>
        </div>
      </header>

      <main style={{ flex: 1, maxWidth: 1100, width: '100%', margin: '0 auto', padding: '26px 24px 60px' }}>
        {error && (
          <div style={{ marginBottom: 16, padding: '11px 14px', borderRadius: 'var(--po-r-sm)', background: 'rgba(194,94,94,0.08)', border: '1px solid rgba(194,94,94,0.35)', color: '#A14848', fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* ── Overview ── */}
        {tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h1 className="po-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--po-text)', margin: 0 }}>Platform overview</h1>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <StatCard label="Accounts" value={String(users.length)} sub={`${users.filter(u => u.status === 'active').length} active`} />
              <StatCard label="Attested" value={`${attestedCount} / ${users.length}`} sub="Permitted-use attestations" accent={attestedCount === users.length ? 'var(--po-sage)' : '#E0A33A'} />
              <StatCard label="Release Records" value={releases.length.toLocaleString()} sub={releasesSource === 'live' ? 'Live database' : 'Demo dataset'} accent="var(--po-blue)" />
              <StatCard label="Data Source" value={releasesSource === 'live' ? 'Live' : 'Demo'} sub={releasesSource === 'live' ? 'Supabase connected' : 'Awaiting real data'} accent={releasesSource === 'live' ? 'var(--po-sage)' : undefined} />
            </div>

            <div className="card" style={{ padding: '16px 18px' }}>
              <h2 className="po-display" style={{ fontSize: 15, fontWeight: 600, color: 'var(--po-text)', margin: '0 0 12px' }}>Go-live checklist</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {[
                  { done: true, label: 'Site, dashboard, AI assistant, and auth deployed' },
                  { done: usersSource === 'live', label: 'Supabase connected (URL, anon key, service role key in Vercel)' },
                  { done: usersSource === 'live', label: 'Migrations 0001–0003 run in the Supabase SQL editor' },
                  { done: releasesSource === 'live', label: 'Real release data loaded into public.releases' },
                  { done: false, label: 'Legal pages reviewed by counsel' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: item.done ? 'var(--po-text-2)' : 'var(--po-text)' }}>
                    <span style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: item.done ? 'var(--po-sage-wash)' : 'var(--po-track)', border: `1px solid ${item.done ? 'var(--po-sage-line)' : 'var(--po-line-strong)'}` }}>
                      {item.done && <Icon name="check" size={12} stroke="var(--po-sage)" strokeWidth={2.4} />}
                    </span>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Users ── */}
        {tab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
              <h1 className="po-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--po-text)', margin: 0 }}>Users</h1>
              <span style={{ fontSize: 12.5, color: 'var(--po-text-3)' }}>
                {usersSource === 'demo' ? 'Sample accounts — changes are local until Supabase is connected' : `${users.length} accounts`}
              </span>
            </div>
            <div style={{ overflowX: 'auto', border: '1px solid var(--po-line)', borderRadius: 'var(--po-r-sm)', background: 'var(--po-panel)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'var(--po-navy)' }}>
                    {['Email', 'Organization', 'Type', 'Role', 'Attested', 'Joined', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '9px 13px', textAlign: 'left', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.id} style={{ background: i % 2 ? 'var(--po-panel-2)' : 'var(--po-panel)' }}>
                      <td style={{ padding: '9px 13px', borderTop: '1px solid var(--po-line)', whiteSpace: 'nowrap' }}>
                        <b style={{ color: 'var(--po-text)' }}>{u.email}</b>
                      </td>
                      <td style={{ padding: '9px 13px', borderTop: '1px solid var(--po-line)', color: 'var(--po-text)', whiteSpace: 'nowrap' }}>{u.org_name ?? '—'}</td>
                      <td style={{ padding: '9px 13px', borderTop: '1px solid var(--po-line)', color: 'var(--po-text-2)', whiteSpace: 'nowrap' }}>{u.org_type ?? '—'}</td>
                      <td style={{ padding: '9px 13px', borderTop: '1px solid var(--po-line)' }}>
                        <Pill tone={u.role === 'admin' ? 'blue' : 'gray'}>{u.role}</Pill>
                      </td>
                      <td style={{ padding: '9px 13px', borderTop: '1px solid var(--po-line)' }}>
                        {u.attested_permitted_use
                          ? <span title={fmtDateTime(u.attested_at)}><Pill tone="sage">Attested</Pill></span>
                          : <Pill tone="red">Missing</Pill>}
                      </td>
                      <td className="po-mono" style={{ padding: '9px 13px', borderTop: '1px solid var(--po-line)', color: 'var(--po-text-2)', whiteSpace: 'nowrap' }}>{fmtDateTime(u.created_at)}</td>
                      <td style={{ padding: '9px 13px', borderTop: '1px solid var(--po-line)' }}>
                        <Pill tone={u.status === 'active' ? 'sage' : 'red'}>{u.status}</Pill>
                      </td>
                      <td style={{ padding: '9px 13px', borderTop: '1px solid var(--po-line)', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', gap: 7 }}>
                          <button
                            onClick={() => patchUser(u.id, { role: u.role === 'admin' ? 'member' : 'admin' })}
                            disabled={busy === u.id || ADMIN_EMAILS.includes(u.email.toLowerCase())}
                            style={{ padding: '5px 11px', borderRadius: 999, border: '1px solid var(--po-line-strong)', background: 'var(--po-panel)', color: 'var(--po-text-2)', fontSize: 11.5, fontWeight: 600, cursor: ADMIN_EMAILS.includes(u.email.toLowerCase()) ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: ADMIN_EMAILS.includes(u.email.toLowerCase()) ? 0.45 : 1 }}
                          >
                            {u.role === 'admin' ? 'Make member' : 'Make admin'}
                          </button>
                          <button
                            onClick={() => patchUser(u.id, { status: u.status === 'active' ? 'suspended' : 'active' })}
                            disabled={busy === u.id || ADMIN_EMAILS.includes(u.email.toLowerCase())}
                            style={{ padding: '5px 11px', borderRadius: 999, border: `1px solid ${u.status === 'active' ? 'rgba(194,94,94,0.4)' : 'var(--po-sage-line)'}`, background: 'var(--po-panel)', color: u.status === 'active' ? '#A14848' : 'var(--po-sage)', fontSize: 11.5, fontWeight: 600, cursor: ADMIN_EMAILS.includes(u.email.toLowerCase()) ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: ADMIN_EMAILS.includes(u.email.toLowerCase()) ? 0.45 : 1 }}
                          >
                            {u.status === 'active' ? 'Suspend' : 'Reinstate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 12, color: 'var(--po-text-3)', margin: 0 }}>
              The platform admin account ({ADMIN_EMAILS[0]}) cannot be demoted or suspended. Accounts without an attestation should be suspended until they re-attest.
            </p>
          </div>
        )}

        {/* ── Data ── */}
        {tab === 'data' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h1 className="po-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--po-text)', margin: 0 }}>Data</h1>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <StatCard label="Records" value={releases.length.toLocaleString()} sub="Upcoming releases" />
              <StatCard label="Counties" value={String(byCounty.length)} sub="With releases" />
              <StatCard label="Source" value={releasesSource === 'live' ? 'Live' : 'Demo'} sub={releasesSource === 'live' ? 'public.releases' : 'Deterministic sample'} accent={releasesSource === 'live' ? 'var(--po-sage)' : '#E0A33A'} />
            </div>

            <div className="card" style={{ padding: '16px 18px' }}>
              <h2 className="po-display" style={{ fontSize: 15, fontWeight: 600, color: 'var(--po-text)', margin: '0 0 12px' }}>Records by county</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {byCounty.slice(0, 10).map(([county, count]) => {
                  const max = byCounty[0]?.[1] ?? 1
                  return (
                    <div key={county} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ width: 90, fontSize: 12.5, color: 'var(--po-text-2)', flexShrink: 0 }}>{county}</span>
                      <div style={{ flex: 1, height: 18, background: 'var(--po-track)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${(count / max) * 100}%`, height: '100%', background: 'var(--po-blue)', borderRadius: 4 }} />
                      </div>
                      <span className="po-mono" style={{ width: 44, textAlign: 'right', fontSize: 12.5, color: 'var(--po-text)', fontWeight: 600 }}>{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="card" style={{ padding: '16px 18px' }}>
              <h2 className="po-display" style={{ fontSize: 15, fontWeight: 600, color: 'var(--po-text)', margin: '0 0 10px' }}>Connecting real data</h2>
              <ol style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13.5, lineHeight: 1.6, color: 'var(--po-text-2)' }}>
                <li>Run <code className="po-mono" style={{ fontSize: 12 }}>supabase/migrations/0001 → 0003</code> in the Supabase SQL editor.</li>
                <li>Set <code className="po-mono" style={{ fontSize: 12 }}>NEXT_PUBLIC_SUPABASE_URL</code>, <code className="po-mono" style={{ fontSize: 12 }}>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, <code className="po-mono" style={{ fontSize: 12 }}>SUPABASE_SERVICE_ROLE_KEY</code>, and <code className="po-mono" style={{ fontSize: 12 }}>ANTHROPIC_API_KEY</code> in Vercel, then redeploy.</li>
                <li>Load rows into <code className="po-mono" style={{ fontSize: 12 }}>public.releases</code> — <code className="po-mono" style={{ fontSize: 12 }}>scripts/seed-demo-data.mjs</code> documents the exact row shape for your importer.</li>
                <li>This page (and the whole app) switches to live data automatically; demo labels disappear.</li>
              </ol>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
