import PageBackground from '../components/PageBackground'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import BrowserChrome from '../components/BrowserChrome'
import Services from '../components/Services'
import Process from '../components/Process'
import PortfolioTeaser from '../components/PortfolioTeaser'
import Faq from '../components/Faq'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import SectionDivider from '../components/SectionDivider'

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen" tabIndex={-1}>
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
        <BrowserChrome />
        <SectionDivider />
        <Services />
        <SectionDivider />
        <Process />
        <SectionDivider />
        <PortfolioTeaser />
        <SectionDivider />
        <Faq />
        <SectionDivider />
        <Contact />
        <SectionDivider />
        <Footer />
      </div>
    </main>
  )
}
