export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-4">
        {/* Logo + name */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border border-white/[0.1] rounded flex items-center justify-center">
            <span className="font-syne font-bold text-[8px] text-white/50 tracking-tight">VL</span>
          </div>
          <span className="font-mono text-[10px] tracking-[0.22em] text-white/30 uppercase">
            Vitor Lorenzi Studio
          </span>
        </div>

        {/* Copyright */}
        <p className="font-mono text-[10px] tracking-[0.18em] text-white/18">
          © {year} — Design, branding e experiências digitais.
        </p>
      </div>
    </footer>
  )
}
