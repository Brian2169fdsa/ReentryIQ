import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'

export const metadata = {
  title: 'FCRA Notice — ReentryIQ',
  description: 'Important notice: ReentryIQ is not a consumer reporting agency. The Fair Credit Reporting Act prohibits use of this service for employment, housing, credit, or insurance screening.',
}

// ── Presentational helpers ────────────────────────────────────────────────────

function PageHeader({ title }: { title: string }) {
  return (
    <div style={{ marginBottom: 40, paddingBottom: 28, borderBottom: '1px solid var(--po-line)' }}>
      <div
        className="po-label"
        style={{
          display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'var(--po-blue)', marginBottom: 14,
        }}
      >
        Legal
      </div>
      <h1
        className="po-display"
        style={{ fontSize: 32, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 12px', letterSpacing: '-0.02em', lineHeight: 1.15 }}
      >
        {title}
      </h1>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <span className="po-mono" style={{ fontSize: 12, color: 'var(--po-text-3)' }}>Effective June 12, 2026</span>
        <span className="po-mono" style={{ fontSize: 12, color: 'var(--po-text-3)' }}>Last updated June 12, 2026</span>
      </div>
    </div>
  )
}

function SectionHeading({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <h2
      className="po-display"
      style={{ fontSize: 18, fontWeight: 700, color: 'var(--po-text)', margin: '36px 0 10px', letterSpacing: '-0.01em' }}
    >
      <span className="po-mono" style={{ fontSize: 13, color: 'var(--po-text-3)', marginRight: 10 }}>{String(n).padStart(2, '0')}</span>
      {children}
    </h2>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 14.5, lineHeight: 1.7, color: 'var(--po-text-2)', margin: '0 0 14px' }}>
      {children}
    </p>
  )
}

function Ul({ children }: { children: React.ReactNode }) {
  return (
    <ul style={{ fontSize: 14.5, lineHeight: 1.7, color: 'var(--po-text-2)', margin: '0 0 14px', paddingLeft: 24 }}>
      {children}
    </ul>
  )
}

function Li({ children }: { children: React.ReactNode }) {
  return <li style={{ marginBottom: 6 }}>{children}</li>
}

function AlertBanner({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        margin: '0 0 36px',
        padding: '24px 28px',
        background: 'var(--po-panel)',
        border: '1px solid var(--po-line)',
        borderLeft: '4px solid var(--po-blue)',
        borderRadius: 'var(--po-r)',
      }}
    >
      {children}
    </div>
  )
}

