"""
Furia Tamalera F.C. — Procesador de Stats estilo EA FC (v2: autoevaluación)
----------------------------------------------------------------------------
Cada jugador llena el Google Form UNA sola vez, calificándose a sí mismo
(12 preguntas cortas: 1 escala 1-10 + 1 situación técnica por cada uno de
los 6 stats). Luego el mánager puede aplicar un ajuste manual por jugador
y por stat (para calibrar al que se sobrevalora) antes de exportar
plantilla.json.

Uso:
    python procesar_stats.py respuestas.csv --roster roster_publico.csv \
        [--ajustes ajustes.csv] -o plantilla.json

CSV de respuestas (una fila por jugador, columnas):
    jugador,
    posiciones,                          <- pregunta de opción múltiple ("casillas") del Form
    pac_escala, pac_situacion,
    sho_escala, sho_situacion,
    pas_escala, pas_situacion,
    dri_escala, dri_situacion,
    def_escala, def_situacion,
    phy_escala, phy_situacion

- "*_escala": número entero 1-10 (pregunta tipo "escala lineal" de Google Forms).
- "*_situacion": letra A-D de la opción elegida en la pregunta técnica corta.
- "posiciones": Tally exporta una pregunta de casillas (checkboxes) como las
  opciones elegidas separadas por coma en una sola celda, ej. "Lateral
  Izquierdo, Volante Izquierdo". Muchos jugadores son polifacéticos, así que
  se acepta más de una posición por persona — ver POSITION_LABELS abajo para
  las 8 etiquetas específicas exactas que tiene la pregunta en el Form
  (Portero, Lateral Derecho, Lateral Izquierdo, Defensa Central, Volante
  Derecho, Volante Izquierdo, Mediocampista Central, Delantero (9)).

CSV de roster público (jugador, nombre_publico, apodo) — nombre_publico es
lo que se muestra en la web/redes: para menores de edad usa SOLO el apodo o
el primer nombre, nunca el nombre completo. La posición YA NO se asigna acá:
cada jugador la reporta él mismo en el Form (columna "posiciones").

CSV de ajustes (opcional): jugador, pac, sho, pas, dri, def, phy — valores
delta (ej. -8, +5) que se suman al puntaje autoevaluado de ese jugador en
ese stat. Deja en blanco o en 0 lo que no necesites tocar.

OVR: se calcula con pesos distintos según la posición PRIMARIA del jugador
(el primer bucket POR/DEF/MED/DEL que le salió al parsear "posiciones") —
ver OVR_WEIGHTS_BY_POSITION abajo. Un defensa pesa más DEF/PHY, un delantero
más SHO/PAC, un volante reparte parejo, y el portero usa una fórmula propia
que no lo penaliza por definición/regate.
"""

import argparse
import json
from pathlib import Path

import numpy as np
import pandas as pd

STATS = ["pac", "sho", "pas", "dri", "def", "phy"]

# Etiquetas EXACTAS que debe tener la pregunta de casillas "¿En qué
# posición(es) juegas normalmente?" en el Form de Tally (case-insensitive).
# Cada posición específica se agrupa en un bucket POR/DEF/MED/DEL para la
# cancha del armador de alineación (index.html), pero el detalle específico
# también se guarda tal cual en "posiciones_detalle".
POSITION_LABELS = {
    "portero": "POR",
    "lateral derecho": "DEF",
    "lateral izquierdo": "DEF",
    "defensa central": "DEF",
    "volante derecho": "MED",
    "volante izquierdo": "MED",
    "mediocampista central": "MED",
    "delantero (9)": "DEL",
}


def parse_posiciones(value) -> tuple[list[str], list[str]]:
    """Devuelve (buckets, detalle): buckets = ["DEF","MED",...] deduplicado
    para la lógica de la cancha; detalle = etiquetas específicas tal como
    las eligió el jugador (ej. "Lateral Izquierdo", "Volante Derecho")."""
    if pd.isna(value) or not str(value).strip():
        return [], []
    etiquetas = [p.strip() for p in str(value).split(",") if p.strip()]
    buckets = []
    detalle = []
    for etiqueta in etiquetas:
        codigo = POSITION_LABELS.get(etiqueta.lower())
        if codigo is None:
            raise ValueError(
                f"Posición no reconocida: '{etiqueta}'. Las opciones de la pregunta del Form "
                f"deben ser exactamente: {', '.join(l.title() for l in POSITION_LABELS)}."
            )
        if codigo not in buckets:
            buckets.append(codigo)
        detalle.append(etiqueta.title() if etiqueta.lower() != "delantero (9)" else "Delantero (9)")
    return buckets, detalle

