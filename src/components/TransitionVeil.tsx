import { motion } from 'framer-motion'
import { useCinematicScroll } from '../context/CinematicScroll'

export default function TransitionVeil() {
  const { isNavigating } = useCinematicScroll()

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9990 }}
      animate={{ opacity: isNavigating ? 1 : 0 }}
      transition={
        isNavigating
          ? { duration: 0.16, ease: 'easeIn' }
          : { duration: 0.52, ease: 'easeOut', delay: 0.06 }
      }
    >
      {/* Depth vignette — simulates motion blur / depth-of-field shift */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 90% at 50% 50%, rgba(5,5,6,0.0) 10%, rgba(5,5,6,0.28) 100%)',
        }}
      />
      {/* Subtle global dim */}
      <div className="absolute inset-0" style={{ background: 'rgba(5,5,6,0.09)' }} />
    </motion.div>
  )
}
