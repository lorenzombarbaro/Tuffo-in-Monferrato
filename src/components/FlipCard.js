'use client'

import { useState } from 'react'
import { FlipIcon } from '@/components/icons/FlipIcon'

const ACCENT = '#F2760E'

export default function FlipCard({ title, summary, onReadMore }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div className="flex flex-col items-center gap-3">
      <div style={{ perspective: '1000px', width: 150, height: 210 }}>
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
              borderRadius: 14,
              border: '7px solid white',
              boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
              backgroundColor: '#fff',
              backgroundImage: `
                repeating-linear-gradient(45deg, ${ACCENT}33 0, ${ACCENT}33 1.5px, transparent 1.5px, transparent 10px),
                repeating-linear-gradient(-45deg, ${ACCENT}33 0, ${ACCENT}33 1.5px, transparent 1.5px, transparent 10px)
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
              borderRadius: 14,
              border: '7px solid white',
              boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
              backgroundColor: '#ffffff',
              padding: '16px 14px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, color: '#241B24', marginBottom: 6, lineHeight: 1.25 }}>
                {title}
              </p>
              <p style={{ fontSize: 11.5, color: '#666', lineHeight: 1.45 }}>{summary}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onReadMore()
              }}
              style={{ color: ACCENT, fontSize: 12.5, fontWeight: 600, textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
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
