# Bundle boundaries — what each visitor downloads, and when

> **Authoritative** for: what goes in the entry bundle, where lazy
> boundaries sit, how a lesson / the Math Lab / the notebook are loaded, which
> i18n namespaces are on demand, and the rules that keep the entry small.
> Established 2026-09-25 (performance & architecture pass). Code is the source
> of truth; this file describes it.

## 1. The principle

Rich lessons are allowed to be rich. **Their cost is paid when a learner opens
them, not before.** A visitor on `/` must not download the admin panel, the
Math Lab's fourteen instruments, KaTeX, or any lesson's modules.

The reference stress test was a self-contained fractions lesson
(`lab_fractions_1am.html`: five visual representations, a slider lab, a
10-question quiz, print layout) — **20 KB raw, ~5 KB gzip, ~200 DOM nodes, no
dependency**. Before this pass the entry chunk alone was ~130× that. Rich
content was never the cost; *coupling* was.

## 2. The loading ladder

```text
index.html
  └─ entry chunk (index-*.js)           shell: React, router, i18n (eager namespaces),
     │                                  auth/context providers, layouts, landing page,
     │                                  login/register, lesson METADATA (registry)
     ├─ page chunks (lazy routes)       every student / teacher / admin / legal page
     │    StudentHome, MesCours, Explorer, Progression, Notebook, Profil, ChooseGrade,
     │    Courses, UnitPage, practice, diagnostic, Math Lab pages, TeacherLayout, …
     ├─ lesson runtime (lessonRuntime-*) shared by ALL lessons: classroom shell,
     │    access gate, knowledge provider, notebook anchor   (~13 KB gzip)
     │    └─ lesson page chunk          index.jsx or Module<NN>*.jsx of THAT lesson
     │         └─ manipulation / engine its own imports (KaTeX via MathText, …)
     ├─ MathLabOverlay chunk            the tool picker laid over a lesson
     │    └─ tool chunk                 one per instrument (three.js, mafs+MathLive,
     │                                  Excalidraw, Nerdamer stay in their tool's chunk)
     ├─ NotebookWindow chunk            the كرّاسي window (editor, KaTeX)
     └─ mathlab.json namespace          Math Lab UI strings (~250 KB JSON)
```

Nothing below a line is fetched until the level above needs it.

## 3. The boundaries and why each exists

| Boundary | Where | What it keeps out of the entry | Prefetch |
|---|---|---|---|
| Lazy route pages | `App.jsx` (`lazy(() => import(...))`), `CourseLayout.jsx` (`TeacherLayout`) | every page except the landing `Home`, `Login`, `Register` | — |
| Layout `<Suspense>` | `StudentLayout`, `MainLayout` around `<Outlet/>` | — (UX: the sidebar/navbar stay on screen while a page chunk arrives) | — |
| Lesson registry glob | `lessons/registry.js` globs **only active grades** (`'./*/4am/**'`, `'./*/terminale_dz/**'`) | configs of any inactive grade | — |
| Lesson runtime | `lessons/common/lessonRuntime.jsx`, loaded by `_unit/lessonRoutes.jsx` through `lessonRuntimeLoader.js` | classroom mode, access gate, knowledge map, notebook anchor | idle prefetch from `UnitPage`, `StudentHome`, `MesCours` (`usePrefetchLessonRuntime`) |
| Math Lab overlay | `MathLabOverlayProvider.jsx` lazy-loads `MathLabOverlay.jsx` | tool registry → every instrument's state & math engine (~700 KB source) | `MathLabEntryButton` on pointer-enter / focus (`preloadMathLabOverlay`) |
| Notebook window | `NotebookProvider.jsx` lazy-loads `NotebookWindow.jsx` | editor, KaTeX (~580 KB source), framer-motion use of the window | idle prefetch the first time a page publishes its position (`setLocation`) |
| `mathlab` i18n namespace | `i18n/index.js` `onDemandBackend` | ~250 KB of JSON | loaded by the first `useTranslation('mathlab')` |
| French reference catalogue | removed 2026-09-25 (was tree-shaken via `@__PURE__` before removal) | — | — |
| KaTeX dedupe | `vite.config.js` `resolve.dedupe: ['katex']` | a **second** KaTeX copy (react-katex/mafs nested 0.16) | — |

## 4. Rules (for every future change)

