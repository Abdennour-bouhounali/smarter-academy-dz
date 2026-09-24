import React, { useLayoutEffect, useRef, useState } from "react";
import { ClassroomPresentation, ClassroomEntryButton, useClassroomMode } from "../../classroom";
import { useTranslation } from "react-i18next";
import { solveShelfLayout } from "./booksClassroomLayout";
import ManipulationLevelSelector from "../ManipulationLevelSelector";
import { MANIPULATION_LEVEL_IDS, resolveManipulationLevels } from "../levels";
import { useWorkspaceLevel } from "../workspaceContext";

/**
 * DivisorExplorerBooks.jsx
 *
 * Standalone, dependency-light manipulation for Module 1 — Al Maktaba.
 *
 * Pedagogical target:
 *   420 books must be arranged with the same number of books on every shelf.
 *   The learner tests 26 and 28, discovers the remainder, then connects:
 *     420 = 26 × 16 + 4
 *     420 = 28 × 15 + 0
 *
 * Design principle:
 *   Do NOT represent "books" as bars/lines. Every book is a recognisable,
 *   illustrated 3-D book object with cover, spine and pages.
 *
 * Classroom mode (وضع القسم):
 *   The manipulation is the first consumer of the platform-level
 *   ClassroomPresentation (lessons/common/classroom). The presentation layer
 *   owns fullscreen, the fallback overlay, the scroll lock, Escape and the
 *   viewport-fitting engine; this component only READS the mode through
 *   `useClassroomMode()` and switches to a classroom layout (`be-root--
 *   presentation`) whose sizes follow `--sa-classroom-scale`. Same
 *   component, same state, same DOM position: nothing is remounted, so the
 *   chosen size, the tried sizes and the shelves survive entering/exiting.
 *   The entry button « عرض المناولة » is rendered only for presenters
 *   (core/auth.js → canPresentClassroom).
 *
 * Interaction:
 *   Choosing a shelf size IS the experiment. The shelves, the leftover books
 *   on the floor and the equality a = b × q + r appear at once, no extra
 *   button. Nothing is drawn before the first choice.
 *
 * Integration (Smarter Academy):
 *   Registered as the closed type `divisor-explorer-books` in
 *   packages/core/curriculum/manipulationTypes.js and manipulationRegistry.js.
 *   A module renders it through the registry entry point:
 *   <Manipulation
 *      type="divisor-explorer-books"
 *      total={420}
 *      candidates={[10,12,14,15,16,18,20,21,25,26,28,30,32,35,40,42,60]}
 *      onVerdict={({ b, divides, quotient, remainder }) => ...}
 *   />
 *   It is deliberately self-contained (own styles, own gesture) and does not
 *   go through ManipulationShell — so it poses its own مبتدئ / متقدم selector
 *   when it is not inside a ManipulationWorkspace (levels.js: 24 / 420); the `divisor-explorer` type remains the
 *   shell-based laboratory used by the other modules.
 *
 * No external images are required: the book illustrations are inline SVG,
 * so the component works offline and remains sharp on every screen.
 */

const DEFAULT_CANDIDATES = [10, 12, 14, 15, 16, 18, 20, 21, 25, 26, 28, 30, 32, 35, 40, 42, 60];

// La MÊME palette que `primitives/BookFigure.jsx`, volontairement dupliquée.
//
// Le livre d'ici est soudé à ses classes `be-book*` : le moteur de mise en
// page du mode classe (`booksClassroomLayout.js`) et les sélecteurs e2e les
// lisent. Le faire passer par la primitive partagée casserait ce contrat sans
// rien changer pour l'élève. Les deux dessins doivent donc rester
// IDENTIQUES À L'ŒIL : si l'un change de teintes, changer l'autre.
const palette = [
  ["#4F46E5", "#312E81", "#EEF2FF"],
  ["#0EA5E9", "#075985", "#E0F2FE"],
  ["#10B981", "#047857", "#ECFDF5"],
  ["#F59E0B", "#B45309", "#FFFBEB"],
  ["#EC4899", "#9D174D", "#FDF2F8"],
  ["#8B5CF6", "#5B21B6", "#F5F3FF"],
  ["#F97316", "#C2410C", "#FFF7ED"],
];

/** A deliberately illustrated book, not a generic rectangle/bar. */
function Book({ index, small = false, placed = false, selected = false, left = false, className = "" }) {
  const [cover, spine, page] = palette[index % palette.length];
  const w = small ? 22 : 38;
  const h = small ? 46 : 72;

  return (
    <div
      className={[
        "be-book",
        small ? "be-book--small" : "",
        placed ? "be-book--placed" : "",
        selected ? "be-book--selected" : "",
        left ? "be-book--left" : "",
        className,
      ].join(" ")}
      style={{ "--book-cover": cover, "--book-spine": spine, "--book-page": page }}
      aria-hidden="true"
    >
      <svg
        width={w}
        height={h}
        viewBox="0 0 38 72"
        role="img"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`g${index}`} x1="0" x2="1">
            <stop offset="0" stopColor={spine} />
            <stop offset="0.18" stopColor={cover} />
            <stop offset="1" stopColor={cover} />
          </linearGradient>
          <linearGradient id={`p${index}`} x1="0" x2="1">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="1" stopColor={page} />
          </linearGradient>
        </defs>

        {/* pages */}
        <path
          d="M7 5 Q10 3 13 5 L34 10 L34 66 Q31 69 27 67 L8 62 Q6 61 6 58 Z"
          fill={`url(#p${index})`}
          stroke="#CBD5E1"
          strokeWidth="1.2"
        />
        {/* front cover */}
        <path
          d="M4 3 Q6 1 9 3 L29 8 Q33 9 33 12 L33 64 Q33 68 29 67 L8 62 Q4 61 4 58 Z"
          fill={`url(#g${index})`}
          stroke={spine}
          strokeWidth="1.5"
        />
        {/* spine */}
        <path d="M4 5 Q6 3 9 4 L9 62 Q6 61 4 59 Z" fill={spine} />
        {/* title decoration */}
        <path d="M13 18 L26 21" stroke="#fff" strokeWidth="2" opacity=".9" />
        <path d="M13 23 L28 27" stroke="#fff" strokeWidth="1.5" opacity=".65" />
        <circle cx="21" cy="39" r="6" fill="#fff" opacity=".9" />
        <path d="M18 39 L21 36 L24 39 L21 42 Z" fill={cover} />
        {/* page edges */}
        <path d="M12 57 L29 61" stroke="#94A3B8" strokeWidth="1" opacity=".7" />
        <path d="M12 59 L28 63" stroke="#94A3B8" strokeWidth="1" opacity=".5" />
      </svg>
    </div>
  );
}

