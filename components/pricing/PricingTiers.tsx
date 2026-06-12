'use client'

import { useState } from 'react'
import { Icon } from '@/components/ui/Icon'

type CellVal = boolean | string

interface Tier {
  id: string
  name: string
  /** monthly list price in dollars; null = custom */
  monthly: number | null
  /** annual per-month list price in dollars; null = custom */
  annual: number | null
  nonprofitEligible: boolean
  blurb: string
  cta: string
  href: string
  popular?: boolean
  isEnterprise?: boolean
}

const TIERS: Tier[] = [
  {
    id: 'free',
    name: 'Free',
    monthly: 0,
    annual: 0,
    nonprofitEligible: false,
    blurb: 'See the horizon. One county, summary view.',
    cta: 'Start free',
    href: '/signup',
  },
  {
    id: 'pro',
    name: 'Pro',
    monthly: 299,
    annual: 249,
    nonprofitEligible: true,
    blurb: 'The full search engine, alerts, and CRM push.',
    cta: 'Start Pro',
    href: '/signup',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthly: null,
    annual: null,
    nonprofitEligible: true,
    blurb: 'Multi-team, API access, and the AI data assistant.',
    cta: 'Talk to us',
    href: 'mailto:brian@manageai.io',
    isEnterprise: true,
  },
]

const CARD_FEATURES: Record<string, string[]> = {
  free: [
    '1 county scope',
    'Release horizon & county trends',
    'Weekly summary email',
    '25 record views / month',
  ],
  pro: [
    'Statewide scope',
    'Full record search & filters',
    'Saved searches with instant alerts',
    'Salesforce, KIPU, Sunwave & webhook push',
    '2,500 record views / month',
    'Priority support',
  ],
  enterprise: [
    'Everything in Pro',
    'AI data assistant (Ask AI)',
    'REST API access',
    'Unlimited record views',
    'Multiple teams & SSO',
    'Custom onboarding',
  ],
}

interface Group {
  label: string
  rows: { feat: string; vals: [CellVal, CellVal, CellVal] }[]
}

const GROUPS: Group[] = [
  {
    label: 'Data & search',
    rows: [
      { feat: 'County scope', vals: ['1 county', 'Statewide', 'Statewide'] },
      { feat: 'Release horizon & trends', vals: [true, true, true] },
      { feat: 'Full record search & filters', vals: [false, true, true] },
      { feat: 'AI data assistant (Ask AI)', vals: [false, false, true] },
      { feat: 'Record views / month', vals: ['25', '2,500', 'Unlimited'] },
    ],
  },
  {
    label: 'Alerts',
    rows: [
      { feat: 'Weekly summary email', vals: [true, true, true] },
      { feat: 'Saved searches', vals: [false, true, true] },
      { feat: 'Instant release-date alerts', vals: [false, true, true] },
    ],
  },
  {
    label: 'Integrations',
    rows: [
      { feat: 'Salesforce push', vals: [false, true, true] },
      { feat: 'KIPU push', vals: [false, true, true] },
      { feat: 'Sunwave push', vals: [false, true, true] },
      { feat: 'Signed webhooks', vals: [false, true, true] },
      { feat: 'REST API', vals: [false, false, true] },
    ],
  },
  {
    label: 'Support & limits',
    rows: [
      { feat: 'Support', vals: ['Community', 'Priority', 'Priority + onboarding'] },
      { feat: 'Teams & seats', vals: ['Single user', 'Single team', 'Multi-team + SSO'] },
      { feat: 'Overage', vals: ['—', '$25 / 250 views', 'Unlimited'] },
    ],
  },
]

const FAQ = [
  {
    q: 'How does metering work?',
    a: 'Every paid plan includes a monthly pool of record views — 2,500 on Pro. You see a banner as you approach the limit. Past it, additional views bill at $25 per additional 250 record views, so usage scales smoothly without a hard stop. Enterprise plans include unlimited views.',
  },
  {
    q: 'What counts as a record view?',
    a: 'A record view is the first time your organization reveals a full release record in a billing period. Re-opening a record you already revealed that month is free — you are never charged twice for the same person in the same period. Browsing summary counts, the release horizon, and county trends never consume a view.',
  },
  {
    q: 'Release dates changed — am I notified?',
    a: 'Yes. Release dates are set by the agency and can change. We refresh from public ADCRR records daily, timestamp the most recent available date, and fire an alert on any saved search whose match shifts. You always see when a date last changed.',
  },
  {
    q: 'How does nonprofit verification work?',
    a: 'Registered nonprofits and grant-funded programs get 20% off Pro and Enterprise. Toggle the nonprofit rate, start your plan, and submit your EIN — the discount applies once verified, usually within one business day.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Monthly plans have no contract — manage or cancel from the billing portal in Settings and you keep access through the end of the period. Annual plans run for the term you prepaid and renew only with your confirmation.',
  },
]

