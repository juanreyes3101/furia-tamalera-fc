const STATS = [
  { value: "16", label: "Jugadores", color: "text-ink" },
  { value: "~60", label: "Equipos rivales", color: "text-ink" },
  { value: "6", label: "Formaciones", color: "text-ink" },
  { value: "1", label: "Objetivo: la copa", color: "text-gold" },
];

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-[44.8px] px-[22.4px] pb-14 pt-[78px] sm:[grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
      <div>
        <div className="inline-flex items-center gap-[8.4px] rounded-full border border-[rgba(227,178,60,.35)] bg-[rgba(227,178,60,.08)] px-[11.2px] py-[5px] text-[11px] font-semibold uppercase tracking-[.16em] text-gold">
          <span className="h-1.5 w-1.5 rounded-full bg-red [animation:pulse_1.8s_ease-in-out_infinite]" />
          Est. 2026 · Bogotá · Fútbol 8
        </div>

        <h1 className="mt-[16.8px] text-[clamp(46px,7.2vw,92px)] font-extrabold leading-[.92] tracking-[-.035em] text-balance">
          <span className="block text-ink">FURIA</span>
          <span
            className="block bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(96deg,#e3b23c,#e04b2a 46%,#2fa26a)" }}
          >
            TAMALERA
          </span>
        </h1>

        <p className="mt-[16.8px] max-w-[52ch] text-[17px] text-ink-2 text-pretty">
          Dieciséis amigos, un torneo de verdad y cero excusas. Jugamos por la diversión, competimos para
          medir hasta dónde llega este grupo. Bienvenido al parche.
        </p>

        <div className="mt-[22.4px] flex flex-wrap gap-[11.2px]">
          <a
            href="#plantilla"
            className="rounded-lg border border-green px-5 py-[11px] text-[14px] font-semibold tracking-[.03em] text-green-light transition-colors hover:bg-[rgba(47,162,106,.16)] hover:text-[#c9f5dc]"
          >
            Ver la plantilla
          </a>
          <a
            href="https://www.tiktok.com/@furia_tamalera_fc"
            target="_blank"
            rel="noopener"
            className="rounded-lg border border-[rgba(233,233,237,.22)] px-5 py-[11px] text-[14px] font-semibold tracking-[.03em] text-ink-2 transition-colors hover:border-[rgba(227,178,60,.55)] hover:text-gold"
          >
            TikTok @furia_tamalera_fc
          </a>
        </div>

        <div className="mt-[33.6px] grid max-w-[560px] grid-cols-2 gap-[11.2px] sm:[grid-template-columns:repeat(auto-fit,minmax(118px,1fr))]">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-lg bg-[rgba(35,37,50,.7)] p-[11.2px] shadow-[0_0_0_1px_#3f424d]">
              <div className={`text-[26px] font-bold tracking-[-.02em] ${s.color}`}>{s.value}</div>
              <div className="text-[10.5px] font-semibold uppercase tracking-[.14em] text-ink-4">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex min-h-[380px] items-center justify-center">
        <div className="absolute aspect-square w-[104%] rounded-full border border-dashed border-[rgba(227,178,60,.22)] [animation:spinslow_60s_linear_infinite]" />
        <div className="absolute aspect-square w-[78%] rounded-full border border-[rgba(47,162,106,.22)] [animation:spinslow_40s_linear_infinite_reverse]" />
        <div className="relative flex w-[84%] max-w-[380px] flex-col items-center gap-[16.8px] [animation:floaty_7s_ease-in-out_infinite]">
          <div
            className="absolute left-1/2 top-[52%] aspect-square w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full [animation:pulse_5s_ease-in-out_infinite]"
            style={{
              filter: "blur(46px)",
              background: "radial-gradient(circle, rgba(227,178,60,.35), rgba(224,75,42,.16) 55%, transparent 72%)",
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/escudo.png"
            alt="Escudo de Furia Tamalera FC"
            className="relative block w-full"
            style={{ filter: "drop-shadow(0 22px 34px rgba(0,0,0,.75)) drop-shadow(0 0 26px rgba(227,178,60,.22))" }}
          />
          <div className="relative text-[11px] font-bold uppercase tracking-[.18em] text-gold">
            El tamal se sirve caliente
          </div>
        </div>
      </div>
    </section>
  );
}
