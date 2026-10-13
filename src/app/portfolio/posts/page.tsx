import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import PageBackground from '../../../components/PageBackground'
import SectionDivider from '../../../components/SectionDivider'
import { postSeries } from '../../../data/posts'

export const metadata: Metadata = {
  title: 'Posts para Instagram',
  description:
    'Sistemas visuais de feed e stories criados pelo Vitor Lorenzi Studio: cada marca com regras próprias de tipografia, cor e grade.',
  alternates: { canonical: '/portfolio/posts' },
  openGraph: {
    title: 'Posts para Instagram | Vitor Lorenzi Studio',
    description: 'Feed e stories padronizados, cada marca com o seu sistema visual.',
    url: '/portfolio/posts',
  },
}

const totalPosts = postSeries.reduce((soma, s) => soma + s.total, 0)

export default function PostsPage() {
  return (
    <main id="main-content" className="min-h-screen" tabIndex={-1}>
      <PageBackground />

      <div className="relative" style={{ zIndex: 1 }}>
        <header className="fixed inset-x-0 top-0 z-40 px-6 py-5 backdrop-blur-md">
          <div className="mx-auto flex max-w-wide items-center justify-between">
            <Link
              href="/portfolio"
              className="focus-ring group flex min-h-tap items-center gap-2 font-inter text-xs uppercase tracking-[0.12em] text-white/65 hover:text-white/90 transition-colors duration-300"
            >
              <ArrowLeft size={11} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
              Portfólio
            </Link>
            <span className="font-mono text-xs tracking-[0.28em] text-white/62 uppercase">Posts</span>
          </div>
        </header>

        <section className="relative px-4 pt-40 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-wide">
            <div className="mb-5 flex items-baseline gap-3 font-mono text-xs uppercase">
              <span className="tabular-nums tracking-[0.18em] text-white/75">{totalPosts}</span>
              <span className="tracking-[0.28em] text-white/62">peças · {postSeries.length} sistemas</span>
            </div>
            <h1 className="mb-6 max-w-[16ch] font-syne font-extrabold text-white/85 tracking-[-0.02em] leading-[1.04] text-[clamp(2.2rem,7vw,5.5rem)]">
              Posts para Instagram
            </h1>
            <p className="max-w-text font-inter font-light text-base leading-[1.8] text-white/65">
              Cada marca ganha um sistema visual com regras fixas de fonte, cor, grade e tratamento de foto.
              Assim o feed fica igual no post 1 e no post 100, e quem produz não precisa reinventar a peça toda semana.
            </p>
          </div>
        </section>

        <SectionDivider />
        <section id="reels" className="relative px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-wide">
            <div className="mb-10 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-end md:gap-12">
              <div>
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-white/62">Vídeo de apresentação</p>
                <h2 className="font-syne font-bold text-white/85 tracking-[-0.02em] leading-[1.08] text-[clamp(1.6rem,3.6vw,2.6rem)]">
                  Mima Make e Cosméticos
                </h2>
              </div>
              <p className="font-inter font-light text-sm leading-[1.85] text-white/65 md:text-right">
                A loja inteira apresentada em vídeo, com as telas de verdade e os cortes na batida de
                &ldquo;Pink + White&rdquo;.{' '}
                <a href="https://mima-make-cosmeticos.vercel.app" target="_blank" rel="noopener noreferrer" className="focus-ring underline underline-offset-4 hover:text-white">
                  Ver a loja no ar
                </a>
              </p>
            </div>
            <video
              src="/portfolio/videos/mima-horizontal.mp4"
              poster="/portfolio/videos/mima-horizontal.jpg"
              controls
              playsInline
              preload="metadata"
              className="w-full rounded-xl border border-white/[0.08] bg-black shadow-2xl"
              style={{ aspectRatio: '16 / 9' }}
            />
          </div>
        </section>

        {postSeries.map((serie) => (
          <div key={serie.id}>
            <SectionDivider />
            <section id={serie.id} className="relative px-4 py-20 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-wide">
                <div className="mb-10 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-end md:gap-12">
                  <div>
                    <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-white/62">{serie.segmento}</p>
                    <h2 className="font-syne font-bold text-white/85 tracking-[-0.02em] leading-[1.08] text-[clamp(1.6rem,3.6vw,2.6rem)]">
                      {serie.cliente}
                    </h2>
                  </div>
                  <p className="font-inter font-light text-sm leading-[1.85] text-white/65 md:text-right">
                    {serie.conceito}
                  </p>
                </div>

                <div
                  className={
                    serie.formato === 'story'
                      ? 'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6'
                      : 'grid grid-cols-2 gap-3 sm:grid-cols-3'
                  }
                >
                  {Array.from({ length: serie.total }, (_, i) => {
                    const n = String(i + 1).padStart(2, '0')
                    const src = `/portfolio/posts/${serie.pasta}/${n}.webp`
                    return (
                      <a
                        key={n}
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus-ring group relative block overflow-hidden rounded-md border border-white/[0.08] bg-white/[0.03]"
                        style={{ aspectRatio: serie.formato === 'story' ? '9 / 16' : '4 / 5' }}
                      >
                        <Image
                          src={src}
                          alt={`${serie.cliente}, peça ${i + 1}`}
                          fill
                          sizes={serie.formato === 'story' ? '(min-width: 1024px) 16vw, 45vw' : '(min-width: 640px) 32vw, 48vw'}
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      </a>
                    )
                  })}
                </div>
              </div>
            </section>
          </div>
        ))}

        <SectionDivider />

        <section className="relative px-4 py-28 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-text text-center">
            <h2 className="mb-6 font-syne font-bold text-white/82 tracking-[-0.025em] leading-[1.07] text-display-section">
              Quer o feed da sua marca<br />
              <span className="text-white/28 italic">nesse padrão?</span>
            </h2>
            <p className="mx-auto mb-10 max-w-text font-inter font-light text-sm leading-[1.85] text-white/65">
              Monto o sistema visual e entrego os posts do mês. Me chama no WhatsApp.
            </p>
            <a
              href="https://wa.me/5515991375380?text=Oi%20Vitor!%20Vi%20o%20portf%C3%B3lio%20de%20posts%20e%20quero%20conversar."
              target="_blank"
              rel="noopener noreferrer"
              className="press-target focus-ring inline-flex items-center gap-2 rounded-full border border-white/[0.14] px-8 py-4 font-inter text-sm font-medium text-white/80 hover:border-[#25D366] hover:text-white transition-colors duration-300"
            >
              Chamar no WhatsApp
            </a>
          </div>
        </section>
      </div>
    </main>
  )
}
