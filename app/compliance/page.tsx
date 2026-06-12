import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { Icon } from '@/components/ui/Icon'

export const metadata = {
  title: 'Compliance — ReentryIQ',
  description: 'Permitted and prohibited uses of ReentryIQ data. We are not a consumer reporting agency. Data may never be used for FCRA-covered screening purposes.',
}

const PERMITTED = [
  { title: 'Outreach to returning individuals', body: 'Contacting or attempting to contact people approaching release to offer program placement, housing, treatment, or other reentry services.' },
  { title: 'Admissions planning', body: 'Identifying upcoming releases that match your program\'s eligibility criteria to plan bed capacity, intake scheduling, and caseload staffing.' },
  { title: 'Program capacity planning', body: 'Using aggregate release data to forecast demand for services by county, facility, or release type — for grant reporting, budget planning, or program design.' },
  { title: 'Research & policy analysis', body: 'Academic, nonprofit, or government research on reentry trends, release patterns, or program need — with appropriate data governance and IRB oversight where applicable.' },
]

const PROHIBITED = [
  'Employment screening or background checks of any kind',
  'Tenant or housing application screening',
  'Credit or insurance underwriting decisions',
  'Any purpose that would make ReentryIQ a "consumer reporting agency" under the FCRA',
  'Law enforcement investigations or suspect identification',
  'Sale or redistribution of ReentryIQ data to third parties',
  'Building derivative products or data products from ReentryIQ data',
  'Any use prohibited by applicable state or federal law',
]

