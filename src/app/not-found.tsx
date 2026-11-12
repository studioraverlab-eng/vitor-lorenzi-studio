import Link from 'next/link'

// 404 raiz (URLs fora do site e fora do /painel): mantém o visual escuro do
// site. Fica fora do (site)/layout de propósito — quem renderiza é só o
// layout raiz. O /painel tem o 404 próprio dele.
export default function NaoEncontrado() {
  return (
    <main className="site-404 flex min-h-screen items-center justify-center bg-studio-bg px-6 text-studio-white">
      {/* O site esconde o cursor nativo e usa um cursor próprio (AppShell),
          que não carrega nesta página: aqui o cursor nativo volta. */}
      <style>{`
        @media (hover: hover) and (pointer: fine) {
          .site-404, .site-404 * { cursor: auto !important; }
          .site-404 a[href] { cursor: pointer !important; }
        }
      `}</style>
      <div className="text-center">
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-studio-silver">404</p>
        <h1 className="mt-4 font-syne text-4xl font-bold">Página não encontrada</h1>
        <p className="mx-auto mt-4 max-w-text font-inter text-studio-light">
          O endereço que você procurou não existe ou foi movido.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full border border-white/20 px-6 py-3 font-inter text-sm uppercase tracking-widest transition-colors hover:bg-white hover:text-studio-bg"
        >
          Voltar ao início
        </Link>
      </div>
    </main>
  )
}
