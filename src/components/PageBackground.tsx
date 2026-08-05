'use client'

import { memo, useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Third-party WebGL component — ssr:false since we can't verify it's
// safe to touch the GPU/canvas context during a server render pass.
const MeshGradient = dynamic(
  () => import("@paper-design/shaders-react").then((m) => m.MeshGradient),
  { ssr: false }
)

const GRADIENT_COLORS = ["#050506", "#0C0C0E", "#1C1C1E", "#3A3A3C", "#8E8E93"]

function PageBackground() {
  const [shaderReady, setShaderReady] = useState(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotion.matches) return

    let timer = 0
    let idleId: number | undefined

    const enableShader = () => {
      timer = window.setTimeout(() => setShaderReady(true), 450)
    }

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(enableShader, { timeout: 1400 })
    } else {
      enableShader()
    }

    return () => {
      window.clearTimeout(timer)
      if (idleId !== undefined && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId)
      }
    }
  }, [])

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 68% 28%, rgba(58,58,60,0.42), transparent 36%), radial-gradient(circle at 28% 70%, rgba(28,28,30,0.82), transparent 48%), #050506',
        }}
      />

      {shaderReady && (
        <MeshGradient
          className="shader-enter h-full w-full"
          width="100%"
          height="100%"
          colors={GRADIENT_COLORS}
          speed={0.2}
          distortion={0.3}
          swirl={0.12}
          grainOverlay={0.025}
          minPixelRatio={1}
          maxPixelCount={854 * 480}
          webGlContextAttributes={{
            alpha: false,
            antialias: false,
            depth: false,
            stencil: false,
            preserveDrawingBuffer: false,
            powerPreference: "low-power",
          }}
        />
      )}

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

export default memo(PageBackground)
