// po-table.jsx — releases table with copper countdown chips + match scores.
const { useState: poTUseState, useMemo: poTUseMemo } = React;

function ReleasesTable({ rows, density, onOpen, revealed, selectedRange, sort, setSort, onExport, exportEnabled, embedded }) {
  const rowH = density === 'compact' ? 44 : density === 'comfy' ? 60 : 52;

  const sorted = poTUseMemo(() => {
    const arr = [...rows];
    const dir = sort.dir === 'asc' ? 1 : -1;
    arr.sort((a, b) => {
      if (sort.key === 'date') return (a.releaseDayIdx - b.releaseDayIdx) * dir;
      if (sort.key === 'score') return (a.score - b.score) * dir;
      if (sort.key === 'name') return a.last.localeCompare(b.last) * dir;
      if (sort.key === 'county') return a.county.localeCompare(b.county) * dir;
      return 0;
    });
    return arr;
  }, [rows, sort]);

  // Prototype renders a capped slice (real build virtualizes the full set).
  const CAP = 60;
  const shown = sorted.slice(0, CAP);

  function th(key, label, align) {
    const active = sort.key === key;
    return (
      <button className="po-hov-ghost" style={{ ...poTab.th, justifyContent: align === 'right' ? 'flex-end' : 'flex-start' }}
        onClick={() => setSort({ key, dir: active && sort.dir === 'asc' ? 'desc' : 'asc' })}>
        {label}
        <span style={{ opacity: active ? 1 : 0, transition: 'opacity .15s', display: 'inline-flex' }}>
          <Icon name="chevronDown" size={13} style={{ transform: active && sort.dir === 'asc' ? 'rotate(180deg)' : 'none' }} />
        </span>
      </button>
    );
  }

  return (
    <div style={poTab.root}>
      {!embedded && (
      <div style={poTab.toolbar}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span className="po-display" style={{ fontSize: 16, fontWeight: 600, color: 'var(--po-text)' }}>Releases</span>
          <span className="po-mono" style={{ fontSize: 13, color: 'var(--po-text-3)' }}>
            {rows.length.toLocaleString()} {selectedRange ? `in ${selectedRange.label}` : 'matching'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="po-hov-ghost" style={{ ...poTab.toolBtn, ...(exportEnabled ? {} : poTab.toolBtnLocked) }} onClick={onExport}>
            <Icon name="download" size={15} /> Export CSV
            {!exportEnabled && <span style={poTab.lockMini}>Pro</span>}
          </button>
          <button className="po-hov-ghost" style={poTab.toolBtn}><Icon name="bookmark" size={15} /> Save search</button>
        </div>
      </div>
      )}

      <div style={poTab.tableScroll}>
        <div style={{ ...poTab.headRow }}>
          <div style={{ ...poTab.cell, flex: '0 0 30px' }}></div>
          <div style={{ ...poTab.cell, flex: 2.2 }}>{th('name', 'Name')}</div>
          <div style={{ ...poTab.cell, flex: 1.7 }}><span style={poTab.colLabel}>Facility</span></div>
          <div style={{ ...poTab.cell, flex: 1.1 }}>{th('county', 'County')}</div>
          <div style={{ ...poTab.cell, flex: 1.6 }}>{th('date', 'Release Date')}</div>
          <div style={{ ...poTab.cell, flex: 1.1, justifyContent: 'flex-end' }}>{th('score', 'Match')}</div>
          <div style={{ ...poTab.cell, flex: '0 0 28px' }}></div>
        </div>

        <div>
          {shown.map((r, i) => {
            const d = PO_DATA.daysUntil(r.releaseDate);
            const isRev = revealed.has(r.id);
            return (
              <button key={r.id} className="po-hov-trow" style={{ ...poTab.row, height: rowH }} onClick={() => onOpen(r)}>
                <div style={{ ...poTab.cell, flex: '0 0 30px' }}>
                  <span style={{ ...poTab.revDot, background: isRev ? 'var(--po-sage)' : 'transparent', border: isRev ? 'none' : '1.5px solid var(--po-line-strong)' }}></span>
                </div>
                <div style={{ ...poTab.cell, flex: 2.2, minWidth: 0 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={poTab.name}>{isRev ? r.name : maskName(r)}</div>
                    <div className="po-mono" style={poTab.sub}>DOC #{isRev ? r.docNumber : '••••••'}</div>
                  </div>
                </div>
                <div style={{ ...poTab.cell, flex: 1.7, minWidth: 0, flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
                  <span style={poTab.facName}>{r.facility}</span>
                  <span style={poTab.sub}>{r.unit} Unit</span>
                </div>
                <div style={{ ...poTab.cell, flex: 1.1 }}>
                  <span style={poTab.county}><Icon name="mapPin" size={13} stroke="var(--po-text-3)" /> {r.county}</span>
                </div>
                <div style={{ ...poTab.cell, flex: 1.6 }}>
                  <Countdown days={d} date={r.releaseDate} />
                </div>
                <div style={{ ...poTab.cell, flex: 1.1, justifyContent: 'flex-end' }}>
                  <ScorePill score={r.score} />
                </div>
                <div style={{ ...poTab.cell, flex: '0 0 28px', color: 'var(--po-text-3)' }}>
                  <Icon name="chevronRight" size={15} />
                </div>
              </button>
            );
          })}
          {rows.length === 0 && (
            <div style={poTab.empty}>
              <div style={poTab.emptyIcon}><Icon name="search" size={22} stroke="var(--po-text-3)" /></div>
              <div className="po-display" style={{ fontSize: 16, color: 'var(--po-text)', marginBottom: 4 }}>No releases match</div>
              <div style={{ fontSize: 13, color: 'var(--po-text-3)' }}>Widen your county scope or release window.</div>
            </div>
          )}
          {rows.length > CAP && (
            <div style={poTab.more}>
              Showing {CAP} of {rows.length.toLocaleString()} · scroll-virtualized in production
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function maskName(r) {
  return r.first[0] + '. ' + r.last[0] + '••••••';
}

function Countdown({ days, date }) {
  const dt = new Date(date + 'T00:00:00');
  const fmt = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  let chip;
  if (days <= 30) {
    chip = <span style={{ ...poTab.cdChip, background: 'var(--po-copper-wash)', border: '1px solid var(--po-copper-line)', color: 'var(--po-copper-bright)' }}>
      <Icon name="clock" size={11} stroke="var(--po-copper-bright)" /> {days}d
    </span>;
  } else {
    chip = <span style={{ ...poTab.cdChip, color: 'var(--po-text-3)' }}>{days}d</span>;
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span className="po-mono" style={{ fontSize: 12.5, whiteSpace: 'nowrap', color: days <= 30 ? 'var(--po-text)' : 'var(--po-text-2)' }}>{fmt}</span>
      {chip}
    </div>
  );
}

function ScorePill({ score }) {
  const tone = score >= 75 ? 'var(--po-sage-bright)' : score >= 50 ? 'var(--po-text-2)' : 'var(--po-text-3)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={poTab.scoreTrack}>
        <div style={{ height: '100%', width: score + '%', background: tone, borderRadius: 3 }}></div>
      </div>
      <span className="po-mono" style={{ fontSize: 13, color: tone, width: 22, textAlign: 'right' }}>{score}</span>
    </div>
  );
}

const poTab = {
  root: { background: 'var(--po-panel)', border: '1px solid var(--po-line)', borderRadius: 'var(--po-r)', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid var(--po-line)' },
  toolBtn: { display: 'inline-flex', alignItems: 'center', gap: 7, height: 34, padding: '0 12px', borderRadius: 'var(--po-r-sm)',
    border: '1px solid var(--po-line)', background: 'transparent', color: 'var(--po-text-2)', fontSize: 13, fontWeight: 500, transition: 'background .15s, color .15s' },
  toolBtnLocked: { opacity: 0.55 },
  lockMini: { fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--po-copper-bright)', background: 'var(--po-copper-wash)', padding: '1px 5px', borderRadius: 3 },
  tableScroll: { overflowY: 'auto', maxHeight: 'calc(100vh - 360px)', minHeight: 240 },
  headRow: { display: 'flex', alignItems: 'center', height: 38, padding: '0 14px', borderBottom: '1px solid var(--po-line)',
    position: 'sticky', top: 0, background: 'var(--po-panel)', zIndex: 2 },
  th: { display: 'inline-flex', alignItems: 'center', gap: 4, border: 'none', background: 'transparent', padding: '4px 6px', borderRadius: 5,
    fontFamily: 'var(--po-body)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--po-text-3)', width: '100%' },
  colLabel: { fontFamily: 'var(--po-body)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--po-text-3)', padding: '0 6px' },
  cell: { display: 'flex', alignItems: 'center', padding: '0 8px' },
  row: { display: 'flex', alignItems: 'center', width: '100%', padding: '0 14px', border: 'none', borderBottom: '1px solid var(--po-line)',
    background: 'transparent', textAlign: 'left', transition: 'background .12s', cursor: 'pointer' },
  revDot: { width: 8, height: 8, borderRadius: '50%' },
  name: { fontSize: 13.5, fontWeight: 600, color: 'var(--po-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  sub: { fontSize: 11, color: 'var(--po-text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  facName: { fontSize: 13, color: 'var(--po-text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' },
  county: { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--po-text-2)' },
  cdChip: { display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--po-mono)', fontSize: 11, fontWeight: 500,
    padding: '1px 6px', borderRadius: 4, width: 'fit-content' },
  scoreTrack: { width: 46, height: 5, borderRadius: 3, background: 'var(--po-track)', overflow: 'hidden' },
  empty: { padding: '56px 20px', textAlign: 'center' },
  emptyIcon: { width: 52, height: 52, borderRadius: 12, background: 'var(--po-panel-2)', border: '1px solid var(--po-line)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' },
  more: { padding: '14px', textAlign: 'center', fontSize: 12, color: 'var(--po-text-3)', fontFamily: 'var(--po-mono)' },
};

Object.assign(window, { ReleasesTable });
