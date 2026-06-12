import { AgentChat } from '@/components/agent/AgentChat'

export const metadata = {
  title: 'Data Assistant — ReentryIQ',
}

export default function AgentPage() {
  return (
    <div style={{ background: 'var(--po-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          borderBottom: '1px solid var(--po-line)',
          background: 'var(--po-panel)',
          padding: '0 32px',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <a href="/" style={{ textDecoration: 'none', fontSize: 14, color: 'var(--po-text-2)' }}>
          ← ReentryIQ
        </a>
        <span style={{ color: 'var(--po-line-strong)' }}>/</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--po-text)' }}>Data Assistant</span>
      </div>
      <AgentChat />
    </div>
  )
}
