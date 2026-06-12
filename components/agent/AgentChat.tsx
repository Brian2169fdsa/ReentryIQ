'use client'

import { useChat } from 'ai/react'
import { Icon } from '@/components/ui/Icon'

const STARTERS = [
  'How many releases are coming up in Maricopa this month?',
  'Show me the county breakdown for the next 60 days.',
  'Which facilities have the most releases next week?',
]

export function AgentChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/agent',
  })

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: 820, margin: '0 auto', width: '100%', padding: '0 24px' }}>
      {/* Message list */}
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 32, paddingBottom: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.length === 0 && (
          <div style={{ paddingTop: 48 }}>
            <h1
              className="po-display"
              style={{ fontSize: 28, fontWeight: 700, color: 'var(--po-text)', marginBottom: 8 }}
            >
              Data Assistant
            </h1>
            <p style={{ fontSize: 15, color: 'var(--po-text-2)', marginBottom: 28 }}>
              Ask anything about upcoming releases in Arizona.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {STARTERS.map(s => (
                <button
                  key={s}
                  onClick={() => handleSubmit(new Event('submit') as never, { data: { content: s } })}
                  style={{
                    textAlign: 'left',
                    padding: '12px 16px',
                    background: 'var(--po-panel)',
                    border: '1px solid var(--po-line)',
                    borderRadius: 'var(--po-r)',
                    fontSize: 14,
                    color: 'var(--po-text-2)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(m => (
          <div
            key={m.id}
            style={{
              display: 'flex',
              gap: 12,
              flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                flexShrink: 0,
                borderRadius: '50%',
                background: m.role === 'user' ? 'var(--po-blue)' : 'var(--po-copper-wash)',
                border: m.role === 'assistant' ? '1px solid var(--po-copper-line)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 700,
                color: m.role === 'user' ? '#fff' : 'var(--po-blue)',
              }}
            >
              {m.role === 'user' ? 'U' : 'AI'}
            </div>
            <div
              style={{
                maxWidth: '76%',
                background: m.role === 'user' ? 'var(--po-blue)' : 'var(--po-panel)',
                color: m.role === 'user' ? '#fff' : 'var(--po-text)',
                border: m.role === 'assistant' ? '1px solid var(--po-line)' : 'none',
                borderRadius: 'var(--po-r)',
                padding: '12px 16px',
                fontSize: 14,
                lineHeight: 1.65,
                whiteSpace: 'pre-wrap',
              }}
            >
              {m.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', gap: 12 }}>
            <div
              style={{
                width: 32,
                height: 32,
                flexShrink: 0,
                borderRadius: '50%',
                background: 'var(--po-copper-wash)',
                border: '1px solid var(--po-copper-line)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 700,
                color: 'var(--po-blue)',
              }}
            >
              AI
            </div>
            <div
              style={{
                background: 'var(--po-panel)',
                border: '1px solid var(--po-line)',
                borderRadius: 'var(--po-r)',
                padding: '12px 16px',
                display: 'flex',
                gap: 4,
                alignItems: 'center',
              }}
            >
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: 'var(--po-text-3)',
                    animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                    display: 'inline-block',
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          gap: 10,
          padding: '16px 0 28px',
          borderTop: '1px solid var(--po-line)',
        }}
      >
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask about upcoming releases…"
          disabled={isLoading}
          style={{
            flex: 1,
            height: 48,
            padding: '0 16px',
            borderRadius: 'var(--po-r)',
            border: '1px solid var(--po-line-strong)',
            background: 'var(--po-panel)',
            fontSize: 14,
            color: 'var(--po-text)',
            fontFamily: 'inherit',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--po-r)',
            background: 'var(--po-blue)',
            border: 'none',
            cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
            opacity: isLoading || !input.trim() ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon name="send" size={18} stroke="#fff" />
        </button>
      </form>

      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.85); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
