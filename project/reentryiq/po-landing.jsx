// po-landing.jsx — ReentryIQ landing, matched to the dashboard's light visual language.
// Reuses the dashboard charts (HorizonBars / Donut / LineChart) so the home page
// literally previews the product. White surfaces, soft borders, blue accents.

const { useMemo: poLUseMemo } = React;

const LCAT = { maricopa: '#4A90E2', pima: '#7FB0E8', pinal: '#2E8B6E', yavapai: '#E0A33A', other: '#94A3B8' };
const L_HORIZON = PO_DATA.dailyCounts.map(d => ({ count: d.count * 12 + 18 + (d.dayIdx % 6) * 4 }));
const L_COUNTY = [
  { label: 'Maricopa', value: 317, pct: '52%', color: LCAT.maricopa },
  { label: 'Pima', value: 142, pct: '23%', color: LCAT.pima },
  { label: 'Pinal', value: 68, pct: '11%', color: LCAT.pinal },
  { label: 'Yavapai', value: 42, pct: '7%', color: LCAT.yavapai },
  { label: 'Other', value: 43, pct: '7%', color: LCAT.other },
];
const L_LINES = [
  { label: 'Maricopa', color: LCAT.maricopa, points: [78, 84, 92, 88, 96, 104, 99, 108, 102, 110, 106, 101] },
  { label: 'Pima', color: LCAT.pima, points: [44, 47, 52, 49, 55, 58, 54, 60, 57, 62, 59, 56] },
  { label: 'Pinal', color: LCAT.pinal, points: [30, 33, 31, 36, 34, 39, 37, 41, 38, 43, 40, 38] },
  { label: 'Yavapai', color: LCAT.yavapai, points: [16, 18, 17, 19, 18, 20, 19, 21, 20, 22, 21, 20] },
  { label: 'Other', color: LCAT.other, points: [9, 10, 9, 11, 10, 11, 10, 12, 11, 12, 11, 11] },
];
const L_LABELS = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];