1. **A provider mounted above the router imports nothing heavy statically.**
   `App.jsx` providers (`NotebookProvider`, `MathLabOverlayProvider`, …) are in
   the entry by definition. Anything they render only on a user gesture is a
   `lazy()` component behind a `<Suspense>`, with a prefetch on intent.
2. **A route page is `lazy()`** unless it is the landing page or the auth
   pages. Its layout provides the `<Suspense>` boundary.
3. **`import.meta.glob` never sweeps `./**`** over lesson content. Globs are
   literals: scope them to what is active, and guard the literal with a test
   (`registry.test.js` « build-time glob scope »).
4. **A lesson's shared wrapper code lives in the lesson runtime**, not in the
   route factory. Route factories are imported by `App.jsx`.
5. **An on-demand i18n namespace is read only under a `<Suspense>` boundary**
   and never by a shared component. `admin` stays eager because its UI
   primitives (`Modal`, `DataTable`, `FilterBar`, `states`) are rendered by
   teacher pages and « قسمي »: a dialog that suspended on open would blank the
   page. A string needed on a lesson page lives in `lesson`, not `mathlab`
   (`mathLabEntry.*`).
6. **Heavy engines stay behind their feature**: three.js, Excalidraw, mafs +
   MathLive, Nerdamer (via its facade) are only imported from their Math Lab
   tool or lesson module.
7. **Data built by function calls at module top level is kept even when
   unused** (Rollup cannot prove the calls pure). Annotate with
   `/* @__PURE__ */` or move it out of product modules.
8. **Measure, don't guess**: before/after with the method in §6.

## 5. Measured result (2026-09-25)

Production build, `vite build`, sizes of the files the browser needs before
first render (entry + its static imports).

| Metric | Before | After | Change |
|---|---:|---:|---:|
| Initial JS raw | 2,611 KB | 768 KB | −71% |
| Initial JS gzip | 674 KB | 224 KB | −67% |
| Initial JS brotli | 535 KB | 187 KB | −65% |
| Initial CSS raw | 194 KB | 117 KB | −40% (French-only Tailwind classes gone with the lessons) |
| Initial CSS gzip | 30.5 KB | 18.4 KB | −40% |
| Rendered source in entry | 4,538 KB | ~1,196 KB | −74% |
| KaTeX copies shipped | 2 | 1 | — |
| JS chunks (total) | 507 | 564 | +57 |

What was in the entry before, and why:

