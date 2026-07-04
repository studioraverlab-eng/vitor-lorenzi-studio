export default function NoiseOverlay() {
  return (
    <div
      aria-hidden="true"
      className="noise-grain fixed pointer-events-none select-none"
      style={{
        inset: '-30%',
        zIndex: 9,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize: '256px 256px',
        backgroundRepeat: 'repeat',
        opacity: 0.048,
        mixBlendMode: 'overlay',
      }}
    />
  )
}
