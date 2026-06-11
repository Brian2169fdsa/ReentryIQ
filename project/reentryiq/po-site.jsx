// po-site.jsx — shared marketing chrome: a closing CTA band + a real multi-column
// footer. Used by the Landing and Pricing pages (both load po-shell for Wordmark/Icon).

// ---- Mega menu (top nav). Columns mirror the footer exactly. ----
const MEGA = [
  { id: 'Product', items: [
    { label: 'Dashboard', href: 'ReentryIQ Dashboard.html', desc: 'Your release pipeline at a glance', icon: 'dashboard' },
    { label: 'Pricing', href: 'ReentryIQ Pricing.html', desc: 'Plans, overage & nonprofit rates', icon: 'gauge' },
    { label: 'Connectors', href: '#', desc: 'Salesforce, KIPU, Sunwave, webhooks', icon: 'plug' },
    { label: 'REST API', href: '#', desc: 'Read-only access to your scope', icon: 'compass' },
  ]},
  { id: 'Company', items: [
    { label: 'About', href: '#', desc: 'Why we built ReentryIQ', icon: 'users' },
    { label: 'Our mission', href: '#', desc: 'Reentry, recovery, second chances', icon: 'target' },
    { label: 'Contact', href: '#', desc: 'Talk to the team', icon: 'send' },
    { label: 'Careers', href: '#', desc: 'Join the team', icon: 'building' },
  ]},
  { id: 'Resources', items: [
    { label: 'Data sourcing', href: '#', desc: 'Public ADCRR records, refreshed daily', icon: 'fileText' },
    { label: 'Compliance', href: '#', desc: 'Permitted-use & FCRA posture', icon: 'shield' },
    { label: 'Help center', href: '#', desc: 'Guides and answers', icon: 'helpCircle' },
    { label: 'Status', href: '#', desc: 'System uptime', icon: 'checkCircle' },
  ]},
  { id: 'Legal', items: [
    { label: 'Terms of Service', href: '#', desc: 'The agreement', icon: 'fileText' },
    { label: 'Privacy Policy', href: '#', desc: 'How we handle data', icon: 'shield' },
    { label: 'Acceptable Use', href: '#', desc: 'Prohibited uses, plainly', icon: 'list' },
    { label: 'FCRA Notice', href: '#', desc: 'Not for screening', icon: 'note' },
  ]},
];

