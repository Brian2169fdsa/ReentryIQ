// po-shell.jsx — TopBar (wordmark, nav, usage meter, Ask AI) + FilterRail.
const { useState: poSUseState } = React;

function Wordmark({ size = 16 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <svg width={size + 6} height={size + 6} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        {/* IQ mark: rounded square node with a blue pulse bar */}
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="var(--po-blue)" strokeWidth="1.9"/>
        <path d="M8 14.5l2.5-3 2 2.2L16 9" stroke="var(--po-blue)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="po-display" style={{ fontSize: size, fontWeight: 600, color: 'var(--po-text)', letterSpacing: '-0.01em' }}>
        Reentry<span style={{ color: 'var(--po-blue)', fontWeight: 700 }}>IQ</span>
      </span>
    </div>
  );
}

function TopBar({ nav, setNav, usedRecords, includedRecords, planLabel, onAskAI, aiEnabled }) {
  const pct = Math.min(100, Math.round((usedRecords / includedRecords) * 100));
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'saved', label: 'Saved Searches', icon: 'bookmark' },
    { id: 'connectors', label: 'Connectors', icon: 'plug' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];
  return (
    <header className="po-shell-dark" style={poShell.topbar}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <Wordmark />
        <nav style={poShell.nav}>
          {navItems.map(it => (
            <button key={it.id} onClick={() => setNav(it.id)} className={nav === it.id ? '' : 'po-hov-nav'}
              style={{ ...poShell.navItem, ...(nav === it.id ? poShell.navItemActive : {}) }}>
              <Icon name={it.icon} size={15} />
              {it.label}
            </button>
          ))}
        </nav>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={onAskAI} className={aiEnabled ? 'po-hov-copper' : 'po-hov-ghost'} style={{ ...poShell.askBtn, ...(aiEnabled ? {} : poShell.askBtnLocked) }}>
          <Icon name="sparkles" size={15} />
          Ask AI
          {!aiEnabled && <span style={poShell.lockTag}>Enterprise</span>}
        </button>

        <div style={poShell.avatar} title="Sanctuary Recovery — Pro plan">SR</div>
      </div>
    </header>
  );
}

const COUNTY_LIST = ['Maricopa','Pima','Pinal','Yuma','Cochise','Yavapai','Mohave','Navajo','Graham','Coconino'];
const WINDOW_CHIPS = [
  { id: 'w30',  label: 'Next 30 days',  range: { start: 0, end: 29 } },
  { id: 'w90',  label: '30–90 days',    range: { start: 30, end: 89 } },
  { id: 'w180', label: '90–180 days',   range: { start: 90, end: 179 } },
];

