import { Wordmark } from '@/components/ui/Wordmark'

const COLS = [
  {
    h: 'Product',
    links: [
      ['Dashboard', '/dashboard'],
      ['Pricing', '/pricing'],
      ['Connectors', '/connectors'],
      ['REST API', '/developers'],
    ],
  },
  {
    h: 'Company',
    links: [
      ['About', '/about'],
      ['Our mission', '/mission'],
      ['Contact', '/contact'],
      ['Careers', '/careers'],
    ],
  },
  {
    h: 'Resources',
    links: [
      ['Data sourcing', '/data-sourcing'],
      ['Compliance', '/compliance'],
      ['Help center', '/help'],
      ['Status', '/status'],
    ],
  },
  {
    h: 'Legal',
    links: [
      ['Terms of Service', '/terms'],
      ['Privacy Policy', '/privacy'],
      ['Acceptable Use', '/acceptable-use'],
      ['FCRA Notice', '/fcra-notice'],
    ],
  },
]

export function SiteFooter() {
  return (
    <footer style={{ borderTop: '1px solid var(--po-line)', background: 'var(--po-panel)' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '48px 32px 28px' }}>
        <div
          className="site-foot-grid"
          style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 32 }}
        >
          {/* Brand column */}
          <div style={{ maxWidth: 320 }}>
            <Wordmark size={16} />
            <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--po-text-2)', margin: '14px 0 16px' }}>
              Arizona release intelligence for reentry &amp; recovery programs. Know who&apos;s coming home, when, and
              where.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Public Data', 'Privacy First', 'Second Chances'].map(chip => (
                <span
                  key={chip}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--po-text-2)',
                    background: 'var(--po-bg)',
                    border: '1px solid var(--po-line)',
                    borderRadius: 999,
                    padding: '4px 11px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLS.map(col => (
            <div key={col.h} style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              <div
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--po-text-3)',
                  marginBottom: 4,
                }}
              >
                {col.h}
              </div>
              {col.links.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  className="site-foot-link"
                  style={{ fontSize: 13.5, color: 'var(--po-text-2)', textDecoration: 'none' }}
                >
                  {label}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
            marginTop: 40,
            paddingTop: 22,
            borderTop: '1px solid var(--po-line)',
            fontSize: 12,
            color: 'var(--po-text-2)',
          }}
        >
          <span>© 2026 ReentryIQ · Built by Manage AI</span>
          <span style={{ color: 'var(--po-text-3)' }}>
            Sourced from public ADCRR records · release dates subject to change · not for FCRA-covered screening
          </span>
        </div>
      </div>
    </footer>
  )
}
