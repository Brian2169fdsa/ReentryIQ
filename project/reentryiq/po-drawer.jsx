// po-drawer.jsx — record detail drawer. First reveal fires the meter; re-opens are free.
const { useState: poDUseState } = React;

function RecordDrawer({ record, onClose, revealed, onReveal, aiEnabled }) {
  const [note, setNote] = poDUseState('');
  if (!record) return null;
  const isRev = revealed.has(record.id);
  const days = PO_DATA.daysUntil(record.releaseDate);
  const dt = new Date(record.releaseDate + 'T00:00:00');
  const dateFmt = dt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <>
      <div style={poDr.scrim} onClick={onClose}></div>
      <div style={poDr.drawer} key={record.id}>
        {/* header */}
        <div style={poDr.head}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="po-label">Release Record</span>
            <span className="po-mono" style={poDr.recId}>{record.id}</span>
          </div>
          <button className="po-hov-ghost" style={poDr.closeBtn} onClick={onClose}><Icon name="x" size={17} /></button>
        </div>

        <div style={poDr.body}>
          {/* identity */}
          <div style={{ marginBottom: 18 }}>
            <h2 className="po-display" style={poDr.name}>{isRev ? record.name : maskName(record)}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
              <span className="po-mono" style={poDr.doc}>DOC #{isRev ? record.docNumber : '••••••'}</span>
              <span style={poDr.dot}></span>
              <span style={{ fontSize: 13, color: 'var(--po-text-2)' }}>Age {isRev ? record.age : '••'}</span>
            </div>
          </div>

          {/* countdown banner */}
          <div style={{ ...poDr.banner, ...(days <= 30 ? poDr.bannerHot : {}) }}>
            <Icon name="clock" size={18} stroke={days <= 30 ? 'var(--po-copper-bright)' : 'var(--po-text-2)'} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: days <= 30 ? 'var(--po-copper-bright)' : 'var(--po-text)' }}>
                Releases in {days} days
              </div>
              <div className="po-mono" style={{ fontSize: 12, color: 'var(--po-text-2)', marginTop: 2 }}>{dateFmt}</div>
            </div>
            <ScorePill score={record.score} />
          </div>

          {!isRev ? (
            /* ---- reveal gate ---- */
            <div style={poDr.gate}>
              <div style={poDr.gateIcon}><Icon name="shield" size={22} stroke="var(--po-copper)" /></div>
              <div className="po-display" style={{ fontSize: 16, color: 'var(--po-text)', marginBottom: 6 }}>Full record hidden</div>
              <div style={{ fontSize: 13, color: 'var(--po-text-2)', lineHeight: 1.55, marginBottom: 16, maxWidth: 320 }}>
                Revealing shows the complete record — full name, DOC #, sentence and supervision detail.
                The first reveal of a record counts once toward your plan.
              </div>
              <button className="po-hov-copper" style={poDr.revealBtn} onClick={() => onReveal(record)}>
                Reveal full record
                <span style={poDr.revealMeta}>uses 1 record view</span>
              </button>
            </div>
          ) : (
            /* ---- full record ---- */
            <div>
              <Field label="Custody Facility">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon name="building" size={16} stroke="var(--po-text-3)" />
                  <span style={{ color: 'var(--po-text)', fontWeight: 600 }}>{record.facility}</span>
                  <span style={{ color: 'var(--po-text-3)' }}>· {record.unit} Unit</span>
                </div>
              </Field>
              <div style={poDr.grid}>
                <Field label="Release County"><span style={poDr.val}><Icon name="mapPin" size={15} stroke="var(--po-copper)" /> {record.county}</span></Field>
                <Field label="Supervision"><span style={poDr.val}>{record.supervision}</span></Field>
                <Field label="Offense Class"><span style={poDr.val}>{record.offenseClass}</span></Field>
                <Field label="Custody Level"><span style={poDr.val}>{record.custody}</span></Field>
                <Field label="Sentence"><span style={poDr.val}>{record.sentenceYears.toFixed(1)} yrs</span></Field>
                <Field label="Match Score"><span style={poDr.val} className="po-mono">{record.score} / 100</span></Field>
              </div>

              <div style={poDr.sourceNote}>
                <Icon name="shield" size={13} stroke="var(--po-text-3)" />
                Sourced from ADCRR public records. Release date subject to change. Outreach use only — not for FCRA-covered screening.
              </div>
            </div>
          )}
        </div>

        {/* footer actions */}
        <div style={poDr.footer}>
          <button className={aiEnabled ? 'po-hov-copper' : 'po-hov-ghost'} style={{ ...poDr.primaryAction, ...(aiEnabled ? {} : poDr.actionLocked) }}>
            <Icon name="external" size={16} /> Push to CRM
            {!aiEnabled && <span style={poDr.lockTag}>Enterprise</span>}
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="po-hov-ghost" style={poDr.secAction}><Icon name="bookmark" size={15} /> Add to list</button>
            <button className="po-hov-ghost" style={poDr.secAction}><Icon name="note" size={15} /> Note</button>
          </div>
        </div>
      </div>
    </>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div className="po-label" style={{ marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 14 }}>{children}</div>
    </div>
  );
}

