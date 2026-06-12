import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { CtaBand } from '@/components/layout/CtaBand'
import { PricingTiers } from '@/components/pricing/PricingTiers'

export const metadata = {
  title: 'Pricing — ReentryIQ',
  description: 'Plans for reentry & recovery programs of every size. Start free, no card required. Nonprofit and grant-funded rates on every paid plan.',
}

export default function PricingPage() {
  return (
    <div style={{ background: 'var(--po-bg)', minHeight: '100vh' }}>
      <SiteNav />
      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '56px 32px 72px' }}>
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 44px' }}>
          <div
            style={{
              display: 'inline-block',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--po-blue)',
              background: 'var(--po-copper-wash)',
              border: '1px solid var(--po-copper-line)',
              padding: '5px 12px',
              borderRadius: 999,
              marginBottom: 18,
            }}
          >
            Pricing
          </div>
          <h1
            className="po-display"
            style={{
              fontSize: 38,
              lineHeight: 1.12,
              fontWeight: 700,
              color: 'var(--po-text)',
              margin: '0 0 14px',
              letterSpacing: '-0.02em',
            }}
          >
            Priced to pay for itself in one admission.
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--po-text-2)', margin: 0 }}>
            Start free, upgrade when you&apos;re ready. A predictable subscription floor with metered overage only if you go past it — no per-pull surprises. Nonprofit and grant-funded rates on every paid plan.
          </p>
        </div>

        <PricingTiers />
      </main>
      <CtaBand />
      <SiteFooter />
    </div>
  )
}
