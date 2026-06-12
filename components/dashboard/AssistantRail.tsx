'use client'

import { useChat } from 'ai/react'
import { useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/ui/Icon'

const RAMP = ['var(--po-ramp-5)', 'var(--po-ramp-4)', 'var(--po-ramp-3)', 'var(--po-ramp-2)', 'var(--po-ramp-1)']

const SUGGESTIONS = [
  'Show me high score releases in the next 60 days',
  'Which facilities have the most releases next month?',
  'Compare Pima vs Maricopa next quarter',
]

interface QueryResultShape {
  intent: 'count' | 'list' | 'breakdown'
  total: number
  rows?: { adc_number: string; name: string; county: string; release_date: string; score: number }[]
  breakdown?: { label: string; count: number }[]
  window?: { from: string; to: string }
  source?: string
}

interface RevealShape {
  record?: { adc_number: string; name: string; status: string | null; prison_release_date: string | null; complex: string | null }
  error?: string
}

/* Blue-ramp horizontal mini bars — the dashboard's visual pattern, in chat. */
export function RampBars({ data }: { data: { label: string; count: number }[] }) {
  const shown = data.slice(0, 8)
  const max = Math.max(...shown.map(d => d.count), 1)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {shown.map((d, i) => (
        <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 84, fontSize: 11, color: 'var(--po-text-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flexShrink: 0 }} title={d.label}>{d.label}</span>
          <div style={{ flex: 1, height: 14, background: 'var(--po-track)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${(d.count / max) * 100}%`, height: '100%', borderRadius: 3, background: RAMP[Math.min(i, RAMP.length - 1)] }} />
          </div>
          <span className="po-mono" style={{ width: 34, textAlign: 'right', fontSize: 11, fontWeight: 600, color: 'var(--po-text)' }}>{d.count}</span>
        </div>
      ))}
    </div>
  )
}

export function QueryResultCard({ result, onViewMatches }: { result: QueryResultShape; onViewMatches: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {result.intent === 'count' && (
        <div className="po-display" style={{ fontSize: 26, fontWeight: 700, color: 'var(--po-text)' }}>
          {result.total.toLocaleString()}
        </div>
      )}
      {result.intent === 'breakdown' && result.breakdown && <RampBars data={result.breakdown} />}
      {result.intent === 'list' && result.rows && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {result.rows.slice(0, 5).map(r => (
            <div key={r.adc_number} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5 }}>
              <span style={{ flex: 1, fontWeight: 600, color: 'var(--po-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</span>
              <span style={{ color: 'var(--po-text-3)' }}>{r.county}</span>
              <span className="po-mono" style={{ color: 'var(--po-text-2)' }}>{r.release_date}</span>
            </div>
          ))}
          {result.total > 5 && (
            <span style={{ fontSize: 11, color: 'var(--po-text-3)' }}>+ {result.total - 5} more</span>
          )}
        </div>
      )}
      <button
        onClick={onViewMatches}
        style={{ width: '100%', height: 34, borderRadius: 'var(--po-r-sm)', border: '1px solid var(--po-copper-line)', background: 'var(--po-blue-100)', color: 'var(--po-blue-700)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
      >
        View Matches
      </button>
    </div>
  )
}

export function AssistantRail({ onViewMatches }: { onViewMatches: () => void }) {
  const [unavailable, setUnavailable] = useState(false)
  const { messages, input, handleInputChange, handleSubmit, append, isLoading } = useChat({
    api: '/api/chat',
    onError: () => setUnavailable(true),
  })
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const ask = (q: string) => {
    if (!isLoading) append({ role: 'user', content: q })
  }

  return (
    <aside
      className="dash-airail"
      style={{ width: 312, flexShrink: 0, borderLeft: '1px solid var(--po-line)', background: 'var(--po-panel)', display: 'flex', flexDirection: 'column', minHeight: 0 }}
    >
      <div style={{ padding: '16px 16px 12px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <h2 className="po-display" style={{ fontSize: 15, fontWeight: 700, color: 'var(--po-text)', margin: 0 }}>ReentryIQ Assistant</h2>
        <span className="po-mono" style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--po-blue-700)', background: 'var(--po-blue-100)', border: '1px solid var(--po-copper-line)', borderRadius: 4, padding: '2px 6px' }}>BETA</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {unavailable && (
          <div style={{ padding: '10px 12px', borderRadius: 'var(--po-r-sm)', background: 'var(--po-warn-wash)', border: '1px solid var(--po-warn-line)', fontSize: 12, lineHeight: 1.5, color: 'var(--po-text)' }}>
            The assistant needs <span className="po-mono">ANTHROPIC_API_KEY</span> configured on the server. Charts and search still work.
          </div>
        )}

        {messages.map(m =>
          m.role === 'user' ? (
            <div key={m.id} style={{ alignSelf: 'flex-end', maxWidth: '92%', background: 'var(--po-blue-100)', border: '1px solid var(--po-copper-line)', borderRadius: 'var(--po-r)', padding: '9px 13px', fontSize: 12.5, lineHeight: 1.5, color: 'var(--po-text)' }}>
              {m.content}
            </div>
          ) : (
            <div key={m.id} style={{ border: '1px solid var(--po-line)', borderRadius: 'var(--po-r)', padding: '12px 13px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {m.toolInvocations?.map(inv =>
                inv.state === 'result' ? (
                  inv.toolName === 'query_releases' ? (
                    <QueryResultCard key={inv.toolCallId} result={inv.result as QueryResultShape} onViewMatches={onViewMatches} />
                  ) : inv.toolName === 'reveal_record' ? (
                    (() => {
                      const r = (inv.result as RevealShape).record
                      return r ? (
                        <div key={inv.toolCallId} style={{ fontSize: 12, lineHeight: 1.5 }}>
                          <b style={{ color: 'var(--po-text)' }}>{r.name}</b>
                          <span className="po-mono" style={{ color: 'var(--po-text-3)' }}> · ADC {r.adc_number}</span>
                          <div style={{ color: 'var(--po-text-2)' }}>{r.complex} · releases {r.prison_release_date ?? '—'}</div>
                        </div>
                      ) : null
                    })()
                  ) : null
                ) : (
                  <span key={inv.toolCallId} className="po-mono" style={{ fontSize: 10, color: 'var(--po-text-3)' }}>querying…</span>
                ),
              )}
              {m.content && (
                <div style={{ fontSize: 12.5, lineHeight: 1.55, color: 'var(--po-text)', whiteSpace: 'pre-wrap' }}>{m.content}</div>
              )}
              <div style={{ display: 'flex', gap: 10 }}>
                <Icon name="note" size={13} stroke="var(--po-text-3)" />
                <Icon name="check" size={13} stroke="var(--po-text-3)" />
              </div>
            </div>
          ),
        )}

        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div style={{ border: '1px solid var(--po-line)', borderRadius: 'var(--po-r)', padding: '12px 13px', fontSize: 12, color: 'var(--po-text-3)' }}>
            Thinking…
          </div>
        )}
        <div ref={endRef} />

        {/* Suggested questions */}
        {messages.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => ask(s)} disabled={isLoading} style={{ display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left', border: '1px solid var(--po-line)', borderRadius: 'var(--po-r-sm)', background: 'var(--po-panel)', padding: '10px 12px', fontSize: 12.5, fontWeight: 500, color: 'var(--po-blue-700)', cursor: 'pointer', fontFamily: 'inherit', lineHeight: 1.4 }}>
                <span style={{ flex: 1 }}>{s}</span>
                <Icon name="chevronRight" size={14} stroke="var(--po-text-3)" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, padding: '12px 16px', flexShrink: 0 }}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask anything about your data…"
          disabled={isLoading}
          style={{ flex: 1, height: 40, padding: '0 13px', borderRadius: 'var(--po-r)', border: '1px solid var(--po-line-strong)', background: 'var(--po-bg)', fontSize: 12.5, color: 'var(--po-text)', fontFamily: 'inherit', outline: 'none', minWidth: 0 }}
        />
        <button type="submit" disabled={isLoading || !input.trim()} aria-label="Send" style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: 'var(--po-blue)', cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer', opacity: isLoading || !input.trim() ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name="arrowRight" size={16} stroke="var(--po-accent-fg)" />
        </button>
      </form>

      {/* Compliance attestation */}
      <div style={{ margin: '0 16px 16px', border: '1px solid var(--po-sage-line)', background: 'var(--po-sage-wash)', borderRadius: 'var(--po-r)', padding: '13px 14px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
          <Icon name="checkCircle" size={15} stroke="var(--po-sage)" />
          <span className="po-display" style={{ fontSize: 13, fontWeight: 700, color: 'var(--po-text)' }}>Compliance Attestation</span>
        </div>
        <p style={{ fontSize: 11.5, lineHeight: 1.5, color: 'var(--po-text-2)', margin: '0 0 10px' }}>
          You have attested that you are using ReentryIQ for outreach purposes only and will not use the data for employment or housing screening.
        </p>
        <a href="/acceptable-use" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 32, borderRadius: 'var(--po-r-sm)', border: '1px solid var(--po-line-strong)', background: 'var(--po-panel)', color: 'var(--po-text)', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
          View Attestation
        </a>
      </div>
    </aside>
  )
}
