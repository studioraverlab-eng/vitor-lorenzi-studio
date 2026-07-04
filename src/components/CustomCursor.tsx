import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [visible, setVisible]   = useState(false)
  const [hovered, setHovered]   = useState(false)
  const [clicked, setClicked]   = useState(false)

  const dotRef         = useRef<HTMLDivElement>(null)
  const ringWrapRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only for mouse devices
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let tx = -300, ty = -300
    let cx = -300, cy = -300
    let raf: number
    const lerp = (a: number, b: number, n: number) => a + (b - a) * n

    const tick = () => {
      cx = lerp(cx, tx, 0.11)
      cy = lerp(cy, ty, 0.11)
      if (ringWrapRef.current) {
        ringWrapRef.current.style.transform =
          `translate(${cx}px, ${cy}px) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const onMove = (e: MouseEvent) => {
      tx = e.clientX
      ty = e.clientY
      setVisible(true)
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`
      }
    }

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      setHovered(!!el.closest('a, button, [role="button"], input, label, select, textarea'))
    }

    const onDown = () => setClicked(true)
    const onUp   = () => setClicked(false)
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup',   onUp)
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup',   onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
    }
  }, [])

  return (
    <>
      {/* ── Dot — snapps exact to cursor ── */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none rounded-full bg-white"
        style={{
          width: 7,
          height: 7,
          zIndex: 999999,
          willChange: 'transform',
          transform: 'translate(-300px, -300px) translate(-50%, -50%)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.25s',
        }}
      />

      {/* ── Ring wrapper — lerp lag, direct DOM ── */}
      <div
        ref={ringWrapRef}
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          zIndex: 999998,
          willChange: 'transform',
          transform: 'translate(-300px, -300px) translate(-50%, -50%)',
        }}
      >
        {/* Ring visual — Framer Motion handles size + opacity only */}
        <motion.div
          className="rounded-full"
          style={{ border: '1.5px solid rgba(255,255,255,0.78)' }}
          animate={{
            width:  hovered ? 56 : clicked ? 26 : 38,
            height: hovered ? 56 : clicked ? 26 : 38,
            opacity: visible ? (clicked ? 1 : hovered ? 0.9 : 0.62) : 0,
            backgroundColor: hovered ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0)',
            borderColor: hovered
              ? 'rgba(255,255,255,0.95)'
              : 'rgba(255,255,255,0.78)',
          }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </>
  )
}
