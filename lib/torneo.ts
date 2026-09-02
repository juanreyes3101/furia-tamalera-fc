import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseCsv } from "csv-parse/sync";

const DATA_DIR = resolve(process.cwd(), "data");
const BOGOTA_TZ = "America/Bogota";

export type ProximoPartido = {
  rival: string;
  fechaHora: string | null;
  tipo: string;
  lugar: string;
};

export type StandingRow = {
  pos: number;
  equipo: string;
  isFuria: boolean;
  pj: number;
  g: number;
  e: number;
  p: number;
  dg: number;
  pts: number;
};

export type Fixture = {
  fecha: string | null;
  titulo: string;
  meta: string;
  tag: string;
};

function readCsv<T extends Record<string, string>>(filename: string): T[] {
  const raw = readFileSync(resolve(DATA_DIR, filename), "utf-8");
  return parseCsv(raw, { columns: true, skip_empty_lines: true, trim: true }) as T[];
}

function toInt(value: string | undefined): number {
  const n = parseInt(value ?? "", 10);
  return Number.isFinite(n) ? n : 0;
}

export function getProximoPartido(): ProximoPartido {
  const [row] = readCsv<{ rival: string; fecha_hora: string; tipo: string; lugar: string }>(
    "proximo_partido.csv"
  );
  return {
    rival: row?.rival?.trim() || "",
    fechaHora: row?.fecha_hora?.trim() || null,
    tipo: row?.tipo?.trim() || "Amistoso",
    lugar: row?.lugar?.trim() || "Bogotá · por confirmar",
  };
}

export function getTablaPosiciones(): StandingRow[] {
  const rows = readCsv<{ equipo: string; pj: string; g: string; e: string; p: string; dg: string; pts: string }>(
    "tabla_posiciones.csv"
  );
  const parsed = rows.map((r) => ({
    equipo: r.equipo?.trim() || "Equipo",
    pj: toInt(r.pj),
    g: toInt(r.g),
    e: toInt(r.e),
    p: toInt(r.p),
    dg: toInt(r.dg),
    pts: toInt(r.pts),
  }));
  parsed.sort((a, b) => b.pts - a.pts || b.dg - a.dg || b.g - a.g);
  return parsed.map((r, i) => ({
    ...r,
    pos: i + 1,
    isFuria: r.equipo.toLowerCase().includes("furia"),
  }));
}

export function getCalendario(): Fixture[] {
  const rows = readCsv<{ fecha: string; titulo: string; meta: string; tag: string }>("calendario.csv");
  return rows.map((r) => ({
    fecha: r.fecha?.trim() || null,
    titulo: r.titulo?.trim() || "",
    meta: r.meta?.trim() || "",
    tag: r.tag?.trim() || "Amistoso",
  }));
}

export function formatDayMonth(iso: string | null): { day: string; month: string } {
  if (!iso) return { day: "—", month: "" };
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { day: "—", month: "" };
  const day = new Intl.DateTimeFormat("es-CO", { day: "2-digit", timeZone: BOGOTA_TZ }).format(d);
  const month = new Intl.DateTimeFormat("es-CO", { month: "short", timeZone: BOGOTA_TZ })
    .format(d)
    .replace(".", "")
    .toUpperCase();
  return { day, month };
}

export function formatFechaLarga(iso: string | null): string {
  if (!iso) return "Por confirmar";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Por confirmar";
  const fecha = new Intl.DateTimeFormat("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: BOGOTA_TZ,
  }).format(d);
  const hora = new Intl.DateTimeFormat("es-CO", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: BOGOTA_TZ,
  }).format(d);
  const fechaCap = fecha.charAt(0).toUpperCase() + fecha.slice(1);
  return `${fechaCap} · ${hora}`;
}

export function tagColor(tag: string): string {
  const t = tag.toLowerCase();
  if (t.includes("oficial")) return "#e3b23c";
  if (t.includes("amistoso")) return "#2fa26a";
  return "#75798c";
}
