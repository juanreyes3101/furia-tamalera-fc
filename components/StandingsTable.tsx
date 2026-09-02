import { formatDayMonth, formatFechaLarga, tagColor, type Fixture, type ProximoPartido, type StandingRow } from "@/lib/torneo";

const GOLD = "#e3b23c";

export default function StandingsTable({
  standings,
  fixtures,
  proximoPartido,
}: {
  standings: StandingRow[];
  fixtures: Fixture[];
  proximoPartido: ProximoPartido;
}) {
  const rivalLabel = proximoPartido.rival || null;

  return (
    <section id="tabla" className="mx-auto max-w-[1240px] px-[22.4px] pb-[78px] pt-[22.4px]">
      <div data-reveal className="grid items-start gap-[22.4px] [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
        <div>
          <h6 className="mb-[8.4px] text-[11px] font-bold uppercase tracking-[.2em] text-green">Tabla de posiciones</h6>
          <h2 className="mb-[5.6px] text-[clamp(28px,3.2vw,38px)] font-semibold leading-[1.05] tracking-[-.03em]">
            Grupo por definir
          </h2>
          <p className="mb-[16.8px] text-[13.5px] text-ink-4">
            Torneo Fansport · el sorteo de grupos aún no sale. La tabla se llena con el primer pitazo.
          </p>
          <div className="overflow-x-auto rounded-[14px] shadow-[0_0_0_1px_#3f424d]" style={{ background: "rgba(35,37,50,.6)" }}>
            <div
              className="grid min-w-[430px] gap-0 px-[14px] py-[9px] text-[10.5px] font-bold uppercase tracking-[.1em] text-ink-4"
              style={{ gridTemplateColumns: "34px minmax(0,1fr) repeat(6,38px)", background: "rgba(22,24,38,.7)" }}
            >
              <div>#</div>
              <div>Equipo</div>
              <div className="text-center">PJ</div>
              <div className="text-center">G</div>
              <div className="text-center">E</div>
              <div className="text-center">P</div>
              <div className="text-center">DG</div>
              <div className="text-center">PTS</div>
            </div>
            {standings.map((r) => {
              const ink = r.isFuria ? GOLD : "#75798c";
              return (
                <div
                  key={r.pos}
                  className="grid min-w-[430px] items-center border-t border-[rgba(233,233,237,.08)] px-[14px] py-[11px]"
                  style={{
                    gridTemplateColumns: "34px minmax(0,1fr) repeat(6,38px)",
                    background: r.isFuria ? "rgba(227,178,60,.07)" : "transparent",
                  }}
                >
                  <div className="text-[12.5px] font-bold" style={{ color: ink }}>{r.pos}</div>
                  <div className="truncate text-[13.5px]" style={{ color: ink, fontWeight: r.isFuria ? 700 : 500 }}>
                    {r.equipo}
                  </div>
                  <div className="text-center text-[12.5px] text-ink-3">{r.pj}</div>
                  <div className="text-center text-[12.5px] text-ink-3">{r.g}</div>
                  <div className="text-center text-[12.5px] text-ink-3">{r.e}</div>
                  <div className="text-center text-[12.5px] text-ink-3">{r.p}</div>
                  <div className="text-center text-[12.5px] text-ink-3">{r.dg}</div>
                  <div className="text-center text-[13px] font-extrabold" style={{ color: ink }}>{r.pts}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-[16.8px]">
          <div
            className="rounded-[14px] p-[16.8px] shadow-[0_0_0_1px_#3f424d]"
            style={{ background: "linear-gradient(150deg, rgba(47,162,106,.16), rgba(35,37,50,.8) 60%)" }}
          >
            <div className="flex items-center gap-[7px] text-[10.5px] font-bold uppercase tracking-[.16em] text-green-light">
              <span className="h-1.5 w-1.5 rounded-full bg-green [animation:pulse_1.6s_ease-in-out_infinite]" />
              Próximo partido
            </div>
            <div className="mt-[14px] flex items-center justify-between gap-[11.2px]">
              <div className="flex-1 text-center">
                <div className="mx-auto mb-[7px] h-11 w-11">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/img/escudo.png" alt="" className="h-full w-full object-contain" style={{ filter: "drop-shadow(0 3px 8px rgba(0,0,0,.65))" }} />
                </div>
                <div className="text-[11.5px] font-bold">FURIA</div>
              </div>
              <div className="text-[22px] font-extrabold tracking-[-.02em] text-ink-4">VS</div>
              <div className="flex-1 text-center">
                {rivalLabel ? (
                  <div className="mx-auto mb-[7px] flex h-11 w-11 items-center justify-center rounded-lg border border-[rgba(233,233,237,.22)] text-[16px] font-bold text-ink">
                    {rivalLabel.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <div className="mx-auto mb-[7px] flex h-11 w-11 items-center justify-center rounded-lg border border-dashed border-[rgba(233,233,237,.22)] text-[16px] text-ink-4">
                    ?
                  </div>
                )}
                <div className="truncate text-[11.5px] font-bold text-ink-3">{rivalLabel ?? "RIVAL"}</div>
              </div>
            </div>
            <div className="rule-fade my-[14px]" />
            <div className="grid gap-[5.6px] text-[12.5px] text-ink-3">
              <div className="flex justify-between"><span>Tipo</span><span className="font-semibold text-ink">{proximoPartido.tipo}</span></div>
              <div className="flex justify-between"><span>Cuándo</span><span className="font-semibold text-ink">{formatFechaLarga(proximoPartido.fechaHora)}</span></div>
              <div className="flex justify-between"><span>Dónde</span><span className="font-semibold text-ink">{proximoPartido.lugar}</span></div>
            </div>
          </div>

          <div className="rounded-[14px] p-[16.8px] shadow-[0_0_0_1px_#3f424d]" style={{ background: "rgba(35,37,50,.7)" }}>
            <div className="mb-[11.2px] text-[10.5px] font-bold uppercase tracking-[.16em] text-ink-4">Calendario</div>
            {fixtures.map((f, i) => {
              const { day, month } = formatDayMonth(f.fecha);
              const ink = tagColor(f.tag);
              return (
                <div key={i} className="flex items-center gap-[11.2px] border-t border-[rgba(233,233,237,.08)] py-[9px]">
                  <div className="w-[42px] text-center">
                    <div className="text-[16px] font-extrabold leading-none" style={{ color: ink }}>{day}</div>
                    <div className="text-[9.5px] font-bold uppercase tracking-[.12em] text-ink-4">{month}</div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12.5px] font-semibold text-ink">{f.titulo}</div>
                    <div className="text-[11px] text-ink-4">{f.meta}</div>
                  </div>
                  <div
                    className="rounded-full border px-[7px] py-0.5 text-[10px] font-bold uppercase tracking-[.1em]"
                    style={{ color: ink, borderColor: ink }}
                  >
                    {f.tag}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
