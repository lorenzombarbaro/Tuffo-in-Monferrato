'use client'

import { useEffect } from 'react'

export default function ViewportHeightFix() {
  useEffect(() => {
    function setHeight() {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`)
    }
    setHeight()
    window.addEventListener('resize', setHeight)
    window.addEventListener('orientationchange', setHeight)
    return () => {
      window.removeEventListener('resize', setHeight)
      window.removeEventListener('orientationchange', setHeight)
    }
  }, [])
  return null
}
