import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { Icon } from '@/components/ui/Icon'

export const metadata = {
  title: 'Pricing — ReentryIQ',
  description: 'Plans for reentry & recovery programs of every size. Start free, no card required.',
}

const TIERS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    blurb: 'See the horizon. One county, summary view.',
    cta: 'Start free',
    href: '/dashboard',
    featured: false,
    features: [
      '1 county scope',
      'Release horizon & county trends',
      'Weekly summary email',
      '25 record views / month',
    ],
  },
  {
    name: 'Pro',
    price: '$299',
    period: 'per month',
    blurb: 'The full search engine, alerts, and CRM push.',
    cta: 'Start Pro',
    href: '/dashboard',
    featured: true,
    features: [
      'Statewide county scope',
      'Full record search & filters',
      'Saved searches with instant alerts',
      'Salesforce, KIPU, Sunwave & webhook push',
      '2,500 record views / month',
      'Priority support',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'annual',
    blurb: 'Multi-team, API access, and the AI data assistant.',
    cta: 'Talk to us',
    href: 'mailto:brian@manageai.io',
    featured: false,
    features: [
      'Everything in Pro',
      'AI data assistant (Ask AI)',
      'REST API access',
      'Unlimited record views',
      'Multiple teams & seats',
      'Nonprofit & grant-funded rates',
    ],
  },
]

export default function PricingPage() {
  return (
    <div style={{ background: 'var(--po-bg)', minHeight: '100vh' }}>
      <SiteNav />
      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '56px 32px 72px' }}>
        <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 44px' }}>
          <div
            style={{
              display: 'inline-block', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--po-blue)', background: 'var(--po-copper-wash)',
              border: '1px solid var(--po-copper-line)', padding: '5px 12px', borderRadius: 999, marginBottom: 18,
            }}
          >
            Pricing
          </div>
          <h1 className="po-display" style={{ fontSize: 38, lineHeight: 1.12, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 14px', letterSpacing: '-0.02em' }}>
            One admission pays for the year.
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--po-text-2)', margin: 0 }}>
            Start free, upgrade when you&apos;re ready. Nonprofit and grant-funded rates available on every paid plan.
          </p>
        </div>

        <div className="l-cards3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, alignItems: 'stretch' }}>
          {TIERS.map(t => (
            <div
              key={t.name}
              style={{
                display: 'flex', flexDirection: 'column',
                background: 'var(--po-panel)',
                border: t.featured ? '2px solid var(--po-blue)' : '1px solid var(--po-line)',
                borderRadius: 'var(--po-r)',
                padding: '26px 24px',
                position: 'relative',
              }}
            >
              {t.featured && (
                <span
                  style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                    background: 'var(--po-blue)', color: '#fff', borderRadius: 999, padding: '4px 14px', whiteSpace: 'nowrap',
                  }}
                >
                  Most popular
                </span>
              )}
              <h2 className="po-display" style={{ fontSize: 17, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 4px' }}>{t.name}</h2>
              <p style={{ fontSize: 13, color: 'var(--po-text-2)', margin: '0 0 18px', lineHeight: 1.5 }}>{t.blurb}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginBottom: 22 }}>
                <span className="po-display" style={{ fontSize: 36, fontWeight: 700, color: 'var(--po-text)', letterSpacing: '-0.02em' }}>{t.price}</span>
                <span style={{ fontSize: 13, color: 'var(--po-text-3)' }}>{t.period}</span>
              </div>
              <a
                href={t.href}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  height: 44, borderRadius: 'var(--po-r)', textDecoration: 'none',
                  fontSize: 14, fontWeight: 600, marginBottom: 22,
                  background: t.featured ? 'var(--po-blue)' : 'var(--po-panel)',
                  color: t.featured ? '#fff' : 'var(--po-text)',
                  border: t.featured ? 'none' : '1px solid var(--po-line-strong)',
                }}
              >
                {t.cta} <Icon name="arrowRight" size={15} stroke={t.featured ? '#fff' : 'var(--po-text)'} />
              </a>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {t.features.map(f => (
                  <div key={f} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', fontSize: 13.5, color: 'var(--po-text-2)', lineHeight: 1.45 }}>
                    <Icon name="check" size={15} stroke="var(--po-sage)" style={{ marginTop: 2 }} />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--po-text-3)', marginTop: 36 }}>
          All plans: sourced from public ADCRR records · refreshed daily · not for FCRA-covered screening.
        </p>
      </main>
      <SiteFooter />
    </div>
  )
}