function formatPrice(tier: Tier, annual: boolean, nonprofit: boolean): string {
  const base = annual ? tier.annual : tier.monthly
  if (base === null) return 'Custom'
  if (base === 0) return '$0'
  const discounted = nonprofit && tier.nonprofitEligible ? Math.round(base * 0.8) : base
  return `$${discounted.toLocaleString()}`
}

function priceSub(tier: Tier, annual: boolean): string {
  if (tier.isEnterprise) return 'billed annually'
  if (tier.monthly === 0) return 'free forever'
  return annual ? 'per month, billed annually' : 'per month'
}

const checkBadge: React.CSSProperties = {
  display: 'inline-flex',
  width: 22,
  height: 22,
  borderRadius: 6,
  background: 'var(--po-sage-wash)',
  alignItems: 'center',
  justifyContent: 'center',
}

function Cell({ v, popular }: { v: CellVal; popular?: boolean }) {
  let inner: React.ReactNode
  if (v === true) {
    inner = (
      <span style={checkBadge}>
        <Icon name="check" size={14} stroke="var(--po-sage)" strokeWidth={2.4} />
      </span>
    )
  } else if (v === false) {
    inner = <span style={{ color: 'var(--po-text-3)', fontSize: 15 }}>—</span>
  } else {
    inner = <span style={{ fontSize: 13.5, color: 'var(--po-text)', fontWeight: 500 }}>{v}</span>
  }
  return (
    <div
      style={{
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        ...(popular ? { background: 'var(--po-blue-100)' } : {}),
      }}
    >
      {inner}
    </div>
  )
}

