import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'

export const metadata = {
  title: 'Acceptable Use Policy — ReentryIQ',
  description: 'What you may and may not do with ReentryIQ data and services.',
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

function ProhibitedBanner({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        margin: '20px 0 24px',
        padding: '20px 24px',
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

export default function AcceptableUsePage() {
  return (
    <div style={{ background: 'var(--po-bg)', minHeight: '100vh' }}>
      <SiteNav />
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '56px 32px 72px' }}>
        <PageHeader title="Acceptable Use Policy" />

        <SectionHeading n={1}>Purpose & Scope</SectionHeading>
        <P>
          This Acceptable Use Policy (&ldquo;AUP&rdquo;) governs the ways in which you and your organization
          may use the ReentryIQ platform and the data accessible through it. It supplements the{' '}
          <a href="/terms" style={{ color: 'var(--po-blue)' }}>Terms of Service</a> and is incorporated into
          those Terms by reference. Defined terms used here have the same meaning as in the Terms of Service.
        </P>
        <P>
          Because ReentryIQ surfaces records about real individuals — people who are navigating reentry from
          incarceration — this AUP exists to ensure those individuals are protected from misuse of their
          information while enabling legitimate mission-driven organizations to serve them effectively.
        </P>

        <SectionHeading n={2}>Permitted Uses</SectionHeading>
        <P>
          The following uses are expressly permitted, provided you are a qualified reentry or recovery
          organization with an active, valid account and a completed permitted-use attestation:
        </P>
        <Ul>
          <Li>
            <strong>Service outreach.</strong> Identifying and reaching out to individuals who are approaching
            release or have recently been released and who may benefit from your organization&apos;s specific
            programs — such as housing, substance-use treatment, workforce training, legal services, or
            community support.
          </Li>
          <Li>
            <strong>Admissions planning.</strong> Using projected release dates and demographic data in
            aggregate to anticipate incoming service demand and prepare intake capacity accordingly.
          </Li>
          <Li>
            <strong>Capacity planning.</strong> Analyzing release-volume trends at the regional or facility
            level to inform staffing, resource allocation, and program-expansion decisions.
          </Li>
          <Li>
            <strong>Grant reporting (aggregate only).</strong> Using aggregate counts and trends — for
            example, the number of individuals in a geographic area approaching release within a program
            cycle — to support grant applications, funder reports, and outcome narratives. Individual-level
            records must not be disclosed in grant documents or shared with funders.
          </Li>
          <Li>
            <strong>CRM record creation and enrichment.</strong> Importing relevant record fields into your
            own internal case-management or CRM system for use in permitted outreach and service delivery,
            subject to your organization&apos;s own data governance policies and applicable law.
          </Li>
          <Li>
            <strong>Internal research and program evaluation.</strong> Using Service data internally to
            evaluate program effectiveness, identify service gaps, and improve service delivery — provided
            that any published results are de-identified and aggregated.
          </Li>
        </Ul>

        <SectionHeading n={3}>Prohibited Uses — Read Carefully</SectionHeading>
        <P>
          The following uses are strictly prohibited. Violation of any prohibition in this section
          constitutes a material breach of the Terms of Service and grounds for immediate account
          termination, and may expose you to civil or criminal liability under applicable law.
        </P>
        <ProhibitedBanner>
          <p
            className="po-label"
            style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--po-blue)', margin: '0 0 12px',
            }}
          >
            Strictly Prohibited — Zero Tolerance
          </p>
          <ul style={{ fontSize: 14.5, lineHeight: 1.7, color: 'var(--po-text-2)', margin: 0, paddingLeft: 20 }}>
            <li style={{ marginBottom: 10 }}>
              <strong>FCRA-covered screening of any kind.</strong> You may not use any data obtained through
              the Service — in whole or in part, alone or in combination with other information — to make or
              inform decisions about a person&apos;s eligibility for employment, housing or tenancy, credit,
              insurance, or any other purpose that constitutes a &ldquo;consumer report&rdquo; under the Fair
              Credit Reporting Act (15 U.S.C. § 1681 et seq.). See our{' '}
              <a href="/fcra-notice" style={{ color: 'var(--po-blue)' }}>FCRA Notice</a> for a full
              explanation. This prohibition is absolute and admits no exceptions.
            </li>
            <li style={{ marginBottom: 10 }}>
              <strong>Harassment, intimidation, or unrelated contact.</strong> You may not use Service data
              to contact, surveil, harass, intimidate, or threaten any individual, or to facilitate contact
              by others for any purpose unrelated to bona fide reentry or recovery services.
            </li>
            <li style={{ marginBottom: 10 }}>
              <strong>Doxxing or republication of records.</strong> You may not post, publish, broadcast,
              or otherwise publicly disclose individual-level records obtained through the Service, including
              on social media, websites, databases accessible to the public, or any other public-facing medium.
            </li>
            <li style={{ marginBottom: 10 }}>
              <strong>Automated bulk scraping or data resale.</strong> You may not use automated scripts,
              bots, crawlers, or any other automated means to bulk-extract data from the Service beyond what
              is reasonably necessary for permitted use. You may not resell, sublicense, redistribute, or
              otherwise commercialize Service data.
            </li>
            <li style={{ marginBottom: 10 }}>
              <strong>Discriminatory targeting.</strong> You may not use Service data to target individuals
              for adverse treatment on the basis of race, color, national origin, religion, sex, disability,
              age, or any other characteristic protected under applicable federal, state, or local law.
            </li>
            <li style={{ marginBottom: 10 }}>
              <strong>Law-enforcement referrals without basis.</strong> You may not use Service data to
              report individuals to law enforcement, immigration authorities, or parole or probation officers
              for any purpose other than an imminent threat of harm — and you must consult legal counsel before
              doing so.
            </li>
            <li style={{ marginBottom: 0 }}>
              <strong>Any unlawful purpose.</strong> You may not use the Service for any purpose that violates
              federal, state, or local law, or that facilitates illegal conduct by others.
            </li>
          </ul>
        </ProhibitedBanner>

        <SectionHeading n={4}>Account & Credential Security</SectionHeading>
        <P>
          You are responsible for all actions taken under your account credentials. You may not share login
          credentials with individuals outside your organization, or with contractors, volunteers, or
          third-party vendors without first obtaining written approval from Manage AI. Accounts are issued to
          specific organizations; transferring account access to a different organization is prohibited.
        </P>
        <P>
          If you suspect that your account credentials have been compromised or are being used in violation of
          this AUP, you must notify us immediately at{' '}
          <a href="mailto:brian@manageai.io" style={{ color: 'var(--po-blue)' }}>brian@manageai.io</a>.
        </P>

        <SectionHeading n={5}>Data Handling Obligations</SectionHeading>
        <P>
          Data accessed through the Service must be handled in accordance with the following minimum standards:
        </P>
        <Ul>
          <Li>Individual-level data may only be accessed by staff members who have a legitimate program need and who have been informed of the restrictions in this AUP.</Li>
          <Li>Data must not be stored in systems accessible to the general public or to individuals outside your organization without appropriate access controls.</Li>
          <Li>If you integrate Service data into a CRM or case-management system, that system must be subject to reasonable security safeguards and access controls.</Li>
          <Li>If you discover that Service data in your possession has been accessed by an unauthorized person or used for a prohibited purpose, you must notify us within 48 hours at brian@manageai.io.</Li>
        </Ul>

        <SectionHeading n={6}>Enforcement & Audit Rights</SectionHeading>
        <P>
          Manage AI reserves the right to monitor usage of the Service for compliance with this AUP and the
          Terms of Service. This includes reviewing usage logs, search patterns, export volumes, and
          integration activity. We may, at our discretion and without prior notice, suspend or terminate
          access to any account that we have reasonable grounds to believe is in violation of this AUP.
        </P>
        <P>
          In cases of suspected FCRA misuse or other serious violations, we reserve the right to preserve and
          produce usage records in response to valid legal process, and to proactively report suspected
          violations to appropriate regulatory authorities.
        </P>
        <P>
          If we contact you with concerns about potential AUP violations, you agree to cooperate promptly and
          in good faith, including providing documentation of your data-handling practices upon reasonable
          request.
        </P>

        <SectionHeading n={7}>Reporting Misuse</SectionHeading>
        <P>
          If you become aware of misuse of ReentryIQ data — whether by another user, a third party who
          obtained data from a user, or anyone else — we encourage you to report it to us at{' '}
          <a href="mailto:brian@manageai.io" style={{ color: 'var(--po-blue)' }}>brian@manageai.io</a>.
          Please include as much detail as possible about the nature of the suspected misuse, how you became
          aware of it, and any identifying information about the parties involved.
        </P>
        <P>
          Reports submitted in good faith will not result in adverse action against the reporting party.
          Manage AI takes all misuse reports seriously and will investigate promptly.
        </P>

        <SectionHeading n={8}>Changes to This Policy</SectionHeading>
        <P>
          We may update this AUP from time to time. Material changes will be communicated by email and/or
          through a Service notice at least 14 days before the changes take effect. Continued use of the
          Service after the effective date of any revised AUP constitutes acceptance of the changes.
        </P>

        <ReviewNote />
      </main>
      <SiteFooter />
    </div>
  )
}
