@AGENTS.md

# Furia Tamalera FC — estado del proyecto

Sitio web del equipo (Next.js 16 + Tailwind v4), recreado a partir del handoff de diseño en
`design_handoff_furia_tamalera/`. Repo y deploy ya están en vivo y conectados entre sí.

- **Repo**: https://github.com/juanreyes3101/furia-tamalera-fc (público)
- **Sitio en vivo**: https://furia-tamalera-fc.vercel.app — Vercel redespliega solo con cada `git push` a `main` (integración GitHub↔Vercel ya conectada). No hace falta entrar a vercel.com para nada.
- **Form de Tally** (autoevaluación de stats): https://tally.so/r/ODNAKA — 16 preguntas, una autoevaluación por jugador.

## Cómo está armado

- `app/`, `components/`, `lib/`: la web. Componentes documentados en el propio código; no hay nada raro,
  es Next.js App Router estándar + Tailwind con muchos valores arbitrarios (`px-[22.4px]`, etc.) para
  calzar los tokens exactos del handoff de diseño.
- `data/players.json`: **fuente de verdad de la web — nunca se edita a mano.** Lo genera
  `scripts/sync-tally.ts`. Se commitea (Next.js lo necesita en build time).
- `data/roster_publico_TEMPLATE.csv`: **el archivo que sí se edita a mano**, y el único lugar donde se
  ajustan jugadores. Gitignored (tiene el nombre legal completo como clave interna). Columnas:
  - `nombre_publico` / `apellido`: se muestran como "Nombre Apellido" — por convención, **primer nombre +
    primer apellido** de cada quien (ej. "Nestor David Montenegro Rodriguez" → "Nestor" + "Montenegro").
    Excepción: si alguien va por su segundo nombre en la vida real (ej. Luis **Andrés** Melendez), se pone
    ese en `nombre_publico` en vez del primero.
  - `dorsal`, `edad`: casi todo el mundo sigue sin `edad` (queda en blanco = no se muestra "X años" en la
    ficha). `dorsal` ya está asignado para los 16 (ver tabla abajo).
  - `posicion_override`: fuerza la posición principal (POR/DEF/MED/DEL) sin importar lo que diga el form o
    la fórmula. Se usa cuando el jugador juega en la cancha en una posición distinta a la que más le
    conviene por stats (ver Johan, Andrés, Diego abajo).
  - `pac_override` / `sho_override` / `pas_override` / `dri_override` / `def_override` / `phy_override`:
    fuerzan un stat individual (1-99) en vez del valor calculado del form. Así se hacen los ajustes
    manuales de "súbele el tiro a X" sin tocar código — se edita el CSV y se corre `npm run sync:tally`.
- `data/tally_export.json`: snapshot de las submissions de Tally (gitignored). Yo lo actualizo cuando pido
  `fetch_submissions` por el conector MCP — no hay llamada en vivo a la API de Tally desde la web.
- `data/proximo_partido.csv`, `data/tabla_posiciones.csv`, `data/calendario.csv`: editables y **sí se
  commitean** (no tienen nada sensible). Alimentan el countdown, la tarjeta "Próximo partido" y la tabla de
  posiciones — ver sección del README "Actualizar el próximo partido / la tabla / el calendario" para el
  formato exacto.
- `scripts/sync-tally.ts`: transforma `tally_export.json` + `roster_publico_TEMPLATE.csv` →
  `data/players.json`. La posición principal de cada jugador se elige por **mejor OVR entre las posiciones
  que marcó** (no la primera que clickeó), salvo que `posicion_override` la fuerce. El OVR se pondera según
  la posición primaria (`OVR_WEIGHTS_BY_POSITION` en el mismo archivo — un defensa pesa 40% en DEF/20% en
  FÍS, un delantero 35% en TIR/20% en RIT, etc.). Corre con `npm run sync:tally`.
- `roster_interno_CONFIDENCIAL.csv`: cédulas/teléfonos/fechas de nacimiento reales. **Nunca se lee por
  ningún script ni se commitea.** La edad pública (cuando se llena) la escribe el mánager a mano en
  `roster_publico_TEMPLATE.csv`, no se deriva de este archivo.

## Roster actual (11 de 16 con datos reales)

