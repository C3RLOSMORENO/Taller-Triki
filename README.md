# Triki Studio Pro (Tic-Tac-Toe Next-Gen)

> **Taller / Proyecto Web**: Triki Interactivo Profesional  
> **Estudiante / Autor**: Carlos Moreno (`cemor`)  
> **Asignatura / Curso**: Desarrollo Web & Algoritmos  
> **Tecnologías**: HTML5 Semántico • Vanilla CSS3 • JavaScript ES6+ (Cero dependencias)

---

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/Vanilla_CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript_ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![WCAG AAA](https://img.shields.io/badge/Accessibility-WCAG_2.1_AAA-10b981?style=flat-square)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

Una implementación de nivel de producción del clásico juego **Triki / Tres en Raya (Tic-Tac-Toe)**, construida exclusivamente con tecnologías web estándar (**HTML5 semántico, Vanilla CSS3 y JavaScript ES6+ puro**) sin dependencias externas ni librerías pesadas.

Incluye un motor de **Inteligencia Artificial basado en el algoritmo Minimax con poda Alfa-Beta**, sintetizador de audio procedimental con espacialización estéreo (**Web Audio API**), motor de física de partículas nativo en **Canvas**, analíticas de rendimiento en tiempo real y cumplimiento estricto de accesibilidad **WCAG 2.1 AAA**.

---

## 👨‍🎓 Ficha de Presentación del Proyecto

| Campo | Detalle |
| :--- | :--- |
| **Estudiante / Autor** | **Carlos Moreno** |
| **Repositorio** | `Taller-Triki` |
| **Fecha de Entrega** | Septiembre 2026 |
| **Requisitos Cumplidos** | HTML5, CSS3, JS Vanilla, Accesibilidad WCAG AAA, Algoritmo Minimax, Audio Web API, Dashboard 2 Columnas |

---

## 📸 Vista Previa de la Arquitectura

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           TRIKI STUDIO PRO                              │
├────────────────────────────────────────┬────────────────────────────────┤
│            ÁREA DE JUEGO               │       PANEL DE ANÁLISIS        │
│                                        │                                │
│  [ Modo: 2P / Bot IA ] [ Dificultad ]  │  [ Balance de Rendimiento % ]  │
│  [ HUD: Jugador 1  vs  Jugador 2/Bot ] │  [ Barra Proporcional X/Tie/O] │
│                                        │                                │
│       ┌─────┬─────┬─────┐              │  [ Registro Táctico en Vivo ]  │
│       │ A1  │ A2  │ A3  │              │  • #1 X en B2 (Centro)         │
│       ├─────┼─────┼─────┤              │  • #2 O en A1 (Sup. Izq)       │
│       │ B1  │ B2  │ B3  │              │                                │
│       ├─────┼─────┼─────┤              │  [ Atajos de Teclado Rápido ]  │
│       │ C1  │ C2  │ C3  │              │  • [1-9] Numpad  • [R] Reset   │
│       └─────┴─────┴─────┘              │  • [Z] Deshacer  • [T] Temas   │
│                                        │                                │
│   [ Nueva Ronda ] [ Deshacer ] [ Puntos]                               │
└────────────────────────────────────────┴────────────────────────────────┘
```

---

## ⚡ Características Principales

### 🧠 1. Motor de Inteligencia Artificial (Minimax Engine)
- **Modo Casual (Fácil)**: Selección probabilística aleatoria de casillas disponibles.
- **Modo Táctico (Medio)**: Evaluación heurística en 2 pasos; detecta victorias inmediatas y bloquea al rival con un 75% de probabilidad.
- **Modo Imbatible (Minimax con Poda Alfa-Beta)**:
  - Búsqueda en árbol de juego exhaustiva con profundidad penalizada:
    $$\text{Score}(\text{Estado}) = \begin{cases} +10 - \text{depth} & \text{si gana la IA (Max)} \\ -10 + \text{depth} & \text{si gana el humano (Min)} \\ 0 & \text{si es empate} \end{cases}$$
  - Garantía matemática de juego perfecto: el bot es invencible (solo empates o victorias para la IA).

### 🔊 2. Sintetizador de Audio Hi-Fi (Web Audio API)
- Cero archivos `.mp3` o `.wav` externos (0 KB de peticiones de red para audio).
- Sonidos generados mediante osciladores senoidales, triangulares y de diente de sierra con curvas de ganancia exponencial.
- **Espacialización Estéreo (`StereoPannerNode`)**: Las jugadas en la columna izquierda se panoramizan a la izquierda (`Pan: -0.4`), las centrales en balance neutro (`Pan: 0.0`) y las de la derecha a la derecha (`Pan: +0.4`).

### 📊 3. Analíticas en Tiempo Real y Registro de Notación
- **Move Notation Feed**: Cronología táctica en vivo con coordenadas matriciales (`A1` a `C3`).
- **Balance de Rendimiento**: Barra dinámica de distribución porcentual entre victorias de X, empates y victorias de O.
- **Sistema de Deshacer Jugada (Undo)**: Permite retroceder movimientos con <kbd>Z</kbd> o mediante la UI.
- **Personalización de Nombres**: Edición rápida de nombres de jugadores con persistencia en `localStorage`.

### 🎨 4. Sistema de Diseño Calibrado (Tokens de Color Profesionales)
Basado en escalas de neutrales de alta fidelidad (**Tailwind Zinc / Slate** y **Radix Colors**):
1. **Midnight Indigo** (*Zinc 950*): `#09090b` de fondo, acentos Indigo `#818cf8` y Rose `#fb7185`. Contraste de texto **17.5:1**.
2. **Slate Emerald** (*Slate 950*): `#0b0f19` de fondo, acentos Emerald `#34d399` y Amber `#fbbf24`.
3. **Nordic Minimal** (*Slate 50*): Modo claro suizo de alto rendimiento con texto Slate 900 (`#0f172a`, Contraste **14.8:1**) y fichas en Azul Cobalto (`#1d4ed8`) y Carmín (`#be123c`).

---

## ♿ Cumplimiento de Accesibilidad (WCAG 2.1 AAA)

| Criterio WCAG | Implementación |
| :--- | :--- |
| **2.1.1 Teclado** | Navegación bidireccional por grilla (Flechas `↑ ↓ ← →`, `Enter`, `Espacio`) y atajos numéricos directos (`1-9`). |
| **2.4.7 Foco Visible** | Indicadores de foco `:focus-visible` de alto contraste (`outline: 2px solid var(--focus-ring)`). |
| **1.4.3 / 1.4.6 Contraste** | Todos los pares de texto/fondo superan el ratio estricto de **7:1** (Nivel AAA). |
| **4.1.3 Mensajes de Estado** | Atributos `role="status"` y `aria-live="polite"` en anuncios de turno, victorias y errores. |
| **2.3.3 Movimiento Reducido** | Consulta `@media (prefers-reduced-motion: reduce)` para apagar animaciones y confeti automáticamente. |
| **2.5.5 Tamaño del Objetivo** | Botones interactivos con área táctil mínima de **$42 \times 42\text{ px}$** / **$44\text{ px}$**. |

---

## ⌨️ Atajos de Teclado

| Tecla | Acción |
| :---: | :--- |
| <kbd>1</kbd> - <kbd>9</kbd> | Colocación instantánea en casilla según el mapa numérico físico |
| <kbd>R</kbd> | Iniciar una **Nueva Ronda** |
| <kbd>Z</kbd> / <kbd>Ctrl+Z</kbd> | **Deshacer** la última jugada |
| <kbd>M</kbd> | **Silenciar / Activar** efectos de audio |
| <kbd>T</kbd> | **Ciclar tema visual** |
| <kbd>H</kbd> | Abrir modal de **Historial** de partidas |
| <kbd>Esc</kbd> | Cerrar cualquier menú o modal abierto |

---

## 📁 Estructura del Código Fuente

```text
Triki/
├── index.html       # Estructura semántica HTML5, metadatos SEO y atributos ARIA
├── styles.css       # Sistema de diseño CSS, variables de paletas, grid y animaciones
├── app.js           # Motor de juego, Algoritmo Minimax, Web Audio API y UI Controller
└── README.md        # Documentación técnica y académica del proyecto
```

---

## 🚀 Puesta en Marcha Local

No requiere instalación de paquetes (`npm install`), bundlers ni servidores complejos.

### Opción 1: Apertura Directa
Haz doble clic sobre el archivo [`index.html`](index.html) para abrirlo en cualquier navegador moderno.

### Opción 2: Servidor Local Ligero (Recomendado)

**Con Python 3:**
```bash
python -m http.server 8080
```

**Con Node.js (`npx`):**
```bash
npx serve .
```

Abre en tu navegador:
```text
http://localhost:8080
```

---

## 🧪 Compatibilidad de Navegadores

- **Google Chrome** $\ge 70$
- **Mozilla Firefox** $\ge 68$
- **Apple Safari** $\ge 13$
- **Microsoft Edge** $\ge 79$
- **Navegadores móviles** iOS Safari & Chrome para Android

---

## 👤 Autor

- **Nombre**: Carlos Moreno
- **Proyecto**: Taller Triki Web
- **Repositorio**: [C3RLOSMORENO/Taller-Triki](https://github.com/C3RLOSMORENO/Taller-Triki)
- **Licencia**: MIT
