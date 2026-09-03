"use client";

import { useState } from "react";
import { players, POSITION_LABEL } from "@/lib/players";
import { tierOf } from "@/lib/tier";
import type { Player, Position } from "@/lib/types";
import PlayerCard from "./PlayerCard";
import PlayerDetailOverlay from "./PlayerDetailOverlay";

const FILTERS: ("TODOS" | Position)[] = ["TODOS", "POR", "DEF", "MED", "DEL"];
const GROUPS: [Position, string][] = [
  ["POR", "#7ee0a8"],
  ["DEF", "#2fa26a"],
  ["MED", "#e3b23c"],
  ["DEL", "#e04b2a"],
];

function topStatsHint(p: Player): string {
  if (p.status === "pending") return "Pendiente de responder el form";
  const entries: [string, number][] = [
    ["RIT", p.pac ?? 0],
    ["TIR", p.sho ?? 0],
    ["PAS", p.pas ?? 0],
    ["REG", p.dri ?? 0],
    ["DEF", p.def ?? 0],
    ["FÍS", p.phy ?? 0],
  ];
  return entries
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([k, v]) => `${k} ${v}`)
    .join(" · ");
}

export default function RosterSection() {
  const [filter, setFilter] = useState<"TODOS" | Position>("TODOS");
  const [view, setView] = useState<"lista" | "cartas">("lista");
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [detailId, setDetailId] = useState<string | null>(null);

  const visible = players.filter((p) => filter === "TODOS" || p.pos === filter);
  const detailPlayer = detailId ? players.find((p) => p.id === detailId) ?? null : null;

  return (
    <section id="plantilla" className="mx-auto max-w-[1240px] px-[22.4px] pb-[78px] pt-[22.4px]">
      <div data-reveal className="mb-1.5 flex flex-wrap items-end gap-[22.4px]">
        <div>
          <h6 className="mb-[8.4px] text-[11px] font-bold uppercase tracking-[.2em] text-green">La plantilla</h6>
          <h2 className="text-[clamp(30px,3.6vw,44px)] font-semibold leading-[1.05] tracking-[-.03em]">
            16 cartas, 16 historias
          </h2>
        </div>
        <div className="flex-1" />
        <div className="flex flex-wrap items-center gap-[5.6px]">
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className="cursor-pointer rounded-lg border px-[14px] py-[7px] text-[12px] font-semibold uppercase tracking-[.08em] transition-colors hover:border-green"
                style={{
                  background: active ? "rgba(47,162,106,.16)" : "transparent",
                  color: active ? "#7ee0a8" : "#9397ab",
                  borderColor: active ? "#2fa26a" : "rgba(233,233,237,.18)",
                }}
              >
                {f}
              </button>
            );
          })}
          <span className="mx-[5.6px] h-[22px] w-px bg-[rgba(233,233,237,.16)]" />
          {(["lista", "cartas"] as const).map((v) => {
            const active = view === v;
            return (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className="cursor-pointer rounded-lg border px-[14px] py-[7px] text-[12px] font-semibold uppercase tracking-[.08em] transition-colors hover:border-gold"
                style={{
                  background: active ? "rgba(227,178,60,.14)" : "transparent",
                  color: active ? "#e3b23c" : "#9397ab",
                  borderColor: active ? "rgba(227,178,60,.6)" : "rgba(233,233,237,.18)",
                }}
              >
                {v === "lista" ? "Lista" : "Cartas"}
              </button>
            );
          })}
        </div>
      </div>
      <p className="mb-[22.4px] text-[12.5px] text-ink-4">
        Medias provisionales — se ajustan tras los primeros partidos. Toca un jugador para abrir su carta.
      </p>

      {view === "lista" && (
        <div className="grid gap-[22.4px]">
          {GROUPS.filter(([pos]) => filter === "TODOS" || filter === pos).map(([pos, ink]) => {
            const rows = players
              .filter((p) => p.pos === pos)
              .sort((a, b) => (b.ovr ?? 0) - (a.ovr ?? 0));
            if (!rows.length) return null;
            return (
              <div key={pos} data-reveal>
                <div className="mb-[9px] flex items-center gap-[11.2px]">
                  <span className="text-[11px] font-bold uppercase tracking-[.18em]" style={{ color: ink }}>
                    {POSITION_LABEL[pos]}
                  </span>
                  <span className="text-[11px] text-ink-4">
                    {rows.length} {rows.length === 1 ? "jugador" : "jugadores"}
                  </span>
                  <span className="h-px flex-1" style={{ background: "linear-gradient(to right, rgba(233,233,237,.18), transparent)" }} />
                </div>
                <div className="grid gap-[5.6px] [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
                  {rows.map((p) => {
                    const tier = tierOf(p.ovr);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setDetailId(p.id)}
                        className="group flex cursor-pointer items-center gap-[11.2px] rounded-lg border border-[rgba(233,233,237,.10)] bg-[rgba(35,37,50,.6)] px-[11.2px] py-[9px] text-left text-ink transition-[border-color,transform] hover:translate-x-1"
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = tier.ink)}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(233,233,237,.10)")}
                      >
                        <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[rgba(233,233,237,.07)] text-[12px] font-extrabold text-ink-2">
                          {p.num}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13.5px] font-semibold">
                            {p.name} {p.apellido}
                          </span>
                          <span className="block truncate text-[11px] text-ink-4">
                            {p.edad !== null ? `${p.edad} años · ` : ""}
                            {topStatsHint(p)}
                          </span>
                        </span>
                        <span className="text-[18px] font-extrabold tracking-[-.03em]" style={{ color: tier.ink }}>
                          {p.ovr ?? "–"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === "cartas" && (
        <div className="grid gap-[16.8px] [grid-template-columns:repeat(auto-fill,minmax(210px,1fr))]">
          {visible.map((p) => (
            <div key={p.id} data-reveal>
              <PlayerCard
                player={p}
                flipped={!!flipped[p.id]}
                onClick={() => setFlipped((s) => ({ ...s, [p.id]: !s[p.id] }))}
                onViewFull={() => setDetailId(p.id)}
              />
            </div>
          ))}
        </div>
      )}

      {detailPlayer && <PlayerDetailOverlay player={detailPlayer} onClose={() => setDetailId(null)} />}
    </section>
  );
}
