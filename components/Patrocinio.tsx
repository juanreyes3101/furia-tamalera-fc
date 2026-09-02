const TIERS = [
  {
    name: "Tamal de Oro",
    slots: "1 cupo",
    ink: "#e3b23c",
    perks: [
      "Frente de camiseta en los 16 uniformes",
      "Logo destacado en la web y en cada alineación publicada",
      "Mención en todos los videos de matchday",
      "Presencia en la foto oficial del equipo",
    ],
  },
  {
    name: "Tamal de Plata",
    slots: "2 cupos",
    ink: "#cfd3e5",
    perks: ["Espalda o manga de la camiseta", "Logo en la web y en las historias de partido", "Mención mensual en TikTok"],
  },
  {
    name: "Tamal de Bronce",
    slots: "Cupos abiertos",
    ink: "#7ee0a8",
    perks: ["Logo en la web y en la pizarra táctica", "Agradecimiento en el resumen de cada fecha"],
  },
];

export default function Patrocinio() {
  return (
    <section
      id="patrocinio"
      className="relative border-t border-[rgba(233,233,237,.10)]"
      style={{ background: "linear-gradient(140deg,#13251c,#161826 50%,#2a1c12)" }}
    >
      <div className="mx-auto max-w-[1240px] px-[22.4px] py-[78px]">
        <div data-reveal className="grid items-start gap-[44.8px] [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
          <div>
            <h6 className="mb-[11.2px] text-[11px] font-bold uppercase tracking-[.2em] text-gold">Patrocinio</h6>
            <h2 className="mb-[14px] text-[clamp(30px,3.8vw,46px)] font-semibold leading-[1.03] tracking-[-.03em] text-balance">
              Tu marca, en el pecho de un equipo que la gente quiere ver.
            </h2>
            <p className="mb-[22.4px] text-[15.5px] text-ink-2 text-pretty">
              Un torneo de ~60 equipos, contenido semanal en TikTok y un parche que se toma en serio la
              producción. Buscamos aliados para la temporada 2026.
            </p>
            <a
              href="https://www.tiktok.com/@furia_tamalera_fc"
              target="_blank"
              rel="noopener"
              className="inline-block rounded-lg border border-green px-[22px] py-3 text-[14px] font-bold tracking-[.04em] text-green-light transition-colors hover:bg-[rgba(47,162,106,.16)] hover:text-[#c9f5dc]"
            >
              Hablemos por TikTok
            </a>
          </div>
          <div className="grid gap-[14px]">
            {TIERS.map((t) => (
              <div
                key={t.name}
                data-reveal
                className="rounded-[14px] p-[22.4px] shadow-[0_0_0_1px_#3f424d] transition-transform duration-300 hover:translate-x-[6px]"
                style={{ background: "rgba(22,24,38,.6)", borderLeft: `3px solid ${t.ink}` }}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-[11.2px]">
                  <div className="text-[18px] font-bold tracking-[-.01em]" style={{ color: t.ink }}>{t.name}</div>
                  <div className="text-[11px] font-bold uppercase tracking-[.14em] text-ink-4">{t.slots}</div>
                </div>
                <div className="rule-fade my-[11.2px]" />
                <div className="grid gap-[5.6px]">
                  {t.perks.map((perk) => (
                    <div key={perk} className="flex items-start gap-[9px] text-[13.5px] text-silver">
                      <span className="text-[11px] leading-[1.5]" style={{ color: t.ink }}>◆</span>
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