function ReviewNote() {
  return (
    <div
      style={{
        marginTop: 52, padding: '16px 20px', background: 'var(--po-panel)',
        border: '1px solid var(--po-line)', borderRadius: 'var(--po-r)',
      }}
    >
      <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--po-text-3)', margin: 0 }}>
        <strong style={{ color: 'var(--po-text-2)' }}>Note:</strong> This document is provided as a template for review by qualified legal counsel before relying on it.
      </p>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function FcraNoticePage() {
  return (
    <div style={{ background: 'var(--po-bg)', minHeight: '100vh' }}>
      <SiteNav />
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '56px 32px 72px' }}>
        <PageHeader title="FCRA Notice" />

        <AlertBanner>
          <p
            className="po-label"
            style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--po-blue)', margin: '0 0 12px',
            }}
          >
            Important Legal Notice — Please Read Before Using This Service
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--po-text)', margin: 0, fontWeight: 500 }}>
            ReentryIQ is <strong>not</strong> a consumer reporting agency. Its data is <strong>not</strong>{' '}
            a consumer report. You may <strong>not</strong> use this service to screen anyone for employment,
            housing, credit, insurance, or any other purpose covered by the Fair Credit Reporting Act
            (15&nbsp;U.S.C.&nbsp;§&nbsp;1681&nbsp;et seq.).
          </p>
        </AlertBanner>

        <SectionHeading n={1}>What the FCRA Is and Why It Matters</SectionHeading>
        <P>
          The Fair Credit Reporting Act (15 U.S.C. § 1681 et seq., the &ldquo;FCRA&rdquo;) is a federal
          law that regulates the collection, assembly, and use of consumer information for certain
          eligibility determinations. The FCRA imposes strict requirements on &ldquo;consumer reporting
          agencies&rdquo; — entities that regularly assemble or evaluate consumer information for the
          purpose of furnishing &ldquo;consumer reports&rdquo; to third parties.
        </P>
        <P>
          A &ldquo;consumer report&rdquo; under the FCRA is any communication of information that bears on
          a consumer&apos;s creditworthiness, credit standing, credit capacity, character, general
          reputation, personal characteristics, or mode of living, which is used or expected to be used or
          collected in whole or in part for the purpose of determining eligibility for credit, insurance,
          employment, housing, or any other purpose authorized under the Act. Misuse of data as a consumer
          report — by a user or by a data provider acting as an unregistered CRA — can give rise to civil
          liability of up to $1,000 per violation (or actual damages, whichever is greater), plus punitive
          damages and attorneys&apos; fees, and may also constitute a criminal offense.
        </P>

        <SectionHeading n={2}>ReentryIQ Is Not a Consumer Reporting Agency</SectionHeading>
        <P>
          ReentryIQ is not a consumer reporting agency as defined by the FCRA. Manage AI does not assemble
          or evaluate information about consumers for the purpose of furnishing consumer reports, and the
          data accessible through the Service is not assembled, maintained, or intended for consumer-report
          purposes.
        </P>
        <P>
          The release records surfaced by ReentryIQ are publicly available records published by the Arizona
          Department of Corrections, Rehabilitation &amp; Reentry (&ldquo;ADCRR&rdquo;) for purposes of
          government transparency and public accountability. Manage AI retrieves, normalizes, and presents
          this public data to assist qualified reentry and recovery organizations in identifying individuals
          who may benefit from their services — a purpose fundamentally distinct from consumer screening.
        </P>

        <SectionHeading n={3}>Prohibited Screening Purposes</SectionHeading>
        <P>
          You may not use any data obtained through ReentryIQ — in whole or in part, alone or in combination
          with other data — to make or inform eligibility determinations for any of the following
          purposes:
        </P>
        <Ul>
          <Li><strong>Employment.</strong> You may not use Service data to decide whether to hire, promote, retain, or terminate any individual, or to conduct pre-employment or ongoing-employment background screening.</Li>
          <Li><strong>Housing or tenancy.</strong> You may not use Service data to decide whether to rent, lease, or sell housing to any individual, or to screen rental or housing applicants in any manner.</Li>
          <Li><strong>Credit.</strong> You may not use Service data to evaluate a person&apos;s creditworthiness or eligibility for any loan, credit card, line of credit, or other credit product.</Li>
          <Li><strong>Insurance.</strong> You may not use Service data to determine eligibility for, or the pricing of, any insurance product.</Li>
          <Li><strong>Licensing or certification.</strong> You may not use Service data to evaluate an individual&apos;s fitness for a professional license, government clearance, or certification.</Li>
          <Li><strong>Any other FCRA-covered purpose.</strong> The list above is illustrative, not exhaustive. If a use would be governed by the FCRA were the data sourced from a consumer reporting agency, that use is prohibited here.</Li>
        </Ul>
        <P>
          This prohibition applies regardless of whether the individual being screened is a potential
          program participant, an employee, a volunteer, a contractor, or any other person.
        </P>

        <SectionHeading n={4}>ReentryIQ Is Not a Background-Check Tool</SectionHeading>
        <P>
          The release records available through the Service describe correctional custody history based on
          ADCRR public data. This information is <strong>not</strong> a comprehensive criminal-history
          report, is <strong>not</strong> verified for accuracy at the individual level, and was
          <strong> not</strong> compiled for screening purposes. It must not be treated as a background
          check, a criminal-history report, or a substitute for a report provided by a licensed consumer
          reporting agency.
        </P>
        <P>
          Using Service data as a proxy background check — even informally, even partially — is a violation
          of these Terms and of the FCRA, and exposes your organization to significant legal risk.
        </P>

        <SectionHeading n={5}>Your Legal Exposure for Violations</SectionHeading>
        <P>
          If you use ReentryIQ data for a prohibited screening purpose, you may be liable under the FCRA
          regardless of whether Manage AI is also held liable. The FCRA creates private rights of action:
          individuals who are adversely affected by FCRA violations may sue for:
        </P>
        <Ul>
          <Li>Actual damages sustained as a result of the violation;</Li>
          <Li>Statutory damages of not less than $100 and not more than $1,000 per violation, if the violation is willful;</Li>
          <Li>Punitive damages in cases of willful noncompliance;</Li>
          <Li>Attorneys&apos; fees and court costs.</Li>
        </Ul>
        <P>
          Federal regulators, including the Consumer Financial Protection Bureau (CFPB) and the Federal
          Trade Commission (FTC), are also authorized to enforce the FCRA and may impose civil money
          penalties for violations.
        </P>
        <P>
          Manage AI takes no responsibility for FCRA liability arising from your use of the Service for
          prohibited purposes. Your indemnification obligations under the Terms of Service extend to all
          claims arising from your FCRA violations.
        </P>

        <SectionHeading n={6}>Consequences Under Our Terms of Service</SectionHeading>
        <P>
          Use of the Service for any FCRA-covered screening purpose is a zero-tolerance violation of the{' '}
          <a href="/terms" style={{ color: 'var(--po-blue)' }}>Terms of Service</a> and the{' '}
          <a href="/acceptable-use" style={{ color: 'var(--po-blue)' }}>Acceptable Use Policy</a>. Upon
          discovery of such use — regardless of how that discovery occurs — Manage AI will:
        </P>
        <Ul>
          <Li>Immediately and permanently terminate the offending account and all accounts associated with the same organization, without notice, without refund, and without the right to reinstatement.</Li>
          <Li>Preserve all usage logs and account records related to the violation for potential use in legal proceedings.</Li>
          <Li>Report the violation to appropriate regulatory authorities at our discretion.</Li>
          <Li>Pursue all available legal remedies against the violating organization and responsible individuals, including indemnification claims as provided in the Terms of Service.</Li>
        </Ul>

        <SectionHeading n={7}>What to Do Instead</SectionHeading>
        <P>
          If your organization has legitimate screening needs — for example, if you are required by law,
          grant conditions, or organizational policy to conduct background checks on program participants,
          employees, or volunteers — you must use a consumer reporting agency that is licensed and compliant
          with the FCRA.
        </P>
        <P>
          Licensed CRAs are required to: obtain proper authorization from the individual being screened;
          provide required disclosures; follow adverse-action procedures if a screening decision negatively
          impacts the individual; and maintain data accuracy and dispute-resolution processes. These
          protections exist to safeguard individuals&apos; rights and your organization&apos;s legal
          compliance.
        </P>
        <P>
          ReentryIQ cannot be and should not be used as a substitute for these processes. If you are
          unsure whether a specific use of Service data is permissible under the FCRA, consult qualified
          legal counsel before proceeding.
        </P>

        <SectionHeading n={8}>Questions & Contact</SectionHeading>
        <P>
          If you have questions about this FCRA Notice, are uncertain whether a contemplated use is
          permitted, or wish to report suspected misuse, please contact us at:{' '}
          <a href="mailto:brian@manageai.io" style={{ color: 'var(--po-blue)' }}>brian@manageai.io</a>
        </P>
        <P>
          Manage AI LLC<br />
          Arizona, USA
        </P>

        <ReviewNote />
      </main>
      <SiteFooter />
    </div>
  )
}
