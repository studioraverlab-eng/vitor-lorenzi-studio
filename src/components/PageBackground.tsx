import { MeshGradient } from "@paper-design/shaders-react"

export default function PageBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <MeshGradient
        className="w-full h-full"
        width="100%"
        height="100%"
        colors={["#050506", "#0C0C0E", "#1C1C1E", "#3A3A3C", "#8E8E93"]}
        speed={0.3}
        distortion={0.35}
        swirl={0.15}
        grainOverlay={0.04}
      />

      {/* Vignette — keeps edges dark for editorial feel */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 120% at 50% 50%, transparent 25%, rgba(5,5,6,0.6) 100%)",
        }}
      />
    </div>
  )
}
