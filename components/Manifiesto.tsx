const CARDS = [
  {
    title: "Diversión primero",
    body: "Nadie cobra por jugar. Se viene a reír, a molestar al que falló y a volver el domingo.",
    borderColor: "#2fa26a",
  },
  {
    title: "Probar nivel",
    body: "Un torneo real, con árbitro y tabla. Queremos saber exactamente dónde estamos parados.",
    borderColor: "#e3b23c",
  },
  {
    title: "Cantera propia",
    body: "Hay pelaos en el grupo con nivel de sobra. Este equipo también es su vitrina.",
    borderColor: "#e04b2a",
  },
];

export default function Manifiesto() {
  return (
    <section id="manifiesto" className="mx-auto max-w-[1240px] px-[22.4px] py-[78px]">
      <div data-reveal className="grid grid-cols-1 gap-[44.8px] sm:[grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
        <div>
          <h6 className="mb-[11.2px] text-[11px] font-bold uppercase tracking-[.2em] text-green">Quiénes somos</h6>
          <h2 className="text-[clamp(30px,3.6vw,44px)] font-semibold leading-[1.05] tracking-[-.03em] text-balance">
            Un parche que se tomó en serio lo de jugar por diversión.
          </h2>
        </div>
        <div className="grid gap-[22.4px]">
          <p className="text-[17px] text-silver text-pretty">
            Furia Tamalera nació entre amigos, con la excusa perfecta: un tamal, una cancha y ganas de
            competir. Hoy somos 16 y entramos al Torneo Fansport de Bogotá, uno de los circuitos de fútbol
            8 más grandes de la ciudad.
          </p>
          <div className="grid grid-cols-1 gap-[16.8px] sm:[grid-template-columns:repeat(auto-fit,minmax(190px,1fr))]">
            {CARDS.map((c) => (
              <div
                key={c.title}
                className="rounded-lg bg-[rgba(35,37,50,.7)] p-[16.8px] shadow-[0_0_0_1px_#3f424d]"
                style={{ borderTop: `2px solid ${c.borderColor}` }}
              >
                <div className="mb-[5.6px] text-[13px] font-bold tracking-[.02em] text-ink">{c.title}</div>
                <p className="text-[13.5px] text-ink-3">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
