"use client";

import PlayerDetail from "./PlayerDetail";
import type { Player } from "@/lib/types";

export default function PlayerDetailOverlay({ player, onClose }: { player: Player; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[90] overflow-y-auto [animation:reveal_.25s_ease-out_both]"
      style={{ background: "rgba(10,11,18,.86)", backdropFilter: "blur(6px)" }}
    >
      <div onClick={(e) => e.stopPropagation()} className="mx-auto min-h-full max-w-[1240px] pt-[80px]">
        <PlayerDetail player={player} onClose={onClose} />
      </div>
    </div>
  );
}
