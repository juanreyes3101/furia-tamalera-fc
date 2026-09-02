# Handoff: Furia Tamalera FC — sitio del equipo

## Overview
Sitio público de un equipo amateur de fútbol 8 (Bogotá, Torneo Fansport, 16 jugadores).
Objetivo de negocio: conseguir patrocinio. El sitio debe verse profesional y divertido a la vez,
y sirve como media kit vivo: plantilla con cartas tipo EA FC, pizarra táctica interactiva,
galería de matchday, tabla de posiciones, novedades y planes de patrocinio.

## About the Design Files
Los archivos de este paquete son **referencias de diseño hechas en HTML** — prototipos que
muestran la apariencia y el comportamiento buscados, **no código de producción para copiar tal cual**.

La tarea es **recrear estos diseños en el entorno del proyecto destino** (Next.js/React, Astro,
Vue, lo que exista) usando sus patrones y librerías. Si no hay proyecto todavía, la recomendación
para desplegar rápido es **Next.js (App Router) + Tailwind CSS, desplegado en Vercel**:
el sitio es mayormente estático con tres islas interactivas (plantilla, pizarra, carrusel).

`Furia Tamalera FC.dc.html` es un componente de diseño con runtime propio (`support.js`):
el marcado vive en `<x-dc>` y la lógica en la clase `Component` al final del archivo.
Se lee como si fuera un componente React: la clase es el estado + los handlers, y el
template es el JSX. No intentes portar `support.js`.

## Fidelity
**Alta fidelidad.** Colores, tipografía, espaciado, animaciones y microinteracciones son
definitivos. Recrear pixel-perfect usando las librerías del codebase.

## Datos — IMPORTANTE
El contenido actual es **provisional**: solo un jugador real (Juan Reyes, #11, MED,
PAC 63 / SHO 70 / PAS 85 / DRI 69 / DEF 75 / PHY 75). Los otros 15 son placeholders
("Por definir") con stats plausibles.

Modelo de datos que espera la UI (un array de 16):

```ts
type Player = {
  name: string;
  num: number;            // dorsal
  pos: 'POR' | 'DEF' | 'MED' | 'DEL';
  pac: number; sho: number; pas: number; dri: number; def: number; phy: number; // 1-99
  note: string;           // frase corta que sale al reverso de la carta
  photo?: string;         // retrato, fondo oscuro preferible
};
```

Media (overall):
- Jugadores de campo: `round((pac+sho+pas+dri+def+phy)/6)`
- Porteros: `round((def*2 + phy*2 + pas + pac)/7)`

Tiers de carta por media: **Oro ≥ 76**, **Plata 68–75**, **Bronce < 68**.

Recomendación: mover los 16 jugadores a un `players.json` (o una tabla en la base de datos /
un CMS ligero como Sanity o Supabase) para que el equipo edite stats sin tocar código.

## Screens / Views
Es una sola página con anclas. Ancho máximo del contenido: **1240px**, padding lateral **22.4px**.

### 1. Header (sticky)
- `position:sticky; top:0; z-index:50`, fondo `rgba(22,24,38,.78)` con `backdrop-filter:blur(14px)`,
  borde inferior `1px solid rgba(233,233,237,.10)`.
