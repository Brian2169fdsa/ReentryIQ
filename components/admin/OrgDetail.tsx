'use client'

import { useEffect, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import {
  Pill, Section, StatCard, UsageBar, usageColor,
  statusTone, planTone, fmtMoney, fmtDate, fmtDateTime,
} from './ui'

const AZ_COUNTIES = ['Maricopa', 'Pima', 'Pinal', 'Yuma', 'Cochise', 'Yavapai', 'Mohave', 'Navajo', 'Graham', 'Coconino']
const PLANS = ['starter', 'pro', 'enterprise']

interface OrgDetailData {
  id: string
  name: string
  plan: string
  status: string
  scope_counties: string[]
  segment_verified: boolean
  interval: 'monthly' | 'annual'
  created_at: string
  mrr_cents: number
  reveals: number
  included: number
  usage_pct: number
  members: { id: string; email: string; role: string; created_at: string }[]
  reveal_history: { record_id: string; created_at: string }[]
  attestations: { id: string; use_case: string; fcra_ack: boolean; created_at: string }[]
  audit: { id: string; action: string; target: string | null; user: string | null; created_at: string }[]
}

const btn = (variant: 'default' | 'sage' | 'warn' | 'blue'): React.CSSProperties => {
  const map = {
    default: { border: 'var(--po-line-strong)', fg: 'var(--po-text-2)' },
    sage: { border: 'var(--po-sage-line)', fg: 'var(--po-sage)' },
    warn: { border: 'var(--po-warn-line)', fg: 'var(--po-warn)' },
    blue: { border: 'var(--po-copper-line)', fg: 'var(--po-blue-700)' },
  }[variant]
  return { padding: '6px 13px', borderRadius: 999, border: `1px solid ${map.border}`, background: 'var(--po-panel)', color: map.fg, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }
}

export function OrgDetail({ orgId, onBack, demo }: { orgId: string; onBack: () => void; demo: boolean }) {
  const [org, setOrg] = useState<OrgDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [planSel, setPlanSel] = useState('starter')
  const [counties, setCounties] = useState<string[]>([])

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/orgs/${orgId}`)
      .then(r => r.json())
      .then(d => {
        if (d.org) {
          setOrg(d.org)
          setPlanSel(d.org.plan)
          setCounties(d.org.scope_counties ?? [])
        } else setError(d.error ?? 'Not found')
      })
      .catch(() => setError('Failed to load org'))
      .finally(() => setLoading(false))
  }, [orgId])

  async function patch(body: Record<string, unknown>, label: string) {
    if (!org) return
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      const res = await fetch(`/api/admin/orgs/${orgId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const d = await res.json()
      if (!res.ok) { setError(d.error ?? 'Update failed'); return }
      // Apply locally (covers both live + demo).
      setOrg(prev => prev ? { ...prev, ...body } as OrgDetailData : prev)
      setNotice(d.persisted === false ? `${label} applied locally (demo — not persisted).` : `${label} saved.`)
    } catch {
      setError('Update failed')
    } finally {
      setBusy(false)
    }
  }

  function toggleCounty(c: string) {
    setCounties(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
  }

  if (loading) return <p style={{ color: 'var(--po-text-3)', fontSize: 13 }}>Loading org…</p>
  if (!org) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <button onClick={onBack} style={{ ...btn('default'), alignSelf: 'flex-start' }}>← Back to orgs</button>
      <p style={{ color: 'var(--po-danger)', fontSize: 13 }}>{error ?? 'Org not found.'}</p>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <button onClick={onBack} style={{ ...btn('default'), alignSelf: 'flex-start' }}>← Back to orgs</button>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 className="po-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--po-text)', margin: 0 }}>{org.name}</h1>
          <Pill tone={planTone(org.plan)}>{org.plan}</Pill>
          <Pill tone={statusTone(org.status)}>{org.status}</Pill>
        </div>
        <span className="po-mono" style={{ fontSize: 12, color: 'var(--po-text-3)' }}>Joined {fmtDate(org.created_at)}</span>
      </div>

      {error && <Banner tone="danger">{error}</Banner>}
      {notice && <Banner tone="blue">{notice}</Banner>}

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <StatCard label="MRR" value={fmtMoney(org.mrr_cents)} sub={`${org.interval} billing`} accent="var(--po-blue)" />
        <StatCard label="Reveals this period" value={`${org.reveals.toLocaleString()} / ${org.included.toLocaleString()}`} sub={`${org.usage_pct}% of included`} accent={usageColor(org.usage_pct)} />
        <StatCard label="Seats" value={String(org.members.length)} sub="org members" />
        <StatCard label="Segment" value={org.segment_verified ? 'Verified' : 'Standard'} sub="nonprofit status" accent={org.segment_verified ? 'var(--po-sage)' : undefined} />
      </div>

      {/* ── Plan & status ── */}
      <Section title="Plan & status">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span className="po-label" style={{ fontSize: 10 }}>Manual plan override</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <select value={planSel} onChange={e => setPlanSel(e.target.value)} style={{ padding: '6px 10px', borderRadius: 'var(--po-r-sm)', border: '1px solid var(--po-line-strong)', background: 'var(--po-panel)', color: 'var(--po-text)', fontSize: 13, fontFamily: 'inherit' }}>
                {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <button disabled={busy || planSel === org.plan} onClick={() => patch({ plan: planSel }, 'Plan override')} style={{ ...btn('blue'), opacity: busy || planSel === org.plan ? 0.5 : 1 }}>Apply</button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span className="po-label" style={{ fontSize: 10 }}>Status actions</span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button disabled={busy || org.status === 'comped'} onClick={() => patch({ status: 'comped' }, 'Comp')} style={{ ...btn('blue'), opacity: busy || org.status === 'comped' ? 0.5 : 1 }}>Comp</button>
              <button disabled={busy || org.status === 'paused'} onClick={() => patch({ status: 'paused' }, 'Pause')} style={{ ...btn('warn'), opacity: busy || org.status === 'paused' ? 0.5 : 1 }}>Pause</button>
              <button disabled={busy || org.status === 'active'} onClick={() => patch({ status: 'active' }, 'Reactivate')} style={{ ...btn('sage'), opacity: busy || org.status === 'active' ? 0.5 : 1 }}>Reactivate</button>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Scope ── */}
      <Section
        title="Scope & eligibility"
        action={
          <button
            disabled={busy}
            onClick={() => patch({ scope_counties: counties }, 'County scope')}
            style={{ ...btn('blue'), opacity: busy ? 0.5 : 1 }}
          >Save scope</button>
        }
      >
        <p style={{ fontSize: 12.5, color: 'var(--po-text-3)', margin: '0 0 10px' }}>
          {counties.length === 0 ? 'No counties selected — org has statewide scope.' : `${counties.length} ${counties.length === 1 ? 'county' : 'counties'} selected.`}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
          {AZ_COUNTIES.map(c => {
            const on = counties.includes(c)
            return (
              <button
                key={c}
                onClick={() => toggleCounty(c)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 'var(--po-r-sm)', border: `1px solid ${on ? 'var(--po-copper-line)' : 'var(--po-line)'}`, background: on ? 'var(--po-copper-wash)' : 'var(--po-panel)', color: on ? 'var(--po-blue-700)' : 'var(--po-text-2)', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}
              >
                <span style={{ width: 16, height: 16, borderRadius: 4, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? 'var(--po-blue)' : 'var(--po-track)', border: `1px solid ${on ? 'var(--po-blue)' : 'var(--po-line-strong)'}` }}>
                  {on && <Icon name="check" size={11} stroke="var(--po-accent-fg)" strokeWidth={2.6} />}
                </span>
                {c}
              </button>
            )
          })}
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--po-text)', cursor: 'pointer' }}>
          <button
            onClick={() => patch({ segment_verified: !org.segment_verified }, 'Segment verification')}
            disabled={busy}
            style={{ width: 40, height: 22, borderRadius: 999, border: 'none', cursor: 'pointer', padding: 2, background: org.segment_verified ? 'var(--po-sage)' : 'var(--po-track)', display: 'flex', justifyContent: org.segment_verified ? 'flex-end' : 'flex-start', transition: 'background 0.15s' }}
          >
            <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--po-panel)' }} />
          </button>
          Segment verified (nonprofit)
        </label>
      </Section>

      {/* ── Seats ── */}
      <Section title={`Seats (${org.members.length})`}>
        <Table head={['Member', 'Role', 'Joined']}>
          {org.members.map((m, i) => (
            <Row key={m.id} alt={i % 2 === 1}>
              <Cell><b style={{ color: 'var(--po-text)' }}>{m.email}</b></Cell>
              <Cell><Pill tone={m.role === 'owner' ? 'blue' : m.role === 'admin' ? 'blue100' : 'gray'}>{m.role}</Pill></Cell>
              <Cell mono>{fmtDate(m.created_at)}</Cell>
            </Row>
          ))}
        </Table>
      </Section>

      {/* ── Usage ── */}
      <Section title="Usage this period">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <UsageBar pct={org.usage_pct} height={12} />
          <span className="po-mono" style={{ fontSize: 13, fontWeight: 600, color: usageColor(org.usage_pct) }}>{org.usage_pct}%</span>
        </div>
        <p style={{ fontSize: 12.5, color: 'var(--po-text-3)', margin: '0 0 14px' }}>
          {org.reveals.toLocaleString()} of {org.included.toLocaleString()} included reveals used.
        </p>
        <div className="po-label" style={{ fontSize: 10, marginBottom: 8 }}>Recent reveals (last 20)</div>
        {org.reveal_history.length === 0
          ? <p style={{ fontSize: 13, color: 'var(--po-text-3)', margin: 0 }}>No reveals recorded.</p>
          : (
            <Table head={['Record', 'Revealed']}>
              {org.reveal_history.map((r, i) => (
                <Row key={`${r.record_id}-${i}`} alt={i % 2 === 1}>
                  <Cell mono>{r.record_id}</Cell>
                  <Cell mono>{fmtDateTime(r.created_at)}</Cell>
                </Row>
              ))}
            </Table>
          )}
      </Section>

      {/* ── Attestations ── */}
      <Section title="Attestations">
        {org.attestations.length === 0
          ? <p style={{ fontSize: 13, color: 'var(--po-text-3)', margin: 0 }}>No attestations on file.</p>
          : (
            <Table head={['Use case', 'FCRA ack', 'Date']}>
              {org.attestations.map((a, i) => (
                <Row key={a.id} alt={i % 2 === 1}>
                  <Cell>{a.use_case}</Cell>
                  <Cell>
                    {a.fcra_ack
                      ? <Icon name="checkCircle" size={16} stroke="var(--po-sage)" />
                      : <Icon name="x" size={16} stroke="var(--po-danger)" />}
                  </Cell>
                  <Cell mono>{fmtDate(a.created_at)}</Cell>
                </Row>
              ))}
            </Table>
          )}
      </Section>

      {/* ── Audit log ── */}
      <Section title="Audit log">
        {org.audit.length === 0
          ? <p style={{ fontSize: 13, color: 'var(--po-text-3)', margin: 0 }}>No audit entries.</p>
          : (
            <Table head={['Action', 'Target', 'User', 'When']}>
              {org.audit.map((a, i) => (
                <Row key={a.id} alt={i % 2 === 1}>
                  <Cell mono>{a.action}</Cell>
                  <Cell>{a.target ?? '—'}</Cell>
                  <Cell>{a.user ?? 'system'}</Cell>
                  <Cell mono>{fmtDateTime(a.created_at)}</Cell>
                </Row>
              ))}
            </Table>
          )}
      </Section>

      {demo && (
        <p style={{ fontSize: 12, color: 'var(--po-text-3)', margin: 0 }}>
          Demo mode — admin writes apply to this view only and are not persisted.
        </p>
      )}
    </div>
  )
}

