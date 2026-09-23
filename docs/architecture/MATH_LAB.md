# Le مختبر الرياضيات (Math Lab)

> **Authoritative** for the Math Lab: its information architecture, the tool
> contract and registry, the document model and persistence, the whiteboard
> (السبّورة) V1, the function grapher (راسم الدوال) V1 with its optional
> tangent / derivative mode, the 3D geometry explorer (الهندسة ثلاثية الأبعاد)
> V1, the probability & statistics lab (الاحتمالات والإحصاء) V1, the
> trigonometry & unit circle lab (مختبر المثلثات) V1, the sequences &
> recurrences lab (مختبر المتتاليات) V1, the conic sections & analytic
> geometry lab (مختبر المقاطع المخروطية) V1, the logic & proof lab
> (مختبر المنطق والبرهان) V1 — including the proposition staircase for induction
> proofs over recurrent and auxiliary sequences (§5n.6ter) — and the
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
| **السبّورة** (whiteboard) — `whiteboard` · **راسم الدوال** (function grapher, with the optional « المماس » tangent/derivative mode) — `functionGrapher` · **الهندسة ثلاثية الأبعاد** (3D geometry explorer) — `geometry3d` · **الاحتمالات والإحصاء** (probability & statistics lab) — `probabilityStats` · **مختبر الجبر** (algebra & equation lab, equations *and* inequalities) — `algebra` · **مختبر الأشعة** (vectors & coordinate geometry lab) — `vectors` · **مختبر المثلثات** (trigonometry & unit circle lab) — `trigonometry` · **مختبر المتتاليات** (sequences & recurrences lab) — `sequences` · **مختبر التحويلات** (transformations & dynamic geometry lab) — `transformations` · **مختبر المقاطع المخروطية** (conic sections & analytic geometry lab) — `conics` · **مختبر الأعداد والحساب** (number & arithmetic lab) — `numberLab` · **مختبر التحليل والدوال** (analysis & calculus lab) — `analysis` · **مختبر المنطق والبرهان** (logic & proof lab) — `logic` | measurement |

The two announced chips « الإحصاء » and « الاحتمالات » were retired together
when `probabilityStats` shipped: one instrument delivers both, because the
law of large numbers is the bridge between them and splitting it in two
tools would have cut that bridge.

The announced chip « الأشعة » left the list when `vectors` shipped: the
instrument delivers exactly what the chip promised — and it kept the chip's
own name and icon (`MoveUpRight`), because the curriculum's word is الشعاع
(§5f.1).

The announced chip « الدائرة المثلثية » left the list when `trigonometry`
shipped — but the instrument is **not** named after it. The chip promised the
unit circle, which is lycée material; the 4AM programme asks for
**النسب المثلثية في مثلث قائم** (`ALGERIA_4AM_CURRICULUM` §4.2). The
instrument is therefore **مختبر المثلثات**, it *opens* on the right triangle,
and the unit circle is one click away (§5g.1).

The announced chip « الهندسة » left the list when `transformations`
shipped: the instrument delivers what the chip promised — a plane where
figures are built, dragged, measured and transformed — and its `tools.geometry.name`
string left `mathlab.json` with it. A dedicated Euclidean-construction tool
(compass, straightedge, loci) would be a different instrument, and §5j.14
says what this one deliberately does not do.

The announced chip « المستقيم المدرّج » (`numberLine`) left the list when
`numberLab` shipped. It had stayed announced while `algebra` drew a number
line, because there the line is the *reading of an inequality's solution
set*, bound to the equation being manipulated — placing, comparing and
ordering arbitrary numbers, fractions and decimals was a different tool.
That tool is now built, and the promised line is one of its thirteen modes
(§5l.5): a whole instrument for a single line would have kept the promise
too small. `algebra/NumberLine.jsx` stays where it is, reading inequalities.

« القياس » (`measurement`) stays announced: measuring magnitudes is a
different instrument, not a mode of the number lab (§5l.1).

The announced instruments exist only as a name and an icon in
`PLANNED_MATH_LAB_TOOLS`, rendered as disabled « قريبًا » chips on the home
page. They have no route, no component, no placeholder screen.

## 2. Information architecture and routes

All under the authenticated student shell (`StudentLayout`, `ProtectedRoute
allowedRoles={['student']}`), French route slugs like the rest of `/espace`:

| Route | Page | Role |
|---|---|---|
| `/espace/atelier` | `MathLabHome` | the instruments, the announced ones, and « أعمالي » — the personal **workspace** (§5i) |
| `/espace/atelier/:toolSlug` | `MathLabToolPage` | a **new** document in that instrument (`tableau`, `grapheur`, `geometrie-3d`, `probabilites-statistiques`, `algebre`, `vecteurs`, `trigonometrie`, `suites`, `transformations`, `coniques`, `nombres`, `logique`) |
| `/espace/atelier/:toolSlug/:documentId` | `MathLabToolPage` | a saved document |

`toolSlug` is resolved against the registry (`getMathLabToolBySlug`); an
unknown slug redirects to the Lab home of the current workspace. A document
that is not the student's (or does not exist) renders « هذا العمل غير موجود أو
ليس لك » — the API answers 404 either way, never 403.

