'use client'

/* Shared presentational primitives for the platform-admin screens. */

import type { CSSProperties, ReactNode } from 'react'

/* ── Tone maps ──────────────────────────────────────────────────── */

export type Tone = 'sage' | 'blue' | 'blue100' | 'warn' | 'danger' | 'slate' | 'gray'

const TONE: Record<Tone, { bg: string; fg: string; line: string }> = {
  sage: { bg: 'var(--po-sage-wash)', fg: 'var(--po-sage)', line: 'var(--po-sage-line)' },
  blue: { bg: 'var(--po-copper-wash)', fg: 'var(--po-blue-700)', line: 'var(--po-copper-line)' },
  blue100: { bg: 'var(--po-blue-100)', fg: 'var(--po-blue-700)', line: 'var(--po-copper-line)' },
  warn: { bg: 'var(--po-warn-wash)', fg: 'var(--po-warn)', line: 'var(--po-warn-line)' },
  danger: { bg: 'var(--po-danger-wash)', fg: 'var(--po-danger)', line: 'var(--po-danger-line)' },
  slate: { bg: 'var(--po-slate-wash)', fg: 'var(--po-slate)', line: 'var(--po-slate-line)' },
  gray: { bg: 'var(--po-track)', fg: 'var(--po-text-2)', line: 'var(--po-line)' },
}

export function Pill({ children, tone, title }: { children: ReactNode; tone: Tone; title?: string }) {
  const t = TONE[tone]
  return (
    <span
      title={title}
      style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 600, background: t.bg, color: t.fg, border: `1px solid ${t.line}`, whiteSpace: 'nowrap' }}
    >
      {children}
    </span>
  )
}

/** Status → pill tone, per spec. */
export function statusTone(status: string): Tone {
  switch (status) {
    case 'active': return 'sage'
    case 'trialing': return 'blue'
    case 'past_due': return 'warn'
    case 'paused': return 'slate'
    case 'canceled': return 'slate'
    case 'comped': return 'blue100'
    default: return 'gray'
  }
}

export function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div className="card" style={{ padding: '14px 16px', flex: 1, minWidth: 150 }}>
      <div className="po-label" style={{ fontSize: 10, marginBottom: 6 }}>{label}</div>
      <div className="po-display" style={{ fontSize: 24, fontWeight: 700, color: accent ?? 'var(--po-text)', lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: 'var(--po-text-3)', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

/* ── Usage bar (blue → warn → danger at 80 / 100%) ──────────────── */

export function usageColor(pct: number): string {
  if (pct >= 100) return 'var(--po-danger)'
  if (pct >= 80) return 'var(--po-warn)'
  return 'var(--po-blue)'
}

export function UsageBar({ pct, height = 8 }: { pct: number; height?: number }) {
  return (
    <div style={{ height, background: 'var(--po-track)', borderRadius: 4, overflow: 'hidden', minWidth: 60 }}>
      <div style={{ width: `${Math.min(100, pct)}%`, height: '100%', background: usageColor(pct), borderRadius: 4 }} />
    </div>
  )
}

/** Horizontal blue-ramp bar row (charts). */
export function RampBar({ label, value, max, rampIdx = 3, suffix }: { label: string; value: number; max: number; rampIdx?: 1 | 2 | 3 | 4 | 5; suffix?: string }) {
  const color = `var(--po-ramp-${rampIdx})`
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ width: 130, fontSize: 12.5, color: 'var(--po-text-2)', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={label}>{label}</span>
      <div style={{ flex: 1, height: 18, background: 'var(--po-track)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4 }} />
      </div>
      <span className="po-mono" style={{ width: 64, textAlign: 'right', fontSize: 12.5, color: 'var(--po-text)', fontWeight: 600 }}>
        {value.toLocaleString()}{suffix ?? ''}
      </span>
    </div>
  )
}

/* ── Section card ───────────────────────────────────────────────── */

export function Section({ title, children, action, style }: { title: string; children: ReactNode; action?: ReactNode; style?: CSSProperties }) {
  return (
    <div className="card" style={{ padding: '16px 18px', ...style }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 12 }}>
        <h2 className="po-display" style={{ fontSize: 15, fontWeight: 600, color: 'var(--po-text)', margin: 0 }}>{title}</h2>
        {action}
      </div>
      {children}
    </div>
  )
}

/* ── Formatters ─────────────────────────────────────────────────── */

export function fmtMoney(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

export function fmtDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function fmtDateTime(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export function planTone(plan: string): Tone {
  if (plan === 'enterprise') return 'blue'
  if (plan === 'pro') return 'blue100'
  return 'gray'
}