| # | Jugador | Posición | Media | Notas |
|---|---|---|---|---|
| 1 | Nestor Montenegro | DEF | 86 | |
| 2 | Simón Buitrago | DEF | 85 | |
| 4 | Fabian Parra | DEF | 85 | |
| 10 | Diego Prieto | MED | 83 | Juega de volante — `posicion_override=MED` (el form/stats lo daban mejor en otra posición) |
| 14 | Angel Montien | DEF | 82 | |
| 16 | Jesús Garzón | MED | 82 | |
| 8 | David Triana | MED | 81 | |
| 7 | Emanuel Reyes ("Kiriku") | POR | 80 | |
| 9 | Andres Melendez | DEL | 80 | Va por su segundo nombre. Juega de 9 — `posicion_override=DEL` |
| 20 | Johan Diaz | DEL | 79 | Juega de 9 en la cancha aunque el form/stats lo dan mejor de POR/DEF — `posicion_override=DEL` |
| 11 | Juan Reyes | MED | 78 | Soy yo (Juan Diego Reyes García, el usuario que maneja este repo) |
| 3 | Juan Montenegro | — | — | Pendiente de responder el form |
| 5 | Juan Guarin | — | — | Pendiente de responder el form |
| 6 | Deiby Garcia | — | — | Pendiente de responder el form |
| 12 | Juan Escobar | — | — | Pendiente de responder el form |
| 17 | Nicolas Baron | — | — | Pendiente de responder el form |

Todas las medias de arriba tienen ajustes manuales pedidos por el mánager encima del cálculo automático del
form (vía las columnas `*_override`) — no son 100% el resultado crudo de la autoevaluación.

## Pendiente / próximos pasos

- **7 `note_raw` sin aprobar** (apodo sugerido en el form, texto crudo — no se publica como `note` en la
  ficha hasta que el mánager lo apruebe/edite): Nestor ("Veni,Vidi,Venci"), Fabian ("Enano"), Angel ("Monti,
  enano..."), David ("Dei v"), Emanuel ("Kiriku" — ya aprobado y puesto como apodo), Andres ("Andy, todos me
  llaman así"), Johan ("La 🐝 un pique y me muero").
- 5 jugadores sin responder el form todavía (tabla de arriba).
- Casi nadie tiene `edad` puesta en el roster — pendiente de que el mánager decida qué edad publicar por
  persona.
- El "Próximo partido" en `data/proximo_partido.csv` tiene fecha (domingo 6 sep, 6pm, Cancha La Chilena)
  pero el `rival` sigue vacío.

## Flujo de trabajo típico

1. **Nueva respuesta del form** → pedir "sincroniza Tally" (traigo submissions vía MCP, actualizo
   `tally_export.json`) → completar la fila en `roster_publico_TEMPLATE.csv` si es alguien nuevo → `npm run
   sync:tally` → revisar → commit + push.
2. **Ajuste manual de un stat/posición** → editar la columna `*_override` correspondiente en
   `roster_publico_TEMPLATE.csv` → `npm run sync:tally` → commit + push. (Todos los ajustes de esta semana
   se hicieron así — ver historial de commits para el detalle de cada uno.)
3. **Actualizar próximo partido / tabla / calendario** → editar el CSV correspondiente directamente (no
   necesita sync) → commit + push, o editar directo en github.com con el ícono de lápiz.
4. Verificación estándar antes de cada push: `npm run build` + `npx eslint .` limpios, y una pasada visual
   en `npm run dev` (o revisar el deploy de Vercel después del push).

## Decisiones de diseño ya tomadas (para no repreguntar)

- Nav de escritorio sin cambios; en celular es un botón hamburguesa (`components/Header.tsx`) — el nav
  original sin breakpoints se veía roto en pantallas angostas.
- Las flechas del carrusel de Matchday son un SVG reutilizado (una es la otra rotada 180°), no caracteres
  `←`/`→` — la fuente los renderizaba con grosor distinto.
- Las cartas de jugador (`PlayerCard.tsx`) necesitan `min-w-0` en la fila del nombre — es un gotcha de CSS
  Grid (los items tienen `min-width:auto` por defecto y no dejan que el `truncate` funcione).
- La pizarra táctica arranca con el "once titular" ya armado por defecto (mejor OVR disponible por
  posición) en vez de vacía — `computeAutoXI()` en `lib/formations.ts`, reutilizada por el botón AUTO XI.
- `legacy/index.html` es un prototipo viejo (diseño distinto), archivado y sin usar — no es el sitio activo.
