"use client";

import { useState } from "react";
import { tierOf } from "@/lib/tier";
import { pickRandomNote } from "@/lib/notes";
import type { Player } from "@/lib/types";

const POS_LABEL: Record<string, string> = { POR: "POR", DEF: "DEF", MED: "MED", DEL: "DEL" };

function dash(v: number | null): string {
  return v === null ? "–" : String(v);
}

const BARS: { key: keyof Player; label: string }[] = [
  { key: "pac", label: "RITMO" },
  { key: "sho", label: "TIRO" },
  { key: "pas", label: "PASE" },
  { key: "dri", label: "REGATE" },
  { key: "def", label: "DEFENSA" },
  { key: "phy", label: "FÍSICO" },
];

export default function PlayerCard({
  player,
  flipped,
  onClick,
  onViewFull,
}: {
  player: Player;
  flipped: boolean;
  onClick?: () => void;
  onViewFull?: () => void;
}) {
  const tier = tierOf(player.ovr);
  const [note] = useState(() => pickRandomNote(player.note));

  return (
    <div
      data-card
      onClick={onClick}
      className="relative aspect-[0.72] cursor-pointer overflow-hidden rounded-[14px] transition-[transform,box-shadow] duration-[.35s] ease-[cubic-bezier(.2,.7,.3,1)] hover:-translate-y-2 hover:scale-[1.02]"
      style={{
        background: `linear-gradient(168deg, ${tier.tintA}, #1b1d2b 58%, ${tier.tintB})`,
        boxShadow: `0 0 0 1px ${tier.edge}, 0 12px 30px rgba(0,0,0,.5)`,
      }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          data-shine
          className="absolute left-0 top-0 h-full w-[34%] opacity-0"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,.12), transparent)" }}
        />
      </div>

      {!flipped ? (
        <div className="absolute inset-0 grid grid-rows-[auto_1fr_auto_auto] p-[14px]">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[38px] font-extrabold leading-[.9] tracking-[-.04em]" style={{ color: tier.ink }}>
                {player.ovr ?? "–"}
              </div>
              <div className="text-[11px] font-bold tracking-[.16em] opacity-85" style={{ color: tier.ink }}>
                {POS_LABEL[player.pos]}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[20px] font-bold opacity-90" style={{ color: tier.ink }}>
                #{player.num}
              </div>
              <div
                className="ml-auto mt-[5px] h-[22px] w-[22px] rounded-[5px] opacity-90"
                style={{ background: "linear-gradient(135deg,#f5c542,#e04b2a 60%,#2fa26a)" }}
              />
            </div>
          </div>

          <div className="flex min-h-0 items-end justify-center">
            <div
              className="flex h-[88%] w-[82%] items-end justify-center rounded-lg border border-dashed border-[rgba(233,233,237,.16)] pb-2"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, rgba(233,233,237,.07) 0 6px, rgba(233,233,237,0) 6px 12px)",
              }}
            >
              <span className="font-mono text-[9.5px] uppercase tracking-[.1em] text-ink-4">foto jugador</span>
            </div>
          </div>

          <div className="mt-[9px] min-w-0 text-center">
            <div className="truncate text-[15px] font-bold uppercase tracking-[.03em] text-ink">
              {player.name} {player.apellido}
            </div>
            {player.edad !== null && (
              <div className="mt-[2px] text-[10px] font-semibold uppercase tracking-[.1em] text-ink-4">
                {player.edad} años
              </div>
            )}
            <div className="rule-fade my-[7px]" />
          </div>

          <div className="grid grid-cols-[1fr_1px_1fr] gap-2 text-[11.5px]">
            <div className="grid gap-[2.8px]">
              {BARS.slice(0, 3).map((b) => (
                <div key={b.key} className="flex justify-between">
                  <span className="font-semibold text-ink-3">{b.label.slice(0, 3)}</span>
                  <span className="font-bold text-ink">{dash(player[b.key] as number | null)}</span>
                </div>
              ))}
            </div>
            <div className="bg-[rgba(233,233,237,.14)]" />
            <div className="grid gap-[2.8px]">
              {BARS.slice(3).map((b) => (
                <div key={b.key} className="flex justify-between">
                  <span className="font-semibold text-ink-3">{b.label.slice(0, 3)}</span>
                  <span className="font-bold text-ink">{dash(player[b.key] as number | null)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col gap-[9px] p-[16.8px]" style={{ background: "rgba(22,24,38,.72)" }}>
          <div className="text-[10.5px] font-bold uppercase tracking-[.18em]" style={{ color: tier.ink }}>
            {tier.label} · #{player.num}
          </div>
          <div className="text-[15px] font-bold uppercase tracking-[.03em]">
            {player.name} {player.apellido}
            {player.edad !== null && <span className="ml-1.5 text-[11px] font-medium normal-case text-ink-4">· {player.edad} años</span>}
          </div>

          {player.status === "pending" ? (
            <p className="mt-2 text-[12px] text-ink-3">Todavía no responde la encuesta de stats. Esta ficha se activa sola en cuanto lo haga.</p>
          ) : (
            <div className="mt-0.5 grid gap-[7px]">
              {BARS.map((b) => {
                const v = (player[b.key] as number | null) ?? 0;
                return (
                  <div key={b.key}>
                    <div className="flex justify-between text-[10.5px] font-semibold tracking-[.06em] text-ink-3">
                      <span>{b.label}</span>
                      <span className="text-ink">{v}</span>
                    </div>
                    <div className="mt-[3px] h-1 overflow-hidden rounded-full bg-[rgba(233,233,237,.10)]">
                      <div
                        className="h-full origin-left rounded-full"
                        style={{ width: `${v}%`, background: `linear-gradient(90deg,#2fa26a,${tier.ink})` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex-1" />
          {note && <div suppressHydrationWarning className="text-[12px] text-ink-3 text-pretty">{note}</div>}
          {onViewFull && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewFull();
              }}
              className="cursor-pointer text-left text-[12px] font-semibold text-green-light transition-colors hover:text-[#c9f5dc]"
            >
              Ver más detalles →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
