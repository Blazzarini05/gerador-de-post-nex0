export function Header() {
  return (
    <header className="bg-[#0A0A0A] px-4 sm:px-6 lg:px-10 xl:px-[60px] py-4 lg:py-5 flex items-center justify-between border-b border-[#1C1C1C] sticky top-0 z-50">
      <div className="flex items-center gap-2 sm:gap-4">
        <div
          className="font-[family-name:var(--font-display)] text-white uppercase tracking-[0.22em]"
          style={{ fontSize: "clamp(16px, 4vw, 22px)" }}
        >
          Versa Visual
        </div>
        <div
          className="hidden sm:block w-px h-5 bg-[#333]"
        />
        <span className="hidden sm:block text-[10px] tracking-[0.25em] text-[#555] font-light uppercase">
          Studio de Conteúdo
        </span>
      </div>

      <nav>
        <ul className="flex gap-3 sm:gap-4 lg:gap-6 list-none items-center">
          <li>
            <span className="px-2 sm:px-3 py-1 rounded-full bg-[#1C1C1C] text-[8px] sm:text-[9px] tracking-[0.2em] uppercase text-[#666] font-medium">
              v2.0
            </span>
          </li>
          <li className="hidden sm:block">
            <a
              href="https://versavisual.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#555] no-underline text-[11px] tracking-[0.18em] uppercase font-medium hover:text-white transition-colors"
            >
              versavisual.com
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}