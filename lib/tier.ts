import type { Player, Tier } from "./types";

export const GREEN = "#2fa26a";
export const GOLD = "#e3b23c";
export const RED = "#e04b2a";

/**
 * Fallback OVR for players who haven't answered the Tally form yet (no stats
 * to weight). Mirrors the simple formula from the design handoff README;
 * once a real submission lands, data/players.json carries the pipeline's
 * position-weighted OVR instead (see scripts/sync-tally.ts).
 */
export function ovrOf(p: Pick<Player, "pos" | "pac" | "sho" | "pas" | "dri" | "def" | "phy">): number | null {
  const { pac, sho, pas, dri, def, phy } = p;
  if (pac == null || sho == null || pas == null || dri == null || def == null || phy == null) return null;
  if (p.pos === "POR") return Math.round((def * 2 + phy * 2 + pas + pac) / 7);
  return Math.round((pac + sho + pas + dri + def + phy) / 6);
}

export function tierOf(ovr: number | null): Tier {
  if (ovr === null) {
    return { label: "Bronce", ink: GREEN, tintA: "rgba(47,162,106,.20)", tintB: "rgba(22,24,38,.4)", edge: "rgba(47,162,106,.32)" };
  }
  if (ovr >= 76) return { label: "Oro", ink: GOLD, tintA: "rgba(227,178,60,.30)", tintB: "rgba(224,75,42,.18)", edge: "rgba(227,178,60,.45)" };
  if (ovr >= 68) return { label: "Plata", ink: "#cfd3e5", tintA: "rgba(207,211,229,.16)", tintB: "rgba(47,162,106,.14)", edge: "#595d6c" };
  return { label: "Bronce", ink: "#7ee0a8", tintA: "rgba(47,162,106,.20)", tintB: "rgba(22,24,38,.4)", edge: "rgba(47,162,106,.32)" };
}
