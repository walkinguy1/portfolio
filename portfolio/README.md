# Portfolio — Tushar Khatiwada

Personal portfolio site. React + Vite, no UI framework beyond Bootstrap's grid,
with a WebGL project carousel and a working terminal you can actually type into.

**Live:** [tusharkhatiwada.com.np](https://www.tusharkhatiwada.com.np)
**Source of truth for content:** [`src/data/portfolioData.js`](src/data/portfolioData.js)

---

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
```

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run lint` | ESLint over the whole project |

Requires Node 20+ (Vite 7).

---

## How it's put together

```
src/
  data/portfolioData.js   IDENTITY, PROJECTS, SKILL_TIERS — one source of truth,
                          read by both the visual site and the terminal
  styles/
    global.css            theme tokens (see below) + resets + content width
    shared.css            global class names: .section-tag, .btn-*, .social-icon
    animations.css        keyframes + the reduced-motion block
  components/             one .jsx + one .module.css each
  games/                  Snake and Minesweeper, reachable from the terminal
  hooks/                  useInView, useMediaQuery, useTypedSequence
```

Styling is CSS Modules per component. Anything with a plain (unhashed) class
name lives in `styles/shared.css` — that file is the sole owner of those names,
so there's no `!important` tug-of-war with `App.css`.

### Theming

Light and dark are driven by a `data-theme` attribute on `<html>`, set by
`Themecontext.jsx`. **Every colour comes from the tokens in
`src/styles/global.css`** — `--accent`, `--accent-deep`, `--accent-a08…a60`,
`--grad-heading`, `--grad-cta`, `--grad-rule`, `--on-accent`, and so on.

Component CSS must reference those tokens rather than writing hex values.
Recolouring the whole site should be an edit to one file. Two spots
unavoidably duplicate values and are commented as such: the particle canvas
(`ParticleCanvas.jsx`, since canvas can't read CSS vars cheaply per frame) and
the `theme-color` meta tags in `index.html`.

`--on-accent` exists because bright emerald is a *light* colour — white text on
it fails WCAG. Use it for any text sitting on an accent fill.

---

## Things that aren't obvious

- **The terminal is real.** `TerminalPortfolio.jsx` reads the same
  `portfolioData.js` the visual site does, so the two can't drift apart.
- **There's a command palette** and a couple of hidden easter eggs; the games
  hang off those.
- **`InfiniteMenu.jsx`** is adapted third-party WebGL — attribution is in the
  header comment of `InfiniteMenu.css`.
- **Project entries carry `status` and `builtFor`** (`shipped` /
  `working-prototype` / `in-progress` / `paused`, and `coursework` / `personal`
  / `hackathon`) so the cards can be honest about what a thing actually is.

---

## Projects listed

| Project | Status | Built for | Demo |
|---|---|---|---|
| ZappStore — e-commerce, React + Django REST | shipped | coursework | [live](https://zappstore-jade.vercel.app) |
| MedAlert Nepal — medicine availability finder | working prototype | coursework | — |
| Gesture Platform | working prototype | personal | — |
| Khoja — lost and found system | working prototype | hackathon | — |
| Vellum — PDF analyzer for learning | in progress | personal | — |

Every entry must be verifiable by a visitor in under a minute: the GitHub link
resolves, `tech` reflects what's actually in the repo, and the description says
what the project does *today*.

---

## Known gaps

Tracked in [`PORTFOLIO_ACTION_PLAN.md`](PORTFOLIO_ACTION_PLAN.md):

- Only ZappStore has a live demo; the other four need deploying.
- No CI workflow and no tests yet. `npm run lint` currently reports 2 errors in
  `TerminalEgg.jsx` (`react-hooks/set-state-in-effect`).
- Bootstrap is still a dependency for the grid alone, and fonts are `.ttf`
  rather than `.woff2` — both worth cutting for load time.

---

## Credits

Built by [Tushar Khatiwada](https://github.com/walkinguy1) — 3rd year Computer
Engineering, Himalaya College of Engineering, Lalitpur.
