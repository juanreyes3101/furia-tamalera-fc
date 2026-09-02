export default function Footer() {
  return (
    <footer className="border-t border-[rgba(233,233,237,.10)]" style={{ background: "rgba(22,24,38,.9)" }}>
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-[22.4px] px-[22.4px] py-[44.8px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img/escudo.png"
          alt="Escudo Furia Tamalera FC"
          className="h-[52px] w-[52px] object-contain"
          style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,.65))" }}
        />
        <div>
          <div className="text-[13px] font-bold uppercase tracking-[.12em]">Furia Tamalera FC</div>
          <div className="text-[12px] text-ink-4">Est. 2026 · Bogotá, Colombia · Torneo Fansport</div>
        </div>
        <div className="flex-1" />
        <a
          href="https://www.tiktok.com/@furia_tamalera_fc"
          target="_blank"
          rel="noopener"
          className="rounded-lg border border-[rgba(233,233,237,.2)] px-[16.8px] py-[9px] text-[12.5px] font-semibold text-ink-2 transition-colors hover:border-gold hover:text-gold"
        >
          TikTok · @furia_tamalera_fc
        </a>
      </div>
    </footer>
  );
}
