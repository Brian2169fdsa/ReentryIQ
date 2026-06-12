'use client'

import { useEffect, useMemo, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import {
  Pill, StatCard, Section, UsageBar, RampBar, usageColor,
  statusTone, planTone, fmtMoney, fmtDate,
} from './ui'
import { OrgDetail } from './OrgDetail'

/* ── Types (mirror API contracts) ──────────────────────────────── */

interface OrgRow {
  id: string
  name: string
  plan: string
  status: string
  mrr_cents: number
  reveals: number
  included: number
  usage_pct: number
  members: number
  created_at: string
}

interface BillingData {
  total_mrr_cents: number
  by_tier: { plan: string; subs: number; mrr_cents: number }[]
  past_due: { id: string; name: string; plan: string }[]
  past_due_count: number
  overage_revenue_cents: number
  period: string
  source: 'live' | 'demo'
}

interface UsageData {
  period: string
  periods: string[]
  top_orgs: { id: string; name: string; reveals: number }[]
  trend: { period: string; total: number }[]
  by_org_trend: { id: string; name: string; points: number[] }[]
  source: 'live' | 'demo'
}

interface PipelineData {
  scraper: 'operational' | 'unreachable'
  last_sync: string | null
  inmates: number | null
  detail: string
  source: 'live' | 'demo'
}

/* ── Shell ──────────────────────────────────────────────────────── */

const TABS = [
  { id: 'orgs', label: 'Orgs', icon: 'building' },
  { id: 'billing', label: 'Billing', icon: 'gauge' },
  { id: 'usage', label: 'Usage', icon: 'layers' },
  { id: 'pipeline', label: 'Pipeline', icon: 'plug' },
] as const

export function AdminApp() {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('orgs')
  const [orgs, setOrgs] = useState<OrgRow[]>([])
  const [source, setSource] = useState<'live' | 'demo'>('demo')
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/orgs')
      .then(r => r.json())
      .then(d => { setOrgs(d.orgs ?? []); setSource(d.source ?? 'demo') })
      .catch(() => {})
  }, [])

  const demo = source === 'demo'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--po-bg)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ height: 60, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px', background: 'var(--po-navy)', borderBottom: '1px solid rgba(226,232,240,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <a href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" stroke="var(--po-blue)" strokeWidth="1.9" />
              <path d="M8 14.5l2.5-3 2 2.2L16 9" stroke="var(--po-blue)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="po-display" style={{ fontSize: 16, fontWeight: 600, color: 'var(--po-accent-fg)' }}>
              Reentry<span style={{ color: 'var(--po-blue)', fontWeight: 700 }}>IQ</span>
            </span>
          </a>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--po-navy)', background: 'var(--po-blue)', padding: '3px 10px', borderRadius: 999 }}>
            Admin
          </span>
          <nav style={{ display: 'flex', gap: 2 }}>
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setSelectedOrg(null) }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7, height: 34, padding: '0 13px',
                  borderRadius: 'var(--po-r-sm)', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  background: tab === t.id ? 'rgba(255,255,255,0.10)' : 'transparent',
                  color: tab === t.id ? 'var(--po-accent-fg)' : 'var(--po-text-3)', fontSize: 13, fontWeight: 500,
                }}
              >
                <Icon name={t.icon} size={15} />
                {t.label}
              </button>
            ))}
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {demo && (
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--po-warn)', border: '1px solid var(--po-warn-line)', background: 'var(--po-warn-wash)', padding: '3px 10px', borderRadius: 999 }}>
              Demo mode — connect Supabase
            </span>
          )}
          <a href="/dashboard" style={{ fontSize: 13, fontWeight: 500, color: 'var(--po-text-3)', textDecoration: 'none' }}>
            ← Member dashboard
          </a>
        </div>
      </header>

      <main style={{ flex: 1, maxWidth: 1100, width: '100%', margin: '0 auto', padding: '26px 24px 60px' }}>
        {tab === 'orgs' && (
          selectedOrg
            ? <OrgDetail orgId={selectedOrg} demo={demo} onBack={() => setSelectedOrg(null)} />
            : <OrgsList orgs={orgs} demo={demo} onSelect={setSelectedOrg} />
        )}
        {tab === 'billing' && <BillingScreen />}
        {tab === 'usage' && <UsageScreen />}
        {tab === 'pipeline' && <PipelineScreen />}
      </main>
    </div>
  )
}

