import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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
 * Classroom mode (عرض كامل):
 *   The manipulation can take the whole screen for projection. It uses the
 *   Fullscreen API when the browser offers it and falls back to a fixed
 *   overlay rendered through a portal (iOS Safari, or a refused request).
 *   Same component, same state: only the scale of the scene changes.
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
 *   go through ManipulationShell; the `divisor-explorer` type remains the
 *   shell-based laboratory used by the other modules.
 *
 * No external images are required: the book illustrations are inline SVG,
 * so the component works offline and remains sharp on every screen.
 */

const DEFAULT_CANDIDATES = [10, 12, 14, 15, 16, 18, 20, 21, 25, 26, 28, 30, 32, 35, 40, 42, 60];

const palette = [
  ["#4F46E5", "#312E81", "#EEF2FF"],
  ["#0EA5E9", "#075985", "#E0F2FE"],
  ["#10B981", "#047857", "#ECFDF5"],
  ["#F59E0B", "#B45309", "#FFFBEB"],
  ["#EC4899", "#9D174D", "#FDF2F8"],
  ["#8B5CF6", "#5B21B6", "#F5F3FF"],
  ["#F97316", "#C2410C", "#FFF7ED"],
];

function ExpandIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 3h6v6" />
      <path d="M9 21H3v-6" />
      <path d="M21 3l-7 7" />
      <path d="M3 21l7-7" />
    </svg>
  );
}

function CompressIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 14h6v6" />
      <path d="M20 10h-6V4" />
      <path d="M14 10l7-7" />
      <path d="M3 21l7-7" />
    </svg>
  );
}

/** Fullscreen API with the WebKit spelling, or null when the browser has neither. */
function fullscreenApi(el) {
  if (typeof document === "undefined" || !el) return null;
  if (document.fullscreenEnabled && el.requestFullscreen) {
    return {
      request: () => el.requestFullscreen({ navigationUI: "hide" }),
      exit: () => document.exitFullscreen(),
      current: () => document.fullscreenElement,
      event: "fullscreenchange",
    };
  }
  if (document.webkitFullscreenEnabled && el.webkitRequestFullscreen) {
    return {
      request: () => Promise.resolve(el.webkitRequestFullscreen()),
      exit: () => Promise.resolve(document.webkitExitFullscreen()),
      current: () => document.webkitFullscreenElement,
      event: "webkitfullscreenchange",
    };
  }
  return null;
}

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
      aria-label={`Livre ${index + 1}`}
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