# Pregunta A: escala 1-10 -> puntaje 40-99 (lineal)
def scale_to_score(value: float) -> float:
    value = max(1, min(10, value))
    return 40 + (value - 1) / 9 * 59

# Pregunta B: situación técnica A-D -> puntaje fijo (mismo criterio en las 6)
SITUATION_MAP = {"A": 95, "B": 78, "C": 60, "D": 45}

# Peso relativo de cada pregunta dentro del stat (autoevaluación + reality check)
WEIGHT_SCALE = 0.5
WEIGHT_SITUATION = 0.5

# Pesos del OVR según la posición PRIMARIA del jugador (el primer bucket que
# marcó en el Form). Igual que en EA FC, cada posición pesa distinto: un
# defensa vive de DEF/PHY, un delantero de SHO/PAC, un volante reparte más
# parejo. El portero usa una fórmula aparte — no tiene sentido penalizarlo
# por "definición" o "regate" cuando esas preguntas casi no le aplican.
OVR_WEIGHTS_BY_POSITION = {
    "DEF": {"PAC": 0.10, "SHO": 0.05, "PAS": 0.15, "DRI": 0.10, "DEF": 0.40, "PHY": 0.20},
    "MED": {"PAC": 0.10, "SHO": 0.15, "PAS": 0.30, "DRI": 0.20, "DEF": 0.15, "PHY": 0.10},
    "DEL": {"PAC": 0.20, "SHO": 0.35, "PAS": 0.10, "DRI": 0.20, "DEF": 0.05, "PHY": 0.10},
    "POR": {"PAC": 0.15, "SHO": 0.025, "PAS": 0.20, "DRI": 0.025, "DEF": 0.30, "PHY": 0.30},
}


def parse_situation(value) -> float:
    if pd.isna(value):
        return np.nan
    letter = str(value).strip()[0].upper()
    if letter not in SITUATION_MAP:
        raise ValueError(f"Respuesta de situación no reconocida: '{value}' (se espera A-D)")
    return SITUATION_MAP[letter]


