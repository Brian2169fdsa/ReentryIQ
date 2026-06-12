'use client'

import { useEffect, useState } from 'react'
import type { Release } from '@/lib/data-source'
import { Icon } from '@/components/ui/Icon'
import { fmtLongDate, scoreTier } from './types'

const CRM_TARGETS = ['Salesforce', 'KIPU', 'Sunwave', 'Webhook'] as const
type CrmTarget = (typeof CRM_TARGETS)[number]

function ScorePill({ score }: { score: number }) {
  const tier = scoreTier(score)
  return (
    <span
      className="po-mono"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 11px', borderRadius: 999,
        fontSize: 12, fontWeight: 600, background: tier.bg, color: tier.color, border: `1px solid ${tier.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      Score {score} · {tier.label}
    </span>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div className="po-label" style={{ marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 14, color: 'var(--po-text)', fontWeight: 500 }}>{children}</div>
    </div>
  )
}

export function RecordDrawer({ record, onClose }: { record: Release | null; onClose: () => void }) {
  const [queued, setQueued] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)

  // Reset transient state when the record changes.
  useEffect(() => {
    setQueued({})
    setSaved(false)
  }, [record?.id])

  // Esc to close + lock body scroll while open.
  useEffect(() => {
    if (!record) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [record, onClose])

  if (!record) return null

  const days = record.days_out
  const queue = (t: CrmTarget) => setQueued(q => ({ ...q, [t]: true }))

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', zIndex: 49 }} />
      <div
        key={record.id}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, maxWidth: '94vw',
          background: 'var(--po-panel)', borderLeft: '1px solid var(--po-line)', zIndex: 50,
          display: 'flex', flexDirection: 'column', animation: 'dash-drawer-in 0.22s ease',
        }}
      >
        {/* header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, padding: '18px 20px', borderBottom: '1px solid var(--po-line)', flexShrink: 0 }}>
          <div style={{ minWidth: 0 }}>
            <h2 className="po-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--po-text)', margin: 0, letterSpacing: '-0.02em', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {record.name}
            </h2>
            <div style={{ marginTop: 8 }}><ScorePill score={record.score} /></div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ width: 32, height: 32, borderRadius: 7, border: 'none', background: 'transparent', color: 'var(--po-text-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
          >
            <Icon name="x" size={17} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {/* ID block */}
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', padding: '12px 14px', borderRadius: 'var(--po-r)', background: 'var(--po-panel-2)', border: '1px solid var(--po-line)', marginBottom: 20 }}>
            <div>
              <div className="po-label" style={{ marginBottom: 4 }}>DOC #</div>
              <div className="po-mono" style={{ fontSize: 13.5, color: 'var(--po-text)' }}>{record.doc_number}</div>
            </div>
            <div>
              <div className="po-label" style={{ marginBottom: 4 }}>ReentryIQ ID</div>
              <div className="po-mono" style={{ fontSize: 13.5, color: 'var(--po-text-2)' }}>{record.id}</div>
            </div>
          </div>

          {/* detail grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 18px' }}>
            <Field label="Facility / Unit">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Icon name="building" size={15} stroke="var(--po-text-3)" /> {record.facility} · {record.unit}
              </span>
            </Field>
            <Field label="County">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Icon name="mapPin" size={15} stroke="var(--po-blue)" /> {record.county}
              </span>
            </Field>
            <Field label="Release date">
              <span className="po-mono" style={{ fontSize: 13 }}>{fmtLongDate(record.release_date)}</span>
              <div style={{ fontSize: 12, color: days <= 30 ? 'var(--po-blue-700)' : 'var(--po-text-3)', fontWeight: 600, marginTop: 2 }}>
                in {days} days
              </div>
            </Field>
            <Field label="Offense class">{record.offense_class}</Field>
            <Field label="Custody">{record.custody}</Field>
            <Field label="Supervision">{record.supervision}</Field>
            <Field label="Sentence"><span className="po-mono">{record.sentence_years.toFixed(1)} yrs</span></Field>
            <Field label="Age"><span className="po-mono">{record.age}</span></Field>
          </div>

          {/* Push to CRM */}
          <div style={{ marginTop: 24 }}>
            <div className="po-label" style={{ marginBottom: 10 }}>Push to CRM</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {CRM_TARGETS.map(t => {
                const done = queued[t]
                return (
                  <button
                    key={t}
                    onClick={() => queue(t)}
                    disabled={done}
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, height: 40,
                      borderRadius: 'var(--po-r-sm)', cursor: done ? 'default' : 'pointer', fontFamily: 'inherit',
                      fontSize: 13, fontWeight: 600,
                      border: done ? '1px solid var(--po-sage-line)' : '1px solid var(--po-line-strong)',
                      background: done ? 'var(--po-sage-wash)' : 'var(--po-panel)',
                      color: done ? 'var(--po-sage)' : 'var(--po-text)',
                      transition: 'background .15s, color .15s, border-color .15s',
                    }}
                  >
                    {done ? <><Icon name="check" size={14} stroke="var(--po-sage)" strokeWidth={2.4} /> Queued</> : t}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Save & alert */}
          <button
            onClick={() => setSaved(s => !s)}
            style={{
              width: '100%', marginTop: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              height: 42, borderRadius: 'var(--po-r)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600,
              border: saved ? '1px solid var(--po-sage-line)' : '1px solid var(--po-line-strong)',
              background: saved ? 'var(--po-sage-wash)' : 'transparent',
              color: saved ? 'var(--po-sage)' : 'var(--po-text-2)',
              transition: 'background .15s, color .15s, border-color .15s',
            }}
          >
            <Icon name="bell" size={15} stroke={saved ? 'var(--po-sage)' : 'var(--po-text-2)'} />
            {saved ? 'Alert saved' : 'Save & alert'}
          </button>

          {/* footer microcopy */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 20, padding: '11px 13px', borderRadius: 'var(--po-r-sm)', background: 'var(--po-panel-2)' }}>
            <Icon name="shield" size={14} stroke="var(--po-text-3)" style={{ marginTop: 1 }} />
            <span style={{ fontSize: 11.5, color: 'var(--po-text-3)', lineHeight: 1.5 }}>
              Sourced from public ADCRR records. Release date subject to change. Outreach use only — not for FCRA-covered screening.
            </span>
          </div>
        </div>
      </div>
      <style>{`@keyframes dash-drawer-in { from { transform: translateX(28px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </>
  )
}
