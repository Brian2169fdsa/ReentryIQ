// po-app.jsx — composition, state, plan logic, tweaks. ReentryIQ (navy/blue, Vera brand).
const { useState: poUseState, useMemo: poUseMemo, useEffect: poUseEffect } = React;

const PLANS = {
  starter:    { label: 'Starter',    included: 100,  base: 78,   features: [] },
  pro:        { label: 'Pro',        included: 500,  base: 312,  features: ['export', 'alerts'] },
  enterprise: { label: 'Enterprise', included: 2500, base: 1840, features: ['export', 'alerts', 'ai', 'connectors', 'api'] },
};

// Emphasis accent — on-brand blue family, tuned legible on white. fg = text on a blue fill.
const ACCENTS = {
  blue:  { copper: '#4A90E2', bright: '#2E6CB8', dim: '#2E6CB8', wash: 'rgba(74,144,226,0.10)', line: 'rgba(74,144,226,0.28)', fg: '#FFFFFF' },
  azure: { copper: '#3B82F6', bright: '#1D4ED8', dim: '#2563EB', wash: 'rgba(59,130,246,0.10)', line: 'rgba(59,130,246,0.28)', fg: '#FFFFFF' },
  cyan:  { copper: '#0EA5E9', bright: '#0369A1', dim: '#0369A1', wash: 'rgba(14,165,233,0.10)', line: 'rgba(14,165,233,0.28)', fg: '#FFFFFF' },
  deep:  { copper: '#2E6CB8', bright: '#1B4178', dim: '#1B4178', wash: 'rgba(46,108,184,0.10)', line: 'rgba(46,108,184,0.30)', fg: '#FFFFFF' },
};

// Page background tone (content surface).
const SURFACES = {
  mist:  { bg: '#F7F9FC' },
  white: { bg: '#FFFFFF' },
  cool:  { bg: '#F1F5FB' },
};

const SAVED_SEARCHES = [
  { id: 's1', name: 'Maricopa · next 30 days', alert: true,  matches: 0, filters: { counties: ['Maricopa'], range: { start: 0, end: 29, label: 'Next 30 days' } } },
  { id: 's2', name: 'High match (75+) statewide', alert: true,  matches: 0, filters: { counties: [], minScore: 75 } },
  { id: 's3', name: 'Pima · ASPC-Tucson',         alert: false, matches: 0, filters: { counties: ['Pima'], facility: 'ASPC-Tucson' } },
];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "plan": "enterprise",
  "accent": "blue",
  "density": "regular",
  "window": 180,
  "surface": "mist"
}/*EDITMODE-END*/;