const poDr = {
  scrim: { position: 'fixed', inset: 0, background: 'rgba(8,11,16,0.45)', backdropFilter: 'blur(2px)', zIndex: 40 },
  drawer: { position: 'fixed', top: 0, right: 0, bottom: 0, width: 460, maxWidth: '94vw', background: 'var(--po-panel)',
    borderLeft: '1px solid var(--po-line-strong)', zIndex: 41, display: 'flex', flexDirection: 'column' },
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--po-line)', flexShrink: 0 },
  recId: { fontSize: 12, color: 'var(--po-text-3)' },
  closeBtn: { width: 32, height: 32, borderRadius: 7, border: 'none', background: 'transparent', color: 'var(--po-text-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, overflowY: 'auto', padding: '22px 20px' },
  name: { fontSize: 25, fontWeight: 700, color: 'var(--po-text)', margin: 0, letterSpacing: '-0.02em' },
  doc: { fontSize: 13, color: 'var(--po-text-2)' },
  dot: { width: 3, height: 3, borderRadius: '50%', background: 'var(--po-text-3)' },
  banner: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 'var(--po-r)',
    background: 'var(--po-panel-2)', border: '1px solid var(--po-line)', marginBottom: 22 },
  bannerHot: { background: 'var(--po-copper-wash)', border: '1px solid var(--po-copper-line)' },
  gate: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '24px 16px',
    border: '1px dashed var(--po-line-strong)', borderRadius: 'var(--po-r)', background: 'var(--po-panel-2)' },
  gateIcon: { width: 52, height: 52, borderRadius: 12, background: 'var(--po-copper-wash)', border: '1px solid var(--po-copper-line)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  revealBtn: { display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 3, whiteSpace: 'nowrap', padding: '11px 28px', borderRadius: 'var(--po-r)',
    border: 'none', background: 'var(--po-copper)', color: 'var(--po-accent-fg)', fontSize: 14, fontWeight: 700, lineHeight: 1.2, transition: 'background .15s' },
  revealMeta: { fontSize: 11, fontWeight: 500, opacity: 0.7 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 18px', marginTop: 4 },
  val: { display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--po-text)', fontWeight: 500 },
  sourceNote: { display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 18, padding: '11px 13px', borderRadius: 'var(--po-r-sm)',
    background: 'var(--po-panel-2)', fontSize: 11.5, color: 'var(--po-text-3)', lineHeight: 1.5 },
  footer: { padding: '14px 20px', borderTop: '1px solid var(--po-line)', display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 },
  primaryAction: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 42, borderRadius: 'var(--po-r)',
    border: 'none', background: 'var(--po-copper)', color: 'var(--po-accent-fg)', fontSize: 14, fontWeight: 600, transition: 'background .15s' },
  actionLocked: { background: 'transparent', color: 'var(--po-text-2)', border: '1px solid var(--po-line-strong)' },
  lockTag: { fontSize: 9.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--po-copper-bright)',
    background: 'var(--po-copper-wash)', padding: '2px 6px', borderRadius: 4, marginLeft: 4 },
  secAction: { flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, height: 38, borderRadius: 'var(--po-r-sm)',
    border: '1px solid var(--po-line)', background: 'transparent', color: 'var(--po-text-2)', fontSize: 13, fontWeight: 500, transition: 'background .15s, color .15s' },
};

Object.assign(window, { RecordDrawer });
