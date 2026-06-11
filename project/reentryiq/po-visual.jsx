// po-visual.jsx — the default "Visual" data-visibility pattern (ManageAI/LAC style):
// spec KPI row, view-switch pills, graduated-blue horizontal bar chart,
// auto-generated insight callout, and record cards. Plus the View toggle
// (Visual / Table / Compact) that switches the whole data area.

const { useState: poVUseState, useMemo: poVUseMemo } = React;

function poBlueRamp() {
  const cs = getComputedStyle(document.documentElement);
  const r = [1, 2, 3, 4, 5].map(i => (cs.getPropertyValue('--po-ramp-' + i) || '').trim());
  return r.every(Boolean) ? r : ['#1E3A5F', '#2D6FBF', '#4A90E2', '#6BA7EC', '#93C0F2'];
}
function scoreTier(s) { return s >= 80 ? 'Strong' : s >= 60 ? 'Moderate' : 'Watch'; }

// ---------- KPI row (spec §4: Total in scope · Next 30d · Top score · Usage) ----------
function VisualKpis({ scopedRecords, revealed, scopeLabel, usedRecords, includedRecords }) {
  const total = scopedRecords.length;
  const next30 = scopedRecords.filter(r => PO_DATA.daysUntil(r.releaseDate) <= 30).length;
  const top = poVUseMemo(() => scopedRecords.reduce((a, b) => (b.score > (a?.score ?? -1) ? b : a), null), [scopedRecords]);
  const topName = top ? (revealed.has(top.id) ? top.name : top.first[0] + '. ' + top.last + '••') : '—';

  return (
    <div style={poViz.kpiRow}>
      <KpiCard label="Total in Scope" value={total.toLocaleString()} sub={`across ${scopeLabel}`} icon="layers" />
      <KpiCard label="Next 30 Days" value={next30.toLocaleString()} sub="releasing soon — priority" accent icon="clock" />
      <KpiCard label="Top Match Score" value={top ? top.score : '—'} sub={topName} accent icon="trendUp" />
      <UsageKpi used={usedRecords} included={includedRecords} />
    </div>
  );
}

function KpiCard({ label, value, sub, accent, icon }) {
  return (
    <div className="po-hov-lift" style={poViz.kpi}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span className="po-label">{label}</span>
        <span style={{ ...poViz.kpiIcon, ...(accent ? poViz.kpiIconHot : {}) }}>
          <Icon name={icon} size={15} stroke={accent ? 'var(--po-copper-bright)' : 'var(--po-text-3)'} />
        </span>
      </div>
      <div className="po-display" style={{ ...poViz.kpiVal, color: accent ? 'var(--po-copper-bright)' : 'var(--po-text)' }}>
        {value}
      </div>
      <div style={poViz.kpiSub}>{sub}</div>
    </div>
  );
}

// Usage KPI — records used vs plan; bar turns warn at 80%, danger at 100% (spec §4).
function UsageKpi({ used, included }) {
  const pct = Math.min(100, Math.round((used / included) * 100));
  const over = used > included ? used - included : 0;
  const state = pct >= 100 ? 'danger' : pct >= 80 ? 'warn' : 'ok';
  const fill = state === 'danger' ? 'var(--po-red)' : state === 'warn' ? 'var(--po-amber)' : 'var(--po-copper)';
  const tint = state === 'danger' ? 'var(--po-red-wash)' : state === 'warn' ? 'var(--po-amber-wash)' : 'var(--po-copper-wash)';
  const lineC = state === 'danger' ? 'var(--po-red)' : state === 'warn' ? 'var(--po-amber)' : 'var(--po-copper-line)';
  return (
    <div className="po-hov-lift" style={poViz.kpi}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span className="po-label">Usage</span>
        <span style={{ ...poViz.kpiIcon, background: tint, border: '1px solid ' + lineC }}>
          <Icon name="gauge" size={15} stroke={fill} />
        </span>
      </div>
      <div className="po-display" style={{ ...poViz.kpiVal, marginBottom: 8 }}>
        {used.toLocaleString()}<span style={{ fontSize: 15, color: 'var(--po-text-3)', fontWeight: 500 }}> / {included.toLocaleString()}</span>
      </div>
      <div style={poViz.usageTrack}><div style={{ height: '100%', width: pct + '%', background: fill, borderRadius: 3, transition: 'width .4s ease' }}></div></div>
      <div style={{ ...poViz.kpiSub, marginTop: 7, color: state === 'ok' ? 'var(--po-text-3)' : fill }}>
        {state === 'danger' ? `Over by ${over} · billed at overage` : state === 'warn' ? `${pct}% of plan used` : 'record views this period'}
      </div>
    </div>
  );
}

