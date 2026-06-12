import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { Icon } from '@/components/ui/Icon'

export const metadata = {
  title: 'Help Center — ReentryIQ',
  description: 'Answers to common questions about ReentryIQ — data freshness, alerts, CRM connectors, billing, and more.',
}

const SECTIONS = [
  {
    group: 'Getting started',
    icon: 'compass' as const,
    faqs: [
      {
        q: 'What is ReentryIQ and who is it for?',
        a: 'ReentryIQ is a release intelligence platform for Arizona reentry and recovery programs — treatment centers, sober livings, transitional housing operators, and community supervision programs. It surfaces upcoming releases from public ADCRR data so your team can reach people before they walk out the gate. It is built for outreach and admissions professionals, not for screening or law enforcement.',
      },
      {
        q: 'How do I get access?',
        a: 'Create a free account at reentryiq.com. The Free plan gives you one-county access and a summary view with 25 record views per month. You can upgrade to Pro (statewide search, alerts, and CRM push) from your account dashboard at any time. For Enterprise or nonprofit pricing, email brian@manageai.io.',
      },
      {
        q: 'What counties does ReentryIQ cover?',
        a: 'ReentryIQ covers all 10 Arizona counties as reflected in ADCRR public release data: Maricopa, Pima, Pinal, Yavapai, Mohave, Yuma, Cochise, Navajo, Apache, and La Paz. Free accounts are limited to one county; Pro accounts have statewide access.',
      },
    ],
  },
  {
    group: 'Data',
    icon: 'fileText' as const,
    faqs: [
      {
        q: 'How fresh is the data?',
        a: 'Our pipeline fetches updated ADCRR public records once per day, typically completing by 6:00 AM MST. Alerts triggered by saved searches are dispatched after each daily refresh. Data you see in ReentryIQ reflects the state of ADCRR\'s public datasearch at the time of the most recent refresh — not necessarily real-time.',
      },
      {
        q: 'Why did a release date change?',
        a: 'Release dates in ADCRR records are projected dates — and they change for many reasons: disciplinary action, sentence modification, medical holds, program placement, or administrative adjustments. We display dates exactly as ADCRR publishes them and never modify source records. If a release date in your dashboard changed, it reflects an update in the ADCRR source data. Always confirm release details directly with the facility or supervising office before making firm commitments based on a specific date.',
      },
      {
        q: 'Where does the data come from? Is it scraped from private systems?',
        a: 'No. Every record in ReentryIQ comes from the ADCRR public inmate datasearch — the same resource available to any member of the public. We do not access restricted systems, law enforcement databases, court management systems, or commercial data brokers. We aggregate and structure public ADCRR data; we don\'t supplement it with anything else.',
      },
      {
        q: 'Can I use ReentryIQ to screen job applicants or tenants?',
        a: 'No. ReentryIQ is not a consumer reporting agency and its data may never be used for FCRA-covered purposes — including employment screening, tenant screening, credit decisions, or insurance underwriting. Every account attests to permitted use at signup. Misuse will result in immediate account termination. See our Compliance page for full detail.',
      },
    ],
  },
  {
    group: 'Alerts & connectors',
    icon: 'bell' as const,
    faqs: [
      {
        q: 'How do saved-search alerts work?',
        a: 'You build a search in ReentryIQ — filtering by county, facility, offense class, custody level, release date range, or any combination — and save it. Once saved, ReentryIQ evaluates that search against the updated dataset after every daily refresh. When a new record matches your criteria, you\'ll get an email alert with a summary of the matches. Pro accounts can also push matching records directly to a connected CRM.',
      },
      {
        q: 'How does the Salesforce / KIPU / Sunwave push work?',
        a: 'Once you connect your CRM in the Integrations tab, new records matching your saved searches are pushed as leads or contacts directly into your CRM after each daily refresh — no manual export required. For Salesforce, we create a lead record with the available ADCRR fields mapped to your configured field set. KIPU and Sunwave connections use their respective API endpoints. Webhook is available for any other system. Field mapping and push behavior can be configured per saved search.',
      },
      {
        q: 'Can I get alerts for multiple counties or facility types at once?',
        a: 'Yes. A single saved search can span multiple counties, facilities, offense classes, or any combination of filters. You can also create multiple saved searches — for example, one alert for Maricopa County releases and a separate alert for specific facility types statewide — each with its own CRM mapping and alert routing.',
      },
    ],
  },
  {
    group: 'Billing',
    icon: 'gauge' as const,
    faqs: [
      {
        q: 'How do record views meter?',
        a: 'A record view is counted when you open the detail view for an individual release record. Search results pages, summary counts, and the release horizon chart do not consume record views. Free accounts receive 25 record views per month; Pro accounts receive 2,500. Enterprise accounts have unlimited record views. Your usage and remaining views are shown in your account dashboard. Views reset on the first of each calendar month.',
      },
      {
        q: 'Do you offer nonprofit or grant-funded rates?',
        a: 'Yes. Nonprofit and grant-funded pricing is available on Pro and Enterprise plans. Email brian@manageai.io with your organization\'s nonprofit status or grant documentation and we\'ll work out pricing that fits your budget. We believe tools like ReentryIQ should be accessible to the organizations doing the hardest work, regardless of funding source.',
      },
    ],
  },
]

