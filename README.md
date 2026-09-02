# Furia Tamalera F.C.

Todo lo del plan de acción 360° del equipo: estrategia de redes, formulario + script para las stats estilo EA FC, y la página web (Next.js) con el armador de alineación.

## Qué hay en esta carpeta

```
furia-tamalera-fc/
├── app/, components/, lib/           ← la web (Next.js + Tailwind), ver "La web" abajo
├── data/
│   ├── players.json                  ← fuente de verdad de la web: 16 fichas (generado, no editar a mano)
│   ├── tally_export.json             ← snapshot de las submissions de Tally (gitignored)
│   ├── roster_publico_TEMPLATE.csv   ← nombre, apellido, apodo, dorsal, edad de cada jugador (editable, gitignored)
│   ├── proximo_partido.csv           ← rival/fecha/tipo/lugar del próximo partido (editable, SÍ se sube)
│   ├── tabla_posiciones.csv          ← tabla de posiciones del grupo (editable, SÍ se sube)
│   ├── calendario.csv                ← próximos partidos/fechas (editable, SÍ se sube)
│   ├── procesar_stats.py             ← script de Pandas original (referencia; la web usa scripts/sync-tally.ts)
│   ├── respuestas_form.ejemplo.csv   ← ejemplo del CSV que exporta un form de respuestas
│   ├── plantilla.ejemplo.json        ← salida de ejemplo del script de Pandas
│   └── generar_datos_de_prueba.py    ← genera respuestas ficticias para probar el script de Pandas
├── scripts/
│   └── sync-tally.ts                 ← transforma tally_export.json + roster CSV → data/players.json
├── docs/
│   └── plan-de-accion.md             ← guiones de TikTok/Reels, preguntas del form, contexto
├── legacy/
│   └── index.html                    ← el prototipo estático anterior, archivado
└── roster_interno_CONFIDENCIAL.csv   ← datos reales del equipo (NO se sube a GitHub, ver abajo)
```

## La web (Next.js)

```
npm install
npm run dev      # http://localhost:3000
npm run build    # build estático de producción
```

Las 16 fichas de jugadores salen de `data/players.json`, que **no se edita a mano** — lo genera
`scripts/sync-tally.ts` a partir de `data/tally_export.json` (snapshot de las respuestas de Tally) y
`data/roster_publico_TEMPLATE.csv` (nombre público, apodo y dorsal). Los jugadores que aún no han
respondido el form aparecen igual en la plantilla, marcados como pendientes.

**Para actualizar el roster con nuevas respuestas de Tally:**
1. Pídeme "sincroniza Tally" — traigo las submissions más recientes con el conector MCP y actualizo
   `data/tally_export.json`.
2. Si alguien nuevo respondió, completa su fila en `roster_publico_TEMPLATE.csv` (nombre_publico, apodo,
   dorsal) si no lo has hecho.
3. Corre `npm run sync:tally` — regenera `data/players.json`. El script avisa si a alguien le falta un
   dato del roster, y qué respuestas de "apodo sugerido" (`note_raw`) quedaron pendientes de tu revisión
   antes de publicarse como `note` en la carta del jugador.
4. `npm run dev` para revisar, luego commit + deploy.

## Actualizar el próximo partido, la tabla o el calendario (sin pedírmelo)

Estos 3 datos ya NO están escritos en el código — viven en 3 CSV chiquitos en `data/`, editables por ti
directamente. Cualquier cambio se ve en el sitio en ~1 minuto después de subirlo (Vercel redespliega solo
con cada push a `main`).

**`data/proximo_partido.csv`** — una sola fila (alimenta el countdown y la tarjeta "Próximo partido"):
```
rival,fecha_hora,tipo,lugar
Toros FC,2026-09-06T18:00:00-05:00,Amistoso,Cancha Sintética El Salitre
```
- `fecha_hora`: formato `AAAA-MM-DDTHH:MM:SS-05:00` (el `-05:00` es la hora de Bogotá, no lo cambies).
  Ejemplo: domingo 6 de septiembre, 6:00pm → `2026-09-06T18:00:00-05:00`.
- Deja `rival` vacío si todavía no se sabe (se ve como "?" en la web).

**`data/tabla_posiciones.csv`** — una fila por equipo:
```
equipo,pj,g,e,p,dg,pts
Furia Tamalera FC,3,2,1,0,4,7
Toros FC,3,1,1,1,-1,4
```
No hace falta ordenarla ni poner la posición — la web ordena sola por puntos (y diferencia de gol si hay
empate) y resalta en dorado la fila que contenga "Furia".

**`data/calendario.csv`** — una fila por partido:
```
fecha,titulo,meta,tag
2026-09-13T16:00:00-05:00,Fecha 2 · Torneo Fansport,vs Toros FC,Oficial
```
- `fecha` vacía = se ve como "—" (por confirmar).
- `tag`: escribe "Amistoso" (verde), "Oficial" (dorado), o cualquier otra palabra (gris).

**Cómo editarlos** (elige el que te quede más cómodo):
- **Desde el celular o sin instalar nada**: entra al archivo en GitHub
  (`github.com/juanreyes3101/furia-tamalera-fc/blob/main/data/proximo_partido.csv`), toca el ícono de
  lápiz (Edit), cambia el texto, y abajo dale "Commit changes" directo a `main`. Listo, no necesitas nada
  más — en un rato ya está en `furia-tamalera-fc.vercel.app`.
