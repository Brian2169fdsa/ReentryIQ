import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { Icon } from '@/components/ui/Icon'

export const metadata = {
  title: 'Contact — ReentryIQ',
  description: 'Get in touch with the ReentryIQ team. Demo requests, nonprofit rates, and general questions — we respond within one business day.',
}

export default function ContactPage() {
  return (
    <div style={{ background: 'var(--po-bg)', minHeight: '100vh' }}>
      <SiteNav />
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '56px 32px 72px' }}>

        {/* Eyebrow + Hero */}
        <div style={{ marginBottom: 44 }}>
          <div
            style={{
              display: 'inline-block', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--po-blue)', background: 'var(--po-copper-wash)',
              border: '1px solid var(--po-copper-line)', padding: '5px 12px', borderRadius: 999, marginBottom: 18,
            }}
          >
            Contact
          </div>
          <h1 className="po-display" style={{ fontSize: 40, lineHeight: 1.1, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 14px', letterSpacing: '-0.02em' }}>
            We&apos;re a short email away.
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: 'var(--po-text-2)', margin: 0 }}>
            ReentryIQ is built and operated by a small team at Manage AI. We respond to every inquiry personally,
            typically within one business day.
          </p>
        </div>

        {/* Main contact card */}
        <div
          style={{
            background: 'var(--po-panel)',
            border: '1px solid var(--po-line)',
            borderRadius: 'var(--po-r)',
            padding: '28px 28px',
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 24 }}>
            <div
              style={{
                width: 44, height: 44, flexShrink: 0, borderRadius: 10,
                background: 'var(--po-copper-wash)', border: '1px solid var(--po-copper-line)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Icon name="send" size={20} stroke="var(--po-blue)" />
            </div>
            <div>
              <h2 className="po-display" style={{ fontSize: 18, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 5px' }}>
                Demo requests &amp; general inquiries
              </h2>
              <p style={{ fontSize: 14, color: 'var(--po-text-2)', margin: 0 }}>
                Response within 1 business day
              </p>
            </div>
          </div>

          <a
            href="mailto:brian@manageai.io"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 17, fontWeight: 600, color: 'var(--po-blue)', textDecoration: 'none',
              marginBottom: 24,
            }}
          >
            <Icon name="send" size={16} stroke="var(--po-blue)" />
            brian@manageai.io
          </a>

          <div
            style={{
              background: 'var(--po-bg)',
              border: '1px solid var(--po-line)',
              borderRadius: 'var(--po-r)',
              padding: '16px 18px',
            }}
          >
            <p className="po-label" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--po-text-3)', textTransform: 'uppercase', margin: '0 0 10px' }}>
              What to include in a demo request
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'Your organization name and type (treatment center, reentry program, sober living, etc.)',
                'Which Arizona counties or facilities you primarily serve',
                'Rough team size and whether you use a CRM (Salesforce, KIPU, Sunwave, or other)',
                'What you\'re hoping ReentryIQ helps you do',
              ].map(item => (
                <div key={item} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', fontSize: 13.5, color: 'var(--po-text-2)', lineHeight: 1.5 }}>
                  <Icon name="check" size={14} stroke="var(--po-sage)" style={{ marginTop: 2, flexShrink: 0 }} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Nonprofit card */}
        <div
          style={{
            background: 'var(--po-panel)',
            border: '1px solid var(--po-line)',
            borderRadius: 'var(--po-r)',
            padding: '28px 28px',
            marginBottom: 36,
          }}
        >
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 16 }}>
            <div
              style={{
                width: 44, height: 44, flexShrink: 0, borderRadius: 10,
                background: 'var(--po-sage-wash)', border: '1px solid var(--po-sage-line)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Icon name="users" size={20} stroke="var(--po-sage)" />
            </div>
            <div>
              <h2 className="po-display" style={{ fontSize: 18, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 5px' }}>
                Nonprofit &amp; grant-funded rates
              </h2>
              <p style={{ fontSize: 14, color: 'var(--po-text-2)', margin: 0 }}>
                Reduced pricing for organizations with limited budgets
              </p>
            </div>
          </div>
          <p style={{ fontSize: 14.5, lineHeight: 1.7, color: 'var(--po-text-2)', margin: '0 0 14px' }}>
            We believe tools like ReentryIQ should be accessible to the organizations doing the hardest work,
            regardless of budget. Nonprofit rates and grant-funded pricing are available on Pro and Enterprise plans.
          </p>
          <p style={{ fontSize: 14.5, lineHeight: 1.7, color: 'var(--po-text-2)', margin: 0 }}>
            Email <a href="mailto:brian@manageai.io" style={{ color: 'var(--po-blue)', textDecoration: 'none' }}>brian@manageai.io</a> with
            your organization's nonprofit status or grant documentation and we&apos;ll work out pricing that fits.
          </p>
        </div>

        {/* Response note */}
        <p style={{ fontSize: 13, color: 'var(--po-text-3)', lineHeight: 1.6, margin: 0 }}>
          We are based in Phoenix, Arizona (Mountain Standard Time). We respond to all inquiries within one
          business day, Monday through Friday. For urgent data issues, include "urgent" in your subject line.
        </p>

      </main>
      <SiteFooter />
    </div>
  )
}