// Above this many books a shelf takes the whole row, so 60 books make two
// tidy rows instead of a tall stack.
const WIDE_SHELF_FROM = 29;

function Shelf({ capacity, books, index }) {
  // EVERY book of the shelf is drawn: the count the student reads is the
  // count they can see. Empty slots only appear when a shelf is not full.
  const shown = books;
  const empty = Math.max(0, capacity - shown.length);

  return (
    <div
      className={`be-shelf ${capacity >= WIDE_SHELF_FROM ? "be-shelf--wide" : ""}`}
      aria-label={`رف ${index + 1}`}
    >
      <div className="be-shelf__top">
        <span className="be-shelf__number">رف {index + 1}</span>
        <span className="be-shelf__count">
          {books.length}/{capacity}
        </span>
      </div>

      <div className="be-shelf__books">
        {shown.map((bookIndex) => (
          <Book key={bookIndex} index={bookIndex} small placed />
        ))}
        {Array.from({ length: empty }).map((_, i) => (
          <span className="be-slot" key={`e-${i}`} aria-hidden="true" />
        ))}
      </div>

      <div className="be-shelf__wood">
        <span />
      </div>
    </div>
  );
}

export default function DivisorExplorerBooks(props) {
  const { t } = useTranslation("lesson");
  const workspaceLevel = useWorkspaceLevel();
  // TWO LEVELS, like every manipulation (levels.js). Inside a
  // ManipulationWorkspace the workspace owns the only selector; posed alone,
  // the lab shows its own. The lesson's numbers are always one of the two
  // levels; the other one is the type's preset (24 books / 420 books).
  const [setup] = useState(() => (workspaceLevel
    ? null
    : resolveManipulationLevels("divisor-explorer-books", { total: props.total ?? 420 }, props.level)));
  const [level, setLevel] = useState(() => setup?.initial ?? null);
  const onLessonLevel = !setup || level === setup.initial;
  const preset = setup && !onLessonLevel ? setup.levels[level] : null;
  const labProps = preset
    ? {
        total: preset.numbers.total,
        candidates: preset.candidates,
        initialCapacity: preset.initialCapacity,
        pair: preset.pair,
        title: t("manipulation.level.practiceTitle", { level: t(`manipulation.level.${level}`) }),
      }
    : props;
  // The lesson's callbacks describe the lesson's numbers: the other level
  // never ticks a lesson step.
  const onVerdict = onLessonLevel ? props.onVerdict : undefined;

  // The presentation shell wraps the lab; the lab's state lives INSIDE, so
  // entering/leaving classroom mode never remounts it. Changing LEVEL does
  // remount it (`key`): the other level is a different library.
  return (
    <ClassroomPresentation scope="manipulation" title={labProps.title ?? "جرّب: رتّب كتب المكتبة"} entry="none">
      {setup && (
        <ManipulationLevelSelector levels={MANIPULATION_LEVEL_IDS} value={level} onChange={setLevel} className="mb-2" />
      )}
      <BooksLab key={level ?? "workspace"} {...labProps} onVerdict={onVerdict} />
    </ClassroomPresentation>
  );
}

