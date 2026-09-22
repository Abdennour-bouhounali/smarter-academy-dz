# Le مختبر الرياضيات (Math Lab)

> **Authoritative** for the Math Lab: its information architecture, the tool
> contract and registry, the document model and persistence, the whiteboard
> (السبّورة) V1, the function grapher (راسم الدوال) V1 with its optional
> tangent / derivative mode, the 3D geometry explorer (الهندسة ثلاثية الأبعاد)
> V1, the probability & statistics lab (الاحتمالات والإحصاء) V1, and the
> lesson-integration point. The code is the source of truth; anything marked
> `Planned` is not built.

## 1. What it is

The Math Lab is a **standalone mathematical workspace** in the student space:
a family of independent instruments a student uses freely — to explore,
construct, visualise, explain, draft. It is **not** a lesson, **not** an
exercise, and tied to no chapter. It follows the platform's pedagogy —
*manipulate → observe → represent → formulate* (`INTERACTION_PEDAGOGY.md`) —
without any of the lesson engine: no modules, no progression, no mastery.

| Built today | Announced, not built |
|---|---|
| **السبّورة** (whiteboard) — `whiteboard` · **راسم الدوال** (function grapher, with the optional « المماس » tangent/derivative mode) — `functionGrapher` · **الهندسة ثلاثية الأبعاد** (3D geometry explorer) — `geometry3d` · **الاحتمالات والإحصاء** (probability & statistics lab) — `probabilityStats` | geometry, vectors, numberLine, trigonometry, algebra, measurement |

The two announced chips « الإحصاء » and « الاحتمالات » were retired together
when `probabilityStats` shipped: one instrument delivers both, because the
law of large numbers is the bridge between them and splitting it in two
tools would have cut that bridge.

The announced instruments exist only as a name and an icon in
`PLANNED_MATH_LAB_TOOLS`, rendered as disabled « قريبًا » chips on the home
page. They have no route, no component, no placeholder screen.

## 2. Information architecture and routes

All under the authenticated student shell (`StudentLayout`, `ProtectedRoute
allowedRoles={['student']}`), French route slugs like the rest of `/espace`:

| Route | Page | Role |
|---|---|---|
| `/espace/atelier` | `MathLabHome` | the instruments, the announced ones, « أعمالي » (saved work) |
| `/espace/atelier/:toolSlug` | `MathLabToolPage` | a **new** document in that instrument (`tableau`, `grapheur`, `geometrie-3d`, `probabilites-statistiques`) |
| `/espace/atelier/:toolSlug/:documentId` | `MathLabToolPage` | a saved document |

`toolSlug` is resolved against the registry (`getMathLabToolBySlug`); an
unknown slug redirects to `/espace/atelier`. A document that is not the
student's (or does not exist) renders « هذا العمل غير موجود أو ليس لك » — the
API answers 404 either way, never 403.

Navigation: one entry « المختبر » in `data/studentNavigation.js` (desktop
sidebar and mobile bottom tab bar), after « استكشاف ». Access follows the
student space: any authenticated, verified student; no premium gate (the Lab
is not lesson content). Visitors are sent to `/login` by `ProtectedRoute`.

## 3. The foundation (`apps/web/src/features/mathlab/`)

```
features/mathlab/
├── toolContract.js        the MathLabTool contract + defineMathLabTool() validator
├── toolRegistry.js        MATH_LAB_TOOLS (built) · PLANNED_MATH_LAB_TOOLS (announced) · lookups
├── mathLabDocument.js     pure document helpers: paths, new/from-API document, title cleaning
├── useMathLabDocument.js  load · autosave · title · save state (one document, any tool)
├── MathLabShell.jsx       the shared frame: back · tool name · title · save status · actions
├── MathLabToolPage.jsx    route element: slug → tool → lazy component → shell
├── openMathLab.js         the lesson → Lab integration point (buildMathLabLaunch / readMathLabLaunch)
├── mathlab.css            shell + home styles (.sa-ml-*)
├── home/                  MathLabHome · ToolCard · DocumentList
└── tools/
    ├── whiteboard/        index.js (definition) · WhiteboardTool.jsx · whiteboardState.js · whiteboard.css
    └── functionGrapher/   index.js (definition) · FunctionGrapherTool.jsx · grapherState.js · expressionParser.js ·
                           expressionEvaluator.js · functionSampler.js · viewport.js · gridStep.js · grapherFormat.js ·
                           CoordinatePlane.jsx · useViewportGestures.js · FunctionCurve.jsx · FunctionPanel.jsx ·
                           FunctionRow.jsx · ColorSwatch.jsx · ExpressionField.jsx · PointInspector.jsx ·
                           mathliveSetup.js · exportGrapherPng.js · functionGrapher.css ·
                           numericalDerivative.js · TangentOverlay.jsx · TangentPanel.jsx   (the « المماس » mode)
    └── geometry3d/        index.js (definition) · Geometry3DTool.jsx · geometryState.js · geometryCalculations.js ·
                           solidScene.js (three.js, no React) · SolidViewer.jsx · GeometryPanel.jsx · ShapeSelector.jsx ·
                           DimensionControls.jsx · GeometryInfo.jsx · geometry3d.css
    └── probabilityStats/  index.js (definition) · ProbabilityStatsTool.jsx · probabilityState.js · experiments.js ·
                           simulationEngine.js · datasetStatistics.js · ExperimentControls.jsx · DatasetEditor.jsx ·
                           StatisticsSummary.jsx · TheoreticalComparison.jsx · FrequencyBars.jsx · ConvergenceChart.jsx ·
                           DistributionChart.jsx · useMediaQuery.js · probabilityStats.css ·
                           dieOrientation.js (result → orientation, throw plan) · diceScene.js (three.js, no React) · DiceViewer.jsx
```

`tools/functionGrapher/grapherFormat.js` (`formatValue`: decimal comma, true
minus, Latin digits) is the Lab's shared number format; the 3D tool imports
it rather than keeping a second copy.

Route entry: `pages/student/MathLab.jsx` re-exports the two pages (same
pattern as `Notebook.jsx`); `App.jsx` lazy-loads them. Transport:
`services/mathLabService.js`. Strings: i18n namespace `mathlab`
(`i18n/locales/ar/mathlab.json`) plus `nav.mathLab` and
`common.apiErrors.mathLab*`.

### 3.1 The tool contract

A tool is a frozen object validated at module load by `defineMathLabTool`
(`toolContract.js`):

| Field | Meaning |
|---|---|
| `id` | stable camelCase id (`whiteboard`) — the value stored in `math_lab_documents.tool`; must also exist in the **server** registry |
| `slug` | URL segment (`tableau`) |
| `labelKey`, `descriptionKey`, `newLabelKey`, `defaultTitleKey` | i18n keys in the `mathlab` namespace |
| `icon` | a lucide icon |
| `schemaVersion` | version of the tool's `data` format; the tool must reopen every version it has published |
| `createInitialData(seed?)` | the state of a new document, empty or built from a lesson seed |
| `load()` | lazy `import()` of the component — heavy engines never load on other pages |

The component receives `MathLabToolProps`: `initialData` (read once),
`title`, `onChange(data)` (the new serialised state — plain JSON), and
`onReady(api | null)`. The `api` exposes **optional** shell actions —
`clear()`, `exportPng(): Promise<Blob>`, `isGridEnabled()`, `toggleGrid():
boolean` — and the shell renders only the buttons that exist. A tool that
cannot export an image simply has no export button.

The « مسح الكل » confirmation uses the tool's own wording when it provides
`tools.<id>.clearTitle` / `tools.<id>.clearBody` in `mathlab.json`, and the
shell's generic `shell.clearTitle` / `shell.clearBody` otherwise (i18next
key fallback in `MathLabShell.jsx`).

### 3.2 Adding an instrument (checklist)

1. `tools/<name>/index.js` exporting `defineMathLabTool({...})`, with the
   component in its own file behind `load: () => import('./…Tool.jsx')`.
2. One line in `MATH_LAB_TOOLS` (and remove it from `PLANNED_MATH_LAB_TOOLS`).
3. Its `id` and byte limit in the **server** registry
   `apps/api/app/Domain/MathLab/MathLabTools.php`.
4. Its strings under `tools.<id>` in `mathlab.json` (optionally
   `clearTitle` / `clearBody`).

Nothing else: no route, no shell change, no persistence change, no
migration. The grapher, the 3D explorer and the probability lab were added
exactly this way (commit history of `toolRegistry.js`, `MathLabTools.php`,
`mathlab.json`). `toolRegistry.test.js` fails if the client and server
registries disagree, if a label key is missing, or if a shipped instrument
is still announced in `PLANNED_MATH_LAB_TOOLS`.

## 4. Document model and persistence

One table for every instrument — `math_lab_documents`:

| Column | Meaning |
|---|---|
| `user_id` | owner, **always** the authenticated user (`$request->user()`), never read from the body |
| `tool` | registry id; validated by `MathLabTools::exists`; **immutable** after creation |
| `title` | ≤ 160 chars, whitespace-normalised, `بدون عنوان` if empty |
| `schema_version` | the tool's format version, stored, never interpreted |
| `data` (json) | the tool's serialised state — **opaque to the server** |
| `data_bytes` | measured on every write; refused above `MathLabTools::maxBytes` (whiteboard: 2 MB, function grapher: 100 KB, 3D geometry: 20 KB, probability & statistics: 60 KB) |

API (`routes/api.php`, inside the `auth:sanctum` + `account.active` +
`email.verified` group), controller `MathLabDocumentController`, domain
`MathLabDocumentService`:

