'use client'

import { useState } from 'react'
import type { Release } from '@/lib/data-source'
import { Icon } from '@/components/ui/Icon'
import {
  type Filters,
  WINDOW_CHIPS,
  SAVED_SEARCHES,
  OFFENSE_CLASSES,
  applyFilters,
} from './types'

/* Light palette — rail matches the light app shell. */
const N = {
  text: 'var(--po-text)',
  text2: 'var(--po-text-2)',
  text3: 'var(--po-text-3)',
  line: 'var(--po-line)',
  inputBg: 'var(--po-bg)',
  inputBorder: 'var(--po-line-strong)',
  chipOnBg: 'var(--po-copper-wash)',
  chipOnBorder: 'var(--po-copper-line)',
  chipOnText: 'var(--po-blue-700)',
}

function RailLabel({ text }: { text: string }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: N.text3,
      }}
    >
      {text}
    </span>
  )
}

function Section({ label, right, children }: { label: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <RailLabel text={label} />
        {right != null && <span style={{ fontSize: 11, color: N.chipOnText, fontWeight: 600 }}>{right}</span>}
      </div>
      {children}
    </div>
  )
}

function NavySelect({
  value,
  options,
  onChange,
  placeholder,
  icon,
}: {
  value: string
  options: string[]
  onChange: (v: string) => void
  placeholder: string
  icon?: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 9, height: 40, padding: '0 12px',
          borderRadius: 'var(--po-r)', background: N.inputBg, border: `1px solid ${N.inputBorder}`,
          color: N.text, fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        {icon && <Icon name={icon} size={15} stroke={N.text3} />}
        <span style={{ flex: 1, textAlign: 'left', color: value ? N.text : N.text3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value || placeholder}
        </span>
        <Icon name="chevronDown" size={15} stroke={N.text3} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .18s' }} />
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 30 }} onClick={() => setOpen(false)} />
          <div
            style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 31,
              background: 'var(--po-panel)', border: `1px solid ${N.inputBorder}`,
              borderRadius: 'var(--po-r)', padding: 5, maxHeight: 240, overflowY: 'auto',
            }}
          >
            {options.map((o, i) => {
              const active = o === value || (!value && i === 0)
              return (
                <button
                  key={o}
                  onClick={() => { onChange(o); setOpen(false) }}
                  style={{
                    width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 'var(--po-r-sm)',
                    border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13,
                    background: active ? 'var(--po-elevated-2)' : 'transparent',
                    color: active ? N.text : N.text2,
                  }}
                >
                  {o}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export function FilterRail({
  filters,
  setFilters,
  byCounty,
  counties,
  facilities,
  allRows,
  onRunSaved,
}: {
  filters: Filters
  setFilters: (f: Filters) => void
  byCounty: Record<string, number>
  counties: string[]
  facilities: string[]
  allRows: Release[]
  onRunSaved: (f: Filters) => void
}) {
  const set = (patch: Partial<Filters>) => setFilters({ ...filters, ...patch })

  const toggleCounty = (c: string) => {
    const has = filters.counties.includes(c)
    set({ counties: has ? filters.counties.filter(x => x !== c) : [...filters.counties, c] })
  }

  const activeWindow = WINDOW_CHIPS.find(
    w => filters.range && w.range.start === filters.range.start && w.range.end === filters.range.end,
  )

  return (
    <aside
      className="dash-rail"
      style={{
        width: 264, flexShrink: 0, borderRight: `1px solid ${N.line}`,
        background: 'var(--po-panel)', display: 'flex', flexDirection: 'column',
      }}
    >
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 16px 28px' }}>
        {/* Search */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 9, height: 40, padding: '0 12px',
            borderRadius: 'var(--po-r)', background: N.inputBg, border: `1px solid ${N.inputBorder}`,
            marginBottom: 22,
          }}
        >
          <Icon name="search" size={16} stroke={N.text3} />
          <input
            value={filters.q}
            onChange={e => set({ q: e.target.value })}
            placeholder="Name or DOC #"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: N.text, fontSize: 13.5, fontFamily: 'inherit', minWidth: 0 }}
          />
          {filters.q && (
            <button onClick={() => set({ q: '' })} style={{ border: 'none', background: 'transparent', color: N.text3, display: 'flex', padding: 2, cursor: 'pointer' }}>
              <Icon name="x" size={13} />
            </button>
          )}
        </div>

        {/* County scope */}
        <Section label="County Scope" right={filters.counties.length ? `${filters.counties.length} selected` : 'All'}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {counties.map(c => {
              const on = filters.counties.includes(c)
              return (
                <button
                  key={c}
                  onClick={() => toggleCounty(c)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 9, height: 30, padding: '0 8px',
                    borderRadius: 'var(--po-r-sm)', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                    background: 'transparent', color: on ? N.text : N.text2, fontSize: 13,
                  }}
                >
                  <span
                    style={{
                      width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                      border: on ? '1.5px solid var(--po-blue)' : `1.5px solid ${N.inputBorder}`,
                      background: on ? 'var(--po-blue)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {on && <Icon name="check" size={11} stroke="var(--po-accent-fg)" strokeWidth={2.6} />}
                  </span>
                  <span style={{ flex: 1, textAlign: 'left' }}>{c}</span>
                  <span className="po-mono" style={{ fontSize: 11.5, color: N.text3 }}>{byCounty[c] || 0}</span>
                </button>
              )
            })}
          </div>
          {filters.counties.length > 0 && (
            <button
              onClick={() => set({ counties: [] })}
              style={{ border: 'none', background: 'transparent', color: N.chipOnText, fontSize: 12, fontWeight: 600, padding: '8px 4px 0', fontFamily: 'inherit', cursor: 'pointer' }}
            >
              Clear scope
            </button>
          )}
        </Section>

        {/* Release window */}
        <Section label="Release Window">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {WINDOW_CHIPS.map(w => {
              const on = activeWindow?.id === w.id
              return (
                <button
                  key={w.id}
                  onClick={() => set({ range: on ? null : { ...w.range } })}
                  style={{
                    height: 34, borderRadius: 'var(--po-r-sm)', textAlign: 'left', padding: '0 12px',
                    cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, transition: 'all .15s',
                    border: on ? `1px solid ${N.chipOnBorder}` : `1px solid ${N.inputBorder}`,
                    background: on ? N.chipOnBg : N.inputBg,
                    color: on ? N.chipOnText : N.text2,
                    fontWeight: on ? 600 : 500,
                  }}
                >
                  {w.label}
                </button>
              )
            })}
          </div>
        </Section>

        {/* Facility */}
        <Section label="Facility">
          <NavySelect
            value={filters.facility}
            placeholder="All facilities"
            options={['All facilities', ...facilities]}
            onChange={v => set({ facility: v === 'All facilities' ? '' : v })}
            icon="building"
          />
        </Section>

        {/* Offense class */}
        <Section label="Offense Class">
          <NavySelect
            value={filters.offenseClass}
            placeholder="Any class"
            options={['Any class', ...OFFENSE_CLASSES]}
            onChange={v => set({ offenseClass: v === 'Any class' ? '' : v })}
            icon="layers"
          />
        </Section>

        {/* Match score */}
        <Section label="Match Score" right={filters.minScore > 0 ? `${filters.minScore}+` : 'Any'}>
          <input
            type="range" min={0} max={95} step={5}
            value={filters.minScore}
            onChange={e => set({ minScore: +e.target.value })}
            style={{ width: '100%', accentColor: 'var(--po-blue)' }}
          />
          <div className="po-mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: N.text3, marginTop: 4 }}>
            <span>Any</span><span>50</span><span>95+</span>
          </div>
        </Section>

        {/* Saved searches */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingTop: 6, borderTop: `1px solid ${N.line}` }}>
          <RailLabel text="Saved Searches" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {SAVED_SEARCHES.map(s => {
            const matches = applyFilters(allRows, s.filters).length
            return (
              <button
                key={s.id}
                onClick={() => onRunSaved(s.filters)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9, height: 34, padding: '0 8px',
                  borderRadius: 'var(--po-r-sm)', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  background: 'transparent', color: N.text2, fontSize: 13,
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: s.alert ? 'var(--po-sage)' : N.text3 }} />
                <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</span>
                {s.alert && <Icon name="bell" size={13} stroke="var(--po-sage)" />}
                <span className="po-mono" style={{ fontSize: 11.5, color: N.text3 }}>{matches}</span>
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
