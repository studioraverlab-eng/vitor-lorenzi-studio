import type React from "react"
import { useEffect, useRef, useCallback, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ExternalLink, ArrowLeft } from "lucide-react"
import PageBackground from "../components/PageBackground"
import SectionDivider from "../components/SectionDivider"
import { useCinematicScroll } from "../context/CinematicScroll"

interface PortfolioProject {
  id: string
  company: string
  category: string
  description: string
  created: string
  goal: string
  image: string
  url: string
  rotation: number
}

const projects: PortfolioProject[] = [
  {
    id: "raver-lab",
    company: "Raver Lab",
    category: "Marca autoral / E-commerce / Cultura eletrônica",
    description: "Marca conectada à cultura da música eletrônica, estética underground e moda autoral.",
    created: "Direção criativa, e-commerce, experiência Lab, narrativa de produto e estrutura digital.",
    goal: "Criar uma experiência que funcionasse como marca, loja e plataforma cultural ao mesmo tempo.",
    image: "/portfolio/raver-lab.jpg",
    url: "https://raverlab.com.br",
    rotation: -12,
  },
  {
    id: "paulo-lorenzi",
    company: "Paulo Lorenzi",
    category: "Landing page / Imóveis de alto padrão",
    description: "Projeto de presença digital para um profissional do mercado imobiliário premium.",
    created: "Landing page pessoal, hero institucional, estrutura de contato, apresentação de serviço e direção visual.",
    goal: "Transmitir confiança, sofisticação e facilitar a conversão de clientes interessados.",
    image: "/portfolio/paulo-lorenzi.jpg",
    url: "https://SEU-LINK-AQUI.com",
    rotation: 8,
  },
  {
    id: "janaina-campos",
    company: "Janaina Campos",
    category: "Landing page / Social media / Marca pessoal",
    description: "Página criada para apresentar uma profissional de social media com clareza, autoridade e proximidade.",
    created: "Estrutura de landing page, copy, hierarquia visual, apresentação de diferenciais e CTA de contato.",
    goal: "Conectar a profissional com o público certo e transformar interesse em conversa.",
    image: "/portfolio/janaina-campos.jpg",
    url: "https://SEU-LINK-AQUI.com",
    rotation: -6,
  },
  {
    id: "portfolio-studio",
    company: "Vitor Lorenzi Studio",
    category: "Portfólio / Designer / Identidade digital",
    description: "Landing page pessoal criada para apresentar serviços, visão criativa e projetos selecionados.",
    created: "Direção visual, estrutura de apresentação, seções de serviços, portfólio e experiência responsiva.",
    goal: "Criar uma presença digital premium para vender design, sites e direção criativa.",
    image: "/portfolio/vitor-lorenzi-studio.jpg",
    url: "https://SEU-LINK-AQUI.com",
    rotation: 14,
  },
  {
    id: "branding-project",
    company: "Branding Project",
    category: "Identidade visual / Sistema de marca",
    description: "Projeto focado em transformar uma ideia de negócio em uma presença visual consistente.",
    created: "Direção de logo, tipografia, paleta, linguagem visual e aplicação da identidade.",
    goal: "Construir uma marca com personalidade, clareza e percepção profissional.",
    image: "/portfolio/branding-project.jpg",
    url: "https://SEU-LINK-AQUI.com",
    rotation: -15,
  },
  {
    id: "experimental-interface",
    company: "Experimental Interface",
    category: "UI / Experiência digital / Direção criativa",
    description: "Interface experimental criada para explorar atmosfera, movimento, tipografia e narrativa visual.",
    created: "Conceito de interface, direção de movimento, composição visual e experiência interativa.",
    goal: "Criar uma forma mais artística, marcante e memorável de apresentar conteúdo digital.",
    image: "/portfolio/experimental-interface.jpg",
    url: "https://SEU-LINK-AQUI.com",
    rotation: 5,
  },
]

const projectGradients: Record<string, string> = {
  "raver-lab":              "linear-gradient(135deg, #1C0A3C 0%, #0A0814 100%)",
  "paulo-lorenzi":          "linear-gradient(135deg, #061428 0%, #080810 100%)",
  "janaina-campos":         "linear-gradient(135deg, #061E16 0%, #060A08 100%)",
  "portfolio-studio":       "linear-gradient(135deg, #16161E 0%, #090909 100%)",
  "branding-project":       "linear-gradient(135deg, #1E130A 0%, #0E0804 100%)",
  "experimental-interface": "linear-gradient(135deg, #1E080E 0%, #0E0406 100%)",
}

// degrees per ms — same speed as before (3 deg/sec), now frame-perfect
const ORBIT_SPEED = 0.003

