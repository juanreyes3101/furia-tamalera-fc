import type { Position } from "./types";

export type FormationSlot = [Position, number, number]; // [posición, x%, y%]

export const FORMATIONS: Record<string, FormationSlot[]> = {
  "3-3-1": [["POR", 50, 90], ["DEF", 20, 70], ["DEF", 50, 73], ["DEF", 80, 70], ["MED", 20, 45], ["MED", 50, 46], ["MED", 80, 45], ["DEL", 50, 17]],
  "3-1-3": [["POR", 50, 90], ["DEF", 20, 70], ["DEF", 50, 73], ["DEF", 80, 70], ["MED", 50, 48], ["DEL", 20, 22], ["DEL", 50, 16], ["DEL", 80, 22]],
  "2-3-2": [["POR", 50, 90], ["DEF", 32, 72], ["DEF", 68, 72], ["MED", 18, 48], ["MED", 50, 50], ["MED", 82, 48], ["DEL", 35, 19], ["DEL", 65, 19]],
  "3-2-2": [["POR", 50, 90], ["DEF", 20, 70], ["DEF", 50, 73], ["DEF", 80, 70], ["MED", 33, 46], ["MED", 67, 46], ["DEL", 35, 19], ["DEL", 65, 19]],
  "2-4-1": [["POR", 50, 90], ["DEF", 32, 72], ["DEF", 68, 72], ["MED", 15, 50], ["MED", 38, 52], ["MED", 62, 52], ["MED", 85, 50], ["DEL", 50, 17]],
  "1-3-2-1": [["POR", 50, 90], ["DEF", 50, 74], ["MED", 18, 56], ["MED", 50, 54], ["MED", 82, 56], ["DEL", 30, 28], ["DEL", 70, 28], ["DEL", 50, 13]],
};

export const FORMATION_KEYS = Object.keys(FORMATIONS);

/** Compatible-position fallback order used by AUTO XI when filling a slot. */
export const AUTO_FILL_ORDER: Record<Position, Position[]> = {
  POR: ["POR"],
  DEF: ["DEF", "MED"],
  MED: ["MED", "DEF", "DEL"],
  DEL: ["DEL", "MED"],
};
