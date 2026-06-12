'use client'

import { useState } from 'react'
import type { Release } from '@/lib/data-source'
import { Icon } from '@/components/ui/Icon'
import { type Filters, SAVED_SEARCHES, applyFilters, USAGE } from './types'

/* ── Saved Searches ─────────────────────────────────────────────────── */
export function SavedView({ allRows, onRun }: { allRows: Release[]; onRun: (f: Filters) => void }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
      <h2 className="po-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 16px' }}>Saved Searches</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 620 }}>
        {SAVED_SEARCHES.map(s => {
          const matches = applyFilters(allRows, s.filters).length
          return (
            <button
              key={s.id}
              onClick={() => onRun(s.filters)}
              className="card po-hov-card po-hov-lift"
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '15px 18px', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', background: 'var(--po-panel)', border: '1px solid var(--po-line)' }}
            >
              <span style={{ width: 9, height: 9, borderRadius: '50%', flexShrink: 0, background: s.alert ? 'var(--po-sage)' : 'var(--po-text-3)' }} />
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--po-text)' }}>{s.name}</span>
              {s.alert && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 600, color: 'var(--po-sage)', background: 'var(--po-sage-wash)', border: '1px solid var(--po-sage-line)', borderRadius: 999, padding: '3px 10px' }}>
                  <Icon name="bell" size={12} stroke="var(--po-sage)" /> Alerts on
                </span>
              )}
              <span className="po-mono" style={{ fontSize: 13, color: 'var(--po-text-2)' }}>{matches} matches</span>
              <Icon name="chevronRight" size={16} stroke="var(--po-text-3)" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ── Connectors ─────────────────────────────────────────────────────── */
export function ConnectorsView() {
  const items = [
    { name: 'Salesforce', desc: 'Push matched records as Leads or custom objects.', status: 'Connected' },
    { name: 'KIPU', desc: 'Create pre-admission records from matches.', status: 'Available' },
    { name: 'Sunwave', desc: 'Sync matches into your CRM pipeline.', status: 'Available' },
    { name: 'Webhook', desc: 'Signed JSON POST on every new match.', status: 'Connected' },
  ]
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
      <h2 className="po-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 16px' }}>Connectors</h2>
      <div className="dash-stats" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 760 }}>
        {items.map(c => (
          <div key={c.name} className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3 className="po-display" style={{ fontSize: 15, fontWeight: 600, color: 'var(--po-text)', margin: 0 }}>{c.name}</h3>
              <span
                style={{
                  fontSize: 11, fontWeight: 600, borderRadius: 999, padding: '3px 10px',
                  background: c.status === 'Connected' ? 'var(--po-sage-wash)' : 'var(--po-track)',
                  color: c.status === 'Connected' ? 'var(--po-sage)' : 'var(--po-text-2)',
                  border: `1px solid ${c.status === 'Connected' ? 'var(--po-sage-line)' : 'var(--po-line)'}`,
                }}
              >
                {c.status}
              </span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--po-text-2)', margin: 0 }}>{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Settings (+ Billing sub-tab) ───────────────────────────────────── */
const INVOICES = [
  { id: 'INV-2026-006', date: 'Jun 1, 2026', amount: '$299.00' },
  { id: 'INV-2026-005', date: 'May 1, 2026', amount: '$299.00' },
  { id: 'INV-2026-004', date: 'Apr 1, 2026', amount: '$299.00' },
]

function GeneralSettings() {
  return (
    <div className="card" style={{ padding: '18px 20px', maxWidth: 620 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13.5 }}>
        {[
          ['Organization', 'Sanctuary Recovery'],
          ['Plan', 'Pro — 2,500 records / month'],
          ['Alert email', 'team@sanctuaryrecovery.org'],
          ['Data refresh', 'Daily at 6:00 AM MST'],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, paddingBottom: 12, borderBottom: '1px solid var(--po-line)' }}>
            <span style={{ color: 'var(--po-text-2)' }}>{k}</span>
            <b style={{ color: 'var(--po-text)' }}>{v}</b>
          </div>
        ))}
        <span style={{ fontSize: 12, color: 'var(--po-text-3)' }}>Account management will be available once authentication is connected.</span>
      </div>
    </div>
  )
}

