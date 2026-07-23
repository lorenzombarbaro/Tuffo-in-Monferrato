'use client'

import { useState } from 'react'
import { FlipIcon } from '@/components/icons/FlipIcon'

const ACCENT = '#F2760E'

export default function FlipCard({ title, summary, onReadMore }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div className="flex flex-col items-center gap-3">
      <div style={{ perspective: '1000px', width: 200, height: 290 }}>
        <div
          onClick={() => setFlipped((f) => !f)}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            cursor: 'pointer',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* FRONTE — dorso della carta */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              borderRadius: 16,
              border: '8px solid white',
              boxShadow: '0 12px 28px rgba(0,0,0,0.18)',
              backgroundColor: '#fff',
              backgroundImage: `
                repeating-linear-gradient(45deg, ${ACCENT}55 0, ${ACCENT}55 1.5px, transparent 1.5px, transparent 5px),
                repeating-linear-gradient(-45deg, ${ACCENT}55 0, ${ACCENT}55 1.5px, transparent 1.5px, transparent 5px)
              `,
            }}
          />

          {/* RETRO — sommario */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              borderRadius: 16,
              border: '8px solid white',
              boxShadow: '0 12px 28px rgba(0,0,0,0.18)',
              backgroundColor: '#ffffff',
              padding: '18px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden',
            }}
          >
            <div>
              <p style={{ fontWeight: 700, fontSize: 15, color: '#241B24', marginBottom: 8, lineHeight: 1.25 }}>
                {title}
              </p>
              <p style={{ fontSize: 12.5, color: '#666', lineHeight: 1.5 }}>{summary}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onReadMore()
              }}
              style={{ color: ACCENT, fontSize: 13, fontWeight: 600, textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            >
              Visualizza contenuto →
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => setFlipped((f) => !f)}
        className="flex flex-col items-center gap-1 text-neutral-700 hover:opacity-70 transition-opacity"
      >
        <FlipIcon size={20} color={ACCENT} strokeWidth={2} />
        <span className="text-xs font-medium">Scopri</span>
      </button>
    </div>
  )
}
