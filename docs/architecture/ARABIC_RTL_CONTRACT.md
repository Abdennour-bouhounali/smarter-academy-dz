# Arabic & RTL Contract

> **The student-facing product is Arabic. Everything a student can read is in
> Arabic, except legitimate mathematical notation and the brand name.**
> This document is authoritative on language, direction, typography and
> bidirectional rendering. Product scope and terminology policy live in
> `../ALGERIA_PLATFORM_MASTER_SPEC.md` §14–§16; this document is the
> mechanical contract a developer or agent must satisfy.

Everything below describes code that exists today.

---

## 1. The foundation — three fixed values

`apps/web/src/locale.js` is the single source of truth for locale and
direction. It is not a language switcher; this repository serves one product.

```js
export const LOCALE = 'ar-DZ';
export const DIRECTION = 'rtl';
export const IS_RTL = DIRECTION === 'rtl';
```

`apps/web/index.html` sets `<html lang="ar" dir="rtl">` — the whole document is
RTL, permanently. Anything needing the locale or direction **as data** imports
from `locale.js` rather than writing `'ar'` or `'rtl'` inline.

i18next is initialised in `apps/web/src/i18n/index.js` with a single locale
(`ar-DZ` as both `lng` and `fallbackLng`) and seven namespaces:

| Namespace | Covers |
|---|---|
| `common` | shared chrome: buttons, errors, loading and empty states |
| `nav` | navigation |
| `auth` | authentication |
| `access` | activation codes and entitlement |
| `lesson` | the **lesson engine chrome** — module navigation, kit question labels, final test, diagnostic, Classroom Mode |
| `student` | the student space |
| `marketing` | visitor pages |

**The `lesson` namespace is chrome, never content.** A lesson's own
pedagogical text is written in Arabic directly in its files
(`lesson.config.js`, `content/textbook.js`, `knowledge.jsx`, its modules),
because the curriculum is authored, not translated.

---

## 2. What must be Arabic

Every student-facing sentence and pedagogical word: titles, descriptions,
briefs, step titles and subtitles, questions, options, **distractors**,
explanations, hints, every feedback string (success, error, retry, empty,
completion), manipulation labels and legends, knowledge-map entries, badges,
and every `aria-label`, `title` and `placeholder` — a screen reader reads
those aloud to the same student.

"Most of the lesson is Arabic" is a failure, not a partial success.

### What must NOT be translated

- **Mathematical notation**: `PGCD`, `PPCM`, variables (`a`, `b`, `x`),
  operators, `√`, equations, numerals, standard abbreviations. The textbook
  itself writes `PGCD` in Latin; so do we.
  Prefer the Arabic wording *with* the notation —
  `القاسم المشترك الأكبر (PGCD)` — and never invent an awkward translation of
  an established symbol. `احسب PGCD(84;36)` is correct.
- **Technical identifiers** never rendered to a student: ids
  (`id: 'qasim-adad-tabii'`), component/function/file names, routes, registry
  keys, CSS classes, database fields.
- **The brand name**: `Smarter Academy` stays Latin, even mid-sentence in
  Arabic copy (`i18n/locales/ar/common.json` → `appName`).
- **Developer-facing strings** never shown to a student (dev warnings, thrown
  `Error` messages), and **code comments**, which this repository writes in
  French and English by convention.

### No French or English defaults

A default prop, fallback string or module-level constant that yields French is
a defect **even when every current caller overrides it** — the next lesson that
forgets the prop ships French silently. Defaults are Arabic or absent.

**Never call `t()` at module scope.** i18next may not be initialised when a
module-level constant is evaluated. Constants hold translation *keys*;
components resolve them at render.

### The API speaks codes, the client speaks Arabic

Laravel responses are **not** a localization surface: its validation messages
are English, and controller strings are French — the same layer serves the
francophone admin panel and machine-to-machine webhooks. A server `message` is
therefore never rendered to a student. Services resolve Arabic text from the
catalogue through `apps/web/src/services/apiMessage.js`; what crosses the
boundary is a `reason`/`code` or an HTTP status, never a sentence.

### Product facts, not just language

Copy inherited from the French product must not be translated as-is when it is
factually wrong here. The DZ product has no Stripe, no euro pricing and no
subscription (access comes from cash-purchased activation codes), and it
follows the Algerian curriculum, not the French `6e…Terminale` ladder.
Translating such copy literally produces fluent Arabic that lies.

