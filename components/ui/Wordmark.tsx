interface WordmarkProps {
  size?: number
  href?: string
}

export function Wordmark({ size = 16, href = '/' }: WordmarkProps) {
  const mark = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <svg width={size + 6} height={size + 6} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="var(--po-blue)" strokeWidth="1.9" />
        <path
          d="M8 14.5l2.5-3 2 2.2L16 9"
          stroke="var(--po-blue)"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="po-display"
        style={{ fontSize: size, fontWeight: 600, color: 'var(--po-text)', letterSpacing: '-0.01em' }}
      >
        Reentry<span style={{ color: 'var(--po-blue)', fontWeight: 700 }}>IQ</span>
      </span>
    </div>
  )

  if (href) {
    return (
      <a href={href} style={{ textDecoration: 'none', flexShrink: 0 }}>
        {mark}
      </a>
    )
  }
  return mark
}