// ---------- chart metrics ----------
const VIEW_METRICS = [
  { id: 'soon',   label: 'Next 30 days' },
  { id: 'county', label: 'By county' },
  { id: 'score',  label: 'By match score' },
];

function buildChart(metric, rows, countyRows, scopeLabel, windowDays) {
  if (metric === 'county') {
    const m = {};
    countyRows.forEach(r => { m[r.county] = (m[r.county] || 0) + 1; });
    const arr = Object.entries(m).map(([k, v]) => ({ key: k, label: k, value: v })).sort((a, b) => b.value - a.value).slice(0, 8);
    const totalAll = countyRows.length || 1;
    const top = arr[0];
    return {
      bars: arr, unit: 'releases',
      insight: top ? <>{<b>{top.label}</b>} leads with <b>{top.value.toLocaleString()}</b> releases over the next {windowDays} days — <b>{Math.round((top.value / totalAll) * 100)}%</b> of statewide volume.</> : 'No releases in range.',
    };
  }
  if (metric === 'soon') {
    const soon = rows.filter(r => PO_DATA.daysUntil(r.releaseDate) <= 30).sort((a, b) => a.releaseDayIdx - b.releaseDayIdx).slice(0, 8);
    const top = soon[0];
    return {
      bars: soon.map(r => ({ key: r.id, label: r.last + ', ' + r.first[0] + '.', full: r.name, value: r.score, meta: PO_DATA.daysUntil(r.releaseDate) + 'd · ' + r.county, record: r })),
      unit: 'match score',
      insight: top ? <><b>{top.first[0]}. {top.last}</b> releases in <b>{PO_DATA.daysUntil(top.releaseDate)} days</b> into {top.county} — the soonest of <b>{rows.filter(r => PO_DATA.daysUntil(r.releaseDate) <= 30).length}</b> releases in the next 30 days.</> : 'No releases within 30 days in this scope.',
    };
  }
  // score
  const topScored = [...rows].sort((a, b) => b.score - a.score).slice(0, 8);
  const strong = rows.filter(r => r.score >= 80).length;
  const top = topScored[0];
  return {
    bars: topScored.map(r => ({ key: r.id, label: r.last + ', ' + r.first[0] + '.', full: r.name, value: r.score, meta: 'Score ' + r.score + ' · ' + r.county, record: r })),
    unit: 'match score',
    insight: top ? <><b>{top.first[0]}. {top.last}</b> is your strongest match at score <b>{top.score}</b> — <b>{strong.toLocaleString()}</b> records score 80+ in {scopeLabel}.</> : 'No scored records in this scope.',
  };
}

// ---------- bar chart (spec §3) ----------
function BlueBarChart({ chart, metric, onOpen }) {
  const ramp = poVUseMemo(() => poBlueRamp(), []);
  const max = Math.max(1, ...chart.bars.map(b => b.value));
  return (
    <div style={poViz.chart} key={metric}>
      {chart.bars.length === 0 && <div style={poViz.chartEmpty}>No data for this view in the current scope.</div>}
      {chart.bars.map((b, i) => {
        // graduated ramp by rank (darkest at bottom of list, brightest at top)
        const shade = ramp[Math.max(0, Math.min(4, 4 - Math.round((i / Math.max(1, chart.bars.length - 1)) * 4)))];
        return (
          <button key={b.key} className="po-hov-soft" style={poViz.barRow}
            onClick={() => b.record && onOpen(b.record)} title={b.full || b.label}>
            <span style={poViz.barLabel}>{b.label}</span>
            <div style={poViz.barTrack}>
              <div style={{ ...poViz.barFill, width: (b.value / max) * 100 + '%', background: shade }}></div>
            </div>
            <span className="po-mono" style={poViz.barVal}>{b.value.toLocaleString()}</span>
          </button>
        );
      })}
      <div style={poViz.axis}>{chart.unit}</div>
    </div>
  );
}

// ---------- insight callout (spec §4) ----------
function InsightCallout({ children }) {
  return (
    <div style={poViz.callout}>
      <Icon name="trendUp" size={17} stroke="var(--po-copper-bright)" style={{ flexShrink: 0, marginTop: 1 }} />
      <p style={poViz.calloutText}>{children}</p>
    </div>
  );
}