export default function HelpPage() {
  return (
    <div style={{ background: 'var(--po-bg)', minHeight: '100vh' }}>
      <SiteNav />
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '56px 32px 72px' }}>

        {/* Eyebrow + Hero */}
        <div style={{ marginBottom: 36 }}>
          <div
            style={{
              display: 'inline-block', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--po-blue)', background: 'var(--po-copper-wash)',
              border: '1px solid var(--po-copper-line)', padding: '5px 12px', borderRadius: 999, marginBottom: 18,
            }}
          >
            Help Center
          </div>
          <h1 className="po-display" style={{ fontSize: 40, lineHeight: 1.1, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 14px', letterSpacing: '-0.02em' }}>
            Frequently asked questions
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: 'var(--po-text-2)', margin: 0 }}>
            Common questions about ReentryIQ — data freshness, alerts, connectors, and billing.
            Can&apos;t find what you need? Email <a href="mailto:brian@manageai.io" style={{ color: 'var(--po-blue)', textDecoration: 'none' }}>brian@manageai.io</a>.
          </p>
        </div>

        {/* AI assistant banner */}
        <div
          style={{
            background: 'var(--po-blue-100)', border: '1px solid var(--po-copper-line)',
            borderRadius: 'var(--po-r)', padding: '18px 22px', marginBottom: 44,
            display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap',
          }}
        >
          <Icon name="sparkles" size={20} stroke="var(--po-blue)" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--po-text)', margin: '0 0 3px' }}>
              Have a question about a specific record or dataset?
            </p>
            <p style={{ fontSize: 13.5, color: 'var(--po-text-2)', margin: 0 }}>
              Enterprise accounts can ask the AI data assistant directly — it can query release data, explain
              field values, and summarize trends by county or facility.
            </p>
          </div>
          <a
            href="/agent"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 13.5, fontWeight: 600, color: 'var(--po-blue)',
              textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            Open AI assistant <Icon name="arrowRight" size={14} stroke="var(--po-blue)" />
          </a>
        </div>

        {/* FAQ sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 44 }}>
          {SECTIONS.map(section => (
            <div key={section.group}>
              {/* Section header */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20 }}>
                <div
                  style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: 'var(--po-copper-wash)', border: '1px solid var(--po-copper-line)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Icon name={section.icon} size={16} stroke="var(--po-blue)" />
                </div>
                <h2 className="po-display" style={{ fontSize: 18, fontWeight: 700, color: 'var(--po-text)', margin: 0, letterSpacing: '-0.01em' }}>
                  {section.group}
                </h2>
              </div>

              {/* Q&A cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {section.faqs.map(faq => (
                  <div
                    key={faq.q}
                    style={{
                      background: 'var(--po-panel)', border: '1px solid var(--po-line)',
                      borderRadius: 'var(--po-r)', padding: '20px 22px',
                    }}
                  >
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 10px', lineHeight: 1.4 }}>
                      {faq.q}
                    </h3>
                    <p style={{ fontSize: 14.5, lineHeight: 1.7, color: 'var(--po-text-2)', margin: 0 }}>
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div
          style={{
            marginTop: 52, background: 'var(--po-panel)', border: '1px solid var(--po-line)',
            borderRadius: 'var(--po-r)', padding: '24px 26px',
            display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap',
          }}
        >
          <Icon name="helpCircle" size={22} stroke="var(--po-blue)" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--po-text)', margin: '0 0 4px' }}>Still have questions?</p>
            <p style={{ fontSize: 14, color: 'var(--po-text-2)', margin: 0 }}>
              Email <a href="mailto:brian@manageai.io" style={{ color: 'var(--po-blue)', textDecoration: 'none' }}>brian@manageai.io</a>.
              We respond personally within one business day.
            </p>
          </div>
        </div>

      </main>
      <SiteFooter />
    </div>
  )
}