- **Desde tu computador**: edítalo con Excel/Sheets/Notepad y luego `git add`, `git commit`, `git push`.

## Menores de edad en el equipo

Revisé las fechas de nacimiento que enviaste: **3 de los 16 jugadores son menores de 18 años** (17 años cada uno). Juan confirmó que ya cuentan con autorización de sus padres, así que no hay restricción especial para ellos en la web ni en los videos — puedes usar su nombre completo o apodo con la misma libertad que con el resto del equipo (ver `roster_publico_TEMPLATE.csv`).

Lo único que sigue aplicando igual para los 16, menores o no:

1. **`roster_interno_CONFIDENCIAL.csv` nunca sale de tu computador.** Tiene cédulas, celulares, correos y fechas de nacimiento — datos que Fansport probablemente sí necesita para la inscripción, pero que no tienen nada que hacer en una web pública ni en GitHub. Ya está en el `.gitignore`.
2. El script `procesar_stats.py` sigue **rechazando generar el JSON** si a alguien le falta `nombre_publico` o `apodo` en el roster público — así no se cuela nadie sin nombre asignado, sea cual sea la razón.

## Cómo generar la plantilla real

Probamos hacerlo como página propia (Artifact de Claude), pero **compartir un artifact "en vivo" que guarda respuestas solo está disponible en planes Team/Enterprise de Claude — en Pro (que es el tuyo) no se puede compartir**. La solución final: un formulario real hecho con el conector de **Tally** (gratis, sin límite de respuestas para este volumen).

**El form ya está creado y publicado — este es el que se manda al equipo:**

👉 **https://tally.so/r/ODNAKA**

Tiene las 15 preguntas: el desplegable "¿Quién eres?" con los 16 nombres reales, la pregunta de posición específica (casillas, permite marcar varias — Portero, Lateral Derecho, Lateral Izquierdo, Defensa Central, Volante Derecho, Volante Izquierdo, Mediocampista Central, Delantero (9)), las 12 preguntas de stats (escala 1-10 + situación A-D por cada uno de los 6 stats) y 1 pregunta bonus opcional (apodo sugerido).

1. Manda el link `https://tally.so/r/ODNAKA` al grupo — cada uno lo responde sobre sí mismo (2-3 min).
2. Cuando alguien responda, pídeme "sincroniza Tally" — traigo las respuestas directo desde Tally
   (`fetch_submissions`) sin que tengas que exportar nada a mano, y actualizo `data/tally_export.json`.
3. Abre `data/roster_publico_TEMPLATE.csv` y completa `nombre_publico`, `apodo` y `dorsal` para los 16
   (recuerda que ya no hay restricción para los menores — la posición ya no se asigna aquí, se toma
   directo de lo que cada uno respondió en el Form).
4. Corre `npm run sync:tally` — regenera `data/players.json`, la fuente de verdad de la web (ver sección
   "La web" arriba). Ya no hace falta pegar nada a mano en ningún archivo.

El script de Pandas (`data/procesar_stats.py`) sigue funcionando igual si alguna vez lo necesitas aparte
(por ejemplo para analizar los datos fuera de la web), pero **la web ya no lo usa** — corre sobre
`data/respuestas_form.csv` (un CSV exportado a mano) en vez del snapshot JSON de Tally.

## Cómo publicarlo gratis (GitHub + Vercel)

No tengo un conector de GitHub disponible en esta cuenta de Claude, así que esta parte se hace manual — son 5 minutos:

**1. Sube la carpeta a GitHub**
```
cd furia-tamalera-fc
git init
git add .
git commit -m "Furia Tamalera FC: plan de acción y web inicial"
```
Crea un repo vacío en https://github.com/new (puede ser privado si prefieres que el roster/plan no sea público — el código de la web no tiene nada sensible, pero el historial de commits sí queda ahí). Luego:
```
git remote add origin https://github.com/TU_USUARIO/furia-tamalera-fc.git
git branch -M main
git push -u origin main
```

**2. Conecta con Vercel (despliegue automático)**
- Entra a https://vercel.com con tu cuenta de GitHub.
- "Add New Project" → selecciona el repo `furia-tamalera-fc`.
- Vercel detecta que es un proyecto Next.js — no necesitas configurar nada, dale "Deploy".
- Cada vez que hagas `git push`, Vercel vuelve a desplegar solo. Te da una URL tipo `furia-tamalera-fc.vercel.app` (puedes cambiar el subdominio en Settings → Domains).

El `legacy/index.html` (el prototipo anterior) no se despliega — ya no es la web activa, se archivó solo
como referencia.

**Atajo sin GitHub:** si solo quieres verlo en línea YA sin lidiar con git, entra a https://vercel.com/new, arrastra la carpeta `furia-tamalera-fc` completa a la zona de "Deploy" y en segundos tienes la URL — pero no vas a poder actualizarlo con un simple push después, tocaría volver a arrastrar la carpeta cada vez.

Si en algún momento quieres que yo mismo suba los cambios y despliegue por ti sin pasos manuales, puedo hacerlo si conectas GitHub y Vercel como conectores de Claude (en la configuración de conectores de claude.ai) — hoy no los tenía disponibles en esta sesión.
