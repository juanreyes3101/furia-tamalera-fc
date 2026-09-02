/**
 * Furia Tamalera FC — sync Tally → data/players.json
 * ----------------------------------------------------------------------------
 * Transform-only script: it does NOT call the Tally API. It reads a snapshot
 * of submissions (data/tally_export.json, written by Claude via the Tally MCP
 * connector's fetch_submissions) plus the manually-curated roster CSV, and
 * regenerates data/players.json — the single source of truth the Next.js
 * site reads at build time. No API key ever touches the frontend.
 *
 * Ported from data/procesar_stats.py (Pandas), fixed for how Tally actually
 * exports "situación técnica" answers: the full option text (e.g. "3 o más"),
 * not a bare "A"/"B"/"C"/"D" letter as the Python script assumed.
 *
 * Usage: npm run sync:tally
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseCsv } from "csv-parse/sync";
import type { Player, Position } from "../lib/types";

const ROOT = resolve(__dirname, "..");
const TALLY_EXPORT = resolve(ROOT, "data/tally_export.json");
const ROSTER_CSV = resolve(ROOT, "data/roster_publico_TEMPLATE.csv");
const OUTPUT = resolve(ROOT, "data/players.json");

const STATS = ["pac", "sho", "pas", "dri", "def", "phy"] as const;
type Stat = (typeof STATS)[number];

// Etiquetas EXACTAS de la pregunta de casillas del form (case-insensitive).
const POSITION_LABELS: Record<string, Position> = {
  "portero": "POR",
  "lateral derecho": "DEF",
  "lateral izquierdo": "DEF",
  "defensa central": "DEF",
  "volante derecho": "MED",
  "volante izquierdo": "MED",
  "mediocampista central": "MED",
  "delantero (9)": "DEL",
};

// questionId -> stat, para las preguntas de escala 1-10
const SCALE_QUESTION: Record<string, Stat> = {
  XMOrYV: "pac",
  "0Jo7JQ": "sho",
  "5GE4Gb": "pas",
  YMVRM0: "dri",
  l7Vq76: "def",
  o7lD7M: "phy",
};

// questionId -> stat, para las preguntas de situación técnica (texto completo -> puntaje)
const SITUATION_QUESTION: Record<string, Stat> = {
  "8PjzPo": "pac",
  zrWNrE: "sho",
  dDQNDN: "pas",
  DJ0KJp: "dri",
  RJ8dJP: "def",
  GJYKJz: "phy",
};

function invert(map: Record<string, Stat>): Record<Stat, string> {
  const out = {} as Record<Stat, string>;
  for (const [qid, stat] of Object.entries(map)) out[stat] = qid;
  return out;
}
const STAT_TO_SCALE_QID = invert(SCALE_QUESTION);
const STAT_TO_SITUATION_QID = invert(SITUATION_QUESTION);

// Texto completo de cada opción A-D -> puntaje fijo (mismo criterio en las 6, ver docs/plan-de-accion.md)
const SITUATION_TEXT_SCORE: Record<Stat, Record<string, number>> = {
  pac: {
    "llego antes que el balón": 95,
    "llego a tiempo, sin sobresaltos": 78,
    "llego, pero ya cansado": 60,
    "llego cuando el equipo ya está celebrando": 45,
  },
  sho: {
    "3 o más": 95,
    "2": 78,
    "1": 60,
    "ninguno, pero lo intento con toda la confianza": 45,
  },
  pas: {
    "se lo entrego de inmediato": 95,
    "evalúo y paso si conviene": 78,
    "intento resolverlo yo primero": 60,
    "prefiero no arriesgar el pase": 45,
  },
  dri: {
    "me lo saco con facilidad": 95,
    "a veces sí, a veces no": 78,
    "prefiero pasar antes de intentar el regate": 60,
    "pierdo el balón casi siempre": 45,
  },
  def: {
    "recupero el balón limpio": 95,
    "hago la falta a tiempo si toca": 78,
    "llego tarde pero acompaño": 60,
    "no es mi fuerte, prefiero otras zonas": 45,
  },
  phy: {
    "gano el duelo casi siempre": 95,
    "depende del rival": 78,
    "suelo caer con facilidad": 60,
    "evito el contacto directo": 45,
  },
};

const QUESTION_ID = {
  quienEres: "g7WeZK",
  posiciones: "dDQNRd",
  bonusNota: "VMojMl",
} as const;

const OVR_WEIGHTS_BY_POSITION: Record<Position, Record<Stat, number>> = {
  DEF: { pac: 0.1, sho: 0.05, pas: 0.15, dri: 0.1, def: 0.4, phy: 0.2 },
  MED: { pac: 0.1, sho: 0.15, pas: 0.3, dri: 0.2, def: 0.15, phy: 0.1 },
  DEL: { pac: 0.2, sho: 0.35, pas: 0.1, dri: 0.2, def: 0.05, phy: 0.1 },
  POR: { pac: 0.15, sho: 0.025, pas: 0.2, dri: 0.025, def: 0.3, phy: 0.3 },
};

function scaleToScore(value: number): number {
  const v = Math.max(1, Math.min(10, value));
  return 40 + ((v - 1) / 9) * 59;
}

function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type TallyAnswer = { questionId: string; answer: unknown };
type TallySubmission = { id: string; isCompleted: boolean; submittedAt: string; responses: TallyAnswer[] };
type TallyExport = { questions: { id: string; label: string }[]; submissions: TallySubmission[] };

type RosterRow = {
  jugador: string;
  nombre_publico: string;
  apellido: string;
  apodo: string;
  dorsal: string;
  edad: string;
  posicion_override: string;
  pac_override: string;
  sho_override: string;
  pas_override: string;
  dri_override: string;
  def_override: string;
  phy_override: string;
  nota_override: string;
};

/** Ajustes manuales del mánager por stat (roster_publico_TEMPLATE.csv,
 * columnas *_override) — si hay un número válido, reemplaza el valor
 * calculado del form antes de sacar el OVR. */
