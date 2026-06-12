'use client'

import { useEffect, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import type { InmateRecord, InmateSection } from '@/lib/inmate-record'

/* Status pill tones per spec: Active=brand blue, Inactive=slate,
   Released=blue, Hold/Deceased=danger. */
function statusTone(status: string | null): { bg: string; fg: string; line: string } {
  const s = (status ?? '').toLowerCase()
  if (s === 'active') return { bg: 'var(--po-copper-wash)', fg: 'var(--po-blue-700)', line: 'var(--po-copper-line)' }
  if (s === 'released') return { bg: 'var(--po-blue-100)', fg: 'var(--po-blue-900)', line: 'var(--po-copper-line)' }
  if (s === 'inactive') return { bg: 'var(--po-slate-wash)', fg: 'var(--po-slate)', line: 'var(--po-slate-line)' }
  if (s === 'hold' || s === 'deceased') return { bg: 'var(--po-danger-wash)', fg: 'var(--po-danger)', line: 'var(--po-danger-line)' }
  return { bg: 'var(--po-track)', fg: 'var(--po-text-2)', line: 'var(--po-line)' }
}

const dash = (v: unknown): string => (v === null || v === undefined || v === '' ? '—' : String(v))

const MONO_KEY = /(date|number|cause|adc|id|begin|hours|risk|sentence$)/i
const looksMono = (key: string, v: unknown) =>
  MONO_KEY.test(key) || (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v)) || typeof v === 'number'

