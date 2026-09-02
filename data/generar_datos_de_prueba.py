import csv
import random

random.seed(11)

# Roster de PRUEBA con apodos ficticios (para validar el pipeline).
# Los nombres reales del equipo van en roster_interno_CONFIDENCIAL.csv /
# roster_publico_TEMPLATE.csv y no se usan aquí.
jugadores = [
    "Jugador Demo 1", "Jugador Demo 2", "Jugador Demo 3", "Jugador Demo 4",
    "Jugador Demo 5", "Jugador Demo 6", "Jugador Demo 7", "Jugador Demo 8",
    "Jugador Demo 9", "Jugador Demo 10", "Jugador Demo 11", "Jugador Demo 12",
    "Jugador Demo 13", "Jugador Demo 14", "Jugador Demo 15", "Jugador Demo 16",
]

# Algunos jugadores de prueba son polifacéticos (más de una posición), la
# mayoría reporta solo una — igual que se espera en la vida real. Etiquetas
# tal como aparecen en el Form de Tally (ver POSITION_LABELS en procesar_stats.py).
POSICIONES_POR_JUGADOR = {
    "Jugador Demo 1": "Delantero (9)",
    "Jugador Demo 2": "Mediocampista Central",
    "Jugador Demo 3": "Defensa Central",
    "Jugador Demo 4": "Volante Izquierdo, Lateral Izquierdo",
    "Jugador Demo 5": "Lateral Derecho",
    "Jugador Demo 6": "Portero",
    "Jugador Demo 7": "Delantero (9), Volante Derecho",
    "Jugador Demo 8": "Mediocampista Central",
    "Jugador Demo 9": "Defensa Central",
    "Jugador Demo 10": "Delantero (9)",
    "Jugador Demo 11": "Volante Derecho",
    "Jugador Demo 12": "Lateral Izquierdo, Delantero (9)",
    "Jugador Demo 13": "Mediocampista Central",
    "Jugador Demo 14": "Delantero (9)",
    "Jugador Demo 15": "Lateral Derecho",
    "Jugador Demo 16": "Portero",
}

stats = ["pac", "sho", "pas", "dri", "def", "phy"]
letras = ["A", "B", "C", "D"]
pesos = [0.28, 0.34, 0.26, 0.12]

with open("respuestas_form.csv", "w", newline="", encoding="utf-8") as f:
    cols = ["jugador", "posiciones"]
    for s in stats:
        cols += [f"{s}_escala", f"{s}_situacion"]
    w = csv.writer(f)
    w.writerow(cols)
    for jugador in jugadores:
        row = [jugador, POSICIONES_POR_JUGADOR[jugador]]
        for s in stats:
            row.append(random.randint(4, 9))  # escala 1-10, sesgo realista
            row.append(random.choices(letras, weights=pesos, k=1)[0])
        w.writerow(row)

print("respuestas_form.csv generado (formato autoevaluación v2, con posiciones múltiples)")
