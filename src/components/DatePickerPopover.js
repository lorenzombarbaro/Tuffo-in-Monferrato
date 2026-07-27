'use client'

import { useEffect, useRef, useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

const ACCENT = '#F2760E'
const MONTHS = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre']
const DAYS = ['L','M','M','G','V','S','D']

function toISO(d) { return d.toISOString().slice(0, 10) }

export default function DatePickerPopover({ value, onChange, placeholder = 'Seleziona' }) {
  const [open, setOpen] = useState(false)
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date())
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const startOffset = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  function selectDay(d) {
    onChange(toISO(new Date(year, month, d)))
    setOpen(false)
  }

  const displayValue = value
    ? new Date(value).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : ''

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-sm border border-black/10 rounded-md px-2.5 py-2 text-neutral-700 hover:border-black/20 transition-colors"
      >
        <Calendar size={14} color={ACCENT} />
        {displayValue || <span className="text-neutral-400">{placeholder}</span>}
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-black/5 p-3 z-40 w-64">
          <div className="flex items-center justify-between mb-2">
            <button type="button" onClick={() => setViewDate(new Date(year, month - 1, 1))} className="p-1 hover:bg-black/5 rounded">
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium text-neutral-800">{MONTHS[month]} {year}</span>
            <button type="button" onClick={() => setViewDate(new Date(year, month + 1, 1))} className="p-1 hover:bg-black/5 rounded">
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS.map((d, i) => <div key={i} className="text-[10px] text-neutral-400 text-center">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (!d) return <div key={i} />
              const dt = toISO(new Date(year, month, d))
              const isSelected = value === dt
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectDay(d)}
                  className="w-8 h-8 text-xs rounded-full flex items-center justify-center transition-colors"
                  style={{ background: isSelected ? ACCENT : 'transparent', color: isSelected ? '#fff' : '#404040', fontWeight: isSelected ? 600 : 400 }}
                >
                  {d}
                </button>
              )
            })}
          </div>
          {value && (
            <button type="button" onClick={() => { onChange(null); setOpen(false) }} className="text-xs text-neutral-400 mt-2 hover:text-neutral-700">
              Cancella data
            </button>
          )}
        </div>
      )}
    </div>
  )
}
