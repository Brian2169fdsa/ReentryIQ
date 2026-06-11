// po-assistant.jsx — AI assistant slide-over (Enterprise). Answers from the org's
// entitled data scope only; renders inline charts computed from the live dataset.
const { useState: poAUseState, useRef: poAUseRef, useEffect: poAUseEffect } = React;

const PO_MONTHS_FULL = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function monthlyForCounty(county) {
  const m = {};
  PO_DATA.records.forEach(r => {
    if (county && r.county !== county) return;
    const dt = new Date(r.releaseDate + 'T00:00:00');
    const key = dt.getMonth();
    m[key] = (m[key] || 0) + 1;
  });
  return Object.entries(m).map(([k, v]) => ({ label: PO_MONTHS_FULL[+k], value: v })).slice(0, 6);
}

function buildAnswer(text) {
  const t = text.toLowerCase();
  if (t.includes('maricopa') || (t.includes('month') && !t.includes('compare'))) {
    const data = monthlyForCounty('Maricopa');
    const total = data.reduce((s, d) => s + d.value, 0);
    return {
      text: `${total.toLocaleString()} releases route to Maricopa County across the next six months. June and the late-summer window carry the heaviest volume — worth weighting outreach capacity there.`,
      chart: { type: 'bar', data, accent: true, caption: 'Releases into Maricopa by month' },
    };
  }
  if (t.includes('compare') || t.includes('q3') || t.includes('q4')) {
    const byQ = { Q3: 0, Q4: 0 };
    PO_DATA.records.forEach(r => {
      const mo = new Date(r.releaseDate + 'T00:00:00').getMonth();
      if (mo >= 5 && mo <= 7) byQ.Q3 += 1; else if (mo >= 8 && mo <= 10) byQ.Q4 += 1;
    });
    return {
      text: `Statewide, Q3 shows ${byQ.Q3.toLocaleString()} releases versus ${byQ.Q4.toLocaleString()} in Q4 — a ${Math.round(((byQ.Q3 - byQ.Q4) / byQ.Q4) * 100)}% higher summer load. Front-load admissions staffing into Q3.`,
      chart: { type: 'bar', data: [{ label: 'Q3', value: byQ.Q3 }, { label: 'Q4', value: byQ.Q4 }], accent: false, caption: 'Statewide release volume by quarter' },
    };
  }
  if (t.includes('30') || t.includes('soon') || t.includes('urgent')) {
    const n = PO_DATA.records.filter(r => PO_DATA.daysUntil(r.releaseDate) <= 30).length;
    return { text: `${n} people in your entitled scope release within the next 30 days. They're flagged with copper countdown chips in the table — these are your highest-priority outreach targets.`, chart: null };
  }
  return {
    text: `I can only answer from data your plan entitles you to see. Try: release volume by month for a county, a Q3-vs-Q4 comparison, or counts inside a release window. I'll never surface records behind your paywall.`,
    chart: null,
  };
}

const SUGGESTIONS = [
  'Releases into Maricopa next 6 months by month',
  'Compare Q3 vs Q4 release volume',
  'How many releases in the next 30 days?',
];

