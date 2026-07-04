export default function SectionDivider() {
  return (
    <div aria-hidden="true" className="relative h-px overflow-visible pointer-events-none">
      {/* Soft diffuse glow centered on the line */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: '-9px',
          height: '19px',
          background:
            'radial-gradient(ellipse 55% 100% at 50% 50%, rgba(255,255,255,0.018) 0%, transparent 100%)',
        }}
      />
      {/* The hairline */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.055) 20%, rgba(255,255,255,0.065) 50%, rgba(255,255,255,0.055) 80%, transparent 100%)',
        }}
      />
    </div>
  )
}