function applyStatOverrides(scores: Record<Stat, number>, r: RosterRow): Record<Stat, number> {
  const out = { ...scores };
  for (const stat of STATS) {
    const raw = r[`${stat}_override` as keyof RosterRow]?.trim();
    if (!raw) continue;
    const n = parseInt(raw, 10);
    if (Number.isFinite(n)) out[stat] = Math.min(99, Math.max(1, n));
  }
  return out;
}

const VALID_POSITIONS: Position[] = ["POR", "DEF", "MED", "DEL"];

/** OVR que tendría el jugador si su posición primaria fuera cada uno de los
 * buckets que marcó en el form; se queda con la que le da mejor media — así
 * la posición principal refleja dónde rinde mejor, no cuál casilla clicó
 * primero. */
function bestFitPrimary(scores: Record<Stat, number>, buckets: Position[]): { primary: Position; ovr: number } {
  let best = { primary: buckets[0], ovr: -1 };
  for (const bucket of buckets) {
    const weights = OVR_WEIGHTS_BY_POSITION[bucket];
    const ovr = Math.round(STATS.reduce((acc, s) => acc + scores[s] * weights[s], 0));
    if (ovr > best.ovr) best = { primary: bucket, ovr };
  }
  return best;
}

function answerOf(sub: TallySubmission, questionId: string): unknown {
  return sub.responses.find((r) => r.questionId === questionId)?.answer;
}

function parsePositions(labels: string[]): { buckets: Position[]; detail: string[] } {
  const buckets: Position[] = [];
  const detail: string[] = [];
  for (const label of labels) {
    const bucket = POSITION_LABELS[label.trim().toLowerCase()];
    if (!bucket) throw new Error(`Posición no reconocida en Tally: "${label}"`);
    if (!buckets.includes(bucket)) buckets.push(bucket);
    detail.push(label.trim());
  }
  return { buckets, detail };
}