// ---------- record cards (spec §5) ----------
function RecordCards({ rows, revealed, onOpen, limit = 8 }) {
  const cards = rows.slice(0, limit);
  return (
    <div style={poViz.cardGrid}>
      {cards.map(r => {
        const rev = revealed.has(r.id);
        const days = PO_DATA.daysUntil(r.releaseDate);
        const tier = scoreTier(r.score);
        return (
          <button key={r.id} className="po-hov-lift" style={poViz.card} onClick={() => onOpen(r)}>
            <div style={poViz.cardTop}>
              <span style={poViz.scoreBadge}>Score {r.score} · {tier}</span>
              {days <= 30 && <span style={poViz.soonChip}><Icon name="clock" size={11} stroke="var(--po-copper-bright)" /> {days}d</span>}
            </div>
            <div style={poViz.cardName}>{rev ? r.name : r.first[0] + '. ' + r.last + '••••'}</div>
            <div style={poViz.cardMeta}>{r.facility} · {r.county} · <span className="po-mono">DOC #{rev ? r.docNumber : '••••'}</span></div>
            <div style={poViz.cardMetricRow}>
              <div>
                <div className="po-display" style={poViz.cardMetric}>{r.score}</div>
                <div style={poViz.cardMetricLabel}>match score</div>
              </div>
              <div style={poViz.cardSecondary}>
                <div><span className="po-mono" style={{ color: 'var(--po-text)' }}>{days}d</span> to release</div>
                <div style={{ marginTop: 3 }}>{r.offenseClass} · {r.custody}</div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ---------- data area shell + View toggle (spec §6) ----------
const VIEW_MODES = [
  { id: 'visual', label: 'Visual', icon: 'trendUp' },
  { id: 'table', label: 'Table', icon: 'list' },
  { id: 'compact', label: 'Compact cards', icon: 'layers' },
];

function DataArea({ mode, setMode, rows, countyRows, scopedRecords, revealed, onOpen, density, scopeLabel,
                    windowDays, selectedRange, sort, setSort, onExport, exportEnabled, usedRecords, includedRecords }) {
  const [metric, setMetric] = poVUseState('county');
  const chart = poVUseMemo(() => buildChart(metric, rows, countyRows, scopeLabel, windowDays),
    [metric, rows, countyRows, scopeLabel, windowDays]);

  return (
    <div>
      <VisualKpis scopedRecords={scopedRecords} revealed={revealed} scopeLabel={scopeLabel}
        usedRecords={usedRecords} includedRecords={includedRecords} />

      <div style={poViz.areaHead}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span className="po-display" style={{ fontSize: 16, fontWeight: 600, color: 'var(--po-text)' }}>Records</span>
          <span className="po-mono" style={{ fontSize: 13, color: 'var(--po-text-3)' }}>
            {rows.length.toLocaleString()} {selectedRange ? `in ${selectedRange.label}` : 'matching'}
          </span>
        </div>
        <div style={poViz.viewToggle}>
          {VIEW_MODES.map(m => {
            const on = mode === m.id;
            return (
              <button key={m.id} onClick={() => setMode(m.id)} className={on ? '' : 'po-hov-ghost'}
                style={{ ...poViz.viewBtn, ...(on ? poViz.viewBtnOn : {}) }}>
                <Icon name={m.icon} size={14} /> {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {mode === 'visual' && (
        <div>
          <div style={poViz.pills}>
            {VIEW_METRICS.map(vm => {
              const on = metric === vm.id;
              return (
                <button key={vm.id} onClick={() => setMetric(vm.id)} className={on ? '' : 'po-hov-chip'}
                  style={{ ...poViz.pill, ...(on ? poViz.pillOn : {}) }}>{vm.label}</button>
              );
            })}
          </div>
          <BlueBarChart chart={chart} metric={metric} onOpen={onOpen} />
          <InsightCallout>{chart.insight}</InsightCallout>
          <div style={{ marginTop: 18 }}>
            <div className="po-label" style={{ marginBottom: 12 }}>Top Records in Scope</div>
            <RecordCards rows={[...rows].sort((a, b) => b.score - a.score)} revealed={revealed} onOpen={onOpen} limit={8} />
          </div>
        </div>
      )}

      {mode === 'table' && (
        <div>
          <ReleasesTable rows={rows} density={density} onOpen={onOpen} revealed={revealed}
            selectedRange={selectedRange} sort={sort} setSort={setSort} onExport={onExport} exportEnabled={exportEnabled} embedded />
        </div>
      )}

      {mode === 'compact' && (
        <div>
          <RecordCards rows={[...rows].sort((a, b) => b.score - a.score)} revealed={revealed} onOpen={onOpen} limit={24} />
        </div>
      )}
    </div>
  );
}

const poViz = {
  kpiRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 },
  kpi: { background: 'var(--po-panel)', border: '1px solid var(--po-line)', borderRadius: 'var(--po-r)', padding: '16px 18px' },
  kpiIcon: { width: 30, height: 30, borderRadius: 8, background: 'var(--po-panel-2)', border: '1px solid var(--po-line)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  kpiIconHot: { background: 'var(--po-copper-wash)', border: '1px solid var(--po-copper-line)' },
  kpiVal: { fontSize: 30, fontWeight: 700, lineHeight: 1.1, margin: '14px 0 4px', letterSpacing: '-0.01em', fontFamily: 'var(--po-display)' },
  kpiSub: { fontSize: 12, color: 'var(--po-text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  usageTrack: { height: 6, borderRadius: 3, background: 'var(--po-track)', overflow: 'hidden' },

  areaHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  viewToggle: { display: 'flex', gap: 4, padding: 4, background: 'var(--po-panel)', border: '1px solid var(--po-line)', borderRadius: 'var(--po-r)' },
  viewBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, height: 30, padding: '0 11px', borderRadius: 'var(--po-r-sm)',
    border: 'none', background: 'transparent', color: 'var(--po-text-3)', fontSize: 12.5, fontWeight: 500, transition: 'background .15s, color .15s' },
  viewBtnOn: { background: 'var(--po-copper)', color: 'var(--po-accent-fg)', fontWeight: 600 },

  pills: { display: 'flex', gap: 8, marginBottom: 16 },
  pill: { height: 34, padding: '0 16px', borderRadius: 'var(--po-r-sm)', border: '1px solid var(--po-line)', background: 'var(--po-panel)',
    color: 'var(--po-text-2)', fontSize: 13, fontWeight: 500, transition: 'all .15s' },
  pillOn: { background: 'var(--po-copper)', border: '1px solid var(--po-copper)', color: 'var(--po-accent-fg)', fontWeight: 600 },

  chart: { background: 'var(--po-panel)', border: '1px solid var(--po-line)', borderRadius: 'var(--po-r)', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 9 },
  chartEmpty: { padding: '24px', textAlign: 'center', color: 'var(--po-text-3)', fontSize: 13 },
  barRow: { display: 'flex', alignItems: 'center', gap: 12, border: 'none', background: 'transparent', padding: '4px 6px', borderRadius: 'var(--po-r-sm)', width: '100%' },
  barLabel: { width: 122, flexShrink: 0, textAlign: 'left', fontSize: 12.5, color: 'var(--po-text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  barTrack: { flex: 1, height: 22, background: 'var(--po-track)', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4, transformOrigin: 'left center', transition: 'width .45s cubic-bezier(.22,.61,.36,1)' },
  barVal: { width: 44, textAlign: 'right', fontSize: 13, color: 'var(--po-text)', fontWeight: 500 },
  axis: { fontSize: 10.5, color: 'var(--po-text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right', marginTop: 2 },

  callout: { display: 'flex', gap: 11, alignItems: 'flex-start', marginTop: 16, padding: '14px 18px',
    background: 'var(--po-copper-wash)', borderLeft: '3px solid var(--po-blue)', borderRadius: '0 var(--po-r) var(--po-r) 0' },
  calloutText: { margin: 0, fontSize: 14.5, lineHeight: 1.5, color: 'var(--po-text)', fontWeight: 400 },

  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(252px, 1fr))', gap: 12 },
  card: { textAlign: 'left', background: 'var(--po-panel)', border: '1px solid var(--po-line)', borderRadius: 'var(--po-r)', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  scoreBadge: { fontSize: 11, fontWeight: 600, color: 'var(--po-copper-bright)', background: 'var(--po-copper-wash)', border: '1px solid var(--po-copper-line)', padding: '3px 9px', borderRadius: 999 },
  soonChip: { display: 'inline-flex', alignItems: 'center', gap: 3, fontFamily: 'var(--po-mono)', fontSize: 11, color: 'var(--po-copper-bright)' },
  cardName: { fontSize: 15, fontWeight: 600, color: 'var(--po-text)', fontFamily: 'var(--po-display)' },
  cardMeta: { fontSize: 11.5, color: 'var(--po-text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  cardMetricRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 4, paddingTop: 10, borderTop: '1px solid var(--po-line)' },
  cardMetric: { fontSize: 26, fontWeight: 700, color: 'var(--po-copper-bright)', lineHeight: 1 },
  cardMetricLabel: { fontSize: 10.5, color: 'var(--po-text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 3 },
  cardSecondary: { fontSize: 11.5, color: 'var(--po-text-3)', textAlign: 'right' },
};

Object.assign(window, { DataArea, VisualKpis, RecordCards });
