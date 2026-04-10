export function Header() {
  return (
    <header className="bg-[#0A0A0A]/96 backdrop-blur-sm px-4 sm:px-6 lg:px-10 xl:px-[60px] py-3.5 lg:py-5 flex items-center justify-between gap-3 border-b border-[#1C1C1C] sticky top-0 z-50">
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <div
          className="font-[family-name:var(--font-display)] text-white uppercase tracking-[0.22em] truncate"
          style={{ fontSize: "clamp(16px, 4vw, 22px)" }}
        >
          NEXO
        </div>
        <div
          className="hidden sm:block w-px h-5 bg-[#333]"
        />
        <span className="hidden sm:block text-[10px] tracking-[0.25em] text-[#555] font-light uppercase">
          Studio de Conteúdo
        </span>
      </div>

      <nav className="shrink-0">
        <ul className="flex gap-2 sm:gap-4 lg:gap-6 list-none items-center">
          <li>
            <span className="px-2.5 sm:px-3 py-1 rounded-full border border-[#2A2A2A] bg-[#151515] text-[8px] sm:text-[9px] tracking-[0.2em] uppercase text-[#7A7A7A] font-medium">
              v2.0
            </span>
          </li>
        </ul>
      </nav>
    </header>
  );
}