def build_plantilla(responses_csv: str, roster_csv: str, ajustes_csv: str | None, output_path: str) -> None:
    df = pd.read_csv(responses_csv)
    df.columns = [c.strip().lower() for c in df.columns]

    required = {"jugador", "posiciones"} | {f"{s}_escala" for s in STATS} | {f"{s}_situacion" for s in STATS}
    missing = required - set(df.columns)
    if missing:
        raise SystemExit(f"Faltan columnas en el CSV de respuestas: {sorted(missing)}")

    if df["jugador"].duplicated().any():
        # Alguien respondió más de una vez (típico: se equivocó y volvió a
        # llenar el form para corregirse). En vez de fallar, nos quedamos con
        # su respuesta MÁS RECIENTE. Si el CSV trae una columna de fecha
        # (Tally la exporta como "submitted at" o similar), la usamos para
        # decidir cuál es la más nueva; si no, asumimos que Tally exporta en
        # orden cronológico y nos quedamos con la última fila de cada quien.
        dupes = sorted(set(df.loc[df["jugador"].duplicated(keep=False), "jugador"]))
        fecha_col = next(
            (c for c in df.columns if any(k in c for k in ("submitted", "fecha", "date", "hora", "timestamp"))),
            None,
        )
        if fecha_col:
            df["_ts"] = pd.to_datetime(df[fecha_col], errors="coerce")
            df = df.sort_values("_ts").drop(columns="_ts")
        df = df.drop_duplicates(subset="jugador", keep="last").reset_index(drop=True)
        print(
            f"⚠️  Estos jugadores respondieron más de una vez, se usó su respuesta más reciente: {dupes}"
        )

    posiciones_parsed = dict(zip(df["jugador"], df["posiciones"].apply(parse_posiciones)))
    posiciones_por_jugador = {j: buckets for j, (buckets, _detalle) in posiciones_parsed.items()}
    detalle_por_jugador = {j: detalle for j, (_buckets, detalle) in posiciones_parsed.items()}
    sin_posicion = [j for j, pos in posiciones_por_jugador.items() if not pos]
    if sin_posicion:
        raise SystemExit(f"Estos jugadores no marcaron ninguna posición en el Form: {sin_posicion}")

    # 1) Calcular puntaje por stat = 50% escala + 50% situación técnica
    scores = pd.DataFrame(index=df["jugador"])
    for s in STATS:
        escala_score = df[f"{s}_escala"].astype(float).apply(scale_to_score).values
        situacion_score = df[f"{s}_situacion"].apply(parse_situation).values
        combined = WEIGHT_SCALE * escala_score + WEIGHT_SITUATION * situacion_score
        scores[s.upper()] = combined

    # 2) Aplicar ajustes manuales del mánager (opcional)
    if ajustes_csv and Path(ajustes_csv).exists():
        adj = pd.read_csv(ajustes_csv).set_index("jugador")
        adj.columns = [c.strip().lower() for c in adj.columns]
        for s in STATS:
            if s in adj.columns:
                delta = adj[s].reindex(scores.index).fillna(0)
                scores[s.upper()] = scores[s.upper()] + delta

    scores = scores.round().clip(lower=40, upper=99).astype(int)

    # 3) OVR ponderado según la posición primaria de cada jugador (ver
    #    OVR_WEIGHTS_BY_POSITION arriba). "Primaria" = el primer bucket
    #    POR/DEF/MED/DEL que le salió a partir de lo que marcó en el Form.
    ovr_values = []
    for jugador in scores.index:
        primaria = posiciones_por_jugador[jugador][0]
        pesos = OVR_WEIGHTS_BY_POSITION[primaria]
        ovr = sum(scores.loc[jugador, k] * w for k, w in pesos.items())
        ovr_values.append(round(ovr))
    scores["OVR"] = ovr_values

    # 4) Roster público (nombre a mostrar, apodo, posición)
    #    IMPORTANTE: nombre_publico y apodo son OBLIGATORIOS y NO tienen
    #    fallback al nombre completo interno — así evitamos que, por un
    #    campo vacío, se filtre el nombre legal completo de un menor de
    #    edad al JSON público. Completa roster_publico_TEMPLATE.csv antes
    #    de correr esto.
    roster = pd.read_csv(roster_csv)
    roster.columns = [c.strip().lower() for c in roster.columns]
    roster = roster.set_index("jugador")

    faltantes = set(scores.index) - set(roster.index)
    if faltantes:
        raise SystemExit(f"Estos jugadores respondieron el form pero no están en el roster público: {faltantes}")

    incompletos = [
        j for j in scores.index
        if pd.isna(roster.loc[j].get("nombre_publico")) or str(roster.loc[j].get("nombre_publico")).strip() == ""
        or pd.isna(roster.loc[j].get("apodo")) or str(roster.loc[j].get("apodo")).strip() == ""
    ]
    if incompletos:
        raise SystemExit(
            "Faltan nombre_publico y/o apodo en roster_publico_TEMPLATE.csv para: "
            f"{incompletos}. Para menores de edad, usa SOLO el apodo (sin apellido)."
        )

    jugadores = []
    for jugador, row in scores.iterrows():
        r = roster.loc[jugador]
        posiciones = posiciones_por_jugador[jugador]
        jugadores.append({
            "nombre": str(r["nombre_publico"]).strip(),
            "apodo": str(r["apodo"]).strip(),
            "posiciones": posiciones,
            "posicion": "/".join(posiciones),
            "posiciones_detalle": detalle_por_jugador[jugador],
            "ovr": int(row["OVR"]),
            "pac": int(row["PAC"]),
            "sho": int(row["SHO"]),
            "pas": int(row["PAS"]),
            "dri": int(row["DRI"]),
            "def": int(row["DEF"]),
            "phy": int(row["PHY"]),
        })

    jugadores.sort(key=lambda j: j["ovr"], reverse=True)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump({"equipo": "Furia Tamalera F.C.", "jugadores": jugadores}, f, ensure_ascii=False, indent=2)

    print(f"✅ {len(jugadores)} jugadores procesados → {output_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Procesa autoevaluaciones del Form y genera plantilla.json")
    parser.add_argument("responses_csv", help="CSV exportado de Google Forms (autoevaluación, 1 fila por jugador)")
    parser.add_argument("--roster", required=True, help="CSV con jugador,nombre_publico,apodo")
    parser.add_argument("--ajustes", default=None, help="CSV opcional con ajustes manuales del mánager")
    parser.add_argument("-o", "--output", default="plantilla.json", help="Ruta de salida")
    args = parser.parse_args()

    build_plantilla(args.responses_csv, args.roster, args.ajustes, args.output)
