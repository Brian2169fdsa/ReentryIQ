import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { CtaBand } from '@/components/layout/CtaBand'
import { Icon } from '@/components/ui/Icon'

export const metadata = {
  title: 'REST API — ReentryIQ',
  description:
    'Read-only REST API for your scope. Query upcoming releases, summaries, and usage with a Bearer token. Available on Enterprise plans.',
}

const eyebrow: React.CSSProperties = {
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
}

const codeBlock: React.CSSProperties = {
  background: 'var(--po-navy)',
  color: '#E2E8F0',
  borderRadius: 'var(--po-r)',
  padding: 18,
  fontSize: 12.5,
  fontFamily: 'var(--font-ibm-plex-mono, ui-monospace, monospace)',
  overflowX: 'auto',
  margin: 0,
  lineHeight: 1.6,
}

const sectionTitle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 700,
  color: 'var(--po-text)',
  margin: '0 0 8px',
  letterSpacing: '-0.02em',
}

const sectionLede: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.6,
  color: 'var(--po-text-2)',
  margin: '0 0 20px',
}

const card: React.CSSProperties = {
  background: 'var(--po-panel)',
  border: '1px solid var(--po-line)',
  borderRadius: 'var(--po-r)',
  padding: '24px 26px',
}

interface Endpoint {
  method: string
  path: string
  desc: string
  params?: { name: string; note: string }[]
}

const ENDPOINTS: Endpoint[] = [
  {
    method: 'GET',
    path: '/v1/releases',
    desc: 'List upcoming releases within your scope.',
    params: [
      { name: 'county', note: 'filter by county name' },
      { name: 'from_date', note: 'release date lower bound (YYYY-MM-DD)' },
      { name: 'to_date', note: 'release date upper bound (YYYY-MM-DD)' },
      { name: 'facility', note: 'filter by releasing facility' },
      { name: 'min_score', note: 'minimum match score (0–100)' },
      { name: 'limit', note: 'page size, max 200 (default 50)' },
      { name: 'cursor', note: 'opaque pagination cursor' },
    ],
  },
  {
    method: 'GET',
    path: '/v1/releases/:id',
    desc: 'Retrieve a single release record by its ReentryIQ id. Counts as a metered record view on first reveal.',
  },
  {
    method: 'GET',
    path: '/v1/summary/by-county',
    desc: 'Aggregate upcoming-release counts grouped by county. Summary counts never consume record views.',
  },
  {
    method: 'GET',
    path: '/v1/usage',
    desc: 'Current billing period usage — record views consumed, included pool, and overage to date.',
  },
]

const AUTH_SNIPPET = `Authorization: Bearer riq_live_sk_3f9a2c…`

const CURL_SNIPPET = `curl https://api.reentryiq.com/v1/releases \\
  -H "Authorization: Bearer $REENTRYIQ_API_KEY" \\
  -G \\
  --data-urlencode "county=Maricopa" \\
  --data-urlencode "from_date=2026-06-12" \\
  --data-urlencode "to_date=2026-07-12" \\
  --data-urlencode "min_score=70" \\
  --data-urlencode "limit=50"`

const JSON_SNIPPET = `{
  "data": [
    {
      "id": "rel_8Xk2pQ",
      "name": "Jordan A. Rivera",
      "doc_number": "AZ-0429183",
      "county": "Maricopa",
      "facility": "ASPC-Lewis",
      "release_date": "2026-06-24",
      "offense_class": "Class 4 Felony",
      "match_score": 82,
      "date_last_changed": "2026-06-09T14:02:11Z"
    }
  ],
  "next_cursor": "eyJvIjoxMDB9",
  "has_more": true
}`

const WEBHOOK_SNIPPET = `import crypto from "node:crypto";

function verify(rawBody, signatureHeader, secret) {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  // X-ReentryIQ-Signature: sha256=<hex>
  const provided = signatureHeader.replace(/^sha256=/, "");

  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(provided)
  );
}`