function main() {
  if (!existsSync(TALLY_EXPORT)) {
    throw new Error(`No existe ${TALLY_EXPORT}. Pídele a Claude que traiga las submissions de Tally primero.`);
  }
  const tally: TallyExport = JSON.parse(readFileSync(TALLY_EXPORT, "utf-8"));

  const rosterCsv = readFileSync(ROSTER_CSV, "utf-8");
  const roster = parseCsv(rosterCsv, { columns: true, skip_empty_lines: true }) as RosterRow[];
  const rosterByName = new Map(roster.map((r) => [r.jugador.trim(), r]));

  // 1) dedup: una submission por jugador, la más reciente por submittedAt
  const latestByPlayer = new Map<string, TallySubmission>();
  for (const sub of tally.submissions) {
    if (!sub.isCompleted) continue;
    const who = answerOf(sub, QUESTION_ID.quienEres);
    const jugador = Array.isArray(who) ? String(who[0]) : String(who ?? "");
    if (!jugador) continue;
    const prev = latestByPlayer.get(jugador);
    if (!prev || new Date(sub.submittedAt) > new Date(prev.submittedAt)) {
      latestByPlayer.set(jugador, sub);
    }
  }
  const duplicated = tally.submissions.filter((s) => s.isCompleted).length - latestByPlayer.size;
  if (duplicated > 0) {
    console.log(`⚠️  ${duplicated} respuesta(s) duplicada(s) descartada(s) (se usó la más reciente por jugador).`);
  }

  // 2) validar que el roster tenga nombre_publico/apodo/dorsal para todos los que ya respondieron
  const faltantes: string[] = [];
  for (const jugador of latestByPlayer.keys()) {
    const r = rosterByName.get(jugador);
    if (!r || !r.nombre_publico?.trim() || !r.apodo?.trim() || !r.dorsal?.trim()) {
      faltantes.push(jugador);
    }
  }
  if (faltantes.length) {
    throw new Error(
      `Faltan nombre_publico/apodo/dorsal en roster_publico_TEMPLATE.csv para: ${faltantes.join(", ")}`
    );
  }

  // 3) construir un Player completo por cada fila del roster (las 16)
  const players: Player[] = roster.map((r) => {
    const sub = latestByPlayer.get(r.jugador.trim());
    // Nombre + apellido para el id: dos jugadores pueden compartir nombre_publico
    // (ej. dos "Juan Camilo") y el apellido es lo que los distingue de forma única.
    const id = slugify(`${r.nombre_publico} ${r.apellido ?? ""}`.trim() || r.jugador);
    const num = parseInt(r.dorsal, 10);
    const edadParsed = parseInt(r.edad, 10);
    const edad = Number.isFinite(edadParsed) ? edadParsed : null;

    if (!sub) {
      return {
        id,
        name: r.nombre_publico.trim(),
        apellido: (r.apellido ?? "").trim(),
        edad,
        nickname: r.apodo.trim(),
        num,
        pos: "MED",
        positions: [],
        positionsDetail: [],
        pac: null, sho: null, pas: null, dri: null, def: null, phy: null,
        ovr: null,
        note: [],
        note_raw: null,
        photo: null,
        status: "pending",
        respondedAt: null,
      };
    }

    const posAnswer = answerOf(sub, QUESTION_ID.posiciones);
    const posLabels = Array.isArray(posAnswer) ? posAnswer.map(String) : [];
    const { buckets, detail } = parsePositions(posLabels);
    if (!buckets.length) throw new Error(`${r.jugador} no marcó ninguna posición en el Form.`);

    const scores: Record<Stat, number> = { pac: 0, sho: 0, pas: 0, dri: 0, def: 0, phy: 0 };
    for (const stat of STATS) {
      const scaleQid = STAT_TO_SCALE_QID[stat];
      const situQid = STAT_TO_SITUATION_QID[stat];
      const scaleVal = Number(answerOf(sub, scaleQid));
      const situRaw = answerOf(sub, situQid);
      const situText = String(Array.isArray(situRaw) ? situRaw[0] : situRaw ?? "").trim().toLowerCase();
      const situScore = SITUATION_TEXT_SCORE[stat][situText];
      if (situScore === undefined) {
        throw new Error(`${r.jugador}: respuesta de situación no reconocida para ${stat.toUpperCase()}: "${situText}"`);
      }
      const combined = 0.5 * scaleToScore(scaleVal) + 0.5 * situScore;
      scores[stat] = Math.min(99, Math.max(40, Math.round(combined)));
    }
    const adjustedScores = applyStatOverrides(scores, r);

    const override = r.posicion_override?.trim().toUpperCase() as Position | undefined;
    let primary: Position;
    let ovr: number;
    if (override && VALID_POSITIONS.includes(override)) {
      primary = override;
      const weights = OVR_WEIGHTS_BY_POSITION[primary];
      ovr = Math.round(STATS.reduce((acc, s) => acc + adjustedScores[s] * weights[s], 0));
    } else {
      ({ primary, ovr } = bestFitPrimary(adjustedScores, buckets));
    }

    const bonusRaw = answerOf(sub, QUESTION_ID.bonusNota);
    const noteRaw = typeof bonusRaw === "string" && bonusRaw.trim() ? bonusRaw.trim() : null;

    return {
      id,
      name: r.nombre_publico.trim(),
      apellido: (r.apellido ?? "").trim(),
      edad,
      nickname: r.apodo.trim(),
      num,
      pos: primary,
      positions: buckets,
      positionsDetail: detail,
      pac: adjustedScores.pac, sho: adjustedScores.sho, pas: adjustedScores.pas, dri: adjustedScores.dri, def: adjustedScores.def, phy: adjustedScores.phy,
      ovr,
      // se publica solo cuando el mánager aprueba note_raw en nota_override; separa varias
      // opciones con "|" (ej. "Guaro|Osito") y la ficha elige una al azar en cada visita.
      note: (r.nota_override ?? "")
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean),
      note_raw: noteRaw,
      photo: null,
      status: "answered",
      respondedAt: sub.submittedAt,
    };
  });

  const idCounts = new Map<string, number>();
  for (const p of players) idCounts.set(p.id, (idCounts.get(p.id) ?? 0) + 1);
  const idsDuplicados = [...idCounts.entries()].filter(([, n]) => n > 1).map(([id]) => id);
  if (idsDuplicados.length) {
    throw new Error(
      `nombre_publico + apellido genera el mismo id para más de un jugador: ${idsDuplicados.join(", ")}. ` +
        `Ajusta nombre_publico o apellido en roster_publico_TEMPLATE.csv para que cada uno sea único.`
    );
  }

  writeFileSync(OUTPUT, JSON.stringify(players, null, 2) + "\n", "utf-8");

  const answered = players.filter((p) => p.status === "answered").length;
  const pendingNotes = players.filter((p) => p.note_raw && p.note.length === 0).map((p) => p.name);
  console.log(`✅ ${players.length} jugadores en data/players.json (${answered} con respuesta, ${players.length - answered} pendientes).`);
  if (pendingNotes.length) {
    console.log(`📝 note_raw pendiente de aprobar (revisa y copia a "note" cuando esté listo): ${pendingNotes.join(", ")}`);
  }
}

main();
