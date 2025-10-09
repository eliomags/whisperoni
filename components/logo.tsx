export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Tree trunk */}
      <path d="M95 40 L95 80 L105 80 L105 40 Z" fill="currentColor" opacity="0.8" />

      {/* Tree foliage */}
      <circle cx="100" cy="35" r="25" fill="currentColor" opacity="0.6" />
      <circle cx="85" cy="40" r="20" fill="currentColor" opacity="0.6" />
      <circle cx="115" cy="40" r="20" fill="currentColor" opacity="0.6" />

      {/* Swing ropes */}
      <line x1="80" y1="50" x2="75" y2="120" stroke="currentColor" strokeWidth="2" />
      <line x1="120" y1="50" x2="125" y2="120" stroke="currentColor" strokeWidth="2" />

      {/* Swing seat */}
      <rect x="70" y="120" width="60" height="8" rx="4" fill="currentColor" />

      {/* Two people on swing (simplified silhouettes) */}
      {/* Person 1 */}
      <circle cx="85" cy="110" r="8" fill="currentColor" />
      <path
        d="M85 118 L85 135 M85 125 L78 130 M85 125 L92 130"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Person 2 */}
      <circle cx="115" cy="110" r="8" fill="currentColor" />
      <path
        d="M115 118 L115 135 M115 125 L108 130 M115 125 L122 130"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function LogoText({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Logo className="h-10 w-10 text-primary" />
      <span className="font-serif text-2xl font-light tracking-wide text-foreground">whisperoni</span>
    </div>
  )
}
