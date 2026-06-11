// po-pricing.jsx — ReentryIQ pricing (spec §2). Monthly/annual + nonprofit toggles,
// grouped comparison table (Pro elevated), 5-item FAQ accordion.

const { useState: poPUseState } = React;

const TIERS = [
  { id: 'starter', name: 'Starter', price: 99, cta: 'Start free', blurb: 'One county, one user.', np: false },
  { id: 'pro', name: 'Pro', price: 299, cta: 'Start free', blurb: 'Statewide, your whole team.', np: true, popular: true },
  { id: 'enterprise', name: 'Enterprise', price: 849, cta: 'Talk to us', blurb: 'Connectors, AI, and API.', np: true, enterprise: true },
];

const GROUPS = [
  { label: 'Data', rows: [
    { feat: 'Coverage', vals: ['1 county', 'Statewide', 'Statewide'] },
    { feat: 'Record views / mo', vals: ['100', '500', '2,500'] },
    { feat: 'Seats', vals: ['1', '3', 'Unlimited'] },
    { feat: 'Filters', vals: ['Basic', 'Full', 'Full + saved segments'] },
    { feat: 'CSV export', vals: [false, true, true] },
  ]},
  { label: 'Alerts', rows: [
    { feat: 'Release-date alerts', vals: [false, 'Email', 'Email + webhook'] },
  ]},
  { label: 'Connectors & AI', rows: [
    { feat: 'AI assistant', vals: [false, false, true] },
    { feat: 'CRM connectors (Salesforce · KIPU · Sunwave)', vals: [false, false, true] },
    { feat: 'Webhook / Zapier', vals: [false, true, true] },
  ]},
  { label: 'API & Billing', rows: [
    { feat: 'REST API', vals: [false, false, true] },
    { feat: 'Overage per record', vals: ['$1.00', '$0.75', '$0.50'] },
  ]},
];

const FAQ = [
  { q: 'What counts as a record view?', a: 'A record view is the first time your organization reveals a full record in a billing period. Re-opening a record you already revealed is free — you are never charged twice for the same person in the same period.' },
  { q: 'How does overage work?', a: "You get a soft-limit banner at 100% of your included views. Past that, additional full-record reveals bill at your tier's per-record rate ($1.00 / $0.75 / $0.50). You can switch overage off in org settings — reveals are simply blocked until the next period." },
  { q: 'Where does the data come from?', a: 'Every record is sourced from public Arizona Department of Corrections release data and refreshed daily. Release dates are set by the agency and can change; we surface the most recent available date and timestamp it.' },
  { q: 'Can I cancel anytime?', a: 'Yes. Monthly plans have no contract — manage or cancel from the Stripe billing portal in Settings. Annual plans run for the term you prepaid.' },
  { q: 'How does nonprofit verification work?', a: 'Registered nonprofits get 30% off Pro and Enterprise. Toggle the nonprofit rate, start your trial, and submit your EIN — the discount applies once verified.' },
];

function priceFor(tier, annual, nonprofit) {
  let m = tier.price;
  if (nonprofit && tier.np) m = Math.round(tier.price * 0.7);
  if (annual) return { perMo: Math.round(m * 10 / 12), yearly: m * 10, base: m };
  return { perMo: m, yearly: null, base: m };
}

function Cell({ v }) {
  if (v === true) return <span style={poP.check}><Icon name="check" size={15} stroke="var(--po-blue)" sw={2.4} /></span>;
  if (v === false) return <span style={poP.dash}>—</span>;
  return <span style={poP.cellText}>{v}</span>;
}