/* ── tiny table + banner helpers ────────────────────────────────── */

function Banner({ children, tone }: { children: React.ReactNode; tone: 'danger' | 'blue' }) {
  const c = tone === 'danger'
    ? { bg: 'var(--po-danger-wash)', line: 'var(--po-danger-line)', fg: 'var(--po-danger)' }
    : { bg: 'var(--po-copper-wash)', line: 'var(--po-copper-line)', fg: 'var(--po-blue-700)' }
  return (
    <div style={{ padding: '10px 14px', borderRadius: 'var(--po-r-sm)', background: c.bg, border: `1px solid ${c.line}`, color: c.fg, fontSize: 13 }}>
      {children}
    </div>
  )
}

function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div style={{ overflowX: 'auto', border: '1px solid var(--po-line)', borderRadius: 'var(--po-r-sm)', background: 'var(--po-panel)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: 'var(--po-navy)' }}>
            {head.map(h => (
              <th key={h} style={{ padding: '9px 13px', textAlign: 'left', color: 'var(--po-accent-fg)', fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

function Row({ children, alt }: { children: React.ReactNode; alt: boolean }) {
  return <tr style={{ background: alt ? 'var(--po-panel-2)' : 'var(--po-panel)' }}>{children}</tr>
}

function Cell({ children, mono }: { children: React.ReactNode; mono?: boolean }) {
  return (
    <td className={mono ? 'po-mono' : undefined} style={{ padding: '9px 13px', borderTop: '1px solid var(--po-line)', color: mono ? 'var(--po-text-2)' : 'var(--po-text)', whiteSpace: 'nowrap' }}>
      {children}
    </td>
  )
}