export default function DivisorExplorerBooks({
  total = 420,
  candidates = DEFAULT_CANDIDATES,
  title = "جرّب: رتّب كتب المكتبة",
  lead = "اختر عدد الكتب في كل رفّ، وانظر مباشرة: هل يبقى أي كتاب خارج الرفوف؟",
  initialCapacity = 28,
  onVerdict,
}) {
  const [capacity, setCapacity] = useState(initialCapacity);
  // `revealed` : the student has chosen a size, so the scene shows its verdict.
  const [revealed, setRevealed] = useState(false);
  // Sizes already tried, with their verdict — the ✓ badge on the buttons.
  const [tried, setTried] = useState({});

  // Classroom mode. `fullscreen` is what the student sees; `fallback` says the
  // overlay is ours (no Fullscreen API) and must be portalled + closed on Escape.
  const rootRef = useRef(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [fallback, setFallback] = useState(false);

  const enterFullscreen = async () => {
    const api = fullscreenApi(rootRef.current);
    if (api) {
      try {
        await api.request();
        return;
      } catch {
        // Refused (iframe policy, no gesture…) — fall through to the overlay.
      }
    }
    setFallback(true);
    setFullscreen(true);
  };

  const exitFullscreen = async () => {
    const api = fullscreenApi(rootRef.current);
    if (api && api.current() === rootRef.current) {
      try {
        await api.exit();
      } catch {
        // ignore — the change event, or the state reset below, settles it
      }
    }
    setFallback(false);
    setFullscreen(false);
  };

  // Follow the browser: Escape or the system UI leave fullscreen without us.
  useEffect(() => {
    const api = fullscreenApi(rootRef.current);
    if (!api) return undefined;
    const sync = () => setFullscreen(api.current() === rootRef.current || fallback);
    document.addEventListener(api.event, sync);
    return () => document.removeEventListener(api.event, sync);
  }, [fallback]);

  // Our own overlay: lock the page behind it and close on Escape.
  useEffect(() => {
    if (!fallback) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") exitFullscreen();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [fallback]); // eslint-disable-line react-hooks/exhaustive-deps

  const quotient = Math.floor(total / capacity);
  const remainder = total % capacity;
  const divides = remainder === 0;

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

  const testOther = () => {
    const next = capacity === 28 ? 26 : 28;
    choose(next);
  };

  const view = (
    <section
      ref={rootRef}
      className={`be-root ${fullscreen ? "be-root--fullscreen" : ""} ${fallback ? "be-root--overlay" : ""}`}
      dir="rtl"
      data-manipulation="divisor-explorer-books"
      data-fullscreen={fullscreen ? "true" : "false"}
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

        .be-fs-btn {
          display:inline-flex;
          align-items:center;
          gap:8px;
          min-height:44px;
          padding:0 16px;
          border-radius:14px;
          border:2px solid var(--violet2);
          border-bottom-width:4px;
          background:linear-gradient(180deg,var(--violet),var(--violet2));
          color:#fff;
          cursor:pointer;
          font:inherit;
          font-size:14px;
          font-weight:900;
          box-shadow:0 6px 18px rgba(109,69,232,.28);
          transition:.15s ease;
        }

        .be-fs-btn:hover { transform:translateY(-2px); box-shadow:0 9px 22px rgba(109,69,232,.34); }
        .be-fs-btn:active { transform:translateY(2px); border-bottom-width:2px; }
        .be-fs-btn:focus-visible { outline:3px solid #B9A6FF; outline-offset:2px; }
        .be-fs-btn--exit { background:#fff; color:var(--violet2); box-shadow:0 3px 0 rgba(23,33,59,.08); }

        /* ── Classroom mode: the manipulation takes the whole screen ── */
        .be-root:fullscreen,
        .be-root--overlay {
          background:linear-gradient(180deg,#EEF2FF 0%,#F6F8FF 100%);
          overflow:auto;
        }

        .be-root--overlay {
          position:fixed;
          inset:0;
          z-index:2147483000;
          width:auto;
        }

        .be-root--fullscreen {
          padding:clamp(12px,2vw,28px) clamp(12px,3vw,40px);
          min-height:100vh;
          min-height:100dvh;
        }

        .be-root--fullscreen .be-card {
          max-width:1700px;
          margin:0 auto;
          border-radius:22px;
        }

        .be-root--fullscreen .be-head { padding:20px 28px 16px; }
        .be-root--fullscreen .be-title { font-size:clamp(28px,3.2vw,44px); }
        .be-root--fullscreen .be-lead { font-size:clamp(17px,1.5vw,22px); }
        .be-root--fullscreen .be-game { padding:20px 24px; }
        .be-root--fullscreen .be-mission strong { font-size:clamp(18px,1.5vw,22px); }
        .be-root--fullscreen .be-total { font-size:clamp(24px,2.2vw,32px); }

        .be-root--fullscreen .be-choice {
          min-width:74px;
          min-height:66px;
          padding:0 18px;
          font-size:clamp(22px,1.9vw,28px);
          border-radius:16px;
        }

        .be-root--fullscreen .be-choice.tested::after {
          width:26px;height:26px;
          top:-11px;left:-9px;
          font-size:15px;
        }

        .be-root--fullscreen .be-btn { min-height:58px; font-size:clamp(16px,1.3vw,20px); padding:0 22px; }
        .be-root--fullscreen .be-result { padding:18px 22px; }
        .be-root--fullscreen .be-result strong { font-size:clamp(20px,1.7vw,26px); }
        .be-root--fullscreen .be-result span { font-size:clamp(15px,1.2vw,19px); }
        .be-root--fullscreen .be-result__icon { width:60px;height:60px;font-size:32px; }
        .be-root--fullscreen .be-equation { font-size:clamp(26px,3vw,44px); padding:12px 18px; }
        .be-root--fullscreen .be-pill { font-size:clamp(15px,1.2vw,19px); padding:10px 16px; }
        .be-root--fullscreen .be-status { font-size:clamp(15px,1.2vw,19px); }
        .be-root--fullscreen .be-status b { font-size:clamp(20px,1.6vw,26px); }
        .be-root--fullscreen .be-library-sign { font-size:clamp(16px,1.3vw,21px); }

        .be-root--fullscreen .be-shelves {
          max-height:none;
          overflow:visible;
          grid-template-columns:repeat(auto-fit,minmax(320px,1fr));
          gap:14px;
        }

        .be-root--fullscreen .be-shelf__top { font-size:14px; }
        .be-root--fullscreen .be-shelf__books { min-height:76px; gap:4px; }
        .be-root--fullscreen .be-book--small,
        .be-root--fullscreen .be-book--small svg { width:30px;height:62px; }
        .be-root--fullscreen .be-slot { width:30px;height:62px; }
        .be-root--fullscreen .be-shelf__wood { height:12px; }

        .be-root--fullscreen .be-floor__label strong { font-size:clamp(18px,1.5vw,23px); }
        .be-root--fullscreen .be-floor__hint { font-size:clamp(14px,1.1vw,17px); }
        .be-root--fullscreen .be-floor__badge { min-width:48px;height:48px;font-size:26px; }
        .be-root--fullscreen .be-floor--empty { font-size:clamp(17px,1.4vw,22px); }
        .be-root--fullscreen .be-waiting strong { font-size:clamp(18px,1.5vw,22px); }
        .be-root--fullscreen .be-waiting span { font-size:clamp(15px,1.2vw,18px); }
        .be-root--fullscreen .be-help { font-size:clamp(14px,1.1vw,17px); }

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
            {fullscreen ? (
              <button
                type="button"
                className="be-fs-btn be-fs-btn--exit"
                onClick={exitFullscreen}
                title="الخروج من العرض الكامل (Esc)"
                aria-label="الخروج من العرض الكامل"
                aria-pressed="true"
              >
                <CompressIcon />
                <span>خروج من العرض الكامل</span>
              </button>
            ) : (
              <button
                type="button"
                className="be-fs-btn"
                onClick={enterFullscreen}
                title="عرض المناولة على كامل الشاشة"
                aria-label="عرض المناولة على كامل الشاشة"
                aria-pressed="false"
              >
                <ExpandIcon />
                <span>عرض كامل</span>
              </button>
            )}
          </div>
          <h2 className="be-title">{title}</h2>
          <p className="be-lead">{lead}</p>
        </header>

        <div className="be-game">
          <div className="be-mission">
            <div>
              <strong>المهمة: وزّع الكتب بالتساوي على الرفوف</strong>
              <div style={{ color: "#64748B", fontSize: 12, marginTop: 2 }}>
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
            <button className="be-btn secondary" type="button" onClick={testOther}>
              🔄 جرّب {capacity === 28 ? 26 : 28}
            </button>
            <button className="be-btn secondary" type="button" onClick={reset}>
              ↺ ابدأ من جديد
            </button>
          </div>

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

          <div className="be-scene">
            <div className="be-scene__sky">
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
              <div className="be-floor be-floor--empty" role="status">
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

  // Without the Fullscreen API the overlay must escape any transformed or
  // clipped ancestor of the lesson page: render it at the end of <body>.
  return fallback && typeof document !== "undefined" ? createPortal(view, document.body) : view;
}