const splashDots = [
  { tx: -58, ty: -48, delay: 0.04, r: 4   },
  { tx: -30, ty: -72, delay: 0.08, r: 3   },
  { tx:  -8, ty: -82, delay: 0.06, r: 3.5 },
  { tx:  22, ty: -76, delay: 0.09, r: 2.5 },
  { tx:  52, ty: -55, delay: 0.05, r: 4   },
  { tx:  70, ty: -38, delay: 0.11, r: 3   },
  { tx: -75, ty: -32, delay: 0.07, r: 3   },
  { tx:  14, ty: -88, delay: 0.07, r: 2.5 },
  { tx: -42, ty: -62, delay: 0.1,  r: 3.5 },
]

function WhatsAppFillButton() {
  const [hovered, setHovered] = useState(false)

  return (
    <div className="relative inline-flex justify-center items-center">
      {/* Splash droplets — outside button so they escape overflow:hidden */}
      <AnimatePresence>
        {hovered && splashDots.map((s, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full pointer-events-none z-20"
            style={{
              width:  s.r * 2,
              height: s.r * 2,
              background: "#25D366",
              top:  "50%",
              left: "50%",
              marginTop:  -s.r,
              marginLeft: -s.r,
            }}
            initial={{ x: 0, y: 0, opacity: 0.9, scale: 1 }}
            animate={{ x: s.tx, y: s.ty, opacity: 0, scale: 0.15 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: s.delay }}
          />
        ))}
      </AnimatePresence>

      <motion.a
        href="https://wa.me/5515991684097"
        target="_blank"
        rel="noopener noreferrer"
        whileTap={{ scale: 0.97 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative inline-flex items-center gap-3 rounded-full px-8 py-4
          font-inter text-[14px] font-medium overflow-hidden cursor-pointer"
        style={{ border: "1px solid rgba(255,255,255,0.13)" }}
      >
        {/* Gray base */}
        <div className="absolute inset-0" style={{ background: "rgba(255,255,255,0.055)" }} />

        {/* Water fill — rises from bottom */}
        <motion.div
          className="absolute inset-x-0 bottom-0"
          style={{ background: "#25D366" }}
          initial={{ height: "0%" }}
          animate={{ height: hovered ? "100%" : "0%" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Wave at the water surface */}
          <motion.div
            className="absolute left-0 right-0"
            style={{ top: -5 }}
            animate={hovered ? { x: [0, -5, 5, -3, 3, 0] } : { x: 0 }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg
              viewBox="0 0 300 5"
              width="100%"
              height="5"
              preserveAspectRatio="none"
              style={{ display: "block" }}
            >
              <path
                d="M0,2.5 C37.5,0 75,5 112.5,2.5 C150,0 187.5,5 225,2.5 C262.5,0 300,2.5 300,2.5 L300,5 L0,5 Z"
                fill="#25D366"
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* Content */}
        <motion.span
          className="relative z-10 flex items-center gap-3"
          animate={{ color: hovered ? "#000000" : "rgba(255,255,255,0.5)" }}
          transition={{ duration: 0.35 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Falar no WhatsApp
          <ArrowRight size={15} />
        </motion.span>
      </motion.a>
    </div>
  )
}

export default function Portfolio() {
  // ── All per-frame data lives in refs — zero React re-renders per frame ──
  const anglesRef       = useRef<number[]>(projects.map((_, i) => i * (360 / projects.length)))
  const wrapperRefs     = useRef<(HTMLDivElement | null)[]>([])
  const isPausedRef     = useRef(false)
  const rafRef          = useRef<number>(0)
  const lastTimeRef     = useRef<number>(0)
  const mouseRef        = useRef({ x: 0.5, y: 0.5 })
  const radiusRef       = useRef(210)

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Responsive orbit radius — ref so no re-render
  useEffect(() => {
    const sync = () => { radiusRef.current = window.innerWidth < 640 ? 150 : 210 }
    sync()
    window.addEventListener("resize", sync)
    return () => window.removeEventListener("resize", sync)
  }, [])

  // ── RAF loop — updates DOM transforms directly, never touches React state ──
  useEffect(() => {
    const animate = (time: number) => {
      // Clamp delta so a background-tab resume doesn't cause a jump
      const delta = lastTimeRef.current
        ? Math.min(time - lastTimeRef.current, 100)
        : 16.67
      lastTimeRef.current = time

      if (!isPausedRef.current) {
        const r  = radiusRef.current
        const px = (mouseRef.current.x - 0.5) * 14
        const py = (mouseRef.current.y - 0.5) * 14

        anglesRef.current = anglesRef.current.map(a => (a + ORBIT_SPEED * delta) % 360)

        wrapperRefs.current.forEach((el, i) => {
          if (!el) return
          const rad = anglesRef.current[i] * (Math.PI / 180)
          const tx  = Math.cos(rad) * r
          const ty  = Math.sin(rad) * r
          el.style.transform =
            `translate(${tx}px, ${ty}px) rotateX(${py}deg) rotateY(${px}deg)`
        })
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // Mouse move — writes to ref only, no re-render
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top)  / rect.height,
    }
  }, [])

  const pauseCarousel  = useCallback(() => { isPausedRef.current = true  }, [])
  const resumeCarousel = useCallback(() => { isPausedRef.current = false }, [])

  const { navigateToHome } = useCinematicScroll()

  const handleVerProjetos = useCallback(() => {
    document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })
  }, [])

  return (
    <div className="min-h-screen">

      <PageBackground />

      <div id="page-content" className="relative" style={{ zIndex: 1, willChange: "transform" }}>

        {/* Back nav */}
        <header className="fixed inset-x-0 top-0 z-40 px-6 py-5">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <button
              onClick={navigateToHome}
              className="group flex items-center gap-2 font-inter text-[11px] uppercase tracking-[0.12em] text-white/28 hover:text-white/65 transition-colors duration-300"
            >
              <ArrowLeft size={11} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
              Vitor Lorenzi Studio
            </button>
            <span className="font-mono text-[10px] tracking-[0.28em] text-white/18 uppercase">
              Portfolio
            </span>
          </div>
        </header>

        {/* ── Hero orbit section ── */}
        <section className="relative min-h-dvh px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex min-h-dvh max-w-7xl flex-col items-center justify-center py-16 md:py-24">

            {/* Orbit stage */}
            <div
              className="relative mb-16 md:mb-28 h-[460px] w-full max-w-6xl sm:h-[520px]"
              onMouseMove={handleMouseMove}
            >
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ perspective: "1200px" }}
              >
                {projects.map((project, index) => (
                  <div
                    key={project.id}
                    ref={el => { wrapperRefs.current[index] = el }}
                    className="absolute"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* rotateZ (card tilt) is CSS-only — separate from RAF orbital transform */}
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Abrir site ${project.company}`}
                      style={{ transform: `rotateZ(${project.rotation}deg)`, display: "block" }}
                      className="h-36 w-28 sm:h-56 sm:w-44"
                      onMouseEnter={pauseCarousel}
                      onMouseLeave={resumeCarousel}
                    >
                      <div
                        className="group relative h-full w-full overflow-hidden rounded-2xl border border-white/[0.08] shadow-2xl transition-transform duration-300 hover:scale-110"
                        style={{ background: projectGradients[project.id] }}
                      >
                        <img
                          src={project.image}
                          alt={project.company}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={e => { (e.target as HTMLImageElement).style.display = "none" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="text-[9px] uppercase tracking-[0.18em] text-white/55 leading-tight truncate">
                            {project.category.split("/")[0].trim()}
                          </p>
                          <div className="mt-1 flex items-center justify-between gap-1">
                            <h3 className="font-syne text-[13px] font-semibold text-white leading-tight truncate">
                              {project.company}
                            </h3>
                            <ExternalLink className="h-3 w-3 text-white/70 shrink-0" />
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero copy */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              className="relative z-20 mx-auto max-w-3xl text-center"
            >
              <div className="flex items-center justify-center gap-4 mb-5">
                <span className="h-px w-8 bg-white/[0.1]" />
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/22">
                  Design, identity and digital experiences
                </p>
                <span className="h-px w-8 bg-white/[0.1]" />
              </div>

              <h1
                className="mb-6 font-syne font-extrabold text-white/85 tracking-[-0.02em] leading-[1.04]"
                style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
              >
                Selected Works
              </h1>

              <p className="mx-auto mb-8 max-w-xl font-inter font-light text-[1rem] leading-[1.8] text-white/38 sm:text-[1.05rem]">
                Uma seleção de sites, marcas, landing pages e experiências digitais criadas
                com estratégia, atmosfera e precisão.
              </p>

              <button
                onClick={handleVerProjetos}
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] hover:border-white/[0.24] px-7 py-3 font-inter text-[13px] font-medium text-white/50 hover:text-white/85 transition-all duration-300 hover:bg-white/[0.04] cursor-pointer"
              >
                Ver projetos
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          </div>
        </section>

        <SectionDivider />

        {/* ── Project list ── */}
        <section id="portfolio" className="relative px-4 py-28 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">

            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="mb-20 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
            >
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="h-px w-6 bg-white/[0.12]" />
                  <span className="font-mono text-[10px] tracking-[0.38em] text-white/22 uppercase">Selected Works</span>
                </div>
                <h2
                  className="font-syne font-bold text-white/82 tracking-[-0.025em] leading-[1.06]"
                  style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)" }}
                >
                  Projetos selecionados
                </h2>
              </div>
              <p className="font-inter font-light text-[0.88rem] leading-[1.85] text-white/30 max-w-xs sm:text-right">
                Branding, landing pages, e-commerce e experiências digitais.
              </p>
            </motion.div>

            {/* Top hairline */}
            <div className="h-px w-full bg-white/[0.07]" />

            {/* Editorial list */}
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="group relative"
              >
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ver site ${project.company}`}
                  className="flex items-start gap-6 sm:gap-10 py-9 sm:py-11 cursor-pointer"
                >
                  {/* Index number */}
                  <span className="font-mono text-[11px] tracking-[0.18em] text-white/18 pt-1.5 shrink-0 w-7 group-hover:text-white/40 transition-colors duration-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Main content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-8">
                      <div className="min-w-0 flex-1">
                        {/* Category */}
                        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/22 mb-3 group-hover:text-white/38 transition-colors duration-400">
                          {project.category.split("/")[0].trim()}
                        </p>

                        {/* Title */}
                        <h3
                          className="font-syne font-bold text-white/68 tracking-[-0.015em] leading-[1.1] group-hover:text-white/90 transition-colors duration-400"
                          style={{ fontSize: "clamp(1.45rem, 3vw, 2rem)" }}
                        >
                          {project.company}
                        </h3>

                        {/* Description */}
                        <p className="mt-4 font-inter font-light text-[0.85rem] leading-[1.85] text-white/28 max-w-lg group-hover:text-white/40 transition-colors duration-400">
                          {project.description}
                        </p>

                        {/* Tags */}
                        <div className="mt-6 flex flex-wrap items-center gap-2">
                          {project.category.split("/").map(tag => (
                            <span
                              key={tag}
                              className="font-mono text-[8px] tracking-[0.18em] text-white/22 border border-white/[0.07] rounded-full px-3 py-1 group-hover:border-white/[0.13] group-hover:text-white/35 transition-all duration-400"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Hover image — desktop only */}
                      <div
                        className="hidden lg:block shrink-0 w-44 h-32 rounded-2xl overflow-hidden opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out shadow-2xl"
                        style={{ background: projectGradients[project.id] }}
                      >
                        <img
                          src={project.image}
                          alt={project.company}
                          className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).style.display = "none" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Arrow — right side */}
                  <div className="shrink-0 pt-1.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <ExternalLink className="w-4 h-4 text-white/40" />
                  </div>
                </a>

                {/* Bottom hairline */}
                <div className="h-px w-full bg-white/[0.07] group-hover:bg-white/[0.12] transition-colors duration-500" />
              </motion.div>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* WhatsApp CTA */}
        <section className="relative px-4 py-28 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background glow */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: 600,
              height: 600,
              background: "radial-gradient(circle, rgba(37,211,102,0.055) 0%, transparent 65%)",
            }}
          />

          <div className="relative mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className="h-px w-8 bg-white/[0.08]" />
                <span className="font-mono text-[10px] tracking-[0.38em] text-white/22 uppercase">Contato</span>
                <span className="h-px w-8 bg-white/[0.08]" />
              </div>

              <h2
                className="font-syne font-bold text-white/82 tracking-[-0.025em] leading-[1.07] mb-6"
                style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)" }}
              >
                Vamos criar algo<br />
                <span className="text-white/28 italic">juntos?</span>
              </h2>

              <p className="font-inter font-light text-[0.95rem] leading-[1.85] text-white/32 max-w-md mx-auto mb-12">
                Entre em contato pelo WhatsApp e conte sobre o seu projeto. Responderei em breve.
              </p>

              <WhatsAppFillButton />
            </motion.div>
          </div>
        </section>

        <SectionDivider />

        {/* Footer */}
        <footer className="py-10 px-6">
          <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border border-white/[0.1] rounded flex items-center justify-center">
                <span className="font-syne font-bold text-[8px] text-white/50 tracking-tight">VL</span>
              </div>
              <span className="font-mono text-[10px] tracking-[0.2em] text-white/20 uppercase">
                Vitor Lorenzi Studio
              </span>
            </div>
            <button
              onClick={navigateToHome}
              className="font-inter text-[11px] text-white/20 hover:text-white/50 transition-colors duration-200"
            >
              ← Voltar ao início
            </button>
          </div>
        </footer>

      </div>
    </div>
  )
}
