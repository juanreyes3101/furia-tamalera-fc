import raw from "@/data/players.json";
import type { Player, Position } from "./types";

export const players: Player[] = raw as Player[];

export const POSITION_ORDER: Position[] = ["POR", "DEF", "MED", "DEL"];

export const POSITION_LABEL: Record<Position, string> = {
  POR: "Porteros",
  DEF: "Defensas",
  MED: "Mediocampo",
  DEL: "Delanteros",
};

export function playersByPosition(pos: Position): Player[] {
  return players.filter((p) => p.pos === pos).sort((a, b) => (b.ovr ?? 0) - (a.ovr ?? 0));
}

export function bestPlayer(): Player {
  return players.reduce((a, p) => ((p.ovr ?? 0) > (a.ovr ?? 0) ? p : a), players[0]);
}

export function teamAverageOvr(): number {
  const answered = players.filter((p) => p.ovr !== null);
  if (!answered.length) return 0;
  return Math.round(answered.reduce((a, p) => a + (p.ovr ?? 0), 0) / answered.length);
}