| Verb | Route | Notes |
|---|---|---|
| GET | `/math-lab/documents[?tool=]` | mine only, newest first, **without** `data` |
| POST | `/math-lab/documents` | `throttle:30,1`; 422 `math_lab_unknown_tool` / `math_lab_document_too_large` |
| GET | `/math-lab/documents/{id}` | with `data`; 404 if not mine |
| PATCH | `/math-lab/documents/{id}` | `title`, `data`, `schemaVersion` only; response without `data` |
| DELETE | `/math-lab/documents/{id}` | |

Refusals carry a `code`; the client shows Arabic from
`common.apiErrors.*` (`apiMessage.js`), never the server's text.

### 4.1 Client-side lifecycle (`useMathLabDocument`)

- A new document has **no id** and **does not exist on the server** until
  the first change — opening the whiteboard and leaving creates nothing.
- The tool owns its live state (Excalidraw for the whiteboard; a small React
  state for the grapher); the hook keeps only the latest serialised snapshot,
  in a ref.
- **Autosave**: every change waits `MATH_LAB_AUTOSAVE_MS` (2.5 s) of calm,
  then POST (first time — the URL is rewritten to `/…/:id` with `replace`,
  without remounting the tool) or PATCH. One request in flight at a time;
  changes during a request are sent afterwards; a failed save keeps the
  pending flags and shows « تعذّر الحفظ ». « حفظ » forces an immediate flush.
- Leaving with unsaved changes triggers the browser's `beforeunload` prompt;
  unmount attempts a last flush.
- Save states shown in the shell: `draft` (لم يُحفظ بعد) · `dirty` · `saving`
  · `saved` · `error`.

Deployment: the migration `2026_09_24_000001_create_math_lab_documents_table`
must run in production (`php artisan migrate`).

## 5. السبّورة — Whiteboard V1

### 5.1 Engine choice

**Excalidraw** (`@excalidraw/excalidraw` 0.18, MIT). tldraw was evaluated
first, as requested, and rejected on licence grounds: the tldraw SDK licence
(v3+) forbids production use without a trial or commercial licence key, and
reserves the right to collect and transmit usage data. Neither is acceptable
for a paid platform serving minors. Excalidraw meets every V1 requirement,
ships an Arabic UI (`langCode="ar-SA"`), inherits RTL from `<html dir="rtl">`,
and handles mouse, trackpad, touch and stylus itself. Swapping engines later
touches only `tools/whiteboard/`, not the foundation.

### 5.2 What the student can do

Freehand pen, selection, move, resize, eraser, undo/redo, zoom (buttons,
Ctrl+wheel, pinch), pan (hand tool, space+drag, two fingers), rectangle,
ellipse, diamond, arrow, line, text, stroke colour/width/style, background
colour, layers, library of shapes, grid (shell toggle), export PNG (shell),
clear all (shell, with confirmation, undoable), autosave and title.

Deliberately **off** (`UI_OPTIONS` in `WhiteboardTool.jsx`): the image tool
(no photos on a maths board, bounded documents), load/save-to-file/export
menus (the document lives on the server), Excalidraw's own clear (the shell
confirms), dark theme, the link to excalidraw.com's public libraries, and
the « فتح » entry of the library's ⋮ menu (replaced by the shell's import,
§5.7).

### 5.3 State format (`whiteboardState.js`, `WHITEBOARD_SCHEMA_VERSION = 1`)

`data = { elements, appState, files }` — Excalidraw's `'database'`
serialisation minus `type`/`source`/`version`. `appState` is the persisted
subset (background colour, grid…); viewport position and zoom are not saved.
A change is detected by a **signature** (scene version + background colour +
grid on/off — only values the tool itself puts in the initial state, since
anything Excalidraw normalises at load, such as `gridSize`, would make a
fresh board look "modified" and create a phantom document), so moving the
view never triggers a save; serialisation is debounced 300 ms inside the
tool, autosave 2.5 s in the hook.

A lesson seed (`seed.elements`, see §6) holds Excalidraw *skeleton* elements;
`createWhiteboardData` marks the document `seeded` and the tool converts them
with `convertToExcalidrawElements` at open time.

### 5.4 Fonts and assets

Excalidraw's fonts are **self-hosted** under `apps/web/public/excalidraw/fonts/`
(`window.EXCALIDRAW_ASSET_PATH = '/excalidraw/'`), so no student request goes
to a third-party CDN. `Xiaolai` (CJK, 13 MB) is not copied; it would fall
back to Excalidraw's CDN if a CJK glyph were ever used. Refresh the copy on
every Excalidraw upgrade (`public/excalidraw/README.md`).

### 5.5 Layout and responsiveness

The shell (`.sa-ml-tool`) is a flex column that fills the viewport:
`calc(100dvh − 3.5rem − 5rem)` below `lg` (mobile top bar + bottom tabs
reserved by `StudentLayout`), `100dvh` from `lg`. The workspace is
`position: relative; flex: 1; min-height: 0` and the tool sits in it
absolutely — Excalidraw gets a non-zero box without any fixed height. On
narrow screens the shell bar keeps icon-only 44 px buttons and hides labels,
and below 640 px the title takes its own full-width row; the import result
line sits in the flow between bar and workspace (no overlay, nothing to
position). Excalidraw switches to its own mobile toolbar. Verified at
1920×1080, 1440×900, 1280×720, 1280×500, 1024×768, 768×1024, 430×932,
390×844, 360×800 and 360×600: no horizontal overflow, canvas fits without
page scroll, library menu inside the viewport.

### 5.6 Equations

Not in V1. KaTeX/MathLive (`MathText`, `MathInput`) render HTML, not canvas
paths; rasterising them into image elements would be fragile and the image
tool is off. Notation is written as text (Excalidraw text elements are LTR
by content). `Planned`: an « إدراج معادلة » action on the tool API once a
robust LaTeX → SVG path exists.

### 5.7 Files (« الملفات ») — attachments, quotas, imports

**Storage model.** A file is a row of `math_lab_files` (`user_id`,
`document_id`, `kind` = `image | svg | pdf`, `original_name`, `mime_type`
read from the bytes, `size`, `disk_path`) and its bytes on Laravel's private
`local` disk under `math-lab/{user_id}/{uuid}.{ext}`. A file belongs to
**one** board and one owner: it is never shared between boards, so removing
it from the board and deleting it are the same act (the UI says so). The
document JSON never carries bytes: `whiteboardState.toWhiteboardData` strips
Excalidraw's `files`, an image element only references its attachment
(`fileId = sa-<id>`), and the tool reloads the bytes at open time
(`WhiteboardTool.rehydrate`). Deleting a board deletes its files' bytes.

**The policy — one place per side.** `App\Domain\MathLab\MathLabFilePolicy`
(server, authoritative) and `features/mathlab/attachments/attachmentPolicy.js`
(client, for refusing before sending); `attachmentPolicy.test.js` fails if
they disagree.

| Limit | Value | Where enforced |
|---|---|---|
| File size | **1 MB = 1 000 000 bytes** (product definition, same on both sides) | client `planSelection`; server `MathLabFileService::store` on the received size |
| Files per board | **3** | client (counters, disabled « إضافة », plan); server, under lock |
| Files per student | **50** across all boards | client (plan, counters from the server); server, under lock |
| Types | `png jpg jpeg webp svg pdf` (stored); `excalidraw excalidrawlib json` (merged, not stored) | client by extension; server by **content** (finfo + PNG/JPEG/WEBP header via `getimagesize`, `%PDF-`, `<svg` without `<script>`/`on*=`/`javascript:`) |

