import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CinematicScrollProvider } from './context/CinematicScroll'
import TransitionVeil from './components/TransitionVeil'
import CustomCursor from './components/CustomCursor'
import NoiseOverlay from './components/NoiseOverlay'
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'

export default function App() {
  return (
    <BrowserRouter>
      <CinematicScrollProvider>
        <CustomCursor />
        <NoiseOverlay />
        <TransitionVeil />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
        </Routes>
      </CinematicScrollProvider>
    </BrowserRouter>
  )
}