function AIAssistant({ open, onClose, enabled, onUpgrade }) {
  const [msgs, setMsgs] = poAUseState([
    { role: 'ai', text: "Ask about release volume, timing, or your scope. I answer only from data your plan covers — and I render the numbers as charts." },
  ]);
  const [input, setInput] = poAUseState('');
  const [thinking, setThinking] = poAUseState(false);
  const scrollRef = poAUseRef(null);

  poAUseEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, thinking]);

  function ask(text) {
    if (!text.trim() || thinking) return;
    setMsgs(m => [...m, { role: 'user', text }]);
    setInput('');
    setThinking(true);
    setTimeout(() => {
      const ans = buildAnswer(text);
      setThinking(false);
      setMsgs(m => [...m, { role: 'ai', ...ans }]);
    }, 750);
  }

  if (!open) return null;

  return (
    <>
      <div style={poAi.scrim} onClick={onClose}></div>
      <div style={poAi.panel}>
        <div style={poAi.head}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={poAi.headIcon}><Icon name="sparkles" size={16} stroke="var(--po-copper-bright)" /></span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--po-text)' }}>Release Assistant</div>
              <div style={{ fontSize: 11, color: 'var(--po-text-3)' }}>Answers within your data scope</div>
            </div>
          </div>
          <button className="po-hov-ghost" style={poAi.closeBtn} onClick={onClose}><Icon name="x" size={17} /></button>
        </div>

        {!enabled ? (
          <div style={poAi.lock}>
            <div style={poAi.lockIcon}><Icon name="sparkles" size={24} stroke="var(--po-copper)" /></div>
            <div className="po-display" style={{ fontSize: 18, color: 'var(--po-text)', marginBottom: 8 }}>Assistant is an Enterprise feature</div>
            <div style={{ fontSize: 13.5, color: 'var(--po-text-2)', lineHeight: 1.6, maxWidth: 320, marginBottom: 20 }}>
              Ask plain-language questions across your entitled release data and get answers with inline charts — gated to your county scope and reveal limits.
            </div>
            <button className="po-hov-copper" style={poAi.upgradeBtn} onClick={onUpgrade}>Upgrade to Enterprise</button>
            <div style={{ fontSize: 11.5, color: 'var(--po-text-3)', marginTop: 12 }}>or switch the plan in Tweaks to preview</div>
          </div>
        ) : (
          <>
            <div style={poAi.scroll} ref={scrollRef}>
              {msgs.map((m, i) => (
                <div key={i} style={{ ...poAi.msgRow, justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={m.role === 'user' ? poAi.userBubble : poAi.aiBubble}>
                    <div style={{ fontSize: 13.5, lineHeight: 1.55 }}>{m.text}</div>
                    {m.chart && <MiniBars chart={m.chart} />}
                  </div>
                </div>
              ))}
              {thinking && (
                <div style={poAi.msgRow}>
                  <div style={poAi.aiBubble}><span className="po-dots"><i></i><i></i><i></i></span></div>
                </div>
              )}
            </div>

            {msgs.length <= 1 && (
              <div style={poAi.suggestions}>
                {SUGGESTIONS.map(s => (
                  <button key={s} className="po-hov-soft" style={poAi.suggestion} onClick={() => ask(s)}>{s}</button>
                ))}
              </div>
            )}

            <div style={poAi.inputBar}>
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') ask(input); }}
                placeholder="Ask about releases…" style={poAi.input} />
              <button className="po-hov-copper" style={poAi.sendBtn} onClick={() => ask(input)}><Icon name="send" size={16} stroke="var(--po-accent-fg)" /></button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function MiniBars({ chart }) {
  const max = Math.max(...chart.data.map(d => d.value));
  return (
    <div style={poAi.chart}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 92 }}>
        {chart.data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
            <span className="po-mono" style={{ fontSize: 10.5, color: 'var(--po-text-2)' }}>{d.value}</span>
            <div style={{ width: '100%', maxWidth: 30, height: (d.value / max) * 64 + 'px', borderRadius: '3px 3px 0 0',
              background: chart.accent ? 'var(--po-copper)' : 'var(--po-sage)' }}></div>
            <span style={{ fontSize: 10.5, color: 'var(--po-text-3)' }}>{d.label}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: 'var(--po-text-3)', marginTop: 8, textAlign: 'center' }}>{chart.caption}</div>
    </div>
  );
}

const poAi = {
  scrim: { position: 'fixed', inset: 0, background: 'rgba(8,11,16,0.45)', zIndex: 42 },
  panel: { position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, maxWidth: '94vw', background: 'var(--po-panel)',
    borderLeft: '1px solid var(--po-line-strong)', zIndex: 43, display: 'flex', flexDirection: 'column' },
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 18px', borderBottom: '1px solid var(--po-line)', flexShrink: 0 },
  headIcon: { width: 32, height: 32, borderRadius: 8, background: 'var(--po-copper-wash)', border: '1px solid var(--po-copper-line)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  closeBtn: { width: 32, height: 32, borderRadius: 7, border: 'none', background: 'transparent', color: 'var(--po-text-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1, overflowY: 'auto', padding: '18px', display: 'flex', flexDirection: 'column', gap: 12 },
  msgRow: { display: 'flex' },
  aiBubble: { maxWidth: '88%', background: 'var(--po-panel-2)', border: '1px solid var(--po-line)', borderRadius: '4px 12px 12px 12px', padding: '11px 13px', color: 'var(--po-text)' },
  userBubble: { maxWidth: '85%', background: 'var(--po-copper-wash)', border: '1px solid var(--po-copper-line)', borderRadius: '12px 4px 12px 12px', padding: '11px 13px', color: 'var(--po-text)' },
  dots: { display: 'inline-flex', gap: 4, padding: '2px 0' },
  chart: { marginTop: 12, padding: '12px', background: 'var(--po-bg)', borderRadius: 'var(--po-r-sm)', border: '1px solid var(--po-line)' },
  suggestions: { display: 'flex', flexDirection: 'column', gap: 7, padding: '0 18px 14px' },
  suggestion: { textAlign: 'left', padding: '10px 13px', borderRadius: 'var(--po-r-sm)', border: '1px solid var(--po-line)',
    background: 'var(--po-panel-2)', color: 'var(--po-text-2)', fontSize: 13, transition: 'background .15s' },
  inputBar: { display: 'flex', gap: 8, padding: '14px 18px', borderTop: '1px solid var(--po-line)', flexShrink: 0 },
  input: { flex: 1, height: 42, padding: '0 14px', borderRadius: 'var(--po-r)', background: 'var(--po-bg)',
    border: '1px solid var(--po-line)', color: 'var(--po-text)', fontSize: 13.5, fontFamily: 'var(--po-body)', outline: 'none' },
  sendBtn: { width: 42, height: 42, borderRadius: 'var(--po-r)', border: 'none', background: 'var(--po-copper)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .15s' },
  lock: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px 24px' },
  lockIcon: { width: 60, height: 60, borderRadius: 14, background: 'var(--po-copper-wash)', border: '1px solid var(--po-copper-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  upgradeBtn: { padding: '11px 22px', borderRadius: 'var(--po-r)', border: 'none', background: 'var(--po-copper)', color: 'var(--po-accent-fg)', fontSize: 14, fontWeight: 600, transition: 'background .15s' },
};

Object.assign(window, { AIAssistant });
