export function FlipIcon({ size = 18, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
         strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="6" width="10" height="12" rx="1.5" />
      <path d="M20 8a7 7 0 0 0-6-5" />
      <path d="M20 8l-3-1M20 8l-1 3" />
      <path d="M4 16a7 7 0 0 0 6 5" />
      <path d="M4 16l3 1M4 16l1-3" />
    </svg>
  )
}
