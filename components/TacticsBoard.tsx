"use client";

import { useState } from "react";
import { players } from "@/lib/players";
import { tierOf } from "@/lib/tier";
import { AUTO_FILL_ORDER, FORMATIONS, FORMATION_KEYS } from "@/lib/formations";

const GOLD = "#e3b23c";
const GREEN = "#2fa26a";

export default function TacticsBoard() {
  const [formation, setFormation] = useState<string>(FORMATION_KEYS[0]);
  const [assign, setAssign] = useState<Record<number, string>>({});
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);

  const def = FORMATIONS[formation];

  function place(idx: number, playerId: string) {
    setAssign((prev) => {
      const next: Record<number, string> = {};
      for (const [k, v] of Object.entries(prev)) {
        if (v !== playerId) next[Number(k)] = v;
      }
      next[idx] = playerId;
      return next;
    });
    setActiveSlot(null);
    setSelected(null);
    setDragging(null);
  }

  function changeFormation(key: string) {
    setFormation(key);
    setAssign({});
    setActiveSlot(null);
  }

  function slotOf(playerId: string): number | null {
    const entry = Object.entries(assign).find(([, v]) => v === playerId);
    return entry ? Number(entry[0]) : null;
  }

  function clearSlot(idx: number) {
    setAssign((prev) => {
      const next = { ...prev };
      delete next[idx];
      return next;
    });
    setActiveSlot(null);
  }

  function autoFill() {
    const taken = new Set<string>();
    const next: Record<number, string> = {};
    def.forEach((slot, idx) => {
      const prefs = AUTO_FILL_ORDER[slot[0]];
      for (const posPref of prefs) {
        const pool = players
          .filter((p) => p.pos === posPref && !taken.has(p.id))
          .sort((a, b) => (b.ovr ?? 0) - (a.ovr ?? 0));
        if (pool.length) {
          taken.add(pool[0].id);
          next[idx] = pool[0].id;
          break;
        }
      }
    });
    setAssign(next);
    setActiveSlot(null);
    setSelected(null);
  }

  function clearAll() {
    setAssign({});
    setActiveSlot(null);
    setSelected(null);
  }

  const panelTitle =
    selected !== null
      ? "Ahora toca una posición"
      : activeSlot === null
      ? "Arrastra o toca un jugador"
      : `Elige quién va en ${def[activeSlot][0]}`;

  const namedLineup = def
    .map((slot, idx) => {
      const pid = assign[idx];
      if (!pid) return "—";
      const p = players.find((pp) => pp.id === pid);
      return p ? `${p.num} ${p.name}` : "—";
    })
    .join(" / ");

  return (
    <section id="tactica" className="mx-auto max-w-[1240px] px-[22.4px] py-[78px]">
      <div data-reveal>
        <h6 className="mb-[8.4px] text-[11px] font-bold uppercase tracking-[.2em] text-green">Pizarra táctica</h6>
        <h2 className="mb-[5.6px] text-[clamp(30px,3.6vw,44px)] font-semibold leading-[1.05] tracking-[-.03em]">
          Arma la alineación
        </h2>
        <p className="mb-[22.4px] max-w-[60ch] text-[14px] text-ink-3">
          En computador: arrastra un jugador de la lista a la cancha. En celular: toca al jugador y luego la
          posición. Toca a un jugador ya ubicado para sacarlo.
        </p>
      </div>

      <div className="grid items-start gap-[22.4px] [grid-template-columns:repeat(auto-fit,minmax(290px,1fr))]">
        <div>
          <div className="mb-[16.8px] flex flex-wrap gap-[5.6px]">
            {FORMATION_KEYS.map((key) => {
              const active = formation === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => changeFormation(key)}
                  className="cursor-pointer rounded-lg border px-[15px] py-2 text-[13px] font-bold tracking-[.06em] transition-colors hover:border-green"
                  style={{
                    background: active ? "rgba(227,178,60,.16)" : "transparent",
                    color: active ? GOLD : "#9397ab",
                    borderColor: active ? GOLD : "rgba(233,233,237,.18)",
                  }}
                >
                  {key}
                </button>
              );
            })}
          </div>

          <div
            className="relative overflow-hidden rounded-[14px] shadow-[0_0_0_1px_#3f424d,0_16px_40px_rgba(0,0,0,.55)]"
            style={{ background: "linear-gradient(180deg,#123a24,#0e2b1b)" }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(180deg, rgba(255,255,255,.035) 0 40px, rgba(255,255,255,0) 40px 80px)",
              }}
            />
            <div className="absolute inset-[14px] rounded-md border-2 border-[rgba(255,255,255,.16)]" />
            <div className="absolute left-[14px] right-[14px] top-1/2 h-0.5 bg-[rgba(255,255,255,.16)]" />
            <div className="absolute left-1/2 top-1/2 h-[88px] w-[88px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[rgba(255,255,255,.16)]" />
            <div className="absolute bottom-[14px] left-1/2 h-[62px] w-[180px] -translate-x-1/2 rounded-t-md border-2 border-b-0 border-[rgba(255,255,255,.16)]" />
            <div className="absolute top-[14px] left-1/2 h-[62px] w-[180px] -translate-x-1/2 rounded-b-md border-2 border-t-0 border-[rgba(255,255,255,.16)]" />
            <div className="aspect-[0.82] w-full" />

            {def.map((slot, idx) => {
              const pid = assign[idx];
              const p = pid ? players.find((pp) => pp.id === pid) ?? null : null;
              const armed = selected !== null;
              const active = activeSlot === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (selected !== null) {
                      place(idx, selected);
                      return;
                    }
                    if (p) {
                      clearSlot(idx);
                      return;
                    }
                    setActiveSlot(active ? null : idx);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const raw = e.dataTransfer.getData("text/plain");
                    const id = raw || dragging;
                    if (id) place(idx, id);
                  }}
                  className="absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center gap-[5px] border-0 bg-transparent p-0 transition-transform hover:scale-110"
                  style={{ left: `${slot[1]}%`, top: `${slot[2]}%` }}
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full border-2 text-[15px] font-extrabold"
                    style={{
                      color: p ? "#e9e9ed" : "#9397ab",
                      background: p ? "linear-gradient(150deg,#2fa26a,#12321f)" : "rgba(22,24,38,.75)",
                      borderColor: active || armed ? GOLD : p ? "rgba(227,178,60,.6)" : "rgba(233,233,237,.3)",
                      boxShadow: armed ? "0 0 0 4px rgba(227,178,60,.18), 0 6px 18px rgba(0,0,0,.5)" : "0 6px 18px rgba(0,0,0,.5)",
                    }}
                  >
                    {p ? p.num : slot[0].charAt(0)}
                  </div>
                  <div
                    className="max-w-[104px] overflow-hidden text-ellipsis whitespace-nowrap text-[10.5px] font-bold tracking-[.06em] text-ink"
                    style={{ textShadow: "0 1px 3px rgba(0,0,0,.8)" }}
                  >
                    {p ? p.name : slot[0]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full max-w-[460px] rounded-[14px] p-[16.8px]" style={{ background: "rgba(35,37,50,.75)", boxShadow: "0 0 0 1px #3f424d" }}>
          <div className="flex items-baseline gap-[9px]">
            <div className="text-[11px] font-bold uppercase tracking-[.16em] text-gold">Plantilla</div>
            <div className="flex-1" />
            <div className="text-[11px] text-ink-3">{panelTitle}</div>
          </div>
          <div className="rule-fade my-[11.2px]" />
          <div className="grid max-h-[440px] gap-[2.8px] overflow-auto">
            {players.map((p) => {
              const tier = tierOf(p.ovr);
              const inSlot = slotOf(p.id);
              const taken = inSlot !== null;
              const isSel = selected === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", p.id);
                    e.dataTransfer.effectAllowed = "move";
                    setDragging(p.id);
                  }}
                  onDragEnd={() => setDragging(null)}
                  onClick={() => {
                    if (activeSlot !== null) {
                      place(activeSlot, p.id);
                      return;
                    }
                    if (taken && inSlot !== null) {
                      clearSlot(inSlot);
                      return;
                    }
                    setSelected(isSel ? null : p.id);
                  }}
                  className="flex cursor-grab items-center gap-[9px] rounded-lg border px-[9px] py-[7px] text-left transition-colors hover:border-green hover:bg-[rgba(47,162,106,.12)]"
                  style={{
                    opacity: taken ? 0.55 : 1,
                    background: isSel ? "rgba(227,178,60,.14)" : taken ? "rgba(47,162,106,.06)" : "transparent",
                    borderColor: isSel ? GOLD : taken ? "rgba(47,162,106,.28)" : "rgba(233,233,237,.14)",
                  }}
                >
                  <span
                    className="flex h-[26px] w-[26px] items-center justify-center rounded-full text-[11px] font-extrabold"
                    style={{ background: taken ? "rgba(47,162,106,.22)" : "rgba(233,233,237,.08)", color: taken ? "#7ee0a8" : "#b2b6ca" }}
                  >
                    {p.num}
                  </span>
                  <span className="flex-1 truncate text-[12.5px] font-semibold text-ink">{p.name}</span>
                  <span className="text-[10px] font-bold tracking-[.08em]" style={{ color: taken ? GREEN : GOLD }}>
                    {taken ? "EN CANCHA" : isSel ? "ELEGIDO" : ""}
                  </span>
                  <span className="text-[10.5px] font-bold tracking-[.08em] text-ink-4">{p.pos}</span>
                  <span className="text-[12px] font-extrabold" style={{ color: tier.ink }}>
                    {p.ovr ?? "–"}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-[14px] flex gap-[5.6px]">
            <button
              type="button"
              onClick={autoFill}
              className="flex-1 cursor-pointer rounded-lg border border-green py-[9px] text-[12px] font-bold tracking-[.06em] text-green-light transition-colors hover:bg-[rgba(47,162,106,.16)]"
            >
              AUTO XI
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="flex-1 cursor-pointer rounded-lg border border-[rgba(233,233,237,.22)] py-[9px] text-[12px] font-bold tracking-[.06em] text-ink-2 transition-colors hover:border-red hover:text-red"
            >
              LIMPIAR
            </button>
          </div>
          <div className="mt-[9px] rounded-lg px-[11.2px] py-[9px] font-mono text-[11.5px] leading-[1.5] text-ink-3" style={{ background: "rgba(22,24,38,.6)" }}>
            {formation} · {namedLineup}
          </div>
        </div>
      </div>
    </section>
  );
}
