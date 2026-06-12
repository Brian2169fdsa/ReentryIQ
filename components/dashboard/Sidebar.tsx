'use client'

import { Icon } from '@/components/ui/Icon'
import { Wordmark } from '@/components/ui/Wordmark'
import { USAGE } from './types'

const NAV = [
  { id: 'home', label: 'Dashboard', icon: 'dashboard' },
  { id: 'search', label: 'Search & Discover', icon: 'compass' },
  { id: 'saved', label: 'Saved Searches', icon: 'bookmark' },
  { id: 'alerts', label: 'Alerts', icon: 'bell', badge: 7 },
  { id: 'exports', label: 'Exports', icon: 'send' },
  { id: 'recordviews', label: 'Record Views', icon: 'list' },
  { id: 'reports', label: 'Reports', icon: 'fileText' },
]

const INTEGRATIONS = [
  { label: 'Salesforce', connected: true },
  { label: 'KIPU', connected: true },
  { label: 'Sunwave', connected: true },
]

function NavBtn({ active, icon, label, badge, onClick }: {
  active: boolean
  icon: string
  label: string
  badge?: number
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 11, width: '100%', height: 38,
        padding: '0 12px', borderRadius: 'var(--po-r-sm)', border: 'none', cursor: 'pointer',
        fontFamily: 'inherit', textAlign: 'left',
        background: active ? 'var(--po-blue-100)' : 'transparent',
        color: active ? 'var(--po-blue-700)' : 'var(--po-text-2)',
        fontSize: 13.5, fontWeight: active ? 600 : 500,
        transition: 'background 0.13s, color 0.13s',
      }}
    >
      <Icon name={icon} size={16} stroke={active ? 'var(--po-blue-700)' : 'var(--po-text-3)'} />
      <span style={{ flex: 1 }}>{label}</span>
      {badge != null && (
        <span className="po-mono" style={{ minWidth: 19, height: 19, borderRadius: 999, background: 'var(--po-blue)', color: 'var(--po-accent-fg)', fontSize: 10.5, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>
          {badge}
        </span>
      )}
    </button>
  )
}