| Source | Size in entry | Chain |
|---|---:|---|
| 132 French `lesson.config.js` | 1,130 KB | `App → Courses → registry.js` glob `./**` (filtered at runtime) |
| Math Lab (14 tools' state + engines) | 704 KB | `App → MathLabOverlayProvider → MathLabOverlay → toolRegistry` |
| KaTeX | 586 KB | `App → Notebook page / NotebookProvider → NotebookWindow → noteContent` |
| i18n `mathlab.json` | ~250 KB | `i18n/index.js` static import |
| French reference catalogue + JSON | ~255 KB | `packages/core` barrel → `coursesData.js` |
| Practice / progression / student pages | ~300 KB | static page imports in `App.jsx` |
| Lesson runtime (classroom, knowledge) | ~80 KB | `App → lesson routes.jsx → _unit/lessonRoutes.jsx` |
| Teacher layout | small | `App → CourseLayout → TeacherLayout` |

Browser measurements (Playwright, cold cache, mid-range phone profile:
4× CPU throttle, 1.6 Mbps / 150 ms RTT, 412×915): see §5.1.

### 5.1 Per-route (median of 3 cold runs, 2026-09-25)

Playwright, cold cache, mid-range phone profile (4× CPU throttle,
1.6 Mbps / 150 ms RTT, 412×915, gzip transfer). *Ready* = the route's main
content is visible. JS/CSS = compressed bytes transferred until network idle.
84 loads, 0 render failures, 0 console errors; RTL + Arabic on every route.

| Route | Ready (ms) | LCP (ms) | JS KB | CSS KB | JS requests | Script (ms) | JS heap (MB) |
|---|---:|---:|---:|---:|---:|---:|---:|
| `/` landing | 5158 → 2325 | 5380 → 2664 | 758 → 318 | 35.5 → 23.3 | 3 → 4 | 739 → 527 | 16.3 → 10.1 |
| `/login` | 5135 → 2178 | 5112 → 2464 | 677 → 225 | 33.3 → 21.1 | 1 → 1 | 472 → 297 | 11.3 → 9.5 |
| `/courses` | 5141 → 2566 | 4868 → 2292 | 677 → 234 | 33.3 → 21.1 | 1 → 6 | 572 → 407 | 12.1 → 9.5 |
| unit page | 5294 → 2607 | 4920 → 2488 | 677 → 254 | 33.3 → 26.6 | 1 → 22 | 602 → 470 | 14.5 → 9.5 |
| `/espace` | 5137 → 3076 | 5348 → 2820 | 677 → 268 | 33.3 → 26.6 | 1 → 31 | 548 → 428 | 12.1 → 9.5 |
| `/espace/cours` | 5145 → 2568 | 4984 → 2280 | 677 → 250 | 33.3 → 26.6 | 1 → 19 | 469 → 328 | 11.3 → 9.5 |
| `/espace/progression` | 5167 → 3193 | 5504 → 3168 | 677 → 257 | 33.3 → 21.1 | 1 → 18 | 642 → 483 | 14.5 → 9.5 |
| `/espace/cahier` | 5142 → 4094 | 5232 → 3848 | 677 → 346 | 33.3 → 27.8 | 1 → 32 | 516 → 391 | 12.1 → 9.5 |
| lesson index (اختزال كسر) | 7154 → 4542 | 6744 → 4492 | 788 → 379 | 41.5 → 34.8 | 16 → 48 | 628 → 491 | 13.6 → 9.5 |
| lesson module (اختزال كسر / samir) | 5149 → 2048 | 7280 → 5216 | 826 → 424 | 41.5 → 34.8 | 34 → 73 | 821 → 659 | 15.4 → 12.1 |
| `/espace/atelier` | 5632 → 4795 | 5372 → 4296 | 699 → 390 | 36.2 → 29.2 | 7 → 22 | 697 → 535 | 15.4 → 10.1 |
| Number Lab | 5630 → 4595 | 6216 → 5216 | 736 → 510 | 42.5 → 35.5 | 16 → 39 | 575 → 459 | 12.8 → 10.7 |
| `/enseignant` | 5629 → 3060 | 5564 → 2912 | 685 → 238 | 33.3 → 21.1 | 8 → 13 | 514 → 358 | 12.1 → 9.5 |
| `/admin` | 5660 → 3046 | 5648 → 3028 | 697 → 250 | 33.3 → 21.1 | 17 → 24 | 485 → 328 | 12.1 → 9.5 |

On the lesson module page, in all three runs: the « المختبر » pill opens the
overlay (Arabic picker, no raw i18n key) and Escape closes it; « كرّاسي »
opens the notebook window; KaTeX renders. JS request counts rose (lazy
chunks), but Vite modulepreloads each lazy chunk's dependencies in parallel,
so the added cost is about one round-trip per lazy level, not per file.

## 6. How to measure

1. Dump the module graph: a throwaway Vite config that spreads
   `apps/web/vite.config.js` and adds a plugin whose `buildEnd` writes
   `this.getModuleInfo(id).importedIds` for every module and whose
   `generateBundle` writes each chunk's `modules[id].renderedLength`.
2. Walk **static** imports from the entry chunk → what is initial.
3. BFS from `src/main.jsx` over static imports → the exact chain that pulls a
   heavy module in (that is how every row of §5 was found).
4. Browser: build with `VITE_API_URL` pointing at a `vite preview` origin that
   proxies `/api` to the Laravel API, log in once via the API (login is
   throttled at 6/min) and inject the token in `localStorage`.

## 7. Deliberately not done (and why)

- **framer-motion `LazyMotion`** (≈ 350 KB source in the entry). It is used
  by 13 entry files, mostly the landing hero. With async features, elements
  whose `initial` is `opacity: 0` stay invisible until the feature chunk
  arrives — that would *delay* LCP. Sync features save nothing.
- **`experimentalMinChunkSize`** to merge tiny chunks: measured at 8 KB and
  20 KB — it moves code into chunks that did not need it (Number Lab 187 → 345
  KB gzip, lesson runtime 13 → 28 KB) for 1–3 fewer requests. Vite already
  `modulepreload`s a lazy chunk's dependencies in parallel.
- **Lazy `admin` namespace**: see rule 5.
- **Trimming Google Fonts weights**: all five families are used; the browser
  downloads a face only when rendered text needs it, so unused declared
  weights cost only a few hundred bytes of `@font-face` CSS. Cairo stays.
- **`manualChunks`**: Rollup's automatic chunking already follows the lazy
  boundaries; a hand-written map would need maintenance with no measured gain.
