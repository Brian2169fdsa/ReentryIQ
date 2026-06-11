// po-horizon.jsx — the Release Horizon: the product thesis in one component.
// A horizontal density strip of daily release volume across the forward window.
// Total volume reads as a faint slate column; the in-scope portion (active county
// filter) is overlaid in a graduated blue ramp. Click a month segment to filter.

const { useState: poHUseState, useRef: poHUseRef, useEffect: poHUseEffect, useMemo: poHUseMemo } = React;

const PO_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// Read the blue ramp from the token layer (no hardcoded hex in the component).
function poReadRamp() {
  const cs = getComputedStyle(document.documentElement);
  const r = [1, 2, 3, 4, 5].map(i => (cs.getPropertyValue('--po-ramp-' + i) || '').trim());
  return r.every(Boolean) ? r : ['#1E3A5F', '#2D6FBF', '#4A90E2', '#6BA7EC', '#93C0F2'];
}

function ReleaseHorizon({ days, windowDays, scopeLabel, selectedRange, onSelectRange, animateKey }) {
  // days: [{ dayIdx, date, total, scoped }]
  const view = poHUseMemo(() => days.slice(0, windowDays), [days, windowDays]);
  const maxTotal = poHUseMemo(() => Math.max(1, ...view.map(d => d.total)), [view]);
  const maxScoped = poHUseMemo(() => Math.max(1, ...view.map(d => d.scoped)), [view]);
  const ramp = poHUseMemo(() => poReadRamp(), [animateKey]);
  const rampFor = (v) => ramp[Math.max(0, Math.min(4, Math.round((v / maxScoped) * 4)))];

  const [hover, setHover] = poHUseState(null); // { idx, x }
  const [grown] = poHUseState(true);
  const wrapRef = poHUseRef(null);

  // Bars are always at full height (base = visible) so the strip never blanks under
  // throttling or reduced-motion. Filter/window changes animate via the CSS height
  // transition on each bar.

  // Month segmentation within the window.
  const months = poHUseMemo(() => {
    const out = [];
    view.forEach((d, i) => {
      const dt = new Date(d.date + 'T00:00:00');
      const key = dt.getFullYear() + '-' + dt.getMonth();
      const last = out[out.length - 1];
      if (!last || last.key !== key) {
        out.push({ key, label: PO_MONTHS[dt.getMonth()], year: dt.getFullYear(),
                   startIdx: i, endIdx: i, startDay: d.dayIdx, endDay: d.dayIdx, total: d.total, scoped: d.scoped });
      } else {
        last.endIdx = i; last.endDay = d.dayIdx; last.total += d.total; last.scoped += d.scoped;
      }
    });
    return out;
  }, [view]);

  const totalScoped = poHUseMemo(() => view.reduce((s, d) => s + d.scoped, 0), [view]);
  const totalAll = poHUseMemo(() => view.reduce((s, d) => s + d.total, 0), [view]);

  function monthSelected(m) {
    return selectedRange && selectedRange.start === m.startDay && selectedRange.end === m.endDay;
  }
  function clickMonth(m) {
    if (monthSelected(m)) onSelectRange(null);
    else onSelectRange({ start: m.startDay, end: m.endDay, label: m.label + ' ' + m.year });
  }

  return (
    <div style={poH.root}>
      <div style={poH.header}>
        <div>
          <div className="po-label" style={{ marginBottom: 6 }}>Release Horizon</div>
          <div style={poH.headline}>
            <span className="po-display" style={{ fontSize: 19, color: 'var(--po-text)' }}>
              Next {windowDays} days
            </span>
            <span style={poH.headSub}>
              <b className="po-mono" style={{ color: 'var(--po-ramp-4)' }}>{totalScoped.toLocaleString()}</b> in {scopeLabel}
              <span style={{ color: 'var(--po-text-3)', margin: '0 8px' }}>/</span>
              <b className="po-mono" style={{ color: 'var(--po-text-2)' }}>{totalAll.toLocaleString()}</b> statewide
            </span>
          </div>
        </div>
        <div style={poH.legend}>
          <span style={poH.legItem}><i style={{ ...poH.swatch, background: 'var(--po-ramp-3)' }}></i>{scopeLabel}</span>
          <span style={poH.legItem}><i style={{ ...poH.swatch, background: 'var(--po-ramp-faint)' }}></i>Statewide</span>
          {selectedRange && (
            <button style={poH.clearBtn} onClick={() => onSelectRange(null)}>
              {selectedRange.label} <span style={{ marginLeft: 4, opacity: 0.7 }}>✕</span>
            </button>
          )}
        </div>
      </div>

      <div style={poH.plotWrap} ref={wrapRef}
           onMouseLeave={() => setHover(null)}>
        {/* y baseline grid */}
        <div style={poH.gridline}></div>

        <div style={poH.bars}
             onMouseMove={(e) => {
               const rect = e.currentTarget.getBoundingClientRect();
               const rel = (e.clientX - rect.left) / rect.width;
               const idx = Math.max(0, Math.min(view.length - 1, Math.floor(rel * view.length)));
               setHover({ idx, x: rel * rect.width });
             }}>
          {view.map((d, i) => {
            const inSel = selectedRange && d.dayIdx >= selectedRange.start && d.dayIdx <= selectedRange.end;
            const dimmed = selectedRange && !inSel;
            const totH = grown ? (d.total / maxTotal) * 100 : 0;
            const scoH = grown ? (d.scoped / maxTotal) * 100 : 0;
            const isHover = hover && hover.idx === i;
            return (
              <div key={i} style={{ ...poH.col, opacity: dimmed ? 0.32 : 1 }}>
                <div style={{
                  ...poH.barTotal,
                  height: totH + '%',
                  background: isHover ? 'var(--po-line-strong)' : 'var(--po-ramp-faint)',
                  transitionDelay: (i * 1.4) + 'ms',
                }}>
                  <div style={{
                    ...poH.barScoped,
                    height: (d.total ? (d.scoped / d.total) * 100 : 0) + '%',
                    background: isHover ? 'var(--po-ramp-5)' : rampFor(d.scoped),
                  }}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* month click-segments + labels */}
        <div style={poH.monthRow}>
          {months.map((m, i) => {
            const wPct = ((m.endIdx - m.startIdx + 1) / view.length) * 100;
            const sel = monthSelected(m);
            return (
              <button key={m.key} onClick={() => clickMonth(m)}
                title={`${m.label} ${m.year} · ${m.scoped} in ${scopeLabel} / ${m.total} statewide`}
                style={{
                  ...poH.monthSeg,
                  width: wPct + '%',
                  borderLeft: i === 0 ? 'none' : '1px solid var(--po-line)',
                  background: sel ? 'var(--po-copper-wash)' : 'transparent',
                  color: sel ? 'var(--po-copper-bright)' : 'var(--po-text-3)',
                }}>
                <span style={{ fontWeight: sel ? 700 : 500 }}>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* hover tooltip */}
        {hover && view[hover.idx] && (
          <div style={{
            ...poH.tip,
            left: Math.max(4, Math.min(hover.x - 70, (wrapRef.current?.clientWidth || 600) - 144)),
          }}>
            <div style={poH.tipDate}>{fmtTipDate(view[hover.idx].date)}</div>
            <div style={poH.tipRow}>
              <span><i style={{ ...poH.swatch, background: 'var(--po-ramp-3)' }}></i>{scopeLabel}</span>
              <b className="po-mono">{view[hover.idx].scoped}</b>
            </div>
            <div style={poH.tipRow}>
              <span><i style={{ ...poH.swatch, background: 'var(--po-ramp-faint)' }}></i>Statewide</span>
              <b className="po-mono" style={{ color: 'var(--po-text-2)' }}>{view[hover.idx].total}</b>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function fmtTipDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  const dow = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
  return `${dow} ${PO_MONTHS[d.getMonth()]} ${d.getDate()}`;
}

const poH = {
  root: { background: 'var(--po-panel)', border: '1px solid var(--po-line)', borderRadius: 'var(--po-r)', padding: '20px 22px 14px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 14 },
  headline: { display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' },
  headSub: { fontSize: 13, color: 'var(--po-text-2)' },
  legend: { display: 'flex', alignItems: 'center', gap: 16, paddingTop: 4 },
  legItem: { display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--po-text-2)' },
  swatch: { width: 9, height: 9, borderRadius: 2, display: 'inline-block', flexShrink: 0 },
  clearBtn: { display: 'inline-flex', alignItems: 'center', fontFamily: 'var(--po-body)', fontSize: 12, fontWeight: 600,
    color: 'var(--po-copper-bright)', background: 'var(--po-copper-wash)', border: '1px solid var(--po-copper-line)',
    borderRadius: 'var(--po-r-sm)', padding: '4px 9px' },
  plotWrap: { position: 'relative' },
  gridline: { position: 'absolute', left: 0, right: 0, bottom: 26, height: 1, background: 'var(--po-line)' },
  bars: { position: 'relative', display: 'flex', alignItems: 'flex-end', gap: 1, height: 132, paddingBottom: 0 },
  col: { flex: 1, height: '100%', display: 'flex', alignItems: 'flex-end', minWidth: 0 },
  barTotal: { width: '100%', borderRadius: '2px 2px 0 0', position: 'relative',
    transition: 'height 0.7s cubic-bezier(.22,.61,.36,1), background 0.15s ease', alignSelf: 'flex-end',
    display: 'flex', alignItems: 'flex-end' },
  barScoped: { width: '100%', borderRadius: '2px 2px 0 0', transition: 'background 0.15s ease' },
  monthRow: { display: 'flex', marginTop: 8, height: 18 },
  monthSeg: { height: 18, border: 'none', background: 'transparent', fontFamily: 'var(--po-body)', fontSize: 11,
    letterSpacing: '0.04em', borderRadius: 'var(--po-r-sm)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', transition: 'background 0.18s ease, color 0.18s ease', overflow: 'hidden', whiteSpace: 'nowrap' },
  tip: { position: 'absolute', top: -6, width: 140, transform: 'translateY(-100%)', background: 'var(--po-elevated)',
    border: '1px solid var(--po-line-strong)', borderRadius: 'var(--po-r)', padding: '9px 11px', pointerEvents: 'none',
    zIndex: 5 },
  tipDate: { fontSize: 12, fontWeight: 600, color: 'var(--po-text)', marginBottom: 7 },
  tipRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--po-text-2)', marginTop: 3 },
};

Object.assign(window, { ReleaseHorizon });
