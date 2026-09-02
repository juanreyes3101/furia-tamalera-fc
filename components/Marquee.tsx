function MarqueeItems() {
  return (
    <div className="flex gap-[33.6px] whitespace-nowrap pr-[33.6px] text-[11.5px] font-semibold uppercase tracking-[.24em] text-ink-4">
      <span>Torneo Fansport</span>
      <span className="text-green">◆</span>
      <span>Bogotá</span>
      <span className="text-gold">◆</span>
      <span>Fútbol 8</span>
      <span className="text-red">◆</span>
      <span>Amistoso este fin de semana</span>
      <span className="text-green">◆</span>
      <span>Arranca el torneo la próxima</span>
      <span className="text-gold">◆</span>
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="overflow-hidden border-y border-[rgba(233,233,237,.10)] bg-[rgba(35,37,50,.45)] py-[9px]">
      <div className="flex w-max [animation:marquee_28s_linear_infinite]">
        <MarqueeItems />
        <MarqueeItems />
      </div>
    </div>
  );
}