**Atomic quota.** `store` runs in one transaction that first takes
`SELECT … FOR UPDATE` on the student's `users` row (a per-account mutex),
then counts board and account files with *locking* reads (so the count is
the latest committed state, not the transaction's earlier snapshot), then
writes bytes and row. Two simultaneous uploads at 49 serialise: the second
counts 50 and is refused. `MathLabFileFlowTest` asserts the lock is taken
before the counts and the counts before the insert. Cleanup: a row that
fails after the bytes were written deletes the bytes; a refused upload
writes nothing.

**API** (inside the student group; owner only, 404 for anyone else):

| Verb | Route | Notes |
|---|---|---|
| GET | `/math-lab/quota` | the student's total, for a board not yet saved |
| GET | `/math-lab/documents/{id}/files` | list + `quota` |
| POST | `/math-lab/documents/{id}/files` | multipart `file`, one per request, `throttle:60,1`; 201 with `file` + `quota` |
| GET | `/math-lab/files/{id}/content` | bytes, `Content-Disposition: attachment`, `nosniff` |
| DELETE | `/math-lab/files/{id}` | returns `quota` |

`GET /math-lab/documents/{id}` also returns `files` and `quota`, so opening
a board is one request. Refusals are **codes**: `math_lab_file_too_large`,
`math_lab_file_unsupported`, `math_lab_board_file_limit`,
`math_lab_user_file_limit` (422, with the current `quota`),
`math_lab_upload_failed` (500), `math_lab_file_not_found` /
`math_lab_document_not_found` (404). The client maps them
(`attachmentPolicy.errorKeyFrom`) to `files.errors.*`; the server's text is
never shown.

**Client.** `useMathLabAttachments` holds the server's list and counters
(seeded from the document response, refreshed by every upload/delete
response — the client never keeps its own tally). `AttachmentsPanel` is a
shell-level panel rendered **in the flow** between the bar and the
workspace when the tool declares the `attachments` capability (tool
contract): counters « 2 / 3 في هذه السبّورة · 47 / 50 إجمالًا », the
full-board / full-account notice shown before any click (button disabled),
a multi-select picker whose selection is judged **in full before the first
upload** (`planSelection`: one unsupported or oversized file, or more files
than the remaining slots, refuses the whole selection with a precise
message), sequential uploads with a busy line, a success line, and per-file
actions: place on the board (image, svg), download (all), delete (with the
notebook's modal confirmation). A new board is created on the server
before its first file (`useMathLabDocument.ensurePersisted`). Shape
libraries and `.excalidraw` files go through the same picker but are merged
into the board (`capability.importFile`), take no quota, and are refused
with the import codes (`shell.importErrors.*`).

**Bypass guard.** The image tool is off; an image that still reaches the
scene (paste, drop) is removed at once by `handleChange` with the notice
« أُزيلت صورة أُلصقت مباشرة… », because its bytes could never be saved and
would escape the quota. Server-side, a direct API call meets the same
policy.

**Existing data.** Nothing is ever deleted by the server: a board with more
files than the limit (older data, or the limit lowered later) lists them
all, keeps them accessible, and simply cannot receive another file until it
is below the limit; the same for an account above 50.

**Layout.** No popover: the panel is in-flow, capped at 45 % of the viewport
height with internal scrolling, cards wrap, controls keep 44 px, and the
whiteboard keeps at least a usable strip. Verified at ten viewports incl.
1280×500 and 360×600 (`e2e/mathlab.mjs`). The library's own ⋮ menu is
Excalidraw's; its empty-state instance (which opened leftward off-panel
under RTL) is hidden because its only entry, « فتح », is now the panel; the
populated-library ⋮ is measured inside the viewport.

**Not supported (deliberately).** `.docx`, `.pptx`, `.xlsx`, `.csv`, `.txt`:
the board can do nothing with them. PDFs are stored and downloadable, not
rendered on the canvas (Excalidraw draws images only; rendering PDF pages
would need a PDF engine). Dropping a file onto the canvas still goes
through Excalidraw's own handler: images are removed by the guard, library
files show Excalidraw's generic message — the supported path is the panel.

## 5b. راسم الدوال — Function Grapher V1

> *Touch the mathematics and see what changes.* A student writes a function,
> sees its curve at once, zooms, pans, drops a point on the curve and reads
> f(x). It is an exploration instrument, not a graphing calculator and not a
> computer algebra system.

### 5b.1 Engine choices

| Layer | Choice | Why |
|---|---|---|
| Coordinate plane, grid, axis labels, movable point, SVG contexts | **mafs 0.21** (MIT) — already a dependency (marketing hero) | React-native SVG maths library; the repo had already evaluated and **rejected JSXGraph** (`docs/experiments/JSXGRAPH_PILOT.md`), so adding it back would contradict a documented decision. No business-chart library is involved. |
| Camera (viewport) and gestures | **our own** (`viewport.js`, `useViewportGestures.js`) | mafs' camera is internal (not readable, not settable), so the viewport is explicit state instead: persistable, resettable, lesson-settable. mafs runs with `pan={false} zoom={false}` and receives the viewport as `viewBox`. |
| Curve sampling and rendering | **our own** (`functionSampler.js`, `FunctionCurve.jsx`) | mafs' `Plot.OfX` skips non-finite samples but still joins their neighbours, drawing a vertical line through the pole of `1/x`. The sampler below cuts the curve instead. |
| Expression entry | **MathLive 0.110** (MIT) — already a dependency, previously dormant | Real 2-D typing (fractions, roots, exponents), virtual keyboard on touch devices. Configured once in `mathliveSetup.js`: fonts served from our bundle (`mathlive/fonts.css`, `fontsDirectory = null`), no sounds, no context menu, a compact grapher keyboard layout installed while the tool is open and restored on unmount. |
| Parsing and evaluation | **our own** (`expressionParser.js`, `expressionEvaluator.js`) | ~300 lines, deterministic, unit-tested, readable error codes. `@cortex-js/compute-engine` (2.6 MB) was not pulled in: parse → evaluate → plot needs no CAS. |

Everything loads in the tool's own chunk (`FunctionGrapherTool-*.js`, ≈ 850 kB
minified, mostly MathLive) only on `/espace/atelier/grapheur*`.

### 5b.2 The pipeline

```
MathLive field ─(LaTeX string)─▶ expression ─▶ parseExpression ─▶ AST ─▶ compileExpression ─▶ fn(x)
                                                                                   │
                       viewport {xMin,xMax,yMin,yMax} + pixel width ─▶ sampleFunction(fn) ─▶ polylines ─▶ <path> (mafs viewTransform)
```

The renderer never parses input; the parser never touches the DOM. A lesson
seed or a test writes the same expression strings a student would (ASCII or
LaTeX), and the same pipeline draws them.

### 5b.3 Supported expression subset (`expressionParser.js`)

One tolerant grammar reads both MathLive's LaTeX and hand-written ASCII:

| | Accepted forms |
|---|---|
| numbers | `2`, `2.5`, `2,5` (decimal comma) |
| variable | `x` (parameters like `a`, `b` are reserved for the future `scope`; today they are `unknownSymbol`) |
| constants | `pi`, `\pi`, `π`, `e`, `\exponentialE`, `\mathrm{e}` |
| operators | `+ - * / ^`, `\cdot`, `\times`, `\div`, `× · ÷ −` |
| implicit multiplication | `2x`, `3(x+1)`, `(x+1)(x-2)`, `x\sin x` — same precedence as `*`, left to right: `1/2x = (1/2)·x` |
| powers | `x^2`, `x^{10}`, `x^-1`, `x²`, `x³`; right-associative; an unbraced exponent is a single atom (`x^2x = x²·x`, as in LaTeX); `-x^2 = -(x²)` |
| fractions | `\frac{a}{b}`, `a/b` |
| roots | `\sqrt{x}`, `sqrt(x)`, `√x`, `\sqrt[3]{x}` (odd-degree roots are extended to negatives: ∛−8 = −2) |
| absolute value | `|x|`, `\left|x\right|`, `\lvert x\rvert`, `abs(x)` |
| functions | `sin cos tan sqrt abs exp ln log` (`log` is decimal); a parenthesis-free argument extends over the implicit product that follows: `\sin 2x = sin(2x)`, `\sin x^2 = sin(x²)`, `\sin x\cos x = sin(x)·cos(x)` |
| grouping | `( )`, `{ }`, `\left( \right)`, `\mleft \mright`; spacing commands are ignored |

Errors are codes, never JavaScript messages: `empty`, `incomplete`
(`\placeholder{}` left by MathLive), `unknownSymbol` (with the symbol),
`syntax` (with a position). The row shows the Arabic message
(`tools.functionGrapher.errors.*`) after 700 ms of calm, so a fast typist
never sees it flash; while an expression is invalid its curve is simply not
drawn. Out-of-domain values are non-finite numbers (`sqrt(-1)`, `ln(0)`,
`1/0`), never exceptions. Not supported (by design): equations, inequalities,
parametric or polar curves, `sin^2 x`, factorials, user-defined names.

### 5b.4 Sampling and numerical quality (`functionSampler.js`)

- 1.5 samples per pixel of width (64 ≤ n ≤ 4000), uniform, over the visible
  x-range intersected with the function's `domain`.
- A non-finite value **cuts** the curve.
- A jump larger than the visible height between two neighbours is *suspect*:
  the midpoint is probed (up to 4 levels). If every probed midpoint stays
  between its two ends the function is merely steep and the points are joined
  (`y = 1000x` stays one piece); otherwise it is a pole and the curve is cut
  (`1/x`, `tan x`).
- At a domain boundary (a finite sample next to a non-finite one) the edge is
  found by bisection, so `√x` starts at (0, 0) and not a pixel later.
- Ordinates are clamped to an invisible band (twice the view height above and
  below) so the SVG never receives 1e300; nothing visible changes.
- Known limits: oscillations finer than a pixel (`sin(1/x)` near 0,
  `sin(1000x)`) alias; a function defined at isolated points draws nothing;
  `x^(1/3)` is NaN for negative x (JavaScript `Math.pow`), use `\sqrt[3]{x}`.

### 5b.5 What the student can do

| Area | Interaction |
|---|---|
| Functions | up to `MAX_FUNCTIONS = 6` rows (as many as auto-assigned palette colours); each row is the editor: colour swatch, `f(x) =`, MathLive field, show/hide, delete. Names `f g h k l m` and palette colours are assigned to the first free slot. |
| Tangent mode (« المماس ») | an option block under the list (`TangentPanel.jsx`, state `data.tangent`). Off by default: the grapher is exactly the tool above. On: one **studied function** (radio list when there are several), the point **A** on it — the same movable point as inspection, now constrained by `constrainAlongCurve` so it never leaves the domain nor crosses a pole — the tangent through A, its measured slope `f′(x)` (large), `A(x ; y)`, a first-use cue « اسحب النقطة A على المنحنى » until the first gesture, an `x =` field and an x slider over the visible range as the non-drag alternative, and two options: **show f′** (a virtual curve in `derivativeColorFor(colour)`, never stored, with **B = (a ; f′(a))** and the vertical guide) and **show the slope triangle**. A tap anywhere in the plane sets x. No explore/apply button: dragging is the interaction. The mathematics is §5b.10. |
| Colour | the swatch is a button (`ColorSwatch.jsx`) that opens a compact palette of the nine `FUNCTION_COLOR_CHOICES` (the six auto colours + indigo, pink, dark slate), each with an Arabic `aria-label`, `aria-pressed` and a check mark on the current one; Escape closes and returns focus. The choice writes `fn.color` — the single source of truth for the curve stroke, the swatch, the point A and its guides. Two functions may share a colour on purpose; the system never overrides a chosen colour. The popover is `position: fixed`, placed under the swatch (above it when there is no room) and kept inside the viewport, so a scrolling or collapsed panel never clips it. « أضف دالة », seven example chips (`x`, `x²`, `2x+1`, `1/x`, `|x|`, `√x`, `sin(x)`), an explanatory empty state. A new document opens on `f(x) = x²`. |
| Plane | orthonormal grid whose step follows the zoom (1-2-5 sequence, ≥ 56 px between major lines, 4 or 5 subdivisions), axis labels with decimal comma and true minus, `x`, `y`, `O`; the shell's grid toggle hides the grid lines and keeps axes and labels. |
| View | drag to pan (mouse, one finger); wheel / trackpad to zoom at the cursor; pinch to zoom around the pinch point; `+ −` buttons and « إعادة ضبط »; keyboard on the focused plane: arrows pan 10 %, `+`/`−` zoom, `0`/`Home` reset. Zoom is bounded (span between 1e-3 and 1e6). Default view x ∈ [−8, 8], y ∈ [−6, 6], expanded to the box's aspect ratio; on resize the x-range is kept. |
| Reading | a pointer readout `x = … y = …` (top corner, precision follows the zoom, updated outside React). |
| Point | a tap within 40 px of a curve drops **A** on the nearest curve at that x, with dashed guides to both axes; A is draggable along the curve (mafs `MovablePoint`, keyboard arrows too) and never leaves the domain; the panel shows `x` (editable, exact), `f(x)`, `A(x ; y)`, or « غير معرّفة ». V1 keeps one point; the model is a list. |
| Document | title, autosave (§4.1), « أعمالي », delete; « مسح الكل » removes all functions and points (confirmed, grapher wording); PNG export of the plane (§5b.8). |

