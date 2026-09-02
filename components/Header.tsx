const NAV_LINKS = [
  { href: "#plantilla", label: "Plantilla" },
  { href: "#tactica", label: "Táctica" },
  { href: "#tabla", label: "Tabla" },
  { href: "#matchday", label: "Matchday" },
  { href: "#novedades", label: "Novedades" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(233,233,237,.10)] bg-[rgba(22,24,38,.78)] backdrop-blur-[14px]">
      <nav className="mx-auto flex max-w-[1240px] items-center gap-[16.8px] px-[22.4px] py-[11.2px]">
        <a href="#top" className="flex items-center gap-[8.4px] text-ink">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/escudo.png"
            alt="Escudo Furia Tamalera FC"
            className="h-[34px] w-[34px] object-contain"
            style={{ filter: "drop-shadow(0 2px 5px rgba(0,0,0,.6))" }}
          />
          <span className="text-[12px] font-bold uppercase tracking-[.14em]">
            Furia Tamalera <span className="text-gold">FC</span>
          </span>
        </a>
        <div className="flex-1" />
        <div className="flex flex-wrap gap-[2.8px]">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-[11.2px] py-1.5 text-[12.5px] font-medium tracking-[.04em] text-ink-2 transition-colors hover:bg-[rgba(47,162,106,.14)] hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </div>
        <a
          href="#patrocinio"
          className="rounded-lg border border-green px-[14px] py-[7px] text-[12.5px] font-semibold tracking-[.05em] text-green-light transition-colors hover:bg-[rgba(47,162,106,.16)] hover:text-[#c9f5dc]"
        >
          Patrocina
        </a>
      </nav>
    </header>
  );
}
