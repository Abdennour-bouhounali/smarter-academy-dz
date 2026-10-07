# Islamic values & spiritual moments — « القيم الإسلامية »

> **Authoritative** for: the Islamic greeting, the content model of Quran /
> hadith / du'a / value / wisdom / reflection items, audiences, themes and
> moments, the selector, the frequency policy, where a reminder may (and may
> never) appear, and the source-integrity rules. Implemented 2026-10-07 in
> `apps/web/src/features/islamic/`. The code is the source of truth; this file
> describes it.

## 1. Purpose

A short, authentic reminder **around** the learning journey, never inside the
mathematics: one verse, one hadith, one du'a or one short value, at a moment
where it helps (starting a lesson, after a difficulty, after an effort). It
encourages effort, patience, honesty and good character, reminds the teacher
that teaching is responsibility and positive influence, and keeps the platform
one educational community (a large `both` collection).

What it is **not**: a religious-content website, a reading obligation, a modal,
a reward or a punishment.

## 2. Architecture

```text
apps/web/src/features/islamic/
├── islamicThemes.js          the vocabulary: CONTENT_TYPES, AUDIENCES, THEMES, CONTEXTS, CONTEXT_THEMES
├── islamicSelector.js        selectIslamicContent() — PURE; audienceForUser(); isEligible(); contentText()
├── islamicFrequency.js       MOMENT_POLICY, planMoment(), recordShown() — PURE; tolerant localStorage I/O
├── useIslamicMoment.js       the hook: lazy registry + frequency + selector + one-card-at-a-time slot
├── IslamicGreeting.jsx       « السلام عليكم {name} 🌿 » + useIslamicGreeting() for string titles
├── IslamicContentRenderer.jsx  one renderer, three « habits » (Quran / hadith / platform sentence)
├── IslamicContentCard.jsx    the card (full or compact)
├── IslamicBreak.jsx          « 🌿 وقفة إيمانية » with « أكمل الدراسة »
├── IslamicMoment.jsx         the integration point a page uses
├── MushafVerse.jsx           a verse set like the مصحف: ﷽, Uthmani rasm, SVG ayah medallion (student home)
├── quranFont.js              Amiri Quran, loaded on demand
├── index.js
└── content/                  the declarative registry, LAZY-loaded (import())
    ├── quran.js  hadith.js  duas.js  values.js (values, wisdoms, reflections)
    ├── mushaf.js             BASMALA_UTHMANI + HOME_VERSE (العلق 1, Tanzil quran-uthmani) — static, tiny
    ├── index.js              ISLAMIC_CONTENT (defaults: status 'published', active, priority 1)
    └── __fixtures__/         source snapshots used by the tests only (never bundled)
scripts/islamic-fetch-sources.mjs   regenerates the snapshots from the sources
```

Pages never contain Islamic text: they place `<IslamicMoment context="…" />`
and the feature decides the item and the frequency.

UI strings (greeting, « وقفة إيمانية », « أكمل الدراسة », « تأمّل », reference
labels) live in the eager `common` namespace under `islamic.*`. The **content**
is data, Arabic, in the registry — like lesson content, it is not chrome.

## 3. Content model

| Field | Meaning |
|---|---|
| `id` | stable, unique (`q-taha-114`, `h-muslim-2699-ilm`, `v-try-again`…) |
| `type` | `quran` · `hadith` · `dua` · `value` · `wisdom` · `reflection` |
| `audience` | `student` · `teacher` · `both` — always explicit |
| `themes` | from `THEMES` only (test-enforced) |
| `contexts` | the moments it suits, from `CONTEXTS` only |
| `priority` | 1–3, breaks ties |
| `active`, `status` | only `active` + `published` items are served (future back-office) |
| `reflection` | optional platform-written line, rendered **under a rule, labelled « تأمّل »**, never inside the quotation |
| `source`, `sourceVerified` | where the text was checked |

