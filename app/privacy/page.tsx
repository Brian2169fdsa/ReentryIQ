import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'

export const metadata = {
  title: 'Privacy Policy — ReentryIQ',
  description: 'How Manage AI collects, uses, and protects information on the ReentryIQ platform.',
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

export default function PrivacyPage() {
  return (
    <div style={{ background: 'var(--po-bg)', minHeight: '100vh' }}>
      <SiteNav />
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '56px 32px 72px' }}>
        <PageHeader title="Privacy Policy" />

        <SectionHeading n={1}>Who We Are</SectionHeading>
        <P>
          ReentryIQ is operated by Manage AI LLC, an Arizona limited liability company (&ldquo;Manage AI,&rdquo;
          &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). This Privacy Policy explains how we
          collect, use, disclose, and protect information in connection with the ReentryIQ platform and all
          related services (collectively, the &ldquo;Service&rdquo;). Questions may be directed to{' '}
          <a href="mailto:brian@manageai.io" style={{ color: 'var(--po-blue)' }}>brian@manageai.io</a>.
        </P>
        <P>
          This Policy applies to all visitors, account holders, and organizational users of the Service. By
          using the Service, you agree to the practices described in this Policy. If you do not agree, please
          discontinue use and do not create an account.
        </P>

        <SectionHeading n={2}>Information We Collect</SectionHeading>
        <P>
          <strong>Account &amp; registration data.</strong> When you register for an account, we collect your
          full name, organizational name, organizational email address, job title, and, where applicable,
          organizational tax-exempt or nonprofit status. We also retain a record of your completed
          permitted-use attestation, including the timestamp and the affirmations you made at signup.
        </P>
        <P>
          <strong>Usage data.</strong> We automatically collect data about how you interact with the Service,
          including: search queries submitted, individual records viewed or exported, alert configurations
          created, CRM integration events, pages visited within the platform, timestamps of all actions,
          browser type and version, operating system, IP address, referring URL, and session identifiers. This
          data is used for security, abuse prevention, billing (metered record-view counting), and platform
          improvement.
        </P>
        <P>
          <strong>Payment data.</strong> Billing and payment processing are handled by our third-party payment
          processor. We do not store full payment-card numbers or bank-account credentials on our servers.
          We receive and retain non-sensitive payment metadata such as the last four digits of a card, card
          brand, billing address, transaction identifiers, and subscription status. Our payment processor&apos;s
          own privacy policy governs the handling of your full payment data.
        </P>
        <P>
          <strong>Communications.</strong> If you contact us by email or through a support channel, we retain
          a record of that correspondence, including your email address and the content of your message.
        </P>

        <SectionHeading n={3}>Public Release Records — How We Handle Them</SectionHeading>
        <P>
          The core data surfaced by ReentryIQ consists of release records published by the Arizona Department
          of Corrections, Rehabilitation &amp; Reentry (&ldquo;ADCRR&rdquo;). These are public records about
          third parties — individuals who are or have been in ADCRR custody. Manage AI does not create these
          records; we retrieve, normalize, index, and present them to authorized users.
        </P>
        <P>
          <strong>Data sourcing and currency.</strong> Records are sourced from publicly available ADCRR data
          feeds. Release dates, custody status, and related fields are subject to change by ADCRR at any time.
          We make reasonable efforts to refresh data on a regular schedule, but there may be latency between
          ADCRR updates and what appears in the Service. We make no warranty as to the accuracy, completeness,
          or currency of any individual record.
        </P>
        <P>
          <strong>Retention of public records.</strong> We retain indexed public-record data for as long as
          it is operationally relevant to our authorized user base — generally while the individual&apos;s
          record remains in ADCRR&apos;s publicly available dataset and for a reasonable period thereafter
          to support alert and CRM-history functionality.
        </P>
        <P>
          <strong>Correction and takedown requests.</strong> We recognize that individuals whose records appear
          in the Service have an interest in accuracy. If you are an individual whose information appears in
          the Service and you believe a record is inaccurate, or if you wish to request removal of your
          information from our platform (to the extent it is not required to be publicly accessible), please
          contact us at{' '}
          <a href="mailto:brian@manageai.io" style={{ color: 'var(--po-blue)' }}>brian@manageai.io</a>. We
          will review all such requests in good faith and respond within 30 days. Where correction or removal
          is technically feasible and consistent with our legal obligations, we will honor the request.
        </P>

        <SectionHeading n={4}>How We Use Information</SectionHeading>
        <P>We use the information we collect for the following purposes:</P>
        <Ul>
          <Li>Providing, operating, and improving the Service, including search functionality, alerting, and CRM integrations.</Li>
          <Li>Creating and managing your account, verifying eligibility, and maintaining your permitted-use attestation record.</Li>
          <Li>Processing payments, tracking subscription status, and calculating metered record-view usage and overage.</Li>
          <Li>Communicating with you about your account, subscription, product updates, security notices, and policy changes.</Li>
          <Li>Monitoring for and preventing fraud, abuse, Terms of Service violations, and FCRA misuse.</Li>
          <Li>Conducting internal analytics and research to understand Service usage patterns and improve our product.</Li>
          <Li>Complying with legal obligations, responding to lawful government requests, and enforcing our Terms of Service.</Li>
          <Li>Defending Manage AI in legal proceedings where your account activity is at issue.</Li>
        </Ul>

        <SectionHeading n={5}>How We Share Information</SectionHeading>
        <P>
          We do not sell your personal information to third parties. We share information only in the following
          circumstances:
        </P>
        <P>
          <strong>Subprocessors.</strong> We share data with the following categories of subprocessors who
          assist us in operating the Service:
        </P>
        <Ul>
          <Li><strong>Vercel, Inc.</strong> — cloud hosting and edge delivery infrastructure. Vercel processes platform traffic and stores deployed application code.</Li>
          <Li><strong>Supabase, Inc.</strong> — database hosting and authentication. Account data, usage logs, and public-record data are stored in Supabase-managed databases.</Li>
          <Li><strong>Anthropic, PBC</strong> — AI assistant functionality. If you use the AI assistant feature, queries may be transmitted to Anthropic&apos;s API for processing. Anthropic&apos;s usage policies and data-handling practices apply to data processed through their API.</Li>
          <Li><strong>Payment processor</strong> — billing, invoicing, and payment-card handling. The identity of our current payment processor is disclosed at checkout.</Li>
        </Ul>
        <P>
          All subprocessors are contractually required to process data only as instructed by Manage AI and to
          maintain appropriate security standards. We will update this list when we add or change subprocessors
          and will provide advance notice for material changes.
        </P>
        <P>
          <strong>Legal and safety disclosures.</strong> We may disclose information to law enforcement, government
          authorities, or other third parties if we reasonably believe disclosure is necessary to: (a) comply
          with a valid legal process, court order, or government request; (b) protect the safety of any person;
          (c) prevent or investigate fraud, abuse, or violations of our Terms; or (d) protect the rights or
          property of Manage AI.
        </P>
        <P>
          <strong>Business transfers.</strong> If Manage AI is involved in a merger, acquisition, asset sale,
          or similar transaction, your information may be transferred to the successor entity. We will provide
          notice of such a transfer and the successor&apos;s privacy practices before data is transferred.
        </P>

        <SectionHeading n={6}>Cookies & Authentication Sessions</SectionHeading>
        <P>
          The Service uses cookies and similar technologies for authentication session management, security
          (CSRF protection), and user-preference persistence. We do not use third-party advertising cookies
          or behavioral tracking cookies. The cookies we set are strictly necessary for the Service to function
          securely.
        </P>
        <P>
          Authentication sessions are managed through Supabase Auth and expire after a period of inactivity.
          You may clear cookies through your browser settings, but doing so will log you out of the Service.
          We do not use third-party analytics cookies; usage analytics are derived from server-side logs.
        </P>

        <SectionHeading n={7}>Security</SectionHeading>
        <P>
          We implement administrative, technical, and physical security measures designed to protect your
          information against unauthorized access, disclosure, alteration, and destruction. These measures
          include encrypted data transmission (TLS), encryption at rest for sensitive data fields, access
          controls limiting data access to authorized personnel, and security monitoring.
        </P>
        <P>
          No security system is impenetrable. We cannot guarantee the absolute security of information
          transmitted to or stored on our systems. In the event of a data breach affecting your information,
          we will notify you as required by applicable law.
        </P>

        <SectionHeading n={8}>Retention</SectionHeading>
        <P>
          We retain account and usage data for as long as your account is active and for a reasonable period
          thereafter to: fulfill our legal and contractual obligations, resolve disputes, enforce our Terms,
          and maintain audit records of permitted-use attestations. Specifically:
        </P>
        <Ul>
          <Li>Account registration data and attestation records: retained for the life of the account and for at least 3 years after account closure.</Li>
          <Li>Usage logs (search queries, record views): retained for 12 months on a rolling basis for billing, security, and abuse-prevention purposes.</Li>
          <Li>Payment transaction records: retained for 7 years as required by applicable financial recordkeeping obligations.</Li>
          <Li>Support correspondence: retained for 2 years after the last communication.</Li>
        </Ul>
        <P>
          Following the applicable retention period, we delete or anonymize data in the ordinary course of our
          data-lifecycle processes.
        </P>

        <SectionHeading n={9}>Your Rights & Choices</SectionHeading>
        <P>
          Depending on your jurisdiction, you may have certain rights with respect to your personal information.
          Regardless of jurisdiction, Manage AI honors the following requests:
        </P>
        <Ul>
          <Li><strong>Access:</strong> You may request a copy of the personal information we hold about you by contacting brian@manageai.io.</Li>
          <Li><strong>Correction:</strong> You may request that we correct inaccurate information associated with your account.</Li>
          <Li><strong>Deletion:</strong> You may request deletion of your account and associated personal information. Note that we may retain certain information as required by law or for legitimate business purposes such as fraud prevention and legal compliance.</Li>
          <Li><strong>Portability:</strong> You may request an export of your account data in a commonly used, machine-readable format.</Li>
        </Ul>
        <P>
          To exercise any of these rights, contact us at{' '}
          <a href="mailto:brian@manageai.io" style={{ color: 'var(--po-blue)' }}>brian@manageai.io</a>. We
          will respond within 30 days. We may need to verify your identity before processing a request.
        </P>

        <SectionHeading n={10}>Children</SectionHeading>
        <P>
          The Service is not directed to individuals under the age of 18, and we do not knowingly collect
          personal information from children. If we become aware that a person under 18 has provided us with
          personal information, we will delete that information promptly. If you believe a child has submitted
          information to us, please contact us at{' '}
          <a href="mailto:brian@manageai.io" style={{ color: 'var(--po-blue)' }}>brian@manageai.io</a>.
        </P>

        <SectionHeading n={11}>Changes to This Policy</SectionHeading>
        <P>
          We may update this Privacy Policy from time to time. When we make material changes, we will notify
          you by email to the address associated with your account and/or by posting a prominent notice in
          the Service at least 14 days before the changes take effect. The &ldquo;Last updated&rdquo; date at
          the top of this page reflects when the Policy was most recently revised.
        </P>
        <P>
          Your continued use of the Service after the effective date of any changes constitutes your acceptance
          of the revised Policy. If you do not agree to the revised Policy, you must stop using the Service.
        </P>

        <SectionHeading n={12}>Contact</SectionHeading>
        <P>
          For privacy-related questions, data-subject requests, or concerns about this Policy, please contact:
        </P>
        <P>
          Manage AI LLC<br />
          Arizona, USA<br />
          <a href="mailto:brian@manageai.io" style={{ color: 'var(--po-blue)' }}>brian@manageai.io</a>
        </P>

        <ReviewNote />
      </main>
      <SiteFooter />
    </div>
  )
}
