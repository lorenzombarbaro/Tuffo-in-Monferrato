'use client'

import { useEffect } from 'react'

export default function ViewportHeightFix() {
  useEffect(() => {
    function setHeight() {
      const h = window.visualViewport ? window.visualViewport.height : window.innerHeight
      document.documentElement.style.setProperty('--app-height', `${h}px`)
    }

    setHeight()

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', setHeight)
      window.visualViewport.addEventListener('scroll', setHeight)
    }
    window.addEventListener('resize', setHeight)
    window.addEventListener('orientationchange', setHeight)

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', setHeight)
        window.visualViewport.removeEventListener('scroll', setHeight)
      }
      window.removeEventListener('resize', setHeight)
      window.removeEventListener('orientationchange', setHeight)
    }
  }, [])

  return null
}