Quran (and Quranic du'a, `type: 'dua', origin: 'quran'`): `surah`, `surahName`,
`ayah`, `ayahEnd?`, `verses: [{ ayah, text }]`, `excerpt?`.

Hadith (and prophetic du'a, `origin: 'hadith'`): `collection`
(`bukhari`/`muslim`/`tirmidhi`), `collectionName`, `number`, `narrator?`,
`authenticity: { grade: 'sahih'|'hasan', label }`, `intro` (« قال رسول الله ﷺ »,
« كان النبي ﷺ يقول »), `text`, `excerpt?`.

Value / wisdom / reflection: `text`, `source: 'platform' | 'proverb'`. They
carry no `surah`, no `collection`, no ﷺ, no quotation marks.

Planned (not built): `approvedBy`, `publishedAt` and an admin screen; the
registry is static today.

Current size (2026-10-07): 92 items — 36 Quran, 30 hadith, 6 du'a, 12 values, 3 wisdoms,
5 reflections; by audience 19 student, 18 teacher, 55 `both`.

## 4. Source integrity — the non-negotiable part

**Nothing is typed from memory.** Every Quranic or prophetic string is an exact
substring of its source, character for character (including the order of
combining marks: a retyped « اللَّهِ » with shadda and fatha swapped is a
different string and fails).

* **Quran** — Tanzil « simple » text (`quran-simple`, served by
  api.alquran.cloud). The basmala the API prefixes to verse 1 is removed.
  Displayed between ﴿ ﴾, verses of a range separated by ۝, never paraphrased.
* **Hadith** — the Arabic editions of fawazahmed0/hadith-api; Muslim numbered
  after Fu'ad 'Abd al-Bāqī. Admitted: al-Bukhārī, Muslim, and al-Tirmidhī only
  when al-Albānī authenticates it — the label names who graded it
  (« قال الترمذي: حسن صحيح، وصحّحه الألباني »).
* **Refused**: anything whose attribution could not be found in a consultable
  source (« اللهم لا سهل إلا ما جعلته سهلا », Ibn Ḥibbān, not in the editions
  used), du'a with divergent gradings (Tirmidhī 3599, Ibn Mājah 925), popular
  sayings falsely attributed to the Prophet ﷺ (« اطلبوا العلم من المهد… »),
  and every companion or scholar quotation.
* **Platform sentences** are honest about being ours: `source: 'platform'`,
  or `proverb` (« مثل عربي ») for a common Arabic proverb with no author.

Workflow to add an item:

1. Add it to the registry with its reference, copying the text **from the
   source** (or let the test tell you it does not match).
2. `node scripts/islamic-fetch-sources.mjs` — refreshes
   `content/__fixtures__/tanzilSimple.json` and `hadithSources.json`.
3. `npx vitest run src/features/islamic` — `islamic.test.js` « intégrité des
   sources » proves every verse is in Tanzil and every matn in its collection,
   that a whole verse is not marked `excerpt` and vice versa, that every
   hadith has collection, number and grade, and that a platform sentence wears
   no source habit.

The renderer is a second guard: a Quran item without surah/ayah, or a hadith
without collection, number or grade, **renders nothing**.

## 5. Selection (`selectIslamicContent`)

Pure: `({ items, audience, context, themes, recentContentIds, seed, maxTextLength }) → item | null`.

1. **Context** — items declaring the exact moment;
2. **Audience** — a student gets `student` + `both`, a teacher `teacher` +
   `both`; the exact audience outranks `both`;
3. **Themes** — the page's themes plus `CONTEXT_THEMES[context]` (they rank,
   they do not filter);
4. **Recency** — the last 12 shown items are skipped while another choice exists;
   when all are recent, the least recent returns;
5. **Priority**;
6. **Fallback** — items of the `general` moment.

Score = `10 × shared themes + 5 × exact audience + priority`; ties rotate with
`seed` (the day number), in registry order — deterministic for tests.
`maxTextLength` keeps long items out of compact slots (90 characters).

`audienceForUser(user)`: `student` → student, `teacher` → teacher; admin and
anonymous visitors get **no** reminder.

## 6. Moments and frequency

| Moment | Where (integration) | Who | Form | Policy |
|---|---|---|---|---|
| `home` (fixed verse) | `StudentHome`, under the greeting: « ٱقْرَأْ بِٱسْمِ رَبِّكَ ٱلَّذِى خَلَقَ » set as in the مصحف (`MushafVerse`, owner request 2026-10-07) — not a rotating reminder; the `home` moment stays in the selector for a future slot | student | mushaf | always |
| `teacher_home` | `TeacherHome`, above the dashboard | teacher | card | same item 6 h |
| `lesson_start` / `study_progress` / `lesson_completion` | `LessonIndex`, under the hero card (by path state: none / some / all modules done) | student | card | same item 1 h |
| `teacher_start` | `LessonIndex` read by a teacher preparing a session | teacher | card | same item 6 h |
| `study_break` | `ModuleLayout`, **below** the bottom navigation, once the module is completed and before the next one | student | « وقفة إيمانية » | at most once / 25 min |
| `exercise_success` / `difficulty` / `study_progress` | `PracticeSummary`, after the session report (success rate ≥ 70 % / < 50 % / otherwise) | student | card | 30 min / 15 min |
| `mistake` | `PracticeSession`, after the **second** wrong answer to the same question, below verdict, model answer, retry and hints; not on the BEM exam sheet | student | compact | at most once / 15 min |
| `study_start`, `module_start`, `general` | supported by the selector; `general` is the fallback; no page places `module_start` yet | — | — | — |

`planMoment` returns `reuse` (sticky window), `skip` (cooldown) or `select`;
`recordShown` keeps the last item per moment and the recent list. State lives
in `localStorage['sa_islamic_moments_v1']`; a private window or blocked storage
gives an empty state, never an error.

**One card at a time**: the first mounted moment owns the screen; others stay
silent until it unmounts.

## 7. Where a reminder may never appear

* inside a module's content, a manipulation, a drag, or an exercise card;
* between an action and its mathematical feedback, or before a student
  discovers the relationship a step is built to reveal;
* over a formula, a figure or the workspace (never an overlay, never a modal);
* in Classroom Mode (وضع القسم) — `LessonIndex` renders its presentation page
  instead, and the module break is gated by `!presenting`;
* on admin pages.

Lesson authors **never** import this feature: the lesson shell owns the
moments (`LessonIndex`, `ModuleLayout`).

## 8. No gamification

No points, XP, streaks, badges, ranking, « daily ayah » pressure, « I have
read this » checkbox or confirmation. The break's « أكمل الدراسة » continues
immediately (to the next module); the frequency policy exists only to make
reminders **rare**. `islamic.test.js` refuses scoring fields in the model.

Tone toward the student: encourage, never shame. « لا بأس، حاول مرة أخرى »,
never « أنت لا تجتهد بما يكفي ». Religion is never a guilt mechanism.

## 9. Visual & RTL

* The existing card language (radius, border, spacing, Cairo UI type), a warm
  near-white green surface and an eight-point-star pattern at 5 % opacity
  (`.sa-islamic-surface`, `index.css`). No gold, no mosque silhouettes, no
  ornamental borders, no animation.
* Quran text in naskh (`.sa-quran`: Amiri via the exam sheet's on-demand loader
  `features/practice/exam/examFont.js`, then system naskh, then Cairo), larger
  and with generous line height; reference underneath (« سورة طه، من الآية 114 »).
* Every container is `dir="rtl"`; numbers (ayah, hadith number, ranges « 5–6 »)
  are isolated with `<bdi dir="ltr">` (ARABIC_RTL_CONTRACT).
* `break-words`, no fixed widths: no horizontal overflow at 390 px
  (`e2e/islamic-values.mjs`).

### The مصحف layout (`MushafVerse`, student home)

Coded, never an image. Above: the basmala as the single Unicode sign ﷽
(U+FDFD), which Amiri Quran draws as the elongated green calligraphy of the
مصحف; the exact Tanzil Uthmani text of 1:1 is in the DOM for screen readers
(`sr-only`). The glyph is ~10 em wide and unbreakable, so its size follows the
viewport (`min(1.5rem, 6.4vw)`, 1.75rem from `sm`) — never overflowing at
390 px. Then the verse in Uthmani rasm (Tanzil `quran-uthmani`, extracted by
script, test-compared to `__fixtures__/tanzilUthmani.json`) in Amiri Quran
(`.sa-mushaf`, `quranFont.js`, on demand), and at its end the ayah medallion:
an SVG rosette (12 lobes, coral `currentColor`) around the number in
**Arabic-Indic digits** (١) — the مصحف convention, the only place the platform
uses them; the readable reference underneath keeps Western digits in `<bdi>`.
The basmala shows when a passage opens a surah other than al-Fātiḥa and
at-Tawba.

## 10. Greeting

`common:islamic.greeting` = « السلام عليكم {{name}} 🌿 », rendered by
`IslamicGreeting` / `useIslamicGreeting` in three places: the student home
(`HomeGreeting`), the teacher home title (`TeacherHome`), the logged-in banner
on the landing page (`StudentHomeBanner`). The name is `getDisplayName(user)`;
without one, « السلام عليكم 🌿 ». The former « أهلًا {{name}} » keys were
removed from `student`, `teacher` and `marketing`.

## 11. Bundle

The entry bundle carries only the greeting component and the `common.islamic`
strings (+0.75 KB gzip, measured 2026-10-07). The hook, renderer, card and break
form the shared `IslamicMoment` chunk; the registry is its own lazy chunk
(≈ 8.9 KB gzip), fetched the first time a moment needs it. The home verse
(`mushaf.js`, `MushafVerse`) is in the lazy `StudentHome` chunk; the Amiri Quran
font is requested by the first `MushafVerse`. See
BUNDLE_BOUNDARIES.md §3.

## 12. Tests

* `features/islamic/islamic.test.js` — selector (audience, context, themes,
  recency, fallback, determinism, compact slots, real registry covers every
  moment), frequency (sticky, cooldown, bounded recent list, broken storage),
  registry shape, **source integrity**, no gamification.
* `features/islamic/islamic.render.test.jsx` — greeting, Quran / hadith /
  platform rendering, long verse and long hadith, missing optional narrator,
  refusal to render an unsourced item, compact card, break without checkbox
  or points.
* `e2e/islamic-values.mjs` — student and teacher, 1440 and 390: greeting, one
  card, RTL, no overflow, reference and grade present, no console error
  (stubbed API with the real `{ success, user }` envelope).