function SiteNav() {
  const [open, setOpen] = React.useState(null);
  const group = MEGA.find(g => g.id === open);
  return (
    <header style={poNav.bar} onMouseLeave={() => setOpen(null)}>
      <div style={poNav.inner}>
        <a href="ReentryIQ Landing.html" style={{ textDecoration: 'none', flexShrink: 0 }}><Wordmark /></a>
        <nav className="site-nav-triggers" style={poNav.triggers}>
          {MEGA.map(g => (
            <button key={g.id} onMouseEnter={() => setOpen(g.id)} onFocus={() => setOpen(g.id)}
              className="po-hov-soft" style={{ ...poNav.trigger, ...(open === g.id ? poNav.triggerOn : {}) }}>
              {g.id}
              <Icon name="chevronDown" size={14} stroke="currentColor"
                style={{ transform: open === g.id ? 'rotate(180deg)' : 'none', transition: 'transform .18s' }} />
            </button>
          ))}
        </nav>
        <div style={poNav.right}>
          <a href="ReentryIQ Dashboard.html" className="l-nav-hide" style={poNav.signIn}>Sign in</a>
          <a href="ReentryIQ Dashboard.html" style={poNav.startBtn}>Start free</a>
        </div>
      </div>

      {group && (
        <div style={poNav.mega} onMouseEnter={() => setOpen(group.id)}>
          <div style={poNav.megaInner}>
            <div style={poNav.megaAside}>
              <div style={poNav.megaAsideLabel}>{group.id}</div>
              <div style={poNav.megaAsideText}>
                {group.id === 'Product' && 'Everything in the platform, from search to push.'}
                {group.id === 'Company' && 'The mission and the people behind ReentryIQ.'}
                {group.id === 'Resources' && 'How the data works and how to get help.'}
                {group.id === 'Legal' && 'Terms, privacy, and permitted use.'}
              </div>
              <a href={group.items[0].href} style={poNav.megaAsideLink}>Explore {group.id} <Icon name="arrowRight" size={14} stroke="var(--po-blue)" /></a>
            </div>
            <div style={poNav.megaGrid}>
              {group.items.map(it => (
                <a key={it.label} href={it.href} className="po-hov-soft" style={poNav.megaItem}>
                  <span style={poNav.megaIcon}><Icon name={it.icon} size={18} stroke="var(--po-blue)" /></span>
                  <span>
                    <span style={poNav.megaLabel}>{it.label}</span>
                    <span style={poNav.megaDesc}>{it.desc}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

const poNav = {
  bar: { position: 'sticky', top: 0, zIndex: 40, background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--po-line)' },
  inner: { maxWidth: 1180, margin: '0 auto', padding: '0 32px', height: 66, display: 'flex', alignItems: 'center', gap: 18 },
  triggers: { display: 'flex', alignItems: 'center', gap: 2, marginLeft: 10 },
  trigger: { display: 'inline-flex', alignItems: 'center', gap: 5, height: 38, padding: '0 13px', borderRadius: 'var(--po-r-sm)', border: 'none', background: 'transparent', color: 'var(--po-text-2)', fontSize: 14, fontWeight: 500, fontFamily: 'var(--po-body)', transition: 'background .14s, color .14s' },
  triggerOn: { background: 'var(--po-elevated-2)', color: 'var(--po-text)' },
  right: { marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 18, flexShrink: 0 },
  signIn: { fontSize: 14, fontWeight: 500, color: 'var(--po-text-2)', textDecoration: 'none', whiteSpace: 'nowrap' },
  startBtn: { fontSize: 14, fontWeight: 600, color: '#fff', background: 'var(--po-blue)', padding: '9px 18px', borderRadius: 'var(--po-r)', textDecoration: 'none', whiteSpace: 'nowrap' },

  mega: { position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--po-panel)', borderBottom: '1px solid var(--po-line)', borderTop: '1px solid var(--po-line)' },
  megaInner: { maxWidth: 1180, margin: '0 auto', padding: '24px 32px 28px', display: 'grid', gridTemplateColumns: '0.8fr 2.4fr', gap: 36 },
  megaAside: { borderRight: '1px solid var(--po-line)', paddingRight: 28 },
  megaAsideLabel: { fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--po-blue)', marginBottom: 8 },
  megaAsideText: { fontSize: 13.5, lineHeight: 1.55, color: 'var(--po-text-2)', marginBottom: 14 },
  megaAsideLink: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--po-blue)', textDecoration: 'none' },
  megaGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  megaItem: { display: 'flex', gap: 12, padding: '11px 12px', borderRadius: 'var(--po-r)', textDecoration: 'none', alignItems: 'flex-start' },
  megaIcon: { width: 36, height: 36, borderRadius: 9, background: 'var(--po-copper-wash)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  megaLabel: { display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--po-text)' },
  megaDesc: { display: 'block', fontSize: 12.5, color: 'var(--po-text-3)', marginTop: 2, lineHeight: 1.4 },
};

function CtaBand() {
  return (
    <section style={poSite.ctaWrap}>
      <div className="site-cta" style={poSite.cta}>
        <div>
          <h2 className="po-display" style={poSite.ctaTitle}>Reach people the moment they're coming home.</h2>
          <p style={poSite.ctaSub}>Start free — no card required. Light up your county and see who's releasing in minutes.</p>
        </div>
        <div style={poSite.ctaActions}>
          <a href="ReentryIQ Dashboard.html" style={poSite.ctaPrimary}>Start free <Icon name="arrowRight" size={17} stroke="#fff" /></a>
          <a href="ReentryIQ Pricing.html" style={poSite.ctaSecondary}>See pricing</a>
        </div>
      </div>
    </section>
  );
}

const FOOT_COLS = [
  { h: 'Product', links: [['Dashboard', 'ReentryIQ Dashboard.html'], ['Pricing', 'ReentryIQ Pricing.html'], ['Connectors', '#'], ['REST API', '#']] },
  { h: 'Company', links: [['About', '#'], ['Our mission', '#'], ['Contact', '#'], ['Careers', '#']] },
  { h: 'Resources', links: [['Data sourcing', '#'], ['Compliance', '#'], ['Help center', '#'], ['Status', '#']] },
  { h: 'Legal', links: [['Terms of Service', '#'], ['Privacy Policy', '#'], ['Acceptable Use', '#'], ['FCRA Notice', '#']] },
];

function SiteFooter() {
  return (
    <footer style={poSite.footer}>
      <div style={poSite.footerInner}>
        <div className="site-foot-grid" style={poSite.footGrid}>
          <div style={poSite.brandCol}>
            <Wordmark size={16} />
            <p style={poSite.brandBlurb}>Arizona release intelligence for reentry &amp; recovery programs. Know who's coming home, when, and where.</p>
            <div style={poSite.trustChips}>
              <span style={poSite.trustChip}>Public Data</span>
              <span style={poSite.trustChip}>Privacy First</span>
              <span style={poSite.trustChip}>Second Chances</span>
            </div>
          </div>
          {FOOT_COLS.map(col => (
            <div key={col.h} style={poSite.footCol}>
              <div style={poSite.footHead}>{col.h}</div>
              {col.links.map(([label, href]) => (
                <a key={label} href={href} className="site-foot-link" style={poSite.footLink}>{label}</a>
              ))}
            </div>
          ))}
        </div>
        <div style={poSite.footBar}>
          <span>© 2026 ReentryIQ · Built by Manage AI</span>
          <span style={{ color: 'var(--po-text-3)' }}>Sourced from public ADCRR records · release dates subject to change · not for FCRA-covered screening</span>
        </div>
      </div>
    </footer>
  );
}

const poSite = {
  ctaWrap: { maxWidth: 1180, margin: '0 auto', padding: '8px 32px 64px' },
  cta: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap',
    background: 'linear-gradient(120deg, var(--po-blue-100), var(--po-panel))', border: '1px solid var(--po-copper-line)',
    borderRadius: 'var(--po-r)', padding: '32px 36px' },
  ctaTitle: { fontSize: 26, fontWeight: 700, color: 'var(--po-text)', margin: 0, letterSpacing: '-0.02em', textWrap: 'balance' },
  ctaSub: { fontSize: 15, color: 'var(--po-text-2)', margin: '8px 0 0' },
  ctaActions: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  ctaPrimary: { display: 'inline-flex', alignItems: 'center', gap: 8, height: 48, padding: '0 24px', borderRadius: 'var(--po-r)', background: 'var(--po-blue)', color: '#fff', fontSize: 15, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' },
  ctaSecondary: { display: 'inline-flex', alignItems: 'center', height: 48, padding: '0 24px', borderRadius: 'var(--po-r)', background: 'var(--po-panel)', color: 'var(--po-text)', fontSize: 15, fontWeight: 600, textDecoration: 'none', border: '1px solid var(--po-line-strong)', whiteSpace: 'nowrap' },

  footer: { borderTop: '1px solid var(--po-line)', background: 'var(--po-panel)' },
  footerInner: { maxWidth: 1180, margin: '0 auto', padding: '48px 32px 28px' },
  footGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 32 },
  brandCol: { maxWidth: 320 },
  brandBlurb: { fontSize: 13.5, lineHeight: 1.6, color: 'var(--po-text-2)', margin: '14px 0 16px' },
  trustChips: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  trustChip: { fontSize: 11, fontWeight: 600, color: 'var(--po-text-2)', background: 'var(--po-bg)', border: '1px solid var(--po-line)', borderRadius: 999, padding: '4px 11px', whiteSpace: 'nowrap' },
  footCol: { display: 'flex', flexDirection: 'column', gap: 11 },
  footHead: { fontSize: 11.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--po-text-3)', marginBottom: 4 },
  footLink: { fontSize: 13.5, color: 'var(--po-text-2)', textDecoration: 'none' },
  footBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginTop: 40, paddingTop: 22, borderTop: '1px solid var(--po-line)', fontSize: 12, color: 'var(--po-text-2)' },
};

Object.assign(window, { SiteNav, SiteFooter, CtaBand });