export default function DevelopersPage() {
  return (
    <div style={{ background: 'var(--po-bg)', minHeight: '100vh' }}>
      <SiteNav />
      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '56px 32px 72px' }}>
        {/* Hero */}
        <div style={{ maxWidth: 720, margin: '0 auto 52px', textAlign: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              marginBottom: 18,
              flexWrap: 'wrap',
            }}
          >
            <span style={eyebrow}>REST API</span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'var(--po-navy)',
                background: 'var(--po-blue-100)',
                border: '1px solid var(--po-copper-line)',
                padding: '5px 12px',
                borderRadius: 999,
              }}
            >
              <Icon name="building" size={13} stroke="var(--po-navy)" />
              Enterprise
            </span>
            <span
              className="po-mono"
              style={{
                fontSize: 11.5,
                color: 'var(--po-text-3)',
                border: '1px solid var(--po-line)',
                background: 'var(--po-panel)',
                padding: '4px 10px',
                borderRadius: 999,
              }}
            >
              v1 — specification
            </span>
          </div>
          <h1
            className="po-display"
            style={{
              fontSize: 40,
              lineHeight: 1.1,
              fontWeight: 700,
              color: 'var(--po-text)',
              margin: '0 0 16px',
              letterSpacing: '-0.02em',
            }}
          >
            Read-only API for your scope.
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--po-text-2)', margin: 0 }}>
            Query upcoming releases, county summaries, and your usage programmatically — the same data you see in the
            dashboard, scoped to your plan. Authenticate with a Bearer token and page through results with cursors.
          </p>
        </div>

        <div style={{ maxWidth: 820, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 44 }}>
          {/* Authentication */}
          <section>
            <h2 className="po-display" style={sectionTitle}>
              Authentication
            </h2>
            <p style={sectionLede}>
              Every request is authenticated with a secret API key passed as a Bearer token. Keys are issued per
              organization and inherit your plan&apos;s scope. Send your key only from server-side code — never expose it
              in a browser.
            </p>
            <pre style={codeBlock}>
              <code>{AUTH_SNIPPET}</code>
            </pre>
          </section>

          {/* Endpoints */}
          <section>
            <h2 className="po-display" style={sectionTitle}>
              Endpoints
            </h2>
            <p style={sectionLede}>
              Base URL <span className="po-mono" style={{ color: 'var(--po-text)' }}>https://api.reentryiq.com</span>.
              All endpoints are read-only and return JSON.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {ENDPOINTS.map(e => (
                <div key={e.path} style={card}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span
                      className="po-mono"
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        color: 'var(--po-sage)',
                        background: 'var(--po-sage-wash)',
                        border: '1px solid var(--po-sage-line)',
                        padding: '3px 8px',
                        borderRadius: 4,
                      }}
                    >
                      {e.method}
                    </span>
                    <code className="po-mono" style={{ fontSize: 14, color: 'var(--po-text)', fontWeight: 500 }}>
                      {e.path}
                    </code>
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--po-text-2)', margin: '12px 0 0' }}>
                    {e.desc}
                  </p>
                  {e.params && (
                    <div
                      style={{
                        marginTop: 16,
                        paddingTop: 16,
                        borderTop: '1px solid var(--po-line)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                      }}
                    >
                      <div className="po-label" style={{ marginBottom: 2 }}>
                        Query params
                      </div>
                      {e.params.map(p => (
                        <div
                          key={p.name}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '140px 1fr',
                            gap: 12,
                            alignItems: 'baseline',
                          }}
                        >
                          <code className="po-mono" style={{ fontSize: 12.5, color: 'var(--po-blue)' }}>
                            {p.name}
                          </code>
                          <span style={{ fontSize: 13, color: 'var(--po-text-2)', lineHeight: 1.5 }}>{p.note}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Example request & response */}
          <section>
            <h2 className="po-display" style={sectionTitle}>
              Example
            </h2>
            <p style={sectionLede}>
              A request for high-confidence Maricopa County releases over the next month, and the shape of the response.
            </p>
            <div className="po-label" style={{ marginBottom: 8 }}>
              Request
            </div>
            <pre style={{ ...codeBlock, marginBottom: 20 }}>
              <code>{CURL_SNIPPET}</code>
            </pre>
            <div className="po-label" style={{ marginBottom: 8 }}>
              Response
            </div>
            <pre style={codeBlock}>
              <code>{JSON_SNIPPET}</code>
            </pre>
          </section>

          {/* Rate limits */}
          <section>
            <h2 className="po-display" style={sectionTitle}>
              Rate limits
            </h2>
            <p style={sectionLede}>
              Requests are limited to <strong style={{ color: 'var(--po-text)' }}>60 per minute</strong> per API key.
              Exceeding the limit returns <span className="po-mono" style={{ color: 'var(--po-text)' }}>429 Too Many
              Requests</span> with a <span className="po-mono" style={{ color: 'var(--po-text)' }}>Retry-After</span>{' '}
              header.
            </p>
            <div style={{ ...card, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <Icon name="gauge" size={18} stroke="var(--po-blue)" style={{ marginTop: 1 }} />
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--po-text-2)', margin: 0 }}>
                Metered record views still apply through the API. Listing releases and summaries is free, but the first
                full reveal of a record — whether in the dashboard or via{' '}
                <span className="po-mono" style={{ color: 'var(--po-text)' }}>/v1/releases/:id</span> — counts once per
                billing period. Check remaining quota any time with{' '}
                <span className="po-mono" style={{ color: 'var(--po-text)' }}>GET /v1/usage</span>.
              </p>
            </div>
          </section>

          {/* Webhook signature verification */}
          <section>
            <h2 className="po-display" style={sectionTitle}>
              Webhook signature verification
            </h2>
            <p style={sectionLede}>
              Push events arrive as a signed JSON POST. Each request carries an{' '}
              <span className="po-mono" style={{ color: 'var(--po-text)' }}>X-ReentryIQ-Signature</span> header — an
              HMAC-SHA256 of the raw request body keyed with your signing secret. Verify it before trusting the payload.
            </p>
            <pre style={codeBlock}>
              <code>{WEBHOOK_SNIPPET}</code>
            </pre>
          </section>

          {/* Enterprise-only CTA */}
          <section
            style={{
              background: 'linear-gradient(120deg, var(--po-blue-100), var(--po-panel))',
              border: '1px solid var(--po-copper-line)',
              borderRadius: 'var(--po-r)',
              padding: '28px 30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ maxWidth: 520 }}>
              <h2 className="po-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                API access is available on Enterprise.
              </h2>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--po-text-2)', margin: 0 }}>
                These endpoints are a forward-looking v1 specification. Tell us about your integration and we&apos;ll get
                you a key and a scope that fits your team.
              </p>
            </div>
            <a
              href="mailto:brian@manageai.io"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                height: 48,
                padding: '0 24px',
                borderRadius: 'var(--po-r)',
                background: 'var(--po-blue)',
                color: '#fff',
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              Talk to us <Icon name="arrowRight" size={17} stroke="#fff" />
            </a>
          </section>
        </div>
      </main>
      <CtaBand />
      <SiteFooter />
    </div>
  )
}
