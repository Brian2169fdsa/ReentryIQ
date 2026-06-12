import { SiteNav } from '@/components/layout/SiteNav'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { Icon } from '@/components/ui/Icon'

export const metadata = {
  title: 'Data Sourcing — ReentryIQ',
  description: 'Where ReentryIQ data comes from, how it is refreshed, what fields are captured, and how to request corrections.',
}

const FIELDS = [
  { name: 'Full name', note: 'As listed in ADCRR records' },
  { name: 'DOC number', note: 'Arizona Department of Corrections identifier' },
  { name: 'Facility / unit', note: 'Current or last known housing assignment' },
  { name: 'County of release', note: 'Supervision county or release destination' },
  { name: 'Release date', note: 'Projected; subject to change at agency discretion' },
  { name: 'Offense class', note: 'Felony class as recorded by ADCRR' },
  { name: 'Custody level', note: 'Classification level at time of data capture' },
  { name: 'Supervision type', note: 'Parole, probation, absolute discharge, etc.' },
]

export default function DataSourcingPage() {
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
            Data Sourcing
          </div>
          <h1 className="po-display" style={{ fontSize: 40, lineHeight: 1.1, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            Public records. Structured for programs.
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--po-text-2)', margin: 0 }}>
            Every record in ReentryIQ originates from the Arizona Department of Corrections, Rehabilitation &amp; Reentry
            (ADCRR) inmate datasearch — the same public resource available to any member of the public. We
            aggregate it, refresh it daily, and structure it so programs can search, filter, and act on it
            systematically rather than one lookup at a time.
          </p>
        </div>

        {/* Source */}
        <div
          style={{
            background: 'var(--po-blue-100)', border: '1px solid var(--po-copper-line)',
            borderRadius: 'var(--po-r)', padding: '24px 26px', marginBottom: 36,
            display: 'flex', gap: 18, alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              width: 44, height: 44, flexShrink: 0, borderRadius: 10,
              background: 'var(--po-panel)', border: '1px solid var(--po-copper-line)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Icon name="fileText" size={22} stroke="var(--po-blue)" />
          </div>
          <div>
            <h2 className="po-display" style={{ fontSize: 17, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 8px' }}>
              Source: ADCRR Public Inmate Datasearch
            </h2>
            <p style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--po-text-2)', margin: 0 }}>
              The Arizona Department of Corrections, Rehabilitation &amp; Reentry publishes inmate and release information
              as a public record under Arizona law. ReentryIQ reads this public data, normalizes field formats,
              deduplicates records, and makes the result searchable. We do not access any restricted, non-public,
              or law enforcement-exclusive systems. We do not purchase data from commercial brokers or supplement
              ADCRR records with third-party information.
            </p>
          </div>
        </div>

        {/* Refresh cadence */}
        <div style={{ marginBottom: 36 }}>
          <h2 className="po-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
            Refresh cadence
          </h2>
          <p style={{ fontSize: 15.5, lineHeight: 1.75, color: 'var(--po-text-2)', margin: '0 0 14px' }}>
            Our data pipeline runs once per day, typically completing by 6:00 AM MST. Each run fetches the current
            state of the ADCRR public dataset and updates ReentryIQ accordingly. Alerts are dispatched following
            the daily refresh — so if a new release record appears overnight, your saved searches are evaluated
            against the updated data that morning.
          </p>
          <div
            style={{
              display: 'flex', gap: 10, alignItems: 'center',
              background: 'var(--po-panel)', border: '1px solid var(--po-line)',
              borderRadius: 'var(--po-r)', padding: '14px 18px',
              fontSize: 13.5, color: 'var(--po-text-2)',
            }}
          >
            <Icon name="refresh" size={16} stroke="var(--po-blue)" />
            <span>Data is refreshed <strong style={{ color: 'var(--po-text)' }}>once per day</strong>. Release dates in the system reflect the most recent ADCRR publication and may not reflect same-day changes.</span>
          </div>
        </div>

        {/* Fields captured */}
        <div style={{ marginBottom: 36 }}>
          <h2 className="po-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
            Fields captured
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--po-text-2)', margin: '0 0 18px' }}>
            The following fields are captured from ADCRR for each record where the data is available:
          </p>
          <div
            style={{
              background: 'var(--po-panel)', border: '1px solid var(--po-line)',
              borderRadius: 'var(--po-r)', overflow: 'hidden',
            }}
          >
            {FIELDS.map((field, i) => (
              <div
                key={field.name}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 16,
                  padding: '14px 20px',
                  borderBottom: i < FIELDS.length - 1 ? '1px solid var(--po-line)' : 'none',
                }}
              >
                <Icon name="check" size={14} stroke="var(--po-sage)" style={{ marginTop: 3, flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--po-text)' }}>{field.name}</span>
                  <span style={{ fontSize: 13, color: 'var(--po-text-3)' }}>{field.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accuracy caveats */}
        <div style={{ marginBottom: 36 }}>
          <h2 className="po-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
            Accuracy and caveats
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              style={{
                background: 'var(--po-panel)', border: '1px solid var(--po-line)',
                borderRadius: 'var(--po-r)', padding: '18px 20px',
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 6px' }}>Release dates change</h3>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--po-text-2)', margin: 0 }}>
                Projected release dates in ADCRR records can and do change — due to disciplinary action, sentence
                modification, medical holds, or administrative adjustments. We display the date as published by ADCRR
                at the time of our most recent refresh. Always confirm release details directly with the facility or
                supervision office before making commitments based on a specific date.
              </p>
            </div>
            <div
              style={{
                background: 'var(--po-panel)', border: '1px solid var(--po-line)',
                borderRadius: 'var(--po-r)', padding: '18px 20px',
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 6px' }}>We never modify source records</h3>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--po-text-2)', margin: 0 }}>
                ReentryIQ presents ADCRR data as-is. We do not alter, infer, or supplement individual records.
                If a field is blank in the source, it will be blank in ReentryIQ. We do not attempt to fill gaps
                with estimates or third-party data.
              </p>
            </div>
            <div
              style={{
                background: 'var(--po-panel)', border: '1px solid var(--po-line)',
                borderRadius: 'var(--po-r)', padding: '18px 20px',
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--po-text)', margin: '0 0 6px' }}>No private systems accessed</h3>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--po-text-2)', margin: 0 }}>
                ReentryIQ does not access court management systems, law enforcement databases, probation officer
                portals, or any non-public system. Our pipeline is limited to the publicly accessible ADCRR
                datasearch interface.
              </p>
            </div>
          </div>
        </div>

        {/* Corrections & takedowns */}
        <div
          style={{
            background: 'var(--po-panel)', border: '1px solid var(--po-line)',
            borderRadius: 'var(--po-r)', padding: '24px 26px',
          }}
        >
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 12 }}>
            <Icon name="note" size={20} stroke="var(--po-blue)" style={{ marginTop: 2 }} />
            <h2 className="po-display" style={{ fontSize: 17, fontWeight: 700, color: 'var(--po-text)', margin: 0 }}>
              Correction & takedown requests
            </h2>
          </div>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--po-text-2)', margin: '0 0 12px' }}>
            If you believe a record in ReentryIQ contains an error or should be removed, contact us at{' '}
            <a href="mailto:brian@manageai.io" style={{ color: 'var(--po-blue)', textDecoration: 'none' }}>brian@manageai.io</a>{' '}
            with the subject line &ldquo;Record correction request.&rdquo; Include the DOC number or full name and the
            specific issue. We will investigate and, where appropriate, suppress or correct the record within 5 business days.
          </p>
          <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--po-text-3)', margin: 0 }}>
            Note: because our data originates from ADCRR, corrections to the underlying public record must be
            directed to ADCRR. We can suppress a record from ReentryIQ but cannot correct the source data.
          </p>
        </div>

      </main>
      <SiteFooter />
    </div>
  )
}