export function Sidebar({ nav, setNav }: { nav: string; setNav: (v: string) => void }) {
  const pct = Math.min(1, USAGE.used / USAGE.included)
  return (
    <aside
      className="dash-sidebar"
      style={{
        width: 232, flexShrink: 0, borderRight: '1px solid var(--po-line)',
        background: 'var(--po-panel)', display: 'flex', flexDirection: 'column', minHeight: 0,
      }}
    >
      <div style={{ height: 66, display: 'flex', alignItems: 'center', padding: '0 16px', borderBottom: '1px solid var(--po-line)', flexShrink: 0 }}>
        <Wordmark href="/" />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 12px 18px' }}>
        {/* Plan card */}
        <div style={{ border: '1px solid var(--po-line)', borderRadius: 'var(--po-r)', padding: '13px 14px', marginBottom: 16 }}>
          <div className="po-label" style={{ fontSize: 9.5, marginBottom: 3 }}>Current Plan</div>
          <div className="po-display" style={{ fontSize: 15, fontWeight: 700, color: 'var(--po-blue-700)', marginBottom: 10 }}>Professional</div>
          <div className="po-label" style={{ fontSize: 9.5, marginBottom: 4 }}>Record Views</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 7 }}>
            <span className="po-mono" style={{ fontSize: 16, fontWeight: 700, color: 'var(--po-text)' }}>{USAGE.used.toLocaleString()}</span>
            <span className="po-mono" style={{ fontSize: 12, color: 'var(--po-text-3)' }}>/ {USAGE.included.toLocaleString()}</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: 'var(--po-track)', overflow: 'hidden', marginBottom: 7 }}>
            <div style={{ width: `${pct * 100}%`, height: '100%', borderRadius: 3, background: pct >= 1 ? 'var(--po-danger)' : pct >= 0.8 ? 'var(--po-warn)' : 'var(--po-blue)' }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--po-text-3)', marginBottom: 11 }}>Resets Jul 1, 2026</div>
          <a href="/pricing" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 34, borderRadius: 'var(--po-r-sm)', border: '1px solid var(--po-line-strong)', color: 'var(--po-text)', fontSize: 12.5, fontWeight: 600, textDecoration: 'none' }}>
            Upgrade Plan
          </a>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(n => (
            <NavBtn key={n.id} active={nav === n.id} icon={n.icon} label={n.label} badge={n.badge} onClick={() => setNav(n.id)} />
          ))}
        </nav>

        {/* Integrations */}
        <div className="po-label" style={{ fontSize: 9.5, margin: '20px 12px 8px' }}>Integrations</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {INTEGRATIONS.map(i => (
            <div key={i.label} style={{ display: 'flex', alignItems: 'center', gap: 11, height: 34, padding: '0 12px', fontSize: 13, color: 'var(--po-text-2)' }}>
              <Icon name="plug" size={15} stroke="var(--po-text-3)" />
              <span style={{ flex: 1 }}>{i.label}</span>
              {i.connected && <Icon name="checkCircle" size={15} stroke="var(--po-sage)" />}
            </div>
          ))}
          <a href="/developers" style={{ display: 'flex', alignItems: 'center', gap: 11, height: 34, padding: '0 12px', fontSize: 13, color: 'var(--po-text-2)', textDecoration: 'none' }}>
            <Icon name="compass" size={15} stroke="var(--po-text-3)" />
            <span style={{ flex: 1 }}>API Access</span>
            <Icon name="chevronRight" size={14} stroke="var(--po-text-3)" />
          </a>
        </div>

        <div style={{ borderTop: '1px solid var(--po-line)', margin: '16px 0', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <NavBtn active={nav === 'settings'} icon="gauge" label="Billing & Usage" onClick={() => setNav('settings')} />
          <NavBtn active={false} icon="settings" label="Settings" onClick={() => setNav('settings')} />
        </div>
      </div>

      {/* User */}
      <div style={{ borderTop: '1px solid var(--po-line)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--po-sage-wash)', border: '1px solid var(--po-sage-line)', color: 'var(--po-sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11.5, fontWeight: 700, flexShrink: 0 }}>
          SR
        </span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--po-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Sanctuary Recovery</div>
          <div style={{ fontSize: 11, color: 'var(--po-text-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Pro plan</div>
        </div>
        <Icon name="chevronRight" size={14} stroke="var(--po-text-3)" />
      </div>
    </aside>
  )
}

export function TopSearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  return (
    <header style={{ height: 66, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px', borderBottom: '1px solid var(--po-line)', background: 'var(--po-panel)' }}>
      <div style={{ flex: 1, maxWidth: 520, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 9, height: 40, padding: '0 14px', borderRadius: 'var(--po-r)', background: 'var(--po-bg)', border: '1px solid var(--po-line)' }}>
        <Icon name="search" size={16} stroke="var(--po-text-3)" />
        <input
          placeholder="Search people, counties, facilities…"
          onKeyDown={e => {
            if (e.key === 'Enter') onSearch((e.target as HTMLInputElement).value)
          }}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 13.5, color: 'var(--po-text)', fontFamily: 'inherit', minWidth: 0 }}
        />
        <span className="po-mono" style={{ fontSize: 10.5, color: 'var(--po-text-3)', border: '1px solid var(--po-line)', borderRadius: 5, padding: '2px 6px', background: 'var(--po-panel)' }}>⌘K</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
        <span style={{ position: 'relative', display: 'flex' }}>
          <Icon name="bell" size={18} stroke="var(--po-text-2)" />
          <span className="po-mono" style={{ position: 'absolute', top: -7, right: -8, minWidth: 16, height: 16, borderRadius: 999, background: 'var(--po-danger)', color: 'var(--po-accent-fg)', fontSize: 9.5, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>3</span>
        </span>
        <Icon name="helpCircle" size={18} stroke="var(--po-text-2)" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--po-copper-wash)', border: '1px solid var(--po-copper-line)', color: 'var(--po-blue-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11.5, fontWeight: 700 }}>SR</span>
          <div className="l-nav-hide" style={{ lineHeight: 1.25 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--po-text)' }}>Sanctuary Recovery</div>
            <div style={{ fontSize: 11, color: 'var(--po-text-3)' }}>Pro plan</div>
          </div>
          <Icon name="chevronDown" size={14} stroke="var(--po-text-3)" />
        </div>
      </div>
    </header>
  )
}
