import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { Icon } from '@/components/ui/Icon'

export const metadata = {
  title: 'Careers — ReentryIQ',
  description: 'Join a small, mission-driven team building release intelligence tools for Arizona reentry and recovery programs.',
}

const VALUES = [
  {
    icon: 'target' as const,
    title: 'Mission over metrics',
    body: 'We measure success by whether programs are reaching people faster and whether those people are getting connected to support. Revenue matters because it lets us keep building — it\'s not the point.',
  },
  {
    icon: 'layers' as const,
    title: 'Small team, real ownership',
    body: 'There are no handoff queues here. If you work on something, you own it end to end — design, build, ship, support. We\'re intentionally small so everyone\'s work has direct impact.',
  },
  {
    icon: 'compass' as const,
    title: 'Grounded in the domain',
    body: 'We talk to reentry coordinators, treatment directors, and case managers constantly. Good software in this space requires understanding the work — who\'s doing it, what they actually need, and what gets in their way.',
  },
]

export default function CareersPage() {
  return (
    <div style={{ background: 'var(--po-bg)', minHeight: '100vh' }}>
      <SiteNav />
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '56px 32px 72px' }}>

        {/* Eyebrow + Hero */}
        <div style={{ marginBottom: 48 }}>
          <div
            style={{
              display: 'inline-block', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--po-blue)', background: 'var(--po-copper-wash)',
              border: '1px solid var(--po-copper-line)', padding: '5px 12px', borderRadius: 999, marginBottom: 18,
            }}
          >
            Careers
          </div>
          <h1 className="po-display" style={{ fontSize: 40, lineHeight: 1.1, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            Small team. Real mission.
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--po-text-2)', margin: '0 0 14px' }}>
            ReentryIQ is built by a small team at Manage AI in Phoenix, Arizona. We&apos;re not a large org with
            a recruiting department — we&apos;re a tight group of people who believe that putting public data in
            the hands of reentry and recovery programs can meaningfully change outcomes for people leaving
            Arizona&apos;s corrections system.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--po-text-2)', margin: 0 }}>
            If that sounds like work you want to be part of, we want to hear from you — even when we don&apos;t
            have a specific opening posted.
          </p>
        </div>

        {/* Open roles — none currently */}
        <div
          style={{
            background: 'var(--po-panel)', border: '1px solid var(--po-line)',
            borderRadius: 'var(--po-r)', padding: '28px 28px', marginBottom: 36,
          }}
        >
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
            <div
              style={{
                width: 44, height: 44, flexShrink: 0, borderRadius: 10,
                background: 'var(--po-copper-wash)', border: '1px solid var(--po-copper-line)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Icon name="list" size={20} stroke="var(--po-blue)" />
            </div>
            <h2 className="po-display" style={{ fontSize: 18, fontWeight: 700, color: 'var(--po-text)', margin: 0 }}>
              Open roles
            </h2>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--po-text-2)', margin: '0 0 20px' }}>
            We don&apos;t have any formal openings right now. That said, we&apos;re always interested in
            hearing from people with strong backgrounds in full-stack engineering (Next.js / TypeScript / PostgreSQL),
            product design, or domain expertise in reentry, recovery, or criminal justice programs.
          </p>
          <div
            style={{
              background: 'var(--po-bg)', border: '1px solid var(--po-line)',
              borderRadius: 'var(--po-r)', padding: '18px 20px',
            }}
          >
            <p className="po-label" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--po-text-3)', textTransform: 'uppercase', margin: '0 0 10px' }}>
              Send a speculative application
            </p>
            <p style={{ fontSize: 13.5, lineHeight: 1.65, color: 'var(--po-text-2)', margin: '0 0 12px' }}>
              Email <a href="mailto:brian@manageai.io" style={{ color: 'var(--po-blue)', textDecoration: 'none' }}>brian@manageai.io</a> with
              a short note on your background and what draws you to this work. No formal cover letter required — just
              tell us who you are, what you&apos;ve built or done, and why reentry and recovery resonates with you.
            </p>
            <div style={{ display: 'flex', gap: 9, alignItems: 'center', fontSize: 13, color: 'var(--po-text-3)' }}>
              <Icon name="clock" size={14} stroke="var(--po-text-3)" />
              We respond to every application personally, even when there&apos;s nothing open.
            </div>
          </div>
        </div>

        {/* Values */}
        <h2 className="po-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 20px', letterSpacing: '-0.01em' }}>
          How we work
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 48 }}>
          {VALUES.map(v => (
            <div
              key={v.title}
              style={{
                background: 'var(--po-panel)', border: '1px solid var(--po-line)',
                borderRadius: 'var(--po-r)', padding: '22px 24px',
                display: 'flex', gap: 18, alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  width: 40, height: 40, flexShrink: 0, borderRadius: 8,
                  background: 'var(--po-copper-wash)', border: '1px solid var(--po-copper-line)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Icon name={v.icon} size={18} stroke="var(--po-blue)" />
              </div>
              <div>
                <h3 className="po-display" style={{ fontSize: 16, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 7px' }}>{v.title}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--po-text-2)', margin: 0 }}>{v.body}</p>
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 13.5, color: 'var(--po-text-3)', lineHeight: 1.6, margin: 0 }}>
          Manage AI is based in Phoenix, Arizona. Remote work is considered for the right candidates.
          We do not work with staffing agencies or recruiters for this role.
        </p>

      </main>
      <SiteFooter />
    </div>
  )
}