function BillingSettings() {
  const pct = Math.min(1, USAGE.used / USAGE.included)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 760 }}>
      {/* Plan + usage */}
      <div className="dash-stats" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="card" style={{ padding: '18px 20px' }}>
          <div className="po-label" style={{ marginBottom: 8 }}>Current Plan</div>
          <div className="po-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--po-blue-700)' }}>Pro</div>
          <div className="po-mono" style={{ fontSize: 14, color: 'var(--po-text)', marginTop: 4 }}>$299<span style={{ color: 'var(--po-text-3)', fontSize: 12 }}>/mo</span></div>
          <div style={{ fontSize: 12, color: 'var(--po-text-3)', marginTop: 6 }}>2,500 records / month · renews Jul 1, 2026</div>
        </div>
        <div className="card" style={{ padding: '18px 20px' }}>
          <div className="po-label" style={{ marginBottom: 8 }}>Usage This Period</div>
          <div className="po-display po-mono" style={{ fontSize: 22, fontWeight: 700, color: 'var(--po-text)' }}>
            {USAGE.used.toLocaleString()} <span style={{ fontSize: 14, color: 'var(--po-text-3)', fontWeight: 500 }}>/ {USAGE.included.toLocaleString()}</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: 'var(--po-track)', overflow: 'hidden', margin: '10px 0 6px' }}>
            <div style={{ width: `${pct * 100}%`, height: '100%', background: 'var(--po-blue)', borderRadius: 3 }} />
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--po-text-3)' }}>{Math.round(pct * 100)}% of monthly records used</div>
        </div>
      </div>

      {/* Payment method */}
      <div className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div>
          <div className="po-label" style={{ marginBottom: 4 }}>Payment Method</div>
          <div className="po-mono" style={{ fontSize: 13.5, color: 'var(--po-text)' }}>Visa •••• 4242 · exp 08/28</div>
        </div>
        <button style={{ padding: '7px 14px', borderRadius: 'var(--po-r-sm)', border: '1px solid var(--po-line-strong)', background: 'var(--po-panel)', color: 'var(--po-text)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          Update
        </button>
      </div>

      {/* Invoices */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--po-line)' }}>
          <span className="po-display" style={{ fontSize: 15, fontWeight: 600, color: 'var(--po-text)' }}>Invoices</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {['Invoice', 'Date', 'Amount', 'Status'].map(h => (
                <th key={h} style={{ padding: '9px 20px', textAlign: h === 'Amount' ? 'right' : 'left', color: 'var(--po-text-3)', fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INVOICES.map(inv => (
              <tr key={inv.id}>
                <td className="po-mono" style={{ padding: '11px 20px', color: 'var(--po-text)', borderTop: '1px solid var(--po-line)' }}>{inv.id}</td>
                <td style={{ padding: '11px 20px', color: 'var(--po-text-2)', borderTop: '1px solid var(--po-line)' }}>{inv.date}</td>
                <td className="po-mono" style={{ padding: '11px 20px', color: 'var(--po-text)', textAlign: 'right', borderTop: '1px solid var(--po-line)' }}>{inv.amount}</td>
                <td style={{ padding: '11px 20px', borderTop: '1px solid var(--po-line)' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, borderRadius: 999, padding: '3px 10px', background: 'var(--po-sage-wash)', color: 'var(--po-sage)', border: '1px solid var(--po-sage-line)' }}>Paid</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function SettingsView() {
  const [tab, setTab] = useState<'general' | 'billing'>('general')
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
      <h2 className="po-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 16px' }}>Settings</h2>
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, padding: 4, borderRadius: 'var(--po-r)', background: 'var(--po-panel-2)', border: '1px solid var(--po-line)', width: 'fit-content' }}>
        {([['general', 'General'], ['billing', 'Billing']] as const).map(([id, label]) => {
          const on = tab === id
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                height: 32, padding: '0 16px', borderRadius: 'var(--po-r-sm)', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600,
                background: on ? 'var(--po-navy)' : 'transparent', color: on ? '#fff' : 'var(--po-text-2)',
              }}
            >
              {label}
            </button>
          )
        })}
      </div>
      {tab === 'general' ? <GeneralSettings /> : <BillingSettings />}
    </div>
  )
}