### 5b.6 State format (`grapherState.js`, `FUNCTION_GRAPHER_SCHEMA_VERSION = 1`)

```js
data = {
  functions: [{ id, name: 'f', expression: 'x^2', visible: true, color: '#2563eb', domain: null | { min, max } }],
  points:    [{ id, name: 'A', functionId, x }],
  viewport:  { xMin, xMax, yMin, yMax } | null,      // null = default view fitted to the box
  settings:  { grid: true },
  tangent:   { enabled: false, functionId, x: 1, showDerivative: false, showTriangle: true },
}
```

`tangent` is normalised by `normalizeTangent`: absent in an older document →
disabled; a `functionId` that no longer exists → the first function;
deleting the studied function moves the study to the next one. f′ is never
stored.

`expression` is stored **as typed** (MathLive LaTeX or ASCII); an invalid
expression is kept so the student finds and fixes it. `domain` is honoured
by the sampler and the point but has no editor in V1 (a lesson seed may set
it). `normalizeGrapherData` makes any stored or seeded value safe (unknown
fields dropped, bad colours replaced, orphan points removed, more than six
functions truncated). The viewport is reported to the document 400 ms after
the last gesture, the whole state is handed to the shell 300 ms after the
last change (`SERIALIZE_MS`), and the shell autosaves 2.5 s later.
Opening a new document and leaving creates nothing.

Palette (`FUNCTION_PALETTE`, Tailwind 600 hues, all legible on white):
blue `#2563eb`, rose `#e11d48`, emerald `#059669`, amber `#d97706`, violet
`#7c3aed`, cyan `#0891b2`. Choosable in addition (`FUNCTION_COLOR_CHOICES`):
indigo `#4f46e5`, pink `#db2777`, slate `#334155`. A stored function without
a valid `color` (older or hand-written document) receives the first free
palette colour on load — no migration.

### 5b.7 Layout, responsiveness, RTL, accessibility, performance

- Desktop/tablet (≥ 768 px): the function panel (20–22 rem) on the **start**
  edge (right in Arabic), the plane takes the rest. Below 768 px: the plane
  on top, the panel below (≤ 46 % of the height, scrollable) with a
  collapse button that gives the screen back to the plane. Verified at 1440,
  1024 (touch) and 390 px: no horizontal overflow, 44 px targets, MathLive's
  virtual keyboard appears on touch.
- The panel follows the page direction (Arabic, RTL). Each function row and
  the plane are `dir="ltr"` with bidi isolation: an equation reads left to
  right, axes keep their mathematical orientation. Numbers use the decimal
  comma and the typographic minus (`grapherFormat.js`), Latin digits.
- The plane is `role="application"`, focusable, named with its keyboard
  hints; every icon button has `aria-label` + `title`; visibility is
  `aria-pressed`; expression errors are `role="alert"` linked by
  `aria-describedby`; the point value is `aria-live`. Curves are not
  described to screen readers — the panel (expressions, point readout) is.
- Viewport changes during a gesture re-render only the plane subtree;
  compiled functions are cached per expression; sampling is ≈ n×1.5 evals
  per curve per frame; the pointer readout writes the DOM directly. All
  listeners, timers and the global MathLive keyboard layout are released on
  unmount.

### 5b.8 Export

The shell's PNG button rasterises the plane's SVG (`exportGrapherPng.js`):
clone, copy the mafs CSS variables inline, white backdrop, draw at 2×
through a canvas. The legend is not part of the image; label fonts are the
system's. `Planned`: SVG export, legend in the image.

### 5b.9 Extension points

