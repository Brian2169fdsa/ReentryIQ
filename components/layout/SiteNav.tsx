'use client'

import { useState } from 'react'
import { Wordmark } from '@/components/ui/Wordmark'
import { Icon } from '@/components/ui/Icon'

const MEGA = [
  {
    id: 'Product',
    aside: 'Everything in the platform, from search to push.',
    items: [
      { label: 'Dashboard', href: '/dashboard', desc: 'Your release pipeline at a glance', icon: 'dashboard' },
      { label: 'Pricing', href: '/pricing', desc: 'Plans, overage & nonprofit rates', icon: 'gauge' },
      { label: 'Connectors', href: '#', desc: 'Salesforce, KIPU, Sunwave, webhooks', icon: 'plug' },
      { label: 'REST API', href: '#', desc: 'Read-only access to your scope', icon: 'compass' },
    ],
  },
  {
    id: 'Company',
    aside: 'The mission and the people behind ReentryIQ.',
    items: [
      { label: 'About', href: '#', desc: 'Why we built ReentryIQ', icon: 'users' },
      { label: 'Our mission', href: '#', desc: 'Reentry, recovery, second chances', icon: 'target' },
      { label: 'Contact', href: '#', desc: 'Talk to the team', icon: 'send' },
      { label: 'Careers', href: '#', desc: 'Join the team', icon: 'building' },
    ],
  },
  {
    id: 'Resources',
    aside: 'How the data works and how to get help.',
    items: [
      { label: 'Data sourcing', href: '#', desc: 'Public ADCRR records, refreshed daily', icon: 'fileText' },
      { label: 'Compliance', href: '#', desc: 'Permitted-use & FCRA posture', icon: 'shield' },
      { label: 'Help center', href: '#', desc: 'Guides and answers', icon: 'helpCircle' },
      { label: 'Status', href: '#', desc: 'System uptime', icon: 'checkCircle' },
    ],
  },
  {
    id: 'Legal',
    aside: 'Terms, privacy, and permitted use.',
    items: [
      { label: 'Terms of Service', href: '#', desc: 'The agreement', icon: 'fileText' },
      { label: 'Privacy Policy', href: '#', desc: 'How we handle data', icon: 'shield' },
      { label: 'Acceptable Use', href: '#', desc: 'Prohibited uses, plainly', icon: 'list' },
      { label: 'FCRA Notice', href: '#', desc: 'Not for screening', icon: 'note' },
    ],
  },
]

export function SiteNav() {
  const [open, setOpen] = useState<string | null>(null)
  const group = MEGA.find(g => g.id === open)

  return (
    <header
      onMouseLeave={() => setOpen(null)}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'rgba(255,255,255,0.94)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--po-line)',
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '0 32px',
          height: 66,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
        }}
      >
        <Wordmark />

        {/* Mega menu triggers */}
        <nav className="site-nav-triggers" style={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 10 }}>
          {MEGA.map(g => (
            <button
              key={g.id}
              onMouseEnter={() => setOpen(g.id)}
              onFocus={() => setOpen(g.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                height: 38,
                padding: '0 13px',
                borderRadius: 'var(--po-r-sm)',
                border: 'none',
                background: open === g.id ? 'var(--po-elevated-2)' : 'transparent',
                color: open === g.id ? 'var(--po-text)' : 'var(--po-text-2)',
                fontSize: 14,
                fontWeight: 500,
                fontFamily: 'inherit',
                cursor: 'pointer',
                transition: 'background 0.14s, color 0.14s',
              }}
            >
              {g.id}
              <Icon
                name="chevronDown"
                size={14}
                stroke="currentColor"
                style={{
                  transform: open === g.id ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.18s',
                }}
              />
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 18, flexShrink: 0 }}>
          <a
            href="/dashboard"
            className="l-nav-hide"
            style={{ fontSize: 14, fontWeight: 500, color: 'var(--po-text-2)', textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            Sign in
          </a>
          <a
            href="/dashboard"
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: '#fff',
              background: 'var(--po-blue)',
              padding: '9px 18px',
              borderRadius: 'var(--po-r)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Start free
          </a>
        </div>
      </div>

      {/* Mega panel */}
      {group && (
        <div
          onMouseEnter={() => setOpen(group.id)}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--po-panel)',
            borderBottom: '1px solid var(--po-line)',
            borderTop: '1px solid var(--po-line)',
          }}
        >
          <div
            style={{
              maxWidth: 1180,
              margin: '0 auto',
              padding: '24px 32px 28px',
              display: 'grid',
              gridTemplateColumns: '0.8fr 2.4fr',
              gap: 36,
            }}
          >
            {/* Aside */}
            <div style={{ borderRight: '1px solid var(--po-line)', paddingRight: 28 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--po-blue)',
                  marginBottom: 8,
                }}
              >
                {group.id}
              </div>
              <div style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--po-text-2)', marginBottom: 14 }}>
                {group.aside}
              </div>
              <a
                href={group.items[0].href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--po-blue)',
                  textDecoration: 'none',
                }}
              >
                Explore {group.id} <Icon name="arrowRight" size={14} stroke="var(--po-blue)" />
              </a>
            </div>

            {/* Items grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {group.items.map(it => (
                <a
                  key={it.label}
                  href={it.href}
                  style={{
                    display: 'flex',
                    gap: 12,
                    padding: '11px 12px',
                    borderRadius: 'var(--po-r)',
                    textDecoration: 'none',
                    alignItems: 'flex-start',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--po-panel-2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 9,
                      background: 'var(--po-copper-wash)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon name={it.icon} size={18} stroke="var(--po-blue)" />
                  </span>
                  <span>
                    <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--po-text)' }}>
                      {it.label}
                    </span>
                    <span style={{ display: 'block', fontSize: 12.5, color: 'var(--po-text-3)', marginTop: 2, lineHeight: 1.4 }}>
                      {it.desc}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