---

## 3. Typography — Cairo, global, non-negotiable

Cairo is the platform's single, global, permanent Arabic font. The source of
truth is `apps/web/tailwind.config.js` (`fontFamily`) and
`apps/web/src/index.css`.

**The mechanism:** none of the Latin identity fonts (Inter, Space Grotesk,
JetBrains Mono) contain Arabic glyphs, so Cairo sits *directly behind* each of
them in every stack. The browser then resolves Arabic runs to Cairo per glyph
while Latin runs, digits and code keep the identity font.

```js
'sans':  ['Inter', 'Cairo', 'Tajawal', 'sans-serif', …],
'space': ['"Space Grotesk"', 'Cairo', 'Tajawal', 'sans-serif'],
'mono':  ['JetBrains Mono', 'Cairo', 'Tajawal', 'monospace'],
```

`sans` is redefined **on purpose**: Tailwind's default stack
(`ui-sans-serif`, `system-ui`…) *does* carry Arabic glyphs, so a `font-sans`
element would silently render Arabic in a system font instead of Cairo. `mono`
carries Cairo for the same reason — labels, badges and buttons are styled
`font-mono` all over the platform.

Rules:

- **Never put a system font before Cairo** (`system-ui`, `ui-sans-serif`,
  `Segoe UI`, `Arial`, `Tahoma`…). They have Arabic glyphs and would take over.
- **Never import another Arabic font** at lesson or component level (Tajawal,
  Noto Sans Arabic, Amiri, IBM Plex Arabic…). Tajawal exists *only* as the
  global second fallback covering the moment before the Google Fonts sheet
  loads; it is not a choice a lesson makes.
- **Never define a lesson-specific Arabic font class or inline
  `font-family`.** Rely on inheritance — a lesson gets Cairo automatically.
- **Mathematical rendering keeps its own typography.** KaTeX and MathLive set
  their own fonts on their own elements (`.katex`, `<math-field>`); never force
  Cairo, or anything else, onto them.
- **Code keeps its monospace typography.** Digits and code stay JetBrains Mono
  regardless of the surrounding Arabic.

A lesson generator's job is content and structure, not typography.

### Text scale

`tailwind.config.js` redefines the `fontSize` scale: the body sizes are +25%
(`sm` is 17px, `base` is 20px), damping to neutral from `5xl` upward, with
line-heights raised to match. Roughly 8 300 `text-sm`/`text-xs` call sites
carry the interface, so the scale — not per-page retouching — is what makes
Arabic readable. A `fontSize={13}` inside an `<svg>` is in **viewBox units**,
not CSS pixels: this scale does not reach it, and it must not be "corrected"
by hand.

---

## 4. Direction — RTL layout, LTR mathematics

The page is RTL. Mathematics is not.

### Math isolation is automatic through `MathText`

`lessons/common/components/MathText.jsx` is the single chokepoint: it splits a
string on `$…$` and `$$…$$` and wraps every expression in a `dir="ltr"`
container carrying `.sa-math-inline` (a `<span>`) or `.sa-math-block` (a
`<div>` — `BlockMath` renders a div, invalid inside a span). 360+ call sites
inherit the behaviour without individual changes.

The CSS that makes it correct (`index.css`):

```css
.sa-math-inline, .sa-math-block {
  direction: ltr;
  unicode-bidi: isolate;
}
```

`direction: ltr` fixes the expression's own layout; `unicode-bidi: isolate`
keeps it out of the surrounding Arabic bidi run. Both are required — one
without the other still renders wrongly in a mixed sentence.

### Numeric pairs need the same isolation

In an RTL page, `{score} / {max}` renders reversed: `10/11` reads as
"11 / 10". **Every score, counter and ratio (`N / M`) needs a `dir="ltr"`
wrapper**, exactly as `MathText` does for expressions. This is the single most
common bidi defect in this codebase's history.

The same applies to any numeric block inside a manipulation: tiles, bars,
equations, divisions and algorithm chains all declare `dir="ltr"`.

### Directional icons

An icon whose **meaning is a reading direction** — forward, back, the panel on
the start edge — must come from
`apps/web/src/components/common/DirectionalIcons.jsx`, which resolves the
mirror once against `IS_RTL`:

