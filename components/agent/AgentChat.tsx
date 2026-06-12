'use client'

import { useEffect, useRef } from 'react'
import { useChat } from 'ai/react'
import { Icon } from '@/components/ui/Icon'
import { ReleasesDash, CountySummaryDash, DailyVolumeDash } from '@/components/agent/Dashboards'

const SUGGESTIONS = [
  'Releases by county, next 60 days',
  'High-propensity releases into Maricopa this month',
  'Weekly release volume for the next 90 days',
  'Who is releasing from ASPC-Lewis next week?',
  'Pima vs Pinal release trend',
]

const DASH_BY_TOOL: Record<string, React.ComponentType<{ result: never }>> = {
  searchReleases: ReleasesDash as never,
  getCountySummary: CountySummaryDash as never,
  getDailyVolume: DailyVolumeDash as never,
}

const TOOL_LABEL: Record<string, string> = {
  searchReleases: 'search_releases',
  getCountySummary: 'county_summary',
  getDailyVolume: 'daily_volume',
}

export function AgentChat() {
  const { messages, input, handleInputChange, handleSubmit, append, isLoading } = useChat({
    api: '/api/agent',
  })
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const ask = (q: string) => {
    if (!isLoading) append({ role: 'user', content: q })
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: 880, margin: '0 auto', width: '100%', padding: '0 24px', minHeight: 0 }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 28, paddingBottom: 12, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {messages.length === 0 && (
          <div style={{ paddingTop: 40, textAlign: 'center' }}>
            <div
              style={{
                width: 52, height: 52, borderRadius: 14, margin: '0 auto 18px',
                background: 'var(--po-copper-wash)', border: '1px solid var(--po-copper-line)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Icon name="sparkles" size={24} stroke="var(--po-blue)" />
            </div>
            <h1 className="po-display" style={{ fontSize: 26, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 8px' }}>
              ReentryIQ Data Assistant
            </h1>
            <p style={{ fontSize: 14.5, color: 'var(--po-text-2)', margin: '0 0 6px' }}>
              Ask about upcoming releases — answers come back as interactive dashboards.
            </p>
            <p style={{ fontSize: 12, color: 'var(--po-text-3)', margin: 0 }}>
              Queries are read-only · sourced from public ADCRR records
            </p>
          </div>
        )}

        {messages.map(m =>
          m.role === 'user' ? (
            /* User: navy pill, right-aligned */
            <div key={m.id} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div
                style={{
                  maxWidth: '78%', background: 'var(--po-navy)', color: '#fff',
                  borderRadius: 'var(--po-r)', padding: '11px 17px',
                  fontSize: 14, lineHeight: 1.55, fontWeight: 500,
                }}
              >
                {m.content}
              </div>
            </div>
          ) : (
            /* Assistant: avatar + card with dashboards + text */
            <div key={m.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div
                style={{
                  width: 30, height: 30, flexShrink: 0, borderRadius: 8, marginTop: 2,
                  background: 'var(--po-navy)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Icon name="sparkles" size={15} stroke="#fff" />
              </div>
              <div
                style={{
                  flex: 1, minWidth: 0, background: 'var(--po-panel)',
                  border: '1px solid var(--po-line)', borderRadius: 'var(--po-r)',
                  padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14,
                }}
              >
                {/* Tool chips + dashboards */}
                {m.toolInvocations?.map(inv => (
                  <div key={inv.toolCallId} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <span
                      style={{
                        alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 7,
                        padding: '4px 12px', borderRadius: 999,
                        background: 'var(--po-copper-wash)', border: '1px solid var(--po-copper-line)',
                        fontSize: 11.5, fontWeight: 600, color: 'var(--po-blue-700)',
                      }}
                      className="po-mono"
                    >
                      <i
                        style={{
                          width: 7, height: 7, borderRadius: '50%', display: 'inline-block',
                          background: inv.state === 'result' ? 'var(--po-sage)' : 'var(--po-blue)',
                        }}
                      />
                      {TOOL_LABEL[inv.toolName] ?? inv.toolName}
                    </span>
                    {inv.state === 'result' &&
                      (() => {
                        const Dash = DASH_BY_TOOL[inv.toolName]
                        return Dash ? <Dash result={inv.result as never} /> : null
                      })()}
                  </div>
                ))}

                {/* Streamed text */}
                {m.content && (
                  <div style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--po-text)', whiteSpace: 'pre-wrap' }}>
                    {m.content}
                  </div>
                )}
              </div>
            </div>
          ),
        )}

        {/* Thinking indicator */}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div
              style={{
                width: 30, height: 30, flexShrink: 0, borderRadius: 8, marginTop: 2,
                background: 'var(--po-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Icon name="sparkles" size={15} stroke="#fff" />
            </div>
            <div
              style={{
                background: 'var(--po-panel)', border: '1px solid var(--po-line)',
                borderRadius: 'var(--po-r)', padding: '14px 18px',
                display: 'flex', gap: 5, alignItems: 'center',
              }}
            >
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  style={{
                    width: 7, height: 7, borderRadius: '50%', background: 'var(--po-blue)',
                    animation: `aichat-pulse 1.2s ease-in-out ${i * 0.2}s infinite`, display: 'inline-block',
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggestion chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingBottom: 12 }}>
        {SUGGESTIONS.map(s => (
          <button
            key={s}
            onClick={() => ask(s)}
            disabled={isLoading}
            style={{
              padding: '7px 14px', borderRadius: 999,
              border: '1px solid var(--po-line-strong)', background: 'var(--po-panel)',
              fontSize: 12.5, fontWeight: 500, color: 'var(--po-text-2)',
              cursor: isLoading ? 'default' : 'pointer', fontFamily: 'inherit',
              opacity: isLoading ? 0.55 : 1, transition: 'border-color 0.12s, color 0.12s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--po-copper-line)'
              e.currentTarget.style.color = 'var(--po-blue-700)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--po-line-strong)'
              e.currentTarget.style.color = 'var(--po-text-2)'
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10 }}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask about releases, counties, facilities, trends…"
          disabled={isLoading}
          style={{
            flex: 1, height: 50, padding: '0 18px', borderRadius: 'var(--po-r)',
            border: '1px solid var(--po-line-strong)', background: 'var(--po-panel)',
            fontSize: 14, color: 'var(--po-text)', fontFamily: 'inherit', outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          aria-label="Send"
          style={{
            width: 50, height: 50, borderRadius: 'var(--po-r)', background: 'var(--po-blue)',
            border: 'none', cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
            opacity: isLoading || !input.trim() ? 0.5 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
        >
          <Icon name="send" size={19} stroke="#fff" />
        </button>
      </form>

      {/* Footer */}
      <div
        style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: 12, flexWrap: 'wrap', padding: '12px 2px 20px',
          fontSize: 11.5, color: 'var(--po-text-3)',
        }}
      >
        <span>
          Powered by <b style={{ color: 'var(--po-text-2)', letterSpacing: '0.04em' }}>MANAGE AI</b>
        </span>
        <span>Queries are read-only · Not for FCRA-covered screening</span>
      </div>

      <style>{`
        @keyframes aichat-pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.85); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