- Izquierda: escudo 34×34 (`object-fit:contain`, `drop-shadow(0 2px 5px rgba(0,0,0,.6))`) +
  "FURIA TAMALERA FC" (12px, 700, `letter-spacing:.14em`, uppercase; "FC" en dorado #e3b23c).
- Centro-derecha: enlaces Plantilla / Táctica / Tabla / Matchday / Novedades
  (12.5px, 500, color #b2b6ca; hover: fondo `rgba(47,162,106,.14)`, color #e9e9ed).
- Derecha: botón "Patrocina" — outline `1px solid #2fa26a`, texto #7ee0a8, radio 8px.

### 2. Hero
- Grid `repeat(auto-fit, minmax(320px,1fr))`, gap 44.8px, padding `78px 22.4px 56px`.
- Píldora: "Est. 2026 · Bogotá · Fútbol 8", borde `rgba(227,178,60,.35)`, fondo `rgba(227,178,60,.08)`,
  texto #e3b23c 11px `letter-spacing:.16em`, con un punto rojo #e04b2a que pulsa (1.8s).
- Título: "FURIA" en #e9e9ed y "TAMALERA" con gradiente de texto
  `linear-gradient(96deg,#e3b23c,#e04b2a 46%,#2fa26a)` (`background-clip:text`).
  `font-size: clamp(46px,7.2vw,92px)`, `line-height:.92`, weight 800, `letter-spacing:-.035em`.
- Párrafo 17px #b2b6ca, máx 52ch.
- Dos botones outline (verde y neutro) + fila de 4 métricas
  (16 jugadores / ~60 equipos / 6 formaciones / 1 objetivo), tarjetas `rgba(35,37,50,.7)`
  con `box-shadow:0 0 0 1px #3f424d`.
- Derecha: escudo PNG con transparencia, flotando (`float` 7s), con
  `drop-shadow(0 22px 34px rgba(0,0,0,.75)) drop-shadow(0 0 26px rgba(227,178,60,.22))`,
  halo radial dorado-rojo detrás que late, y dos círculos punteados girando (60s y 40s).

### 3. Marquee
Banda de 9px con texto en bucle (28s): Torneo Fansport ◆ Bogotá ◆ Fútbol 8 ◆ …
Duplicar el contenido y animar `translateX(0 → -50%)`.

### 4. Manifiesto (#manifiesto)
Grid 2 columnas responsivo. Izquierda: kicker verde + h2. Derecha: párrafo + 3 tarjetas
(Diversión primero / Probar nivel / Cantera propia) con `border-top:2px solid` en verde, dorado y rojo.

### 5. Plantilla (#plantilla) — la pieza clave
Dos vistas conmutables:
- **Lista (por defecto)**: agrupada por Porteros / Defensas / Mediocampo / Delanteros.
  Cada grupo: kicker con color propio + contador + regla que se desvanece.
  Filas en grid `repeat(auto-fill,minmax(260px,1fr))`, gap 5.6px. Cada fila:
  dorsal en círculo 30px, nombre 13.5px/600, sublínea con las 2 mejores stats ("PAS 85 · DEF 75"),
  media a la derecha 18px/800 con el color del tier. Hover: borde del color del tier + `translateX(4px)`.
  Click → abre el modal con la carta.
- **Cartas**: grid `repeat(auto-fill,minmax(210px,1fr))`, gap 16.8px. Carta EA FC:
  `aspect-ratio:.72`, radio 14px, fondo `linear-gradient(168deg, tintA, #1b1d2b 58%, tintB)`.
  Arriba izq: media 38px/800 + posición; arriba der: "#11" + cuadradito con gradiente.
  Centro: hueco de foto (rayas diagonales + borde punteado + leyenda mono "foto jugador").
  Abajo: nombre uppercase + regla degradada + 6 stats en dos columnas separadas por 1px.
  Hover: `translateY(-8px) scale(1.02)` + destello que barre (1.1s). Click: voltea la carta y
  muestra las 6 barras animadas (`grow` .7s) + la nota.
- Filtros TODOS / POR / DEF / MED / DEL (activo: fondo `rgba(47,162,106,.16)`, texto #7ee0a8, borde #2fa26a).
- Modal: overlay `rgba(10,11,18,.78)` + `blur(6px)`, carta de 300px centrada, cierra al hacer click fuera.

Colores de tier: Oro `#e3b23c` (tintA `rgba(227,178,60,.30)`, tintB `rgba(224,75,42,.18)`, borde `rgba(227,178,60,.45)`);
Plata `#cfd3e5` (`rgba(207,211,229,.16)` / `rgba(47,162,106,.14)` / `#595d6c`);
Bronce `#7ee0a8` (`rgba(47,162,106,.20)` / `rgba(22,24,38,.4)` / `rgba(47,162,106,.32)`).

### 6. Banda de estadísticas (#stats)
Fondo `linear-gradient(120deg,#12321f,#161826 55%,#2a1a14)`, bordes arriba y abajo.
Grid `repeat(auto-fit,minmax(170px,1fr))`: media del equipo, mejor media, convocables, esquemas,
partidos oficiales. Números `clamp(34px,4vw,52px)` weight 800.

### 7. Cuenta regresiva
Fondo `linear-gradient(120deg,#12321f,#161826 58%,#2a1a14)`. Cuatro cajas (días/horas/min/seg),
números 34px/800 con `font-variant-numeric:tabular-nums`, actualizadas cada segundo.
Objetivo actual: **próximo sábado 15:00** calculado en runtime — reemplazar por la fecha real del partido.
Debajo, una franja de 34px con la línea verde degradada y el balón rodando de lado a lado
(`rollAcross` 9s: `left:-40px → calc(100% + 40px)` + `rotate(1080deg)`).

### 8. Pizarra táctica (#tactica)
Grid `repeat(auto-fit,minmax(290px,1fr))`.
- **Cancha**: `aspect-ratio:.82`, fondo `linear-gradient(180deg,#123a24,#0e2b1b)`, franjas de césped
  (`repeating-linear-gradient` cada 40px), líneas blancas al 16%: perímetro, media cancha,
  círculo central 88px, dos áreas de 180×62.
- **Formaciones** (fútbol 8, GK + 7): `3-3-1`, `3-1-3`, `2-3-2`, `3-2-2`, `2-4-1`, `1-3-2-1`.
  Cada una es una lista de `[posición, x%, y%]` — ver `FORMATIONS` en el archivo.
- **Fichas**: círculo 48px; vacío muestra la inicial de la posición, ocupado muestra el dorsal
  sobre `linear-gradient(150deg,#2fa26a,#12321f)`. Cuando hay un jugador "elegido", todas las
  fichas se iluminan con `box-shadow:0 0 0 4px rgba(227,178,60,.18)`.
- **Interacción (doble vía, obligatoria)**:
  - Escritorio: arrastrar (`draggable`) desde la lista a la ficha (`onDragOver` + `onDrop`,
    payload = índice del jugador en `text/plain`).
  - Móvil: tocar al jugador (queda "ELEGIDO") y luego la posición. O tocar la posición primero.
  - Tocar una ficha ocupada saca al jugador. Un jugador solo puede estar en una posición.
- **Panel derecho**: los 16 siempre visibles; los ya alineados van al 55% de opacidad con la
  etiqueta "EN CANCHA". Botones AUTO XI (mejor media por posición, con fallback de posiciones
  compatibles) y LIMPIAR. Debajo, la alineación en texto monoespaciado, lista para copiar y publicar.

### 9. Tabla y calendario (#tabla)
- Tabla de 6 equipos (grupo por definir), columnas `34px | 1fr | 6×38px` (PJ G E P DG PTS),
  `min-width:430px` con `overflow-x:auto` en móvil. Fila propia resaltada en dorado.
- Tarjeta "Próximo partido": escudo vs "?" + tipo/cuándo/dónde.
- Tarjeta "Calendario": 3 filas con día/mes, título, meta y etiqueta (Amistoso / Oficial).

### 10. Matchday (#matchday) — carrusel
- Riel horizontal (`overflow-x:auto`, `scrollbar-width:none`) con 6 tarjetas de tamaños distintos,
  duplicadas (12 en total) para el bucle infinito:
  `200×340 / 360×230 / 250×280 / 190×320 / 230×230 / 380×260`, con `margin-top` escalonado
  (0, 46, -14, 24, -8, 38) e inclinación (`-1.6°, 1.2°, -0.8°, 2°, -1.4°, 0.9°`).
- Tarjetas translúcidas: `rgba(27,29,43,.45)` + `inset 0 0 0 1px rgba(233,233,237,.07)`
  (sin sombra externa: deben fundirse con el fondo). Hover: se enderezan, `translateY(-8px) scale(1.03)`.
- Cada tarjeta lleva el tipo de contenido en mono ("video 9:16", "foto horizontal") y un número
  grande al 10% de opacidad.
- **Autoscroll**: bucle `requestAnimationFrame` a **34 px/s**, basado en tiempo (`dt`), no en frames.
  El punto de repetición se calcula del DOM: `children[n].offsetLeft - children[0].offsetLeft`
  (NO `scrollWidth/2` — se desfasa por el gap final). Se pausa con hover/touch.
  Las flechas fijan un `_target` y el bucle interpola hacia él (`dt/190`).
- Nota: los "slots" son huecos para que el equipo suelte fotos/videos. En producción esto debería
  leer de un CMS o de una carpeta de medios; ideal: embeber los TikToks reales.

### 11. Novedades (#novedades)
3 tarjetas `rgba(35,37,50,.7)` con etiqueta en píldora outline, fecha, título 19px y cuerpo 13.5px.

### 12. Patrocinio (#patrocinio)
Fondo `linear-gradient(140deg,#13251c,#161826 50%,#2a1c12)`. Izquierda: pitch + CTA a TikTok.
Derecha: 3 planes (Tamal de Oro / Plata / Bronce) con `border-left:3px solid` del color del tier
y lista de beneficios con viñeta ◆. Hover: `translateX(6px)`.

### 13. Footer
Escudo 52px + nombre + "Est. 2026 · Bogotá, Colombia · Torneo Fansport" + botón a TikTok.

## Interactions & Behavior
- Scroll suave (`scroll-behavior:smooth`) con anclas.
- Reveal al entrar en viewport vía **scroll-driven animations** en CSS:
  `animation: reveal .8s cubic-bezier(.2,.7,.3,1) both; animation-timeline: view(); animation-range: entry 0% cover 26%;`
  Si el target necesita soporte amplio, reemplazar por IntersectionObserver (o Framer Motion `whileInView`).
- Fondo animado en `position:fixed`: capa de gradientes radiales estática + una mancha verde
  con `blur(70px)` que deriva (30s), 9 brasas que suben (`ember`), y hasta 8 balones girando
  (`ballDrift`, 34–100s, opacidad 0.10).
- Todo lo decorativo debe respetar `prefers-reduced-motion` (falta en el prototipo — **añadirlo**).

## State Management
| Estado | Tipo | Para qué |
|---|---|---|
| `filter` | 'TODOS'\|'POR'\|'DEF'\|'MED'\|'DEL' | filtro de plantilla |
| `view` | 'lista'\|'cartas' | vista de plantilla |
| `modalId` | number\|null | carta abierta |
| `flipped` | Record<number,boolean> | cartas volteadas |
| `formation` | string | esquema activo |
| `assign` | Record<slotIndex, playerIndex> | alineación |
| `activeSlot` | number\|null | posición esperando jugador |
| `selected` | number\|null | jugador esperando posición |
| `dragging` | number\|null | jugador en arrastre |
| `now` | number | tick de la cuenta regresiva (1s) |

Refs imperativas (fuera de React state): `_pos`, `_target`, `_paused`, `_last` del carrusel.
**Importante**: el tick de 1 segundo re-renderiza; por eso el carrusel se maneja con `scrollLeft`
directo y no con `scrollBy({behavior:'smooth'})` (el re-render cancelaba la animación).
En React, aislar la cuenta regresiva en su propio componente para no re-renderizar el resto.

## Design Tokens
Base: design system **Nocturne** (`_ds/nocturne-…/styles.css`), con el acento cambiado por los colores del club.

**Colores**
| Rol | Valor |
|---|---|
| Fondo | `#161826` |
| Superficie | `#232532` / `rgba(35,37,50,.7)` |
| Texto | `#e9e9ed` |
| Texto secundario | `#b2b6ca` → `#9397ab` → `#75798c` |
| Borde sutil | `#3f424d`, `rgba(233,233,237,.10)` |
| Verde club | `#2fa26a` (claro `#7ee0a8`, oscuro `#12321f`) |
| Dorado club | `#e3b23c` |
| Rojo/fuego club | `#e04b2a` |
| Plata (tier) | `#cfd3e5` |

**Tipografía**: Inter (400/500/600/700/800).
h1 `clamp(46px,7.2vw,92px)`/800/-.035em · h2 `clamp(30px,3.6vw,44px)`/600/-.03em ·
h3 25px · h4 19–20px · cuerpo 15px/1.55 · meta 12.5px · kicker 11px/700/uppercase/.2em.

**Espaciado** (escala 0.7× de Nocturne): 2.8 / 5.6 / 8.4 / 11.2 / 16.8 / 22.4 / 33.6 / 44.8 / 78 px.

**Radios**: 4 / 8 / 14 px · píldoras 999px.

**Sombras**: `0 0 0 1px #3f424d` · `0 0 0 1px #595d6c, 0 6px 18px rgba(0,0,0,.55)` ·
`0 0 0 1px #9397ab, 0 16px 40px rgba(0,0,0,.65)`.

**Reglas**: las líneas horizontales se desvanecen en los extremos
(`linear-gradient(to right, transparent, rgba(233,233,237,.22), transparent)`) — firma de Nocturne.

## Assets
- `assets/escudo.png` (477×651, PNG con alfa) — escudo recortado del arte original que subió el
  cliente; el fondo verde se eliminó por flood-fill. Se usa en header, hero, próximo partido y footer.
- `assets/balon-v3.png` (256×256, PNG con alfa) — balón de fútbol generado en canvas
  (pentágono central + 5 en el borde). Se usa en el fondo y en la franja de la cuenta regresiva.
- **Faltan**: fotos de los 16 jugadores (retrato, preferiblemente sobre fondo oscuro),
  fotos y videos de matchday, y el escudo en vectorial (SVG) si existe — pedirlo al cliente.
- Fuente: Inter vía Google Fonts.

## Redes y contacto
- TikTok: **@furia_tamalera_fc** → `https://www.tiktok.com/@furia_tamalera_fc`
- No hay Instagram, correo ni WhatsApp todavía. Para patrocinio conviene añadir al menos un correo.

## Sugerencias para producción
1. **Datos fuera del código**: `players.json`, `fixtures.json`, `standings.json`, `news.json`.
   Mejor aún, un panel mínimo protegido para que el equipo edite stats, resultados y novedades.
2. **Tabla de posiciones**: hoy es estática. Si Fansport publica resultados, calcularla desde
   los partidos (PJ/G/E/P/DG/PTS) en vez de escribirla a mano.
3. **Compartir alineación**: la pizarra debería exportar la alineación como imagen
   (html-to-image / satori) para publicarla en TikTok e Instagram — es el gancho social del sitio.
4. **SEO / Open Graph**: título, descripción y una imagen OG con el escudo. Importa para patrocinio.
5. **Rendimiento**: el fondo animado es lo más caro. Reducir balones y brasas en móvil,
   y respetar `prefers-reduced-motion`.
6. **Accesibilidad**: revisar contraste de `#75798c` sobre `#161826` en textos pequeños,
   y añadir foco visible a las fichas de la cancha (ya hay `:focus-visible` global en verde).
7. **Deploy**: Vercel o Netlify, dominio propio (p. ej. furiatamalera.com). Todo es estático.

## Files
- `Furia Tamalera FC.dc.html` — el diseño completo (template + lógica).
- `assets/escudo.png`, `assets/balon-v3.png` — imágenes usadas.
- `nocturne/styles.css`, `nocturne/readme.md` — el design system base (tokens y guía).

## Cómo usar esto con Claude Code
1. Descarga el zip y descomprímelo dentro (o al lado) del repositorio.
2. Abre Claude Code en el repo y dile algo como:
   > Lee `design_handoff_furia_tamalera/README.md` y el HTML de referencia.
   > Recrea el sitio en Next.js + Tailwind siguiendo los tokens del README.
   > Los datos de jugadores van en `data/players.json`. Empieza por el hero y la plantilla.
3. Pega en el chat los datos reales de los 16 jugadores (los tienes en tu otra conversación):
   nombre, dorsal, posición y las 6 stats. Ese es el único dato que falta para que quede completo.
4. Trabaja sección por sección; el README describe cada una por separado.
