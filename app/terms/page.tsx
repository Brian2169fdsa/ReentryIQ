import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'

export const metadata = {
  title: 'Terms of Service — ReentryIQ',
  description: 'Terms governing access to and use of the ReentryIQ platform operated by Manage AI.',
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

export default function TermsPage() {
  return (
    <div style={{ background: 'var(--po-bg)', minHeight: '100vh' }}>
      <SiteNav />
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '56px 32px 72px' }}>
        <PageHeader title="Terms of Service" />

        <SectionHeading n={1}>Acceptance of Terms</SectionHeading>
        <P>
          By creating an account, clicking &ldquo;I agree,&rdquo; or otherwise accessing or using the ReentryIQ platform (the &ldquo;Service&rdquo;), you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;) and all policies incorporated by reference, including the{' '}
          <a href="/privacy" style={{ color: 'var(--po-blue)' }}>Privacy Policy</a>,{' '}
          <a href="/acceptable-use" style={{ color: 'var(--po-blue)' }}>Acceptable Use Policy</a>, and{' '}
          <a href="/fcra-notice" style={{ color: 'var(--po-blue)' }}>FCRA Notice</a>. If you do not agree, you must not access or use the Service.
        </P>
        <P>
          These Terms constitute a legally binding agreement between you (and, if applicable, the organization you represent) and Manage AI LLC (&ldquo;Manage AI,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), an Arizona limited liability company operating the ReentryIQ platform. If you are accepting on behalf of an organization, you represent that you have the authority to bind that organization to these Terms, in which case &ldquo;you&rdquo; refers to the organization.
        </P>

        <SectionHeading n={2}>Eligibility</SectionHeading>
        <P>
          Access to the Service is restricted to organizations that directly serve reentry and/or recovery populations — including but not limited to reentry nonprofits, recovery residences, treatment programs, workforce development organizations, faith-based reentry ministries, and social services agencies. Individual consumers may not create accounts.
        </P>
        <P>
          You must be at least 18 years of age and have full legal authority to enter into these Terms on behalf of your organization. By registering, you represent and warrant that (a) your organization qualifies under the above description, (b) you are 18 or older, and (c) you are duly authorized to bind your organization.
        </P>
        <P>
          Manage AI reserves the right to verify eligibility at any time and to deny or revoke access to any organization or individual that does not meet these criteria or cannot satisfactorily demonstrate compliance upon request.
        </P>

        <SectionHeading n={3}>Account Registration & Permitted-Use Attestation</SectionHeading>
        <P>
          When you create an account, you must provide accurate, complete, and current registration information, including your name, organization name, and a valid organizational email address. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.
        </P>
        <P>
          As a condition of access, every account holder must complete and affirmatively submit a permitted-use attestation at signup. By completing the attestation, you represent that: (a) your organization is a qualified reentry or recovery service provider; (b) you will access and use release-record data solely for outreach, admissions planning, capacity planning, or aggregate grant reporting as described in the Acceptable Use Policy; and (c) you will not use any data retrieved through the Service for any purpose that constitutes a consumer report under the Fair Credit Reporting Act, including employment screening, tenant screening, credit underwriting, or insurance underwriting.
        </P>
        <P>
          The permitted-use attestation is a material condition of access. Misrepresentation in the attestation, or use of the Service in violation of the attestation, constitutes a material breach of these Terms and grounds for immediate termination of your account.
        </P>

        <SectionHeading n={4}>The Service & Data Disclaimer</SectionHeading>
        <P>
          ReentryIQ provides search, alerting, and CRM-integration services over publicly available release-record data sourced from the Arizona Department of Corrections, Rehabilitation &amp; Reentry (&ldquo;ADCRR&rdquo;). The Service aggregates, normalizes, and presents data that originates in public ADCRR records; Manage AI does not generate, verify, or guarantee the accuracy of the underlying source data.
        </P>
        <P>
          Release dates, custody status, and other record fields are subject to change at ADCRR&apos;s discretion at any time and without notice to Manage AI. Records displayed through the Service reflect data as retrieved from ADCRR sources and may not reflect the most current official records. There may be latency between changes in official records and updates in the Service.
        </P>
        <P>
          THE SERVICE AND ALL DATA ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE.&rdquo; MANAGE AI EXPRESSLY DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. MANAGE AI MAKES NO WARRANTY THAT THE DATA IS ACCURATE, COMPLETE, CURRENT, OR RELIABLE, AND MAKES NO WARRANTY THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE. YOU ASSUME FULL RESPONSIBILITY FOR YOUR RELIANCE ON ANY DATA OBTAINED THROUGH THE SERVICE.
        </P>

        <SectionHeading n={5}>Permitted & Prohibited Uses</SectionHeading>
        <P>
          Your use of the Service is governed by the{' '}
          <a href="/acceptable-use" style={{ color: 'var(--po-blue)' }}>Acceptable Use Policy</a>, which is incorporated herein by reference. Permitted uses include outreach to individuals who may benefit from your organization&apos;s services, internal admissions and capacity planning, and aggregate grant reporting. Prohibited uses include, without limitation, any use that constitutes consumer reporting under the FCRA, harassment, doxxing, bulk data resale, and any unlawful purpose.
        </P>
        <P>
          The Service may not be used for any purpose covered by the Fair Credit Reporting Act (15 U.S.C. § 1681 et seq.). See our{' '}
          <a href="/fcra-notice" style={{ color: 'var(--po-blue)' }}>FCRA Notice</a> for a full explanation of these restrictions and your obligations.
        </P>

        <SectionHeading n={6}>Subscriptions, Metering & Overage</SectionHeading>
        <P>
          The Service is offered on a Free tier and paid subscription tiers (currently &ldquo;Pro&rdquo; and &ldquo;Enterprise&rdquo;). Paid subscriptions are billed monthly or annually as selected at checkout. All fees are stated in U.S. dollars and are exclusive of any applicable taxes, which are your responsibility.
        </P>
        <P>
          Each subscription tier includes a monthly allotment of record views as described on the pricing page. A &ldquo;record view&rdquo; is logged each time a full individual record is retrieved or exported through the Service. Viewing the same record multiple times within a billing period may count as multiple views depending on session context. Your current view count and allotment are displayed in your account dashboard.
        </P>
        <P>
          If you exceed your monthly record-view allotment on a paid plan, overage views will be billed at the then-current per-view rate shown in your account settings, or access to additional views will be suspended until the next billing cycle, at Manage AI&apos;s discretion. We will endeavor to provide notice before overage charges accrue.
        </P>
        <P>
          Subscriptions renew automatically at the end of each billing period. You may cancel at any time through your account settings or by contacting brian@manageai.io; cancellation takes effect at the end of the then-current paid period, and no partial-period refunds are issued except as required by law. Manage AI reserves the right to modify pricing upon at least 30 days&apos; prior written notice.
        </P>

        <SectionHeading n={7}>Intellectual Property</SectionHeading>
        <P>
          The ReentryIQ platform, including its software, design, trademarks, and aggregated data products (including normalizations, categorizations, and alert logic applied to public-record data), are the intellectual property of Manage AI or its licensors and are protected by applicable copyright, trademark, and other laws. You are granted a limited, non-exclusive, non-transferable, revocable license to access and use the Service solely for the permitted purposes described herein and in the Acceptable Use Policy.
        </P>
        <P>
          The underlying ADCRR release records are public records of the State of Arizona. Manage AI does not claim ownership of the raw public-record data. However, the compiled, normalized, and formatted presentations of that data, as well as the Service infrastructure, algorithms, and interfaces, remain the exclusive property of Manage AI.
        </P>
        <P>
          You may not copy, reproduce, modify, distribute, sell, sublicense, reverse-engineer, or create derivative works from any portion of the Service or its data outputs except as expressly permitted in writing by Manage AI.
        </P>

        <SectionHeading n={8}>Termination</SectionHeading>
        <P>
          Either party may terminate these Terms at any time. You may terminate by canceling your account and ceasing all use of the Service. Manage AI may terminate or suspend your account and access to the Service at any time, with or without cause, with or without notice, subject to the following:
        </P>
        <P>
          For termination without cause by Manage AI, we will provide at least 14 days&apos; written notice and will prorate and refund any prepaid subscription fees covering the period after termination. For termination with cause — including but not limited to breach of these Terms, misrepresentation in the permitted-use attestation, violation of the Acceptable Use Policy, any use of the Service for FCRA-covered screening purposes, or conduct that exposes Manage AI to legal liability — termination may be immediate and without refund.
        </P>
        <P>
          Upon termination for any reason, your license to use the Service is immediately revoked. Provisions of these Terms that by their nature should survive termination — including Sections 4, 7, 9, 10, 11, and 12 — will survive.
        </P>

        <SectionHeading n={9}>Limitation of Liability</SectionHeading>
        <P>
          TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, MANAGE AI AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND LICENSORS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, LOSS OF DATA, LOSS OF GOODWILL, BUSINESS INTERRUPTION, OR THE COST OF SUBSTITUTE SERVICES, ARISING OUT OF OR IN CONNECTION WITH THESE TERMS OR THE SERVICE, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY, OR ANY OTHER LEGAL THEORY, EVEN IF MANAGE AI HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
        </P>
        <P>
          IN NO EVENT WILL MANAGE AI&apos;S TOTAL CUMULATIVE LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATED TO THESE TERMS OR THE SERVICE EXCEED THE GREATER OF (A) THE TOTAL FEES PAID BY YOU TO MANAGE AI IN THE TWELVE MONTHS PRECEDING THE CLAIM OR (B) ONE HUNDRED U.S. DOLLARS ($100.00).
        </P>
        <P>
          Some jurisdictions do not allow the exclusion or limitation of certain damages; in such jurisdictions the foregoing limitations apply to the fullest extent permitted by law.
        </P>

        <SectionHeading n={10}>Indemnification</SectionHeading>
        <P>
          You agree to indemnify, defend, and hold harmless Manage AI and its officers, directors, employees, agents, successors, and assigns from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys&apos; fees) arising out of or related to: (a) your access to or use of the Service; (b) your violation of these Terms or any incorporated policy; (c) your violation of any applicable law or regulation, including the FCRA; (d) your misrepresentation in the permitted-use attestation; or (e) any third-party claim arising from your use of data obtained through the Service.
        </P>
        <P>
          Manage AI reserves the right, at its own expense, to assume the exclusive defense and control of any matter subject to indemnification by you, in which case you agree to cooperate with Manage AI&apos;s defense of such claim.
        </P>

        <SectionHeading n={11}>Governing Law & Dispute Resolution</SectionHeading>
        <P>
          These Terms are governed by and construed in accordance with the laws of the State of Arizona, without regard to its conflict-of-law principles. You agree to submit to the exclusive personal jurisdiction of the state and federal courts located in Maricopa County, Arizona for any dispute arising out of or relating to these Terms or the Service.
        </P>
        <P>
          Before initiating formal proceedings, each party agrees to attempt to resolve any dispute informally by providing written notice describing the dispute and desired resolution. If the dispute is not resolved within 30 days, either party may pursue formal legal proceedings as described above.
        </P>

        <SectionHeading n={12}>Changes to These Terms</SectionHeading>
        <P>
          Manage AI reserves the right to modify these Terms at any time. We will provide notice of material changes by email to the address on file with your account and/or by posting a prominent notice on the Service at least 14 days before the changes take effect. Your continued use of the Service after the effective date of revised Terms constitutes your acceptance of the changes. If you do not agree to the revised Terms, you must stop using the Service and cancel your account before the effective date.
        </P>

        <SectionHeading n={13}>Miscellaneous</SectionHeading>
        <P>
          These Terms, together with the Privacy Policy, Acceptable Use Policy, and FCRA Notice, constitute the entire agreement between you and Manage AI with respect to the Service and supersede all prior agreements, representations, and understandings. If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect. Manage AI&apos;s failure to enforce any right or provision of these Terms will not constitute a waiver of that right or provision. You may not assign your rights or obligations under these Terms without Manage AI&apos;s prior written consent. Manage AI may assign these Terms freely.
        </P>

        <SectionHeading n={14}>Contact</SectionHeading>
        <P>
          Questions about these Terms should be directed to Manage AI at{' '}
          <a href="mailto:brian@manageai.io" style={{ color: 'var(--po-blue)' }}>brian@manageai.io</a>. You may also write to: Manage AI LLC, Arizona, USA.
        </P>

        <ReviewNote />
      </main>
      <SiteFooter />
    </div>
  )
}
