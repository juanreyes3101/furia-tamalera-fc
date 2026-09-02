const NEWS = [
  {
    tag: "Plantilla",
    date: "Sep 2026",
    title: "Cerramos el grupo en 16",
    body: "Ya está la lista completa para el torneo. Faltan las medias definitivas: se ajustan tras los primeros partidos.",
    ink: "#2fa26a",
  },
  {
    tag: "Torneo",
    date: "Sep 2026",
    title: "Entramos al Torneo Fansport",
    body: "Cerca de 60 equipos en Bogotá. Aún no conocemos el grupo; el sorteo define los primeros rivales.",
    ink: "#e3b23c",
  },
  {
    tag: "Marca",
    date: "Sep 2026",
    title: "Abrimos el TikTok oficial",
    body: "@furia_tamalera_fc arranca con contenido de cada matchday. El pecho de la camiseta sigue libre.",
    ink: "#e04b2a",
  },
];

export default function Novedades() {
  return (
    <section id="novedades" className="mx-auto max-w-[1240px] px-[22.4px] pb-[78px] pt-[22.4px]">
      <div data-reveal>
        <h6 className="mb-[8.4px] text-[11px] font-bold uppercase tracking-[.2em] text-green">Novedades</h6>
        <h2 className="mb-[22.4px] text-[clamp(30px,3.6vw,44px)] font-semibold leading-[1.05] tracking-[-.03em]">
          El parte del vestuario
        </h2>
      </div>
      <div className="grid gap-[16.8px] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
        {NEWS.map((n) => (
          <article
            key={n.title}
            data-reveal
            className="flex flex-col gap-[9px] rounded-[14px] p-[22.4px] shadow-[0_0_0_1px_#3f424d] transition-[transform,box-shadow] duration-300 hover:-translate-y-[5px] hover:shadow-[0_0_0_1px_#595d6c,0_18px_40px_rgba(0,0,0,.55)]"
            style={{ background: "rgba(35,37,50,.7)" }}
          >
            <div className="flex items-center gap-[9px]">
              <span
                className="rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[.12em]"
                style={{ color: n.ink, borderColor: n.ink }}
              >
                {n.tag}
              </span>
              <span className="text-[11px] text-ink-4">{n.date}</span>
            </div>
            <h4 className="text-[19px] font-semibold leading-[1.2] tracking-[-.015em]">{n.title}</h4>
            <p className="text-[13.5px] text-ink-3 text-pretty">{n.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