export function PricingTiers() {
  const [annual, setAnnual] = useState(false)
  const [nonprofit, setNonprofit] = useState(false)
  const [openFaq, setOpenFaq] = useState<number>(0)

  const segBtn = (active: boolean): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    height: 36,
    padding: '0 16px',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    background: active ? 'var(--po-navy)' : 'transparent',
    color: active ? '#F3F6FB' : 'var(--po-text-2)',
    fontSize: 13.5,
    fontWeight: 600,
    borderRadius: 'var(--po-r-sm)',
    transition: 'all .15s',
  })

  return (
    <>
      {/* Toggles */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          marginBottom: 36,
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            padding: 4,
            gap: 3,
            background: 'var(--po-panel)',
            border: '1px solid var(--po-line)',
            borderRadius: 'var(--po-r)',
          }}
        >
          <button type="button" onClick={() => setAnnual(false)} style={segBtn(!annual)}>
            Monthly
          </button>
          <button type="button" onClick={() => setAnnual(true)} style={segBtn(annual)}>
            Annual
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: 'var(--po-sage)',
                background: 'var(--po-sage-wash)',
                padding: '2px 7px',
                borderRadius: 999,
              }}
            >
              save 17%
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setNonprofit(n => !n)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 11,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: 13.5,
            padding: 0,
          }}
          aria-pressed={nonprofit}
        >
          <span
            style={{
              width: 38,
              height: 22,
              borderRadius: 999,
              background: nonprofit ? 'var(--po-blue)' : 'var(--po-line-strong)',
              position: 'relative',
              transition: 'background .18s',
              flexShrink: 0,
            }}
          >
            <i
              style={{
                position: 'absolute',
                top: 3,
                left: nonprofit ? 19 : 3,
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: '#fff',
                transition: 'left .18s',
              }}
            />
          </span>
          <span style={{ color: nonprofit ? 'var(--po-text)' : 'var(--po-text-2)', fontWeight: nonprofit ? 600 : 500 }}>
            Nonprofit or grant-funded — 20% off
          </span>
        </button>
      </div>

      {/* Tier cards */}
      <div
        className="l-cards3"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, alignItems: 'stretch' }}
      >
        {TIERS.map(t => {
          const discounted = nonprofit && t.nonprofitEligible && t.monthly !== null && t.monthly > 0
          return (
            <div
              key={t.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--po-panel)',
                border: t.popular ? '2px solid var(--po-blue)' : '1px solid var(--po-line)',
                borderRadius: 'var(--po-r)',
                padding: t.popular ? '34px 28px' : '26px 24px',
                position: 'relative',
              }}
            >
              {t.popular && (
                <span
                  style={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    background: 'var(--po-blue)',
                    color: '#fff',
                    borderRadius: 999,
                    padding: '4px 14px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Most popular
                </span>
              )}
              <h2 className="po-display" style={{ fontSize: 17, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 4px' }}>
                {t.name}
              </h2>
              <p style={{ fontSize: 13, color: 'var(--po-text-2)', margin: '0 0 18px', lineHeight: 1.5, minHeight: 38 }}>
                {t.blurb}
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, flexWrap: 'wrap' }}>
                <span className="po-mono po-display" style={{ fontSize: 36, fontWeight: 700, color: 'var(--po-text)', letterSpacing: '-0.02em' }}>
                  {formatPrice(t, annual, nonprofit)}
                </span>
                {discounted && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: 'var(--po-sage)',
                      background: 'var(--po-sage-wash)',
                      padding: '2px 6px',
                      borderRadius: 4,
                    }}
                  >
                    20% off
                  </span>
                )}
              </div>
              <div className="po-mono" style={{ fontSize: 12, color: 'var(--po-text-3)', marginTop: 4, marginBottom: 22 }}>
                {priceSub(t, annual)}
              </div>
              <a
                href={t.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 7,
                  height: 44,
                  borderRadius: 'var(--po-r)',
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 600,
                  marginBottom: 22,
                  background: t.popular ? 'var(--po-blue)' : 'var(--po-panel)',
                  color: t.popular ? '#fff' : 'var(--po-text)',
                  border: t.popular ? 'none' : '1px solid var(--po-line-strong)',
                }}
              >
                {t.cta} <Icon name="arrowRight" size={15} stroke={t.popular ? '#fff' : 'var(--po-text)'} />
              </a>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {CARD_FEATURES[t.id].map(f => (
                  <div
                    key={f}
                    style={{ display: 'flex', gap: 9, alignItems: 'flex-start', fontSize: 13.5, color: 'var(--po-text-2)', lineHeight: 1.45 }}
                  >
                    <Icon name="check" size={15} stroke="var(--po-sage)" style={{ marginTop: 2 }} />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Comparison table */}
      <div style={{ marginTop: 64 }}>
        <h2
          className="po-display"
          style={{ fontSize: 26, fontWeight: 700, color: 'var(--po-text)', textAlign: 'center', margin: '0 0 28px', letterSpacing: '-0.02em' }}
        >
          Compare every plan
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <div
            style={{
              minWidth: 720,
              border: '1px solid var(--po-line)',
              borderRadius: 'var(--po-r)',
              overflow: 'hidden',
              background: 'var(--po-panel)',
            }}
          >
            {/* Navy header row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr 1fr 1fr', background: 'var(--po-navy)' }}>
              <div style={{ padding: '16px 18px', fontSize: 13, fontWeight: 600, color: '#94A3B8' }}>Plans</div>
              {TIERS.map(t => (
                <div
                  key={t.id}
                  className="po-display"
                  style={{
                    padding: '16px 18px',
                    fontSize: 15,
                    fontWeight: 700,
                    color: t.popular ? '#A8C9F0' : '#F3F6FB',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                  }}
                >
                  {t.name}
                  {t.popular && (
                    <span
                      style={{
                        fontSize: 9.5,
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        color: '#fff',
                        background: 'var(--po-blue)',
                        padding: '2px 7px',
                        borderRadius: 999,
                      }}
                    >
                      Popular
                    </span>
                  )}
                </div>
              ))}
            </div>

            {GROUPS.map(g => (
              <div key={g.label}>
                <div
                  className="po-label"
                  style={{
                    padding: '18px 18px 8px',
                    borderTop: '1px solid var(--po-line)',
                    background: 'var(--po-panel-2)',
                  }}
                >
                  {g.label}
                </div>
                {g.rows.map(row => (
                  <div
                    key={row.feat}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.7fr 1fr 1fr 1fr',
                      borderTop: '1px solid var(--po-line)',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ padding: '12px 18px', fontSize: 13.5, color: 'var(--po-text-2)' }}>{row.feat}</div>
                    {row.vals.map((v, i) => (
                      <Cell key={i} v={v} popular={TIERS[i].popular} />
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <p className="po-mono" style={{ textAlign: 'center', fontSize: 12, color: 'var(--po-text-3)', marginTop: 18 }}>
          Overage on Pro: $25 per additional 250 record views · sourced from public ADCRR records, refreshed daily · not for FCRA-covered screening.
        </p>
      </div>

      {/* FAQ */}
      <div style={{ marginTop: 64, maxWidth: 760, marginLeft: 'auto', marginRight: 'auto' }}>
        <h2
          className="po-display"
          style={{ fontSize: 26, fontWeight: 700, color: 'var(--po-text)', textAlign: 'center', margin: '0 0 28px', letterSpacing: '-0.02em' }}
        >
          Questions, answered
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FAQ.map((f, i) => {
            const open = openFaq === i
            return (
              <div
                key={i}
                style={{
                  background: 'var(--po-panel)',
                  border: '1px solid var(--po-line)',
                  borderRadius: 'var(--po-r)',
                  overflow: 'hidden',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(open ? -1 : i)}
                  aria-expanded={open}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 16,
                    padding: '16px 20px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: 15,
                    fontWeight: 600,
                    color: 'var(--po-text)',
                    textAlign: 'left',
                  }}
                >
                  <span>{f.q}</span>
                  <Icon
                    name="chevronDown"
                    size={18}
                    stroke="var(--po-text-3)"
                    style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}
                  />
                </button>
                {open && (
                  <div style={{ padding: '0 20px 18px', fontSize: 14, lineHeight: 1.6, color: 'var(--po-text-2)' }}>{f.a}</div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