const DEFAULT_FILTERS = { q: '', counties: ['Maricopa'], facility: '', offenseClass: '', minScore: 0, range: null };
const VIEW_KEY = 'reentryiq.viewMode';

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [nav, setNav] = poUseState('dashboard');
  const [filters, setFilters] = poUseState(DEFAULT_FILTERS);
  const [sort, setSort] = poUseState({ key: 'date', dir: 'asc' });
  const [openRecord, setOpenRecord] = poUseState(null);
  const [aiOpen, setAiOpen] = poUseState(false);
  const [revealed, setRevealed] = poUseState(() => new Set());
  const [revealCount, setRevealCount] = poUseState(0);
  // View mode persists per user (Visual is always the default for new users).
  const [viewMode, setViewMode] = poUseState(() => {
    try { return localStorage.getItem(VIEW_KEY) || 'visual'; } catch (e) { return 'visual'; }
  });
  poUseEffect(() => { try { localStorage.setItem(VIEW_KEY, viewMode); } catch (e) {} }, [viewMode]);

  // Dismiss the boot splash once mounted (reliable; the inline script is not).
  poUseEffect(() => {
    const b = document.getElementById('po-boot');
    if (b) { b.classList.add('hide'); setTimeout(() => b.remove(), 350); }
  }, []);

  const plan = PLANS[t.plan] || PLANS.enterprise;
  const aiEnabled = plan.features.includes('ai');
  const exportEnabled = plan.features.includes('export');
  const usedRecords = plan.base + revealCount;

  const accent = ACCENTS[t.accent] || ACCENTS.blue;
  const surf = SURFACES[t.surface] || SURFACES.navy;

  // ----- filtering -----
  const matchExceptCounty = (r) => {
    if (filters.facility && r.facility !== filters.facility) return false;
    if (filters.offenseClass && r.offenseClass !== filters.offenseClass) return false;
    if (filters.minScore && r.score < filters.minScore) return false;
    if (filters.range && (r.releaseDayIdx < filters.range.start || r.releaseDayIdx > filters.range.end)) return false;
    if (filters.q) {
      const q = filters.q.toLowerCase();
      if (!(r.name.toLowerCase().includes(q) || r.docNumber.includes(q) || r.id.toLowerCase().includes(q))) return false;
    }
    return true;
  };
  const inCounty = (r) => filters.counties.length === 0 || filters.counties.includes(r.county);

  const countyRows = poUseMemo(() => PO_DATA.records.filter(matchExceptCounty), [filters.facility, filters.offenseClass, filters.minScore, filters.range, filters.q]);
  const tableRows = poUseMemo(() => countyRows.filter(inCounty), [countyRows, filters.counties]);

  const countsByCounty = poUseMemo(() => {
    const m = {}; countyRows.forEach(r => { m[r.county] = (m[r.county] || 0) + 1; }); return m;
  }, [countyRows]);

  const scopeLabel = filters.counties.length === 0 ? 'All counties'
    : filters.counties.length === 1 ? filters.counties[0]
    : `${filters.counties.length} counties`;

  const horizonDays = poUseMemo(() => {
    const total = new Array(PO_DATA.HORIZON_DAYS).fill(0);
    const scoped = new Array(PO_DATA.HORIZON_DAYS).fill(0);
    PO_DATA.records.forEach(r => { total[r.releaseDayIdx] += 1; if (inCounty(r)) scoped[r.releaseDayIdx] += 1; });
    return PO_DATA.dailyCounts.map((d, i) => ({ dayIdx: i, date: d.date, total: total[i], scoped: scoped[i] }));
  }, [filters.counties]);

  const scopedRecords = poUseMemo(() => PO_DATA.records.filter(inCounty), [filters.counties]);

  const savedWithCounts = SAVED_SEARCHES.map(s => {
    const cs = s.filters.counties || [];
    const matches = PO_DATA.records.filter(r => {
      if (cs.length && !cs.includes(r.county)) return false;
      if (s.filters.facility && r.facility !== s.filters.facility) return false;
      if (s.filters.minScore && r.score < s.filters.minScore) return false;
      if (s.filters.range && (r.releaseDayIdx < s.filters.range.start || r.releaseDayIdx > s.filters.range.end)) return false;
      return true;
    }).length;
    return { ...s, matches };
  });

  function reveal(record) {
    if (!revealed.has(record.id)) { setRevealed(prev => new Set(prev).add(record.id)); setRevealCount(c => c + 1); }
  }
  function runSaved(s) { setFilters({ ...DEFAULT_FILTERS, ...s.filters, counties: s.filters.counties || [] }); setNav('dashboard'); }
  function openRec(r) { setAiOpen(false); setOpenRecord(r); }
  function openAI() { setOpenRecord(null); setAiOpen(true); }

  const rootVars = {
    '--po-copper': accent.copper, '--po-copper-bright': accent.bright, '--po-copper-dim': accent.dim,
    '--po-copper-wash': accent.wash, '--po-copper-line': accent.line, '--po-accent-fg': accent.fg,
    '--po-bg': surf.bg,
    background: surf.bg, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
  };

  return (
    <div style={rootVars}>
      <TopBar nav={nav} setNav={setNav} usedRecords={usedRecords} includedRecords={plan.included}
        planLabel={plan.label} onAskAI={openAI} aiEnabled={aiEnabled} />

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <FilterRail filters={filters} setFilters={setFilters} counts={{ byCounty: countsByCounty }}
          facilities={PO_DATA.FACILITIES} savedSearches={savedWithCounts} onRunSaved={runSaved} />

        {nav === 'dashboard' ? (
          <main style={poApp.main} key={'dash' + t.window}>
            <div style={poApp.breadcrumb}>
              <span style={{ color: 'var(--po-text-2)' }}>Sanctuary Recovery</span>
              <Icon name="chevronRight" size={14} stroke="var(--po-text-3)" />
              <span style={{ color: 'var(--po-text)', fontWeight: 600 }}>Release Dashboard</span>
              <span style={poApp.planChip}>{plan.label}</span>
              <span style={poApp.sampleChip}>SAMPLE DATA</span>
            </div>

            <ReleaseHorizon days={horizonDays} windowDays={t.window} scopeLabel={scopeLabel}
              selectedRange={filters.range} onSelectRange={(r) => setFilters({ ...filters, range: r })}
              animateKey={t.accent + t.surface + scopeLabel} />

            <DataArea mode={viewMode} setMode={setViewMode} rows={tableRows} countyRows={countyRows}
              scopedRecords={scopedRecords} revealed={revealed} onOpen={openRec} density={t.density}
              scopeLabel={scopeLabel} windowDays={t.window} selectedRange={filters.range}
              sort={sort} setSort={setSort} exportEnabled={exportEnabled}
              usedRecords={usedRecords} includedRecords={plan.included}
              onExport={() => exportEnabled && alert('CSV export — Pro+ feature (demo)')} />

            <div style={poApp.footer}>
              <Wordmark size={13} />
              <span style={{ color: 'var(--po-text-3)' }}>·</span>
              <span>Data sourced from ADCRR public records · Outreach &amp; admissions use only · Not for FCRA-covered screening</span>
            </div>
          </main>
        ) : (
          <ViewStub nav={nav} />
        )}
      </div>

      <RecordDrawer record={openRecord} onClose={() => setOpenRecord(null)} revealed={revealed} onReveal={reveal} aiEnabled={aiEnabled} />
      <AIAssistant open={aiOpen} onClose={() => setAiOpen(false)} enabled={aiEnabled} onUpgrade={() => setTweak('plan', 'enterprise')} />

      <TweaksPanel>
        <TweakSection label="Plan & Entitlements" />
        <TweakRadio label="Plan" value={t.plan} options={['starter', 'pro', 'enterprise']} onChange={v => setTweak('plan', v)} />
        <TweakSection label="Brand" />
        <TweakColor label="Accent" value={accent.copper}
          options={[ACCENTS.blue.copper, ACCENTS.azure.copper, ACCENTS.cyan.copper, ACCENTS.deep.copper]}
          onChange={(hex) => { const k = Object.keys(ACCENTS).find(k => ACCENTS[k].copper === hex) || 'blue'; setTweak('accent', k); }} />
        <TweakSelect label="Surface" value={t.surface} options={['mist', 'white', 'cool']} onChange={v => setTweak('surface', v)} />
        <TweakSection label="Layout" />
        <TweakRadio label="Density" value={t.density} options={['compact', 'regular', 'comfy']} onChange={v => setTweak('density', v)} />
        <TweakRadio label="Horizon window" value={t.window} options={[90, 180]} onChange={v => setTweak('window', v)} />
      </TweaksPanel>
    </div>
  );
}

