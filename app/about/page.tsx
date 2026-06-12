import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { Icon } from '@/components/ui/Icon'

export const metadata = {
  title: 'About — ReentryIQ',
  description: 'Why ReentryIQ exists: programs were finding out about releases too late. Outreach at the gate changes outcomes.',
}

const STATS = [
  { value: '750+', label: 'Releases tracked monthly', icon: 'users' },
  { value: '10', label: 'Arizona counties covered', icon: 'mapPin' },
  { value: 'Daily', label: 'Data refresh cadence', icon: 'refresh' },
]

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--po-bg)', minHeight: '100vh' }}>
      <SiteNav />
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '56px 32px 72px' }}>

        {/* Eyebrow + Hero */}
        <div style={{ marginBottom: 48 }}>
          <div
            style={{
              display: 'inline-block', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--po-blue)', background: 'var(--po-copper-wash)',
              border: '1px solid var(--po-copper-line)', padding: '5px 12px', borderRadius: 999, marginBottom: 18,
            }}
          >
            About ReentryIQ
          </div>
          <h1 className="po-display" style={{ fontSize: 40, lineHeight: 1.1, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            Programs were finding out about releases too late.
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--po-text-2)', margin: 0 }}>
            By the time a reentry coordinator heard that someone was getting out, the release had already happened —
            sometimes days earlier. The person had already walked into an unfamiliar world with no housing, no treatment,
            and no connection to the programs that could have been waiting for them. We built ReentryIQ to close that gap.
          </p>
        </div>

        {/* Stat band */}
        <div
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
            marginBottom: 52,
          }}
        >
          {STATS.map(s => (
            <div
              key={s.label}
              style={{
                background: 'var(--po-panel)',
                border: '1px solid var(--po-line)',
                borderRadius: 'var(--po-r)',
                padding: '22px 20px',
                display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start',
              }}
            >
              <Icon name={s.icon} size={20} stroke="var(--po-blue)" />
              <span className="po-mono" style={{ fontSize: 32, fontWeight: 700, color: 'var(--po-text)', lineHeight: 1 }}>{s.value}</span>
              <span style={{ fontSize: 13, color: 'var(--po-text-2)', lineHeight: 1.4 }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* What it is */}
        <div style={{ marginBottom: 40 }}>
          <h2 className="po-display" style={{ fontSize: 24, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 14px', letterSpacing: '-0.01em' }}>
            What ReentryIQ is
          </h2>
          <p style={{ fontSize: 15.5, lineHeight: 1.75, color: 'var(--po-text-2)', margin: '0 0 14px' }}>
            ReentryIQ is a release intelligence platform for Arizona reentry and recovery programs — treatment centers,
            sober livings, transitional housing, and community supervision programs. It surfaces upcoming releases from
            public Arizona Department of Corrections, Rehabilitation & Reentry (ADCRR) data so your team can reach
            people before they walk out the gate.
          </p>
          <p style={{ fontSize: 15.5, lineHeight: 1.75, color: 'var(--po-text-2)', margin: 0 }}>
            The platform combines a full-text search engine, saved-search alerts, and direct CRM push (Salesforce,
            KIPU, Sunwave, and generic webhook) into a single workflow. Your intake coordinator sets a search for
            releases from specific facilities, offense classes, or counties — and ReentryIQ does the watching.
            When a match comes in, it goes straight into your CRM as a lead, ready for outreach.
          </p>
        </div>

        {/* Why it matters */}
        <div style={{ marginBottom: 40 }}>
          <h2 className="po-display" style={{ fontSize: 24, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 14px', letterSpacing: '-0.01em' }}>
            Why outreach at the gate changes outcomes
          </h2>
          <p style={{ fontSize: 15.5, lineHeight: 1.75, color: 'var(--po-text-2)', margin: '0 0 14px' }}>
            Research on reentry consistently shows that the first 72 hours after release are the period of highest risk
            for relapse, rearrest, and fatal overdose. People are often released with little more than a bus ticket and
            the clothes they came in with. Programs that can reach someone at or before release — with a bed confirmed,
            a detox slot reserved, a case manager's name and number — dramatically change what happens next.
          </p>
          <p style={{ fontSize: 15.5, lineHeight: 1.75, color: 'var(--po-text-2)', margin: 0 }}>
            ReentryIQ doesn't replace the relationships and trust your program has built. It makes sure your team
            has the information to act before the window closes.
          </p>
        </div>

        {/* Built by */}
        <div
          style={{
            background: 'var(--po-blue-100)',
            border: '1px solid var(--po-copper-line)',
            borderRadius: 'var(--po-r)',
            padding: '24px 26px',
            display: 'flex', gap: 18, alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              width: 44, height: 44, flexShrink: 0, borderRadius: 10,
              background: 'var(--po-panel)', border: '1px solid var(--po-copper-line)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Icon name="building" size={22} stroke="var(--po-blue)" />
          </div>
          <div>
            <h3 className="po-display" style={{ fontSize: 16, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 6px' }}>
              Built by Manage AI in Arizona
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--po-text-2)', margin: 0 }}>
              ReentryIQ is a product of Manage AI, a Phoenix-based applied AI company. We build tools that put
              public data to work for mission-driven organizations. ReentryIQ started with a single question from
              a treatment center director: <em>"Is there any way to know who's getting out before they get out?"</em>{' '}
              That question drove everything you see here. Questions or partnership inquiries:{' '}
              <a href="mailto:brian@manageai.io" style={{ color: 'var(--po-blue)', textDecoration: 'none' }}>brian@manageai.io</a>.
            </p>
          </div>
        </div>

      </main>
      <SiteFooter />
    </div>
  )
}