function titleCase(key: string) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function fmtDate(iso: string | null) {
  if (!iso) return '—'
  const d = new Date(iso + 'T00:00:00')
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function daysUntil(iso: string | null): number | null {
  if (!iso) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(iso + 'T00:00:00')
  if (isNaN(d.getTime())) return null
  return Math.round((d.getTime() - today.getTime()) / 86400000)
}

/* ── Pieces ────────────────────────────────────────────────────── */

function KV({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
      <span className="po-label" style={{ fontSize: 10 }}>{label}</span>
      <span className={mono ? 'po-mono' : undefined} style={{ fontSize: 13, color: 'var(--po-text)', overflowWrap: 'anywhere' }}>
        {value}
      </span>
    </div>
  )
}

function SectionTable({ section }: { section: InmateSection }) {
  const [open, setOpen] = useState(section.rows.length > 0)
  const cols = section.rows.length ? Object.keys(section.rows[0]) : []
  return (
    <div style={{ border: '1px solid var(--po-line)', borderRadius: 'var(--po-r-sm)', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '11px 14px',
          border: 'none', background: 'var(--po-panel-2)', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
        }}
      >
        <Icon
          name="chevronRight"
          size={14}
          stroke="var(--po-text-3)"
          style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.16s' }}
        />
        <span className="po-display" style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'var(--po-text)' }}>
          {section.title}
        </span>
        <span className="po-mono" style={{ fontSize: 12, color: 'var(--po-text-3)' }}>({section.rows.length})</span>
      </button>
      {open && (
        section.rows.length === 0 ? (
          <div style={{ padding: '12px 14px', fontSize: 12.5, color: 'var(--po-text-3)', borderTop: '1px solid var(--po-line)' }}>
            No records.
          </div>
        ) : (
          <div style={{ overflowX: 'auto', borderTop: '1px solid var(--po-line)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr>
                  {cols.map(c => (
                    <th key={c} className="po-label" style={{ padding: '7px 12px', textAlign: 'left', fontSize: 9.5, whiteSpace: 'nowrap', background: 'var(--po-panel)' }}>
                      {titleCase(c)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 ? 'var(--po-panel-2)' : 'var(--po-panel)' }}>
                    {cols.map(c => (
                      <td
                        key={c}
                        className={looksMono(c, row[c]) ? 'po-mono' : undefined}
                        style={{ padding: '7px 12px', color: 'var(--po-text)', whiteSpace: 'nowrap', borderTop: '1px solid var(--po-line)' }}
                      >
                        {dash(row[c])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  )
}

/* ── Panel ─────────────────────────────────────────────────────── */

export function InmatePanel({ adc, onClose }: { adc: string | null; onClose: () => void }) {
  const [record, setRecord] = useState<InmateRecord | null>(null)
  const [source, setSource] = useState<'live' | 'demo'>('demo')
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    if (!adc) return
    setState('loading')
    setRecord(null)
    fetch(`/api/records/${adc}`)
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(d => {
        setRecord(d.record)
        setSource(d.source)
        setState('ready')
      })
      .catch(() => setState('error'))
  }, [adc])

  useEffect(() => {
    if (!adc) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [adc, onClose])

  if (!adc) return null

  const tone = statusTone(record?.status ?? null)
  const countdown = daysUntil(record?.prison_release_date ?? null)

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'var(--po-navy)', opacity: 0.45, zIndex: 59 }} />
      <aside
        role="dialog"
        aria-label="Inmate record"
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: 480, maxWidth: '96vw',
          background: 'var(--po-panel)', borderLeft: '1px solid var(--po-line)', zIndex: 60,
          display: 'flex', flexDirection: 'column', animation: 'inmate-panel-in 0.22s ease',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', gap: 14, padding: '18px 20px', borderBottom: '1px solid var(--po-line)', flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/mugshot/${adc}`}
            alt={record ? `${record.first_name} ${record.last_name}` : 'Record photo'}
            width={72}
            height={90}
            style={{ width: 72, height: 90, objectFit: 'cover', borderRadius: 'var(--po-r-sm)', border: '1px solid var(--po-line)', background: 'var(--po-track)', flexShrink: 0 }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
              <h2 className="po-display" style={{ fontSize: 19, fontWeight: 700, color: 'var(--po-text)', margin: 0, lineHeight: 1.2 }}>
                {record
                  ? `${record.last_name}, ${record.first_name}${record.middle_initial ? ' ' + record.middle_initial : ''}`
                  : state === 'loading' ? 'Loading…' : 'Record'}
              </h2>
              <button onClick={onClose} aria-label="Close" style={{ width: 30, height: 30, borderRadius: 7, border: 'none', background: 'transparent', color: 'var(--po-text-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <Icon name="x" size={16} />
              </button>
            </div>
            <div className="po-mono" style={{ fontSize: 12.5, color: 'var(--po-text-2)', marginTop: 4 }}>
              ADC {adc}
            </div>
            <div style={{ display: 'flex', gap: 7, marginTop: 9, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ padding: '3px 11px', borderRadius: 999, fontSize: 11.5, fontWeight: 600, background: tone.bg, color: tone.fg, border: `1px solid ${tone.line}` }}>
                {dash(record?.status)}
              </span>
              <span style={{ fontSize: 12, color: 'var(--po-text-2)' }}>Custody: <b style={{ color: 'var(--po-text)' }}>{dash(record?.custody_class)}</b></span>
              {source === 'demo' && state === 'ready' && (
                <span className="po-mono" style={{ fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--po-text-3)', border: '1px dashed var(--po-line-strong)', borderRadius: 5, padding: '2px 7px' }}>
                  Sample
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {state === 'error' && (
            <div style={{ padding: '12px 14px', borderRadius: 'var(--po-r-sm)', background: 'var(--po-danger-wash)', border: '1px solid var(--po-danger-line)', color: 'var(--po-danger)', fontSize: 13 }}>
              Couldn&apos;t load this record. Close and try again.
            </div>
          )}

          {state === 'loading' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[88, 64, 120].map((h, i) => (
                <div key={i} style={{ height: h, borderRadius: 'var(--po-r-sm)', background: 'var(--po-track)', animation: 'inmate-skel 1.3s ease-in-out infinite' }} />
              ))}
            </div>
          )}

          {state === 'ready' && record && (
            <>
              {/* Release block — the product's whole point */}
              <div style={{ border: '1px solid var(--po-copper-line)', background: 'var(--po-blue-100)', borderRadius: 'var(--po-r)', padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                  <div>
                    <div className="po-label" style={{ fontSize: 10, marginBottom: 5 }}>Prison Release Date</div>
                    <div className="po-display" style={{ fontSize: 26, fontWeight: 700, color: 'var(--po-text)', lineHeight: 1.1 }}>
                      {fmtDate(record.prison_release_date)}
                    </div>
                  </div>
                  {countdown !== null && countdown >= 0 && countdown < 90 && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 999, fontSize: 11.5, fontWeight: 700, background: 'var(--po-warn-wash)', color: 'var(--po-warn)', border: '1px solid var(--po-warn-line)', whiteSpace: 'nowrap' }}>
                      <Icon name="clock" size={12} stroke="var(--po-warn)" />
                      {countdown === 0 ? 'Today' : `${countdown} days`}
                    </span>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 13 }}>
                  <KV label="Release Type" value={dash(record.release_type)} />
                  <KV label="Admission" value={fmtDate(record.admission_date)} mono />
                  <KV label="Proj. Eligible" value={fmtDate(record.projected_eligible_release_date)} mono />
                </div>
              </div>

              {/* Demographics */}
              <div style={{ border: '1px solid var(--po-line)', borderRadius: 'var(--po-r-sm)', padding: '13px 16px' }}>
                <div className="po-label" style={{ fontSize: 10, marginBottom: 10 }}>Demographics</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  <KV label="Gender" value={dash(record.gender)} />
                  <KV label="Age" value={dash(record.age)} mono />
                  <KV label="Height" value={dash(record.height)} mono />
                  <KV label="Weight" value={dash(record.weight)} mono />
                  <KV label="Hair" value={dash(record.hair)} />
                  <KV label="Eye" value={dash(record.eye)} />
                  <KV label="Ethnic Origin" value={dash(record.ethnic_origin)} />
                </div>
              </div>

              {/* Custody & Location */}
              <div style={{ border: '1px solid var(--po-line)', borderRadius: 'var(--po-r-sm)', padding: '13px 16px' }}>
                <div className="po-label" style={{ fontSize: 10, marginBottom: 10 }}>Custody &amp; Location</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <KV label="Complex" value={dash(record.complex)} />
                  <KV label="Unit" value={dash(record.unit)} />
                  <KV label="Last Movement" value={dash(record.last_movement)} />
                  <KV label="As Of" value={fmtDate(record.as_of_date)} mono />
                  <KV label="Status" value={dash(record.status)} />
                </div>
              </div>

              {/* Child record tables, SECTION_SCHEMAS order */}
              {record.sections.map(s => (
                <SectionTable key={s.key} section={s} />
              ))}

              <p style={{ fontSize: 11, color: 'var(--po-text-3)', margin: '4px 0 0', lineHeight: 1.5 }}>
                Public ADCRR record · dates subject to change at the agency&apos;s discretion · not for FCRA-covered screening.
              </p>
            </>
          )}
        </div>
      </aside>
      <style>{`
        @keyframes inmate-panel-in { from { transform: translateX(30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes inmate-skel { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
      `}</style>
    </>
  )
}