`CoordinatePlane` takes, besides the grapher's props, `renderOverlay({
view, step })` (extra SVG layers drawn inside mafs, after the curves and
under the point — the tangent mode uses it), `defaultViewport` (the reset
view), `canvasLabel` and `constrainPointX(next, current)` (a rule the
movable point obeys). Future graph features — secant, second derivative,
extrema, integral — are further modes of the grapher on the same pattern
(a sub-state, a panel block, an overlay), **not** separate instruments.
Still prepared, not built: parameters/sliders (`compileExpression` reads a
`scope`; `parseExpression(src, { variables: ['x', 'a'] })`), several points
(`points` is a list), a domain editor.

### 5b.10 Tangent mode — the mathematics, numerical and honest about it

`derivativeAt(fn, x)` measures the slope: central difference
`D(h) = (f(x+h) − f(x−h)) / 2h` with `h = 1e-4·max(1, |x|)`, corrected by
Richardson extrapolation `D = (4·D(h/2) − D(h)) / 3` (error O(h⁴): for
polynomials, `sin`, `cos`, `exp`, `1/x`, `√x` away from 0 the displayed
decimals are exact — unit-tested against the closed forms). It returns
`{ ok: false, reason }` instead of a number when:

| reason | when | example |
|---|---|---|
| `undefined` | f is not finite at x or within ±h | `√x` at 0, `1/x` at 0, `ln x` at 0, x outside the domain |
| `corner` | left and right slopes disagree and the disagreement does not halve when h halves, or the two central differences disagree | `\|x\|` at 0 (and within h of it) |
| `unstable` | the result is not finite | — |

`derivativeFunction(fn)` turns that into a plottable `x ↦ f′(x)` (NaN where
refused), so the grapher's sampler draws f′ with the same cuts as f:
`1/x` → two branches, `√x` → starts after 0, `\|x\|` → −1 then +1 with a gap
at 0. `tangentAt(fn, a)` is the point-and-slope of the tangent, or null.
`constrainAlongCurve(fn, current, next, ySpan)` is the rule A obeys while
dragged: refused where f does not exist, and refused across a pole (a jump
above a quarter of the view height whose midpoints do not stay between the
ends), so A never crosses `1/x` at 0 and stops at the edge of `√x`.
There is **no symbolic differentiation**: the panel shows `f′(x)` as a
value, never a formula. Limits: an oscillation of period below ~1e-3 around
x is invisible to the method; a jump discontinuity exactly between x−h and
x+h reads as a huge slope (the f′ trace cuts it like a pole).


## 5c. الهندسة ثلاثية الأبعاد — 3D Geometry Explorer V1

> *Turn the solid, change its dimensions, and see the geometry and the
> numbers change together.* A student chooses a solid, sees it in three
> dimensions, orbits and zooms around it, resizes it with a slider or a typed
> value, and reads its volume and total area — formula, substituted formula,
> result — at once. It is a visualisation instrument, not a modeller: no
> mesh editing, no scene graph, no nets, no sections, no transformations.

### 5c.1 Engine choice

| Layer | Choice | Why |
|---|---|---|
| Rendering, camera, geometry | **three.js 0.186** (MIT) — new dependency, the only 3D library in the repo | The smallest mature option. There was no 3D library; a custom WebGL engine was out of the question. |
| Orbit / zoom / pan gestures | three's own `OrbitControls` (`three/examples/jsm`) | Mouse, wheel, trackpad, one-finger orbit, two-finger pinch/pan, damping — no custom gesture engine. It sets `touch-action: none` on the canvas, so the page never scrolls during a gesture. |
| Dimension and axis labels | three's `CSS2DRenderer` — labels are **DOM text** projected over the canvas | Real fonts (JetBrains Mono / Cairo), selectable, styleable, correct at any DPI; nothing is baked into a texture. They move with the object and the camera because they are scene objects, not screen positions. |
| React Three Fiber | **not used** | The Lab keeps engine state out of React (Excalidraw for the whiteboard, an explicit viewport for the grapher). `solidScene.js` is one imperative class that `SolidViewer.jsx` creates once and drives by methods; a dimension change rebuilds one `BufferGeometry`, never the scene, the renderer, the camera or the controls. |
| Formulas | KaTeX through the platform's `MathText` | Same renderer as the lessons; every formula is `dir="ltr"`. |

three.js loads in the tool's own chunk (`Geometry3DTool-*.js`, ≈ 580 kB
minified, ≈ 147 kB gzipped) only on `/espace/atelier/geometrie-3d*`.

### 5c.2 Coordinate frame

Mathematics puts **z up**; three.js puts y up. The scene works in three's
frame and translates: `(x, y, z)ₘₐₜₕ ⟷ (x, z, −y)ₜₕᵣₑₑ` (determinant +1, the
frame stays right-handed). The drawn axes carry the mathematical names x
(red), y (green), z (blue) with a labelled origin O. The RTL page direction
concerns the interface only: the frame is **never mirrored**. The stage is
`direction: ltr`; the panel follows the page.

Solids sit as in a textbook: the cube and the cuboid in the first octant (a
vertex at O, three edges on the axes), the cylinder and the cone standing on
z = 0, the sphere centred at O. The grid (1-unit cells) is the plane z = 0.

### 5c.3 What the student can do

| Area | Interaction |
|---|---|
| Solid | a native `<select>`: مكعب (cube, `side`), متوازي المستطيلات (cuboid, `length`, `width`, `height`), كرة (sphere, `radius`), أسطوانة (cylinder, `radius`, `height`), مخروط (cone, `radius`, `height`). Switching **carries over** what shares a name (cylinder → cone keeps r and h; sphere → cylinder keeps r), a cube becomes a cuboid of equal edges, a cuboid a cube of side L; the rest takes defaults (`SHAPES` in `geometryState.js`). A new document opens on a **cube of side 2**. |
| Dimensions | per parameter, a **slider and a text field, always in sync** (`DimensionControls.jsx`); either one resizes the solid at once — no apply button. Range `[0.5, 10]`, step 0.1 (`DIMENSION_MIN/MAX/STEP`). While typing, a value is applied as soon as it is valid; an invalid one (`−4`, `abc`, `50`) shows « اكتب عددًا بين 0,5 و 10 » (`role="alert"`, `aria-invalid`) and changes nothing; on Enter/blur it is **clamped to the nearest bound**. Decimal comma and true minus are read. |
| View | drag to orbit (mouse, one finger), wheel / pinch to zoom, right-drag or two-finger drag to pan; `+ −` buttons and « إعادة ضبط المنظر » (camera only — never the solid or its dimensions); keyboard on the focused stage: arrows orbit 12°, `+`/`−` zoom ×1.25, `0`/`Home` reset. Zoom is bounded (distance 1–120). |
| Camera framing | the default view looks from `(−1.15, 0.9, 1.5)` (three frame) — a vertex toward the student, all three axes visible — at a distance that frames the solid **and** its axes. After a change of solid the camera keeps its **direction** but follows the solid: the target returns to its centre, and the distance is refitted when the shape changes, when the solid would overflow the view, or when it would become tiny (`keepFramed`). A cube going from 2 to 3 grows on screen; one going from 2 to 10 does not leave the frame. |
| Measurements on the solid | « القياسات على الشكل » draws amber dimension segments with DOM labels (`a = 2`, `L = 4`, `r = 2`, `h = 3`, and `l = 5` for the cone's slant): the three edges from O for the cube/cuboid, the radius for the sphere, the top radius and a generator for the cylinder, the base radius, the (interior) height and the slant for the cone. Segments ignore depth (always readable); the solid is slightly translucent (opacity 0.86) so hidden edges show dimmed, as dashed edges would in a book. |
| Axes, grid | « المحاور », « الشبكة » in the panel; the grid is also the shell's grid button, and the two stay in sync (the tool re-publishes its `toolApi` when `showGrid` changes). |
| Face | a click (or tap) that neither moved nor lasted designates a **face** — highlighted amber — and the panel names it and gives **its area**: « الوجه n » (the six faces of a cube/cuboid, `faceKinds` order = three's `BoxGeometry` groups +x −x +y −y +z −z), « السطح الجانبي » / « القاعدة العليا » / « القاعدة السفلى » (cylinder), « السطح الجانبي » / « القاعدة » (cone), « سطح الكرة » (sphere). A second click releases it; changing solid clears it. The selection is **not** stored. |
| Reading | the « القياسات » block (`GeometryInfo.jsx`): the solid's name, each dimension, the cone's slant with `l = √(r² + h²)`, then volume and total area — general formula, formula with the values substituted, result in « وحدة حجم » / « وحدة مساحة » (generic units; no unit system in V1). It is `aria-live="polite"` and is the complete textual representation of the solid. |
| First use | « اسحب لتدوير الشكل » over the stage until the first gesture (drag, wheel, button or key); « غيّر الأبعاد لترى الشكل يتغيّر » under the dimensions. No tutorial. |
| Document | title, autosave (§4.1), « أعمالي », delete; PNG export of the canvas (§5c.6). No « مسح الكل »: a solid cannot be emptied, the tool exposes no `clear`. |

### 5c.4 The mathematics (`geometryCalculations.js`)

Pure functions, unit-tested against closed forms (`geometryCalculations.test.js`):

| Solid | V | A |
|---|---|---|
| cube | a³ | 6a² |
| cuboid | L·l·h | 2(Ll + Lh + lh) |
| sphere | 4πr³/3 | 4πr² |
| cylinder | πr²h | 2πr² + 2πrh |
| cone | πr²h/3 | πr² + πr·l, with **l = √(r² + h²)** computed, never entered |

`faceAreaOf(shape, d, index)` gives one face's area (cuboid ±x: l·h, ±y:
L·l, ±z: L·h; cylinder lateral 2πrh, discs πr²; cone lateral πrl, base πr²);
the faces of every solid sum to A (tested). `FORMULAS` holds the general
LaTeX, `substitutedFormulas` the LaTeX with the values (`latexNumber`:
decimal comma as `{,}`). Values are displayed with two decimals through the
shared `formatValue`.

### 5c.5 State format (`geometryState.js`, `GEOMETRY3D_SCHEMA_VERSION = 1`)

```js
data = {
  shape:            'cube' | 'cuboid' | 'sphere' | 'cylinder' | 'cone',
  dimensions:       { side } | { length, width, height } | { radius } | { radius, height },  // the current solid's parameters only
  showAxes:         true,
  showGrid:         true,
  showMeasurements: true,
  camera:           { position: [x, y, z], target: [x, y, z] } | null,   // three.js frame; null = default view
}
```

`normalizeGeometry3DData` makes any stored or seeded value safe: unknown
shape → cube, each dimension clamped to `[0.5, 10]` or replaced by its
default, unknown keys dropped, a camera whose position equals its target or
is not three finite numbers → `null`. The camera is reported to the document
400 ms after the last gesture (`CAMERA_REPORT_MS`), the state is handed to
the shell 300 ms after the last change (`SERIALIZE_MS`), autosave 2.5 s
later. Opening a new document and leaving creates nothing.

### 5c.6 Layout, responsiveness, RTL, accessibility, performance

- ≥ 768 px: the panel (18 rem, 22 rem from 1280 px) on the **start** edge
  (right in Arabic), the stage takes the rest. Below 768 px: the stage on
  top, the panel below (≤ 48 % of the height, scrollable) with a collapse
  button. Verified at 1440, 1024 (touch) and 390 px: no horizontal overflow,
  40–44 px targets, the page does not scroll during a one-finger orbit or a
  pinch.
- The stage is `role="application"`, focusable, named with its keyboard
  hints; every icon button has `aria-label` + `title`; the dimension fields
  are labelled (name + symbol), sliders carry `aria-valuetext` (`a = 2`);
  invalid input is `role="alert"` linked by `aria-describedby`; the
  measures block is `aria-live`. The canvas is not described to screen
  readers — the panel is the description. Without WebGL the scene is not
  created and « لا يدعم هذا المتصفح الرسم ثلاثي الأبعاد… » takes the stage;
  the panel keeps working.
- Rendering is **on demand**: a frame is drawn when something changed and
  while a gesture or its damping moves the camera (`requestRender` /
  `frame` in `solidScene.js`), never in a free-running loop. Renderer,
  scene, camera, lights, controls, grid and label renderer are created once;
  a dimension change disposes and rebuilds only the solid's geometry, its
  edges, its dimension segments and (if the extent changed) the axes.
  Pixel ratio is capped at 2; `ResizeObserver` resizes. Everything —
  geometries, materials, controls, the WebGL context — is disposed on
  unmount (React StrictMode mounts twice in dev; the second scene replaces
  the first cleanly).
- Export: the shell's PNG button renders one frame and reads the canvas
  (`toBlob`); DOM labels are not part of the image.

### 5c.7 Extension points and limits

Prepared, not built: several solids in one scene (the state holds one),
units (`cm`), a seed from a lesson (§6). **Not in V1, by decision**: nets /
unfolding, cross-sections, transformations of the object (translation,
symmetry, homothety, vectors), coordinates of vertices, edge selection
(faces only), a legend or labels in the exported PNG. Future features are
further modes of this instrument on the same pattern (a sub-state, a panel
block, a scene layer), **not** separate instruments.

## 5d. الاحتمالات والإحصاء — Probability & Statistics Lab V1

> *Run the experiment, watch the data pile up, and see the frequency come to
> the probability.* A student picks a random experiment, launches it, watches
> the bars grow batch by batch, compares experimental frequencies with the
> theoretical probabilities, raises the number of trials and sees the law of
> large numbers happen on the chart; or types a data series and reads its
> distribution, mean and median at once. It is an exploration instrument,
> not statistics software: no formula sheet, no test, no distribution editor.

### 5d.1 Engine choices

| Layer | Choice | Why |
|---|---|---|
| Charts (bars, convergence, distribution) | **our own inline SVG** — `FrequencyBars.jsx`, `ConvergenceChart.jsx`, `DistributionChart.jsx` | The repo rule for anything a student reads: drawn in code, parameterised by props, Arabic as DOM text (`CLAUDE.md`). `recharts` is in `package.json` but serves only the admin analytics page — a business-chart library, not brought into a student maths surface; mafs is a coordinate-plane library, the wrong shape for bars. **No dependency was added**; the tool is a ~24 kB chunk. |
| Statistics core | `lessons/common/stats/statsUtils.js` (`mean`, `median`, `range`, `frequencyTable`, `sorted`) | One definition of the median in the repository, with its convention documented there; the Lab must not become a second one. The lesson *components* of that folder (`FrequencyChart`, `Histogram`…) are **not** reused: they carry hard-coded French strings from the dormant lycée lessons. |
| Randomness | `lessons/common/stats/randomUtils.js` — `makeRng` (mulberry32), `randomInt` | Seeded, deterministic: a saved experiment reopened is the **same** experiment; unit tests and e2e are reproducible. The seed is internal, never shown (§17 of the brief). |
| Theory | `experiments.js` — **computed, never tabulated** | `P(k) = 1/\|Ω\|`; the two-dice law is counted on the 36 equiprobable pairs, so `P(7) = 6/36` is a result, not a constant. |

### 5d.2 The experiments (`experiments.js`)

An experiment is `{ outcomes(params), probabilities(params), draw(rng, params) → index, trackedIndex, numeric }`. `draw` returns the **index** of the outcome, so the engine only ever increments a counter.

| id | Ω (ordered) | Law | Tracked outcome (convergence chart) | Notes |
|---|---|---|---|---|
| `coin` | ظهر (0), وجه (1) | 1/2, 1/2 | وجه | |
| `die` | 1 … 6 | 1/6 each | 1 | |
| `twoDice` | sums 2 … 12 | counted on 36 pairs | 7 (= 6/36) | two dice are **really rolled and summed** — drawing straight from the sum law would give the same frequencies but would no longer be the experiment the student thinks they are running |
| `random` | integers `min … max` | uniform | `min` | bounds in `[−1000, 1000]`, span capped at `RANDOM_MAX_SPAN = 100` so the axis stays readable; `min > max` is **swapped**, not refused (`normalizeRange`) |

Sample sizes: chips `1 · 10 · 100 · 1 000 · 10 000 · 100 000` plus a free field, capped at `MAX_DRAWS = 100 000`. `theoreticalFraction` gives the textbook fraction (`1/2`, `1/6`, `6/36`, `1/n`) shown next to the percentage.

### 5d.3 The simulation engine (`simulationEngine.js`)

- A simulation is `{ experimentId, seed, total, counts[], drawn, trajectory[] }`. It holds **counts, never draws**: 100 000 die rolls are six integers (§29 of the brief; tested).
- `runBatch(sim, n, params, target)` is the only function that draws. It returns a new state; the generator is **replayed from the seed** past the `drawn` draws already made (linear, ~1 ms per 100 000) so the state stays plain JSON — a document stores a seed and a counter, never a generator's internals. Two batches of 500 equal one batch of 1 000 (tested).
- The **trajectory** — points `(n, frequency of the tracked outcome)` — is recorded densely for n ≤ 10 then every `target/60`, and trimmed to 60 points; it is what the convergence chart draws.
- **Animation** (`ProbabilityStatsTool.run`): one `requestAnimationFrame` per batch — 1 draw per frame when the run is ≤ 20 draws (the student must see them arrive), `ANIMATION_BATCH = 500` per frame otherwise, so 10 000 draws take ~20 frames and 100 000 ~200 (≈ 4 s measured). The loop carries its own `current` state and hands React snapshots; it never reads the previous batch back from React, so a slow render can neither stall nor duplicate a batch. « أوقف » cancels the frame; « إعادة التصفير » drops the simulation; a second « أطلق » **accumulates** onto the existing series (that is how the law of large numbers is explored: 10, then +100, then +10 000). Changing the experiment or the generator's bounds changes Ω and resets the simulation — counts without their universe would be a lie.

### 5d.4 The dataset (`datasetStatistics.js`)

- `parseValue`: decimal comma, true minus, surrounding spaces; refuses `12a`, `1.2.3`, `1/2`, inner spaces (`5 14` is not 514) and `|x| > 1e9`.
- `parseDataset(text)` → `{ values, invalid[], truncated }`. Separators: `,` `;` newline, tab, space. The comma is both separator and decimal mark, resolved by two rules: with an **explicit** separator present (`;`, newline, tab) the comma is decimal (`12 ; 15,5 ; -4`); otherwise it separates (`12, 15, 14`) unless splitting at commas breaks a token that splitting at spaces keeps whole (`12,5 14,2`). An unreadable token is **named** in `invalid`, never swallowed (§33); the rest of the series is still analysed. `MAX_DATASET_VALUES = 500`.
- `summarize(values)` → `{ n, min, max, range, mean, median }` from `statsUtils`; empty → `null` everywhere, never `NaN`.
- `distributionOf(values)`: **bars** (one per distinct value) up to `MAX_DISTINCT_BARS = 15` distinct values, **classes** beyond — the choice is the difference between a discrete and a continuous series, not a style. Classes: Sturges bounded to [5, 12], a 1-2-5 step chosen for the class *count* to land nearest the target, round bounds, last class closed on the right (same convention as `groupIntoClasses`).
- The document keeps the dataset **as typed** (`data.dataset`), so a faulty entry is still there to fix after a reload — the grapher's rule for invalid expressions (§5b.6). The field debounces 250 ms; there is no « Analyser » button.

### 5d.5 What the student can do

| Area | Interaction |
|---|---|
| Mode | two pressed-state buttons « تجربة عشوائية » / « سلسلة إحصائية » at the top of the panel (`data.mode`). |
| Experiment | native `<select>` (coin, die, two dice, random integers); for `random`, two bound fields (typed, applied when valid, `role="alert"` when not, clamped/redressed on blur — on blur a *valid* draft defers to the state, which may have swapped the bounds). Draw-count chips (`aria-pressed`) and a free field (0 or > 100 000 refused). « أطلق التجربة » ↔ « أوقف » while running; « إعادة التصفير » disabled when there is nothing to reset. |
| Reading | the bar chart (experimental frequency per outcome, value above each bar when they fit), an amber theoretical **line** across each bar when « قارن بالاحتمال النظري » is on (distinct by shape, not only colour — §13), the tracked outcome's frequency « وجه 48,12 % مقابل 50 % » (`role="status"`), the **convergence chart** (log-n axis, fixed theoretical line — the frequency comes to it) with one question and no explanation (« هل يقترب التواتر التجريبي من 50 ٪ كلّما زاد عدد التجارب؟ », §36), then the table (outcome, count, fraction + %, experimental %) — secondary to the chart (§14) and the screen-reader representation of the simulation. |
| Dataset | a `<textarea>` (LTR, monospace), the live count or the named invalid values under it, the summary grid `n · min · max · max − min · x̄ · Me` (`aria-live`), and the distribution chart with the **mean** (solid red line, `x̄ = …` below the axis) and the **median** (dashed violet line, `Me = …` above) as optional markers (`settings.showMean/showMedian`), a one-line reading « سلسلة من 7 قيمة، متوسطها الحسابي 13,86 ووسيطها 14 ». |
| Document | title, autosave (§4.1), « أعمالي », delete; « مسح الكل » (tool wording) drops the simulation and restores the example series. No PNG export in V1. A new document opens on the coin, 100 draws ready, nothing drawn, and creates nothing until the first run or edit. |

### 5d.6 State format (`probabilityState.js`, `PROBABILITY_STATS_SCHEMA_VERSION = 1`)

```js
data = {
  mode:       'experiment' | 'dataset',
  experiment: 'coin' | 'die' | 'twoDice' | 'random',
  range:      { min, max },                                    // the integer generator's bounds
  draws:      number,                                          // how many draws the next run adds (1 … 100 000)
  simulation: { experimentId, seed, total, counts, drawn, trajectory } | null,
  dataset:    string,                                          // the series AS TYPED
  settings:   { compare, showMean, showMedian },
}
```

`normalizeProbabilityStatsData` makes any stored or seeded value safe; a stored simulation is **relaid** by `fromStoredSimulation` and dropped when it does not hold up (another experiment, wrong Ω size, counts that do not sum to `total`, negative counts). `toStoredData` is what reaches the shell (serialise 300 ms after the last change, autosave 2.5 s later). A run of 100 000 draws serialises under 3 KB (tested); the server limit is 60 KB.

### 5d.7 Layout, responsiveness, RTL, accessibility, performance

- ≥ 768 px: the panel (19 rem, 22 rem from 1280 px) on the **start** edge (right in Arabic), the stage takes the rest and scrolls vertically (chart, reading, convergence, table). Below 768 px: the stage on top, the panel below (≤ 48 %, scrollable) with a collapse button. Verified at 1440, 1024 (touch) and 390 px: no horizontal overflow, 36 px chips, 44 px buttons.
- **SVG and direction.** The HTML `dir` attribute does *not* apply to SVG elements: a chart inside the RTL page inherits `direction: rtl`, which makes `text-anchor: start` run leftwards over the axis labels and `end` overflow the frame. `.sa-ml-ps__chart { direction: ltr }` is therefore mandatory (the 3D stage does the same); Arabic legends inside remain RTL runs rendered by the bidi algorithm. The e2e checks the **computed** direction, not the attribute.
- **Compact charts.** Under 768 px (`useCompactCharts`, a `matchMedia` hook) the charts switch to a 440-unit viewBox with slightly larger text, fewer value labels and coarser axis labelling, so a 360 px phone still reads the ticks; a 720-unit viewBox at that width gives 5 px labels.
- Every control is labelled; chips and mode buttons are `aria-pressed`; invalid fields are `aria-invalid` + `role="alert"` linked by `aria-describedby`; the tracked frequency is `role="status"`, the summary `aria-live`; each chart is `role="img"` with an Arabic `aria-label` carrying the count; the table and the summary are the textual representations (§31). No hover-only behaviour.
- One React render per batch (never per draw); the dataset is reparsed only after 250 ms of calm; `useMemo` on rows, summary and distribution. Timers and the animation frame are released on unmount.

### 5d.8 Extension points and limits

Prepared, not built: a biased coin / loaded die (`probabilities(params)` already takes parameters), more sample sizes, several tracked outcomes (one `trackedIndex` today), a seed control (the seed is stored; exposing it is a UI decision), PNG export. **Not in V1, by decision** (§22 of the brief): normal, binomial or Poisson laws, confidence intervals, regression, correlation, box plots, standard deviation, probability trees, conditional probability, combinatorics, tests. Future features are further modes of this instrument on the same pattern (an experiment entry, a chart, a panel block), **not** separate instruments.

### 5d.9 The physical experiment — dice and coin on a table (three.js)

> *One physical throw = one mathematical observation.* The student presses
> « ارمِ النرد », the die leaves its place, tumbles through the air, lands,
> bounces, settles — on the face the engine drew — and only then does the
> count, the chart and the table move.

**Engine.** three.js 0.186, driven directly like the 3D explorer
(`diceScene.js` is an imperative class; `DiceViewer.jsx` creates it once
and calls methods; no React Three Fiber, no physics engine — the brief's
§20). The die is a `RoundedBoxGeometry` (from `three/examples`, keeps
`BoxGeometry`'s six material groups) with six canvas-drawn pip textures;
the coin a `CylinderGeometry` whose caps carry canvas-drawn faces (« وجه »
with a ring of dots, « ظهر » with a double ring; the Arabic word is drawn
by the browser's canvas — correctly shaped — and redrawn once Cairo has
loaded). One directional light casts a real shadow on a light disc; the
camera is fixed (no camera movement, §24) and framed on resize so the
highest flight and two spread dice always fit (`VIEW_HALF_HEIGHT`,
`VIEW_HALF_WIDTH`) — the first QA screenshot had the die clipped at the
apex, which is why the target sits at mid-flight height. The scene is its
own frame (three's y-up); it is a table, not a mathematical coordinate
system, and the page's RTL does not touch it (`direction: ltr` on the
block). The block is `flex: none` in the scrolling stage — otherwise the
flex column squeezed it to 59 px on a phone.

**The result commands the face (`dieOrientation.js`, pure, unit-tested).**
Faces follow `BoxGeometry`'s group order `+x −x +y −y +z −z` →
`DIE_FACE_VALUES = [3, 4, 1, 6, 2, 5]` (a Western die: 1 up, 2 front, 3
right, opposite faces sum to 7). `dieOrientation(value, yaw)` is the
quaternion that sends the face's local normal to **up**, times any yaw
about the vertical — the free degree that varies the final pose without
changing the result. `dieTopFace(q)` is the inverse reading: the face whose
rotated normal is most upward. For the coin, `coinOrientation(headsUp,
yaw)` is a yaw, times a half-turn about a horizontal axis for « ظهر »;
`coinTopFace(q)` reads the sign of the rotated up vector. A die lands at a
random yaw; a coin lands with its **word upright** for the viewer (the
cylinder's cap UVs turn the drawing a quarter-turn, one way for the top
cap and the other for the bottom — `COIN_UPRIGHT_YAW` compensates, plus
±0.25 rad so it does not look hand-placed). The yaw never changes the side.

**The throw (`planThrow`).** From the object's current pose `from` to the
result's orientation `to`, with `Δ = to · from⁻¹`:

```
q(u) = R(spinAxis, 2π·turns·e) · R(wobbleAxis, wobble·sin(π e)) · slerp(I, Δ, e) · from,   e = easeOutCubic(flight progress)
```

All three factors are the identity at `e = 1`, so at landing `q = to`
**exactly**, whatever axis, number of turns (2–4; coin 3–5 about a
horizontal axis) and wobble were drawn — that is how motion varies while
the result never does (§7 of the brief). The position follows the phases
`THROW_PHASES` (anticipation dip → flight arc with a lateral `swing` from
the object's own place, never a teleport → landing → two decaying bounces
→ rest), 800–1 050 ms per die, 900–1 100 ms per coin; a second die starts
60–180 ms later with its own spec. `randomThrowSpec(kind, slot, rng)`
draws the variation; tests inject a seeded rng.

**Data connection — one source of truth.** `experiments.js` gained
`drawParts(rng, params)` → `{ index, parts }`, consuming exactly the same
random numbers as `draw` (tested: 300 single draws equal one batch of 300),
where `parts` is what lands on the table (the die face, the two dice, the
coin side `1 = وجه`, the integer). The engine records `simulation.last`
(stored, validated on reload, so a reopened document shows the die on the
face it stopped on). `ProbabilityStatsTool.run` has three modes:

| Mode | When | What happens |
|---|---|---|
| **Watched rolls** | ≤ `WATCH_MAX = 10` draws, a physical experiment, no reduced motion, WebGL available, « شاهد كل رمية » on (default) | for each draw: `next = runBatch(current, 1)` **first**, `dice.throw(next.last.parts)`, and **on landing** `commit(next)` — the count, chart and table move when the die stops. A roll stopped in the air is discarded (the object returns to its pose; the engine state is untouched). |
| **Batch with tumble** | more draws, physical experiment | the objects tumble (`startTumble`) while counts accumulate per frame exactly as before (§5d.3); at the end `stopTumble(current.last.parts)` — a short 420 ms throw onto the **last real draw**. |
| **Instant** | random integers, `prefers-reduced-motion`, no WebGL | the frame loop alone; on a physical experiment the die is still posed statically on `last.parts` and the panel says « الحركة مخفّفة… ». |

After every pose the tool reads `dice.topFaces()` — computed from the
meshes' actual quaternions — into `data-ml-ps-top`, next to
`data-ml-ps-result-parts` (what the engine says). The e2e asserts the two
are equal for every roll: the browser test checks the rendered
orientation, not a mirror of the model. The result line (`role="status"`,
`aria-live`) reads « 🎲 النتيجة: 4 », « 🎲 4 + 🎲 5 = 9 » (LTR), « 🪙
النتيجة: وجه », « الرمية في الهواء… » in flight, « محاكاة 1000 رمية… »
during a batch; Latin digits, as everywhere on the platform. The run button
is contextual (« اقلب القطعة », « ارمِ النرد », « ارمِ النردين », « أطلق
التجربة »), with « · 1000 رمية » when more than one draw.

**Reduced motion, no WebGL, cleanup.** `useReducedMotion` (a `matchMedia`
hook shared with the compact-charts one in `useMediaQuery.js`) skips the
animation entirely; without WebGL the viewer shows « لا يدعم هذا
المتصفح… » and `isReady()` is false, so the tool runs the instant mode.
The scene renders only while something moves; the animation frame, the
throw promise, meshes, textures and the WebGL context are released on
unmount (StrictMode's double mount replaces the scene cleanly).

**Limits (V2).** No rigid-body physics (no collisions between the two
dice, no rolling off the table); the random-integer experiment has no
object; the exported document does not carry the pose (only the face); no
sound; the coin's word is a canvas texture, so it is not selectable text.

## 6. From a lesson — integration point only (`openMathLab.js`)

`Planned` flow: *lesson → « استكشف في المختبر » → the instrument opens with
an initial state supplied by the lesson.* The API exists; **no lesson calls
it yet**, and no lesson button was added.

```js
const launch = buildMathLabLaunch({ tool: 'whiteboard', seed, title, origin: { lessonCode } });
navigate(launch.to, { state: launch.state }); // or <Link to={launch.to} state={launch.state}>
```

The seed travels in router state (never the URL), and
`readMathLabLaunch(location.state, tool.id)` ignores a launch meant for
another instrument. Each tool documents its own seed shape:

| Tool | Seed |
|---|---|
| `whiteboard` | `{ elements: ExcalidrawElementSkeleton[] }` |
| `functionGrapher` | `{ functions: [{ expression, name?, color?, visible?, domain? }], viewport?, points?: [{ functionIndex \| functionId, x }], tangent?: { enabled, functionId? \| functionIndex?, x, showDerivative?, showTriangle? } }` — e.g. `{ functions: [{ expression: '2x+3' }], viewport: { xMin: -2, xMax: 6, yMin: -1, yMax: 10 }, points: [{ functionIndex: 0, x: 1 }] }` |
| `geometry3d` | `{ shape, dimensions?, showAxes?, showGrid?, showMeasurements? }` — e.g. `{ shape: 'cone', dimensions: { radius: 3, height: 4 } }`; the camera is never seeded (default view) |
| `probabilityStats` | `{ mode?: 'experiment' \| 'dataset', experiment?: 'coin' \| 'die' \| 'twoDice' \| 'random', range?: { min, max }, draws?, dataset?: string \| values?: number[], settings?: { compare?, showMean?, showMedian? } }` — e.g. `{ experiment: 'twoDice', draws: 1000 }` or `{ mode: 'dataset', values: [12, 15, 14, 18, 10] }`; a simulation is **never** seeded (a random experiment is run, not received ready-made) |

## 7. Arabic, RTL, accessibility, performance, security

- One implementation, localised UI: every string is in the `mathlab`
  namespace; the whiteboard engine itself is in Arabic and mirrored under RTL
  (toolbar, property panel). Maths written on the board is content, not UI —
  it is never mirrored.
- Every icon-only control has `aria-label` + `title`; the canvas region is
  named (`tools.whiteboard.canvasLabel`); save status is an `aria-live`
  region, save errors a `role="alert"`; « مسح الكل » and delete use the
  notebook's modal `ConfirmDialog`. Freehand content is not described to
  screen readers — the surrounding application is.
- Excalidraw loads only on `/espace/atelier/tableau*` (own chunk, ~1.1 MB
  minified); MathLive and mafs only on `/espace/atelier/grapheur*` (own
  chunk, ~850 kB); three.js only on `/espace/atelier/geometrie-3d*` (own
  chunk, ~580 kB); the probability lab is its own ~24 kB chunk (no engine:
  inline SVG and pure functions); the Lab home is its own chunk; nothing is
  added to lesson rendering. Engine state stays out of React; listeners and timers are
  disposed on unmount. Note for dev: React StrictMode replays effects, so
  the hook resets its "unmounted" flag on every mount.
- Ownership is server-side only (`user_id` from the session), tool ids are
  allow-listed, payload size is bounded, creation is rate-limited.

## 8. Verification

| What | Where |
|---|---|
| Registry ↔ server ids, contract, labels | `features/mathlab/toolRegistry.test.js` |
| Document helpers, launch helper, whiteboard state, whiteboard import validation, file policy (incl. server parity, size boundary, board/account/combined/multi-select plans) | `mathLabDocument.test.js`, `openMathLab.test.js`, `tools/whiteboard/whiteboardState.test.js`, `tools/whiteboard/whiteboardImport.test.js`, `attachments/attachmentPolicy.test.js` |
| Grapher: parser and evaluator (the whole subset, every error code, parameters), sampler (poles, domain edges, steep lines, clamping), viewport maths, grid step, number format, state normalisation and seeds | `tools/functionGrapher/*.test.js` (104 tests) |
| Derivative maths: `derivativeAt` against closed forms, refusals (edge, pole, corner), no false corners on curved functions, tangent, `constrainAlongCurve`, f′ sampled with cuts | `tools/functionGrapher/numericalDerivative.test.js` |
| Tangent mode state (defaults, backward compatibility, studied function fallback, derivative colour never colliding) | `grapherState.test.js` |
| 3D geometry: volume, area, slant and face areas against closed forms (cube 2, cuboid 2×3×4, sphere 2, cylinder 2/5, cone 3/4 → l = 5), formulas and substitution; shapes and parameters, clamping, carry-over between solids, camera and document normalisation, seeds | `tools/geometry3d/geometryCalculations.test.js`, `geometryState.test.js` |
| Probability lab maths: every experiment's law (Ω non-empty, Σp = 1, p > 0), coin 1/2, die 1/6 per face, two dice counted on 36 pairs (Σ = 1, P(7) = 6/36, P(2) = P(12) = 1/36, symmetry about 7), random integers (uniform, bounds, redress, span cap); the engine (counts only, seed reproducibility, batches chain into one series, bounded trajectory, LLN property over ten seeds, empty state without NaN, comparison rows, stored ↔ restored round trip and every rejection) | `tools/probabilityStats/probabilityCalculations.test.js` |
| Physical experiment: die faces (1–6 once each, opposites sum to 7, Western layout), `dieOrientation` → `dieTopFace` for every value × 12 yaws (normal exactly up), reading any orientation, coin both sides × 8 yaws; `planThrow` from every face to every face × seeded motion: starts on `from`, ends on `to` within 1e-9, correct face from the landing phase on, really turns (> 2 full turns, continuous path), trajectory phases (dip, apex, landing, two decaying bounces, rest, leaves from its own place and swings), coin flips × 24, spec variation ranges; engine `last`/`parts` for every experiment, stepwise = batch, stored ↔ restored `last` | `tools/probabilityStats/dieOrientation.test.js`, `probabilityCalculations.test.js` |
| Dataset: value parsing (decimal comma, true minus, refusals incl. inner spaces and too-large), separators and the comma ambiguity rule, invalid tokens named not swallowed, 500-value cap, `[10,20,30]` → 20/20/20, `[10,20,30,40]` → 25/25, unsorted input, empty → null never NaN, bars vs classes threshold, every value counted once (max included), constant series, text round trip; document state (defaults, redress, faulty text kept, simulation relaid or rejected, counts-only storage, seeds never carry a simulation) | `tools/probabilityStats/datasetStatistics.test.js` |
| API: ownership, 404 for others, unknown tool, size, every tool id (incl. `probabilityStats` and its 60 KB limit), immutability of `tool`, visitor | `apps/api/tests/Feature/MathLabDocumentFlowTest.php` |
| Browser, whiteboard: navigation, refresh, back/forward, every tool, undo/redo, zoom, pan, grid, export, clear, autosave (and that an untouched board creates nothing), library import (valid, image, broken JSON, scene, re-import, persistence), library ⋮ menu inside the viewport, reopen, delete, RTL, ten viewports | `apps/web/e2e/mathlab.mjs` (`node apps/web/e2e/mathlab.mjs [shots-dir]`, dev servers on 5173/8000, QA student) |
| Browser, grapher: home card, first run, typing in MathLive, invalid expressions, `1/x`, `√x`, `tan`, add/example/colour/hide/delete/limit, point (tap, type x, drag), tangent mode (toggle, cue, typed x, drag with mid-gesture values, studied function switch, f′ curve and B, slider, reload, off = unchanged grapher, touch drag on mobile), zoom/pan/wheel/keyboard/reset, grid step, readout, grid, export, title, reload, « أعمالي », RTL, clear, visitor, tablet and mobile | `apps/web/e2e/mathlab-grapher.mjs` (same invocation) |
| Browser, 3D geometry: home card, first run (cube 2, V = 8, A = 24, three labels, no document), orbit by drag, wheel, buttons, keyboard, reset (view restored, solid untouched), camera persisted, face click and release, typed and slider dimensions in sync, invalid values (−4, 50) refused then clamped, decimal comma, every solid with the reference values, carry-over, options (labels and axes hidden, shell grid ↔ panel grid), PNG export, title, reload, « أعمالي », RTL (panel right, Cairo, KaTeX LTR), whiteboard and grapher still open, visitor, tablet and mobile with **real touch events** (one-finger orbit, pinch, no page scroll, collapse) — 69 checks | `apps/web/e2e/mathlab-geometry3d.mjs` (same invocation) |
| Browser, probability lab: home card and no more « قريبًا » chips for statistics/probability, first run (coin, 100 ready, nothing drawn, no document), coin 10 → « أوقف » during the animation, counts sum, theoretical line, document born on first run, a second run **accumulates** (1 010), convergence chart and question, 100 000 more draws in batches under 15 s and within 1 % of 50 %, stop, reset; die (six bars, 1/6 and 16,67 % in the table), compare off/on; two dice (reset on experiment change, eleven sums, 7 ≫ 2 and 12, 6/36 and 1/36); random integers (bounds shown, 1–6, « abc » refused then reverted, min > max redressed, bounds change resets); custom draws (0 refused, 250); dataset (example n = 7 / Me = 14 / range 8, `[10,20,30]` → 20/20/20 with no button, mean and median lines, bars, `[10,20,30,40]` → 25/25, « abc » named and the other three still counted, `12,5 ; 14,2 ; 9`, empty → dashes, mean checkbox hides its line, 80 dispersed values → classes); persistence (reload restores mode, text, experiment, bounds and 250 draws; the server holds counts, not draws; mode switch saved; « أعمالي »; « مسح الكل » with the tool's wording); RTL (panel right, Cairo, chart **computed** LTR, total legend inside the frame), no horizontal overflow, visitor; tablet and mobile (no overflow, 1 000 draws by tap, chart fits its column, 36 px chips / 44 px button, collapse grows the chart, dataset field wide); **the table** (die posed, contextual button, rolling until all six faces appeared with, for every roll, face read on the object = displayed result = count +1 and 0,7–1,8 s per roll; a roll stopped in the air not counted; a 1 000 batch tumbling then posed on the last draw in < 6 s; « شاهد كل رمية » off → 10 in a batch; coin until both sides with the word matching the side; two dice × 4 with real faces = displayed faces, sum, count of the sum +1; reduced motion → result in < 400 ms, counted, die posed; tablet and mobile: 3D table visible and inside the screen, a roll by tap consistent; the integer generator has no table) — 98 checks | `apps/web/e2e/mathlab-probability.mjs` (same invocation; `QA_BASE` overrides the web origin when 5173 is taken) |

## 9. Limitations (V1)

- No sharing, no collaboration, no folders — « أعمالي » is a flat,
  newest-first list; no undo/redo in the grapher (mistakes are cheap to
  redo; « مسح الكل » is confirmed).
- Whiteboard: no equation objects (§5.6); no PNG/SVG export beyond the
  shell's PNG and Excalidraw's own « save as image ».
- Grapher: one inspection point; no parameters/sliders, intersections,
  tables of values, domain editor, SVG export or legend in the exported
  image (§5b.9 for what is prepared); numerical limits in §5b.4.
- Tangent mode: one studied function at a time; no symbolic f′ formula,
  no secant, second derivative or integral; numerical limits in §5b.10.
- 3D geometry: one solid per document; faces can be designated, not edges;
  generic units only; no nets, sections or transformations (§5c.7); the
  exported PNG has no labels.
- Probability & statistics: four experiments, all fair (no biased coin, no
  loaded die); one dataset of ≤ 500 values and only n / min / max / range /
  mean / median (no quartiles, box plot, standard deviation or grouped
  editor); no PNG export of the charts; the seed is internal (§5d.8); the
  physical table has no rigid-body physics and no object for the integer
  generator (§5d.9).
- Excalidraw's fonts carry no Arabic glyphs: Arabic text elements render in
  the browser's fallback font on the canvas (legible, not Cairo).
- A document is one whiteboard; there are no pages/frames in the model.