**The teacher has the same Lab** under `/enseignant/atelier[/:toolSlug[/:documentId]]`
(same pages, same registry, own documents — the API resolves everything from
the authenticated account). Links are built from the reader's workspace:
`mathLabBasePath(workspaceBase)` and `mathLabToolPath(tool, id, root)`
(`features/mathlab/mathLabDocument.js`), with `useWorkspaceBase()` from
`features/learning/learningViewer.js`; `MATH_LAB_BASE_PATH` (`/espace/atelier`)
remains the default. Entry « المختبر » in `data/teacherNavigation.js`.

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
├── home/                  MathLabHome · ToolCard
├── work/                  « أعمالي » — the workspace (§5i): MyWorkSpace · WorkCard · WorkPreview ·
│                          WorkFilterPanel · NewWorkMenu · RenameDialog · workFilters.js · mathlabWork.css
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
    └── vectors/        index.js (definition) · VectorsTool.jsx · vectorMath.js · vectorScene.js · vectorState.js ·
                           analysis.js · vectorFormat.js · experiments.js · VectorPlane.jsx (the grapher's plane modules) ·
                           VectorSceneLayer.jsx · VectorArrow.jsx · VectorHandle.jsx · VectorConstructions.jsx ·
                           VectorInspector.jsx · VectorControls.jsx · vectors.css
    └── conics/         index.js (definition) · ConicsTool.jsx · conicMath.js · conicParser.js · intersections.js ·
                           sceneAnalysis.js · conicState.js · practice.js · summarize.js ·
                           ConicPlane.jsx (the grapher's plane modules) · ConicSceneLayer.jsx · DragHandle.jsx ·
                           ConicControls.jsx · ConicInspector.jsx · PracticePanel.jsx · conics.css
    └── trigonometry/   index.js (definition) · TrigonometryTool.jsx · trigMath.js · exactValues.js · geometry.js ·
                           trigState.js · layers.js · presets.js · practice.js · trigFormat.js ·
                           UnitCircleStage.jsx · TriangleStage.jsx · TrigInspector.jsx · TrigControls.jsx ·
                           PracticePanel.jsx · trigonometry.css
    └── sequences/      index.js (definition) · SequencesTool.jsx · sequenceMath.js · sequenceExpression.js ·
                           sequenceModel.js · sequenceFormat.js · sequenceState.js · layers.js · presets.js ·
                           practice.js · SequencePlane.jsx (the grapher's camera modules) · SequenceLayer.jsx ·
                           CobwebLayer.jsx · TableExplorer.jsx · SequenceInspector.jsx (+ SequenceDefinitionCard, sticky) · SequenceControls.jsx ·
                           PracticePanel.jsx · sequences.css
    └── transformations/ index.js (definition) · TransformationsTool.jsx · transformMath.js (the affine engine) ·
                           transformModel.js (step → matrix, stack, invariants, formulas) · transformState.js ·
                           practice.js (challenges, puzzles, guided experiments, presets, patterns) ·
                           TransformPlane.jsx (the grapher's plane modules + frame()) · SceneLayer.jsx · DragHandle.jsx ·
                           TransformInspector.jsx · StepStack.jsx · TransformControls.jsx · PracticePanel.jsx ·
                           summarize.js · transformations.css
    └── numberLab/      index.js (definition) · NumberLabTool.jsx · fraction.js · numberTheory.js · proportion.js ·
                           numberValue.js · numberState.js · practice.js · summarize.js ·
                           NumberLineStage.jsx (the lab's one number line) · FractionShape.jsx · ValueInput.jsx · SendToMenu.jsx ·
                           ExplorerMode.jsx · PlaceValueMode.jsx · LineMode.jsx · FractionsMode.jsx · DecimalsMode.jsx ·
                           PercentMode.jsx · ProportionMode.jsx · DivisibilityMode.jsx · PrimesMode.jsx · FactorsMode.jsx ·
                           GcdLcmMode.jsx · RoundingMode.jsx · OperationsMode.jsx · PracticePanel.jsx · numberLab.css
    symbolic/           index.js (the ONLY door to Nerdamer) · symbolicEngine.js ·
                           symbolicSyntax.js (AST → Nerdamer, never a regex)
    └── analysis/       index.js (definition) · AnalysisTool.jsx · AnalysisPlane.jsx · SceneLayer.jsx ·
                           PointHandle.jsx · AnalysisControls.jsx · AnalysisInspector.jsx · LiveReadout.jsx ·
                           PracticePanel.jsx · buildScene.js · analysisMath.js · symbolicDerivative.js ·
                           expressionPrinter.js · analysisFormat.js · analysisState.js · layers.js ·
                           presets.js · practice.js · variationTable.js · VariationTable.jsx ·
                           MathField.jsx · mathFieldSetup.js · summarize.js · analysis.css
    └── logic/          index.js (definition) · LogicLabTool.jsx · logicMath.js (les connecteurs, les formes,
                           De Morgan, les quantificateurs, les régions de vérité) · proofMath.js (le GRAPHE d'une preuve) ·
                           presets.js (les énoncés VÉRIFIÉS) · logicState.js · logicFormat.js · dictionary.js ·
                           practice.js · summarize.js · LogicPieces.jsx (notation, pastilles, table de vérité,
                           diagramme d'ensembles, droite de vérité) · StatementsArea.jsx · ConnectorsArea.jsx ·
                           ImplicationArea.jsx · EquivalenceArea.jsx · CounterexampleArea.jsx · ConditionsArea.jsx ·
                           QuantifiersArea.jsx · NegationArea.jsx · ProofArea.jsx · FallacyArea.jsx ·
                           InductionArea.jsx · InductionStairs.jsx (l'escalier, nommé par `name`) ·
                           StairsClimb.jsx (l'escalier des RÈGLES) · inductionLab.js (son moteur : appelle
                           celui des متتاليات, jamais un second analyseur) ·
                           RecurrenceClimb.jsx (l'escalier des PROPOSITIONS — §5n.6ter) ·
                           inductionModel.js (suites nommées, dépendances, propositions) ·
                           inductionStep.js (l'hérédité : des maillons VÉRIFIÉS, pas un prouveur) ·
                           inductionExercises.js (les exercices du BAC, vérifiés par les tests) ·
                           DictionaryPanel.jsx · PracticePanel.jsx · logic.css
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
| `summarize(data)` | **optional**, pure. The tool's own summary of its state — a few hundred bytes that let « أعمالي » draw a real preview and search the content **without loading the instrument** (§5i.2). A tool without it is not at fault: its card falls back to its icon. |

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
5. A `summarize(data)` beside its state module (`tools/<name>/summarize.js`),
   returning a `MathLabSummary` — and, if its preview needs a shape none of
   the eight already cover, one drawing in `work/WorkPreview.jsx` keyed by
   that `kind` (§5i.2). `summaries.test.js` fails if a shipped instrument has
   no `summarize`, if its summary exceeds the server's 2 KB, or if it throws
   on a malformed state.

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
| `data_bytes` | measured on every write; refused above `MathLabTools::maxBytes` (whiteboard: 2 MB, function grapher: 100 KB, 3D geometry: 20 KB, probability & statistics: 60 KB, algebra: 20 KB, vectors: 120 KB — `MAX_HISTORY × scene`, §5f.5 — trigonometry: 8 KB, §5g.8 — sequences: 8 KB, §5h.8 — transformations: 60 KB, §5j.9 — conics: 60 KB, §5k.9 — numberLab: 20 KB, §5l.10 — analysis: 8 KB, §5m.7 — logic: 8 KB, §5n.10) |
| `summary` (json, nullable) | the **tool's own summary** of `data` (§5i.2), sent with every save, returned **in the list**. Opaque to the server like `data`; above `MathLabDocumentService::MAX_SUMMARY_BYTES` (2 KB) it is stored as `null` rather than refusing the save — a thumbnail never costs a student their work. `null` on every document written before this column existed. |
| `is_favorite` (bool) | the student's star (§5i.5). `false` by default, so no existing row is invalidated. |

API (`routes/api.php`, inside the `auth:sanctum` + `account.active` +
`email.verified` group), controller `MathLabDocumentController`, domain
`MathLabDocumentService`:

| Verb | Route | Notes |
|---|---|---|
| GET | `/math-lab/documents[?tool=]` | mine only, newest first, **without** `data` — **with** `summary` and `isFavorite`, which is what makes one request enough for the whole workspace (§5i.1) |
| POST | `/math-lab/documents` | `throttle:30,1`; accepts an optional `summary`; 422 `math_lab_unknown_tool` / `math_lab_document_too_large` |
| GET | `/math-lab/documents/{id}` | with `data`; 404 if not mine |
| PATCH | `/math-lab/documents/{id}` | `title`, `data`, `schemaVersion`, `summary`, `isFavorite` only — never `tool`, never `user_id`; response without `data` |
| POST | `/math-lab/documents/{id}/duplicate` | a copy of **my** document: same tool, same state, same summary, optional `title`, **never** the original's star; 404 if not mine |
| POST | `/math-lab/documents/bulk` | `{ids: int[] (1…200), action: 'delete'｜'favorite'｜'unfavorite'}`. Ownership is enforced by the **query** (`where user_id`), not by the list: an id that is not mine simply does nothing. Returns `count`, the number actually touched. Declared **before** `{id}`, which only matches numbers. |
| DELETE | `/math-lab/documents/{id}` | deletes the row; its attachment rows cascade and `MathLabFileService::deleteAllFor` removes their bytes from disk — the same cleanup runs for each document of a bulk delete |

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
- **The rewritten URL stays in the READER's workspace.** When a new document
  is born, `useMathLabDocument` rewrites the address with its id. It built
  that address from `MATH_LAB_BASE_PATH` (`/espace/atelier`) in hard code, so
  a **teacher** working under `/enseignant/atelier/…` was pushed into the
  student space ~2.5 s after their first change; `/espace` admits only the
  `student` role, so `ProtectedRoute` → `/login` → `HomeRedirect` bounced them
  to the teacher home and the instrument closed itself, taking the work in
  progress with it. The root is now read with `useWorkspaceBase()` and passed
  to `mathLabToolPath`, exactly as the Lab home and `MathLabToolPage` already
  did. This was a defect of the **shared shell**, so it affected all eight
  instruments; `mathLabDocument.test.js` now fails if the call loses its root
  (reported in use, fixed 2026-09-23).
- **Hooks in `MathLabToolPage`.** The lab's home path depends on the
  workspace (student or teacher) and is read with `useWorkspaceBase()` — in
  the **body** of `ToolPage`, into `labHome`, never inside the JSX of the
  error branch. A hook called from a conditionally-rendered branch changes
  the *number* of hooks between renders, and React then throws « Rendered
  more hooks than during the previous render » the moment a document fails
  to load, taking the whole instrument down with it (caught by the grapher
  e2e, fixed 2026-09-22).

Deployment: the migrations `2026_09_24_000001_create_math_lab_documents_table`
and `2026_09_26_000001_add_summary_and_favorite_to_math_lab_documents` must
run in production, as must `2026_09_25_000001_create_math_lab_files_table`.
The deploy workflow **never** applies migrations by design
(`.github/workflows/deploy.yml` § "Laravel post-deployment"), so the schema
changes are applied by hand as reviewed SQL in phpMyAdmin, in this order:
`docs/deployment/HOSTINGER_CAHIER_MATHLAB_MIGRATION.sql` (creates both Math Lab
tables) then `docs/deployment/HOSTINGER_MATHLAB_WORK_MIGRATION.sql` (adds the
workshop's two columns). Both are generated by `migrate --pretend` and carry a
read-only verification block; the full file order for a database catching up
several releases is in `docs/deployment/DZ_FIRST_DEPLOYMENT.md`. Until the
first is run, `GET /math-lab/documents` **returns 500** (the table does not
exist); until the second is run, **saving a document fails** with an
unknown-column error. Nothing else on the platform is affected — this was
observed in production on 2026-09-23. The second migration is **additive
and safe**: both columns are nullable or defaulted, existing documents keep
working untouched, and their cards simply show the fallback preview until
the next time the student saves them.

## 4b. The symbolic engine (`features/mathlab/symbolic/`)

> **Authoritative** for symbolic computation on the platform: the Nerdamer
> facade, its guards, and the rule that its answers are verified before they
> are shown.

Nerdamer (MIT, no dependencies, ~1.8 MB unpacked) is the platform's
computer-algebra engine. **Nothing imports it directly.** Everything goes
through `symbolic/index.js`, which exposes one result shape:

```
{ ok: true,  text, latex, value?, kind? }
{ ok: false, reason: 'unsupported'|'timeout'|'unknown'|'invalid'|'unready'|'contradicted' }
```

Capabilities today: `limitOf` · `verifiedLimitAtInfinity` · `derivativeOf` ·
`simplifyExpression` · `factorExpression` · `expandExpression` ·
`solveEquation` · `areEquivalent` · `antiderivativeOf`. Adding one is a
function in `symbolicEngine.js` with the same shape and the same guard;
nothing else changes.

### 4b.1 Why a facade and not a direct import

Three behaviours measured on version 1.1.13, each of which would reach a
student if the library were called directly:

- **It can fail to return.** `limit(abs(x)/x, x, 0)` ran for minutes before
  being killed. In a browser that freezes the tab. Every call goes through
  `guard`, which measures elapsed time and **quarantines** the offending
  expression so a slider drag cannot relaunch it every frame. JavaScript is
  single-threaded, so this cannot abort a runaway call — it prevents
  accumulation, and it is why **no display ever depends on the engine**: the
  numerical path always has an answer, and the symbolic one only enriches it.
- **It answers with the question.** `limit(x*sin(1/x), x, 0)` returns
  `limit(sin(x^(-1))*x^(-1),x,0)`. A result still containing the operation's
  name is an admission, not an answer, and is converted to `ok: false`.
- **Its conventions are not the programme's.** `limit(1/x, x, 0)` returns
  `Infinity` — a defensible convention (extended real line), but not the one
  the Algerian textbook teaches, where that limit does not exist because the
  two sides diverge oppositely. The facade returns the raw result and lets
  `analysisMath.js` decide the pedagogical reading. **The engine informs; it
  does not rule on the curriculum's behalf.**

Loading is lazy: a student who opens the whiteboard never downloads it.

### 4b.2 Syntax: through the AST, never through `replace`

`symbolicSyntax.js` translates our LaTeX/ASCII into Nerdamer's dialect by
**parsing to the grapher's AST and printing that**. A regex on
`\frac{a}{b}` would work on simple cases and silently corrupt
`\frac{\frac{1}{2}}{x}` — a wrong expression that still parses, which is
exactly the failure §35 forbids. One tree, three printers: text for the
student, LaTeX for MathLive, Nerdamer for the engine.

### 4b.3 Limits at infinity are verified before they are believed

Measured against hand-computed truth on eleven school functions × two bounds:
**Nerdamer is wrong 5 times out of 22.** It returns `+∞` for `2x+1` as
x → −∞, `−∞` for `x³−3x` as x → +∞ (wrong at *both* bounds), and
`e^Infinity` instead of `+∞`. Indeterminate `∞ − ∞` forms stop it, and the
factoring fallback that rescues `x²−4x+3` breaks `x³−3x`.

Writing those into a variation table would teach a student an error they have
no way to contest. So `verifiedLimitAtInfinity` asks Nerdamer, then compares
its answer with f's actual behaviour sampled far out:

- they agree → **Nerdamer's answer is returned**, in its exact form (`2`,
  `1/3`, `+∞`);
- they contradict → `ok: false`, and the caller falls back.

Measured after verification: **17 exact answers, 7 honest blanks, 0 wrong.**
That is the contract the tests fix.

Two repairs are applied before giving up: the limit at −∞ is asked as
`lim(t→+∞) f(−t)` (an identity — Nerdamer computes |x| → ∞ without
direction), and a failed limit is retried on the **factored** expression,
which unblocks the `∞ − ∞` of `x²−4x+3`.

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

## 5e. مختبر الجبر — Algebra & Equation Lab V1

> *Touch the equation and feel it stay true.* A student meets `2x + 3 = 11`
> — **not** its answer — chooses an operation, applies it to **both sides at
> once**, and watches the equation simplify under their hands until `x = 4`.
> The balance never lies: whatever is done to one pan is done to the other.
> It is a manipulation instrument, not a solver: the answer is a secondary
> command (« إظهار الحل »), never the opening screen.

### 5e.1 Engine choices

| Layer | Choice | Why |
|---|---|---|
| Expression parsing | **reuses the grapher's `expressionParser.js`** | One grammar for the whole platform, never two (§27 of the brief). It already reads MathLive LaTeX *and* hand-typed ASCII, already returns error **codes** rather than exceptions, and already has 104 tests. The Algebra Lab adds a *relation* layer above it (`splitRelation`), not a second parser. |
| Arithmetic | **exact rationals** — `rational.js` (`{n, d}`, reduced, sign on the numerator) | A school equation resolves exactly or not at all: `x/3 = 5` gives 15 and `3x = 1` gives ⅓, which a student must read as « 1/3 », never « 0,3333333333 ». Floating point is used only to *verify* a substitution and to place a point on the number line. No BigInt: coefficients stay tiny, and a guard (`LIMIT = 1e12`) **refuses** an operation rather than returning a silently wrong result. |
| Algebra | **linear normal form** — `linearForm.js` (`a·x + b`) | Everything this lab manipulates is first-degree; reducing the AST to a coefficient pair makes simplification, classification and solving trivial and total. It is *not* a CAS: `x²`, `x·x`, `3/x` and `sin(x)` are **refused** with `nonLinear`, which is a curriculum boundary, not a missing feature (§41). |
| Rendering | **KaTeX via `MathText`** | The platform-wide renderer, already wrapping every expression in `dir="ltr"` + bidi isolation. No renderer was added. MathLive is *not* used here: the equation field takes one short line of text and a virtual keyboard would cost 800 kB for `2x + 3 = 11` (extension point, §5e.8). |
| Balance & number line | **our own inline SVG** | The repo rule for anything a student reads: drawn in code, parameterised by props, Arabic as DOM text (`CLAUDE.md`). **No dependency was added**; the tool is a ~22 kB chunk. |

### 5e.2 The pipeline

```
saisie (LaTeX ou ASCII) ─▶ splitRelation ─▶ « gauche RELATION droite »
                                              │
       expressionParser.parseExpression ◀──────┘  (une seule grammaire)
                     │
                     ▼  AST {num, var, bin, neg, call}
              toLinearForm ─▶ { a, b }  rationnels exacts      (refus si non linéaire)
                     │
                     ▼
        equation { left, right, relation }
                     │
        applyOperation (LES DEUX membres) ─▶ equation′ + flipped
                     │
              classify ─▶ solved | unique | none | infinite
                     │
                     ▼
        balance SVG · droite graduée · historique · vérification
```

### 5e.3 The relation is the whole point (`equation.js`)

An equation here is `{ left: {a,b}, right: {a,b}, relation }` with
`relation ∈ '=' '<' '>' '<=' '>='`. **Inequalities are not a separate
mode**: same object, same operations, one single rule apart —
multiplying or dividing by a negative **reverses the sense**.

```
−2x > 6   ÷(−2)   →   x < −3
```

`applyOperation` holds that rule in **one place** for all four operations
and returns `flipped: true`, which the history marks on the step that
caused it (« انعكس اتجاه المتراجحة ») — the classic mistake of the chapter
deserves a word. No component has to remember it.

Written forms accepted for a relation: `=`, `<`, `>`, `<=`, `>=`, `≤`, `≥`,
`\leq`, `\geq`, `\le`, `\ge`, `\leqslant`, `\geqslant`. Splitting ignores
what is inside LaTeX braces (`\frac{1}{2}` carries no relation) and refuses
a double relation (`1 < x < 5` is not V1).

`classify` says what the **current** state means without transforming it:

| kind | Meaning | Example |
|---|---|---|
| `solved` | the unknown is isolated | `x = 4`, `x < −3` |
| `unique` | a solution exists, not yet isolated | `2x = 8` |
| `none` | no solution — the unknown vanished on a false relation | `2x + 3 = 2x + 5` → `0 = 2` |
| `infinite` | always true | `2x + 3 = 2x + 3` |

`none` and `infinite` display their Arabic sentence (« لا يوجد حل », « عدد
لا نهائي من الحلول ») and **never a fake number** (§26).

### 5e.4 What the student can do

| Area | Interaction |
|---|---|
| Equation | a text field (LTR, JetBrains Mono so digits stay **Latin**, not ١١) + « استكشاف ». Accepts `2x+3=11`, `5 - 2x = 11`, `x/3 = 5`, `(1/2)x = 4`, `-2x + 5 = 11`, `2x ≤ 10` and MathLive-style LaTeX. An invalid entry is **refused with a reason** (`role="alert"`) and the previous equation stays on screen. |
| Generator | a level `<select>` (1: `x + a = b`, 2: `ax = b`, 3: `ax + b = c`, 4: `ax + b = cx + d`) + « معادلة جديدة ». Equations are built **from their solution**, so they always fall out exactly — never rejection sampling, never a surprise fraction. Guards: integer solution in [−10, 10], no zero coefficient, no coefficient 1 at levels 2–3 (nothing to divide), `a ≠ c` at level 4 (the unknown must survive), `x = 0` only ~1 in 10. |
| Operations | four buttons (الجمع، الطرح، الضرب، القسمة) + a value field, applied to **both sides** — the UI offers no way to touch one side. Up to three **suggestions** (`− 3`, `÷ 2`) propose what advances *this* equation, in the order a teacher would write them; the student keeps the initiative. Multiplying by 0 and dividing by 0 are refused with a reason. |
| Balance | two pans, a beam. An **equality keeps the beam level whatever the pans hold** — that is the promise being taught; an inequality tips to the heavy side, and reversing the sense visibly flips it. `x` is a violet token, a constant a blue one, a negative red; beyond 8 tokens the drawing stops counting and writes the value (seventeen squares no longer read). Tokens shrink to fit rather than spill out of the pan. |
| Number line | for inequalities only: an **open** circle for an excluded bound (`<`, `>`), **filled** for an included one (`≤`, `≥`) — the confusion of the chapter, visible at a glance — plus the solution ray and arrow. Drag to pan, wheel/±/⌖ to zoom and recentre, arrows/+/−/0 at the keyboard. It shows the graduation but **not the bound** until the unknown is isolated or « إظهار الحل » is pressed (§5e.6). |
| Solution | **nothing at opening** (§8 of the brief). « إظهار الحل » reveals it; once isolated it shows by itself. « التحقق » substitutes the value into the **original** equation and displays `2 × 4 + 3 = 11` then `11 = 11` with a verdict — a solution is the value that makes the relation true, not the output of a recipe. |
| History | one step per operation, each showing the operation (`− 3` « على الطرفين ») then its result. Clicking a step **returns to it**; steps ahead grey out. It is the undo control as much as its trace. |
| تراجع / إعادة | a cursor into that step list. A new operation after going back **cuts the abandoned branch**. An operation with no effect (`+ 0`, `× 1`) is not pushed — the history must tell a story. |
| Parameters | an optional `a·x + b = c` panel: three sliders, the equation and the solution following live, and `x = (c − b)/a` shown **below** the experiment, never as the way in (§25). `a = 0` is skipped — without an unknown there is nothing to explore. |
| Document | title, autosave (§4.1), « أعمالي », delete; « مسح الكل » (tool wording) restores a fresh equation. No PNG export in V1. A new document opens on `2x + 3 = 11` and **creates nothing** until the first change. |

### 5e.5 State format (`algebraState.js`, `ALGEBRA_SCHEMA_VERSION = 1`)

```js
data = {
  source:       '2x + 3 = 11',                        // la saisie, telle qu'écrite
  steps:        [ { equation, operation | null, flipped } , … ],
  cursor:       number,                               // le pas AFFICHÉ — d'où viennent تراجع / إعادة
  showSolution: boolean,
  parameters:   { a, b, c } | null,                   // le panneau ax + b = c, s'il est ouvert
  numberLine:   { center, span },
}
```

The document stores **not a current state but a path**: `steps[0]` is the
starting equation (`operation: null`), each operation pushes a step, and the
history of §21 and the undo of §22 are therefore the *same object*. A
rational is stored `{n, d}` — plain JSON, rereadable without code.
`MAX_STEPS = 60` keeps a document under the server's 20 KB cap (a 70-step
run serialises under 20 kB, tested). `normalizeAlgebraData` makes any stored
or seeded value safe and **truncates a history at the first unreadable
step** rather than leaving a hole that would no longer tell a story.

### 5e.6 Pedagogy the code enforces

Three rules are structural, not stylistic, and a future change should know
it is changing them:

1. **The answer is never the opening screen** (§8). `showSolution` starts
   false, `createAlgebraData` never seeds it true, and the number line
   withholds the bound until the unknown is isolated — otherwise the
   inequality would hand over its answer while the equation withheld it.
2. **An operation cannot touch one side.** `applyOperation` takes an
   equation and returns an equation; there is no code path that modifies a
   single member.
3. **No fake number.** `none` and `infinite` have their own sentence;
   `solve` returns no `solution` for them; an overflow **refuses** the
   operation and leaves the document intact.

### 5e.7 Layout, responsiveness, RTL, accessibility, performance

- ≥ 768 px: the panel (20 rem, 23 rem from 1280 px) on the **start** edge
  (right in Arabic), the stage takes the rest; its content is centred
  vertically (`margin-block: auto` on the first and last children) so the
  balance does not float in a tall void. Below 768 px: the stage on top,
  the panel below (≤ 46 %, scrollable). Verified at 1440, 834 and 390 px:
  no horizontal overflow, touch targets ≥ 32 px.
- **SVG and direction.** As for the 3D stage and the probability charts,
  the HTML `dir` does not reach SVG: `.sa-ml-alg__balance` and
  `.sa-ml-alg__numberline-svg` set `direction: ltr` explicitly, and the
  e2e checks the **computed** direction. Notation (`.sa-ml-alg__current`)
  is LTR through `MathText`; Arabic labels stay RTL.
- **Latin digits.** Cairo renders Latin digits as Arabic-Indic when it is
  reached as a fallback, so `11` displayed as `١١` in the equation field and
  on the balance tokens. Every numeric surface therefore leads with
  **JetBrains Mono** (the platform's digit/code font, §index.css) — not
  `monospace`, which resolves to an Arabic-capable system font.
- A long equation scrolls **inside its own zone**; the page never overflows
  (§31). KaTeX drops from 1.6em to 1.3em under 480 px.
- Every control is labelled; the operation kinds are `aria-pressed`; the
  invalid field is `aria-invalid` + `role="alert"` linked by
  `aria-describedby`; each operation announces the new equation through a
  `role="status"` live region, and a visually-hidden line always carries the
  **textual** mathematical state (« المعادلة الحالية: 2x + 3 = 11 — الخطوة 2
  من 3 ») so nothing depends on seeing the balance (§34). Animations respect
  `prefers-reduced-motion`.
- All mathematics is pure and memoised (`classify`, `suggestOperations`);
  serialisation waits 300 ms after the last change, autosave 2.5 s later.

### 5e.8 Extension points and limits

Prepared, not built: MathLive input (the parser already reads its LaTeX —
only the field would change); several unknowns (`toLinearForm` takes the
variable as a parameter); an inequality generator (`generateEquation` takes
`relation`); PNG export. **Not in V1, by decision** (§41 of the brief):
quadratics, systems, matrices, complex numbers, symbolic differentiation or
integration, CAS-level simplification, an AI tutor. `x²` and `3/x` are
refused with a clear Arabic sentence rather than silently mishandled.

## 5f. مختبر الأشعة — Vectors & Coordinate Geometry Lab V1

> The instrument of the 4AM programme's **« المعلم في المستوي »** (LP 4.4) and
> **« الانسحاب والشعاع »** (LP 4.5). A شعاع is not an arrow to look at: it is a
> **displacement you pull**. The student drags a point and the components,
> the length and the direction follow the finger.

### 5f.1 Terminology — الشعاع, not المتجه

The instrument is **مختبر الأشعة**, its object is a **شعاع**, its coordinates
are **المركبتان**, and a translation is an **انسحاب**. This is the register of
the Algerian textbook, recorded in `ALGERIA_4AM_CURRICULUM.md` (§terminology:
« الشعاع | vecteur ») and already announced by the Lab home page before the
tool shipped. `المتجه` — correct in other Arabic-speaking curricula — is **not**
used here: the student's own book says شعاع, and the Lab speaks the book's
language (`ARABIC_RTL_CONTRACT.md`).

### 5f.2 One coordinate plane, not a second one

`VectorPlane.jsx` **imports the grapher's plane modules unchanged**:

| Concern | Module — owned by `tools/functionGrapher/` |
|---|---|
| The camera (`{xMin, xMax, yMin, yMax}`, zoom, pan, fit) | `viewport.js` |
| The readable grid step at any zoom | `gridStep.js` |
| Axis labels, decimal comma, true minus, Latin digits | `grapherFormat.js` |
| Drag, pinch, wheel, keyboard | `useViewportGestures.js` |

There is **one** coordinate system on the platform, and this is it. What
justifies a separate *component* is only what sits on top: draggable objects
instead of sampled curves. The mafs light theme (`--mafs-bg`, `--mafs-fg`, …)
is redeclared in `vectors.css` with the grapher's exact values — mafs ships a
**dark** default (`node_modules/mafs/core.css`), so omitting it renders a
black plane with white-on-white labels.

### 5f.3 Layers (the §38 separation)

```
vectorMath.js     pure mathematics on {x, y} — no React, no pixels, no rounding
vectorScene.js    objects, stable ids, DEPENDENCY RESOLUTION, delete cascade
analysis.js       relations between objects (parallel, perpendicular, collinear)
vectorState.js    the document: scene + history + viewport + settings
vectorFormat.js   the ONLY place a number is rounded for display
VectorPlane       the repère (grapher modules) + gestures
VectorSceneLayer  draws a RESOLVED scene — computes nothing
VectorArrow · VectorHandle · VectorConstructions   the SVG vocabulary
VectorInspector · VectorControls                   the panel
VectorsTool       state owner; calls the pure modules, no maths in JSX
```

### 5f.4 Dependencies: nothing is ever "updated"

The brief (§38) asks that moving A update everything derived from it. The
instrument satisfies this by **never storing a derived value**:

| Object | `kind` | Definition stored |
|---|---|---|
| point | `free` | `{x, y}` — the only draggable kind |
| | `midpoint` | `{of: [idA, idB]}` |
| | `image` | `{of: idA, by: idVector}` — the انسحاب |
| شعاع | `free` | `{origin: {x, y}, x, y}` — movable, components unchanged (§6) |
| | `points` | `{from: idA, to: idB}` — ⃗AB, anchored at A |
| | `sum` / `difference` | `{of: [idU, idV], method}` |
| | `scaled` | `{of: idU, k}` |
| polygon | — | `{vertices: [id…]}` |

`resolveScene(scene)` walks these once per render, memoised, detecting cycles
without an infinite stack; a dead reference or a cycle yields
`resolved: false` for **that object only** and the rest of the plane keeps
working. A midpoint or an image is therefore **not draggable** — you move it
by moving what it depends on, which is the lesson itself. `dependentsOf` /
`removeObjects` compute the transitive closure before a delete, so no object
is ever left pointing at nothing.

### 5f.5 Two regimes of change — why « تراجع » undoes a *gesture*

| Regime | Function | Used by |
|---|---|---|
| Continuous | `replaceScene` — overwrites the current step | dragging, the k slider, the a/b sliders |
| Act | `pushScene` — pushes a step, cuts the abandoned branch | create, combine, translate, delete, open an experiment |

Without this split, crossing the plane with a point would pile up two hundred
history entries and « تراجع » would rewind by one pixel. The end of a drag
pushes a fresh step so the next gesture does not overwrite it. `MAX_HISTORY`
is **20**: each step keeps a full copy of the scene, so the document's size is
`history × scene`, and this constant is what sets the server's byte ceiling.

### 5f.6 What is drawn, and why

| Construction | Answers | Note |
|---|---|---|
| Arrowhead in **pixels**, not plan units | §5 | a marker would double in size at each zoom |
| The **zero شعاع** as a disc | §14 | "nothing is drawn" and "the شعاع is null" must not look alike |
| Tip-to-tail, the copy **dashed** | §11 | the dash says *this is a copy* |
| Parallelogram, faint fill | §12 | the surface is what makes the rule discoverable |
| The opposite `−v` | §13 | `u − v` is shown as `u + (−v)` |
| The carrier line of `k·u` | §14–15 | every `k·u` lives on one line: collinearity, seen before it is said |
| Component legs | §8 | (4 ; 2) means *four right, two up* |
| Right-angle marker | §24 | the textbook's small square |
| Direction arc | §10 | the angle, not just a number in a panel |

### 5f.7 Exact values, rounded only to display

`exactNorm` returns ‖u‖ in its readable exact form — `5`, or `2√5` for √20 —
for **integer** components, and the decimal otherwise; `formatNorm` prints
`√5` *and* `≈ 2,24`, because either alone teaches less. `formatFactor` writes
`v = 1/2 u`, not `0,5` (§21). A **vertical** line returns
`{vertical: true, value: null}` and the panel says « غير معرّف — المستقيم
عمودي »: never a number (§20). The null شعاع has **no** direction — `NaN`,
displayed « — », never 0°.

Parallelism and perpendicularity use a **relative** tolerance (|det| or |dot|
against the product of the norms, i.e. bounding |sin θ| / |cos θ|). An absolute
test lies twice: it calls huge collinear أشعة non-parallel, and tiny
non-collinear ones parallel.

### 5f.8 Touch (§34)

A handle is a **visible** disc of 5–7 px inside an **invisible** hit circle of
22 px radius — a 44 px target, the recommended minimum, measured in the e2e
run. The drawing does not grow; the target does. Handles and the arrow's pick
band use **native** `pointerdown` listeners with a real DOM `stopPropagation`:
the plane's own gestures (`useViewportGestures`) are native listeners on the
host element, and React's synthetic `stopPropagation` would not stop them —
the plane would read a tap and deselect what was just chosen. `touch-action:
none` keeps the page from scrolling under the finger.

### 5f.9 Experiments (§27) and free exploration (§28)

`experiments.js` holds ten rigged scenes — addition, parallelogram,
subtraction, scalar, translation, shape translation, midpoint, parallelism,
collinearity, perpendicularity. They carry **no question and no answer**: an
experiment is a plane already set up, nothing more, and everything in it stays
draggable. The default document is **not** an experiment: two points and the
شعاع they carry, so the student sees at once what a شعاع is (§28).
`experiments.test.js` asserts every experiment opens fully resolved, survives a
storage round-trip, and leaves something to pull.

### 5f.10 Curriculum scope

The **dot product is not in the 4AM programme** — it belongs to the lycée. It is
computed and available, but only behind an explicit « تحليل إضافي » choice,
never on opening and never as the headline feature (§23 of the brief).

### 5f.11 Verification

`vectorMath.test.js` (54), `vectorScene.test.js` (23), `vectorState.test.js`
(23), `vectorFormat.test.js` (17), `experiments.test.js` (33) — **150 tests**,
covering every case the brief lists (§39) plus the vertical line, the null
شعاع, the cycle, the dead reference, the relative tolerance, the history depth
the document's byte budget, and the **lesson seed contract** exactly as
`LESSON_DEVELOPMENT_GUIDE.md` publishes it. Browser QA:
`apps/web/e2e/mathlab-vectors.mjs`.

## 5g. مختبر المثلثات — Trigonometry & Unit Circle Lab V1

> The instrument of the 4AM programme's **« النسب المثلثية في مثلث قائم »**
> (LP 4.2) and **« العلاقات بين النسب المثلثية »** (LP 4.3). A sine is not a
> number to look up: it is a **length you can see** — the height of a point
> above an axis, or one side of a triangle measured against another. The
> student drags, and every reading follows the finger.

### 5g.1 The triangle opens, the circle waits one click

The 4AM programme asks for **النسب المثلثية في مثلث قائم : جيب · جيب تمام ·
ظل زاوية حادة** — a *right triangle* and *acute* angles
(`ALGERIA_4AM_CURRICULUM.md` §4.2). The unit circle, the four quadrants, the
signs and the periodicity belong to the lycée.

So the instrument **opens in `mode: 'triangle'`**, on the figure in the
student's own book, and the circle is one segmented control away. Nothing is
withheld — the whole brief is built — but what dépasse le programme never
takes the first screen. This is the rule already held for the dot product of
the vectors lab (§5f.10), applied a second time.

The opening angle is **30°**, not 0°: at 0° the triangle is flat, sin is 0 and
the screen shows nothing of what it can do. At 30° the student sees a figure,
an angle and three exact values within a second (§46 of the brief).

### 5g.2 Layers (the §39 separation)

```
trigMath.js     pure mathematics on angles — no React, no pixels, no rounding
exactValues.js  the sixteen remarkable angles and their EXACT forms
geometry.js     mathematics → SVG paths; the ONLY place the y axis is flipped
trigState.js    the document: mode, angle, radius, layers, practice score
layers.js       the sixteen layer toggles — a LEAF module (see below)
presets.js      twelve presets (§27) and eight guided experiments (§26)
practice.js     the challenge generator, the answer parser, the verdict
trigFormat.js   the ONLY place a number is rounded for display
UnitCircleStage · TriangleStage    draw a resolved state — compute nothing
TrigInspector · TrigControls · PracticePanel   the panel
TrigonometryTool   state owner; calls the pure modules, no maths in JSX
```

`layers.js` exists **only to break an import cycle**: `presets.js` needs the
layer list, and `trigState.js` needs the presets. In ESM such a cycle does not
fail at the guilty module — it fails later, on an incomprehensible
`Object.keys(undefined)`. The list is therefore the leaf of the graph and
imports nothing.

### 5g.3 Honest numbers, or none at all

`Math.cos(Math.PI / 2)` is `6.12e-17`, and `Math.tan(Math.PI / 2)` is
`1.6e+16`. An instrument that prints either teaches something false.

| Case | What the instrument does |
|---|---|
| A float that is a zero | `clean()` snaps below `1e-10` to `0`, and near ±1 to ±1 |
| `tan(90°)` | `tanOf` returns **`null`**, and the UI writes « غير معرّف » — never a number, never `∞` (§11, §23) |
| `sin²θ + cos²θ` | cleaned to **exactly** `1`, so the identity of §22 is not ruined by `0,9999999999999999` |
| `tan(89.99°)` on screen | the segment is **clipped** at the frame *and says so* — an unclipped `y` of millions breaks SVG rendering (§11) |
| An angle with no exact form | the decimal, plainly; the instrument never invents a `√` it cannot justify |

The exact-value table is **proved against `Math`**: `exactValues.test.js`
compares every one of the sixteen angles' sin, cos and tan to the computed
value. A hand-written table that is not checked is a table that lies.

### 5g.4 One θ on screen, whichever mode

The circle has `data.angle`; the triangle has the angle its two legs
determine. Reading `data.angle` in both modes put « sin(θ) = 1/2 » in the
inspector while the triangle drew `0,5057` — **two values for one θ**, found
by visual QA where no assertion was looking. `shownAngle` now follows the
mode, and the angle field, slider and nudges drive whichever angle is on
screen.

### 5g.5 The wave is born from the rotation

`wavePath(fn, from, to, box, samples, axis)` takes the drawing scale
**separately** from the sampled range. §13 wants the curve to appear as the
point turns, so the partial curve is sampled `from → current angle` but must
still be placed on the scale of the whole turn. Without `axis`, the partial
curve was compressed across the full frame width and its end did not fall
under the marker — the circle ↔ graph link of §12 was lying. A dashed "ghost"
of the full curve sits behind it, so the student sees where the wave is going
without losing the sense that it is being drawn.

The graph lives in the **same SVG** as the circle: §12 wants the point and the
marker to be visibly one object, and two SVGs would mean two coordinate
systems to keep in step.

### 5g.6 Dragging, both ways

| Gesture | Effect |
|---|---|
| Drag the point on the circle | θ follows, **keeping the current turn** — at 370° a small pull gives 370,5°, not 10,5° (§14) |
| Drag inside the graph | θ follows — the relation runs graph → circle too, not only circle → graph (§32) |
| Drag the triangle's free vertex | both legs change, so the angle and hypotenuse follow (§9) |
| Arrow keys on either handle | ±5°, ±15° with Shift, ±0,5° with Ctrl |

Handles use **native** `pointerdown` listeners with pointer capture and a
real `stopPropagation`, a visible 8 px disc inside an invisible 22 px hit
circle (a 44 px target), and `touch-action: none` — the same construction as
the vectors lab (§5f.8), for the same reasons.

Dragging **snaps to the remarkable angles** within 2,5°, and Shift disables
the snap: 37° must stay reachable (§28).

### 5g.7 Practice that cannot block

`practice.js` generates six families of challenges (§25). Three decisions run
through it:

- **A wrong answer closes nothing.** `checkAnswer` returns `{correct,
  readable}` and nothing else — there is no "blocked" state to reach. Reveal
  stays available, the field stays editable, the circle stays draggable
  behind the panel.
- **A correct value written differently is correct.** `parseAnswer` reads
  `1/2`, `0,5`, `0.5`, `√3/2`, `racine3/2`, `−1`, `٤٥`, `π/3` and `7π/4`. The
  question is about trigonometry, not syntax.
- **The score is two counters.** Solved and seen. No streak, no badge (§45).

Two bugs the tests caught before any UI existed:
1. The Lehmer generator's first draw is `seed × 7.8e-6`, so seeds 1…120 all
   picked the *same* challenge family. The seed is now scrambled first.
2. `parseAnswer` handled `π/3` but not `7π/4` — a student converting 315°
   would have been told they were wrong. Implicit multiplication is now
   restored before substitution, and evaluated by hand, never `eval`.

### 5g.8 State format (`trigState.js`, `TRIGONOMETRY_SCHEMA_VERSION = 1`)

```js
{ mode, angle, radius, unit, valueMode, compare: {enabled, angle},
  triangle: {given, angle, opposite, adjacent, hypotenuse},
  inverse: {ratio, value} | null, symmetry, highlight,
  layers: {…sixteen booleans…}, practice: {solved, seen}, preset }
```

§42's separation is **literal**: the animation, its speed and direction, the
open panel and the current question live in `useState` inside the component
and have **no field in `data`**. §43 ("do not persist transient animation
state") is therefore held by construction, not by discipline. Reopening a
document never relaunches a half-answered question.

The angle is stored **unnormalised** — 450° stays 450° — because that is what
§14 makes discoverable; normalising is an explicit gesture (§15). Bounds are
`[−720°, 1080°]`: beyond two turns the spiral arc becomes an unreadable coil.

The document measures ~700 bytes; the server allows **8 KB**
(`MathLabTools.php`), verified by `trigState.test.js` and by
`MathLabDocumentFlowTest`.

### 5g.9 Arabic, RTL, accessibility

The page is RTL and the panel follows it; the **drawing and every notation
are computed `ltr`** (§36) — `(1/2 ; √3/2)` must not be read backwards. Note
that `dir="ltr"` fixes the character *order*, not the *alignment*: a formula
like `ℓ = r·θ = 3,986` still hugged the right edge until `text-align: left`
was added. Digits stay **Latin** and the decimal separator is a comma
(`ARABIC_RTL_CONTRACT`).

Colour never carries information alone (§37): each ratio has its own stroke
width as well as its colour, the current row of the sign table carries
`aria-current` and a screen-reader word, and the practice verdict pairs an
icon with a sentence. The point is a `role="slider"` with an Arabic
`aria-valuetext` naming θ, sin and cos.

Under **reduced motion** (§38) the continuous rotation does not start by
itself and a note says so; everything else works unchanged — the mathematics
never depended on the animation.

### 5g.10 Verification

`trigMath.test.js` (80), `exactValues.test.js` (30), `trigFormat.test.js`
(32), `trigState.test.js` (47), `practice.test.js` (32), `geometry.test.js`
(41) — **262 tests**, covering every case §49 lists plus the float that is a
zero, the undefined tangent, the clipped-but-honest tangent, the exact table
proved against `Math`, the scrambled seed, `7π/4`, the handle that keeps its
turn, and the byte budget. Browser QA:
`apps/web/e2e/mathlab-trigonometry.mjs` — **107 checks** at three viewports.

### 5g.11 Curriculum scope and limits

The unit circle, radians, periodicity, the four quadrants and the inverse
functions are **built and complete**, but they are lycée material: they are
never the opening screen (§5g.1). Out of scope for V1, and deliberately so
(§52): calculus, complex numbers, Fourier, advanced identities, trigonometric
equations, the laws of sines and cosines.

## 5h. مختبر المتتاليات — Sequences & Recurrences Lab V1

> A sequence is not a list of numbers: it is a **rule that makes numbers**.
> The student changes one parameter and watches the terms, the table, the
> graph and the differences move together; clicks « الحدّ التالي » and sees the
> rule applied exactly once; opens the cobweb and sees *why* it converges.

### 5h.1 The differences open, convergence waits one click

**Sequences (المتتاليات) are not in the 4AM programme.** The curriculum
inventory (`ALGERIA_4AM_CURRICULUM.md`) contains no chapter on them. What it
does contain is their authentic anchor — **«الفروق المتتالية»**, successive
differences, named by the programme itself in LP 2.1 (the PGCD lesson, §2.1)
— plus **الدوال الخطية** and **الدوال التآلفية** (LP 3.7, 3.8), of which an
arithmetic sequence is the discrete cousin.

So the instrument **opens on an arithmetic sequence**, `u₀ = 2`, `r = 3`,
with its **differences column already showing**: a 4AM student recognises the
gesture from their own textbook. The cobweb diagram, the fixed points, the
partial sums, the subsequences and the convergence study are lycée material —
they are **built and complete, but switched off** (`layers.js`).

This is the rule already held for the dot product of the vectors lab
(§5f.10) and the unit circle of the trigonometry lab (§5g.1), applied a
**third** time: what exceeds the programme exists, but never takes the first
screen.

The opening values are not `u₀ = 0, r = 1`: that sequence is `0, 1, 2, 3…`,
where the index and the term are indistinguishable and nothing can be
learned. `2, 5, 8, 11` shows at a glance that « +3 » is not « n ».

### 5h.2 Layers (progressive disclosure)

```
sequenceMath.js        pure mathematics on sequences — no React, no pixels, no rounding
sequenceExpression.js  the student's text → a safe function (REUSES the grapher's parser)
sequenceModel.js       a stored spec → a live definition → everything the UI reads
sequenceFormat.js      numbers, indices and rules → readable notation (no translated string)
sequenceState.js       the document: the spec, the count, the cursor, the layers, the score
layers.js              the layer list (leaf module: imports nothing, breaks the ESM cycle)
presets.js             PRESETS (§39) + EXPERIMENTS (§26) — each one returns a PATCH
practice.js            predict → reveal → verify, with computed explanations
```

`differences` is the **only** reading switched on by default, and that is a
curriculum decision, not a UI preference. `connect` (joining the points) is
**off**: a continuous line through `(0,u₀)` and `(1,u₁)` draws values at
`u₀,₅`, terms that do not exist — a student who sees a line believes in a
function (§18).

### 5h.3 No second parser, no second coordinate system

Two reuse rules the brief demanded and the code keeps:

- **The expression parser** is the grapher's
  (`functionGrapher/expressionParser.js` + `expressionEvaluator.js`), called
  with other variables — `n`, `u`, `v` instead of `x`, through the `scope`
  mechanism that was already there for parameters.
  `sequenceExpression.js` only normalises the notebook's notation (`u(n+1)`,
  `uₙ₊₁`, `u_{n+1}`) before handing it over, and strips a left-hand side the
  student wrote. There is **no `eval` and no `new Function`** —
  `sequenceExpression.test.js` asserts it against the file's own code.
- **The plane** is `SequencePlane.jsx`, built exactly as
  `vectors/VectorPlane.jsx` was: the camera (`viewport.js`), the grid step
  (`gridStep.js`), the gestures (`useViewportGestures.js`) and the label
  format (`grapherFormat.js`) are imported from the grapher, rendered into
  `mafs`, with a render-prop `children`. One difference, and it carries the
  whole meaning: the abscissa is named **`n`**, not `x`, and its graduations
  are forced to integers — there is no term `u₂,₅`.

### 5h.4 Numerical observation is never a proof

The brief's §11 and §51 are the hardest requirement in the instrument, and
they are met in the **engine**, not in the copy.

`analyseTrend` returns `observedOnly: true` by default, and the interface then
says « الحدود المحسوبة تبدو وكأنّها تقترب من … » — *the computed terms appear
to approach*. One case, and one only, returns `proven: true`: an affine
recurrence with `|a| < 1`, whose convergence to `b/(1−a)` is a theorem of the
course. There the interface may speak plainly.

The same honesty governs the rest:

| Reading | What it says | Why |
|---|---|---|
| `observedRange` | « المجال المرصود للحدود المحسوبة » | a finite sample never proves boundedness (§22) |
| `fixedPoints` on an affine | `exact: true`, with the formula `L = b/(1−a)` | algebra, not sampling |
| `fixedPoints` on a free rule | `exact: false`, « نقطة ثابتة تقريبية » | a sign change plus bisection, not a solver |
| `ratios` on a zero term | `defined: false` → « — » | `Infinity` would be a lie dressed as a number |

### 5h.5 Safety: nothing crashes, nothing freezes

Iterating a rule the **student** wrote is the instrument's core act, so §32
and §47 are held by construction:

- `generate()` never throws. Every accident becomes a clean stop carrying a
  reason (`overflow`, `undefined`, `invalidRule`, `iterationCap`), which the
  panel names in Arabic.
- `MAX_TERMS = 500` bounds what is generated; `MAX_ITERATIONS = 100000`
  bounds the work for a far index (§12). Beyond it the tool says the index is
  too far rather than freezing the tab.
- `OVERFLOW_LIMIT = 1e12` stops generation. Not `Number.MAX_VALUE`: past
  1e12 the digits stop being exact, and « the sequence explodes » is the only
  thing divergence has to teach.
- `cleanFloat` (15 significant digits) is applied **only** to values a closed
  formula produces. `4/(1−0.8)` is `20.000000000000004` in IEEE 754, and the
  cooling model's fixed point — the room's temperature — must read `20`.
  Generated terms are never rounded in flight.

### 5h.6 The step, shown in three parts

§8 asks that the student see *current term → rule → next term* rather than a
number. `formatStepBreakdown` returns the three pieces separately, and two
details in it are mathematical rather than typographic:

- a **negative** substituted value is parenthesised. Putting `−2` into
  `u² − 1` unparenthesised prints `−2² − 1`, which reads `−5`, while the
  computation is `(−2)² − 1 = 3`. Without the parenthesis the line teaches a
  sign error.
- **implicit products are made explicit at substitution time**, not repaired
  afterwards. `3,2uₙ(1−uₙ)` with `uₙ = 0,3` would print `3,20,3(1−0,3)`,
  where nothing marks where the coefficient ended; the information cannot be
  recovered downstream, so the `×` is inserted where the variable is known to
  have been.

### 5h.7 Practice that cannot block

Six question families (`practice.js`): a term of an arithmetic sequence, a
term of a geometric one, a term of a recurrence, the behaviour read off the
graph, the value the terms approach, and the rule behind shown terms. The
generator is `makeRng` (mulberry32) from `lessons/common/stats/randomUtils.js`
— **not** a third hand-rolled generator; the trigonometry lab documents the
small-seed trap that re-writing one leads to.

- The verdict has **three** values, not two: `correct`, `readable` but wrong,
  and **unreadable**. Answering « faux » to a student who typed « أربعة »
  would teach them something false about their answer.
- Hints are an ordered list of keys, revealed one at a time, and never
  contain the answer (§28).
- An error explanation is **computed, never written**: `explainTerms` returns
  the real terms up to the one asked for, with the target highlighted, so the
  student sees where their arithmetic diverged (§29).
- There is **no blocked state in the module**, therefore none can arise. A
  wrong answer leaves the field editable, « اكشف » enabled, « سؤال آخر »
  enabled, and the sequence behind the panel fully manipulable.
- Revealing **places the sequence in the workspace** and turns on the reading
  that explains its family (differences, or ratios). The student does not read
  a number; they see the sequence that was being discussed.

### 5h.8 State format (`sequenceState.js`, `SEQUENCES_SCHEMA_VERSION = 1`)

```js
data = {
  primary:   SequenceSpec,          // the sequence studied
  secondary: SequenceSpec | null,   // the one compared to it (§33)
  count:     number,                // how many terms are generated
  cursor:    number,                // the index highlighted (§6, §7)
  probe:     number,                // the far index inspected (§12)
  layers:    { …16 toggles… },
  view / cobwebView: Viewport | null,
  practice:  { solved, seen },      // the SCORE only
  preset:    string | null,
}
```

A `SequenceSpec` is **pure JSON**: the family, six parameters, and the two
rules **as text**. The compiled functions are not stored — a function does
not serialise, and storing one would mean executing code that came back from
the database. `sequenceModel.buildDefinition` recompiles at open time.

All the parameters coexist whatever the family, so switching from geometric
to arithmetic and back **keeps** the ratio the student had chosen (§4).

**The terms are never stored.** Five hundred numbers that recompute from ten
is storage of what we know how to rebuild; the e2e asserts `"terms"` never
appears in the payload.

Not serialised, and with **no field to be written to**: the iteration, its
speed, the open panel, the current question, the open experiment. §48 is
therefore held by construction. Measured document: ~550 bytes; worst case
under 1.5 KB; **8 KB** granted server-side (`MathLabTools.php`), asserted by
`sequenceState.test.js`.

### 5h.9 Arabic, RTL, accessibility

- 233 strings under `tools.sequences` in `mathlab.json`. Nothing in
  `sequenceFormat.js` is translatable: it produces symbols, which are the same
  in every language.
- The plane, the table's numbers, every rule and every `N / M` score are
  `dir="ltr"` **plus** `text-align: left` + `unicode-bidi: isolate` — the pair
  `ARABIC_RTL_CONTRACT.md` §4 requires. Direction is asserted **computed** in
  the e2e, not read from the markup.
- Indices are Unicode subscripts (`u₀`, `u₁₂`), never `<sub>`: they survive an
  `aria-label`, an SVG `<title>` and a PNG export.
- Digits stay Latin, per the Algerian mathematics textbooks.
- The current term and the current row are marked by `aria-current` and a
  side bar, never by colour alone (§43). Sliders carry `aria-label` and
  `aria-valuetext`; each is doubled by a numeric field, because a student who
  wants exactly 1,5 should not have to aim at a pixel.
- Under reduced motion the automatic iteration does not start by itself; the
  instrument stays entirely usable (§43).

### 5h.10 Layout, and what only visual QA found

Mobile first: the stage above, the desk below, collapsible. From 768 px the
desk becomes a 22 rem side column. The cobweb sits under the graph on a phone
and beside it from 1024 px. The table **scrolls horizontally** rather than
crushing its columns; every tap target is at least 44 px.

Five defects survived a green assertion suite and were caught by *looking at
the screenshots* (§53). They are recorded here because each is a trap for the
next instrument:

| Defect | Cause | Fix |
|---|---|---|
| The plane rendered **black** | mafs ships a dark theme (`--mafs-bg: black`, `core.css`); every other tool overrides it and this one did not | the `--mafs-*` block of `functionGrapher.css`, copied verbatim |
| Only 3 of 10 terms visible | `resizeViewport` forces an **orthonormal** repère — right for the grapher, wrong when x is an *index* and y a *value* | the computed fit is used as-is; `fitViewportToAspect` is kept only for the cobweb, where `y = x` must read at 45° |
| The graph collapsed to a strip on a phone | `flex: 1 1 auto; min-height: 0` let the panel win | a `vh` floor on the **plot area**, not just the stage (which also holds the transport bar and the notes) |
| Converging labels piled up (`4,375 4,187 4,09…`) | every term labelled, whatever the spacing | a label is skipped when the previous point is within 14 px vertically; the cursor's is always kept |
| A bare `2` under the revealed terms | the expected answer printed unlabelled | `practice.answerLabel` (« الجواب : ») in front of it |

**The definition card is sticky** (`SequenceDefinitionCard`, `--sticky`). The
parameter sliders live at the bottom of a scrolling panel and the rule at the
top, so dragging `a` or `b` meant losing sight of the very formula being
changed — manipulating blind, the opposite of *touch the mathematics and see
what happens*. Two details make it work, and both were found by measuring in
the browser: the card must be a **direct child of the scroll container**
(inside `.sa-ml-seq__inspector` it stuck to the top of *that* 582 px block and
left with it), and a `::before` mask covers the panel's 0.6 rem padding strip,
through which a scrolling slider otherwise reappeared over the formula. On
phones (< 768 px) it scrolls normally: the panel is only ~52 % of the screen
there, and the graph already shows the change.

The sticky table header is `pointer-events: none` and only sticks above 800 px
of height — otherwise it covered the first rows' index buttons and stole their
taps (also browser QA).

### 5h.11 Verification

`sequenceMath.test.js` (72), `sequenceState.test.js` (54), `practice.test.js`
(30), `sequenceFormat.test.js` (34), `sequenceExpression.test.js` (24) —
**214 tests**. They cover every family, every reading, the cobweb geometry,
the closed forms proved term by term against the iteration, and the whole of
§32/§47: division by zero, a rule that throws, a rule returning a non-number,
overflow, the iteration cap, the 1/n hole, the byte budget, and the §48
non-persistence block. `practice.test.js` re-derives **every** expected answer
with the engine over 400 seeds, and cross-checks each behaviour question
against `analyseTrend` itself — a practice question whose correction is wrong
is worse than no practice at all.

Browser QA: `apps/web/e2e/mathlab-sequences.mjs` — **114–115 checks** at four
viewports (the count varies by one: the « saisie illisible » assertion only
applies when the drawn question expects a number rather than a choice), including the four sliders regimes (`q` = 0,8 → 1 → 1,2 → −1), the
`proven` vs `observed` distinction in both directions, and a deliberately
wrong answer that must not lock anything.

### 5h.12 Curriculum scope and limits

The cobweb, fixed points, convergence, partial sums, subsequences, second-order
recurrences and free-form recurrences are **built and complete**, but they are
lycée material and never the opening screen (§5h.1). Out of scope for V1, and
deliberately so (§55): series theory, formal convergence proofs, symbolic
solving of a recurrence, a spreadsheet, calculus.

Two honest limitations:
- **`secondOrder` is parametric only** (`u(n+2) = a·u(n+1) + b·u(n)`), which
  covers Fibonacci and every case §3 names. A free second-order rule
  (`f(u(n+1), u(n), n)`) is parsed by `sequenceExpression.js` — the `v`
  variable exists and is tested — but no field exposes it in V1.
- **The continuous-function overlay** (`layers.continuous`) is a toggle that
  reserves its place in the layer list; it is drawn for explicit sequences only,
  and it is the one layer whose absence a student cannot notice.

## 5j. مختبر التحويلات — Transformations & Dynamic Geometry Lab V1

> *Touch the geometry and see what happens.* A student drops a triangle on
> the plane, grabs a vertex, and the image follows under their finger; they
> drag a mirror axis and the reflected figure slides with it; they push a
> dilation's ratio from 1 to 2 and read, on screen, that the area was
> multiplied by 4 — before any sentence told them so.
>
> **Authoritative** for the transformations lab: the affine engine, the
> figure and step model, composition and order, the measured invariants, the
> animation, practice and puzzles.

### 5j.1 The programme first, the rest one click away

The 4AM programme asks for **الانسحاب والشعاع** (LP 4.5) and the symmetries;
**التحاكي** and the composition of transformations are lycée material. The
instrument therefore **opens on a triangle and a انسحاب** — the textbook's
own gesture — with the dilation, the composition stack, the matrix view and
the order experiment all present, complete, and never on the first screen.

This is the rule already held by the dot product in the vectors lab
(§5f.10), the unit circle in trigonometry (§5g.1) and convergence in the
sequences lab (§5h.1): what goes beyond the programme exists, but never
makes the opening page.

The vocabulary is the Algerian textbook's, not a translation:

| Arabic | What it is |
|---|---|
| الانسحاب | translation, by a شعاع |
| الدوران | rotation, by an angle about a centre |
| التناظر المحوري | reflection across a line |
| التناظر المركزي | central symmetry — **not** a fifth transformation (§5j.4) |
| التحاكي | dilation / homothety, ratio `k` about a centre |

### 5j.2 A transformation is a function of the plane, not a drawing

Every transformation is held as a **2×3 affine matrix**
(`transformMath.js`):

```
⎡ a  c  e ⎤        (x, y) ↦ (a·x + c·y + e,  b·x + d·y + f)
⎣ b  d  f ⎦
```

That single choice pays for four features at once:

- **composition** (§5j.5) is a matrix product, so the stack is a `reduce`;
- **the matrix view** is not computed *for* display — the matrix **is** the
  transformation, so the advanced panel costs nothing;
- **the inverse** is one formula, and it honestly returns `null` where none
  exists (`k = 0` flattens the plane onto a point);
- **the determinant** *is* the signed area factor, which is what lets the
  invariants panel say truthfully that a reflection flips orientation.

A step is stored as the student *thinks* it — `{kind: 'rotation', angle: 90,
center: {type: 'origin'}}` — never as a matrix. The matrix is **derived**
(`matrixFor`), because two sources of truth for one transformation will
eventually disagree.

**A centre or an axis may designate a scene object.** `{type: 'vertex',
index: 0}` follows vertex A: drag A and the rotation centre moves with it,
and the image recomputes — with no interface code copying coordinates.
Centres resolve against the **original** figure, not the running image, so a
stack stays stable when steps are reordered.

### 5j.3 Exactness is a feature, not a rounding

`Math.cos(Math.PI / 2)` is `6.12e−17`, not 0. Left alone, a 90° rotation of
an integer point yields `3.0000000000000004`, the comparison table shows
noise, and the invariants panel declares that a length was *not* preserved.

`exactCosSin` therefore returns exact −1 / 0 / 1 on multiples of 90°, and
`cleanPoint` strips float noise **at the point a vertex enters the scene** —
not merely at display time — so the student reading the plane and the
student reading the table read the *same* number (§55 of the brief).

### 5j.4 Central symmetry is not a fifth transformation

« التناظر المركزي » is implemented as `dilation(−1, centre)` — deliberately
the *same* code path. A student who drags the ratio from 2 down through 1 to
−1 watches the figure shrink, vanish to a point and reappear inverted
through the centre, and discovers that central symmetry is a dilation. Two
separate implementations would have hidden exactly that.

### 5j.5 The stack: composition, and the order experiment

`transformStages(figure, steps)` returns one entry per step — its matrix,
the figure after it, and the cumulative matrix — which is what the stack
panel, the intermediate figures (§22 of the brief) and the matrix view all
read.

A **disabled** step is traversed, not dropped: it keeps its line in the
stack with `skipped: true`, so toggling it does not make the list jump. A
step that describes *nothing* (an axis through two coincident points) is
marked `invalid` and reported — never silently replaced by the identity.

**Reordering is never forbidden.** The brief allows restricting it to
"mathematically safe" swaps; the instrument does the opposite, because the
swap that *changes* the result is precisely the discovery of §23. The
student moves a step, the figure moves, and the figure itself says whether
order mattered.

### 5j.6 The invariants are measured, never recited

`analyzeInvariants(before, after)` measures lengths, angles, area,
perimeter, parallelism, orientation and coordinates on **the student's own
figure**, before and after, and compares them. Nothing is hard-coded: no
table says "a rotation preserves lengths". If a student builds a
transformation nobody anticipated, the panel stays correct.

Two details carry the pedagogy:

- **Signed area.** Its *sign* is the polygon's orientation, and it is what
  lets the panel say honestly that a reflection flips orientation while a
  rotation does not — and that a dilation of ratio −2 preserves it (two
  flips).
- **Relative tolerance.** Comparing lengths of 1e−4 and 1e4 against one
  absolute threshold would call one preserved and the other not, for the
  same computation. Same rule as the vectors lab's `analysis.js`.

The area **ratio** is shown whenever it is not 1, so `A′/A = 4` appears next
to a `k = 2` dilation and `A′/A = 9` next to `k = 3`: §19's discovery, read
rather than told.

### 5j.7 The animation shows a state that has a meaning

`matrixAtFraction` does **not** interpolate matrices — that would produce
shapes no transformation ever passes through. Each family is interpolated in
its own terms:

| Family | At `t = 0,5` |
|---|---|
| انسحاب | half-way along its شعاع |
| دوران | a rotation of **half the angle** — the figure turns, it never deforms |
| تحاكي | a dilation of the interpolated **ratio** (`k = 3` → `k = 2`) |
| تناظر | the one honest exception: the figure **flattens onto its axis** and redeploys on the other side, exactly like a sheet of paper being turned over |

`prefers-reduced-motion` is honoured by applying the transformation at once
and **announcing** it to the screen reader (§5j.11) — not by silently
skipping the feedback.

### 5j.8 Practice that cannot block, and puzzles with no unique solution

**توقّع ← حوّل ← تحقّق** (§38–§40): the student predicts A′ by typing
coordinates or picking among four positions. A wrong answer is never a wall:
the instrument gives the right answer *and* animates the transformation, so
the figure shows where the reasoning slipped. The distractors are the
mistakes students actually make — a dropped sign, swapped coordinates, the
transformation applied backwards — because an absurd distractor teaches
nothing.

**The puzzles** (§42) judge by superposition (`figuresCoincide`), never by
comparing stacks: a triangle reached by two translations instead of one is
solved, and so is one reached by a route nobody planned. Vertex order is
irrelevant, in both directions of travel — a reflection reverses the order
without moving the figure.

Two counters are kept (`solved` / `attempts`) and feed **no** analytics
service: the Math Lab has none.

### 5j.9 State format (`transformState.js`, `TRANSFORMATIONS_SCHEMA_VERSION = 1`)

```
data = {
  history:  [scene, …],   // the PATH, as in algebra and vectors
  cursor:   number,       // where تراجع / إعادة read from
  viewport, selection, settings, mode, practice, puzzle
}
scene = { figures: [{id, kind, vertices, color, label, visible}], steps: [...] }
```

History is the same model as the algebra and vectors labs: « تراجع » moves
the cursor, it does not undo, so the student can walk forward again until
they play a new move. A **drag** calls `replaceScene` (no new history entry
for twenty near-identical states) and pushes one entry when the gesture
ends.

Bounds: 4 figures × 12 vertices, 6 steps, 20 history entries, coordinates
±10⁴, `k` ∈ [−10, 10], angle normalised into [0, 360). The measured worst
case is **~40 KB**; the server allows 60 KB (`MathLabTools.php`), and
`transformState.test.js` holds that bound.

**What is never persisted**: the animation (its fraction, step, play state,
speed), the current practice question, the open panel and the active tab.
They have no field in `data`, so they cannot arrive there by accident, and
reopening a document never replays a half-finished animation.

### 5j.10 No second coordinate system

`TransformPlane.jsx` imports the grapher's `viewport.js`, `gridStep.js`,
`useViewportGestures.js` and `grapherFormat.js` **as they are** — one plane
implementation on the platform, one zoom, one pinch, one graduation, one
number format. Same decision as the vectors lab (§5f.2), same reason.

It adds one method the other instruments do not need: **`frame(points)`**.
A scene installed wholesale (an experiment, a challenge, a puzzle) lands
outside the saved window, and the student sees an empty plane or a figure
the size of a fingernail — found in visual QA, not in a unit test. `frame`
fits the window to the original *and* its image (both must be on screen to
be compared) and always includes the origin, since centres and axes refer to
it. It is **not** a permanent auto-fit: the window belongs to the student the
moment they touch it.

### 5j.11 Arabic, RTL, accessibility

The panel follows the page (RTL, Arabic); **every** mathematical notation —
coordinates, lengths, formulas, the matrix, the practice fields — is wrapped
in `dir="ltr"`, and the plane itself is `dir="ltr"` so x grows rightwards
even in Arabic (`ARABIC_RTL_CONTRACT`).

- **Never colour alone** (§46, §53). Original / image / intermediate /
  construction differ by stroke, fill and label: solid + 14 % + `A`; solid +
  24 % + *`A′`* (italic); dashed + 6 %; dashed, unfilled. Invariants carry
  the **word** « محفوظ » / « يتغيّر » next to the ✓/✗, never the icon alone.
- **Handles**: a visible 6 px disc inside an invisible 22 px hit target (44
  px across) — the drawing does not grow, the target does. Focusable, named
  for the screen reader (« الرأس A، الفاصلة 1، الترتيبة 1 »), and the arrow
  keys move them one snap step (Shift: ten times finer).
- **Shift suspends snapping** during a drag, so free exploration is always
  within reach without opening a settings panel.

> **`sa-sr-only` does not exist on this platform.** The screen-reader-only
> text was written with that class and rendered **in plain sight** over the
> interface until a QA screenshot caught it. The convention is a per-tool
> class — `.sa-ml-tr__sr`, like `.sa-ml-trig__sr` and `.sa-ml-vec__sr`.

### 5j.12 Layout, and what only visual QA found

Plane first, panel as a bottom drawer under 768 px (≤ 45 % of the height the
shell left) and a 22–25 rem side panel above it; the panel sits on the same
side as in the other instruments — measured, all of them place it left of
the plane. Three tabs: التحويلات (the stack and the controls), القياسات (the
inspector), تدرّب (practice and puzzles).

Three defects were found **by looking at screenshots**, not by assertions,
and each is now an assertion in `mathlab-transformations.mjs`:

1. the screen-reader text displayed in clear (§5j.11);
2. an experiment's scene left the saved window, so the figure appeared
   minuscule in a corner (§5j.10);
3. the puzzle's target outline vanished under the figure at the exact moment
   the student succeeded — it is now drawn **above** everything, unfilled, so
   the proof of success stays visible. The mobile zoom controls also sat
   below the plane's visible area and now ride at the top under 768 px.

### 5j.13 Verification

- `transformMath.test.js` — 74 tests on the engine alone: the four families,
  their inverses, exact quarter turns, composition and non-commutativity,
  two reflections making a rotation or a translation, distance / angle /
  area / perimeter / orientation, degenerate polygons, snapping, float noise
  and superposition.
- `transformState.test.js` — 73 tests: step → matrix, designated centres,
  animation fractions, the stack with disabled and invalid steps, the
  measured invariants for each family, the coordinate formulas, document
  re-reading, history, the byte bound, **and the lesson seed contract
  exactly as `LESSON_DEVELOPMENT_GUIDE.md` documents it** — a guide that
  promises an API the code refuses is worse than no guide.
- `practice.test.js` — 31 tests: 300 generated challenges checked against the
  engine, four distinct choices with the right answer present exactly once,
  every puzzle solved by its own solution and by an alternative route, every
  guided experiment actually changing something.
- `e2e/mathlab-transformations.mjs` — 69 browser checks on a real student
  account: dragging, sliders, the area ratio read on screen, reordering,
  the draggable axis, the animation, practice, a solved puzzle, save and
  reopen, four viewports, RTL, reduced motion, touch dragging, and zero
  console errors.

### 5j.14 Curriculum scope and limits

- **Plane geometry, one repère.** 4 figures, 12 vertices, 6 steps.
- No conics and no loci **in this instrument** — they belong to the conics
  lab (§5k), which owns them. No constructions by compass and straightedge,
  no theorem prover, no 3D transformations, no shear or general affine map
  entered as a matrix (the matrix is **read**, never typed), no eigenvalues.
- A polygon is created from a template and then dragged; there is no
  free-hand point-by-point drawing, and no constraint solver ("a triangle
  with these three side lengths" is not built).
- The pattern explorer (§37) repeats **one** transformation up to 24 times;
  it is not a tessellation editor.
- No PNG export; no renaming or recolouring of figures from the panel.
- Labels are `A, B, C…` and `A′, B′, C′…`, assigned by position; they are
  not editable.

## 5k. مختبر المقاطع المخروطية — Conic Sections & Analytic Geometry Lab V1

> **Authoritative** for the conics lab: the canonical model, the equation
> parser, intersections, the two-way equation ↔ geometry link, practice, and
> its state format. Lives in
> `apps/web/src/features/mathlab/tools/conics/`.

The mental model is **touch the mathematics and see what happens**: drag the
centre and the equation rewrites itself; write the equation and the curve
moves; put a point on an ellipse, slide it round, and watch `PF₁ + PF₂` not
move. Nothing here is a conic *calculator*.

### 5k.1 The circle opens, the other three wait one click

Conics are **lycée** material. What the 4AM programme asks for — and the only
one of these four curves a 4AM student has met — is the **دائرة**: its
centre, its radius, the distance to the centre. The instrument therefore
opens on `x² + y² = 9` and its probe point, and the قطع مكافئ, قطع ناقص and
قطع زائد are complete but never the first screen.

This is the rule already held by the dot product in the vectors lab
(§5f.10), the unit circle (§5g.1), sequences (§5h) and التحاكي (§5j).

### 5k.2 A conic is a canonical form, not six coefficients

V1 models each family by its **geometric parameters**, never by
`Ax² + Bxy + Cy² + Dx + Ey + F = 0`:

| Family | Parameters | Canonical form |
|---|---|---|
| `circle` | `{h, k, r}` | `(x−h)² + (y−k)² = r²` |
| `parabola` | `{h, k, a, orientation}` | `y = a(x−h)² + k` · `x = a(y−k)² + h` |
| `ellipse` | `{h, k, a, b}` | `(x−h)²/a² + (y−k)²/b² = 1` |
| `hyperbola` | `{h, k, a, b, orientation}` | `(x−h)²/a² − (y−k)²/b² = 1` (or the vertical form) |

This is the choice that makes the lab possible: a student dragging the centre
changes `h` and `k`, not `D` and `E`. The expanded form exists —
`toGeneral`, `formatGeneral` — but as a **reading** of the canonical form,
never as the source of truth.

**`a` and `b` of an ellipse are the semi-axes in x and in y**, not "major"
and "minor". If `a` were always the major axis, pushing `b` past `a` would
make the labels and foci *jump* between axes, and §17's experiment (push `b`
towards `a` and watch the ellipse become a circle) would flicker instead of
transitioning. The major axis is therefore **derived** (`majorAxis`). For a
hyperbola `a` is always the transverse semi-axis, decided by `orientation`,
so it cannot jump either.

### 5k.3 The equation parser never executes input (§51 of the brief)

`conicParser.js` is a recursive-descent parser over a **strict** subset:
`+ − × ÷`, parentheses, powers 0/1/2, `x`, `y`, numbers. No functions, no
free variables, no arbitrary powers — and **no `eval`, no `Function`**.

Every node is evaluated in the ring of **two-variable polynomials of degree
≤ 2**: six monomials (`x2 xy y2 x y 1`), and `polyMul` throws the moment a
product would need a seventh. Degree control is therefore a *consequence of
the arithmetic*, not a check bolted on afterwards.

Both written forms reach the canonical form by the same route — expand to
the six coefficients, then **complete the square**. One route means a
canonical equation and its expansion yield literally the same conic, which a
test asserts. Implicit multiplication (`2x`, `3(x−1)`, `(x−1)(x+2)`) is
accepted because that is how the textbook writes it; `²`, the typographic
minus, the Arabic decimal comma and Arabic-Indic digits are accepted too.

**`B ≠ 0` (an `xy` term) is refused, not ignored**: that is a rotated conic,
out of programme, and the canonical form cannot carry it. Every degenerate
case is **named** rather than called an error — `pointCircle`, `emptySet`,
`crossingLines`, `line`, `parallelLines` — because a student who writes
`x² + y² = −4` deserves to learn that no point satisfies it.

### 5k.4 Intersections are solved algebraically, never by scanning

§26 of the brief makes the words *secant* and *tangent* come from the
**number** of solutions, so that number must be 0, 1 or 2 — not "two very
close points" that a numerical sweep would sometimes call one and sometimes
three. Line ∩ conic substitutes and solves the resulting quadratic; circle ∩
circle uses the radical axis.

Two numerical decisions matter and are load-bearing:

- **The quadratic formula is the cancellation-safe one**
  (`q = −(b + sign(b)√Δ)/2`). With `b` large against `√Δ` the schoolbook
  formula loses all precision on one root, and the intersection point would
  visibly tremble under the finger.
- **"Has the `t²` term vanished?" is judged on `a` alone**, against a tiny
  absolute threshold — *not* against `max(1, |a|, |b|, |c|)`. That relative
  scale looks natural and is wrong: for `t² + 10⁸t + 1 = 0` — an ordinary
  quadratic a steep line produces — the scale becomes 10⁸, `a` is declared
  negligible, and the equation **loses a root**, so the line silently stops
  being secant. The `a = 0` cases in this lab are *exact* structural zeros
  (a vertical line on a parabola), so an absolute threshold catches them all.
  Found by `intersections.test.js`, "reste PRÉCIS quand b est grand".

Tangency itself *is* relative (`|Δ| ≤ ε·max(1, b², |4ac|)`): `Δ = 0` exactly
never happens when a student drags a line, and without that tolerance §27's
secant → tangent → nothing transition would jump from two points to zero
without ever showing one.

### 5k.5 Both directions of the equation ↔ geometry link, and where each lives

| Direction | Where | How |
|---|---|---|
| geometry → equation | the live readout in « التحكّم » **and** the field in « القياسات » | recomputed from the conic every frame by `formatCanonical` |
| equation → geometry | the editable field in « القياسات » | `parseConicEquation` → `applyEquation` → `frame()` |

The **editable** field lives in the inspector and is the single place an
equation is entered. But manipulation happens in « التحكّم », where the
inspector is on another tab and therefore invisible — so half of the two-way
sync could not be seen: you pushed a slider and read nothing change. A
**read-only** live equation therefore sits above the sliders
(`[data-ml-cn-liveequation]`, sticky), recomputed from the conic itself. It
is never a second source of truth and never a second editable field.
(Reported in use during visual QA, 2026-09-23.)

**A line is a first-class object, not a prop.** A `line` is selected,
dragged, sliced by sliders (`m` and `p`, or `c` for a vertical) and **typed
as an equation** exactly like a conic — same handles, same live readout, same
editable field, which switches to `parseLineEquation` when the selection is a
line. Editing only conics and letting the line merely be dragged would have
made two classes of object, one first-class and one not, in a lab whose whole
subject is their meeting (§26). Its panel also reads the current
intersection count in words — *secant / tangent / no common point* — because
that experiment only means something where you are manipulating.

`parseLineEquation` **reuses the conic parser's front end**: that parser
already reduces any input to the six coefficients, and a line is simply the
case `A = B = C = 0`. Writing a second parser for `y = mx + p` would have
been easy and wrong — implicit multiplication, Arabic typography, the
refusals and the "never execute input" guarantee (§51) are then shared, and
improving one improves both forever. A conic typed into a line's field is
refused as `notALine`, not as a syntax error: the student picked the wrong
field, which is a different thing from writing nonsense.

A line carries **both forms at once**, with `vertical` saying only which one
counts. Keeping only the active form looks tidier and costs the student their
work: switching `y = mx + p` → `x = c` and back erased the slope and
intercept, and the line came back as `y = x`. A *display* toggle must destroy
nothing.

The editable field is **not** "controlled" in the usual sense: while the
student has not touched it, it mirrors the conic and follows every drag; from
the first keystroke it belongs to them (otherwise a drag, or even a rerender,
would erase a half-written entry); it becomes a mirror again on submit or
abandon.

### 5k.6 Two regimes of change, and why تراجع undoes a *gesture*

As in the algebra, vectors and transformations labs: a **gesture** (dragging
a handle, pushing a slider) calls `replaceScene` and changes the live scene
without stacking anything; its **release** calls `pushScene`, which stacks
one step.

`pushScene` compares the new scene against the **last committed history
entry**, never against `data.scene`. `data.scene` is the *live* scene, which
`replaceScene` has already moved to its final value; comparing against it
means comparing the scene with itself, the step is judged "no change",
nothing is stacked, and **the whole drag becomes impossible to undo**. Found
by `conicState.test.js`, "un GESTE ne pousse rien ; son relâchement pousse un
pas".

### 5k.7 No second coordinate system

`ConicPlane.jsx` imports `viewport.js`, `gridStep.js`,
`useViewportGestures.js` and `grapherFormat.js` from the grapher **as they
are** — one plane implementation on the platform, one zoom, one pinch, one
graduation. Same decision as §5f.2 and §5j, and §1 of the brief demands it.

Unlike the transformations lab, `frame()` does **not** force the origin into
view: a conic centred at (40, 40) is perfectly understandable without the
origin, and including it would shrink the curve to a dot.

### 5k.8 mafs colours paths by a class rule

`mafs/core.css` sets `.MafsView path { stroke: var(--mafs-fg) }` — a **class**
selector, which outranks the `stroke` *attribute* of a `<path>`. All four
conics rendered in near-black and became indistinguishable although the code
passed each its colour. Curves, lines and axes therefore set their colour as
an **inline style**, which wins over any stylesheet without `!important`
(which would block §36's highlight from taking over). Seen in screenshot 02
of the visual QA, 2026-09-23.

Nothing is distinguished by colour **alone** (§49): a focus is a filled disc,
a vertex a square, the centre a cross, an intersection a ring; asymptotes,
directrix and symmetry axis each have their own dash pattern.

### 5k.9 State format (`conicState.js`, `CONICS_SCHEMA_VERSION = 1`)

```js
data = {
  scene:    { objects: [...], selectedId, probe, trace, locus },
  history:  [scene, …],            // ≤ MAX_HISTORY (20)
  cursor:   number,
  viewport: {xMin, xMax, yMin, yMax} | null,
  reference: scene | null,         // §44 — the frozen "before"
  settings: { grid, snap, snapStep, showCenter, showVertices, showFoci,
              showDirectrix, showAsymptotes, showAxes, showEquation,
              showGeneral, showMeasures, showIntersections, labels, polar },
  mode:     'free' | 'practice',
  practice: { solved, attempts },
}
```

A line stores `{vertical, slope, intercept, x}` — **both** forms, always (see
§5k.5). Bounds: **4 conics, 2 lines**, 20 history entries, coordinates ±10⁴,
a line's slope to ±100. A conic
is stored as five numbers, **never as its points**: the curve is recomputed
from its parameters, and keeping three hundred samples would be storing what
we know how to redo. The traced point stores its **parameter `t`**, not
coordinates, so on reopening it is still exactly on the curve even if the
conic changed.

Worst case measured (4 conics, 2 lines, trace, locus, 20 states, plus the
reference state) ≈ 18 KB; the server bound is **60 KB**
(`MathLabTools.php`), asserted by `conicState.test.js`.

Never serialised: the current practice question, the text being typed and its
error, the open tab, the open panel, the object being dragged.

### 5k.10 Practice that cannot block (§36 – §42)

Eight question families — `centerRadius`, `vertex`, `focus`, `asymptote`,
`matchGraph`, `parameter`, `intersectionCount`, `pointPosition`. A wrong
answer **never** closes a door: it shows the expected answer, highlights the
relevant geometry on the plane (`revealFor`), and « السؤال التالي » stays
there. « الخروج من التدرّب » is always visible (§42).

Values are clean by construction (§41): ellipse and hyperbola parameters come
from Pythagorean triples, so `c` is an integer and a student hunting for a
focus reads a number rather than 4,472135955. §37's decoys are the **real
mistakes** — the shift sign inverted, `r` confused with `r²` — and its choices
are genuine mini-graphs drawn by `conicPolylines`, not equations rewritten.

Hints (§40) reveal in three steps — *where to look*, *what to compare*, *what
remains to read* — and the last carries an intermediate value (`c = 4`),
never the conclusion.

### 5k.11 Verification

- `conicMath.test.js` (40) — the four families, focal properties measured on
  the curve, parametrisation, drawing, transformations, expanded form.
- `conicParser.test.js` (32) — canonical and expanded forms, completing the
  square, every refusal, the write → read round-trip — for conics **and**
  for lines (`parseLineEquation` / `formatLine`, §5k.5).
- `intersections.test.js` (28) — the discriminant, the three cases, vertical
  lines, asymptote-parallel lines, circle ∩ circle, loci.
- `conicState.test.js` (31) — rereading any JSON without throwing, bounds,
  history, the byte bound, the lesson seed contract, and a line keeping both
  forms across the vertical toggle.
- `practice.test.js` (21) — 200 draws per family: every answer verified
  against the engine, reproducibility, judging, hints.
- `apps/web/e2e/mathlab-conics.mjs` — 62 browser checks: circle-first
  opening, drag → equation, equation → geometry, expanded → canonical,
  teaching refusals, r doubled → area ×4 read on screen, inside/on/outside,
  `PF₁ + PF₂` constant while P slides, asymptotes, 0/1/2 intersections,
  live comparison table, translation, practice, save/reopen, « أعمالي »
  preview, RTL, tablet, mobile, touch targets, keyboard, reduced motion.

### 5k.12 Curriculum scope and limits

- **The circle is the programme; the other three are one click away** (§5k.1).
- **No rotated conics** (`xy` term) — refused explicitly, never approximated.
  `rotateConic` accepts **quarter turns only**, since those keep a conic
  canonical; any other angle returns `null` rather than drawing an
  approximation.
- 4 conics, 2 lines, 20 history entries; coordinates ±10⁴.
- Intersections: line ∩ conic (all four families) and circle ∩ circle.
  Conic ∩ conic in general is **not** computed and says so
  (`supported: false`) rather than returning an approximation.
- Loci: the two exact constructions only — fixed distance to a point (a
  circle) and equidistant from a point and a line (a parabola).
- The polar bridge (§29) is a **setting flag only** in V1; no polar plane is
  drawn.
- No CAS, no symbolic simplification, no 3D conics, no projective geometry,
  no conic ∩ conic solver, no PNG export, and no derivative tangent (that is
  the grapher's « المماس »; §27 here is *geometric* tangency).
- The practice mode keeps two counters and feeds **no** analytics service —
  the Math Lab has none.

## 5l. مختبر الأعداد والحساب — Number & Arithmetic Lab V1

> **Authoritative** for the number lab: its thirteen modes, the exact
> arithmetic engine, the « one value, many representations » contract, the
> mode-to-mode bridge, the practice engine and its error explanations.
> Lives in `apps/web/src/features/mathlab/tools/numberLab/`.

### 5l.1 What it is, and what it refuses to be

> **لا تحسب فقط — العب بالعدد، غيّره، فكّكه، قارن، واكتشف ما يحدث.**

Not a calculator. A calculator answers `24 ÷ 6 = 4`; this instrument lets a
student build 24, share it into groups, change the number of groups and
**watch** what happens to the quotient and the remainder. Every screen is
built so that the mathematics is *seen happening* — there is not one
« type a number → read the answer » screen in the tool.

It takes the slot the home page announced as « المستقيم المدرّج »
(`numberLine`): the promised number line is delivered (§5l.5), but as **one
mode among thirteen** — a whole instrument for a single line would have kept
the promise too small. `toolRegistry.test.js` records that decision.

« القياس » (`measurement`) **stays announced**: measuring magnitudes
(lengths, areas, volumes, unit conversion) is a different instrument, not a
mode of this one.

### 5l.2 Thirteen modes, one laboratory

| Mode | id | What it does |
|---|---|---|
| استكشاف عدد | `explorer` | decomposition, place values, factorisation, divisors, parity, prime neighbours — all at once |
| مراتب العدد | `place` | draggable place-value columns, **animated regrouping** 10 ⇄ 1, decimals |
| المستقيم المدرّج | `line` | two draggable points, subdivision, snapping, distance, the four writings |
| الكسور | `fractions` | bar / disc / line models, cutting parts, common denominator, the four operations |
| الأعداد العشرية | `decimals` | `0,75 → 75/100 → 3/4`, and *why* a decimal terminates or repeats |
| النسب المئوية | `percent` | hundred-grid, slider, the ladder, percentage change, reverse percentage |
| التناسبية | `proportion` | editable table, exact verdict, the failing column named, graph through the origin |
| قابلية القسمة | `divisibility` | per-rule verdict **with its reason**, the digit-sum experiment |
| الأعداد الأوّلية | `primes` | step-by-step Sieve of Eratosthenes, interactive factor tree |
| القواسم والمضاعفات | `factors` | divisors, multiples, factor pairs, the **rectangle** that changes shape |
| ق.م.أ و م.م.أ | `gcdLcm` | Euclid step by step, its geometry, factor columns, lists, the §31 law |
| التقريب | `rounding` | the two neighbours, the midpoint, truncation beside rounding, error |
| العمليات | `operations` | number-line moves, groups, arrays, both readings of division, negatives, absolute value |

§3 forbids separate routes, and the reason is deeper than URLs: a student who
explores 360, sends it to the sieve, then to the factor tree, then to the
PGCD is working on **one object**. The mode bar changes only what is
displayed.

**Each mode keeps its own numbers.** A student who sets 84 and 36 in the PGCD,
visits the sieve and comes back must find *their* numbers. A single shared
`value` would be the naive reading of §3 and it would be wrong.

### 5l.3 The bridge between modes — « أرسِل إلى » (§46)

`sendTo(data, mode, value)` (`numberState.js`) is the **only** path a number
takes from one mode to another, and it is always an explicit gesture
(`SendToMenu.jsx`). Nothing propagates by itself. Sending to `line` also
**frames** the value so it is never off-screen; sending to `factors` resets
the pair cursor; sending to `place` refuses silently above `MAX_PLACE_VALUE`
rather than showing a truncated number.

### 5l.4 One value, many representations (§46, §47) — the identity

The tool **never stores** « 0,5 and 1/2 and 50 % ». It stores **one exact
fraction**, and every writing is derived per render
(`numberValue.representationsOf`). Three stored fields would drift — a
rounding here, an input there — and the screen would show two different
values swearing they are the same. Here it is impossible **by construction**:
there is only one number.

This is also how §61 is kept: the source is integral, so
`1/3 + 1/3 + 1/3` renders `1`, never `0,999…`. The decimal is a *view*, never
the support of a calculation.

`representationsOf` tells the **truth** about decimals: `1/3` has no finite
decimal writing, and the tool prints `0,(3)` — the repetend — rather than a
silently truncated `0,333`.

### 5l.5 The mathematical engine — pure, tested, exact (§60, §61)

| Module | Owns |
|---|---|
| `fraction.js` | raw (**never auto-reduced**) fractions, the four operations, exact comparison by cross products, common denominator by **LCM**, decimal expansion with repetend, mixed numbers, one input parser for every writing |
| `numberTheory.js` | gcd/lcm, primality, factorisation, divisors, factor pairs, **divisibility with its evidence**, Euclid **with its trace**, sieve **pass by pass**, place values, rounding detail, approximation error |
| `proportion.js` | percentage of / change / reverse, the ladder, exact proportionality verdict, ratios and sharing |
| `numberValue.js` | the representations, the **single** value ↔ position mapping, ticks, snapping, comparison, framing, platform formatting |

Two rules decided the shape of this layer:

1. **Fractions are never reduced behind the student's back.** `2/4` stays
   `2/4`: §9 makes equivalence *discovered* by cutting parts in two, and an
   engine that reduces silently destroys exactly what is to be shown.
   `simplify()` is a gesture, never automatic.
2. **Nothing returns just "the answer".** §20 demands the *reason*, so
   `divisibilityBy` returns the digit sum it formed, `euclideanAlgorithm`
   returns each division, `sievePasses` returns each elimination in order.
   The screen draws what the calculation already said — so there is a single
   place where it could be wrong, and it is tested.

### 5l.6 Regrouping, the decimal system made physical (§5, §6)

`PlaceValueMode` stores **a number**, not tokens: the columns are derived from
it. It is therefore impossible to display « 12 units » and « 4582 »
simultaneously — two representations of one number cannot diverge. The
regrouping animation is the only transient state, and it lives in the
component, never in the document (§43).

### 5l.7 Euclid, where the drawing *is* the proof (§28)

§28 says « do NOT only display equations ». The 84 × 36 rectangle is paved
with 36-squares, the remaining 36 × 12 strip with 12-squares, and nothing is
left. The last square's side **is** the GCD.

Three things make it teach rather than decorate:

- **Each calculation line is linked to its squares.** Hovering
  `462 = 3 × 147 + 21` highlights its three squares and dims the others;
  hovering a square highlights its line. A colour swatch on each line matches
  its squares even before hovering. The equation and the figure stop being
  two objects.
- **The remainder is drawn** (dashed outline): the rectangle that becomes the
  next step's rectangle, which is what makes the recursion visible.
- **Zoom, pan and « قرّب على آخر المربّعات »**. On `1071 / 462` the final
  21-squares are a sliver at full view; the focus button frames them and the
  side labels appear. Without it the last step — the one that concludes the
  algorithm — is literally invisible.

The squares are **square**: `.sa-ml-nb__euclid svg { height: auto }` is
load-bearing, since a fixed height stretches them into rectangles and the
drawing would then contradict what it demonstrates.

### 5l.8 Practice: predict → reveal → verify (§48 – §53)

`practice.js` is pure and testable. Four rules hold by structure:

1. **Nothing ever blocks.** `checkAnswer` returns a verdict, never a lock:
   there is no "blocked" state in the module, so one cannot arrive. The
   laboratory behind the question stays manipulable (§54).
2. **Errors explain by drawing (§53).** A wrong answer never renders « خطأ ».
   Each challenge carries a `reveal` — values to place on a line, pairs to
   show, a grid to fill — and an `askKey`: « أيّهما يقع إلى اليمين؟ ». The
   module says *what* to show; `RevealStage` obeys. **All twelve families
   draw something**; the divisibility family shows the rule applied to the
   student's own digits, which is its correct explanation.
3. **Hints reveal the method, not the answer (§52).** `hintKeys` is a
   sequence from general to specific; the answer comes only on request.
4. **Difficulty is conceptual, not bigger numbers (§51).** `LEVEL_KINDS`
   states it: level 1 compares two integers, level 3 compares a fraction to a
   percentage, level 5 needs multi-step reasoning.

Answers are read in **every** writing (`0,5`, `1/2`, `50%`), because refusing
`0,5` when expecting `1/2` would teach nothing about numbers, only about the
parser. Where a gesture says it better, the answer **is** a gesture (§49):
dragging a point onto the line, pushing a slider to exactly 35 %.

Scoring is two counters — solved and attempts. No streak, no medal, no sound
(§56).

### 5l.9 Notebook (§55)

No second notebook system. « أضِف إلى كرّاسي » opens the platform's
`NotebookWindow` with starter content, exactly as the knowledge map does
(`AddToNotebookButton`). The Lab has no lesson context, so the note is born
without a lesson — which the notebook accepts. The in-tool note list is a
scratchpad for the session's discoveries; the كرّاس is the durable memory.

### 5l.10 Document and limits

`numberLab`, 20 KB server cap (`MathLabTools.php`). Thirteen sub-states, each
a few dozen bytes; a plain document weighs ~700 bytes, the measured worst case
~13 KB (notes dominate).

**Lists are never stored**: divisors, multiples, primes, sieve passes and
terms are recomputed from their number — storing a thousand of them would be
storing what we know how to redo. The only stored construction is the factor
tree of §24, which the student *builds*, and `normalizeTree` bounds its depth
and **refuses an incoherent split** (a node whose children's product is not
the node).

Limits, stated plainly: numbers analysed up to `MAX_EXPLORABLE` (10⁷), sieve
up to `MAX_GRID` (10⁴), denominators up to `MAX_DENOMINATOR` (10³), 8
proportionality columns, 30 notes. These are **drawing** limits, and the
interface says which one it met rather than freezing.

Not in V1: no CAS, no symbolic algebra, no scientific calculator, no square
roots beyond the approximation presets, no analytics (the Math Lab has none),
no PNG export.

## 5i. « أعمالي » — the personal workspace

> **Authoritative** for the saved-work surface: its architecture, the work
> card, previews, search, filters, sorting, selection and bulk actions.
> Lives in `apps/web/src/features/mathlab/work/`, rendered by `MathLabHome`
> under the instruments. Replaced the flat `DocumentList` on 2026-09-23.

The mental model is **create → save → return → continue → organise**. The
instruments serve the first verbs; this surface serves the last two: finding
one piece of work among fifty, and tidying up. It is not a file manager and
not a second home page — it is where a student comes back to what they made.

### 5i.1 Where the work happens, and why

The list endpoint already returns every document **without `data`**: the
envelope plus a summary of a few hundred bytes. A student has dozens of
works, not tens of thousands. So the whole query — search, filters, sort —
runs **in memory**, in one pure module (`work/workFilters.js`), and answers
at the keystroke with no round trip.

This is deliberately *not* what « Mon cahier » does (`useNotesSearch`, server
side, paginated, 300 ms debounce): notes carry rich text and are counted in
hundreds, so the server has to do that work. Two surfaces, two honest
answers — the cost is in the data, not in a house style. The day this stops
being true, `fetchMathLabDocuments` grows parameters and the interface does
not change.

One request loads the page. Nothing paginates, nothing virtualises.

### 5i.2 Previews — drawn from the summary, never from the instrument

**A card never mounts an instrument.** No three.js scene, no Excalidraw, no
MathLive, no mafs — for any number of cards. This is the rule that lets the
page stay fast, and it is verified in the browser: `mathlab-work.mjs` fails
if any heavy chunk is requested while the workspace renders.

What makes it possible is `summarize(data)` (§3.1): each tool reduces its own
state to a tiny JSON — the grapher's expressions and window, the solid and
its dimensions, the equation and the step reached, the die's frequencies, the
whiteboard's stroke silhouette. The server stores it in `summary` (§4) and
returns it **in the list**, so the cards already hold everything they need.

`work/WorkPreview.jsx` then draws inline SVG. It dispatches on
`summary.kind` — the **shape** of the preview, not the tool — so a future
instrument that produces a curve reuses `curve` without a line of change
here. That is what keeps §30's rule (no scattered `if (tool === …)`) true.

| `kind` | Drawn as | Fed by |
|---|---|---|
| `curve` | the curves in their window — expressions resampled to 40 points (`detail.curves`), or ready-made points (`detail.polylines`) | `functionGrapher` · `conics` |
| `solid` | the solid's silhouette in cavalier perspective | `geometry3d` |
| `strokes` | each stroke's bounding box, scaled into the frame (24 max) | `whiteboard` |
| `chart` | a bar chart of the frequencies, or of the series' histogram | `probabilityStats` |
| `equation` | the first equation and the one reached, as `dir="ltr"` text | `algebra` |
| `vectors` | the resolved scene's points and arrows, in their frame | `vectors` |
| `triangle` | the right triangle at its true proportions, or the circle | `trigonometry` |
| `sequence` | the first terms as a dot plot, recomputed from the definition | `sequences` |
| `shapes` | the figure and its image, superposed — solid outline and dashed | `transformations` |

`curve` carries **two** writings because two kinds of instrument produce
curves: `detail.curves` holds expressions `y = f(x)` that the thumbnail
resamples (the grapher), while `detail.polylines` holds points already
computed (the conics lab — a circle is not a function of `x`, and sampling it
in a card would mean shipping the conic engine into the list). Both draw
identically; only the road in differs. This is exactly what `kind` naming a
*shape* rather than a tool is for.

Two honesty rules the drawings keep:

- **The preview's evaluator is not the grapher's.** `WorkPreview` recognises
  the programme's common forms (`x^2`, `a·x + b`, `sin`, `√`, `1/x`…) and
  draws a flat line for anything else. The real parser
  (`expressionParser.js`) is heavy and lazily loaded; putting it in a list
  would break the rule above. A thumbnail may be approximate — it must never
  claim to be the curve.
- **A summary never costs a save.** `summarizeDocument` (`toolContract.js`)
  wraps every call: a tool meeting a document older than itself returns
  `null`, the card falls back to its icon, and the work is saved regardless.
  The server does the same with an oversized summary (§4).

### 5i.3 The card (`WorkCard.jsx`)

One component, two layouts (`data-view="grid"｜"list"`), so a fix lands in
both. It says, in order: what it is (the preview), what it is called, which
instrument made it, and when — « آخر تعديل: منذ ساعتين », via the platform's
own `timeAgo` (`notebook/space/noteMeta.js`), never a hard-coded string.

Tidying gestures live in a single `⋮` menu — open, rename, duplicate,
favourite, delete — never five buttons per card. The star is the one action
promoted out of the menu, because it is the one a student repeats.

A document whose tool has left the registry stays **visible** but does not
open, and says why (« هذه الأداة لم تعد متوفّرة »). A student's work is never
silently hidden because an instrument was retired.

### 5i.4 Search — forgiving, not clever

`normalizeSearchText` folds exactly what a student would not type: Latin
case and accents (« Étude » found by `etude`), Arabic diacritics (تشكيل) and
tatweel, the alif/ya/ta-marbuta variants, and Arabic-Indic digits (٣ → 3).
Nothing more — this is not an Arabic search engine, and §7 of the brief says
not to build one.

It searches the title, the **instrument's Arabic name** (so « راسم » finds
grapher documents whose titles never mention it), and the `text` the tool
put in its summary — which is why « 2x + 3 » finds an algebra document and
« x^2 » finds a grapher one.

### 5i.5 Filters, sorting, selection

Filters: by instrument (from the **registry**, each chip carrying its count),
by period (`today` / `week` / `month`, the last two being 7 and 30 rolling
days — « recently », not « since Sunday »), and favourites. Active filters
are always visible as removable pills, with « مسح الكل » past the first.

Sorting: recently modified (default), recently created, oldest, name أ→ي and
ي→أ. Search, filters and sort **combine and never reset one another**.

Selection is a checkbox per card — armed on hover, on focus, and always on a
touch device. Selected state is carried by the checkbox, a border, a
background *and* `data-selected`, never colour alone. « تحديد الكل » covers
what is **displayed**; changing the query clears the selection, so filtering
can never delete something the student stopped seeing.

Bulk actions (favourite, unfavourite, delete) sit in a bar fixed above the
student tab bar, and delete always asks first — the platform's own
`ConfirmDialog`, the same one « Mon cahier » uses. Arabic plurals carry all
six forms, so two works read « عملان محدَّدان », not « 2 عمل ».

### 5i.6 Ownership

Every route resolves the owner from the authenticated account; the bulk
route bounds its query by `user_id`, so a forged list of ids touches
nothing and reveals nothing (a foreign document is « not found », never
« forbidden »). Proven by `MathLabDocumentFlowTest`: bulk delete and bulk
favourite sent with another student's id return a `count` that excludes it
and leave that row intact.

The front end filters for display only; it is never the boundary.

## 5m. مختبر التحليل والدوال — Analysis & Calculus Lab V1

> **Authoritative** for the analysis lab: the symbolic derivative and its
> honest fallback, the seven laboratories in one environment, the live
> readout, the exact/approximate contract, the limit tables, the Riemann
> construction and the practice engine.
> Lives in `apps/web/src/features/mathlab/tools/analysis/`.

### 5m.1 The rate of change opens; the calculus waits one click

The 4AM programme contains **no derivative, no limit, no integral** — all of
differential calculus is lycée material. Unlike the conics lab (whose دائرة
*is* in the programme, §5k.1) or the trigonometry lab (whose right triangle
is, §5g.1), this instrument has **only one authentic 4AM anchor**: the
**الدوال الخطية والتآلفية** of LP 3.7 and 3.8 and their coefficient directeur
— which is, exactly, `(f(b) − f(a)) / (b − a)`.

So the instrument **opens on `lab: 'secant'`** with `f(x) = 2x + 1`, two
points A(1 ; 3) and B(3 ; 7), the secant through them, the Δx/Δy triangle and
the slope. A 4AM student recognises the gesture from their own book and can
play in one second (§53 of the brief). The tangent, the derivative, limits,
integrals, function study and transformations are **built, complete, and one
click away** — but never the first screen. This is the rule already held for
the dot product (§5f.10), the unit circle (§5g.1), sequences (§5h.1),
التحاكي (§5j.1) and the conics (§5k.1), applied a sixth time.

`presets.js` carries the same split in data: `level: 'programme'` holds three
affine/linear functions shown first, `level: 'beyond'` holds eleven
(quadratic, cubic, rational, radical, trigonometric, exponential,
logarithmic) behind a `<details>` that says so in Arabic. `analysisState.test.js`
asserts that no programme-level preset contains a power, a root or a
transcendental function.

### 5m.2 Seven laboratories, one environment

`LABS` = `secant · tangent · derivative · limit · integral · study ·
transform`. They are **not seven pages**: the curve, the repère and the
window never change when you switch. What changes is which **layers** are lit
(`layers.js`, `layersForLab`) — the objects of the current experiment. §4 of
the brief asks exactly this ("they should form one coherent mathematical
environment"), and the implementation gets it by construction, because a lab
is a set of layer keys and nothing else.

`grid` is the one layer `layersForLab` never touches: it belongs to the
*repère*, not to the experiment.

### 5m.3 The derivative is symbolic when it can be, measured when it cannot

`symbolicDerivative.js` differentiates the grapher's **own AST** — a single
AST → AST pass over the rules (product, quotient, chain, power, `a^u` with
constant `a > 0`). No computer-algebra dependency was added: §34 asks to
check the existing architecture first, and `expressionParser.js` already
produced the tree. mathjs (~170 KB minified) would have bought nothing here.

It returns `null` — honestly — for `x^x` and for a non-positive constant
base, and the caller then falls back to `numericalDerivative.js`, the
grapher's Richardson-extrapolated measurement. **The interface says which one
it is showing**: `formatMaybeExact` prints `= 4` for a rule-derived slope and
`≈ 4` for a measured one, and the inspector carries a sentence naming the
source. That is §35 ("if a result is numerically approximated, clearly
distinguish it").

The two implementations are **cross-validated**: `symbolicDerivative.test.js`
compares the symbolic derivative against the numerical one on 22 functions ×
8 abscissae. Two independent methods agreeing to 1e−6 is what licenses
showing `f′(x)` to a student.

Two printing traps the QA caught, both now regression-tested:
- `mul` folds nested constants, because `3·(4·x³)` printed **`34x^3`** — which
  a student reads as thirty-four. `pow` folds `(u^a)^b` for the same reason:
  `x^2^2` is ambiguous (the grammar is right-associative, so it means x⁴).
- `MathText`, the LTR wrapper component, is **not** called `Math`: a component
  named `Math` shadows the global object inside its module, and `Math.abs(…)`
  then calls a React component. It crashed the whole inspector, and no unit
  test saw it — the module loads fine; it breaks at call time.

### 5m.4 The live readout — reading while manipulating

The panel has three tabs: **الضبط** (set), **القراءة** (read), **التمارين**.
While the readings lived only inside القراءة, a student dragging the `b`
slider in الضبط saw **no number change at all**: the loop the whole
instrument exists for — «أغيّر شيئًا → أرى النتيجة مباشرة → ألاحظ العلاقة»
(§3) — was cut in half by a tab.

`LiveReadout.jsx` fixes it: two or three numbers, chosen by the open lab (Δx,
Δy and the slope for the secant; x, f(x), f′(x) for the tangent; the two
one-sided limits; the integral and the Riemann sum; a/b/c for the
parameters), rendered **above the tabs**, where no tab can hide them. It
computes nothing — it reads the resolved scene, like everything else that
draws.

Never more than three cells: a strip of eight values is not readable at a
glance while a finger is on a slider (§44). Everything else stays in القراءة.

### 5m.4b Every input is a math field (MathLive)

Function expressions and practice answers are `<math-field>` elements, not
`<input>`: `1/x` appears as a stacked fraction, `√x` under a radical, and on a
phone the virtual keyboard puts x, powers, roots and fractions under the
thumb — typing `\frac{x^2-1}{x-1}` on a system keyboard was an ordeal.

MathLive's **configuration** is the grapher's (`functionGrapher/mathliveSetup.js`,
idempotent and global: local fonts, no sound, no outgoing request). Only the
**keyboard layout** is new: one for expressions (with `a` and `b`, so the
parameter families of §24 can be typed) and one for answers (digits, a
fraction, a minus — no sin/cos/π, because one answers `2,5` or `½`, never
`sin(x)`). The virtual keyboard is global state, so the lab installs its
layouts on mount and restores the previous ones on unmount.

Values are committed on **Enter or blur**, never per keystroke: otherwise every
letter would relaunch parsing, scanning and saving, and `x^` mid-typing would
flash an error under the student's fingers (§46, §47). Escape restores the last
committed value.

Three integration bugs, all found in the browser:

- **`\frac12`** — MathLive writes LaTeX's short form whenever an argument is a
  single character, so a student typing ½ sends `\frac12`. The tokenizer merged
  the digits into `12`, and a correct answer was rejected as unreadable. `\frac`
  now splits the two digits that follow it; braces are untouched
  (`\frac{12}{5}` still reads 2.4). Fixed in the **grapher's** parser, so the
  grapher gains it too, with its own regression tests.
- **Answers arrive as LaTeX.** `parseStudentNumber` now accepts `\frac{1}{2}`,
  `\sqrt{4}`, `\pi` — by handing the string to the grapher's evaluator rather
  than writing a second LaTeX reader. An expression still in x (`2x`) is
  refused: it is not a numeric answer.
- **An empty answer** said "I did not understand" instead of "write one
  first". The two are different messages and now stay different.

One behaviour changed for the better and a test had to follow: MathLive
auto-closes brackets, so `((x` becomes `((x))` — valid mathematics. Unbalanced
parentheses can no longer be typed, and that QA case was retired rather than
"fixed".

### 5m.5 The numerics, and five defects only QA found

`analysisMath.js` is pure: roots, critical points, variation and sign
intervals, discontinuities, one-sided/two-sided/infinite limits, asymptotes,
Riemann sums, Simpson quadrature, intersections, area between curves, an
antiderivative sampler. It never returns a bare number it is unsure of — it
returns `{ok: false, reason}` or marks `approximate: true`.

Five defects were found by verification rather than by reading, and each is
now a named test:

| Defect | Why it mattered | Fix |
|---|---|---|
| `1/x` reported a **root at 0** | a pole is not a zero — a red dot on the axis is a false statement | probe continuity (`isContinuous`) before accepting a sign change |
| `x³` had **no critical point** on an asymmetric window | §17's canonical example (a horizontal tangent that is *not* an extremum) vanished when the student panned | refine the minimum of \|f′\| by golden section **first**, then judge the refined value against its neighbours — no threshold on raw samples can work, the grid never lands on the zero |
| `(x²−1)/(x−1)` classed **continuous** at 1 | the removable discontinuity — §15's whole point — was invisible | a hole is measure-zero: the grid can step over it, so the student-chosen limit point is **probed directly** |
| oblique asymptote of `x²/(x−1)` **lost** | `f(x) − m·x` at x = 10⁷ with m off by 1e−7 subtracts exactly the intercept — catastrophic cancellation | round a near-half-integer slope before computing the intercept |
| `y = 1e−7` shown as a horizontal asymptote | the mathematics says `y = 0`; 1e−7 is noise displayed as a value | `snapToZero` / `snapToNice`, applied only to asymptote parameters |

`findRoots` also distinguishes `simple` from `touch` (x² meets the axis
without crossing), and the touch tolerance is **local**, not scaled to the
window's amplitude — a simple root of `x²−4x+3` on [−10, 10] was being
classed as a double root because |f| reaches 143 at the edge.

### 5m.6 جدول التغيّرات — the variation table

The function study ends where an Algerian student's own work ends: in a
**variation table**. `variationTable.js` builds it from the analysis already
done — it computes no new mathematics — and `VariationTable.jsx` lays it out:

```
x       │ −3        −1         1         3
f′(x)   │      +     0    −     0    +
        │            2                  18
f(x)    │      ↗        ↘        ↗
        │ −18                −2
```

Three decisions carry the pedagogy:

- **The height of a value is information.** A value reached by rising sits at
  the top of its cell, one reached by falling at the bottom. A **stationary**
  point that is not an extremum (x³ at 0) sits in the **middle** — putting it
  at the top would read as a maximum, which is exactly the misconception §17
  forbids. The table then shows `+ 0 +` with both arrows rising: f′ vanishes
  and the function keeps climbing.
- **A discontinuity cuts the table** with a double bar and no value, so `1/x`
  is decreasing on ]−∞ ; 0[ **and** on ]0 ; +∞[, never "on ℝ∗" in one run.
- **It is a CSS grid, not a `<table>`.** Vertical position carries meaning
  here and a table cell would centre it away; the grid keeps the layout and a
  full sentence (`describe`) keeps it readable to a screen reader. The grid
  rows are named explicitly — letting a full-width row label fall to implicit
  placement pushed every arrow out of its row, and visual QA saw a variation
  table with no arrows at all.

The table is `dir="ltr"`: x increases to the right, like the graph beside it.
A mirrored variation table would contradict the curve.

Building it exposed three misclassifications in `findDiscontinuities`, all
now regression-tested at several windows, because each appeared only for
certain sampling grids:

| Symptom | Cause | Rule now |
|---|---|---|
| a second double bar at x = 0,012 on `1/x` | near a pole f varies by 83 between neighbouring samples; a relative threshold called it a jump | a jump must survive the **continuity probe**, and the scale is the window's amplitude |
| that bar reappearing at x = 0,00095 on another window | right beside a pole neither one-sided limit stabilises, so both read `none` — and `none` fell through to "jump" | two limits that cannot be read **prove nothing**; the neighbouring pole is already reported |
| `√x` reported as a **jump** at 0 | only one side exists | one side missing is a **domain edge**, not a break: the curve *begins* there |

An uncertain limit is also held to a looser tolerance (1e−3 instead of 1e−6)
before a jump is claimed: near-pole readings differ only by sampling noise,
while a genuine hole's two limits agree far more closely than that.

### 5m.7 Signed integral ≠ geometric area, and the rectangles are objects

`signedAndGeometricArea` returns both and a `differ` flag; `buildAreaPath`
cuts the filled region **at the zeros of f** and tags each piece with its
sign, so the lobe below the axis is drawn in red and the one above in blue.
On sin from 0 to 2π the readout shows `∫ ≈ 0` beside `area ≈ 4`. §21 forbids
passing one off as the other, and here the difference is the lesson.

`riemannSum` returns the **rectangles themselves**, not just their sum: it is
the drawing that teaches. A rectangle whose height is undefined is marked
`defined: false` and left unpainted rather than counted as zero.
`definiteIntegral` **refuses** an improper integral (`reason: 'singularity'`)
instead of returning a meaningless number.

### 5m.8 State format (`analysisState.js`, `ANALYSIS_SCHEMA_VERSION = 1`)

```
{ lab, functions[≤2], parameters{a,b,c}, point, secondPoint, limitPoint,
  bounds{a,b}, riemann{n,mode}, constant, transform|null, layers{26},
  view|null, practice{solved,seen}, preset|null }
```

A new document measures **~790 bytes**; the worst case (two 200-character
expressions, every layer flipped, a window) stays under 1,5 KB. Server bound:
**8 KB** (`MathLabTools.php`), asserted by `analysisState.test.js`.

**Nothing that can be recomputed is stored**: no curve samples, no
derivative, no roots, no extrema, no limit tables, no Riemann rectangles.
They follow from the expression and the window, and keeping a copy would be
keeping a lie in waiting — the day the function changes and the table does
not. The approach animation, the current challenge, the revealed hint, the
pending prediction, the open tab and the open panel have **no field at all**,
so "do not persist transient animation state" holds by construction.

### 5m.9 Practice, prediction, experiments — none of which can block

`practice.js` generates eight families of challenge; at `level: 'programme'`
only `averageRate` is drawn, because that is the one that belongs to 4AM.
`checkAnswer` returns a verdict, never a lock — there is no "blocked" state in
the module, so one cannot arrive. Hints are a graded ladder of three and the
third still shows a method, not a number (§31). A wrong answer prints the
**computed** explanation (`f(a) = …, f(b) = …, slope = …`), never "faux"
(§29). The `riemannClose` family accepts **any** sufficiently large n:
demanding the minimal one would punish a correct answer.

Predictions are kept separate from challenges and are **never scored** (§28).
Six guided experiments (`EXPERIMENTS`) each set up a state and ask what will
happen; the secant→tangent one animates B toward A with a floor of 0.02 —
never zero, because at zero the secant ceases to exist and because a limit
must stay an *approach*.

`parseStudentNumber` accepts `2,5`, `−3` (real minus sign), `1/2` and spaces:
what an Algerian student actually types. It returns `null`, never `NaN`.

### 5m.10 No second coordinate system, no second anything

`AnalysisPlane.jsx` imports `viewport.js`, `gridStep.js`,
`useViewportGestures.js` and `grapherFormat.js` from the grapher **unchanged**
— one repère on the platform (§33). `FunctionCurve.jsx` is reused as-is for
every curve. The parser and the evaluator are the grapher's: no new grammar,
and the student's input is **never executed**. `makeRng` comes from the
lessons' `randomUtils.js`, as in the sequences and conics labs.

The repère is **orthonormal** here (`resizeViewport` fixes height from
width), unlike the sequences lab: x and y are both lengths of the same plane,
and a slope of 1 must *look* like 45°, or "the coefficient directeur is the
slope" stops being true to the eye. The consequence caught by visual QA: a
flat preset window (sin on y ∈ [−2 ; 2]) gets widened to ±6,5 and the wave
occupies a third of the screen. Preset windows must be roughly square, and
`analysisState.test.js` fails any that wastes more than 30 % of the height.

`summarize.js` speaks `WorkPreview`'s **own** dialect — `kind: 'curve'` with
`detail.polylines` of `{x, y}` points and `detail.viewport` as a quadruple —
so «أعمالي» draws a real 1/x with both branches and a lifted pen at the pole,
without one line added to `WorkPreview.jsx`. It emits polylines rather than
expressions because the card's little shape-recogniser understands only
"common programme forms" and would have drawn `(x²−1)/(x−1)` as a straight
line: a thumbnail that lies about the document.

### 5m.11 Verification

- `symbolicDerivative.test.js` (41) — the rules, the printer, and the
  cross-validation against the numerical derivative.
- `analysisMath.test.js` (~60) — roots, critical points, variation, sign,
  discontinuities, limits, asymptotes, integrals, Riemann, intersections,
  domain; every defect of §5m.5 has a named test, including
  window-independence of the stationary point.
- `variationTable.test.js` — the parabola, the cubic, the stationary point at
  mid-height, the pole that cuts the table, the affine with one arrow, and
  the polite refusal.
- `analysisState.test.js` — the document, the normalisation of hostile input,
  the purity of the transitions, the byte bound, the preset framing, the
  LaTeX-safe `substituteX`, and the summary contract.
- `symbolicEngine.test.js` — the AST translation (including a nested
  fraction), every capability, and the **verification contract**: a right
  answer or none, never a wrong one.
- `variationTable.test.js` — the parabola, the cubic, the stationary point at
  mid-height, the pole that cuts the table, the affine with one arrow, the
  polite refusal, and the **±∞ at the edges**, identical at every zoom.
- `apps/web/e2e/mathlab-analysis.mjs` — **69 browser checks**: the opening
  screen, the live readout updating *without changing tab*, the secant
  converging to the tangent (4 → 3 → 2,5 → 2,1 for f′(1) = 2), the stationary
  point of x³, both limit tables and their verdict, the removable hole,
  Riemann error shrinking with n, signed ≠ geometric area, study rows lighting
  the graph, parameters and transformations, graded hints, a wrong answer
  blocking nothing, four invalid expressions each answered in Arabic,
  save/reload, RTL with LTR notation, three viewports down to 320 px, and
  keyboard access to the draggable point — plus the **math fields**: the
  function field is a `<math-field>`, a fraction typed as `1/2` becomes
  `\frac12` and is *understood*, and an empty answer asks for one instead of
  accusing; and the **variation table**, whose arrows, heights, f′ signs and
  single pole bar are read from the DOM.

### 5m.12 Curriculum scope and limits

The derivative, limits, integrals, asymptotes, the second derivative and
function study are **lycée material, built and complete, never the opening
screen** (§5m.1). Out of scope for V1, deliberately: symbolic integration,
formal limit proofs, equation solving, series, differential equations,
implicit differentiation, parametric and polar curves, multivariable
calculus.

Honest limitations:
- **Two functions at most** (f and g). §23 and §26 ask for two, not six.
- **`a^u` only for a constant `a > 0`**; `u^v` with both variable falls back
  to the numerical derivative, and the interface says so.
- **Limits are read from a table**, never proved. Every finite limit carries
  `approximate: true` and is printed with `≈`. A function oscillating faster
  than the approach steps (sin(1/x) at 0) is reported as `none` — no limit
  claimed — rather than guessed.
- **The study reads the visible window**, not ℝ: a sentence in the panel says
  so, and the domain is called « ما هو معرّف داخل النافذة المعروضة ».
- **No PNG export** and no analytics service — the Math Lab has none to
  integrate with (§44 of the brief asks to reuse an existing one; there is
  none), so practice keeps two counters and nothing more.

## 5n. مختبر المنطق والبرهان — Logic & Proof Lab V1

> *La vérité, on la CHERCHE.* L'élève ne lit pas qu'une implication est
> fausse dans un seul cas : il déplace x et voit la phrase basculer ; il ne
> lit pas qu'un contre-exemple suffit : il en trouve un et le laboratoire lui
> dit pourquoi cela a suffi. Ce n'est pas une leçon de vocabulaire logique.

Route `/espace/atelier/logique`, id `logic`, icône `GitBranch`.

### 5n.1 L'ouverture : une expérience, pas un menu

§54 du cahier des charges demande que l'instrument n'ouvre pas sur un
sommaire. Il ouvre donc sur **le laboratoire du contre-exemple**, une
question posée et une droite pour chercher :

> هل تستطيع إثبات أنّ هذه العبارة خاطئة؟ — « كلّ عدد أوّلي أكبر من 2 هو عدد زوجي. »

Trois façons de chercher, parce qu'un élève cherche de trois façons : le
curseur (le doigt), le champ (l'idée précise), le hasard (l'exploration).
La première valeur qui fait tomber l'énoncé déclenche l'explication —
« مثال واحد يكفي » — jamais un simple « bravo ».

`createLogicData()` ouvre donc sur `area: 'counterexample'`, et
`logicState.test.js` échoue si cela change.

### 5n.2 Onze aires, un seul laboratoire

Comme le مختبر الأعداد (§5l), les aires ne sont **pas des routes** : une URL,
un document, et chaque aire garde SES réglages — l'élève qui règle un exemple
dans « الشرطية », passe au contre-exemple et revient retrouve le sien.

| Aire | Ce qu'on y fait | §|
|---|---|---|
| العبارات | classer صحيحة / خاطئة / تتعلّق بقيمة المتغيّر, et voir la vérité comme une RÉGION de la droite | §5-7 |
| الروابط | basculer P et Q, lire l'expression et la ligne ALLUMÉE de la table | §11-12 |
| الشرطية | le cas critique, l'inclusion P ⊂ Q, les quatre formes colonne contre colonne | §13-16, §20 |
| التكافؤ | les deux sens, examinés séparément | §17 |
| المثال المضاد | chercher, se tromper, trouver — et lire pourquoi un seul suffit | §8-10, §54 |
| شرط ضروري وكافٍ | les deux questions AVANT le vocabulaire | §18-20 |
| الكميات | ∀ et ∃, et la distinction « pas trouvé » ≠ « prouvé » | §21-23 |
| النفي | De Morgan ligne à ligne, ¬∀ → ∃¬ | §24-25 |
| بناء البرهان | poser, ordonner, compléter ; l'arbre | §26-36 |
| البرهان بالتراجع | l'ESCALIER, les exemples qui marchent et ceux qui échouent, la construction | §28 |
| أخطاء الاستدلال | nommer la faute ET la réfuter | §33 |

### 5n.3 Où vit la vérité logique

**Aucune vérité n'est décidée dans un composant.** Tout passe par deux
modules purs, testés à part :

- `logicMath.js` — les cinq connecteurs (totaux sur {V,F}², `null` si une
  entrée manque : une case non réglée n'est pas « faux »), les quatre formes
  d'implication, De Morgan, les quantificateurs, `truthIntervals` (la vérité
  comme régions), `vennPartition` / `analyzeImplication` (les verdicts d'un
  énoncé concret), `conditionReading` (nécessaire/suffisant) ;
- `proofMath.js` — une preuve est un **graphe de dépendances**, pas une liste.

Les composants appellent, affichent, et n'arbitrent rien.

### 5n.4 Les énoncés sont des préréglages VÉRIFIÉS

§48 : « Every generated problem and every validation rule must be
mathematically verified. » La seule façon de le garantir est de **ne rien
générer** : `presets.js` porte des énoncés concrets écrits à la main, et
`presets.test.js` exécute chaque prédicat sur son domaine et le compare au
verdict déclaré. Un préréglage qui ment ne franchit pas la suite de tests,
donc n'atteint pas un élève.

Deux pièges qui y sont explicitement tenus :

- **la parité des négatifs.** `isEven`/`isOdd` passent par `Math.abs(n % 2)` :
  en JavaScript `(-3) % 2 === -1`, et `n % 2 === 1` aurait déclaré −3 pair.
- **le polynôme d'Euler.** `n² + n + 41` est premier pour n = 0…39 et composé
  en 40 (1681 = 41²). Quarante vérifications réussies ne prouvaient rien :
  c'est §22 rendu tangible, et le test le vérifie terme à terme.

### 5n.5 « Pas trouvé » n'est jamais « prouvé » (§22)

C'est la règle que tout l'instrument sert. `searchVerdict` rend un **statut**,
jamais un booléen :

| Quantificateur | Recherche | Statut | Ce que l'écran a le droit de dire |
|---|---|---|---|
| ∀ | contre-exemple trouvé | `disproved` | réfutée — un seul suffit |
| ∀ | rien trouvé | `notFound` | « فُحصت N قيمة » + **« هذه ملاحظة، وليست برهانًا »** |
| ∃ | témoin trouvé | `proved` | prouvée — un seul suffit |
| ∃ | rien trouvé | `notFound` | observé, et **pas** réfuté |

Quand un ∀ résiste, l'écran renvoie explicitement vers « بناء البرهان » : la
suite du raisonnement n'est pas d'essayer une vingt-sixième valeur.

C'est la même honnêteté que `analyseTrend` des متتاليات (§5h.4) et que
`verifiedLimitAtInfinity` de l'analyse (§4b.3) : l'instrument dit ce qu'il a
observé, pas ce qu'il aimerait conclure.

### 5n.6 La preuve est un GRAPHE, pas une liste (§27, §32, §36)

Chaque étape déclare ses prérequis (`requires`), et elle est posable dès
qu'ils sont posés. Trois conséquences :

- **§36 — plusieurs chemins valides.** Les deux cas d'une disjonction se
  posent dans l'ordre qu'on veut, et les deux sont acceptés. Une liste
  ordonnée aurait refusé la moitié des preuves justes.
- **§27 — un refus qui EXPLIQUE.** `validateStep` rend une raison typée
  (`missingPrerequisite` + les étapes qui manquent, `notInProof`,
  `alreadyPlaced`), jamais `false`. L'écran écrit « هذه النتيجة لا تتبع
  مباشرةً من المعطيات الحالية » et NOMME ce qui manque — sans dire quelle
  carte poser. Le message **reste** : une explication qui s'efface au bout
  d'une seconde n'est pas une explication.
- **§32 — l'arbre sort du même graphe.** `proofLayers` répartit les étapes en
  rangs ; une conclusion qui dépend de deux branches les REJOINT, ce qui est
  précisément ce que §32 veut montrer.

Quatre preuves dans « بناء البرهان » (directe, contraposée, absurde,
disjonction de cas). La **récurrence a son aire à elle** — §5n.6bis.

Trois modes sur le même graphe : **ابنِ**, **رتّب** (§35), **الخطوة الناقصة**
(§34, avec des distracteurs qui disent pourquoi ils sont faux).

### 5n.6bis البرهان بالتراجع — l'escalier qu'on MONTE

L'aire a **trois** escaliers, et c'est délibéré : on **fait** avant de
théoriser, et on commence par la forme que l'élève rencontrera à l'examen.

1. **L'escalier des PROPOSITIONS** (`RecurrenceClimb.jsx`, §5n.6ter) — la
   récurrence telle qu'elle s'écrit au BAC : `uₙ < 3`, `wₙ = −2`, des suites
   définies par récurrence, parfois auxiliaires. Il ouvre l'aire.
2. **L'escalier des RÈGLES** (`StairsClimb.jsx`, ci-dessous) — « ma règle
   décrit-elle cette suite ? ». Plus simple : pas de relation à choisir, pas
   de suite auxiliaire. C'est le premier contact avec l'idée qu'une
   vérification finie ne prouve rien.
3. **L'escalier du PRINCIPE** (`InductionStairs.jsx` en mode démonstration)
   — ce qui arrive quand une moitié du principe manque.

#### L'expérience (`StairsClimb.jsx`) — le cœur de l'aire

    اكتب قاعدتك → اختبر الخطوة → السلم يتلوّن → الخطوة التالية → لاحظ

L'élève écrit une règle (`uₙ = 2n + 1`), la teste **une marche à la fois**,
et voit chaque marche verdir ou rougir. Rien ne se calcule d'avance : une
règle qui verdit trois marches puis rougit à la quatrième n'enseigne rien si
les quatre s'affichent ensemble.

**La saisie libre passe par le moteur EXISTANT.** `inductionLab.js` appelle
`compileSequenceExpression(src, { explicit: true })` — celui du مختبر
المتتاليات, qui appelle lui-même l'analyseur du grapheur. Une seule grammaire
sur la plateforme, un seul jeu de fonctions, **aucun `eval`, aucun
`new Function`** : la saisie devient un arbre, jamais du JavaScript exécuté.

**Et donc on ne promet que ce qu'on tient (§7).** `SUPPORTED_GRAMMAR` et
`SUPPORTED_EXAMPLES` ne sont pas des listes écrites à la main : chaque entrée
est COMPILÉE et ÉVALUÉE au chargement du module (`grammarProbe`). Si le
grapheur cessait d'accepter `n(n+1)/2`, l'exemple disparaîtrait de l'écran au
lieu d'être proposé à un élève qui recevrait une erreur. Le panneau
« ما الصيغ المتاحة ؟ » liste aussi ce qui **n'est pas** supporté par CET
escalier — le factoriel, `Σ`, les règles récurrentes — plutôt que de le
taire. Les récurrences, elles, sont traitées par l'escalier des propositions
(§5n.6ter) : ce n'est pas une limite de la plateforme, c'est une limite de
cet écran-ci, qui ne parle que de règles explicites.

Deux façons d'écrire, une seule grammaire : le champ libre, et un
constructeur à jetons (§8) dont la sortie est relue par le même compilateur.

| Ce que l'écran montre | Où |
|---|---|
| la suite attendue, valeurs visibles ou **cachées** (`اكتشف القاعدة`, §16) | table `uₙ` |
| la marche courante, sa règle, le calcul, l'attendu (§5) | panneau de résultat |
| « لماذا ؟ » — le calcul refait, l'écart nommé (§18) | dans le panneau, à la demande |
| ✓ N correctes · ✕ N à revoir · ○ N non testées (§23) | sous l'escalier |

**Le verdict est honnête, et c'est la leçon (§20, §24).** `climbVerdict`
rend quatre états et jamais « prouvé » :

| | Ce qu'on a le droit de dire |
|---|---|
| une marche rouge | **réfuté** — un seul contre-exemple suffit (§17) |
| des marches vertes, d'autres à faire | « تابع الصعود » |
| **toutes** les marches vertes | « تحقّق تجريبي » — *pas* une preuve, et l'écran enchaîne sur le passage de n à n+1 |

C'est la même honnêteté que `searchVerdict` pour les quantificateurs
(§5n.5), appliquée cette fois à la méthode elle-même.

**Le piège de chaque suite est choisi pour tenir (§17).** `2^n` avec la règle
`n² − n + 2` donne 2, 4, 8 — **trois marches vertes** — puis 14 au lieu de
16. `presets.test.js` exige de chaque piège qu'il tienne au moins deux
marches *et* qu'il finisse par casser : un piège qui tombe à la première
marche n'enseigne pas que réussir quelques fois ne prouve rien.

**§15 — changer de règle efface les verdicts.** Garder une marche verte
obtenue avec `2n+1` alors que l'élève écrit maintenant `2n` serait un
mensonge visuel, et précisément sur le point que l'écran enseigne.
`setStairsRule` compare les règles normalisées (espaces, casse) : réécrire la
même règle ne perd rien, en écrire une autre repart de zéro.

#### Le principe (`InductionStairs.jsx` en mode démonstration)

Le même dessin sert à montrer ce qui arrive quand une moitié du principe
manque — c'est ce qui suit dans la page, après l'expérience :

La récurrence n'est pas une cinquième stratégie rangée avec les autres :
c'est une **aire**, parce qu'elle se comprend par une IMAGE avant de se
comprendre par un enchaînement, et parce que ce qu'elle a de propre — deux
moitiés dont aucune ne suffit — demande un écran qui le montre.

Je sais monter sur la première marche, et je sais passer d'une marche à la
suivante ; donc je monte aussi haut que je veux. Deux interrupteurs, et
l'élève voit ce qui arrive quand une moitié manque :

| Base | Pas | L'escalier |
|---|---|---|
| ✓ | ✓ | se monte entièrement, marche après marche |
| ✗ | ✓ | les marches existent, mais **le pied ne se pose jamais** (une croix rouge au départ) : rien ne démarre |
| ✓ | ✗ | on monte sur la première, puis **un barreau est cassé** (pointillés rouges, ✕) : on s'arrête là, et tout ce qui est au-dessus reste gris |

Le `data-ml-lg-stairs-reach` vaut `−1` dans le deuxième cas : la portée du
raisonnement est *nulle*, et c'est mesurable, donc testable.

**Les flèches sont la chaîne, pas une décoration.** Chaque flèche relie le
haut d'une marche au haut de la suivante : elle *enjambe la contremarche*,
ce qui est exactement le geste que « P(n) ⇒ P(n+1) » décrit (§21). Elle est
vive quand la marche d'où elle part est acquise, coupée en pointillés rouges
là où le pas échoue. Ancrées ailleurs — l'erreur trouvée en QA visuelle —
elles flottaient à côté de l'escalier au lieu de le gravir.

**Des exemples qui marchent et des exemples qui échouent**
(`INDUCTION_CASES`), chacun avec son escalier, parce qu'on ne croit vraiment
qu'une récurrence tient sur deux pieds qu'après avoir vu un pied manquer :

- **`1 + 2 + … + n = n(n+1)/2`** — les deux moitiés tiennent, l'escalier se
  monte. L'exemple de référence.
- **`n = n+1`** — le PAS est formellement correct (si `n = n+1` alors
  `n+1 = n+2`), mais `1 ≠ 2` : aucune marche ne porte. C'est l'exemple qui
  montre qu'un pas **sans point de départ ne prouve rien**.
- **`2ⁿ > n²`** — vrai en 0 et en 1, **faux en 2, 3 et 4**, puis vrai de
  nouveau. Un élève qui vérifie deux cas et croit avoir fini se trompe, et
  l'escalier casse exactement là. C'est §22 (« checking a few examples
  proves nothing ») rendu visible sur la méthode elle-même.

Les trois sont vérifiés par le calcul dans `presets.test.js` : un
contre-exemple de méthode doit être aussi vrai qu'un exemple, sinon l'écran
enseignerait une fausseté en prétendant qu'une récurrence casse.

Les deux récurrences constructibles portent `1 + 2 + … + n = n(n+1)/2`
(égalité) et `2ⁿ > n` (inégalité — son pas ne se recopie pas du premier), et
leurs deux distracteurs sont les deux erreurs classiques, chacune expliquée :
« on a vérifié n = 1, 2, 3 » et « supposons vrai pour tout n » (c'est
supposer ce qu'on veut prouver ; on ne suppose qu'UN rang).

### 5n.6ter L'escalier des PROPOSITIONS — la récurrence du BAC

L'escalier des règles (§5n.6bis) ne sait poser qu'une question :
« ma règle `uₙ = 2n + 1` décrit-elle cette suite ? ». Les exercices réels du
BAC algérien n'ont pas cette forme. Ils ressemblent à ceci :

    u₀ = −1      uₙ₊₁ = ⅓uₙ + 2      démontrer que  uₙ < 3

ou, avec une suite auxiliaire :

    u₀ = −⅔   uₙ₊₁ = ¾uₙ − ½   v₀ = 4/3   vₙ₊₁ = ¾vₙ   wₙ = uₙ − vₙ
    démontrer que  wₙ = −2

Trois choses manquaient, et `RecurrenceClimb.jsx` les apporte :

1. une **proposition** est `gauche RELATION droite`, pas une formule ;
2. une suite peut être **récurrente**, pas seulement explicite ;
3. il peut y en avoir **plusieurs**, dont certaines **dérivées** des autres.

#### La couche mathématique (`inductionModel.js`)

    Définition d'exercice → analyse → contexte → résolution des dépendances
      → évaluation numérique → évaluation de la proposition → escalier

**On n'écrit toujours pas un second analyseur.** `compileTerm` appelle
`parseExpression` (celui du grapheur) avec d'autres variables liées — `u`,
`v`, `w`, `t`, `n` — exactement comme `sequenceExpression.js` l'appelle avec
`n` au lieu de `x`. Toujours **aucun `eval`, aucun `new Function`**.

**Le rang suivant est une MAJUSCULE.** `uₙ₊₁` devient `U`, parce que
l'analyseur du grapheur ne lit que des variables d'**un seul caractère**
(`variableSet.has(ch)` dans son `tokenize`). On ne modifie pas sa grammaire
pour un seul appelant : `sequenceExpression.js` fait déjà exactement cela au
second ordre (`u` = u(n+1), `v` = u(n)). Le nom interne n'est jamais montré —
l'élève lit « uₙ₊₁ », toujours.

| Ce que l'élève peut écrire | Lu comme |
|---|---|
| `uₙ`, `u_n`, `u(n)`, `u_{n}` | `u` |
| `uₙ₊₁`, `u_{n+1}`, `u(n+1)` | `U` |
| `\frac{3}{4}`, `3/4` | `(3)/(4)` |
| `−2`, `٣`, `1,5`, `-2/3` | `-2`, `3`, `1.5`, `-0.666…` |

Relations supportées : `=` `≠` `<` `>` `≤` `≥`. Elles sont des **symboles**,
jamais traduites.

#### Les dépendances (§9, §10)

Un exercice déclare ses suites ; `buildContext` les compile et les **trie
topologiquement**. `wₙ = uₙ − vₙ` est donc évaluée après `u` et `v`, et
`valueAt(context, 'w', 4)` résout seul ce dont il a besoin. Une dépendance
**circulaire** est refusée (`cycle`) au lieu de boucler sans fin.

**Le cache est dans le contexte.** Dérouler une récurrence jusqu'au rang 5
mémoïse les rangs 0 à 5 : on ne recalcule pas toute la suite à chaque clic
(§11). Il se vide quand la définition change.

**Rien d'indéfini n'atteint l'écran (§17).** Chaque valeur passe par un garde
qui refuse `NaN`, `Infinity` et tout dépassement de `OVERFLOW_LIMIT`, et rend
un CODE (`undefined`, `overflow`, `iterationCap`, `cycle`, `missing`,
`invalidRule`) dont `mathlab.json` a la phrase arabe. Un test i18n exige une
phrase pour **chacun** de ces codes : un refus ne peut pas tomber sur une clé
absente et afficher du code à un élève.

#### L'hérédité : des étapes VÉRIFIÉES, pas un prouveur (`inductionStep.js`)

Il y a une différence énorme entre évaluer `u₄ = 239/81` — facile, sûr — et
démontrer que `¾(uₙ − vₙ) − ½ = −2` sachant `uₙ − vₙ = −2`. La seconde chose
est du calcul formel, et le moteur symbolique de la plateforme (`symbolic/`,
une façade sur Nerdamer) n'est pas assez fiable pour porter une leçon.

On fait donc ce que le cahier des charges recommande lui-même : **des
transformations structurées**, portées par l'exercice, que l'élève ordonne —
et dont chacune est **vérifiée numériquement** avant de pouvoir être
affichée. `verifyTransform` évalue les deux membres d'un maillon sur un
échantillon de rangs ; `buildChain` fait échouer la chaîne entière si un
maillon est faux. C'est un garde-fou d'**auteur** : un exercice faux ne peut
pas atteindre un élève. Cela ne DÉMONTRE pas le maillon, et l'écran ne le
prétend nulle part.

**Deux sortes de chaînes, deux raccords.** Une chaîne d'ÉGALITÉ repart de là
où elle est arrivée (`previous.to === current.from`). Une chaîne
d'INÉGALITÉ — `uₙ < 3 ⇒ ⅓uₙ < 1 ⇒ ⅓uₙ + 2 < 3` — transforme ses **membres de
gauche**, et se raccorde donc par eux. Un maillon porte `relation` (`=` par
défaut) pour être vérifié dans la bonne relation. Traiter le second cas comme
le premier déclarait faux un enchaînement juste — défaut attrapé par la QA
navigateur, pas par la relecture.

#### Le verdict, et la frontière entre tester et prouver (§25)

C'est la raison d'être de l'écran. `proofVerdict` rend quatre états :

| | Ce qu'on a le droit de dire |
|---|---|
| rien | « لم نُثبت شيئًا بعد » |
| base seule | « حالة البداية متحقّقة… **هذا ليس برهانًا** » |
| hérédité seule | le cas « n = n+1 » : un pas sans point de départ ne porte rien |
| **les deux** | « هذا برهان بالتراجع **مكتمل** » |

Un escalier tout vert ne donne donc JAMAIS « prouvé ». Il donne le constat
(« لاحظنا… »), puis **« لكنّ هذا وحده لا يثبت أنّها صحيحة لكلّ n »**, puis la
question qui ouvre la récurrence : « ما الذي يجعلنا قادرين على الانتقال من
أيّ درجة إلى الدرجة التي بعدها؟ ».

#### Les exercices sont VÉRIFIÉS, pas déclarés (`inductionExercises.js`)

Quatre exercices, dont les deux cas de référence du BAC. `inductionModel.test.js`
déroule chaque suite, évalue chaque proposition à chaque rang **et** vérifie
chaque maillon de chaque chaîne. Ajouter un exercice faux fait échouer la
suite.

| Exercice | Ce qu'il enseigne |
|---|---|
| `boundedAffine` | `u₀ = −1`, `uₙ₊₁ = ⅓uₙ + 2`, `uₙ < 3` — une **inégalité** et sa chaîne |
| `auxiliaryDifference` | `wₙ = uₙ − vₙ`, `wₙ = −2` — trois suites, une **dérivée** (§9, §10) |
| `triangularSum` | `1 + 2 + … + n = n(n+1)/2` — la somme classique, deux suites comparées |
| `powersBeatSquares` | `2ⁿ > n²` — **fausse avant n = 5** : le rang de départ n'est pas toujours 0 |

**§31 — les jetons offerts sont ceux de l'exercice.** Un exercice qui ne
définit que `u` n'expose jamais `vₙ`. `builderVariablesOf` et `alternativesOf`
sortent de la définition, jamais d'une liste générique ; un test exige que
chaque alternative proposée COMPILE contre son exercice.

#### Ce que l'écran montre (§5, §6, §21, §22, §23)

| | Où |
|---|---|
| les définitions des suites, en notation (`u₀ = −1 · uₙ₊₁ = ⅓uₙ + 2`) | sous l'énoncé |
| la proposition à démontrer, et « جرّب عبارة أخرى » (§19) | en tête |
| **chaque marche porte `P(k)` ET la proposition instanciée** (`u₂ < 3`) | l'escalier |
| les valeurs de **chaque** suite dont le rang dépend (§22) | panneau de résultat |
| la comparaison chiffrée puis ✓/✕ — jamais un simple « correct » | panneau de résultat |
| les maillons posés, **numérotés**, le fautif signalé | l'hérédité |

Une proposition que le moteur n'a pas su lire **n'est pas écrite sur les
marches** : `zzz + > 1000000` répété sur cinq marches donnerait l'impression
qu'on teste quelque chose. On garde `P(k)`, on retire la prétention.

**§24 — changer la proposition efface les verdicts**, et l'écran l'ANNONCE
(`changedAnnounce`) au lieu de le faire en silence. Une marche verte obtenue
avec `uₙ < 3` ne vaut rien pour `uₙ < 4`.

#### État et compatibilité

`LOGIC_SCHEMA_VERSION` passe à **2**. La tranche `recurrence` s'ajoute à côté
de `stairs` ; l'ancienne n'est pas supprimée, et `readLogicData` donne une
valeur par défaut à la nouvelle. Un document v1 se rouvre tel qu'il a été
enregistré — c'est le contrat du `MathLabTool` (§3.1).

On garde la proposition **écrite** (`left`/`relation`/`right`), jamais ses
valeurs : elles se recalculent du modèle, et en stocker une copie serait
garder un mensonge en puissance le jour où la proposition change.

### 5n.7 Le geste (§44)

**Pas de HTML5 drag-and-drop.** Comme partout dans le مختبر (les poignées des
أشعة, la droite du مختبر الأعداد), tout passe par des événements de pointeur
et — surtout — **tout a un équivalent au clic et au clavier** : on pose une
carte en la touchant. Sur téléphone c'est le seul geste fiable, et le
contrat des manipulations l'exige.

### 5n.8 Le dictionnaire des symboles

Toute l'interface est arabe ; la **notation** ne l'est pas et ne doit pas
l'être (ARABIC_RTL_CONTRACT §4 : *RTL layout, LTR mathematics*). Restait un
trou : rien ne disait à l'élève COMMENT lire « ⇒ ». « قاموس الرموز »
(`dictionary.js`, `DictionaryPanel.jsx`) le comble — chaque symbole a son nom
arabe, sa lecture à voix haute et un exemple, groupés en six familles.

Ce qui reste latin, et pourquoi :

| | Reste latin | Raison |
|---|---|---|
| Connecteurs, quantificateurs | ¬ ∧ ∨ ⇒ ⇔ ∀ ∃ | notation du manuel de 4AM |
| Ensembles | ℕ ℤ ℚ ℝ | idem |
| Variables | P, Q, A, B, x, n, k | le manuel écrit `n = 2k`, pas `ع = ٢ك` ; arabiser les variables isolerait l'élève de tout autre livre |

Ce qui, en revanche, **n'avait pas** à rester latin et a été corrigé : les
abréviations de vérité. `V`/`F` (Vrai/Faux — du **français**) sont devenues
**`ص`/`خ`** (صحيحة / خاطئة). Ce sont des MOTS abrégés, pas de la notation.
Le panneau est replié par défaut : on ne commence pas un laboratoire par un
lexique, et il n'entre pas dans le document — un dictionnaire ouvert n'est
pas un travail.

### 5n.9 L'entraînement (§37-39)

Douze familles de défis, quatre niveaux (§38), tous tirés de préréglages
vérifiés — `practice.js` n'invente aucun énoncé. Trois issues, jamais deux :
**juste, faux, ILLISIBLE** — dire « خطأ » à qui a mal tapé lui enseignerait
une fausseté sur sa propre pensée. Les indices sont progressifs et ne donnent
jamais la réponse ; « أظهِر الحلّ » reste accessible à tout instant ;
« اعرضه في المختبر » ouvre l'aire qui MONTRE la réponse, parce qu'une
explication se voit mieux qu'elle ne se lit.

Un contre-exemple est validé en **réévaluant le prédicat**, pas en comparant
à une constante : 2, 4, 6… réfutent tous « n² pair ⇒ n impair », et refuser 6
parce qu'on attendait 2 serait un mensonge.

Le score est deux compteurs (`solved`, `seen`). Pas de série, pas de médaille.

### 5n.10 État, persistance, résumé

```js
data = {
  area, statements, connectors, implication, equivalence, counterexample,
  conditions, quantifiers, negation, proof, fallacy, practice,
}
```

**Rien de ce qui se calcule n'est stocké** : ni table de vérité, ni régions de
la droite, ni partition d'ensembles, ni verdict de recherche, ni question
d'entraînement courante — tout se refait des préréglages. Le document mesuré
pèse ~600 octets ; le pire cas reste sous 2 Ko. Borne serveur : **8 Ko**
(`MathLabTools.php`), vérifiée par `logicState.test.js`.

`summarizeLogic` (kind `equation`, comme numberLab) montre ce que l'élève A
FAIT — l'énoncé travaillé et où il en était : « ∀n premier… » puis « x = 3 »
quand le contre-exemple est trouvé.

### 5n.8bis `Notation` ou `Statement` — la distinction qui a manqué

Deux choses se mélangent à l'écran, et elles ne se traitent pas pareil :

- **une NOTATION** (« P ⇒ Q », « x² > x », « ص ⇒ خ ») est en `dir="ltr"` :
  `<Notation>` ;
- **un ÉNONCÉ** — une *phrase arabe* qui contient de la notation, comme
  « إذا كان n زوجيًا فإنّ n² زوجي » — suit la direction de la page :
  `<Statement>` (`dir="auto"`).

Forcer un énoncé en LTR en retourne les mots : le titre de preuve s'affichait
« زوجي n² زوجيًا فإنّ n إذا كان ». Le défaut touchait six endroits (titres de
preuves, énoncés à réfuter, arguments fallacieux, sujets d'entraînement) et a
été **signalé en revue**, pas trouvé par un test — d'où les deux e2e qui
mesurent désormais la `direction` **calculée** de ces blocs.

La règle : `dir="ltr"` ne s'applique qu'à ce qui est *purement* de la
notation. Dès qu'il y a un mot arabe, c'est une phrase, et l'algorithme bidi
place les runs neutres correctement tout seul.

### 5n.11 Deux défauts trouvés en QA, et ce qu'ils ont laissé

- **La réciproque évaluée comme la directe.** À x = 2 sur « x > 3 ⇒ x > 1 »,
  l'écran répondait « صحيحة, car P est fausse ici » alors que la réciproque
  « x > 1 ⇒ x > 3 » est justement FAUSSE en ce point — l'inverse exact de ce
  que §15 fait découvrir. `implicationAt` prend désormais la **forme** en
  paramètre et calcule son antécédent et son conséquent ; six tests fixent le
  comportement, et l'e2e regarde le point, pas seulement le verdict global.
- **Une droite sans graduations.** « Cherche une valeur » n'a pas de sens sur
  une droite où l'on ne sait pas où l'on est. Trouvé à l'œil sur une capture,
  pas par un test vert : les repères suivent une suite 1-2-5.

Ces deux-là rappellent la règle de §5l : **regarder les captures**. Une suite
verte ne dit pas qu'un instrument enseigne la bonne chose.

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
| `trigonometry` | `{ mode?: 'triangle' \| 'circle', angle?, radius?, unit?: 'deg' \| 'rad', valueMode?: 'exact' \| 'decimal', highlight?: 'sin' \| 'cos' \| 'tan', triangle?: { given, angle?, opposite?, adjacent?, hypotenuse? }, layers?, preset? }` — e.g. `{ mode: 'triangle', triangle: { given: 'opp-hyp', opposite: 3, hypotenuse: 5 }, highlight: 'sin' }` or `{ preset: 'unitCircle', angle: 60 }`; an unreadable seed falls back to the default document, and the **practice score is never seeded** |

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
| Algebra lab maths: exact rationals (reduction, sign on the numerator, decimal read as the fraction it writes, `−\frac{1}{3}` written the textbook way, division by zero refused); parsing (both members and the relation, MathLive LaTeX *and* ASCII, the five relations in every written form, a LaTeX brace not mistaken for a relation, the faulty member named, refusal of `x²`, `x·x`, `3/x`, `sin(x)`, of a missing/double relation and of an empty member); the curriculum cases — `x+3=10` → 7, `x−5=8` → 13, `3x=15` → 5, `x/4=5` → 20, `2x+3=11` → 4, `−2x+4=10` → −3, `5−2x=11` → −3, `4x+1=2x+9` → 4, and the **exact** `3x=1` → ⅓; no solution and infinite solutions (equality *and* inequality, no fake number); operations applied to both members, fractional values, multiply/divide by zero refused, the original equation left untouched; **inequalities** — `2x>6` → `x>3` without flip, `−2x>6 ÷(−2)` → `x<−3` **with** flip, multiplying by a negative flips, add/subtract never flip even a negative; writing (never `1x`, never `+ −3`) | `tools/algebra/equation.test.js` (34 tests) |
| Algebra lab document and helpers: opening on an equation and never its solution, lesson seed accepted and an unreadable one falling back, JSON round trip, survival of any `data`, a history truncated at the first unreadable step, `MAX_STEPS` cap and serialised size under the server limit, an overflowing operation refused **without damaging the document**; history — one step per operation, تراجع/إعادة, steps kept on undo, a new operation cutting the abandoned branch, no-op operations not pushed, reset replacing the history, the flip recorded on its step; generator — every level solvable with an integer solution in [−10, 10] over 200 seeded draws, never degenerate (unknown survives, coefficient ≠ 1 at levels 2–3), inequality generation; verification — substitution shown, a wrong value refused, negatives parenthesised, an exact fractional solution, inequalities | `tools/algebra/algebraState.test.js` (29 tests) |
| Vectors lab maths: components `⃗AB = B − A` (A(2,3) B(6,5) → (4,2)), norm (‖(3,4)‖ = 5), addition ((3,2)+(1,4) = (4,6)) and its commutativity, subtraction ((3,2)−(1,4) = (2,−2)) shown as `u + (−v)`, scalar ((2,3)×−2 = (−4,−6)), k = 0 giving the null شعاع, |k| > 1 / < 1 / k < 0 on length and direction, midpoint (A(0,0) B(4,6) → (2,3)), distance (A(0,0) B(3,4) → 5), translation (A(2,3) by (4,−1) → A′(6,2)) preserving lengths, dot product ((2,3)·(4,1) = 11), perpendicularity ((1,0)⟂(0,1), the quarter-turn, the null شعاع perpendicular to nothing), **vertical slope returning `{vertical: true, value: null}` and never a number**, horizontal slope 0 ≠ undefined, parallelism with its factor (v = ½u, v = −2u) and the **relative** tolerance in both directions (huge collinear أشعة stay parallel, tiny non-collinear ones do not become so), collinearity of three points including on a vertical and the degenerate case, direction normalised in [0,360[ with `NaN` for the null شعاع, exact norms (5, √5, 2√5, non-exact decimals), and null-safety everywhere | `tools/vectors/vectorMath.test.js` (54 tests) |
| Vectors lab dependencies (§38): ⃗AB anchored at A and following it, a derived point not draggable, the free شعاع whose **origin** moves without changing components and whose **tip** changes them, sum/difference/scaled resolved from their operands, a sum built on ⃗AB following a drag of A through the whole chain, midpoint and image following, an image of an image, a translated triangle preserving side lengths and following a vertex, the delete cascade (A → ⃗AB → the sum; a vertex → the polygon), a dead reference and a **cycle** breaking only the object concerned, naming, colours and snapping | `tools/vectors/vectorScene.test.js` (23 tests) |
| Vectors lab document and lesson seed: a new document opening on two points and the شعاع they carry with nothing to undo, JSON round trip, survival of any `data`, dead references pruned in cascade, object and k bounds, an invalid viewport falling back, a stale selection dropped; history — undo/redo, the abandoned branch cut, **a drag replacing the current step so undo undoes a gesture and not a pixel**, the depth cap, survival of a save; the worst-case document staying under the server's 120 KB; and the **seed contract** published by `LESSON_DEVELOPMENT_GUIDE.md` (a seeded ⃗AB resolving by id, the viewport kept, a dangling seed falling back to the default plane) | `tools/vectors/vectorState.test.js` (23 tests) |
| Vectors lab display and experiments: `(3 ; −2)` with a true minus, a decimal comma and **no** Arabic-Indic digits, `√5 ≈ 2,24`, `2√5`, `1/2` rather than `0,5`, the three distinct slope readings, the null شعاع's « — » direction; and every one of the ten experiments opening fully resolved, surviving a storage round trip and leaving something to pull | `tools/vectors/vectorFormat.test.js` (17), `tools/vectors/experiments.test.js` (33) |
| Workspace query (§5i.1): Arabic normalisation (تشكيل, tatweel, alif/ya/ta-marbuta variants, Arabic-Indic digits) and Latin case/accents, search over title **and** tool name **and** summary text, each filter (tool, the three periods, favourites), the five sorts, search × filters combining without resetting, sorting on a copy, and `duplicateTitle` never producing « نسخة من نسخة من » | `features/mathlab/work/workFilters.test.js` (33 tests) |
| Summary contract (§5i.2), across **all eight instruments at once**: every shipped tool declares `summarize`; a new document's summary is a known `kind`, is JSON-pure and stays under the server's 2 KB; `text` is short strings only; **no summarizer ever throws** on a null, empty, foreign or malformed state; plus what each one keeps in particular (visible expressions and colours, solid and dimensions, stroke silhouette capped at 24 with the written text, first *and* current equation, frequencies not draws, terms recomputed from the definition, the resolved current vector scene) | `features/mathlab/work/summaries.test.js` (16 tests) |
| Registry: `summarize` required of every shipped instrument and optional in the contract; every `work.*` label present in Arabic; each sort and period worded; and the **six Arabic plural forms** on both counters, so two works read « عملان » and not « 2 عمل » | `features/mathlab/toolRegistry.test.js` |
| API: ownership, 404 for others, unknown tool, size, every tool id (incl. `probabilityStats` and its 60 KB limit, `algebra` and its 20 KB limit, `vectors` and its 120 KB limit), immutability of `tool`, visitor; and for the workspace — the summary travelling with the state and coming back **in the list**, an oversized summary **ignored without losing the work**, a pre-migration document still readable, the star, a copy keeping state and summary but never the star, and **bulk delete / bulk favourite sent with another student's id touching neither that row nor its count** | `apps/api/tests/Feature/MathLabDocumentFlowTest.php` (23 tests) |
| Browser, logic lab : la carte d'accueil ; **§54 l'ouverture sur une question, pas un menu** ; chercher un contre-exemple, en refuser un faux avec sa raison, en trouver un et lire pourquoi un seul suffit ; §7 l'énoncé basculant vrai/faux quand x bouge, la droite GRADUÉE et ses deux régions, §6 la valeur exclue dessinée et nommée « hors domaine » ; §11-12 les interrupteurs et la ligne allumée, `P ⇒ Q` fausse dans exactement une ligne ; §13-16 la vacuité, l'inclusion, **la réciproque fausse à x = 2 et le cas critique nommé là**, la contraposée coïncidant colonne pour colonne ; §17 les deux sens ; §18-20 les questions avant le vocabulaire ; §21-23 « فُحصت N قيمة » puis **« ليست برهانًا »** et le renvoi vers la preuve, le témoin qui prouve, le contre-exemple qui réfute ; §24-25 De Morgan et ¬∀ → ∃¬ ; §26-36 poser, refuser AVEC sa raison et ce qui manque, compléter, l'arbre à deux branches, l'étape manquante ; §33 nommer ET réfuter ; §37-39 indices progressifs, révélation sur demande, « تحقّق » jamais désactivé, saisie illisible distinguée, « اعرضه في المختبر » ; §41 le cahier de la plateforme ; **قاموس الرموز** replié puis ouvert, ⇒ lu « يستلزم », les variables latines expliquées, le symbole restant LTR ; **ص/خ et plus aucun V/F** ; autosave et réouverture ; §2 RTL avec notation LTR isolée (direction CALCULÉE) ; §44 trois tailles sans débordement et cibles ≥ 44 px ; §45 focus, `aria-pressed`, couleur jamais seule **l'ESCALIER des PROPOSITIONS** (l'énoncé et ses suites en notation — `⅓uₙ`, jamais `1/3*u` ; chaque marche portant `P(k)` ET la proposition instanciée ; le panneau montrant les valeurs des trois suites puis la comparaison chiffrée ; l'exercice à suite auxiliaire résolvant `wₙ = uₙ − vₙ` seul ; tout vert donnant « ليست برهانًا » puis l'hérédité numérotée et le verdict « مكتمل » ; une saisie illisible refusée en arabe et JAMAIS écrite sur les marches) et **l'ESCALIER qu'on MONTE** (écrire une règle, tester marche par marche, la marche qui verdit, le panneau qui montre règle/résultat/attendu, la grammaire exposée, une règle non supportée qui propose des suggestions valides, six marches vertes qui donnent « expérimental » et non « prouvé », le piège qui verdit trois marches puis casse, « لماذا ؟ » qui refait le calcul, le constructeur à jetons, « اكتشف القاعدة » qui cache les valeurs, chaque marche nommée et atteignable au clavier) et **l'escalier du PRINCIPE** (les trois états, le pied qui ne se pose pas, le barreau cassé, les exemples qui marchent et ceux qui échouent), **les phrases arabes qui ne sont pas retournées** — **147 vérifications, 0 erreur console** | `apps/web/e2e/mathlab-logic.mjs` (same invocation) |
| Browser, « أعمالي » (§5i): previews drawn for each shape, the fallback for a document with no summary, and **no heavy chunk requested** (three.js, Excalidraw, MathLive) while the workspace renders; search in Arabic, in French without accents, by tool name and inside the summary; filters, their visible pills and « مسح الكل »; the five sorts; grid ↔ list and the choice surviving a reload; selection (one, several, all) and its non-colour-only state; bulk favourite and bulk delete with confirmation, **cancelling deleting nothing**; rename and duplicate persisted; opening a work and coming back; RTL; and desktop / tablet / narrow mobile / landscape with no horizontal overflow, the filter sheet and bulk bar inside the screen and 44 px targets — **60 checks** | `apps/web/e2e/mathlab-work.mjs` (same invocation) |
| Logic lab, la logique elle-même (§5n.3) : les cinq connecteurs exacts sur {V,F}² et `null` sur une entrée manquante ; les quatre formes — la contraposée coïncidant avec la conditionnelle, la réciproque NON, réciproque ≡ inverse ; De Morgan ligne à ligne ; `evaluate` rendant `undefined` hors domaine au lieu de lever ; **`searchVerdict` distinguant `disproved` / `notFound` / `proved`, et « pas trouvé » n'étant jamais « prouvé »** ; la négation des quantificateurs sur un prédicat concret ; `truthIntervals` plaçant la zone fausse de `x² > x` exactement sur [0 ; 1] et rendant un point isolé comme point ; la partition en ensembles et les quatre verdicts qu'on en lit ; **`implicationAt` évaluant la FORME regardée** (le défaut de §5n.11 : à x = 2 la réciproque est fausse, pas vraie par vacuité) | `tools/logic/logicMath.test.js` (43 tests) |
| Logic lab, les énoncés (§5n.4) : chaque verdict déclaré recalculé sur son domaine ; la parité juste sur les **négatifs** (`(-3) % 2 === -1`) ; le même énoncé changeant de verdict avec son domaine ; chaque contre-exemple annoncé réfutant vraiment et appartenant au domaine montré ; chaque énoncé étant vrai AILLEURS (sinon il n'aurait rien de tentant) ; **le polynôme d'Euler premier pour n = 0…39 et composé en 40** ; A ⇒ B tenant et son contre-exemple de « B suffit » ; les cinq stratégies représentées (dont la récurrence, avec son énoncé `1 + 2 + … + n = n(n+1)/2` vérifié pour n = 1…200, ses **deux racines** au même rang et ses deux pièges — « quelques cas » et « on suppose tout ») ; chaque preuve résoluble et sans cycle ; chaque sophisme réfutable par plusieurs valeurs | `tools/logic/presets.test.js` (80 tests) |
| Logic lab, la preuve comme graphe (§5n.6) : un refus TYPÉ nommant les prérequis manquants ; **les deux ordres d'une disjonction acceptés** (§36) et la conclusion refusée avant ses deux branches ; le premier rang d'erreur désigné ; l'étape manquante jamais la première ni la dernière, reproductible, avec ses distracteurs ; les rangs de l'arbre réunissant deux branches ; la réfutation d'un sophisme acceptant toute valeur valide | `tools/logic/proofMath.test.js` (24 tests) |
| Logic lab, l'entraînement (§5n.9) : 400 graines rendant un défi complet (question, ≥ 2 indices, explication) ; les douze familles couvertes ; reproductibilité ; **la réponse attendue TOUJOURS acceptée** ; un ordre valide accepté et l'inverse refusé ; un sophisme exigeant de nommer ET de réfuter ; **tout contre-exemple valide accepté, pas seulement celui attendu** ; une valeur hors domaine refusée ; une saisie illisible n'étant PAS une réponse fausse ; `checkAnswer` ne levant jamais | `tools/logic/practice.test.js` (24 tests) |
| Logic lab, l'escalier des PROPOSITIONS (§5n.6ter) : la notation du cahier (`uₙ`, `u_{n+1}`, `u(n+1)`, `\frac`, `−`, chiffres arabes-indiens) et le piège de `u(n+1)` mangé par la règle de `u(n)` ; **les deux cas de référence du BAC** — `u₀ = −1, uₙ₊₁ = ⅓uₙ + 2, uₙ < 3` aux valeurs exactes (`5/3`, `23/9`, `77/27`) et `wₙ = uₙ − vₙ = −2` avec sa dépendance résolue dans le bon ordre ; les six relations, dont la stricte qui ne devient pas vraie par bruit de flottant ; **les refus TYPÉS** (`missing` avec son symbole, `cycle` détecté au lieu de boucler, `overflow`, `iterationCap`, `undefined`, le côté fautif nommé) ; le cache qui mémoïse les rangs intermédiaires et se vide au changement ; **chaque exercice livré** — ses suites compilent, sa proposition tient à partir de son rang de base, sa chaîne d'hérédité est vérifiée maillon par maillon, son constructeur n'offre que ses propres suites ; `2ⁿ > n²` FAUSSE en 2, 3, 4 et vraie en 5 ; l'hérédité — un maillon faux REFUSÉ avec son rang, une chaîne cassée par un seul maillon, l'enchaînement d'une chaîne d'**inégalité** par ses membres de gauche et l'ordre inversé refusé ; **`proofVerdict` qui ne dit « complete » qu'avec les DEUX pieds** | `tools/logic/inductionModel.test.js` (73 tests) |
| Logic lab, l'escalier qu'on monte (§5n.6bis) : la grammaire ANNONCÉE compilée et évaluée entrée par entrée, chaque exemple proposé qui s'évalue vraiment, les refus typés (`empty`/`syntax`/`unknownSymbol`) et le factoriel honnêtement refusé ; **jamais `NaN`, `Infinity` ni `undefined` à l'écran** (division par zéro, racine hors domaine, dépassement de la précision entière) ; la comparaison tolérante au flottant mais pas à l'erreur ; un verdict qui rend la valeur obtenue ET l'attendue ; **`climbVerdict` qui ne rend jamais « prouvé »** ; le constructeur à jetons relu par le même compilateur ; et surtout — **pour chacune des cinq suites** — la bonne règle qui verdit toutes les marches et le piège qui en verdit au moins deux PUIS casse (`2^n` en verdit trois) | `tools/logic/inductionLab.test.js` (49 tests) |
| Logic lab, le document (§5n.10) : l'ouverture sur l'EXPÉRIENCE du contre-exemple (§54) ; aucun résultat calculable sérialisé ; le pire cas sous les 8 Ko du serveur ; toute forme reçue relue sans lever ; un préréglage disparu retombant sur le défaut ; une étape de preuve inconnue écartée ; les transitions pures et non destructrices ; **§15 — une règle différente efface les verdicts, la même règle réécrite les garde** ; « مسح الكل » rendant un document neuf | `tools/logic/logicState.test.js` (33 tests) |
| Logic lab, les mots (§5n.8) : chaque aire, chaque préréglage, chaque preuve, chaque distracteur, chaque sophisme, chaque niveau et **chaque défi tiré sur 400 graines** ayant sa clé arabe ; le dictionnaire nommant et faisant LIRE chaque symbole, groupes compris ; aucune PHRASE latine oubliée ni valeur vide | `tools/logic/i18n.test.js` (35 tests) |
| Browser, whiteboard: navigation, refresh, back/forward, every tool, undo/redo, zoom, pan, grid, export, clear, autosave (and that an untouched board creates nothing), library import (valid, image, broken JSON, scene, re-import, persistence), library ⋮ menu inside the viewport, reopen, delete, RTL, ten viewports | `apps/web/e2e/mathlab.mjs` (`node apps/web/e2e/mathlab.mjs [shots-dir]`, dev servers on 5173/8000, QA student) |
| Browser, grapher: home card, first run, typing in MathLive, invalid expressions, `1/x`, `√x`, `tan`, add/example/colour/hide/delete/limit, point (tap, type x, drag), tangent mode (toggle, cue, typed x, drag with mid-gesture values, studied function switch, f′ curve and B, slider, reload, off = unchanged grapher, touch drag on mobile), zoom/pan/wheel/keyboard/reset, grid step, readout, grid, export, title, reload, « أعمالي », RTL, clear, visitor, tablet and mobile | `apps/web/e2e/mathlab-grapher.mjs` (same invocation) |
| Browser, 3D geometry: home card, first run (cube 2, V = 8, A = 24, three labels, no document), orbit by drag, wheel, buttons, keyboard, reset (view restored, solid untouched), camera persisted, face click and release, typed and slider dimensions in sync, invalid values (−4, 50) refused then clamped, decimal comma, every solid with the reference values, carry-over, options (labels and axes hidden, shell grid ↔ panel grid), PNG export, title, reload, « أعمالي », RTL (panel right, Cairo, KaTeX LTR), whiteboard and grapher still open, visitor, tablet and mobile with **real touch events** (one-finger orbit, pinch, no page scroll, collapse) — 69 checks | `apps/web/e2e/mathlab-geometry3d.mjs` (same invocation) |
| Browser, probability lab: home card and no more « قريبًا » chips for statistics/probability, first run (coin, 100 ready, nothing drawn, no document), coin 10 → « أوقف » during the animation, counts sum, theoretical line, document born on first run, a second run **accumulates** (1 010), convergence chart and question, 100 000 more draws in batches under 15 s and within 1 % of 50 %, stop, reset; die (six bars, 1/6 and 16,67 % in the table), compare off/on; two dice (reset on experiment change, eleven sums, 7 ≫ 2 and 12, 6/36 and 1/36); random integers (bounds shown, 1–6, « abc » refused then reverted, min > max redressed, bounds change resets); custom draws (0 refused, 250); dataset (example n = 7 / Me = 14 / range 8, `[10,20,30]` → 20/20/20 with no button, mean and median lines, bars, `[10,20,30,40]` → 25/25, « abc » named and the other three still counted, `12,5 ; 14,2 ; 9`, empty → dashes, mean checkbox hides its line, 80 dispersed values → classes); persistence (reload restores mode, text, experiment, bounds and 250 draws; the server holds counts, not draws; mode switch saved; « أعمالي »; « مسح الكل » with the tool's wording); RTL (panel right, Cairo, chart **computed** LTR, total legend inside the frame), no horizontal overflow, visitor; tablet and mobile (no overflow, 1 000 draws by tap, chart fits its column, 36 px chips / 44 px button, collapse grows the chart, dataset field wide); **the table** (die posed, contextual button, rolling until all six faces appeared with, for every roll, face read on the object = displayed result = count +1 and 0,7–1,8 s per roll; a roll stopped in the air not counted; a 1 000 batch tumbling then posed on the last draw in < 6 s; « شاهد كل رمية » off → 10 in a batch; coin until both sides with the word matching the side; two dice × 4 with real faces = displayed faces, sum, count of the sum +1; reduced motion → result in < 400 ms, counted, die posed; tablet and mobile: 3D table visible and inside the screen, a roll by tap consistent; the integer generator has no table) — 98 checks | `apps/web/e2e/mathlab-probability.mjs` (same invocation; `QA_BASE` overrides the web origin when 5173 is taken) |
| Browser, algebra lab: home card and no more « قريبًا » chip for algebra; first run (`2x + 3 = 11`, the balance drawn, **no solution shown**, and an untouched document creating nothing); a suggestion applying an operation, no `2x + 3 − 3` left on screen, `−3` then `÷2` reaching `x = 4`, three history steps; تراجع/إعادة; clicking a step returns to it (active step and two steps greyed ahead); a new operation cutting the abandoned branch; « إظهار الحل » then « التحقق » showing the substitution; no solution and infinite solutions with their Arabic sentence; **inequalities** — the number line appears, `−2x > 6 ÷(−2)` gives `x < −3`, the flip is signalled, the bound is an **open** circle when excluded, stays **hidden** before the unknown is isolated (§8) and is **filled** when included; `x/3 = 5` → 15, `−2x + 4 = 10` → −3; `x^2 = 4` refused with a reason while the previous equation stays; the generator at all four levels; the `a·x + b = c` panel and its three sliders; persistence (document born on first change, history and cursor restored on reload); RTL (panel on the start edge, balance **computed** LTR, notation LTR, Cairo in the stack) and the textual state for screen readers; tablet and mobile (no horizontal overflow before or after an operation, balance visible, touch targets, an operation applied by tap); visitor redirected — 53 checks | `apps/web/e2e/mathlab-algebra.mjs` (same invocation) |
| Trigonometry maths: `clean` (the float that is a zero, ±1), deg ↔ rad both ways, normalisation (450° → 90°, −90° → 270°, 720° → 0, 360° never 360), turns; sin/cos/tan at every remarkable angle with **cos(90°) exactly 0**; the **undefined tangent** (90°, 270°, 450°, −90°) returning `null` and never a huge number, and `tan(89.9°)` still finite; point ↔ angle round trip, the centre having no direction; quadrants **and the four axes named apart**; signs per quadrant, checked against the angles that live there; the right triangle in all six configurations (35°/hyp 10, the 3-4-5 triplet from three directions, complementary angles, Pythagoras on every solution) and its refusals (non-acute angle, null side, hypotenuse not the longest); ratios read on the SIDES; arcsin/arccos/arctan with **both** solutions per turn and their refusals; `sin²+cos²` **exactly 1** at twelve angles; arc length `ℓ = rθ`; the four symmetries proved by their values, not by a table; `stateAt` over a −720°→1080° sweep never producing NaN or \|sin\| > 1 | `tools/trigonometry/trigMath.test.js` (80 tests) |
| Trigonometry exact values: **every entry of the table proved against `Math`** (sin, cos, tan of the sixteen angles, and each one's radian measure), the sixteen angles of §6 present, 405° recognised through 45° and −30° through 330°, 37° having **no** exact form, `tan(90°)` marked undefined rather than infinite, snapping (30° from 31°, not from 37°, angular distance so 359° snaps to 360°, and snapping inside the student's own turn at 722°), `kπ/n` reduced (π/2 not 2π/4, 2π, −π/2) and refused when ugly | `tools/trigonometry/exactValues.test.js` (30 tests) |
| Trigonometry display: `√3/2`, `1/2`, `√3`, `−1` with a **true minus** (U+2212), « غير معرّف » never `∞`, LaTeX forms, exact + approximation together (`√3/2 ≈ 0,87`) and no approximation for whole forms, decimal mode, **no floating-point noise at any remarkable angle**, `(1/2 ; √3/2)` with one semicolon, radians as `π/4` · `2π/3` · `2π` · `−π/2`, quadrant and axis keys, and **Latin digits with a decimal comma everywhere** | `tools/trigonometry/trigFormat.test.js` (32 tests) |
| Trigonometry document and seed: opening on the **triangle** at 30° with no advanced layer lit; survival of any `data` (null, string, array, nonsense); JSON round trip; bounds on angle, radius, sides and the **acute** triangle angle; unknown mode/unit/given/symmetry/preset refused; **the animation and the current question never serialised** and a reopened document never relaunching a question; the worst-case document under 8 KB; transitions (nudging past 360° without normalising, normalising as an explicit gesture, identity on a no-op); presets **keeping the student's angle**; and the lesson seed contract | `tools/trigonometry/trigState.test.js` (47 tests) |
| Trigonometry practice: reproducible draws; **200 generated challenges each checked against the mathematics** (the ratio, the two quadrants, the signs off the axes, the Pythagorean triplet, the coordinates); the right answer always accepted, **including written in its exact form**; answer parsing (`1/2`, `0,5`, `√3/2`, `racine3/2`, `−1`, Arabic-Indic digits, `π/3` and **`7π/4`**); the verdict distinguishing wrong from unreadable and **carrying no "blocked" state**; tolerance per question; multi-select order-free; reveal targeting the circle or the triangle; and the two regressions — the **scrambled seed** (without it, 120 consecutive seeds gave one single family) and the π coefficient | `tools/trigonometry/practice.test.js` (32 tests) |
| Trigonometry drawing: the **y-axis flip** in one place, pixels ↔ maths round trip; the arc spiralling past one turn so 450° ≠ 90°, bounded at 1080°, never NaN; the wave (partial curve **stopping under the marker**, the regression where it was compressed across the frame), `waveY` clamping, graph x ↔ angle both ways; the **tangent clipped but honest** (`y` bounded over a whole turn, the true value still available, undefined at 90°/270°); the inscribed triangle and its degenerate cases; the free triangle staying in its box, **keeping room for the handle** (regression), and 3-4-5 drawing exactly like 30-40-50 | `tools/trigonometry/geometry.test.js` (41 tests) |
| Browser, trigonometry lab: home card and no more « قريبًا » chip; first run (**the triangle**, the invitation, `sin = 1/2` and `cos = √3/2` exact, no document); dragging the vertex; SOH-CAH-TOA lighting the right sides and dimming the third; **one θ on screen** (the inspector following the triangle, typing 45° moving the triangle, sin = cos there); the circle (drag, exact values, `(1/2 ; √3/2)`); **`tan(90°)` = « غير معرّف » with no astronomical number anywhere on screen**, the tangent line drawn without an intersection, the clipped segment signalled; the graph in **both** directions; periodicity (450° → 90°, the normalise button, −90°); radians (π/3, `ℓ = r·θ`); the identity summing to **1** even at 37°; arcsin giving **two** angles, clickable; symmetry and comparison; animation and pause; presets and a guided experiment that can always be closed; practice (an Arabic question, a wrong answer that **leaves everything open**, hint, reveal with its explanation, next); persistence (birth on first change, reload, **the animation and the question absent from the stored document**); RTL (page rtl, drawing and notation **computed** ltr, panel on the start edge, no English leftovers, Latin digits); a11y (the point a named `slider` with an Arabic `aria-valuetext`, focusable, arrow keys turning it, the current row `aria-current`); **reduced motion** (rotation not starting, everything still usable); tablet, mobile and small mobile (no overflow, targets ≥ 36 px, a real **finger drag without scrolling the page**); visitor redirected; and the other instruments still opening — **107 checks** | `apps/web/e2e/mathlab-trigonometry.mjs` (same invocation) |
| Browser, vectors lab: home card and no more « قريبًا » chip for الأشعة; first run (A, B, ⃗AB drawn, components (4 ; 3), norm 5, direction 36,87°, no document); dragging B changing the components and the norm live; the free شعاع (**origin** moved leaves the components, **tip** moved changes them); tip-to-tail, parallelogram and the opposite `−v`; the k slider through longer / shorter / reversed / **null شعاع drawn as a disc**; انسحاب of a point and of a triangle (two polygons, the image dashed); distance in exact form, midpoint, slope; parallelism announced **with its factor**, collinearity verdict, perpendicularity; تراجع/إعادة; zoom; RTL (plane **computed** LTR, readings LTR, page RTL, Latin digits); persistence (born on first change, reopened with its scene); « مسح الكل » back to the opening plane; accessibility (focusable handles, named, live region); tablet and mobile (no horizontal overflow, the plane keeping the larger share, **44 px touch targets**, a real **finger drag** moving the point **without scrolling the page**); visitor redirected | `apps/web/e2e/mathlab-vectors.mjs` (same invocation) |
| Symbolic engine: the AST-based translation to Nerdamer (including a NESTED fraction, which a regex would corrupt), the refusal of anything our own parser rejects, limits at a point, derivative/simplify/factor/expand/solve/antiderivative, algebraic equivalence, and a refusal rather than an exception on illegible input; and above all **the verification contract** — measured, Nerdamer is wrong 5 times out of 22 on limits at infinity (`2x+1` at −∞, `x³−3x` at *both* bounds, `e^Infinity`), so `verifiedLimitAtInfinity` confronts every answer with f's sampled behaviour and returns **a right answer or none**: 17 exact, 7 honest blanks, 0 wrong | `features/mathlab/symbolic/symbolicEngine.test.js` (18 tests) |
| Analysis: symbolic derivative rules (polynomial, product, quotient, chain, `sin`/`cos`/`tan`/`√`/`ln`/`log`/`exp`/`abs`, `e^x`, `x^n`), the honest `null` for `x^x` and a non-positive base; constants FOLDED so `(3x⁴)′` prints `12x^3` and never `34x^3`, no ambiguous `x^2^2`; the printer's parentheses and its refusal to juxtapose two numbers; and the decisive cross-check — **22 functions × 8 abscissae against the grapher's numerical derivative**, two independent methods agreeing to 1e−6 | `tools/analysis/symbolicDerivative.test.js` (41 tests) |
| Analysis maths: roots (simple vs `touch`, sin over several periods, **a pole is never a root**), critical points classified by the sign of f′ on both sides (`x³` → `stationary`, never an extremum) and **found on any window**, variation cut at discontinuities (1/x decreasing on each side, never "on ℝ∗"), sign intervals; discontinuities (infinite, jump, **removable — including a hole the sampling grid steps over, probed at the student's chosen point** — with a steep slope never taken for a break, a domain edge never taken for a jump, and 1/x showing exactly one break on six different windows), one-sided/two-sided/infinite limits and limits at infinity, asymptotes (vertical, horizontal snapped to a true 0, **oblique despite catastrophic cancellation**, none invented for a parabola); average rate, the secant converging to the tangent, exact vs measured slope; Simpson against closed forms (∫₀¹x² = ⅓, ∫₀^π sin = 2, ∫₁²dx/x = ln 2), orientation, the **refused** improper integral, signed ≠ geometric area on sin over a period, Riemann convergence and its four modes, undefined rectangles never counted as zero; intersections, area between curves, the antiderivative translated by C with an unchanged slope, observed domain | `tools/analysis/analysisMath.test.js` |
| Variation table: the parabola (↘↗, minimum at the bottom), the cubic (max then min), the stationary point at MID-height (§17), the pole that cuts the table, the affine with one arrow, the polite refusal, columns never outside the window — and the **±∞ at the edges**: `x²`, `x³−3x`, `2x+1`, `5−2x`, `e^x` and `|x|` all carry their infinities, identically at every zoom, while `sin`, `1/x` and `√x` keep their numbers | `tools/analysis/variationTable.test.js` |
| Analysis document: opens on the secant with an affine function and nothing of the lycée lit; the 8 KB bound at worst case; normalisation of ten hostile shapes; purity of every transition; Riemann bounds; presets all parseable, the programme ones free of powers and transcendentals, and **none flat enough for the orthonormal repère to waste a third of the screen**; `substituteX` that does not break `\exp` or `e^x`; the six transformations always parseable and doing what they say; the summary in `WorkPreview`'s own dialect (`polylines` of `{x, y}`, `viewport` quadruple), cut at 1/x's pole, under 2 KB, never throwing | `tools/analysis/analysisState.test.js` |
| Browser, analysis lab: home card; first run (**the secant on `2x+1`**, the slope readable at once, no document created); **the live readout updating while the student sets values, without changing tab**; **جدول التغيّرات** built, with ↘↗ and the minimum posed at the bottom for x²−4x+3, `− +` on the f′ row, both arrows rising around f′ = 0 for x³ with its value at mid-height (§17), and the pole of 1/x cutting the table exactly once; the slope independent of A and B on an affine and the secant converging 4 → 3 → 2,5 → 2,1 toward f′(1) = 2; the approach button really moving B; `f′(x)` written and named exact; `x³` stationary and the note that f′ = 0 is not an extremum; both limit tables and the verdict for 1/x at 0; the removable hole of (x²−1)/(x−1); the area drawn, Riemann's error falling from n = 2 to n = 50, 50 rectangles, signed ≠ geometric on sin with the negative lobe coloured apart; study rows lighting the graph; parameters redrawing the curve and the original kept beside its image; a challenge, graded hints one by one, a wrong answer explained and blocking nothing, a prediction revealed without sanction; four invalid expressions each answered in Arabic; save and reload restoring function *and* lab; RTL page with an LTR plane and LTR notation, the repère not mirrored; tablet, mobile and 320 px with no overflow, a plane that keeps its height and 40 px touch targets; the handle named, focusable and moved by the arrow keys — **65 checks** | `apps/web/e2e/mathlab-analysis.mjs` (dev server on 5173, API on 8000, QA student; `QA_BASE` overrides the web origin when 5173 is taken) |

## 9. Limitations (V1)

- No sharing, no collaboration, no **folders** — deliberately deferred
  (§5i): search, filters, sorting, selection and favourites come first, and
  folders are what one adds when those stop being enough. « أعمالي » loads
  every document in one request and filters in memory, so it does not
  paginate or virtualise; it is sized for the dozens of works a student
  actually has, not for thousands (§5i.1). A preview is drawn from the
  tool's summary, so a document saved before that summary existed shows the
  fallback until its next save, and the preview's own expression reader
  covers the programme's common forms only (§5i.2). No undo for a delete —
  the platform's confirmation dialog is the guard, as in « Mon cahier ».
- No undo/redo in the grapher (mistakes are cheap to
  redo; « مسح الكل » is confirmed). The algebra lab **does** have undo/redo,
  because there its step list *is* the lesson (§5e.5), and so does the
  vectors lab, where a construction is built up gesture by gesture
  (§5f.5). Each keeps its **own** history inside its own document state:
  they are not a shared service. Two instruments now implement the same
  cursor-over-a-list pattern — a third is the moment to extract it.
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
- Algebra lab: **first degree in one unknown only** — `x²`, `x·x`, `3/x`,
  `sin(x)`, π and e, a second letter and a double relation (`1 < x < 5`) are
  refused with a reason, never mishandled; no MathLive field (typed text
  only), no PNG export, no step-by-step hinting beyond the three
  suggestions, and the solution of an inequality is shown as a ray, not as
  an interval notation (§5e.8).
- Vectors lab: **plane geometry in one repère** — 26 points, 12 أشعة, 4
  polygons, 20 history steps. No 3D vectors, matrices, linear systems,
  eigenvalues, vector fields, parametric curves, conics or automatic proof
  (§41 of the brief). No PNG export; no free-hand renaming or recolouring
  from the panel (names and colours are assigned); a polygon is built from
  three selected points, not drawn; the dot product is computed but stays
  behind an explicit analysis choice because it is **not** in the 4AM
  programme (§5f.10); `k` is bounded to [−10, 10] and the slider to [−3, 3];
  coordinates are bounded to ±10⁴ and snapped to the half-square unless
  Shift is held.
- Trigonometry lab: **one angle, one triangle, one circle per document**.
  The angle is bounded to [−720°, 1080°] (beyond two turns the spiral arc
  stops teaching anything); the radius to [0,5 ; 5]; triangle sides to
  [0,5 ; 100] and its angle stays **acute**. Exact values exist for the
  sixteen remarkable angles only — elsewhere the decimal is shown rather
  than an invented radical. No PNG export; no secant/cosecant/cotangent, no
  law of sines or cosines, no trigonometric equations, no degrees-minutes-
  seconds, and no user-editable values table (§18 is served by the sign
  table and the inspector). The practice mode keeps two counters and feeds
  **no** analytics service — the Math Lab has none (§44 of the brief asks to
  integrate with an existing one, and there is none to integrate with).
- Transformations lab: **plane geometry, one repère** — 4 figures × 12
  vertices, 6 steps, 20 history entries. No conics or loci **there** (they
  are the conics lab's, §5k), no compass-and-straightedge constructions, theorem prover, 3D transformations, shear or
  general affine map typed as a matrix (the matrix is **read**, never
  entered), and no constraint solver — "a triangle with these three side
  lengths" is not built. A polygon comes from a template and is then
  dragged; there is no point-by-point free-hand drawing. The pattern
  explorer repeats **one** transformation up to 24 times and is not a
  tessellation editor. No PNG export; figures are neither renamed nor
  recoloured from the panel, and labels (`A…`, `A′…`) are assigned by
  position. `k` is bounded to [−10, 10] (slider [−3, 3]) and coordinates to
  ±10⁴, snapped to the grid unless Shift is held (§5j.14).
- Excalidraw's fonts carry no Arabic glyphs: Arabic text elements render in
  the browser's fallback font on the canvas (legible, not Cairo).
- A document is one whiteboard; there are no pages/frames in the model.