function BooksLab({
  total = 420,
  candidates = DEFAULT_CANDIDATES,
  // La PAIRE que le manuel fait comparer (activité 1 : 26 et 28). Le bouton
  // « essaie l'autre » bascule entre ces deux tailles. Absente, il propose un
  // candidat qui donne le verdict inverse.
  pair,
  title = "جرّب: رتّب كتب المكتبة",
  lead = "اختر عدد الكتب في كل رفّ، وانظر مباشرة: هل يبقى أي كتاب خارج الرفوف؟",
  initialCapacity = 28,
  onVerdict,
}) {
  const { isClassroomMode: presentation, area, scale } = useClassroomMode();
  const [capacity, setCapacity] = useState(initialCapacity);
  // `revealed` : the student has chosen a size, so the scene shows its verdict.
  const [revealed, setRevealed] = useState(false);
  // Sizes already tried, with their verdict — the ✓ badge on the buttons.
  const [tried, setTried] = useState({});

  const quotient = Math.floor(total / capacity);
  const remainder = total % capacity;
  const divides = remainder === 0;

  // ── Classroom layout: the shelves grid is SOLVED for the scene's budget ──
  // The presentation offers a content box (`.sa-classroom-content`); we read
  // its height straight from the DOM — synchronously, in a layout effect —
  // so the very first painted frame already has a bounded grid and the
  // presentation's fit engine never sees an overflow it would then "fix" by
  // lowering the scale. We measure where the scene starts inside the lab and
  // what the scene's own chrome (sign, paddings, floor) takes; the remainder
  // is the budget for the shelves grid, and `solveShelfLayout` turns it into
  // columns and a book size. Nothing below the grid depends on the grid, so
  // this never oscillates.
  const labRef = useRef(null);
  const sceneRef = useRef(null);
  const skyRef = useRef(null);
  const floorRef = useRef(null);
  const [budget, setBudget] = useState(null);
  useLayoutEffect(() => {
    if (!presentation) { setBudget(null); return undefined; }
    const lab = labRef.current;
    const scene = sceneRef.current;
    if (!lab || !scene || typeof ResizeObserver === "undefined") return undefined;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const box = lab.closest(".sa-classroom-content");
      const availableH = box ? box.clientHeight : area.height;
      const lr = lab.getBoundingClientRect();
      const sr = scene.getBoundingClientRect();
      // What sits above the scene and below it — both independent of the grid.
      //
      // MEASURE FROM THE CONTENT BOX, NOT FROM THE LAB. The lab is not always
      // the first thing inside the presented area: since the two-level
      // workspace (MANIPULATION_CONTRACT §7bis-levels) the lab sits under a
      // title, a lead line and the مبتدئ/متقدم tabs, all inside the same
      // content box. Measuring `above` from the lab's own top ignored that
      // chrome, the grid was given more height than existed, and the
      // presented lesson scrolled vertically — which the classroom contract
      // forbids. The box's top is the only honest origin.
      const boxTop = box ? box.getBoundingClientRect().top : lr.top;
      const boxBottom = box ? box.getBoundingClientRect().bottom : lr.bottom;
      const above = sr.top - boxTop;
      const below = Math.max(0, boxBottom - sr.bottom);
      const cs = getComputedStyle(scene);
      const padX = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0) + 4;
      const padY = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0) + 4;
      const skyH = skyRef.current ? skyRef.current.offsetHeight : 0;
      // The floor is drawn below the grid and MEASURED: its books have a size
      // that depends only on the scale (CSS clamp below), never on the grid,
      // so measuring it cannot feed back into itself.
      // `offsetHeight`, not the bounding rect: the floor pops in with a
      // transform animation, and a rect read mid-animation is a few px short
      // — enough to leave the scene overflowing once the pop ends.
      const floorEl = floorRef.current;
      const floorH = floorEl ? floorEl.offsetHeight + (parseFloat(getComputedStyle(floorEl).marginTop) || 0) : 0;
      const w = Math.floor(sr.width - padX);
      const h = Math.floor(availableH - above - below - padY - skyH - floorH);
      setBudget((prev) => (prev && prev.w === w && prev.h === h ? prev : { w, h }));
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(measure); };
    const ro = new ResizeObserver(schedule);
    ro.observe(lab);
    ro.observe(scene);
    const box = lab.closest(".sa-classroom-content");
    if (box) ro.observe(box);
    // L'atelier à deux niveaux change de hauteur quand on bascule : sa taille
    // fait partie du budget, il faut donc la suivre.
    const workspace = lab.closest("[data-manipulation-workspace]");
    if (workspace) ro.observe(workspace);
    if (floorRef.current) ro.observe(floorRef.current);
    // First measure SYNCHRONOUSLY (layout effect, before paint): the budget is
    // applied before the presentation's fit engine measures the stage, so the
    // engine never sees the unbounded grid and never lowers the scale for it.
    measure();
    return () => { ro.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, [presentation, area.height, area.width, scale, revealed, remainder]);

  const layout = presentation && revealed && budget
    ? solveShelfLayout({ width: budget.w, height: budget.h, shelves: quotient, capacity, scale })
    : null;
  const sceneVars = layout ? {
    "--be-cols": layout.cols,
    "--be-book-w": `${layout.bookW}px`,
    "--be-book-h": `${layout.bookH}px`,
    "--be-book-gap": `${layout.bookGap}px`,
    "--be-shelf-gap": `${layout.gap}px`,
    "--be-shelves-max": `${Math.max(120, budget.h)}px`,
  } : undefined;

  // EVERY full shelf is drawn: 420 books at 10 per shelf are 42 shelves, and
  // the student must be able to count them. Nothing is truncated.
  const shelves = Array.from({ length: quotient }, (_, i) => {
    const start = i * capacity;
    return Array.from({ length: Math.min(capacity, total - start) }, (_, j) => start + j);
  });

  const reset = () => {
    setCapacity(initialCapacity);
    setRevealed(false);
    setTried({});
  };

  // Choosing a size arranges the books at once and reports the verdict.
  const choose = (value) => {
    const verdict = {
      b: value,
      divides: total % value === 0,
      quotient: Math.floor(total / value),
      remainder: total % value,
    };
    setCapacity(value);
    setRevealed(true);
    setTried((t) => ({ ...t, [value]: verdict.divides }));
    onVerdict?.(verdict);
  };

  // « Essayer une autre taille » — le RACCOURCI de contraste : il propose la
  // taille qui donnera le verdict INVERSE de celui qu'on regarde, pour que
  // l'élève voie « ça tombe juste » et « il reste des livres » sans chercher.
  //
  // Elle se DÉDUIT des candidats de la leçon ; elle ne peut pas être 26/28 en
  // dur. Ce couple vient de l'activité des 420 livres : sur les 143 livres du
  // module 2, il proposait une taille absente du rail, et le bouton mentait.
  // Le couple du MANUEL d'abord, quand la leçon en désigne un : l'activité 1
  // demande explicitement de comparer 26 et 28, et le raccourci doit faire
  // exactement ce que le manuel demande. `pair` est cette paire ; sans elle,
  // on déduit un candidat de verdict opposé parmi ceux de la leçon.
  const contrastCandidate = (() => {
    if (pair?.length === 2) {
      const [x, y] = pair;
      if (capacity === x) return y;
      if (capacity === y) return x;
      return x;
    }
    const wantExact = total % capacity !== 0;
    const pool = candidates.filter((c) => c !== capacity && c <= total);
    return pool.find((c) => (total % c === 0) === wantExact) ?? pool[0] ?? null;
  })();

  const testOther = () => {
    if (contrastCandidate != null) choose(contrastCandidate);
  };

  return (
    <section
      ref={labRef}
      className={`be-root ${presentation ? "be-root--presentation" : ""}`}
      dir="rtl"
      data-manipulation="divisor-explorer-books"
      data-presentation={presentation ? "true" : "false"}
      data-shelves-fit={layout ? (layout.fits ? "true" : "false") : undefined}
    >
      <style>{`
        .be-root {
          --ink:#17213B;
          --muted:#64748B;
          --line:#CBD5E1;
          --surface:#FFFFFF;
          --bg:#F4F7FF;
          --violet:#6D45E8;
          --violet2:#4F2BC5;
          --blue:#1687D9;
          --green:#0B9F68;
          --green-soft:#E7F8F1;
          --red:#E5535B;
          --red-soft:#FFF0F1;
          --amber:#E69A16;
          --amber-soft:#FFF7E5;
          font-family: "Cairo","Tajawal","Noto Sans Arabic",system-ui,sans-serif;
          color:var(--ink);
          width:100%;
        }

        .be-root * { box-sizing:border-box; }

        .be-card {
          background:linear-gradient(180deg,#fff 0%,#F8FAFF 100%);
          border:2px solid #D6DDF1;
          border-radius:26px;
          box-shadow:0 14px 40px rgba(42,54,98,.10);
          overflow:hidden;
        }

        .be-head {
          padding:18px 20px 14px;
          background:
            radial-gradient(circle at 8% 25%,rgba(255,255,255,.85) 0 4px,transparent 5px),
            radial-gradient(circle at 82% 70%,rgba(255,255,255,.8) 0 3px,transparent 4px),
            linear-gradient(135deg,#F1EEFF,#EFF8FF);
          border-bottom:1px solid #E0E6F4;
        }

        .be-head__bar {
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
          flex-wrap:wrap;
          margin-bottom:8px;
        }

        /* ── Classroom mode (وضع القسم) — the classroom-optimized layout ──
           Sizes follow the presentation scale published by
           ClassroomPresentation (--sa-classroom-scale, 0.55…1.25): the fit
           engine lowers it when the shelves would overflow the screen and
           lets it grow back when there is room. Nothing here is a browser
           zoom; the layout stays responsive. */
        .be-root--presentation {
          --be-s: var(--sa-classroom-scale, 1);
          max-width: 1800px;
          margin: 0 auto;
        }

        .be-root--presentation .be-card { border-radius: 22px; box-shadow: 0 10px 30px rgba(42,54,98,.08); }
        .be-root--presentation .be-head { display: none; }
        .be-root--presentation .be-help { display: none; }
        .be-root--presentation .be-mission__hint { display: none; }

        /* Two regions: the CONTROLS strip on top, then the SCENE (books and
           shelves — the widest, the biggest) beside the RESULT column. Under
           1100px the result goes above the scene, full width. */
        .be-root--presentation .be-game {
          padding: calc(14px * var(--be-s)) calc(18px * var(--be-s));
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          grid-template-areas: "top top" "scene side";
          gap: calc(14px * var(--be-s));
          align-items: start;
        }

        .be-root--presentation .be-game__top {
          grid-area: top;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: calc(10px * var(--be-s)) calc(14px * var(--be-s));
        }

        .be-root--presentation .be-game__top > * { margin: 0; }
        .be-root--presentation .be-scene { grid-area: scene; min-width: 0; }
        .be-root--presentation .be-side {
          grid-area: side;
          display: flex;
          flex-direction: column;
          gap: calc(12px * var(--be-s));
          width: clamp(300px, calc(380px * var(--be-s)), 470px);
        }
        .be-root--presentation .be-side:empty { display: none; }
        .be-root--presentation .be-side > * { margin: 0; }

        .be-root--presentation .be-mission { padding: calc(10px * var(--be-s)) calc(14px * var(--be-s)); }
        .be-root--presentation .be-mission strong { font-size: calc(19px * var(--be-s)); }
        .be-root--presentation .be-total { font-size: calc(28px * var(--be-s)); padding: calc(6px * var(--be-s)) calc(14px * var(--be-s)); }

        .be-root--presentation .be-choices { gap: calc(8px * var(--be-s)); }
        .be-root--presentation .be-choice {
          min-width: calc(74px * var(--be-s));
          min-height: calc(64px * var(--be-s));
          padding: 0 calc(16px * var(--be-s));
          font-size: calc(26px * var(--be-s));
          border-radius: calc(16px * var(--be-s));
          border-color: #94A3B8;
          color: #0F172A;
        }
        .be-root--presentation .be-choice.active { color: #fff; }
        .be-root--presentation .be-choice.tested::after {
          width: calc(26px * var(--be-s)); height: calc(26px * var(--be-s));
          top: calc(-11px * var(--be-s)); left: calc(-9px * var(--be-s));
          font-size: calc(15px * var(--be-s));
        }

        .be-root--presentation .be-actions { gap: calc(9px * var(--be-s)); }
        .be-root--presentation .be-btn { min-height: calc(56px * var(--be-s)); font-size: calc(18px * var(--be-s)); padding: 0 calc(20px * var(--be-s)); }

        .be-root--presentation .be-result { padding: calc(16px * var(--be-s)) calc(20px * var(--be-s)); grid-template-columns: auto 1fr; }
        .be-root--presentation .be-result strong { font-size: calc(22px * var(--be-s)); }
        .be-root--presentation .be-result span { font-size: calc(17px * var(--be-s)); }
        .be-root--presentation .be-result__icon { width: calc(60px * var(--be-s)); height: calc(60px * var(--be-s)); font-size: calc(32px * var(--be-s)); }
        .be-root--presentation .be-equation {
          grid-column: 1 / -1;
          justify-self: stretch;
          text-align: center;
          /* 17 monospace glyphs (« 420 = 26 × 16 + 4 ») must fit the result
             column on ONE line: ~0.6em per glyph → 30px at scale 1. */
          font-size: calc(30px * var(--be-s));
          padding: calc(12px * var(--be-s)) calc(14px * var(--be-s));
          border-color: rgba(23,33,59,.18);
        }
        .be-root--presentation .be-observation { gap: calc(8px * var(--be-s)); }
        .be-root--presentation .be-pill { font-size: calc(17px * var(--be-s)); padding: calc(10px * var(--be-s)) calc(16px * var(--be-s)); }

        .be-root--presentation .be-scene { padding: calc(14px * var(--be-s)); }
        .be-root--presentation .be-status { font-size: calc(17px * var(--be-s)); }
        .be-root--presentation .be-status b { font-size: calc(24px * var(--be-s)); }
        .be-root--presentation .be-library-sign { font-size: calc(19px * var(--be-s)); }

        /* The shelves grid is SOLVED (booksClassroomLayout.js): one row of
           books per shelf, columns and book size from the scene's budget.
           When even the smallest readable book does not make everything
           fit, the grid scrolls INTERNALLY — the page never does, and the
           counters, equality and floor stay on screen. */
        .be-root--presentation .be-shelves {
          grid-template-columns: repeat(var(--be-cols, 2), minmax(0, 1fr));
          gap: var(--be-shelf-gap, calc(12px * var(--be-s)));
          max-height: var(--be-shelves-max, 40vh);
          overflow: auto;
          overscroll-behavior: contain;
          padding: 3px 2px 6px;
        }
        .be-root--presentation .be-shelf--wide { grid-column: auto; }
        .be-root--presentation .be-shelf { border-color: #B9C4D6; padding: calc(6px * var(--be-s)) calc(8px * var(--be-s)) 0; min-width: 0; }
        .be-root--presentation .be-shelf__top { font-size: calc(13px * var(--be-s)); margin-bottom: calc(4px * var(--be-s)); }
        .be-root--presentation .be-shelf__books {
          flex-wrap: nowrap;
          min-height: 0;
          gap: var(--be-book-gap, 3px);
          padding: calc(4px * var(--be-s)) calc(4px * var(--be-s)) calc(3px * var(--be-s));
        }
        .be-root--presentation .be-book--small,
        .be-root--presentation .be-book--small svg { width: var(--be-book-w, 22px); height: var(--be-book-h, 46px); flex: 0 0 auto; }
        .be-root--presentation .be-slot { width: var(--be-book-w, 22px); height: var(--be-book-h, 46px); flex: 0 0 auto; }
        .be-root--presentation .be-shelf__wood { height: calc(10px * var(--be-s)); }
        .be-root--presentation .be-floor__books { gap: calc(10px * var(--be-s)); }
        /* The leftover books are the point: big, and sized by the scale ALONE
           (never by the grid — their height is part of the grid's budget). */
        .be-root--presentation .be-floor__books .be-book--small,
        .be-root--presentation .be-floor__books .be-book--small svg {
          width: clamp(22px, calc(36px * var(--be-s)), 44px);
          height: clamp(45px, calc(74px * var(--be-s)), 91px);
        }

        .be-root--presentation .be-floor__label strong { font-size: calc(21px * var(--be-s)); }
        .be-root--presentation .be-floor__hint { font-size: calc(16px * var(--be-s)); }
        .be-root--presentation .be-floor__badge { min-width: calc(48px * var(--be-s)); height: calc(48px * var(--be-s)); font-size: calc(26px * var(--be-s)); }
        .be-root--presentation .be-floor--empty { font-size: calc(20px * var(--be-s)); }
        .be-root--presentation .be-waiting strong { font-size: calc(20px * var(--be-s)); }
        .be-root--presentation .be-waiting span { font-size: calc(17px * var(--be-s)); }

        @media (max-width: 1100px) {
          .be-root--presentation .be-game {
            grid-template-columns: minmax(0, 1fr);
            grid-template-areas: "top" "side" "scene";
          }
          .be-root--presentation .be-side { width: auto; }
        }

        /* Normal mode: the two wrappers are transparent, the flow is unchanged. */
        .be-game__top, .be-side { display: contents; }

        .be-kicker {
          display:inline-flex;
          align-items:center;
          gap:7px;
          padding:5px 11px;
          border-radius:999px;
          background:#fff;
          border:2px solid #DCD2FF;
          color:var(--violet2);
          font-weight:800;
          font-size:12px;
        }

        .be-title {
          margin:0;
          font-size:clamp(21px,3vw,29px);
          line-height:1.2;
          font-weight:900;
        }

        .be-lead {
          margin:7px 0 0;
          color:var(--muted);
          font-size:15px;
          line-height:1.6;
        }

        .be-game {
          padding:16px;
        }

        .be-mission {
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:14px;
          flex-wrap:wrap;
          padding:12px 14px;
          border:2px solid #DCD2FF;
          background:#F7F4FF;
          border-radius:18px;
          margin-bottom:14px;
        }

        .be-mission strong { font-size:15px; }
        .be-total {
          display:inline-flex;
          align-items:center;
          gap:7px;
          background:#fff;
          border:2px solid #CFC3FF;
          border-radius:13px;
          padding:7px 12px;
          font-family:ui-monospace,monospace;
          font-weight:900;
          font-size:20px;
          color:var(--violet2);
          direction:ltr;
        }

        .be-choices {
          display:flex;
          gap:8px;
          flex-wrap:wrap;
          margin-bottom:14px;
        }

        .be-choice {
          position:relative;
          min-width:54px;
          min-height:48px;
          padding:0 13px;
          border-radius:13px;
          border:2px solid var(--line);
          border-bottom-width:4px;
          background:#fff;
          cursor:pointer;
          font:inherit;
          font-family:ui-monospace,"Cairo",monospace;
          font-size:17px;
          font-weight:900;
          transition:.16s ease;
        }

        .be-choice:hover {
          transform:translateY(-2px);
          border-color:var(--violet);
        }

        .be-choice.active {
          background:var(--violet);
          color:#fff;
          border-color:var(--violet2);
          box-shadow:0 5px 0 var(--violet2),0 0 0 5px rgba(109,69,232,.12);
          transform:translateY(-2px);
        }

        /* Verdict badge on a tried size: green ✓ = divisor, red ✕ = a remainder stays. */
        .be-choice.tested::after {
          position:absolute;
          top:-9px;
          left:-7px;
          width:20px;
          height:20px;
          display:grid;
          place-items:center;
          border-radius:50%;
          background:var(--green);
          color:#fff;
          font:800 12px system-ui;
          border:2px solid #fff;
        }

        .be-choice.tested-ok::after { content:"✓"; background:var(--green); }
        .be-choice.tested-no::after { content:"✕"; background:var(--red); }
        .be-choice.tested-no { border-color:#F2B8BD; }
        .be-choice.tested-no.active { border-color:var(--violet2); }

        .be-scene {
          position:relative;
          border:2px solid #D8E1EF;
          border-radius:22px;
          background:
            radial-gradient(circle at 10% 15%,#fff 0 2px,transparent 3px),
            linear-gradient(180deg,#F8FBFF 0%,#EDF3FC 100%);
          padding:14px;
          overflow:hidden;
        }

        .be-scene__sky {
          height:42px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:0 4px 6px;
        }

        .be-library-sign {
          display:flex;
          align-items:center;
          gap:9px;
          padding:7px 12px;
          background:#fff;
          border:2px solid #D6DDF1;
          border-radius:13px;
          font-weight:900;
          box-shadow:0 3px 0 rgba(25,40,70,.06);
        }

        .be-library-sign__icon {
          width:31px;height:31px;border-radius:9px;
          display:grid;place-items:center;
          background:#EDE9FE;
          font-size:20px;
        }

        .be-status {
          display:flex;
          align-items:center;
          gap:7px;
          font-size:13px;
          color:var(--muted);
          font-weight:800;
        }

        .be-status__sep { color:#B4BFD0; }

        .be-status b {
          font-family:ui-monospace,monospace;
          font-size:16px;
          color:var(--ink);
          direction:ltr;
        }

        .be-shelves {
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
          gap:11px;
          max-height:420px;
          overflow:auto;
          padding:3px 2px 8px;
        }

        .be-shelf {
          background:#FFF;
          border:2px solid #D5DCE8;
          border-radius:15px;
          padding:8px 9px 0;
          box-shadow:0 5px 10px rgba(28,42,71,.07);
        }

        .be-shelf--wide { grid-column:1 / -1; }

        .be-shelf__top {
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:6px;
          font-size:11px;
          color:var(--muted);
          font-weight:900;
        }

        .be-shelf__count {
          direction:ltr;
          font-family:ui-monospace,monospace;
        }

        .be-shelf__books {
          min-height:58px;
          display:flex;
          align-items:flex-end;
          flex-wrap:wrap;
          gap:3px;
          padding:5px 5px 4px;
          background:linear-gradient(180deg,#F8FAFC,#EEF2F7);
          border-radius:9px 9px 2px 2px;
        }

        .be-slot {
          width:22px;
          height:46px;
          border:1.5px dashed #CBD5E1;
          border-radius:4px;
          opacity:.42;
        }

        .be-shelf__wood {
          height:9px;
          margin:0 -2px;
          border-radius:3px 3px 10px 10px;
          background:linear-gradient(180deg,#A86D3D,#70401F);
          box-shadow:0 4px 0 #533019;
        }

        .be-book {
          width:38px;
          height:72px;
          display:flex;
          align-items:flex-end;
          justify-content:center;
          transform-origin:bottom center;
          transition:transform .18s ease,filter .18s ease;
          filter:drop-shadow(1px 3px 2px rgba(23,33,59,.20));
        }

        .be-book--small { width:22px;height:46px; }
        .be-book--small svg { width:22px;height:46px; }

        .be-book--placed { animation:be-book-in .34s cubic-bezier(.2,1.4,.5,1) both; }

        .be-book:hover { transform:translateY(-7px) rotate(-2deg); filter:drop-shadow(2px 7px 3px rgba(23,33,59,.20)); }

        @keyframes be-book-in {
          0% { opacity:0; transform:translateY(-22px) rotate(-7deg) scale(.78); }
          70% { opacity:1; transform:translateY(2px) rotate(2deg) scale(1.04); }
          100% { opacity:1; transform:none; }
        }

        .be-floor {
          margin-top:12px;
          border:3px dashed #F0A3A8;
          background:linear-gradient(180deg,#FFF6F6,var(--red-soft));
          border-radius:17px;
          padding:10px 12px 12px;
          animation:be-pop .36s cubic-bezier(.2,1.35,.5,1);
        }

        .be-floor--empty {
          border-color:#8CDEBC;
          background:linear-gradient(180deg,#F6FDF9,var(--green-soft));
          display:flex;
          align-items:center;
          gap:10px;
          color:#08744C;
          font-weight:900;
          font-size:14px;
        }

        .be-floor__label {
          display:flex;
          align-items:center;
          gap:9px;
          flex-wrap:wrap;
          margin-bottom:8px;
          color:#9F2A32;
        }

        .be-floor__label strong { font-size:15px; }

        .be-floor__badge {
          min-width:36px;
          height:36px;
          padding:0 10px;
          display:grid;
          place-items:center;
          border-radius:12px;
          background:var(--red);
          color:#fff;
          font:900 19px ui-monospace,monospace;
          direction:ltr;
          box-shadow:0 3px 0 #B8333C;
        }

        .be-floor__hint {
          color:#B04A52;
          font-size:12.5px;
          font-weight:700;
        }

        .be-floor__books {
          display:flex;
          flex-wrap:wrap;
          align-items:flex-end;
          gap:8px;
          padding:10px 10px 6px;
          border-radius:12px;
          background:
            repeating-linear-gradient(90deg,rgba(184,51,60,.06) 0 14px,transparent 14px 28px),
            #FFFFFF;
          border:2px solid #F6C9CC;
        }

        .be-book--left {
          padding:3px 3px 0;
          border-radius:7px;
          outline:2px dashed var(--red);
          outline-offset:2px;
          background:rgba(229,83,91,.10);
          transform:rotate(-8deg);
          animation:be-book-left .5s cubic-bezier(.2,1.4,.5,1) both;
        }

        .be-book--left:hover { transform:translateY(-4px) rotate(-8deg); }

        @keyframes be-book-left {
          0% { opacity:0; transform:translateY(-30px) rotate(12deg) scale(.8); }
          70% { opacity:1; transform:translateY(3px) rotate(-11deg) scale(1.05); }
          100% { opacity:1; transform:rotate(-8deg); }
        }

        .be-waiting {
          min-height:120px;
          border:3px dashed #C8BDFB;
          border-radius:19px;
          background:linear-gradient(135deg,#F8F5FF,#FFF);
          padding:14px 16px;
          display:flex;
          align-items:center;
          gap:16px;
          flex-wrap:wrap;
        }

        .be-waiting__pile {
          width:82px;
          height:75px;
          position:relative;
          flex:0 0 auto;
        }

        .be-stack-book {
          position:absolute;
          bottom:0;
          width:45px;
          height:68px;
          filter:drop-shadow(1px 4px 2px rgba(23,33,59,.2));
        }

        .be-stack-book:nth-child(1){right:4px;transform:rotate(5deg);}
        .be-stack-book:nth-child(2){right:16px;transform:rotate(-1deg);}
        .be-stack-book:nth-child(3){right:28px;transform:rotate(-7deg);}

        .be-waiting strong { display:block; font-size:15px; margin-bottom:3px; }
        .be-waiting span { display:block; color:var(--muted); font-size:13px; line-height:1.55; }

        .be-actions {
          display:flex;
          gap:9px;
          flex-wrap:wrap;
          margin-bottom:14px;
        }

        .be-btn {
          min-height:48px;
          border-radius:14px;
          border:2px solid var(--line);
          border-bottom-width:4px;
          padding:0 16px;
          background:#fff;
          cursor:pointer;
          font:inherit;
          font-size:14px;
          font-weight:900;
          transition:.15s ease;
        }

        .be-btn:hover { transform:translateY(-2px); border-color:var(--violet); }
        .be-btn:active { transform:translateY(2px); border-bottom-width:2px; }
        .be-btn.primary { background:var(--violet); color:#fff; border-color:var(--violet2); }
        .be-btn.secondary { background:#F8FAFC; }
        .be-btn:disabled { opacity:.45; cursor:not-allowed; transform:none; }

        .be-result {
          margin-top:0;
          border:2px solid;
          border-radius:18px;
          padding:13px 15px;
          display:grid;
          grid-template-columns:auto 1fr auto;
          gap:12px;
          align-items:center;
          animation:be-pop .36s cubic-bezier(.2,1.35,.5,1);
        }

        .be-result.good { border-color:#7AD8B4; background:var(--green-soft); }
        .be-result.warn { border-color:#F2CD78; background:var(--amber-soft); }

        .be-result__icon {
          width:44px;height:44px;border-radius:50%;
          display:grid;place-items:center;
          background:#fff;
          font-size:24px;
          box-shadow:0 3px 0 rgba(23,33,59,.08);
        }

        .be-result strong { display:block;font-size:16px; }
        .be-result span { display:block;color:#5F6E84;font-size:13px;margin-top:2px; }

        .be-equation {
          direction:ltr;
          white-space:nowrap;
          font:900 clamp(15px,3vw,21px) ui-monospace,monospace;
          background:#fff;
          padding:8px 11px;
          border-radius:12px;
          border:2px solid rgba(23,33,59,.10);
        }

        /* .be-result span (and its fullscreen override) must not touch the equation. */
        .be-result .be-equation span { display:inline; margin:0; font:inherit; }
        .be-equation .q { color:var(--violet2); }
        .be-equation .r { color:var(--red); }

        .be-observation {
          margin:13px 0 14px;
          display:flex;
          gap:8px;
          flex-wrap:wrap;
        }

        .be-pill {
          display:inline-flex;
          align-items:center;
          gap:6px;
          padding:7px 11px;
          border-radius:999px;
          background:#fff;
          border:2px solid #DCE3EF;
          font-size:12px;
          font-weight:900;
        }

        .be-pill b { font-family:ui-monospace,monospace; direction:ltr; }
        .be-pill.ok { border-color:#8CDEBC;color:#08744C;background:#F0FBF6; }
        .be-pill.no { border-color:#F2B8BD;color:#B8333C;background:#FFF5F5; }

        .be-help {
          margin-top:10px;
          color:var(--muted);
          font-size:12px;
          line-height:1.55;
          text-align:center;
        }

        @keyframes be-pop {
          0%{opacity:0;transform:translateY(8px) scale(.97)}
          65%{transform:translateY(0) scale(1.015)}
          100%{opacity:1;transform:none}
        }

        @media (max-width:720px) {
          .be-game { padding:11px; }
          .be-scene { padding:9px; }
          .be-shelves { grid-template-columns:1fr; max-height:360px; }
          .be-result { grid-template-columns:auto 1fr; }
          .be-equation { grid-column:1 / -1; justify-self:stretch; text-align:center; }
        }

        @media (prefers-reduced-motion:reduce) {
          .be-root *, .be-root *::before, .be-root *::after {
            animation-duration:.001ms !important;
            animation-iteration-count:1 !important;
            transition-duration:.001ms !important;
          }
        }
      `}</style>

      <div className="be-card">
        <header className="be-head">
          <div className="be-head__bar">
            <div className="be-kicker">🎮 لعبة المكتبة · استكشف بنفسك</div>
            <ClassroomEntryButton />
          </div>
          <h2 className="be-title">{title}</h2>
          <p className="be-lead">{lead}</p>
        </header>

        <div className="be-game">
          <div className="be-game__top">
          <div className="be-mission">
            <div>
              <strong>المهمة: وزّع الكتب بالتساوي على الرفوف</strong>
              <div className="be-mission__hint" style={{ color: "#64748B", fontSize: 12, marginTop: 2 }}>
                جرّب عددًا واحدًا في كل رف، ثم راقب ماذا يحدث للكتب.
              </div>
            </div>
            <div className="be-total">📚 {total} كتابًا</div>
          </div>

          <div className="be-choices" aria-label="عدد الكتب في كل رف">
            {candidates.map((n) => {
              const active = revealed && capacity === n;
              const verdict = tried[n]; // undefined = not tried, true = divisor, false = remainder
              return (
                <button
                  key={n}
                  type="button"
                  className={`be-choice ${active ? "active" : ""} ${
                    verdict === undefined ? "" : verdict ? "tested tested-ok" : "tested tested-no"
                  }`}
                  onClick={() => choose(n)}
                  aria-pressed={active}
                  title={
                    verdict === undefined
                      ? undefined
                      : verdict
                        ? `${n} قاسم: لا يبقى شيء`
                        : `${n} ليس قاسمًا: يبقى ${total % n}`
                  }
                >
                  {n}
                </button>
              );
            })}
          </div>

          <div className="be-actions">
            <button className="be-btn secondary" type="button" onClick={testOther} disabled={contrastCandidate == null}>
              🔄 جرّب {contrastCandidate ?? '—'}
            </button>
            <button className="be-btn secondary" type="button" onClick={reset}>
              ↺ ابدأ من جديد
            </button>
          </div>
          </div>

          <div className="be-side">
          {revealed && (
            <>
              <div className={`be-result ${divides ? "good" : "warn"}`}>
                <div className="be-result__icon">{divides ? "🎉" : "📖"}</div>

                <div>
                  <strong>
                    {divides
                      ? `رائع! كل الكتب دخلت الرفوف.`
                      : `توقّف! بقيت ${remainder} كتب خارج الرفوف.`}
                  </strong>
                  <span>
                    {divides
                      ? `كوّنا ${quotient} رفوف، في كل رف ${capacity} كتابًا.`
                      : `كوّنا ${quotient} رفوف ممتلئة، ثم بقيت ${remainder} كتب.`}
                  </span>
                </div>

                <div className="be-equation">
                  {total} = <span className="q">{capacity} × {quotient}</span>
                  {" + "}
                  <span className="r">{remainder}</span>
                </div>
              </div>

              <div className="be-observation">
                <span className={`be-pill ${remainder === 0 ? "ok" : "no"}`}>
                  {remainder === 0 ? "✓ لا يبقى شيء" : "✕ يبقى شيء"}
                </span>
                <span className="be-pill">
                  عدد الرفوف: <b>{quotient}</b>
                </span>
                <span className="be-pill">
                  الباقي: <b>{remainder}</b>
                </span>
              </div>
            </>
          )}
          </div>

          <div className="be-scene" ref={sceneRef} style={sceneVars}>
            <div className="be-scene__sky" ref={skyRef}>
              <div className="be-library-sign">
                <span className="be-library-sign__icon">📚</span>
                <span>مكتبة المدرسة</span>
              </div>
              <div className="be-status">
                <span>
                  الكتب في كل رف: <b>{revealed ? capacity : "—"}</b>
                </span>
                <span className="be-status__sep" aria-hidden="true">·</span>
                <span>
                  الرفوف الممتلئة: <b>{revealed ? quotient : "—"}</b>
                </span>
              </div>
            </div>

            {revealed ? (
              <div className="be-shelves">
                {shelves.map((books, i) => (
                  <Shelf key={`${capacity}-${i}`} capacity={capacity} books={books} index={i} />
                ))}
              </div>
            ) : (
              <div className="be-waiting" role="status">
                <div className="be-waiting__pile" aria-hidden="true">
                  <Book index={1} className="be-stack-book" />
                  <Book index={3} className="be-stack-book" />
                  <Book index={5} className="be-stack-book" />
                </div>
                <div>
                  <strong>📦 {total} كتابًا تنتظر مكانها</strong>
                  <span>اختر عدد الكتب في كل رفّ من الأزرار أعلاه، وسترى الرفوف تمتلئ فورًا.</span>
                </div>
              </div>
            )}

            {revealed && remainder > 0 && (
              <div
                ref={floorRef}
                className="be-floor"
                role="group"
                aria-label={`${remainder} كتب بقيت خارج الرفوف`}
              >
                <div className="be-floor__label">
                  <span className="be-floor__badge">{remainder}</span>
                  <strong>كتب بقيت خارج الرفوف</strong>
                  <span className="be-floor__hint">
                    لا تكفي لملء رفّ جديد من {capacity} كتابًا
                  </span>
                </div>
                <div className="be-floor__books">
                  {Array.from({ length: remainder }, (_, j) => quotient * capacity + j).map(
                    (bookIndex) => (
                      <Book key={bookIndex} index={bookIndex} small placed left />
                    )
                  )}
                </div>
              </div>
            )}

            {revealed && remainder === 0 && (
              <div ref={floorRef} className="be-floor be-floor--empty" role="status">
                <span aria-hidden="true">✅</span>
                الأرض فارغة: كل كتاب وجد مكانه في رفّ.
              </div>
            )}

            <div className="be-help">
              💡 لا نخبرك بالإجابة قبل التجربة. انظر إلى الكتب: هل تستطيع وضع العدد نفسه
              في كل رف من دون أن يبقى كتاب خارج المكتبة؟
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
