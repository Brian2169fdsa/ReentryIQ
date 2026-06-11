// po-overview.jsx — ReentryIQ overview dashboard. White three-column shell:
// left nav rail (plan + nav + integrations + user), center overview, right Assistant.
const { useState: poOUseState } = React;

// ---- category palette (per the reference mockup) ----
const CAT = {
  maricopa: '#4A90E2', pima: '#7FB0E8', pinal: '#2E8B6E', yavapai: '#E0A33A', other: '#94A3B8',
};

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'search', label: 'Search & Discover', icon: 'compass' },
  { id: 'saved', label: 'Saved Searches', icon: 'bookmark' },
  { id: 'alerts', label: 'Alerts', icon: 'bell', badge: 7 },
  { id: 'exports', label: 'Exports', icon: 'download' },
  { id: 'views', label: 'Record Views', icon: 'fileText' },
  { id: 'reports', label: 'Reports', icon: 'list' },
];
const SECONDARY = [
  { id: 'billing', label: 'Billing & Usage', icon: 'gauge' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
  { id: 'help', label: 'Help & Support', icon: 'helpCircle' },
];
const INTEGRATIONS = [
  { label: 'Salesforce', color: '#00A1E0', letter: 'S', ok: true },
  { label: 'KIPU', color: '#1B2A4A', letter: 'K', ok: true },
  { label: 'Sunwave', color: '#16B7A6', letter: 'S', ok: true },
  { label: 'API Access', color: '#64748B', icon: 'code', ok: false },
];

const horizonDays = PO_DATA.dailyCounts.map(d => ({ count: d.count * 12 + 18 + (d.dayIdx % 6) * 4 }));

const KPIS = [
  { label: 'Upcoming Releases', sub: 'Next 60 Days', value: '612', delta: '18% vs prior 60 days', up: true, icon: 'users' },
  { label: 'Average Release Score', sub: '(Outreach Likelihood)', value: '72', delta: '8 pts vs prior 60 days', up: true, icon: 'target' },
  { label: 'Maricopa County', sub: 'Next 60 Days', value: '317', flat: '52% of upcoming releases', icon: 'mapPin' },
  { label: 'Avg. Days Until Release', sub: '(All Active)', value: '45', delta: '6 days vs prior 60 days', up: false, icon: 'calendar' },
];

const LINE_SERIES = [
  { label: 'Maricopa', color: CAT.maricopa, points: [78, 84, 92, 88, 96, 104, 99, 108, 102, 110, 106, 101] },
  { label: 'Pima', color: CAT.pima, points: [44, 47, 52, 49, 55, 58, 54, 60, 57, 62, 59, 56] },
  { label: 'Pinal', color: CAT.pinal, points: [30, 33, 31, 36, 34, 39, 37, 41, 38, 43, 40, 38] },
  { label: 'Yavapai', color: CAT.yavapai, points: [16, 18, 17, 19, 18, 20, 19, 21, 20, 22, 21, 20] },
  { label: 'Other', color: CAT.other, points: [9, 10, 9, 11, 10, 11, 10, 12, 11, 12, 11, 11] },
];
const LINE_LABELS = ['Jun 2025', 'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025'];

const COUNTY_SEG = [
  { label: 'Maricopa', value: 317, pct: '52%', color: CAT.maricopa },
  { label: 'Pima', value: 142, pct: '23%', color: CAT.pima },
  { label: 'Pinal', value: 68, pct: '11%', color: CAT.pinal },
  { label: 'Yavapai', value: 42, pct: '7%', color: CAT.yavapai },
  { label: 'Other', value: 43, pct: '7%', color: CAT.other },
];

const SAVED = [
  { name: 'Maricopa County, Next 60 Days', matches: 317 },
  { name: 'High Score (70+), Next 90 Days', matches: 289 },
  { name: 'Pima County, Next 30 Days', matches: 142 },
];
const ALERTS = [
  { title: 'New matches for Maricopa County, Next 60 Days', meta: '23 new matches', time: '2m ago', color: CAT.maricopa },
  { title: 'High Score (70+), Next 90 Days', meta: '15 new matches', time: '1h ago', color: CAT.pinal },
];
const PROMPTS = [
  'Show me high score releases in the next 60 days',
  'Which facilities have the most releases next month?',
  'Compare Pima vs Maricopa next quarter',
];

function Overview() {
  const [nav, setNav] = poOUseState('dashboard');
  return (
    <div style={poOv.root}>
      {/* ---- top bar ---- */}
      <header style={poOv.topbar}>
        <div className="ov-brandcell" style={poOv.brandCell}>
          <Wordmark />
          <button style={poOv.collapseBtn}><Icon name="chevronsRight" size={17} stroke="var(--po-text-3)" /></button>
        </div>
        <div className="ov-search" style={poOv.searchWrap}>
          <Icon name="search" size={17} stroke="var(--po-text-3)" />
          <input placeholder="Search people, counties, facilities…" style={poOv.searchInput} />
          <span style={poOv.kbd}>⌘ K</span>
        </div>
        <div style={poOv.topActions}>
          <button style={poOv.iconBtn}><Icon name="bell" size={19} stroke="var(--po-text-2)" /><span style={poOv.bellBadge}>3</span></button>
          <button style={poOv.iconBtn}><Icon name="helpCircle" size={19} stroke="var(--po-text-2)" /></button>
          <button style={poOv.userChip}>
            <span style={poOv.avatar}>SJ</span>
            <span className="ov-userlabel" style={{ textAlign: 'left', lineHeight: 1.25 }}>
              <span style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: 'var(--po-text)' }}>Sanctuary Recovery</span>
              <span style={{ display: 'block', fontSize: 12, color: 'var(--po-text-3)' }}>Sarah Johnson</span>
            </span>
            <Icon name="chevronDown" size={15} stroke="var(--po-text-3)" />
          </button>
        </div>
      </header>

      <div style={poOv.body}>
        {/* ---- left rail ---- */}
        <aside className="ov-left" style={poOv.leftRail}>
          <div style={poOv.railScroll}>
            <div style={poOv.planCard}>
              <div style={poOv.planLabel}>Current Plan</div>
              <div style={poOv.planName}>Professional</div>
              <div style={{ ...poOv.planLabel, marginTop: 12 }}>Record Views</div>
              <div style={poOv.planUsage}>12,450 <span style={{ color: 'var(--po-text-3)', fontWeight: 500 }}>/ 25,000</span></div>
              <div style={poOv.planTrack}><div style={{ width: '49.8%', height: '100%', background: 'var(--po-blue)', borderRadius: 3 }}></div></div>
              <div style={poOv.planReset}>Resets Dec 1, 2025</div>
              <button style={poOv.upgradeBtn}>Upgrade Plan</button>
            </div>

            <nav style={poOv.navList}>
              {NAV.map(it => (
                <button key={it.id} onClick={() => setNav(it.id)} className={nav === it.id ? '' : 'po-hov-soft'}
                  style={{ ...poOv.navItem, ...(nav === it.id ? poOv.navItemOn : {}) }}>
                  <Icon name={it.icon} size={18} stroke={nav === it.id ? 'var(--po-blue)' : 'var(--po-text-2)'} />
                  <span style={{ flex: 1, textAlign: 'left' }}>{it.label}</span>
                  {it.badge && <span style={poOv.navBadge}>{it.badge}</span>}
                </button>
              ))}
            </nav>

            <div style={poOv.railSectionLabel}>Integrations</div>
            <div style={poOv.intList}>
              {INTEGRATIONS.map(it => (
                <div key={it.label} style={poOv.intRow}>
                  <span style={{ ...poOv.intIcon, background: it.color }}>
                    {it.icon ? <Icon name="external" size={12} stroke="#fff" /> : it.letter}
                  </span>
                  <span style={{ flex: 1, fontSize: 13.5, color: 'var(--po-text-2)' }}>{it.label}</span>
                  {it.ok ? <span style={poOv.okDot}><Icon name="check" size={11} stroke="#fff" sw={3} /></span>
                         : <Icon name="chevronRight" size={15} stroke="var(--po-text-3)" />}
                </div>
              ))}
            </div>

            <div style={poOv.railDivider}></div>
            <nav style={poOv.navList}>
              {SECONDARY.map(it => (
                <button key={it.id} className="po-hov-soft" style={poOv.navItem}>
                  <Icon name={it.icon} size={18} stroke="var(--po-text-2)" />
                  <span style={{ flex: 1, textAlign: 'left' }}>{it.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <button style={poOv.userFooter}>
            <span style={{ ...poOv.avatar, background: 'var(--po-blue)' }}>SJ</span>
            <span style={{ flex: 1, textAlign: 'left', lineHeight: 1.25, minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--po-text)' }}>Sarah Johnson</span>
              <span style={{ display: 'block', fontSize: 11.5, color: 'var(--po-text-3)', overflow: 'hidden', textOverflow: 'ellipsis' }}>sarah@sanctuary.org</span>
            </span>
            <Icon name="chevronRight" size={15} stroke="var(--po-text-3)" />
          </button>
        </aside>

        {/* ---- center ---- */}
        <main className="ov-center" style={poOv.center}>
          <div className="ov-pagehead" style={poOv.pageHead}>
            <div>
              <h1 className="po-display" style={poOv.h1}>Dashboard</h1>
              <p style={poOv.subtitle}>Real-time insights into upcoming releases and opportunities to help.</p>
            </div>
            <div style={poOv.headActions}>
              <button style={poOv.dateBtn}>May 23 – Nov 23, 2025 <Icon name="chevronDown" size={15} stroke="var(--po-text-3)" /> <Icon name="calendar" size={16} stroke="var(--po-text-2)" /></button>
              <button style={poOv.filterBtn}><Icon name="filter" size={16} stroke="var(--po-text-2)" /> Filters <span style={poOv.filterBadge}>2</span></button>
            </div>
          </div>

          {/* Release Horizon */}
          <section style={poOv.card}>
            <div style={poOv.cardHeadRow}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2 className="po-display" style={poOv.cardTitle}>Release Horizon</h2>
                <span style={poOv.horizonTag}>Next 180 Days <Icon name="helpCircle" size={13} stroke="var(--po-text-3)" /></span>
              </div>
              <div style={{ display: 'flex', gap: 36 }}>
                <Stat value="1,991" label="People Tracked" />
                <Stat value="93%" label="With Release Dates" color={CAT.pinal} />
              </div>
            </div>
            <HorizonBars days={horizonDays} todayIdx={14} />
          </section>

          {/* KPI row */}
          <div className="ov-kpis" style={poOv.kpiRow}>
            {KPIS.map(k => <KpiCard key={k.label} k={k} />)}
          </div>

          {/* insight callout */}
          <div className="ov-callout" style={poOv.callout}>
            <span style={poOv.calloutIcon}><Icon name="sparkles" size={18} stroke="var(--po-blue)" /></span>
            <div style={{ flex: 1 }}>
              <p style={poOv.calloutText}><b style={{ color: 'var(--po-blue)' }}>317 high-propensity individuals</b> are releasing from Maricopa County in the next 60 days.</p>
              <p style={poOv.calloutSub}>That's 18% more opportunities than the previous 60 days.</p>
            </div>
            <button style={poOv.viewMatches}>View Matches</button>
          </div>

          {/* charts row */}
          <div className="ov-charts" style={poOv.chartsRow}>
            <section style={{ ...poOv.card, flex: 1.5 }}>
              <div style={poOv.cardHeadRow}>
                <h2 className="po-display" style={poOv.cardTitle}>Releases Over Time</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <MiniSelect label="Group by" value="County" />
                  <MiniSelect label="Show" value="Release Score" />
                </div>
              </div>
              <div style={poOv.legendRow}>
                {LINE_SERIES.map(s => (
                  <span key={s.label} style={poOv.legendItem}><i style={{ ...poOv.legendDot, background: s.color }}></i>{s.label}</span>
                ))}
              </div>
              <LineChart series={LINE_SERIES} labels={LINE_LABELS} />
            </section>

            <section style={{ ...poOv.card, flex: 1 }}>
              <div style={{ marginBottom: 4 }}>
                <h2 className="po-display" style={poOv.cardTitle}>Releases by County</h2>
                <div style={poOv.cardSubLabel}>Next 60 Days</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 8 }}>
                <Donut segments={COUNTY_SEG} total="612" />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {COUNTY_SEG.map(s => (
                    <div key={s.label} style={poOv.donutLeg}>
                      <i style={{ ...poOv.legendDot, background: s.color }}></i>
                      <span style={{ flex: 1, fontSize: 13, color: 'var(--po-text-2)' }}>{s.label}</span>
                      <span className="po-mono" style={{ fontSize: 13, color: 'var(--po-text)', fontWeight: 500 }}>{s.value}</span>
                      <span style={{ fontSize: 12, color: 'var(--po-text-3)', width: 34, textAlign: 'right' }}>({s.pct})</span>
                    </div>
                  ))}
                </div>
              </div>
              <button style={poOv.fullReport}>View Full Report</button>
            </section>
          </div>

          {/* saved + alerts row */}
          <div className="ov-charts" style={poOv.chartsRow}>
            <section style={{ ...poOv.card, flex: 1 }}>
              <h2 className="po-display" style={{ ...poOv.cardTitle, marginBottom: 14 }}>Saved Searches</h2>
              <div className="ov-saved" style={poOv.savedGrid}>
                {SAVED.map(s => (
                  <div key={s.name} className="po-hov-card po-hov-lift" style={poOv.savedCard}>
                    <div style={poOv.savedTop}><span style={poOv.liveBadge}>LIVE</span></div>
                    <div style={poOv.savedName}>{s.name}</div>
                    <div style={poOv.savedMatches}>{s.matches} matches</div>
                  </div>
                ))}
                <button style={poOv.newSearch}><Icon name="plus" size={18} stroke="var(--po-text-3)" /><span>New Search</span></button>
              </div>
            </section>

            <section style={{ ...poOv.card, flex: 1 }}>
              <div style={poOv.cardHeadRow}>
                <h2 className="po-display" style={poOv.cardTitle}>Recent Alerts</h2>
                <a href="#" style={poOv.link}>View All Alerts</a>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {ALERTS.map((a, i) => (
                  <div key={i} style={{ ...poOv.alertRow, borderTop: i === 0 ? 'none' : '1px solid var(--po-line)' }}>
                    <span style={{ ...poOv.alertIcon, background: a.color }}><Icon name="bell" size={15} stroke="#fff" /></span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--po-text)' }}>{a.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--po-text-3)', marginTop: 2 }}>{a.meta}</div>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--po-text-3)' }}>{a.time}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <footer style={poOv.footer}>
            <span>© 2025 ReentryIQ. All rights reserved.</span>
            <div style={{ display: 'flex', gap: 18 }}>
              <a href="#" style={poOv.footLink}>Privacy Policy</a>
              <a href="#" style={poOv.footLink}>Terms of Service</a>
              <a href="#" style={poOv.footLink}>Acceptable Use</a>
            </div>
            <div style={{ display: 'flex', gap: 10, color: 'var(--po-text-3)', alignItems: 'center' }}>
              <span>Public Data</span><span>·</span><span>Privacy First</span><span>·</span><span>Second Chances</span>
            </div>
          </footer>
        </main>

        {/* ---- right rail: Assistant ---- */}
        <aside className="ov-right" style={poOv.rightRail}>
          <div style={poOv.assistHead}>
            <h2 className="po-display" style={{ fontSize: 16, fontWeight: 600, color: 'var(--po-text)', margin: 0 }}>ReentryIQ Assistant</h2>
            <span style={poOv.betaPill}>BETA</span>
          </div>

          <div style={poOv.qBubble}>How many releases into Maricopa next quarter?</div>

          <div style={poOv.answerCard}>
            <p style={poOv.answerText}>There are <b style={{ color: 'var(--po-text)' }}>317 individuals</b> projected to release into Maricopa County in Q3 2025 (Jul 1 – Sep 30).</p>
            <button style={poOv.answerCta}>View Matches</button>
            <div style={poOv.answerTools}>
              <button style={poOv.toolBtn}><Icon name="copy" size={15} stroke="var(--po-text-3)" /></button>
              <button style={poOv.toolBtn}><Icon name="thumbsUp" size={15} stroke="var(--po-text-3)" /></button>
              <button style={poOv.toolBtn}><Icon name="thumbsDown" size={15} stroke="var(--po-text-3)" /></button>
            </div>
          </div>

          <div style={poOv.promptList}>
            {PROMPTS.map(p => (
              <button key={p} className="po-hov-card" style={poOv.promptChip}>
                <span style={{ flex: 1, textAlign: 'left' }}>{p}</span>
                <Icon name="chevronRight" size={15} stroke="var(--po-blue)" />
              </button>
            ))}
          </div>

          <div style={poOv.assistInput}>
            <input placeholder="Ask anything about your data…" style={poOv.assistInputField} />
            <button style={poOv.assistSend}><Icon name="arrowRight" size={16} stroke="#fff" /></button>
          </div>

          <div style={poOv.attestCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Icon name="checkCircle" size={18} stroke={CAT.pinal} />
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--po-text)' }}>Compliance Attestation</span>
            </div>
            <p style={poOv.attestText}>You have attested that you are using ReentryIQ for outreach purposes only and will not use the data for employment or housing screening.</p>
            <button style={poOv.attestBtn}>View Attestation</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ value, label, color }) {
  return (
    <div style={{ textAlign: 'right' }}>
      <div className="po-display" style={{ fontSize: 24, fontWeight: 700, color: color || 'var(--po-text)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--po-text-3)', marginTop: 4 }}>{label}</div>
    </div>
  );
}

function KpiCard({ k }) {
  return (
    <div className="po-hov-card po-hov-lift" style={poOv.kpi}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={poOv.kpiLabel}>{k.label}</div>
          <div style={poOv.kpiSub}>{k.sub}</div>
        </div>
        <span style={poOv.kpiIcon}><Icon name={k.icon} size={19} stroke="var(--po-blue)" /></span>
      </div>
      <div className="po-display" style={poOv.kpiVal}>{k.value}</div>
      {k.flat
        ? <div style={{ fontSize: 12.5, color: 'var(--po-blue)', fontWeight: 500 }}>{k.flat}</div>
        : <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, fontWeight: 600, color: k.up ? CAT.pinal : 'var(--po-red)' }}>
            <Icon name={k.up ? 'arrowUp' : 'arrowUp'} size={13} stroke={k.up ? CAT.pinal : 'var(--po-red)'} style={{ transform: k.up ? 'none' : 'rotate(180deg)' }} />
            {k.delta}
          </div>}
    </div>
  );
}

