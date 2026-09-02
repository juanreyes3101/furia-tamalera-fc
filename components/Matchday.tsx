"use client";

import { useEffect, useRef } from "react";

const MEDIA = [
  { slot: "video 9:16", title: "Resumen del amistoso", meta: "Suelta aquí el clip vertical", w: 200, h: 340, offset: 0, tilt: -1.6 },
  { slot: "foto horizontal", title: "Once inicial", meta: "Foto de equipo antes del pitazo", w: 360, h: 230, offset: 46, tilt: 1.2 },
  { slot: "foto", title: "Golazo de la fecha", meta: "Captura del momento", w: 250, h: 280, offset: -14, tilt: -0.8 },
  { slot: "video 9:16", title: "Reacciones", meta: "Clip para TikTok", w: 190, h: 320, offset: 24, tilt: 2 },
  { slot: "foto", title: "Camerino", meta: "Antes de salir", w: 230, h: 230, offset: -8, tilt: -1.4 },
  { slot: "foto horizontal", title: "La hinchada", meta: "El parche en la tribuna", w: 380, h: 260, offset: 38, tilt: 0.9 },
].map((m, i) => ({ ...m, n: i + 1 < 10 ? "0" + (i + 1) : String(i + 1) }));

const MEDIA_LOOP = [...MEDIA, ...MEDIA];
const SPEED = 34; // px/s

// Un solo trazo, reutilizado para las dos flechas (la izquierda es la misma
// rotada 180°) — así quedan garantizado idénticas en grosor y tamaño, sin
// depender de que la fuente tenga los glyphs ← / → parejos.
function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Matchday() {
  const railRef = useRef<HTMLDivElement | null>(null);
  const pos = useRef(0);
  const target = useRef<number | null>(null);
  const paused = useRef(false);
  const last = useRef(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const step = (ts: number) => {
      raf.current = requestAnimationFrame(step);
      const el = railRef.current;
      if (!el) return;
      const dt = last.current ? Math.min(64, ts - last.current) : 16;
      last.current = ts;

      const kids = el.children;
      const n = kids.length / 2;
      const half = n >= 1 && kids[n] ? (kids[n] as HTMLElement).offsetLeft - (kids[0] as HTMLElement).offsetLeft : el.scrollWidth / 2;
      if (half < 2) return;

      if (Math.abs(el.scrollLeft - pos.current) > 3 && target.current === null) pos.current = el.scrollLeft;

      if (target.current !== null) {
        pos.current += (target.current - pos.current) * Math.min(1, dt / 190);
        if (Math.abs(target.current - pos.current) < 0.6) {
          pos.current = target.current;
          target.current = null;
        }
      } else if (!paused.current) {
        pos.current += (SPEED * dt) / 1000;
      } else {
        return;
      }

      while (pos.current >= half) {
        pos.current -= half;
        if (target.current !== null) target.current -= half;
      }
      while (pos.current < 0) {
        pos.current += half;
        if (target.current !== null) target.current += half;
      }
      el.scrollLeft = pos.current;
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  function scrollRail(dir: 1 | -1) {
    const el = railRef.current;
    if (!el) return;
    const base = target.current === null ? pos.current : target.current;
    target.current = base + dir * Math.max(260, el.clientWidth * 0.62);
  }

  return (
    <section id="matchday" className="mx-auto max-w-[1240px] px-[22.4px] pb-[78px] pt-[22.4px]">
      <div data-reveal className="mb-[22.4px] flex flex-wrap items-end gap-[22.4px]">
        <div>
          <h6 className="mb-[8.4px] text-[11px] font-bold uppercase tracking-[.2em] text-gold">Matchday</h6>
          <h2 className="text-[clamp(30px,3.6vw,44px)] font-semibold leading-[1.05] tracking-[-.03em]">
            Lo que pasó en la cancha
          </h2>
        </div>
        <div className="flex-1" />
        <a
          href="https://www.tiktok.com/@furia_tamalera_fc"
          target="_blank"
          rel="noopener"
          className="rounded-lg border border-[rgba(227,178,60,.5)] px-[16.8px] py-[9px] text-[12.5px] font-bold tracking-[.05em] text-gold transition-colors hover:bg-[rgba(227,178,60,.12)]"
        >
          Ver todo en TikTok
        </a>
      </div>

      <div className="relative">
        <div
          ref={railRef}
          onMouseEnter={() => (paused.current = true)}
          onMouseLeave={() => (paused.current = false)}
          onPointerDown={() => (paused.current = true)}
          onTouchStart={() => (paused.current = true)}
          onTouchEnd={() => (paused.current = false)}
          className="no-scrollbar flex min-h-[400px] items-center gap-[18px] overflow-x-auto px-1 pb-11 pt-[34px]"
        >
          {MEDIA_LOOP.map((m, i) => (
            <div
              key={i}
              className="group relative flex flex-none items-end overflow-hidden rounded-[14px] p-[14px] [transform:rotate(var(--tilt))] transition-[transform,box-shadow,background-color] duration-[.35s] ease-[cubic-bezier(.2,.7,.3,1)] hover:[transform:rotate(0deg)_translateY(-8px)_scale(1.03)] hover:[background-color:rgba(27,29,43,.75)] hover:[box-shadow:inset_0_0_0_1px_rgba(47,162,106,.45)]"
              style={{
                width: m.w,
                height: m.h,
                marginTop: m.offset,
                "--tilt": `${m.tilt}deg`,
                backgroundImage: "repeating-linear-gradient(135deg, rgba(233,233,237,.06) 0 8px, rgba(233,233,237,0) 8px 16px)",
                backgroundColor: "rgba(27,29,43,.45)",
                boxShadow: "inset 0 0 0 1px rgba(233,233,237,.07)",
              } as React.CSSProperties}
            >
              <div className="absolute left-[14px] top-[14px] font-mono text-[9.5px] uppercase tracking-[.1em] text-ink-4">
                {m.slot}
              </div>
              <div className="absolute right-[14px] top-3 text-[26px] font-extrabold tracking-[-.04em] text-[rgba(233,233,237,.10)]">
                {m.n}
              </div>
              <div className="relative">
                <div className="text-[13.5px] font-bold text-ink">{m.title}</div>
                <div className="text-[11.5px] text-ink-3">{m.meta}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-[2] flex justify-end gap-[9px]">
          <button
            type="button"
            onClick={() => scrollRail(-1)}
            aria-label="Anterior"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-[rgba(233,233,237,.2)] text-ink-2 transition-colors hover:border-green hover:text-green-light"
            style={{ background: "rgba(35,37,50,.8)" }}
          >
            <ArrowIcon className="rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => scrollRail(1)}
            aria-label="Siguiente"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-[rgba(233,233,237,.2)] text-ink-2 transition-colors hover:border-green hover:text-green-light"
            style={{ background: "rgba(35,37,50,.8)" }}
          >
            <ArrowIcon />
          </button>
        </div>
      </div>
    </section>
  );
}