function Pricing() {
  const [annual, setAnnual] = poPUseState(false);
  const [nonprofit, setNonprofit] = poPUseState(false);
  const [openFaq, setOpenFaq] = poPUseState(0);

  return (
    <div style={{ background: 'var(--po-bg)', minHeight: '100vh' }}>
      <SiteNav />

      <section style={poP.head}>
        <div style={poP.eyebrow}>Pricing</div>
        <h1 className="po-display pricing-title" style={poP.title}>Priced to pay for itself in one admission.</h1>
        <p style={poP.sub}>A predictable subscription floor with metered overage only if you go past it. No per-pull surprises.</p>

        <div style={poP.toggles}>
          <div style={poP.segment}>
            <button onClick={() => setAnnual(false)} style={{ ...poP.segBtn, ...(annual ? {} : poP.segBtnOn) }}>Monthly</button>
            <button onClick={() => setAnnual(true)} style={{ ...poP.segBtn, ...(annual ? poP.segBtnOn : {}) }}>
              Annual <span style={poP.savePill}>2 months free</span>
            </button>
          </div>
          <button onClick={() => setNonprofit(n => !n)} style={poP.npToggle}>
            <span style={{ ...poP.switch, ...(nonprofit ? poP.switchOn : {}) }}><i style={{ ...poP.knob, ...(nonprofit ? poP.knobOn : {}) }}></i></span>
            <span style={{ color: nonprofit ? 'var(--po-text)' : 'var(--po-text-2)', fontWeight: nonprofit ? 600 : 500 }}>Nonprofit rate</span>
            <span style={poP.einNote}>EIN verification required</span>
          </button>
        </div>
      </section>

      {/* comparison table */}
      <section className="pricing-scroll" style={poP.tableWrap}>
        <div className="pricing-table-inner" style={poP.table}>
          <div style={poP.headRow}>
            <div style={poP.featCol}></div>
            {TIERS.map(t => {
              const p = priceFor(t, annual, nonprofit);
              const discounted = nonprofit && t.np;
              return (
                <div key={t.id} style={{ ...poP.tierCol, ...(t.popular ? poP.tierColPop : {}) }}>
                  {t.popular && <div style={poP.popPill}>Most popular</div>}
                  <div style={poP.tierName}>{t.name}</div>
                  <div style={poP.priceRow}>
                    <span className="po-display" style={poP.price}>${p.perMo.toLocaleString()}</span>
                    <span style={poP.per}>/mo</span>
                    {discounted && <span style={poP.npTag}>30% off</span>}
                  </div>
                  <div style={poP.priceSub}>
                    {annual ? `billed $${p.yearly.toLocaleString()}/yr` : t.enterprise ? 'billed monthly' : 'billed monthly'}
                  </div>
                  <div style={poP.blurb}>{t.blurb}</div>
                  <a href={t.enterprise ? '#contact' : 'ReentryIQ Dashboard.html'}
                     style={{ ...poP.tierCta, ...(t.popular ? poP.tierCtaPop : {}) }}>{t.cta}</a>
                </div>
              );
            })}
          </div>

          {GROUPS.map(g => (
            <div key={g.label}>
              <div style={poP.groupLabel}>{g.label}</div>
              {g.rows.map(row => (
                <div key={row.feat} style={poP.featRow}>
                  <div style={poP.featCol}>{row.feat}</div>
                  {row.vals.map((v, i) => (
                    <div key={i} style={{ ...poP.valCol, ...(TIERS[i].popular ? poP.valColPop : {}) }}><Cell v={v} /></div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={poP.faqWrap}>
        <h2 className="po-display" style={poP.faqTitle}>Questions, answered</h2>
        <div style={poP.faqList}>
          {FAQ.map((f, i) => {
            const open = openFaq === i;
            return (
              <div key={i} style={poP.faqItem}>
                <button onClick={() => setOpenFaq(open ? -1 : i)} style={poP.faqQ}>
                  <span>{f.q}</span>
                  <Icon name="chevronDown" size={18} stroke="var(--po-text-3)" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
                </button>
                {open && <div style={poP.faqA}>{f.a}</div>}
              </div>
            );
          })}
        </div>
      </section>

      <CtaBand />
      <SiteFooter />
    </div>
  );
}

const poP = {
  nav: { position: 'sticky', top: 0, zIndex: 30, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--po-line)' },
  navInner: { maxWidth: 1160, margin: '0 auto', padding: '0 32px', height: 66, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  navLinks: { display: 'flex', alignItems: 'center', gap: 26 },
  navLink: { fontSize: 14, fontWeight: 500, color: 'var(--po-text-2)', textDecoration: 'none', whiteSpace: 'nowrap' },
  navCta: { fontSize: 14, fontWeight: 600, color: 'var(--po-accent-fg)', background: 'var(--po-blue)', padding: '9px 18px', borderRadius: 'var(--po-r)', textDecoration: 'none', whiteSpace: 'nowrap' },

  head: { maxWidth: 760, margin: '0 auto', padding: '64px 32px 32px', textAlign: 'center' },
  eyebrow: { fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--po-blue)', marginBottom: 14 },
  title: { fontSize: 38, lineHeight: 1.12, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 14px', letterSpacing: '-0.02em', textWrap: 'balance' },
  sub: { fontSize: 16, lineHeight: 1.6, color: 'var(--po-text-2)', margin: '0 auto', maxWidth: 520 },

  toggles: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginTop: 30, flexWrap: 'wrap' },
  segment: { display: 'inline-flex', padding: 4, background: 'var(--po-panel)', border: '1px solid var(--po-line)', borderRadius: 'var(--po-r)', gap: 3 },
  segBtn: { display: 'inline-flex', alignItems: 'center', gap: 8, height: 36, padding: '0 16px', border: 'none', background: 'transparent', color: 'var(--po-text-2)', fontSize: 13.5, fontWeight: 600, borderRadius: 'var(--po-r-sm)', transition: 'all .15s' },
  segBtnOn: { background: 'var(--po-navy)', color: '#F3F6FB' },
  savePill: { fontSize: 10.5, fontWeight: 700, color: 'var(--po-sage)', background: 'var(--po-sage-wash)', padding: '2px 7px', borderRadius: 999 },
  npToggle: { display: 'inline-flex', alignItems: 'center', gap: 10, border: 'none', background: 'transparent', fontSize: 13.5 },
  switch: { width: 38, height: 22, borderRadius: 999, background: 'var(--po-line-strong)', position: 'relative', transition: 'background .18s', flexShrink: 0 },
  switchOn: { background: 'var(--po-blue)' },
  knob: { position: 'absolute', top: 3, left: 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left .18s' },
  knobOn: { left: 19 },
  einNote: { fontSize: 11.5, color: 'var(--po-text-3)' },

  tableWrap: { maxWidth: 1080, margin: '0 auto', padding: '20px 32px 0' },
  table: { width: '100%' },
  headRow: { display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', alignItems: 'end', gap: 0 },
  featCol: { padding: '0 16px', fontSize: 14, color: 'var(--po-text-2)', display: 'flex', alignItems: 'center' },
  tierCol: { padding: '14px 18px 20px', borderTopLeftRadius: 'var(--po-r)', borderTopRightRadius: 'var(--po-r)', position: 'relative', textAlign: 'left' },
  tierColPop: { background: 'var(--po-panel)', border: '1px solid var(--po-line)', borderBottom: 'none', borderTop: '3px solid var(--po-blue)' },
  popPill: { position: 'absolute', top: -12, left: 18, whiteSpace: 'nowrap', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--po-accent-fg)', background: 'var(--po-blue)', padding: '3px 10px', borderRadius: 999 },
  tierName: { fontSize: 15, fontWeight: 700, color: 'var(--po-text)', fontFamily: 'var(--po-display)', marginBottom: 8 },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: 5 },
  price: { fontSize: 34, fontWeight: 700, color: 'var(--po-text)', letterSpacing: '-0.02em' },
  per: { fontSize: 14, color: 'var(--po-text-3)' },
  npTag: { fontSize: 10, fontWeight: 700, color: 'var(--po-sage)', background: 'var(--po-sage-wash)', padding: '2px 6px', borderRadius: 4, marginLeft: 4 },
  priceSub: { fontSize: 12, color: 'var(--po-text-3)', marginTop: 4, fontFamily: 'var(--po-mono)' },
  blurb: { fontSize: 13, color: 'var(--po-text-2)', margin: '12px 0 16px', minHeight: 34 },
  tierCta: { display: 'block', textAlign: 'center', height: 40, lineHeight: '40px', borderRadius: 'var(--po-r)', textDecoration: 'none', fontSize: 13.5, fontWeight: 600, color: 'var(--po-text)', background: 'var(--po-panel)', border: '1px solid var(--po-line-strong)', transition: 'all .15s' },
  tierCtaPop: { background: 'var(--po-blue)', color: 'var(--po-accent-fg)', border: '1px solid var(--po-blue)' },

  groupLabel: { fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--po-text-3)', padding: '22px 16px 8px', borderBottom: '1px solid var(--po-line)' },
  featRow: { display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', alignItems: 'center', borderBottom: '1px solid var(--po-line)', minHeight: 46 },
  valCol: { padding: '10px 18px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' },
  valColPop: { background: 'var(--po-panel)', borderLeft: '1px solid var(--po-line)', borderRight: '1px solid var(--po-line)' },
  cellText: { fontSize: 13.5, color: 'var(--po-text)', fontWeight: 500 },
  check: { display: 'inline-flex', width: 22, height: 22, borderRadius: 6, background: 'var(--po-copper-wash)', alignItems: 'center', justifyContent: 'center' },
  dash: { color: 'var(--po-text-3)', fontSize: 15 },

  faqWrap: { maxWidth: 760, margin: '0 auto', padding: '64px 32px' },
  faqTitle: { fontSize: 28, fontWeight: 700, color: 'var(--po-text)', textAlign: 'center', margin: '0 0 28px', letterSpacing: '-0.02em' },
  faqList: { display: 'flex', flexDirection: 'column', gap: 10 },
  faqItem: { background: 'var(--po-panel)', border: '1px solid var(--po-line)', borderRadius: 'var(--po-r)', overflow: 'hidden' },
  faqQ: { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '16px 20px', border: 'none', background: 'transparent', fontFamily: 'var(--po-body)', fontSize: 15, fontWeight: 600, color: 'var(--po-text)', textAlign: 'left' },
  faqA: { padding: '0 20px 18px', fontSize: 14, lineHeight: 1.6, color: 'var(--po-text-2)' },

  footer: { background: 'var(--po-navy)', padding: '24px 0' },
  footerInner: { maxWidth: 1080, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' },
};

ReactDOM.createRoot(document.getElementById('root')).render(<Pricing />);