function MiniSelect({ label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 12.5, color: 'var(--po-text-3)' }}>{label}</span>
      <button style={poOv.miniSelect}>{value} <Icon name="chevronDown" size={14} stroke="var(--po-text-3)" /></button>
    </div>
  );
}

const poOv = {
  root: { height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--po-bg)', overflow: 'hidden' },
  topbar: { height: 64, flexShrink: 0, display: 'flex', alignItems: 'center', background: 'var(--po-panel)', borderBottom: '1px solid var(--po-line)' },
  brandCell: { width: 232, flexShrink: 0, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', borderRight: '1px solid var(--po-line)' },
  collapseBtn: { width: 28, height: 28, borderRadius: 6, border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  searchWrap: { flex: 1, maxWidth: 440, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 10, height: 40, padding: '0 14px', background: 'var(--po-bg)', border: '1px solid var(--po-line)', borderRadius: 'var(--po-r)' },
  searchInput: { flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 14, color: 'var(--po-text)', fontFamily: 'var(--po-body)' },
  kbd: { fontSize: 11, color: 'var(--po-text-3)', fontFamily: '-apple-system, system-ui, sans-serif', border: '1px solid var(--po-line)', borderRadius: 5, padding: '2px 6px', whiteSpace: 'nowrap' },
  topActions: { display: 'flex', alignItems: 'center', gap: 8, padding: '0 18px' },
  iconBtn: { position: 'relative', width: 38, height: 38, borderRadius: 9, border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  bellBadge: { position: 'absolute', top: 5, right: 5, minWidth: 16, height: 16, padding: '0 4px', borderRadius: 8, background: 'var(--po-red)', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  userChip: { display: 'flex', alignItems: 'center', gap: 10, height: 44, padding: '0 8px 0 6px', borderRadius: 10, border: 'none', background: 'transparent' },
  avatar: { width: 34, height: 34, borderRadius: '50%', background: 'var(--po-copper-wash)', color: 'var(--po-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 },

  body: { flex: 1, display: 'flex', minHeight: 0 },
  leftRail: { width: 232, flexShrink: 0, background: 'var(--po-panel)', borderRight: '1px solid var(--po-line)', display: 'flex', flexDirection: 'column', minHeight: 0 },
  railScroll: { flex: 1, overflowY: 'auto', padding: '16px 14px' },
  planCard: { border: '1px solid var(--po-line)', borderRadius: 'var(--po-r)', padding: '14px 15px', marginBottom: 16 },
  planLabel: { fontSize: 11.5, color: 'var(--po-text-3)', fontWeight: 500 },
  planName: { fontSize: 16, fontWeight: 700, color: 'var(--po-blue)', fontFamily: 'var(--po-display)', marginTop: 2 },
  planUsage: { fontSize: 15, fontWeight: 700, color: 'var(--po-text)', marginTop: 3, fontFamily: 'var(--po-mono)' },
  planTrack: { height: 6, borderRadius: 3, background: 'var(--po-track)', overflow: 'hidden', margin: '8px 0 6px' },
  planReset: { fontSize: 11.5, color: 'var(--po-text-3)' },
  upgradeBtn: { width: '100%', marginTop: 12, height: 34, borderRadius: 'var(--po-r-sm)', border: '1px solid var(--po-line-strong)', background: 'var(--po-panel)', fontSize: 13, fontWeight: 600, color: 'var(--po-text)' },

  navList: { display: 'flex', flexDirection: 'column', gap: 2 },
  navItem: { display: 'flex', alignItems: 'center', gap: 11, height: 38, padding: '0 11px', borderRadius: 'var(--po-r-sm)', border: 'none', background: 'transparent', color: 'var(--po-text-2)', fontSize: 13.5, fontWeight: 500, transition: 'background .14s' },
  navItemOn: { background: 'var(--po-copper-wash)', color: 'var(--po-blue)', fontWeight: 600 },
  navBadge: { minWidth: 19, height: 19, padding: '0 5px', borderRadius: 10, background: 'var(--po-blue)', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  railSectionLabel: { fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--po-text-3)', margin: '20px 11px 10px' },
  intList: { display: 'flex', flexDirection: 'column', gap: 3 },
  intRow: { display: 'flex', alignItems: 'center', gap: 11, height: 34, padding: '0 11px' },
  intIcon: { width: 22, height: 22, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0 },
  okDot: { width: 17, height: 17, borderRadius: '50%', background: CAT.pinal, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  railDivider: { height: 1, background: 'var(--po-line)', margin: '16px 11px' },

  userFooter: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderTop: '1px solid var(--po-line)', border: 'none', borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--po-line)', background: 'transparent' },

  center: { flex: 1, minWidth: 0, overflowY: 'auto', padding: '24px 28px 28px' },
  pageHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 20 },
  h1: { fontSize: 26, fontWeight: 700, color: 'var(--po-text)', margin: 0, letterSpacing: '-0.02em' },
  subtitle: { fontSize: 14, color: 'var(--po-text-2)', margin: '6px 0 0' },
  headActions: { display: 'flex', gap: 10, flexShrink: 0 },
  dateBtn: { display: 'inline-flex', alignItems: 'center', gap: 8, height: 38, padding: '0 14px', borderRadius: 'var(--po-r)', border: '1px solid var(--po-line)', background: 'var(--po-panel)', fontSize: 13, fontWeight: 500, color: 'var(--po-text)' },
  filterBtn: { display: 'inline-flex', alignItems: 'center', gap: 8, height: 38, padding: '0 14px', borderRadius: 'var(--po-r)', border: '1px solid var(--po-line)', background: 'var(--po-panel)', fontSize: 13, fontWeight: 500, color: 'var(--po-text)' },
  filterBadge: { minWidth: 18, height: 18, borderRadius: 9, background: 'var(--po-blue)', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' },

  card: { background: 'var(--po-panel)', border: '1px solid var(--po-line)', borderRadius: 'var(--po-r)', padding: '18px 20px', marginBottom: 18 },
  cardHeadRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, gap: 16 },
  cardTitle: { fontSize: 16, fontWeight: 600, color: 'var(--po-text)', margin: 0 },
  cardSubLabel: { fontSize: 12.5, color: 'var(--po-text-3)', marginTop: 3 },
  horizonTag: { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: 'var(--po-text-3)' },

  kpiRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 18 },
  kpi: { background: 'var(--po-panel)', border: '1px solid var(--po-line)', borderRadius: 'var(--po-r)', padding: '16px 18px' },
  kpiLabel: { fontSize: 13.5, fontWeight: 600, color: 'var(--po-text)' },
  kpiSub: { fontSize: 12, color: 'var(--po-text-3)', marginTop: 2 },
  kpiIcon: { width: 38, height: 38, borderRadius: '50%', background: 'var(--po-copper-wash)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  kpiVal: { fontSize: 32, fontWeight: 700, color: 'var(--po-text)', letterSpacing: '-0.01em', margin: '14px 0 6px', lineHeight: 1 },

  callout: { display: 'flex', alignItems: 'center', gap: 14, background: 'linear-gradient(90deg, var(--po-blue-100), var(--po-panel))', border: '1px solid var(--po-copper-line)', borderRadius: 'var(--po-r)', padding: '16px 18px', marginBottom: 18 },
  calloutIcon: { width: 38, height: 38, borderRadius: 9, background: 'var(--po-panel)', border: '1px solid var(--po-copper-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  calloutText: { margin: 0, fontSize: 14.5, color: 'var(--po-text)', fontWeight: 500 },
  calloutSub: { margin: '3px 0 0', fontSize: 13, color: 'var(--po-text-2)' },
  viewMatches: { flexShrink: 0, height: 38, padding: '0 18px', borderRadius: 'var(--po-r)', border: 'none', background: 'var(--po-blue)', color: '#fff', fontSize: 13.5, fontWeight: 600 },

  chartsRow: { display: 'flex', gap: 18, alignItems: 'stretch' },
  legendRow: { display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 10 },
  legendItem: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--po-text-2)' },
  legendDot: { width: 9, height: 9, borderRadius: '50%', flexShrink: 0 },
  miniSelect: { display: 'inline-flex', alignItems: 'center', gap: 6, height: 30, padding: '0 10px', borderRadius: 'var(--po-r-sm)', border: '1px solid var(--po-line)', background: 'var(--po-panel)', fontSize: 12.5, color: 'var(--po-text)', fontWeight: 500 },
  donutLeg: { display: 'flex', alignItems: 'center', gap: 9 },
  fullReport: { width: '100%', marginTop: 16, height: 36, borderRadius: 'var(--po-r-sm)', border: '1px solid var(--po-line-strong)', background: 'var(--po-panel)', fontSize: 13, fontWeight: 600, color: 'var(--po-text)' },

  savedGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 },
  savedCard: { border: '1px solid var(--po-line)', borderRadius: 'var(--po-r)', padding: '13px 14px', textAlign: 'left' },
  savedTop: { marginBottom: 8 },
  liveBadge: { fontSize: 9.5, fontWeight: 700, letterSpacing: '0.06em', color: CAT.pinal, background: 'var(--po-sage-wash)', padding: '2px 7px', borderRadius: 4 },
  savedName: { fontSize: 13.5, fontWeight: 600, color: 'var(--po-text)', lineHeight: 1.35, minHeight: 36 },
  savedMatches: { fontSize: 12.5, color: 'var(--po-text-3)', marginTop: 6 },
  newSearch: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, border: '1px dashed var(--po-line-strong)', borderRadius: 'var(--po-r)', background: 'transparent', color: 'var(--po-text-3)', fontSize: 13, fontWeight: 500, minHeight: 92 },

  alertRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0' },
  alertIcon: { width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  link: { fontSize: 13, fontWeight: 600, color: 'var(--po-blue)', textDecoration: 'none' },

  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginTop: 4, paddingTop: 18, fontSize: 12, color: 'var(--po-text-3)' },
  footLink: { color: 'var(--po-text-2)', textDecoration: 'none', fontSize: 12 },

  rightRail: { width: 332, flexShrink: 0, background: 'var(--po-panel)', borderLeft: '1px solid var(--po-line)', overflowY: 'auto', padding: '18px 18px 24px', display: 'flex', flexDirection: 'column' },
  assistHead: { display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16 },
  betaPill: { fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--po-blue)', background: 'var(--po-copper-wash)', padding: '3px 7px', borderRadius: 5 },
  qBubble: { alignSelf: 'flex-end', maxWidth: '85%', background: 'var(--po-blue-100)', color: 'var(--po-text)', fontSize: 13.5, lineHeight: 1.4, padding: '10px 13px', borderRadius: '12px 12px 4px 12px', marginBottom: 14 },
  answerCard: { border: '1px solid var(--po-line)', borderRadius: 'var(--po-r)', padding: '14px 15px', marginBottom: 18 },
  answerText: { margin: '0 0 12px', fontSize: 13.5, lineHeight: 1.5, color: 'var(--po-text-2)' },
  answerCta: { width: '100%', height: 36, borderRadius: 'var(--po-r-sm)', border: '1px solid var(--po-copper-line)', background: 'var(--po-copper-wash)', color: 'var(--po-blue)', fontSize: 13, fontWeight: 600 },
  answerTools: { display: 'flex', gap: 4, marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--po-line)' },
  toolBtn: { width: 30, height: 30, borderRadius: 7, border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  promptList: { display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 16 },
  promptChip: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 13px', borderRadius: 'var(--po-r)', border: '1px solid var(--po-line)', background: 'var(--po-panel)', fontSize: 13, color: 'var(--po-blue)', fontWeight: 500, lineHeight: 1.35 },
  assistInput: { display: 'flex', gap: 8, marginBottom: 22 },
  assistInputField: { flex: 1, minWidth: 0, height: 42, padding: '0 14px', borderRadius: 'var(--po-r)', border: '1px solid var(--po-line)', background: 'var(--po-bg)', fontSize: 13.5, color: 'var(--po-text)', fontFamily: 'var(--po-body)', outline: 'none' },
  assistSend: { width: 42, height: 42, borderRadius: '50%', border: 'none', background: 'var(--po-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  attestCard: { marginTop: 'auto', border: '1px solid var(--po-line)', borderRadius: 'var(--po-r)', padding: '15px 16px', background: 'var(--po-bg)' },
  attestText: { fontSize: 12.5, lineHeight: 1.55, color: 'var(--po-text-2)', margin: '0 0 12px' },
  attestBtn: { width: '100%', height: 36, borderRadius: 'var(--po-r-sm)', border: '1px solid var(--po-line-strong)', background: 'var(--po-panel)', fontSize: 13, fontWeight: 600, color: 'var(--po-text)' },
};

ReactDOM.createRoot(document.getElementById('root')).render(<Overview />);