function FilterRail({ filters, setFilters, counts, facilities, savedSearches, onRunSaved }) {
  const set = (patch) => setFilters({ ...filters, ...patch });

  function toggleCounty(c) {
    const has = filters.counties.includes(c);
    set({ counties: has ? filters.counties.filter(x => x !== c) : [...filters.counties, c] });
  }

  const activeWindow = WINDOW_CHIPS.find(w => filters.range && w.range.start === filters.range.start && w.range.end === filters.range.end);

  return (
    <aside className="po-shell-dark" style={poShell.rail}>
      <div style={poShell.railScroll}>
        {/* Search */}
        <div style={poShell.searchWrap}>
          <Icon name="search" size={16} stroke="var(--po-text-3)" />
          <input value={filters.q} onChange={e => set({ q: e.target.value })}
            placeholder="Name or DOC #" style={poShell.searchInput} />
          {filters.q && <button onClick={() => set({ q: '' })} style={poShell.searchClear}><Icon name="x" size={13} /></button>}
        </div>

        {/* County scope */}
        <Section label="County Scope" right={filters.counties.length ? `${filters.counties.length} selected` : 'All'}>
          <div style={poShell.countyList}>
            {COUNTY_LIST.map(c => {
              const on = filters.counties.includes(c);
              return (
                <button key={c} onClick={() => toggleCounty(c)} className="po-hov-soft" style={{ ...poShell.countyRow, ...(on ? poShell.countyRowOn : {}) }}>
                  <span style={{ ...poShell.checkbox, ...(on ? poShell.checkboxOn : {}) }}>
                    {on && <Icon name="check" size={11} stroke="var(--po-accent-fg)" sw={2.6} />}
                  </span>
                  <span style={{ flex: 1, textAlign: 'left' }}>{c}</span>
                  <span className="po-mono" style={poShell.countyCount}>{counts.byCounty[c] || 0}</span>
                </button>
              );
            })}
          </div>
          {filters.counties.length > 0 &&
            <button onClick={() => set({ counties: [] })} style={poShell.linkBtn}>Clear scope</button>}
        </Section>

        {/* Release window */}
        <Section label="Release Window">
          <div style={poShell.chipWrap}>
            {WINDOW_CHIPS.map(w => {
              const on = activeWindow && activeWindow.id === w.id;
              return (
                <button key={w.id} onClick={() => set({ range: on ? null : w.range })} className={on ? '' : 'po-hov-chip'}
                  style={{ ...poShell.chip, ...(on ? poShell.chipOn : {}) }}>{w.label}</button>
              );
            })}
          </div>
        </Section>

        {/* Facility */}
        <Section label="Facility">
          <SelectMenu value={filters.facility} placeholder="All facilities"
            options={['All facilities', ...facilities.map(f => f.name)]}
            onChange={v => set({ facility: v === 'All facilities' ? '' : v })} icon="building" />
        </Section>

        {/* Offense class */}
        <Section label="Offense Class">
          <SelectMenu value={filters.offenseClass} placeholder="Any class"
            options={['Any class', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6']}
            onChange={v => set({ offenseClass: v === 'Any class' ? '' : v })} icon="layers" />
        </Section>

        {/* Match score */}
        <Section label="Match Score" right={filters.minScore > 0 ? `${filters.minScore}+` : 'Any'}>
          <input type="range" min="0" max="95" step="5" value={filters.minScore}
            onChange={e => set({ minScore: +e.target.value })} style={poShell.range} />
          <div style={poShell.rangeScale}>
            <span>Any</span><span>50</span><span>95+</span>
          </div>
        </Section>

        {/* Saved searches */}
        <div style={poShell.savedHead}>
          <span className="po-label">Saved Searches</span>
          <button style={poShell.iconBtn} title="New saved search"><Icon name="plus" size={14} /></button>
        </div>
        <div style={poShell.savedList}>
          {savedSearches.map(s => (
            <button key={s.id} onClick={() => onRunSaved(s)} className="po-hov-soft" style={poShell.savedItem}>
              <span style={{ ...poShell.savedDot, background: s.alert ? 'var(--po-sage)' : 'var(--po-text-3)' }}></span>
              <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</span>
              {s.alert && <Icon name="bell" size={13} stroke="var(--po-sage-bright)" />}
              <span className="po-mono" style={poShell.countyCount}>{s.matches}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

function Section({ label, right, children }) {
  return (
    <div style={poShell.section}>
      <div style={poShell.sectionHead}>
        <span className="po-label">{label}</span>
        {right != null && <span style={poShell.sectionRight}>{right}</span>}
      </div>
      {children}
    </div>
  );
}

function SelectMenu({ value, options, onChange, placeholder, icon }) {
  const [open, setOpen] = poSUseState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={poShell.select}>
        {icon && <Icon name={icon} size={15} stroke="var(--po-text-3)" />}
        <span style={{ flex: 1, textAlign: 'left', color: value ? 'var(--po-text)' : 'var(--po-text-3)' }}>{value || placeholder}</span>
        <Icon name="chevronDown" size={15} stroke="var(--po-text-3)" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .18s' }} />
      </button>
      {open && (
        <>
          <div style={poShell.menuScrim} onClick={() => setOpen(false)}></div>
          <div style={poShell.menu}>
            {options.map(o => (
              <button key={o} onClick={() => { onChange(o); setOpen(false); }} className="po-hov-menu"
                style={{ ...poShell.menuItem, ...((o === value || (!value && o === options[0])) ? poShell.menuItemOn : {}) }}>{o}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const poShell = {
  topbar: { height: 60, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 22px', borderBottom: '1px solid var(--po-line)', background: 'var(--po-ink)', position: 'relative', zIndex: 20 },
  nav: { display: 'flex', alignItems: 'center', gap: 2 },
  navItem: { display: 'inline-flex', alignItems: 'center', gap: 7, height: 34, padding: '0 13px', borderRadius: 'var(--po-r-sm)',
    border: 'none', background: 'transparent', color: 'var(--po-text-3)', fontSize: 13, fontWeight: 500, transition: 'background .18s, color .18s' },
  navItemActive: { background: 'var(--po-elevated)', color: 'var(--po-text)' },
  usage: { width: 140 },
  meterTrack: { height: 5, borderRadius: 3, background: 'rgba(247,244,239,0.10)', overflow: 'hidden' },
  meterFill: { height: '100%', borderRadius: 3, transition: 'width .4s ease' },
  askBtn: { display: 'inline-flex', alignItems: 'center', gap: 7, height: 36, padding: '0 14px', borderRadius: 'var(--po-r)',
    border: 'none', background: 'var(--po-copper)', color: 'var(--po-accent-fg)', fontSize: 13, fontWeight: 600, transition: 'background .18s' },
  askBtnLocked: { background: 'transparent', color: 'var(--po-text-2)', border: '1px solid var(--po-line-strong)' },
  lockTag: { fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--po-copper-bright)',
    background: 'var(--po-copper-wash)', padding: '2px 6px', borderRadius: 4, marginLeft: 2 },
  avatar: { width: 34, height: 34, borderRadius: '50%', background: 'var(--po-sage-wash)', border: '1px solid var(--po-sage-line)',
    color: 'var(--po-sage-bright)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 },

  rail: { width: 264, flexShrink: 0, borderRight: '1px solid var(--po-line)', background: 'var(--po-ink)', display: 'flex', flexDirection: 'column' },
  railScroll: { flex: 1, overflowY: 'auto', padding: '18px 16px 28px' },
  searchWrap: { display: 'flex', alignItems: 'center', gap: 9, height: 40, padding: '0 12px', borderRadius: 'var(--po-r)',
    background: 'var(--po-panel)', border: '1px solid var(--po-line)', marginBottom: 22 },
  searchInput: { flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--po-text)', fontSize: 13.5, fontFamily: 'var(--po-body)' },
  searchClear: { border: 'none', background: 'transparent', color: 'var(--po-text-3)', display: 'flex', padding: 2 },
  section: { marginBottom: 22 },
  sectionHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionRight: { fontSize: 11, color: 'var(--po-copper-bright)', fontWeight: 600 },
  countyList: { display: 'flex', flexDirection: 'column', gap: 1 },
  countyRow: { display: 'flex', alignItems: 'center', gap: 9, height: 30, padding: '0 8px', borderRadius: 'var(--po-r-sm)',
    border: 'none', background: 'transparent', color: 'var(--po-text-2)', fontSize: 13, transition: 'background .15s, color .15s' },
  countyRowOn: { color: 'var(--po-text)' },
  checkbox: { width: 16, height: 16, borderRadius: 4, border: '1.5px solid var(--po-line-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  checkboxOn: { background: 'var(--po-copper)', border: '1.5px solid var(--po-copper)' },
  countyCount: { fontSize: 11.5, color: 'var(--po-text-3)' },
  linkBtn: { border: 'none', background: 'transparent', color: 'var(--po-copper-bright)', fontSize: 12, fontWeight: 600, padding: '8px 4px 0', fontFamily: 'var(--po-body)' },
  chipWrap: { display: 'flex', flexDirection: 'column', gap: 6 },
  chip: { height: 34, borderRadius: 'var(--po-r-sm)', border: '1px solid var(--po-line)', background: 'var(--po-panel)',
    color: 'var(--po-text-2)', fontSize: 13, fontWeight: 500, textAlign: 'left', padding: '0 12px', transition: 'all .15s' },
  chipOn: { background: 'var(--po-copper-wash)', border: '1px solid var(--po-copper-line)', color: 'var(--po-copper-bright)', fontWeight: 600 },
  select: { width: '100%', display: 'flex', alignItems: 'center', gap: 9, height: 40, padding: '0 12px', borderRadius: 'var(--po-r)',
    background: 'var(--po-panel)', border: '1px solid var(--po-line)', color: 'var(--po-text)', fontSize: 13.5 },
  menuScrim: { position: 'fixed', inset: 0, zIndex: 30 },
  menu: { position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 31, background: 'var(--po-elevated)',
    border: '1px solid var(--po-line-strong)', borderRadius: 'var(--po-r)', padding: 5, maxHeight: 240, overflowY: 'auto' },
  menuItem: { width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 'var(--po-r-sm)', border: 'none',
    background: 'transparent', color: 'var(--po-text-2)', fontSize: 13, transition: 'background .12s' },
  menuItemOn: { background: 'var(--po-panel)', color: 'var(--po-text)' },
  range: { width: '100%', accentColor: 'var(--po-copper)' },
  rangeScale: { display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--po-text-3)', marginTop: 4, fontFamily: 'var(--po-mono)' },
  savedHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingTop: 6, borderTop: '1px solid var(--po-line)' },
  iconBtn: { width: 26, height: 26, borderRadius: 6, border: '1px solid var(--po-line)', background: 'var(--po-panel)', color: 'var(--po-text-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  savedList: { display: 'flex', flexDirection: 'column', gap: 2 },
  savedItem: { display: 'flex', alignItems: 'center', gap: 9, height: 34, padding: '0 8px', borderRadius: 'var(--po-r-sm)',
    border: 'none', background: 'transparent', color: 'var(--po-text-2)', fontSize: 13, transition: 'background .15s' },
  savedDot: { width: 7, height: 7, borderRadius: '50%', flexShrink: 0 },
};

Object.assign(window, { TopBar, FilterRail, Wordmark, COUNTY_LIST, WINDOW_CHIPS });