export default function CompliancePage() {
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
            Compliance
          </div>
          <h1 className="po-display" style={{ fontSize: 40, lineHeight: 1.1, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            Permitted use, in plain English.
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--po-text-2)', margin: 0 }}>
            ReentryIQ exists to help reentry and recovery programs reach people at the moment of release.
            That is the only purpose for which it was built, and the only purpose for which it may be used.
            This page explains what that means in practice.
          </p>
        </div>

        {/* FCRA callout */}
        <div
          style={{
            background: 'var(--po-navy)', borderRadius: 'var(--po-r)',
            padding: '26px 28px', marginBottom: 36,
            display: 'flex', gap: 18, alignItems: 'flex-start',
          }}
        >
          <div style={{ flexShrink: 0, marginTop: 2 }}>
            <Icon name="shield" size={24} stroke="#fff" />
          </div>
          <div>
            <h2 className="po-display" style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 10px' }}>
              ReentryIQ is not a consumer reporting agency
            </h2>
            <p style={{ fontSize: 14.5, lineHeight: 1.7, color: 'rgba(255,255,255,0.8)', margin: 0 }}>
              ReentryIQ is <strong style={{ color: '#fff' }}>not</strong> a consumer reporting agency (CRA) as defined
              by the Fair Credit Reporting Act (FCRA). ReentryIQ data may not be used for employment screening,
              tenant screening, credit decisions, insurance underwriting, or any other FCRA-covered purpose.
              Using ReentryIQ for these purposes violates our Terms of Service and may constitute a federal
              violation of the FCRA.
            </p>
          </div>
        </div>

        {/* Permitted uses */}
        <div style={{ marginBottom: 36 }}>
          <h2 className="po-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 6px', letterSpacing: '-0.01em' }}>
            Permitted uses
          </h2>
          <p style={{ fontSize: 14, color: 'var(--po-text-2)', margin: '0 0 18px' }}>
            ReentryIQ may be used only for the following purposes:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PERMITTED.map(item => (
              <div
                key={item.title}
                style={{
                  background: 'var(--po-panel)', border: '1px solid var(--po-line)',
                  borderRadius: 'var(--po-r)', padding: '18px 20px',
                  display: 'flex', gap: 14, alignItems: 'flex-start',
                }}
              >
                <Icon name="checkCircle" size={18} stroke="var(--po-sage)" style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 5px' }}>{item.title}</h3>
                  <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--po-text-2)', margin: 0 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prohibited uses */}
        <div style={{ marginBottom: 36 }}>
          <h2 className="po-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 6px', letterSpacing: '-0.01em' }}>
            Prohibited uses
          </h2>
          <p style={{ fontSize: 14, color: 'var(--po-text-2)', margin: '0 0 18px' }}>
            The following uses are expressly prohibited:
          </p>
          <div
            style={{
              background: 'var(--po-panel)', border: '1px solid var(--po-line)',
              borderRadius: 'var(--po-r)', overflow: 'hidden',
            }}
          >
            {PROHIBITED.map((item, i) => (
              <div
                key={item}
                style={{
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  padding: '14px 20px',
                  borderBottom: i < PROHIBITED.length - 1 ? '1px solid var(--po-line)' : 'none',
                }}
              >
                <Icon name="x" size={15} stroke="#c0392b" style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--po-text-2)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Attestation at signup */}
        <div style={{ marginBottom: 36 }}>
          <h2 className="po-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
            Attestation at signup
          </h2>
          <p style={{ fontSize: 15.5, lineHeight: 1.75, color: 'var(--po-text-2)', margin: 0 }}>
            Every ReentryIQ account holder attests at signup that they will use the platform only for permitted
            purposes. By creating an account, you represent that your organization is a reentry program, recovery
            program, treatment provider, transitional housing operator, or other service-providing organization
            engaged in outreach and support for people returning from incarceration — and that you will not use
            ReentryIQ data for any FCRA-covered or otherwise prohibited purpose.
          </p>
        </div>

        {/* Enforcement */}
        <div style={{ marginBottom: 36 }}>
          <h2 className="po-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
            Enforcement
          </h2>
          <p style={{ fontSize: 15.5, lineHeight: 1.75, color: 'var(--po-text-2)', margin: '0 0 14px' }}>
            Accounts found to be in violation of permitted-use terms will be suspended immediately and permanently.
            We reserve the right to report suspected FCRA violations to the Federal Trade Commission or relevant
            state authority. Misuse of public correctional data for screening purposes is not a gray area — it
            causes direct harm to people who are already navigating significant barriers.
          </p>
          <p style={{ fontSize: 15.5, lineHeight: 1.75, color: 'var(--po-text-2)', margin: 0 }}>
            If you become aware of misuse of ReentryIQ, contact us at{' '}
            <a href="mailto:brian@manageai.io" style={{ color: 'var(--po-blue)', textDecoration: 'none' }}>brian@manageai.io</a>.
          </p>
        </div>

        {/* Data handling */}
        <div style={{ marginBottom: 40 }}>
          <h2 className="po-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
            Data handling
          </h2>
          <p style={{ fontSize: 15.5, lineHeight: 1.75, color: 'var(--po-text-2)', margin: '0 0 14px' }}>
            ReentryIQ stores the minimum data necessary to operate the platform. Account data is not sold or
            shared with third parties. CRM push integrations transmit only the data your team has explicitly
            configured to send. API access is logged and subject to the same use restrictions as the web application.
          </p>
          <p style={{ fontSize: 15.5, lineHeight: 1.75, color: 'var(--po-text-2)', margin: 0 }}>
            For the complete data handling policy, see our{' '}
            <a href="/privacy" style={{ color: 'var(--po-blue)', textDecoration: 'none' }}>Privacy Policy</a>.
          </p>
        </div>

        {/* Related links */}
        <div
          style={{
            background: 'var(--po-panel)', border: '1px solid var(--po-line)',
            borderRadius: 'var(--po-r)', padding: '20px 22px',
            display: 'flex', gap: 24, flexWrap: 'wrap',
          }}
        >
          <span style={{ fontSize: 13, color: 'var(--po-text-3)', fontWeight: 600 }}>Related policies:</span>
          <a href="/acceptable-use" style={{ fontSize: 13, color: 'var(--po-blue)', textDecoration: 'none' }}>Acceptable Use Policy</a>
          <a href="/fcra-notice" style={{ fontSize: 13, color: 'var(--po-blue)', textDecoration: 'none' }}>FCRA Notice</a>
          <a href="/privacy" style={{ fontSize: 13, color: 'var(--po-blue)', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="/data-sourcing" style={{ fontSize: 13, color: 'var(--po-blue)', textDecoration: 'none' }}>Data Sourcing</a>
        </div>

      </main>
      <SiteFooter />
    </div>
  )
}
