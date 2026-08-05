export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="py-12">
      <div className="max-w-wide mx-auto px-6 flex flex-col items-center gap-4">
        {/* Logo + name */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border border-white/[0.1] rounded-sm flex items-center justify-center">
            <span className="font-syne font-bold text-xs text-white/50 tracking-tight">VL</span>
          </div>
          <span className="font-mono text-xs tracking-[0.22em] text-white/60 uppercase">
            Vitor Lorenzi Studio
          </span>
        </div>

        {/* Copyright */}
        <p className="font-mono text-xs tracking-[0.18em] text-white/50">
          © {year} — Design, branding e experiências digitais.
        </p>
      </div>
    </footer>
  )
}
