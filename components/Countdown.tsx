"use client";

import { useEffect, useState } from "react";

// Respaldo si data/proximo_partido.csv viene vacío o con una fecha inválida:
// apunta al próximo sábado 15:00 para que el countdown nunca se rompa.
function fallbackKickoff(): Date {
  const d = new Date();
  d.setHours(15, 0, 0, 0);
  const days = (6 - d.getDay() + 7) % 7 || 7;
  d.setDate(d.getDate() + days);
  return d;
}

function resolveTarget(targetDate?: string): Date {
  if (targetDate) {
    const d = new Date(targetDate);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return fallbackKickoff();
}

const pad = (n: number) => (n < 10 ? "0" + n : String(n));

function useCountdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const raf = requestAnimationFrame(tick);
    const id = setInterval(tick, 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, []);
  return now;
}

export default function Countdown({ targetDate }: { targetDate?: string }) {
  const now = useCountdown();
  const target = resolveTarget(targetDate);
  const left = now === null ? 0 : Math.max(0, target.getTime() - now);

  const dd = Math.floor(left / 86400000);
  const hh = Math.floor((left % 86400000) / 3600000);
  const mm = Math.floor((left % 3600000) / 60000);
  const ss = Math.floor((left % 60000) / 1000);

  const boxes = [
    { value: pad(dd), label: "Días", ink: "#e3b23c" },
    { value: pad(hh), label: "Horas", ink: "#e9e9ed" },
    { value: pad(mm), label: "Min", ink: "#e9e9ed" },
    { value: pad(ss), label: "Seg", ink: "#2fa26a" },
  ];

  return (
    <section
      aria-label="Cuenta regresiva al debut"
      className="relative overflow-hidden border-b border-[rgba(233,233,237,.10)]"
      style={{ background: "linear-gradient(120deg,#12321f,#161826 58%,#2a1a14)" }}
    >
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-[33.6px] px-[22.4px] py-[44.8px]">
        <div className="min-w-[230px] flex-1">
          <h6 className="mb-[8.4px] text-[11px] font-bold uppercase tracking-[.2em] text-red">Cuenta regresiva</h6>
          <h3 className="mb-[5.6px] text-[clamp(22px,2.6vw,30px)] font-semibold tracking-[-.025em]">
            Falta poco para el pitazo
          </h3>
          <p className="max-w-[42ch] text-[13.5px] text-ink-3">
            Primero el amistoso de preparación; la semana siguiente arranca el Torneo Fansport. Hora y sede se
            confirman por TikTok.
          </p>
        </div>
        <div className="flex flex-wrap gap-[11.2px]" suppressHydrationWarning>
          {boxes.map((c) => (
            <div
              key={c.label}
              className="min-w-[82px] rounded-lg px-[16.8px] py-[14px] text-center shadow-[0_0_0_1px_#3f424d]"
              style={{ background: "rgba(22,24,38,.55)" }}
            >
              <div
                className="text-[34px] font-extrabold leading-none tracking-[-.04em] [font-variant-numeric:tabular-nums]"
                style={{ color: c.ink }}
              >
                {c.value}
              </div>
              <div className="mt-[5.6px] text-[10px] font-bold uppercase tracking-[.16em] text-ink-4">{c.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative h-[34px]">
        <div
          className="absolute bottom-4 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(47,162,106,.45) 12%, rgba(47,162,106,.45) 88%, transparent)",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img/balon.png"
          alt=""
          className="absolute bottom-3 h-[26px] w-[26px] [animation:rollAcross_9s_linear_infinite]"
        />
      </div>
    </section>
  );
}
