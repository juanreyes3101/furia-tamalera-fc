const BALL_SPOTS: [number, number, number][] = [
  [6, 18, 190], [82, 12, 120], [14, 62, 96], [68, 74, 150], [42, 34, 74],
];
const EMBER_COLORS = ["#2fa26a", "#e3b23c", "#e04b2a"];

export default function BackgroundFX() {
  const balls = BALL_SPOTS.map(([l, t, size], i) => ({
    l, t, size,
    dur: 34 + i * 9,
    delay: i * 2.5,
  }));
  const embers = Array.from({ length: 9 }, (_, i) => ({
    l: Math.round((i * 37 + 11) % 100),
    s: 2 + (i % 3),
    c: EMBER_COLORS[i % 3],
    d: 12 + (i % 7) * 2.5,
    delay: (i * 1.4) % 16,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60vw 60vw at 8% 4%, rgba(47,162,106,.22), transparent 62%), radial-gradient(52vw 52vw at 96% 40%, rgba(224,75,42,.18), transparent 62%), radial-gradient(48vw 48vw at 45% 104%, rgba(227,178,60,.15), transparent 62%)",
        }}
      />
      <div
        className="absolute will-change-transform"
        style={{
          width: "46vw",
          height: "46vw",
          left: "6vw",
          top: "-10vw",
          borderRadius: "50%",
          filter: "blur(70px)",
          opacity: 0.42,
          background: "radial-gradient(circle at 50% 50%, rgba(47,162,106,.5), rgba(47,162,106,0) 68%)",
          animation: "aurora 30s ease-in-out infinite",
        }}
      />
      <div
        className="absolute inset-0 opacity-[.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(233,233,237,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(233,233,237,.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at 50% 30%, #000 20%, transparent 78%)",
        }}
      />
      {balls.map((b, i) => (
        <div
          key={i}
          className="absolute will-change-transform"
          style={{
            left: `${b.l}%`,
            top: `${b.t}%`,
            width: b.size,
            height: b.size,
            opacity: 0.1,
            animation: `ballDrift ${b.dur}s ease-in-out ${b.delay}s infinite`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/balon.png" alt="" className="block h-full w-full" />
        </div>
      ))}
      {embers.map((e, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            bottom: "-30px",
            left: `${e.l}%`,
            width: e.s,
            height: e.s,
            background: e.c,
            boxShadow: `0 0 12px ${e.c}`,
            animation: `ember ${e.d}s linear ${e.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