function ViewStub({ nav }) {
  const map = {
    saved: { icon: 'bookmark', title: 'Saved Searches & Alerts', body: 'Manage saved searches, channel config (email / webhook) and live match previews.' },
    connectors: { icon: 'plug', title: 'Connectors', body: 'Salesforce, KIPU, Sunwave, Webhook and REST API — field mapping, test sync and live status.' },
    settings: { icon: 'settings', title: 'Settings & Billing', body: 'Plan, usage meter, seats, Stripe portal, attestation record and audit log.' },
  };
  const v = map[nav] || map.settings;
  return (
    <main style={{ ...poApp.main, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: 380 }}>
        <div style={poApp.stubIcon}><Icon name={v.icon} size={26} stroke="var(--po-copper)" /></div>
        <h2 className="po-display" style={{ fontSize: 22, color: 'var(--po-text)', margin: '0 0 8px' }}>{v.title}</h2>
        <p style={{ fontSize: 14, color: 'var(--po-text-2)', lineHeight: 1.6, margin: 0 }}>{v.body}</p>
        <div style={{ marginTop: 18, fontSize: 12, color: 'var(--po-text-3)', fontFamily: 'var(--po-mono)' }}>Not built in this prototype pass</div>
      </div>
    </main>
  );
}

const poApp = {
  main: { flex: 1, minWidth: 0, overflowY: 'auto', padding: '22px 28px 28px', display: 'flex', flexDirection: 'column', gap: 18 },
  breadcrumb: { display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 },
  planChip: { fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--po-copper-bright)',
    background: 'var(--po-copper-wash)', border: '1px solid var(--po-copper-line)', padding: '2px 8px', borderRadius: 5 },
  sampleChip: { fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--po-text-3)', border: '1px dashed var(--po-line-strong)', padding: '2px 8px', borderRadius: 5, marginLeft: 'auto' },
  footer: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', fontSize: 11.5, color: 'var(--po-text-3)', paddingTop: 6 },
  stubIcon: { width: 64, height: 64, borderRadius: 16, background: 'var(--po-copper-wash)', border: '1px solid var(--po-copper-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' },
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
