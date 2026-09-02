import { bestPlayer, teamAverageOvr } from "@/lib/players";

export default function StatsBand() {
  const avg = teamAverageOvr();
  const best = bestPlayer();

  const stats = [
    { value: String(avg || "–"), label: "Media del equipo", sub: "Provisional", color: "#e3b23c" },
    { value: String(best.ovr ?? "–"), label: "Mejor media", sub: `#${best.num} · ${best.pos}`, color: "#2fa26a" },
    { value: "16", label: "Convocables", sub: "8 en cancha, 8 al banco", color: "#e9e9ed" },
    { value: "6", label: "Esquemas", sub: "Listos en la pizarra", color: "#e9e9ed" },
    { value: "0", label: "Partidos oficiales", sub: "Empezamos de cero", color: "#e04b2a" },
  ];

  return (
    <section
      id="stats"
      className="relative border-y border-[rgba(233,233,237,.10)]"
      style={{ background: "linear-gradient(120deg,#12321f,#161826 55%,#2a1a14)" }}
    >
      <div className="mx-auto max-w-[1240px] px-[22.4px] py-14">
        <div data-reveal className="grid gap-[22.4px] [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))]">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-[clamp(34px,4vw,52px)] font-extrabold leading-none tracking-[-.04em]" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="mt-[5.6px] text-[11px] font-semibold uppercase tracking-[.16em] text-ink-2">{s.label}</div>
              <div className="mt-[2.8px] text-[12px] text-ink-4">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
