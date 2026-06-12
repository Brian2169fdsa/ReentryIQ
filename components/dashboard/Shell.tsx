'use client'

import { useEffect, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { AgentChat } from '@/components/agent/AgentChat'
import { isAdminEmail } from '@/lib/admin'
import { USAGE } from './types'

/* Navy palette (light-on-navy chrome) */
const N = {
  bg: 'var(--po-navy)',
  text: '#E2E8F0',
  text2: '#94A3B8',
  line: 'rgba(226,232,240,0.12)',
  lineInput: 'rgba(226,232,240,0.16)',
  panel: 'rgba(255,255,255,0.06)',
  active: 'rgba(255,255,255,0.10)',
}

/* Wordmark recolored for the navy shell — copy of components/ui/Wordmark SVG. */
function NavyWordmark() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="var(--po-blue)" strokeWidth="1.9" />
        <path d="M8 14.5l2.5-3 2 2.2L16 9" stroke="var(--po-blue)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="po-display" style={{ fontSize: 16, fontWeight: 600, color: '#F1F5F9', letterSpacing: '-0.01em' }}>
        Reentry<span style={{ color: 'var(--po-blue)', fontWeight: 700 }}>IQ</span>
      </span>
    </div>
  )
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'saved', label: 'Saved Searches', icon: 'bookmark' },
  { id: 'connectors', label: 'Connectors', icon: 'plug' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
]

function usageColor(pct: number): string {
  if (pct >= 1) return '#C25E5E'
  if (pct >= 0.8) return '#E0A33A'
  return 'var(--po-blue)'
}

export function TopBar({
  nav,
  setNav,
  source,
  onAskAi,
}: {
  nav: string
  setNav: (v: string) => void
  source: 'live' | 'demo'
  onAskAi: () => void
}) {
  const pct = Math.min(1, USAGE.used / USAGE.included)

  // Show the Admin link only to the platform admin account.
  const [isAdmin, setIsAdmin] = useState(false)
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return
    import('@/lib/supabase/client').then(({ createClient }) => {
      createClient()
        .auth.getUser()
        .then(({ data }) => setIsAdmin(isAdminEmail(data.user?.email)))
        .catch(() => {})
    })
  }, [])

  return (
    <header
      style={{
        height: 60,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 18,
        padding: '0 22px',
        background: N.bg,
        borderBottom: `1px solid ${N.line}`,
        position: 'relative',
        zIndex: 20,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 28, minWidth: 0 }}>
        <NavyWordmark />
        <nav className="dash-nav" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {NAV_ITEMS.map(it => {
            const on = nav === it.id
            return (
              <button
                key={it.id}
                onClick={() => setNav(it.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  height: 34,
                  padding: '0 13px',
                  borderRadius: 'var(--po-r-sm)',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  background: on ? N.active : 'transparent',
                  color: on ? N.text : N.text2,
                  fontSize: 13,
                  fontWeight: on ? 600 : 500,
                  transition: 'background .15s, color .15s',
                }}
              >
                <Icon name={it.icon} size={15} stroke={on ? N.text : N.text2} />
                <span className="dash-nav-label">{it.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {source === 'demo' && (
          <span
            className="po-mono"
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: N.text2,
              border: `1px dashed ${N.lineInput}`,
              borderRadius: 5,
              padding: '3px 8px',
              whiteSpace: 'nowrap',
            }}
          >
            Sample data
          </span>
        )}

        {/* Usage meter */}
        <div className="dash-usage" style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span className="po-mono" style={{ fontSize: 11, color: N.text2, whiteSpace: 'nowrap' }}>
            {USAGE.used.toLocaleString()} / {USAGE.included.toLocaleString()} records
          </span>
          <div style={{ width: 140, height: 5, borderRadius: 3, background: N.panel, overflow: 'hidden', flexShrink: 0 }}>
            <div style={{ width: `${pct * 100}%`, height: '100%', background: usageColor(pct), borderRadius: 3 }} />
          </div>
        </div>

        {isAdmin && (
          <a
            href="/admin"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              height: 34,
              padding: '0 12px',
              borderRadius: 'var(--po-r-sm)',
              border: `1px solid ${N.lineInput}`,
              color: N.text,
              fontSize: 12.5,
              fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            <Icon name="shield" size={14} stroke={N.text} />
            Admin
          </a>
        )}

        <button
          onClick={onAskAi}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            height: 36,
            padding: '0 15px',
            borderRadius: 'var(--po-r)',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            background: 'var(--po-blue)',
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <Icon name="sparkles" size={15} stroke="#fff" />
          Ask AI
        </button>

        <div
          title="Sanctuary Recovery"
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: 'var(--po-sage-wash)',
            border: '1px solid var(--po-sage-line)',
            color: 'var(--po-sage)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          SR
        </div>
      </div>
    </header>
  )
}

/* ── AI panel slide-over ──────────────────────────────────────────── */

export function AiPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', zIndex: 49 }} />
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 520,
          maxWidth: '94vw',
          background: 'var(--po-bg)',
          borderLeft: '1px solid var(--po-line)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          animation: 'dash-slide-in 0.22s ease',
        }}
      >
        <div
          style={{
            height: 60,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 22px',
            borderBottom: '1px solid var(--po-line)',
            background: 'var(--po-panel)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="sparkles" size={18} stroke="var(--po-blue)" />
            <h2 className="po-display" style={{ fontSize: 16, fontWeight: 600, color: 'var(--po-text)', margin: 0 }}>
              Data Assistant
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 32,
              height: 32,
              borderRadius: 7,
              border: 'none',
              background: 'transparent',
              color: 'var(--po-text-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Icon name="x" size={17} />
          </button>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
          <AgentChat />
        </div>
      </div>
      <style>{`@keyframes dash-slide-in { from { transform: translateX(28px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </>
  )
}

export { usageColor }
