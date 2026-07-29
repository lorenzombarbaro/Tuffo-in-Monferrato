'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

const ACCENT = '#F2760E'
const MONTHS = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre']
const DAYS = ['L','M','M','G','V','S','D']

function toISO(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function DatePickerPopover({ value, onChange, placeholder = 'Seleziona' }) {
  const [open, setOpen] = useState(false)
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date())
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const [mounted, setMounted] = useState(false)
  
  const buttonRef = useRef(null)
  const popoverRef = useRef(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setCoords({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      })
    }
  }

  const handleToggle = () => {
    if (!open) {
      updatePosition()
    }
    setOpen((o) => !o)
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        buttonRef.current && !buttonRef.current.contains(e.target) &&
        popoverRef.current && !popoverRef.current.contains(e.target)
      ) {
        setOpen(false)
      }
    }

    function handleScrollOrResize() {
      if (open) {
        updatePosition()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', handleScrollOrResize, true)
    window.addEventListener('resize', handleScrollOrResize)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleScrollOrResize, true)
      window.removeEventListener('resize', handleScrollOrResize)
    }
  }, [open])

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

  const popoverContent = open && mounted ? (
    <div
      ref={popoverRef}
      style={{
        position: 'absolute',
        top: `${coords.top}px`,
        left: `${coords.left}px`,
      }}
      className="bg-white rounded-lg shadow-2xl border border-black/10 p-3 z-[9999] w-64 text-left"
    >
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
        {DAYS.map((d, i) => <div key={i} className="text-[10px] text-neutral-400 text-center font-medium">{d}</div>)}
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
        <button type="button" onClick={() => { onChange(null); setOpen(false) }} className="text-xs text-neutral-400 mt-2 hover:text-neutral-700 block w-full text-center pt-1 border-t border-black/5">
          Cancella data
        </button>
      )}
    </div>
  ) : null

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="flex items-center gap-1.5 text-sm border border-black/10 bg-white rounded-md px-2.5 py-2 text-neutral-700 hover:border-black/20 transition-colors"
      >
        <Calendar size={14} color={ACCENT} />
        {displayValue || <span className="text-neutral-400">{placeholder}</span>}
      </button>

      {mounted && createPortal(popoverContent, document.body)}
    </>
  )
}
