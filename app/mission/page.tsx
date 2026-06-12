import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { Icon } from '@/components/ui/Icon'

export const metadata = {
  title: 'Our Mission — ReentryIQ',
  description: 'The first 72 hours after release are the highest-risk window. Connecting people to treatment, housing, and programs before they walk out changes outcomes.',
}

const PRINCIPLES = [
  {
    icon: 'fileText',
    title: 'Public data, used for good',
    body: 'Every record in ReentryIQ comes from Arizona\'s public ADCRR inmate datasearch — the same records anyone can look up one at a time. We aggregate them, refresh them daily, and make them searchable so programs can act systematically instead of by chance.',
  },
  {
    icon: 'shield',
    title: 'Privacy first',
    body: 'We work exclusively with publicly available correctional data. We do not supplement records with commercial data brokers, social media scraping, or private databases. We are not a consumer reporting agency, and our data may never be used for FCRA-covered screening purposes.',
  },
  {
    icon: 'compass',
    title: 'Programs over screening',
    body: 'ReentryIQ exists to fill programs, not to screen people out. Our permitted uses are outreach, admissions, and program planning — the work of organizations trying to connect people to support, not gatekeepers deciding who gets a job or an apartment.',
  },
]

export default function MissionPage() {
  return (
    <div style={{ background: 'var(--po-bg)', minHeight: '100vh' }}>
      <SiteNav />
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '56px 32px 72px' }}>

        {/* Eyebrow + Mission statement */}
        <div style={{ marginBottom: 52 }}>
          <div
            style={{
              display: 'inline-block', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--po-blue)', background: 'var(--po-copper-wash)',
              border: '1px solid var(--po-copper-line)', padding: '5px 12px', borderRadius: 999, marginBottom: 18,
            }}
          >
            Our Mission
          </div>
          <h1 className="po-display" style={{ fontSize: 40, lineHeight: 1.1, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 20px', letterSpacing: '-0.02em' }}>
            Second chances start before the gate opens.
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--po-text-2)', margin: '0 0 16px' }}>
            Every year, tens of thousands of people are released from Arizona's corrections system. Most want to
            get clean, stay housed, and not come back. The research is unambiguous: people who connect to treatment,
            sober living, or a structured reentry program within the first 72 hours after release have dramatically
            better outcomes — lower recidivism, lower overdose rates, higher rates of sustained employment.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--po-text-2)', margin: 0 }}>
            The problem is timing. Programs don't know who's coming out. By the time a referral arrives, the window
            has often closed. <strong style={{ color: 'var(--po-text)' }}>ReentryIQ's mission is to close that information
            gap</strong> — so programs can reach people before they leave, not after they're already lost.
          </p>
        </div>

        {/* 72-hour callout */}
        <div
          style={{
            background: 'var(--po-navy)',
            borderRadius: 'var(--po-r)',
            padding: '30px 32px',
            marginBottom: 52,
          }}
        >
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <Icon name="clock" size={24} stroke="#fff" style={{ marginTop: 2 }} />
            <div>
              <h2 className="po-display" style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: '0 0 10px' }}>
                The 72-hour window
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.75)', margin: 0 }}>
                The period immediately following release is when risk is highest and intervention is most effective.
                People leave incarceration with disrupted support systems, interrupted treatment, and often a supply
                tolerance that has dropped during incarceration — making accidental overdose acutely dangerous.
                A confirmed bed, a known case manager, or even a phone call before release can be the difference
                between a stable transition and a crisis.
              </p>
            </div>
          </div>
        </div>

        {/* Principles */}
        <h2 className="po-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 20px', letterSpacing: '-0.01em' }}>
          How we operate
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
          {PRINCIPLES.map(p => (
            <div
              key={p.title}
              style={{
                background: 'var(--po-panel)',
                border: '1px solid var(--po-line)',
                borderRadius: 'var(--po-r)',
                padding: '22px 24px',
                display: 'flex', gap: 18, alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  width: 40, height: 40, flexShrink: 0, borderRadius: 8,
                  background: 'var(--po-copper-wash)', border: '1px solid var(--po-copper-line)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Icon name={p.icon} size={18} stroke="var(--po-blue)" />
              </div>
              <div>
                <h3 className="po-display" style={{ fontSize: 16, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 7px' }}>{p.title}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--po-text-2)', margin: 0 }}>{p.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Closing */}
        <p style={{ fontSize: 15.5, lineHeight: 1.75, color: 'var(--po-text-2)', margin: 0 }}>
          If you run a treatment center, sober living, transitional housing program, or reentry organization in
          Arizona and want to learn how ReentryIQ fits into your intake workflow,{' '}
          <a href="mailto:brian@manageai.io" style={{ color: 'var(--po-blue)', textDecoration: 'none' }}>reach out</a>.
          We built this for you.
        </p>

      </main>
      <SiteFooter />
    </div>
  )
}
