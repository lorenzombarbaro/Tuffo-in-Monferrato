export function FlipIcon({ size = 18, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
         strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="7" width="8" height="10" rx="1.2" />
      <path d="M21 7.5a8.5 8.5 0 0 0-7-6.3" strokeWidth={strokeWidth + 0.6} />
      <path d="M21 7.5l-3.4-1.1M21 7.5l-1 3.4" strokeWidth={strokeWidth + 0.6} />
      <path d="M3 16.5a8.5 8.5 0 0 0 7 6.3" strokeWidth={strokeWidth + 0.6} />
      <path d="M3 16.5l3.4 1.1M3 16.5l1-3.4" strokeWidth={strokeWidth + 0.6} />
    </svg>
  )
}