/* ── Screen 1: Orgs list ────────────────────────────────────────── */

type SortKey = 'created' | 'mrr' | 'usage'

function OrgsList({ orgs, demo, onSelect }: { orgs: OrgRow[]; demo: boolean; onSelect: (id: string) => void }) {
  const [sort, setSort] = useState<SortKey>('created')
  const [planFilter, setPlanFilter] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let rows = orgs
    if (planFilter) rows = rows.filter(o => o.plan === planFilter)
    if (statusFilter) rows = rows.filter(o => o.status === statusFilter)
    const sorted = [...rows]
    if (sort === 'created') sorted.sort((a, b) => b.created_at.localeCompare(a.created_at))
    if (sort === 'mrr') sorted.sort((a, b) => b.mrr_cents - a.mrr_cents)
    if (sort === 'usage') sorted.sort((a, b) => b.usage_pct - a.usage_pct)
    return sorted
  }, [orgs, sort, planFilter, statusFilter])

  const plans = ['starter', 'pro', 'enterprise']
  const statuses = ['active', 'trialing', 'past_due', 'paused', 'comped', 'canceled']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
        <h1 className="po-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--po-text)', margin: 0 }}>Organizations</h1>
        <span style={{ fontSize: 12.5, color: 'var(--po-text-3)' }}>{filtered.length} of {orgs.length} orgs</span>
      </div>

      {/* Filters + sort */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <FilterGroup label="Plan" options={plans} value={planFilter} onChange={setPlanFilter} />
        <FilterGroup label="Status" options={statuses} value={statusFilter} onChange={setStatusFilter} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="po-label" style={{ fontSize: 10 }}>Sort</span>
          {(['created', 'mrr', 'usage'] as SortKey[]).map(k => (
            <button key={k} onClick={() => setSort(k)} style={chip(sort === k)}>{k === 'mrr' ? 'MRR' : k}</button>
          ))}
        </div>
      </div>

      <div style={{ overflowX: 'auto', border: '1px solid var(--po-line)', borderRadius: 'var(--po-r-sm)', background: 'var(--po-panel)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--po-navy)' }}>
              {['Organization', 'Plan', 'Status', 'MRR', 'Usage', 'Seats', 'Created'].map(h => (
                <th key={h} style={{ padding: '9px 13px', textAlign: 'left', color: 'var(--po-accent-fg)', fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((o, i) => (
              <tr
                key={o.id}
                onClick={() => onSelect(o.id)}
                style={{ background: i % 2 ? 'var(--po-panel-2)' : 'var(--po-panel)', cursor: 'pointer' }}
              >
                <td style={{ padding: '10px 13px', borderTop: '1px solid var(--po-line)', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <b style={{ color: 'var(--po-text)' }}>{o.name}</b>
                    <Icon name="chevronRight" size={14} stroke="var(--po-text-3)" />
                  </div>
                </td>
                <td style={{ padding: '10px 13px', borderTop: '1px solid var(--po-line)' }}><Pill tone={planTone(o.plan)}>{o.plan}</Pill></td>
                <td style={{ padding: '10px 13px', borderTop: '1px solid var(--po-line)' }}><Pill tone={statusTone(o.status)}>{o.status}</Pill></td>
                <td className="po-mono" style={{ padding: '10px 13px', borderTop: '1px solid var(--po-line)', color: 'var(--po-text)', fontWeight: 600, whiteSpace: 'nowrap' }}>{fmtMoney(o.mrr_cents)}</td>
                <td style={{ padding: '10px 13px', borderTop: '1px solid var(--po-line)', minWidth: 130 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <UsageBar pct={o.usage_pct} />
                    <span className="po-mono" style={{ fontSize: 11.5, color: usageColor(o.usage_pct), fontWeight: 600, width: 36, textAlign: 'right' }}>{o.usage_pct}%</span>
                  </div>
                </td>
                <td className="po-mono" style={{ padding: '10px 13px', borderTop: '1px solid var(--po-line)', color: 'var(--po-text-2)' }}>{o.members}</td>
                <td className="po-mono" style={{ padding: '10px 13px', borderTop: '1px solid var(--po-line)', color: 'var(--po-text-2)', whiteSpace: 'nowrap' }}>{fmtDate(o.created_at)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ padding: '18px 13px', textAlign: 'center', color: 'var(--po-text-3)', fontSize: 13 }}>No orgs match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {demo && <p style={{ fontSize: 12, color: 'var(--po-text-3)', margin: 0 }}>Sample orgs — connect Supabase to manage live tenants.</p>}
    </div>
  )
}

function FilterGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string | null; onChange: (v: string | null) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
      <span className="po-label" style={{ fontSize: 10 }}>{label}</span>
      <button onClick={() => onChange(null)} style={chip(value === null)}>All</button>
      {options.map(o => (
        <button key={o} onClick={() => onChange(value === o ? null : o)} style={chip(value === o)}>{o}</button>
      ))}
    </div>
  )
}

function chip(active: boolean): React.CSSProperties {
  return {
    padding: '4px 11px', borderRadius: 999, fontSize: 11.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
    border: `1px solid ${active ? 'var(--po-copper-line)' : 'var(--po-line)'}`,
    background: active ? 'var(--po-copper-wash)' : 'var(--po-panel)',
    color: active ? 'var(--po-blue-700)' : 'var(--po-text-2)',
    textTransform: 'capitalize',
  }
}

/* ── Screen 3: Billing ──────────────────────────────────────────── */

function BillingScreen() {
  const [data, setData] = useState<BillingData | null>(null)
  useEffect(() => { fetch('/api/admin/billing').then(r => r.json()).then(setData).catch(() => {}) }, [])
  if (!data) return <Loading />

  const maxTierMrr = Math.max(1, ...data.by_tier.map(t => t.mrr_cents))
  const rampFor: Record<string, 1 | 2 | 3 | 4 | 5> = { starter: 2, pro: 3, enterprise: 5 }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h1 className="po-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--po-text)', margin: 0 }}>Billing overview</h1>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <StatCard label="Total MRR" value={fmtMoney(data.total_mrr_cents)} sub={`Period ${data.period}`} accent="var(--po-blue)" />
        <StatCard label="Past due" value={String(data.past_due_count)} sub="needs attention" accent={data.past_due_count > 0 ? 'var(--po-danger)' : 'var(--po-sage)'} />
        <StatCard label="Overage revenue" value={fmtMoney(data.overage_revenue_cents)} sub="this period" accent="var(--po-sage)" />
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {data.by_tier.map(t => (
          <StatCard key={t.plan} label={`${t.plan} subs`} value={String(t.subs)} sub={`${fmtMoney(t.mrr_cents)} MRR`} />
        ))}
      </div>

      <Section title="MRR by tier">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {data.by_tier.map(t => (
            <RampBar key={t.plan} label={t.plan} value={t.mrr_cents / 100} max={maxTierMrr / 100} rampIdx={rampFor[t.plan] ?? 3} suffix="" />
          ))}
        </div>
      </Section>

      <Section title={`Past-due orgs (${data.past_due.length})`}>
        {data.past_due.length === 0
          ? <p style={{ fontSize: 13, color: 'var(--po-text-3)', margin: 0 }}>No past-due accounts.</p>
          : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.past_due.map(o => (
                <div key={o.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 'var(--po-r-sm)', background: 'var(--po-danger-wash)', border: '1px solid var(--po-danger-line)' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--po-text)' }}>{o.name}</span>
                  <Pill tone={planTone(o.plan)}>{o.plan}</Pill>
                </div>
              ))}
            </div>
          )}
      </Section>
    </div>
  )
}

/* ── Screen 4: Usage across tenants ─────────────────────────────── */

function UsageScreen() {
  const [data, setData] = useState<UsageData | null>(null)
  useEffect(() => { fetch('/api/admin/usage').then(r => r.json()).then(setData).catch(() => {}) }, [])
  if (!data) return <Loading />

  const maxTop = Math.max(1, ...data.top_orgs.map(o => o.reveals))
  const maxTrend = Math.max(1, ...data.trend.map(t => t.total))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h1 className="po-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--po-text)', margin: 0 }}>Usage across tenants</h1>

      <Section title={`Reveals this period (${data.period}) — top ${Math.min(10, data.top_orgs.length)}`}>
        {data.top_orgs.length === 0
          ? <p style={{ fontSize: 13, color: 'var(--po-text-3)', margin: 0 }}>No reveals recorded this period.</p>
          : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {data.top_orgs.map(o => <RampBar key={o.id} label={o.name} value={o.reveals} max={maxTop} rampIdx={3} />)}
            </div>
          )}
      </Section>

      <Section title="Platform reveals — 6-period trend">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 160, padding: '0 4px' }}>
          {data.trend.map(t => {
            const h = (t.total / maxTrend) * 130
            const ramp = (Math.min(5, Math.max(1, Math.round((t.total / maxTrend) * 5))) || 1) as 1 | 2 | 3 | 4 | 5
            return (
              <div key={t.period} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <span className="po-mono" style={{ fontSize: 11, color: 'var(--po-text-2)', fontWeight: 600 }}>{t.total.toLocaleString()}</span>
                <div style={{ width: '100%', maxWidth: 56, height: Math.max(2, h), background: `var(--po-ramp-${ramp})`, borderRadius: '4px 4px 0 0' }} title={`${t.period}: ${t.total}`} />
                <span className="po-mono" style={{ fontSize: 10.5, color: 'var(--po-text-3)' }}>{t.period.slice(2)}</span>
              </div>
            )
          })}
        </div>
      </Section>

      <Section title="Top orgs">
        <div style={{ overflowX: 'auto', border: '1px solid var(--po-line)', borderRadius: 'var(--po-r-sm)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--po-navy)' }}>
                {['Organization', 'Reveals this period'].map(h => (
                  <th key={h} style={{ padding: '9px 13px', textAlign: 'left', color: 'var(--po-accent-fg)', fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.top_orgs.map((o, i) => (
                <tr key={o.id} style={{ background: i % 2 ? 'var(--po-panel-2)' : 'var(--po-panel)' }}>
                  <td style={{ padding: '9px 13px', borderTop: '1px solid var(--po-line)', color: 'var(--po-text)', fontWeight: 600 }}>{o.name}</td>
                  <td className="po-mono" style={{ padding: '9px 13px', borderTop: '1px solid var(--po-line)', color: 'var(--po-text-2)' }}>{o.reveals.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  )
}

/* ── Screen 5: Pipeline health ──────────────────────────────────── */

function PipelineScreen() {
  const [data, setData] = useState<PipelineData | null>(null)
  useEffect(() => { fetch('/api/admin/pipeline').then(r => r.json()).then(setData).catch(() => {}) }, [])
  if (!data) return <Loading />

  const op = data.scraper === 'operational'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h1 className="po-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--po-text)', margin: 0 }}>Pipeline health</h1>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <StatusRow
          icon="plug"
          title="Scraper"
          detail={data.detail}
          tone={op ? 'sage' : 'warn'}
          status={op ? 'Operational' : 'Unreachable'}
        />
        <StatusRow
          icon="clock"
          title="Last sync"
          detail={data.last_sync ? new Date(data.last_sync).toLocaleString('en-US') : 'No successful sync recorded.'}
          tone="slate"
          status={data.last_sync ? 'Recorded' : 'None'}
          border
        />
        <StatusRow
          icon="layers"
          title="Inmate records"
          detail={data.inmates !== null ? `${data.inmates.toLocaleString()} records indexed.` : 'Count unavailable.'}
          tone="blue"
          status={data.inmates !== null ? data.inmates.toLocaleString() : '—'}
          border
        />
      </div>

      {data.source === 'demo' && (
        <p style={{ fontSize: 12, color: 'var(--po-text-3)', margin: 0 }}>
          Demo mode — scraper unreachable is expected without a running worker. Set SCRAPER_BASE_URL and connect Supabase for live status.
        </p>
      )}
    </div>
  )
}

function StatusRow({ icon, title, detail, tone, status, border }: { icon: string; title: string; detail: string; tone: 'sage' | 'warn' | 'slate' | 'blue'; status: string; border?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderTop: border ? '1px solid var(--po-line)' : 'none' }}>
      <span style={{ width: 36, height: 36, borderRadius: 'var(--po-r-sm)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--po-track)' }}>
        <Icon name={icon} size={18} stroke="var(--po-text-2)" />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="po-display" style={{ fontSize: 14, fontWeight: 600, color: 'var(--po-text)' }}>{title}</div>
        <div style={{ fontSize: 12.5, color: 'var(--po-text-3)' }}>{detail}</div>
      </div>
      <Pill tone={tone}>{status}</Pill>
    </div>
  )
}

function Loading() {
  return <p style={{ color: 'var(--po-text-3)', fontSize: 13 }}>Loading…</p>
}
