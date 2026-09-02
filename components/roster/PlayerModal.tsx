"use client";

import { tierOf } from "@/lib/tier";
import type { Player } from "@/lib/types";

const BARS: { key: keyof Player; label: string }[] = [
  { key: "pac", label: "RITMO" },
  { key: "sho", label: "TIRO" },
  { key: "pas", label: "PASE" },
  { key: "dri", label: "REGATE" },
  { key: "def", label: "DEFENSA" },
  { key: "phy", label: "FÍSICO" },
];

export default function PlayerModal({ player, onClose }: { player: Player; onClose: () => void }) {
  const tier = tierOf(player.ovr);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[90] flex items-center justify-center p-[22.4px] [animation:reveal_.25s_ease-out_both]"
      style={{ background: "rgba(10,11,18,.78)", backdropFilter: "blur(6px)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative aspect-[0.72] w-[300px] max-w-full overflow-hidden rounded-[14px]"
        style={{
          background: `linear-gradient(168deg, ${tier.tintA}, #1b1d2b 58%, ${tier.tintB})`,
          boxShadow: `0 0 0 1px ${tier.edge}, 0 26px 60px rgba(0,0,0,.7)`,
        }}
      >
        <div className="absolute inset-0 grid grid-rows-[auto_1fr_auto_auto] p-[16.8px]">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[46px] font-extrabold leading-[.9] tracking-[-.04em]" style={{ color: tier.ink }}>
                {player.ovr ?? "–"}
              </div>
              <div className="text-[12px] font-bold tracking-[.16em] opacity-85" style={{ color: tier.ink }}>
                {player.pos}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[22px] font-bold opacity-90" style={{ color: tier.ink }}>
                #{player.num}
              </div>
              <div
                className="ml-auto mt-[5px] h-6 w-6 rounded-[5px] opacity-90"
                style={{ background: "linear-gradient(135deg,#f5c542,#e04b2a 60%,#2fa26a)" }}
              />
            </div>
          </div>

          <div className="flex min-h-0 items-end justify-center">
            <div
              className="flex h-[90%] w-[80%] items-end justify-center rounded-lg border border-dashed border-[rgba(233,233,237,.16)] pb-2"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, rgba(233,233,237,.07) 0 6px, rgba(233,233,237,0) 6px 12px)",
              }}
            >
              <span className="font-mono text-[10px] uppercase tracking-[.1em] text-ink-4">foto jugador</span>
            </div>
          </div>

          <div className="mt-[9px] text-center">
            <div className="text-[17px] font-bold uppercase tracking-[.03em] text-ink">
              {player.name} {player.apellido}
            </div>
            {player.edad !== null && (
              <div className="mt-[2px] text-[11px] font-semibold uppercase tracking-[.1em] text-ink-4">
                {player.edad} años
              </div>
            )}
            <div className="rule-fade my-[7px]" />
          </div>

          <div className="grid gap-[5.6px]">
            {player.status === "pending" ? (
              <p className="text-[11.5px] text-ink-3">Todavía no responde la encuesta de stats.</p>
            ) : (
              BARS.map((b) => {
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
              })
            )}
            {player.note && <div className="mt-1 text-[11.5px] text-ink-3 text-pretty">{player.note}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
