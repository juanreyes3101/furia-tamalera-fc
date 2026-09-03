"use client";

import Link from "next/link";
import { useState } from "react";
import { tierOf } from "@/lib/tier";
import { pickRandomNote } from "@/lib/notes";
import type { Player, Position } from "@/lib/types";

const POSITION_FULL: Record<Position, string> = {
  POR: "Portero",
  DEF: "Defensa",
  MED: "Mediocampista",
  DEL: "Delantero",
};

export default function PlayerDetail({ player, onClose }: { player: Player; onClose?: () => void }) {
  const tier = tierOf(player.ovr);
  const [note] = useState(() => pickRandomNote(player.note));
  const hasSocial = player.social.instagram || player.social.tiktok;
  const hasTorneo =
    player.torneo.partidos !== null ||
    player.torneo.goles !== null ||
    player.torneo.asistencias !== null ||
    player.torneo.puntuacionMedia !== null;

  return (
    <section className="relative mx-auto max-w-[1240px] px-[22.4px] py-[44.8px]">
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-[16.8px] top-[16.8px] z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[rgba(233,233,237,.18)] text-ink-2 transition-colors hover:border-green hover:text-ink"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      ) : (
        <Link
          href="/#plantilla"
          className="mb-[22.4px] inline-flex items-center gap-[6px] text-[12.5px] font-medium text-ink-3 transition-colors hover:text-ink"
        >
          ← Volver a la plantilla
        </Link>
      )}

      <h6 className="mb-[16.8px] text-[11px] font-bold uppercase tracking-[.2em] text-green">Ficha de jugador</h6>

      <div className="flex flex-wrap items-start gap-[44.8px]">
        {/* LEFT: info */}
        <div className="flex min-w-[300px] flex-1 flex-col gap-[22.4px]" style={{ flexBasis: "560px" }}>
          <div>
            <h1 className="text-[clamp(32px,3.6vw,48px)] font-extrabold uppercase leading-[.95] tracking-[-.03em]">
              {player.name} {player.apellido}
            </h1>
            <div className="mt-[9px] flex flex-wrap items-center gap-[9px]">
              <span className="text-[13px] font-bold text-ink-4">#{player.num}</span>
              <span className="h-[3px] w-[3px] rounded-full bg-line-2" />
              <span
                className="rounded-lg border px-[11px] py-1 text-[11px] font-bold uppercase tracking-[.1em]"
                style={{ borderColor: tier.ink, background: `${tier.ink}24`, color: tier.ink }}
              >
                {POSITION_FULL[player.pos]}
              </span>
              {note && (
                <span className="rounded-lg border border-[rgba(233,233,237,.18)] px-[11px] py-1 text-[11px] font-bold uppercase tracking-[.08em] text-silver">
                  {note}
                </span>
              )}
              {player.edad !== null && <span className="text-[11px] text-ink-4">{player.edad} años</span>}
            </div>
          </div>

          {hasSocial && (
            <div className="flex items-center gap-[10px]">
              {player.social.instagram && (
                <a
                  href={player.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[rgba(233,233,237,.12)] bg-[rgba(233,233,237,.07)] text-ink-3 transition-[color,border-color,background,transform] hover:-translate-y-0.5 hover:border-green hover:bg-[rgba(47,162,106,.12)] hover:text-green-light"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4.2" />
                    <circle cx="17.2" cy="6.8" r="1" />
                  </svg>
                </a>
              )}
              {player.social.tiktok && (
                <a
                  href={player.social.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok"
                  className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[rgba(233,233,237,.12)] bg-[rgba(233,233,237,.07)] text-ink-3 transition-[color,border-color,background,transform] hover:-translate-y-0.5 hover:border-green hover:bg-[rgba(47,162,106,.12)] hover:text-green-light"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3v10.6a3.6 3.6 0 1 1-3-3.55" />
                    <path d="M15 3c.4 2.6 2.1 4.3 4.6 4.6" />
                  </svg>
                </a>
              )}
            </div>
          )}

          <div>
            <div className="mb-[6px] text-[10px] font-bold uppercase tracking-[.14em] text-ink-4">Historia</div>
            <p className="max-w-[54ch] text-[14px] leading-[1.65] text-ink-3 text-pretty">
              {player.historia ?? "Todavía no hay historia publicada — pronto."}
            </p>
          </div>

          {hasTorneo && (
            <div>
              <div className="mb-[10px] text-[10px] font-bold uppercase tracking-[.14em] text-ink-4">Torneo Fansport</div>
              <div className="grid max-w-[340px] grid-cols-4 gap-[6px]">
                {([
                  ["Partidos", player.torneo.partidos],
                  ["Goles", player.torneo.goles],
                  ["Asist.", player.torneo.asistencias],
                  ["Punt. media", player.torneo.puntuacionMedia],
                ] as const).map(([label, value]) => (
                  <div key={label} className="rounded-[10px] border border-[rgba(233,233,237,.10)] bg-[rgba(35,37,50,.6)] px-1 py-2 text-center">
                    <div className="text-[16px] font-extrabold text-ink">{value ?? "–"}</div>
                    <div className="mt-0.5 text-[8px] font-bold uppercase tracking-[.05em] text-ink-4">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="mb-[12px] text-[10px] font-bold uppercase tracking-[.14em] text-ink-4">Trayectoria de clubes</div>

            {player.clubes.length === 0 ? (
              <div className="flex items-center gap-[10px] rounded-[10px] border border-[rgba(233,233,237,.10)] bg-[rgba(35,37,50,.6)] px-[14px] py-[12px]">
                <span
                  className="h-[11px] w-[11px] shrink-0 rounded-full"
                  style={{ background: tier.ink, boxShadow: `0 0 0 3px #161826, 0 0 10px ${tier.ink}` }}
                />
                <div>
                  <div className="text-[13px] font-bold text-ink">Furia Tamalera FC</div>
                  <div className="text-[11.5px] text-ink-4">Su único club hasta ahora.</div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-0">
                {player.clubes.map((c, i) => (
                  <div key={i} className="flex flex-1 items-start gap-0">
                    <div className="flex flex-1 flex-col items-start gap-[8px]">
                      <span className="h-[11px] w-[11px] rounded-full bg-line-2" style={{ boxShadow: "0 0 0 3px #161826" }} />
                      <span className="text-[11.5px] font-semibold text-ink-2">{c.periodo}</span>
                      <span className="text-[12px] text-ink-4">{c.nombre}</span>
                    </div>
                    <div className="rule-fade mt-[5.5px] h-[11px] flex-[0_0_60px]" />
                  </div>
                ))}
                <div className="flex flex-1 flex-col items-start gap-[8px]">
                  <span
                    className="h-[11px] w-[11px] rounded-full"
                    style={{ background: tier.ink, boxShadow: `0 0 0 3px #161826, 0 0 10px ${tier.ink}` }}
                  />
                  <span className="text-[11.5px] font-semibold" style={{ color: tier.ink }}>
                    Actual
                  </span>
                  <span className="text-[12px] text-silver">Furia Tamalera FC</span>
                </div>
              </div>
            )}
          </div>

          <div className="rule-fade" />
          <div className="text-[12px] text-ink-4">¿Interesado en ficharlo? Escríbele al equipo.</div>
        </div>

        {/* RIGHT: photo */}
        <div className="relative h-[610px] flex-[0_0_460px]">
          <div
            className="absolute -inset-10 opacity-80 blur-[6px]"
            style={{ background: `radial-gradient(closest-side, ${tier.ink}38, transparent 72%)` }}
          />
          {player.photo ? (
            <div
              className="relative h-full"
              style={{
                WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 94%)",
                maskImage: "linear-gradient(to bottom, black 60%, transparent 94%)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={player.photo}
                alt={`${player.name} ${player.apellido}`}
                className="block h-full w-full object-contain object-bottom"
              />
            </div>
          ) : (
            <div className="flex h-full w-full items-end justify-center rounded-lg border border-dashed border-[rgba(233,233,237,.16)] pb-[10px]" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(233,233,237,.07) 0 6px, rgba(233,233,237,0) 6px 12px)" }}>
              <span className="font-mono text-[10.5px] uppercase tracking-[.1em] text-ink-4">foto jugador</span>
            </div>
          )}
          <div className="absolute right-[6px] top-[6px] text-right">
            <div className="text-[34px] font-extrabold leading-[.9] tracking-[-.04em]" style={{ color: tier.ink }}>
              {player.ovr ?? "–"}
            </div>
            <div className="text-[10px] font-bold tracking-[.16em] opacity-85" style={{ color: tier.ink }}>
              {tier.label.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