```jsx
import { ArrowForward, ChevronBack } from '…/components/common/DirectionalIcons';
```

Exports: `ArrowForward`/`ArrowBack`, `ChevronForward`/`ChevronBack`,
`ChevronsForward`/`ChevronsBack` (jump, not step), `PanelStartOpen`/
`PanelStartClose`. Call sites express **intent**, never a physical side.

**Icons with a fixed meaning must not go through it**: an Enter key `⏎`, a
play button, a mathematical arrow on an axis. They never mirror.

### RTL and font selection are separate concerns

Solving one does not solve the other. Verify both independently, then together.

---

## 5. Arabic plurals

Arabic needs all six forms: `_zero`, `_one`, `_two`, `_few`, `_many`,
`_other`. The count belongs **inside** the key — never concatenate a number
with a translated noun.

---

## 6. Terminology

The Arabic terminology of the official Algerian programme **is** the
interface's terminology. It is never re-translated from French. The register
lives in [`../ALGERIA_4AM_CURRICULUM.md`](../ALGERIA_4AM_CURRICULUM.md) §6.

The engine's own vocabulary, settled by the owner:

| Arabic | Means | Never means |
|---|---|---|
| **الوحدة** | a textbook **unit** — a group of lessons | a module |
| **المحور** | a **module** inside a lesson | a unit |
| **الدرس** | a lesson | — |
| **الميدان** | a curriculum domain (chapter) | — |
| **نقاط التعلّم** | learning points | — |

Changing any of these silently is forbidden: four navigation surfaces and the
Classroom Mode toolbar render them.

When official terminology is uncertain, mark it
`[À VÉRIFIER DANS LE PROGRAMME OFFICIEL]` rather than inventing one.

---

## 7. Where untranslated text actually hides

A lesson can be flawless in its own files and still show French to a student,
because the chrome comes from shared components.

- **Scan every module, not the first screen** — and every interactive state:
  initial, selected, correct, incorrect, each hint level, validation, error,
  completion, reset, and both navigation directions. Text that appears only
  after an interaction is the most common miss.
- **Follow imports to the real rendered surface**: module → manipulation →
  shared kit → feedback → button. A lesson's own 18 files can pull in 70+.
- **Fix shared chrome at the shared level, through i18n** — never by
  hardcoding Arabic into a component other lessons render. Add the key to
  `i18n/locales/ar/` and call `t()`. Check that the key **resolves**: a missing
  key renders the raw key or a stale default.
- **Finish in the browser.** Some strings appear only dynamically.

Always run a second full scan after generating or editing a lesson, searching
independently for French and English prose, mixed-language sentences,
untranslated buttons/feedback/hints, and accidental developer or placeholder
text. Classify each hit: notation and identifiers stay, prose gets translated.

---

## 8. Checklist

```
[ ] Every student-visible string is Arabic (including aria-label, title, placeholder)
[ ] No French/English default prop or fallback string
[ ] No t() at module scope
[ ] No server `message` rendered to a student
[ ] PGCD and other notation left in Latin, with Arabic wording alongside
[ ] "Smarter Academy" left in Latin
[ ] No lesson-level font import or font-family override
[ ] No system font before Cairo in any stack
[ ] Every expression goes through MathText (or declares dir="ltr" itself)
[ ] Every N / M pair, counter and score is wrapped dir="ltr"
[ ] Every numeric block in a manipulation declares dir="ltr"
[ ] Directional icons come from DirectionalIcons; fixed-meaning icons do not
[ ] Arabic plurals declare all six forms, count inside the key
[ ] Terminology matches the register (الوحدة ≠ المحور)
[ ] Verified in the browser at 320 px with no horizontal scroll
```

---

## 9. Related

- [`../ALGERIA_PLATFORM_MASTER_SPEC.md`](../ALGERIA_PLATFORM_MASTER_SPEC.md) §14–§16 — the binding product rule this contract implements.
- [`LESSON_DESIGN_PLAYBOOK.md`](./LESSON_DESIGN_PLAYBOOK.md) §13bis/§13ter — the same rules in the lesson-authoring workflow.
- [`MANIPULATION_CONTRACT.md`](./MANIPULATION_CONTRACT.md) §8 — RTL inside a manipulation.
- [`CLASSROOM_MODE.md`](./CLASSROOM_MODE.md) §9 — RTL in presentation.
