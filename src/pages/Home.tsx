import PageBackground from '../components/PageBackground'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import Services from '../components/Services'
import Process from '../components/Process'
import PortfolioTeaser from '../components/PortfolioTeaser'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import SectionDivider from '../components/SectionDivider'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Animated shader — fixed, underlies full page */}
      <PageBackground />

      {/* page-content: GSAP target for cinematic scale compression on navigation */}
      <div
        id="page-content"
        className="relative"
        style={{ zIndex: 1, willChange: 'transform' }}
      >
        <Navbar />
        <Hero />
        <SectionDivider />
        <About />
        <SectionDivider />
        <Services />
        <SectionDivider />
        <Process />
        <SectionDivider />
        <PortfolioTeaser />
        <SectionDivider />
        <Contact />
        <SectionDivider />
        <Footer />
      </div>
    </div>
  )
}