function Landing() {
  const steps = [
    { icon: 'compass', title: 'Search', body: 'Filter upcoming releases by date window, county, facility, offense class, or match score — the whole state in one view.' },
    { icon: 'bell', title: 'Alert', body: "Save a search and we watch the gate. Release-date alerts hit your inbox or a signed webhook the moment a match appears." },
    { icon: 'plug', title: 'Connect', body: 'Push matched records straight into Salesforce, KIPU, or Sunwave — or anywhere, via webhook. Your pipeline, automatically.' },
  ];
  const segments = [
    { icon: 'building', title: 'Treatment centers', body: 'Fill beds with release-date outreach. One admission pays for the year.' },
    { icon: 'users', title: 'Reentry programs', body: 'Reach people before release and report grant-ready outcomes.' },
    { icon: 'layers', title: 'Sober livings', body: 'Plan capacity around who is actually coming home, and when.' },
  ];
  const stats = [
    { icon: 'users', value: PO_DATA.totalReleases.toLocaleString() + '+', label: 'Releases tracked' },
    { icon: 'mapPin', value: '10', label: 'Counties covered' },
    { icon: 'refresh', value: 'Daily', label: 'Data refresh' },
    { icon: 'clock', value: '< 30d', label: 'Release lead time' },
  ];

  return (
    <div style={{ background: 'var(--po-bg)', minHeight: '100vh' }}>
      {/* nav (shared mega menu) */}
      <SiteNav />

      {/* hero — light, with a real dashboard preview */}
      <section style={poL.hero}>
        <div className="l-hero" style={poL.heroInner}>
          <div>
            <div style={poL.eyebrowPill}>Arizona release intelligence</div>
            <h1 className="po-display l-hero-title" style={poL.heroTitle}>Know who's coming home — before anyone else does.</h1>
            <p style={poL.heroSub}>Release intelligence for reentry &amp; recovery programs. Search every upcoming release in the state, get alerted as dates land, and push matches into your CRM.</p>
            <div style={poL.heroCtas}>
              <a href="ReentryIQ Dashboard.html" style={poL.ctaPrimary}>Start free <Icon name="arrowRight" size={17} stroke="#fff" /></a>
              <a href="ReentryIQ Pricing.html" style={poL.ctaSecondary}>See pricing</a>
            </div>
            <div style={poL.trustline}>
              <span style={poL.trustDot}><Icon name="shield" size={14} stroke={LCAT.pinal} /></span>
              Sourced from public records · refreshed daily · not for FCRA screening
            </div>
          </div>

          {/* preview card: the dashboard's Release Horizon */}
          <div style={poL.previewCard}>
            <div style={poL.previewHead}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 className="po-display" style={poL.previewTitle}>Release Horizon</h3>
                <span style={poL.previewTag}>Next 180 Days</span>
              </div>
              <div style={{ display: 'flex', gap: 24 }}>
                <PreviewStat value="1,991" label="People Tracked" />
                <PreviewStat value="93%" label="With Dates" color={LCAT.pinal} />
              </div>
            </div>
            <HorizonBars days={L_HORIZON} todayIdx={14} height={132} />
            <div style={poL.previewCallout}>
              <span style={poL.previewCalloutIcon}><Icon name="sparkles" size={15} stroke="var(--po-blue)" /></span>
              <span><b style={{ color: 'var(--po-blue)' }}>317</b> high-propensity releases into Maricopa in the next 60 days.</span>
            </div>
          </div>
        </div>

        {/* stat cards (dashboard KPI style) */}
        <div className="l-stats" style={poL.statRow}>
          {stats.map(s => (
            <div key={s.label} style={poL.statCard}>
              <span style={poL.statIcon}><Icon name={s.icon} size={18} stroke="var(--po-blue)" /></span>
              <div>
                <div className="po-display" style={poL.statVal}>{s.value}</div>
                <div style={poL.statLabel}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* product preview band */}
      <section style={poL.section}>
        <div style={poL.sectionInner}>
          <SectionHead eyebrow="The dashboard" title="Your whole pipeline, at a glance" sub="Every upcoming release, scored and mapped — the same view your team works from every morning." />
          <div className="l-pgrid" style={poL.previewGrid}>
            <div style={poL.card}>
              <div style={{ marginBottom: 6 }}>
                <h3 className="po-display" style={poL.cardTitleSm}>Releases by County</h3>
                <div style={poL.cardSub}>Next 60 Days</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 6 }}>
                <Donut segments={L_COUNTY} total="612" size={150} stroke={24} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {L_COUNTY.map(s => (
                    <div key={s.label} style={poL.legRow}>
                      <i style={{ ...poL.legDot, background: s.color }}></i>
                      <span style={{ flex: 1, fontSize: 13, color: 'var(--po-text-2)' }}>{s.label}</span>
                      <span className="po-mono" style={{ fontSize: 13, color: 'var(--po-text)', fontWeight: 500 }}>{s.value}</span>
                      <span style={{ fontSize: 12, color: 'var(--po-text-3)', width: 34, textAlign: 'right' }}>({s.pct})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={poL.card}>
              <div style={poL.lineHead}>
                <h3 className="po-display" style={poL.cardTitleSm}>Releases Over Time</h3>
                <div style={poL.legWrap}>
                  {L_LINES.map(s => <span key={s.label} style={poL.legItem}><i style={{ ...poL.legDot, background: s.color }}></i>{s.label}</span>)}
                </div>
              </div>
              <LineChart series={L_LINES} labels={L_LABELS} height={210} />
            </div>
          </div>
        </div>
      </section>

      {/* how it works */}
      <section style={{ ...poL.section, background: 'var(--po-panel)', borderTop: '1px solid var(--po-line)', borderBottom: '1px solid var(--po-line)' }}>
        <div style={poL.sectionInner}>
          <SectionHead eyebrow="How it works" title="Three steps from public record to your pipeline" />
          <div className="l-cards3" style={poL.cards3}>
            {steps.map((s, i) => (
              <div key={s.title} className="po-hov-card po-hov-lift" style={poL.card}>
                <div style={poL.cardIcon}><Icon name={s.icon} size={19} stroke="var(--po-blue)" /></div>
                <div style={poL.stepNum}>{String(i + 1).padStart(2, '0')}</div>
                <h3 className="po-display" style={poL.cardTitle}>{s.title}</h3>
                <p style={poL.cardBody}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* who it's for */}
      <section style={poL.section}>
        <div style={poL.sectionInner}>
          <SectionHead eyebrow="Who it's for" title="Built for programs that reach people at release" />
          <div className="l-cards3" style={poL.cards3}>
            {segments.map(s => (
              <div key={s.title} className="po-hov-card po-hov-lift" style={poL.card}>
                <div style={poL.cardIcon}><Icon name={s.icon} size={19} stroke="var(--po-blue)" /></div>
                <h3 className="po-display" style={poL.cardTitle}>{s.title}</h3>
                <p style={poL.cardBody}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* compliance */}
      <section style={{ ...poL.section, paddingTop: 0 }}>
        <div style={poL.sectionInner}>
          <div style={poL.compliance}>
            <div style={poL.complianceIcon}><Icon name="shield" size={24} stroke="var(--po-blue)" /></div>
            <div>
              <h3 className="po-display" style={{ fontSize: 18, color: 'var(--po-text)', margin: '0 0 8px' }}>Sourced from public records. Used for good.</h3>
              <p style={poL.complianceText}>
                Every record is drawn from public Arizona Department of Corrections data and refreshed daily; release dates can change at the agency's discretion. ReentryIQ is for outreach, admissions, and program planning only — <b style={{ color: 'var(--po-text)' }}>never for employment, tenant, credit, or insurance screening</b> or any other FCRA-covered purpose. Every account attests to permitted use at signup.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* closing CTA + footer (shared) */}
      <CtaBand />
      <SiteFooter />
    </div>
  );
}

function PreviewStat({ value, label, color }) {
  return (
    <div style={{ textAlign: 'right' }}>
      <div className="po-display" style={{ fontSize: 19, fontWeight: 700, color: color || 'var(--po-text)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--po-text-3)', marginTop: 3, whiteSpace: 'nowrap' }}>{label}</div>
    </div>
  );
}

function SectionHead({ eyebrow, title, sub }) {
  return (
    <div style={{ marginBottom: 30, maxWidth: 640 }}>
      <div style={poL.eyebrow}>{eyebrow}</div>
      <h2 className="po-display" style={poL.sectionTitle}>{title}</h2>
      {sub && <p style={poL.sectionSub}>{sub}</p>}
    </div>
  );
}

const poL = {
  nav: { position: 'sticky', top: 0, zIndex: 30, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--po-line)' },
  navInner: { maxWidth: 1180, margin: '0 auto', padding: '0 32px', height: 66, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  navLinks: { display: 'flex', alignItems: 'center', gap: 26 },
  navLink: { fontSize: 14, fontWeight: 500, color: 'var(--po-text-2)', textDecoration: 'none', whiteSpace: 'nowrap' },
  navCta: { fontSize: 14, fontWeight: 600, color: '#fff', background: 'var(--po-blue)', padding: '9px 18px', borderRadius: 'var(--po-r)', textDecoration: 'none', whiteSpace: 'nowrap' },

  hero: { maxWidth: 1180, margin: '0 auto', padding: '56px 32px 8px' },
  heroInner: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' },
  eyebrowPill: { display: 'inline-block', whiteSpace: 'nowrap', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--po-blue)', background: 'var(--po-copper-wash)', border: '1px solid var(--po-copper-line)', padding: '5px 12px', borderRadius: 999, marginBottom: 20 },
  heroTitle: { fontSize: 44, lineHeight: 1.1, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 18px', letterSpacing: '-0.02em', textWrap: 'balance' },
  heroSub: { fontSize: 17, lineHeight: 1.6, color: 'var(--po-text-2)', margin: '0 0 26px', maxWidth: 470 },
  heroCtas: { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 22 },
  ctaPrimary: { display: 'inline-flex', alignItems: 'center', gap: 8, height: 48, padding: '0 24px', borderRadius: 'var(--po-r)', background: 'var(--po-blue)', color: '#fff', fontSize: 15, fontWeight: 600, textDecoration: 'none' },
  ctaSecondary: { display: 'inline-flex', alignItems: 'center', height: 48, padding: '0 24px', borderRadius: 'var(--po-r)', background: 'var(--po-panel)', color: 'var(--po-text)', fontSize: 15, fontWeight: 600, textDecoration: 'none', border: '1px solid var(--po-line-strong)' },
  trustline: { display: 'flex', alignItems: 'center', gap: 9, fontSize: 12.5, color: 'var(--po-text-3)' },
  trustDot: { width: 24, height: 24, borderRadius: '50%', background: 'var(--po-sage-wash)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },

  previewCard: { background: 'var(--po-panel)', border: '1px solid var(--po-line)', borderRadius: 'var(--po-r)', padding: '18px 20px' },
  previewHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, gap: 12 },
  previewTitle: { fontSize: 15, fontWeight: 600, color: 'var(--po-text)', margin: 0 },
  previewTag: { fontSize: 11.5, color: 'var(--po-text-3)', whiteSpace: 'nowrap' },
  previewCallout: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, padding: '11px 13px', background: 'var(--po-blue-100)', border: '1px solid var(--po-copper-line)', borderRadius: 'var(--po-r-sm)', fontSize: 13, color: 'var(--po-text)' },
  previewCalloutIcon: { width: 28, height: 28, borderRadius: 7, background: 'var(--po-panel)', border: '1px solid var(--po-copper-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },

  statRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 36 },
  statCard: { display: 'flex', alignItems: 'center', gap: 13, background: 'var(--po-panel)', border: '1px solid var(--po-line)', borderRadius: 'var(--po-r)', padding: '16px 18px' },
  statIcon: { width: 40, height: 40, borderRadius: '50%', background: 'var(--po-copper-wash)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  statVal: { fontSize: 24, fontWeight: 700, color: 'var(--po-text)', lineHeight: 1, letterSpacing: '-0.01em' },
  statLabel: { fontSize: 12.5, color: 'var(--po-text-3)', marginTop: 4 },

  section: { padding: '64px 0' },
  sectionInner: { maxWidth: 1180, margin: '0 auto', padding: '0 32px' },
  eyebrow: { fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--po-blue)', marginBottom: 12 },
  sectionTitle: { fontSize: 32, lineHeight: 1.15, fontWeight: 700, color: 'var(--po-text)', margin: 0, letterSpacing: '-0.02em', textWrap: 'balance' },
  sectionSub: { fontSize: 15.5, lineHeight: 1.6, color: 'var(--po-text-2)', margin: '12px 0 0' },

  previewGrid: { display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 18 },
  card: { background: 'var(--po-panel)', border: '1px solid var(--po-line)', borderRadius: 'var(--po-r)', padding: '18px 20px', position: 'relative' },
  cardTitleSm: { fontSize: 15, fontWeight: 600, color: 'var(--po-text)', margin: 0 },
  cardSub: { fontSize: 12.5, color: 'var(--po-text-3)', marginTop: 3 },
  lineHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12, flexWrap: 'wrap' },
  legWrap: { display: 'flex', flexWrap: 'wrap', gap: 12 },
  legItem: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--po-text-2)' },
  legRow: { display: 'flex', alignItems: 'center', gap: 9 },
  legDot: { width: 9, height: 9, borderRadius: '50%', flexShrink: 0 },

  cards3: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 },
  cardIcon: { width: 44, height: 44, borderRadius: '50%', background: 'var(--po-copper-wash)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  stepNum: { position: 'absolute', top: 26, right: 24, fontFamily: 'var(--po-mono)', fontSize: 13, color: 'var(--po-text-3)', fontWeight: 500 },
  cardTitle: { fontSize: 18, fontWeight: 600, color: 'var(--po-text)', margin: '0 0 10px' },
  cardBody: { fontSize: 14.5, lineHeight: 1.6, color: 'var(--po-text-2)', margin: 0 },

  compliance: { display: 'flex', gap: 20, alignItems: 'flex-start', background: 'var(--po-blue-100)', border: '1px solid var(--po-copper-line)', borderRadius: 'var(--po-r)', padding: '28px 30px' },
  complianceIcon: { width: 48, height: 48, flexShrink: 0, borderRadius: 12, background: 'var(--po-panel)', border: '1px solid var(--po-copper-line)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  complianceText: { fontSize: 14.5, lineHeight: 1.65, color: 'var(--po-text-2)', margin: 0, maxWidth: 820 },

  footer: { borderTop: '1px solid var(--po-line)', background: 'var(--po-panel)', padding: '24px 0' },
  footerInner: { maxWidth: 1180, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' },
  footerLinks: { display: 'flex', alignItems: 'center', gap: 18 },
  footerLink: { fontSize: 13, color: 'var(--po-text-2)', textDecoration: 'none' },
};

ReactDOM.createRoot(document.getElementById('root')).render(<Landing />);
