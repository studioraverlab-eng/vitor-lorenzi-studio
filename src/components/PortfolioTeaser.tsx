import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useCinematicScroll } from '../context/CinematicScroll'
import { projects, projectGradients } from '../data/projects'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const featured = projects.slice(0, 4)

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const { navigateToPortfolio } = useCinematicScroll()

  return (
    <motion.button
      onClick={navigateToPortfolio}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.09, ease }}
      whileHover={{ y: -4 }}
      className="group relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-white/[0.08] text-left shadow-2xl transition-colors duration-300 hover:border-white/[0.16]"
      style={{ background: projectGradients[project.id] }}
    >
      <img
        src={project.image}
        alt={project.company}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/50 truncate">
          {project.category.split('/')[0].trim()}
        </p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <h3 className="font-syne text-[13px] font-semibold text-white/90 leading-tight truncate">
            {project.company}
          </h3>
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-white/60 opacity-0 -translate-x-1 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
        </div>
      </div>
    </motion.button>
  )
}

export default function PortfolioTeaser() {
  const { navigateToPortfolio } = useCinematicScroll()

  return (
    <section className="relative py-20 md:py-36 lg:py-52 overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-6">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-4 mb-5"
        >
          <span className="font-mono text-[10px] tracking-[0.35em] text-white/22 uppercase">04 — Portfólio</span>
          <span className="h-px w-12 bg-white/[0.07]" />
        </motion.div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease }}
            className="font-syne font-bold text-white/82 leading-[1.07]"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.6rem)' }}
          >
            Projetos<br />
            <span className="text-white/26 italic">selecionados.</span>
          </motion.h2>

          <motion.button
            onClick={navigateToPortfolio}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-2.5 text-sm font-medium text-white/80 transition-all duration-300 hover:bg-white hover:text-black font-inter self-start md:self-auto shrink-0"
          >
            Ver todos os projetos
          </motion.button>
        </div>

        {/* Visual preview grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
