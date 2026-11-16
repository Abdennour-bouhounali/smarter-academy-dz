/**
 * NO SCROLLING ANYWHERE (owner rule; again on 2026-11-15: « the student must never scroll »).
 * `Fit` is the box every panel of the game world puts its content in: it never scrolls and never cuts — when the content is
 * taller than the room it has, the content is scaled down just enough to fit (and grows back when there is room again).
 * It is the last resort: a panel first shows less (compact head, one step at a time); Fit guarantees the rest.
 * ONE EXCEPTION — a phone held sideways (engine/phoneScreen.js › SHORT_SCREEN): shrinking a page made for 720 px into
 * 390 px gives text nobody can read, so there the content is never scaled below PHONE_FLOOR and the box scrolls instead
 * (`data-di-fit-scroll`). Readable beats unscrolled on a phone; nothing changes on a tablet or a laptop.
 *   room: by default the height of the box itself (a flex child with a fixed share); `avail(box)` gives it otherwise
 *         (`cardRoom` for a pop-up card whose height follows its content).
 */
import React, { useLayoutEffect, useRef, useState } from 'react';
import { SHORT_SCREEN } from '../engine/phoneScreen';

const PHONE_FLOOR = 0.9;

export default function Fit({ className = '', innerClass = '', avail = null, min = 0.5, children, ...rest }) {
  const outer = useRef(null);
  const inner = useRef(null);
  const zr = useRef(1);
  const [z, setZ] = useState(1);
  const [scrolls, setScrolls] = useState(false);
  const room = useRef(avail);
  room.current = avail;
  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i || typeof ResizeObserver === 'undefined') return undefined;
    let raf = 0;
    // The scale that last overflowed, for the content it overflowed with: growing back never reaches it again. Without this a
    // text in columns loops for ever (a smaller scale re-wraps the lines, the box looks roomy, it grows, it overflows…).
    let cap = { z: 1.001, sig: '' };
    const fit = () => {
      const have = room.current ? room.current(o) : o.getBoundingClientRect().height;
      const need = i.getBoundingClientRect().height;
      if (!(have > 0) || !(need > 0)) return;
      const sig = `${Math.round(have / 8)}|${i.textContent.length}|${i.querySelectorAll('*').length}`;
      if (sig !== cap.sig) cap = { z: 1.001, sig };
      const cur = zr.current;
      const ratio = have / need;
      let next = cur;
      const floor = window.matchMedia?.(SHORT_SCREEN).matches ? PHONE_FLOOR : min;
      setScrolls(floor === PHONE_FLOOR && cur * ratio * 0.985 < floor);
      if (ratio < 0.995) {
        cap = { z: cur, sig };
        next = Math.max(floor, cur * ratio * 0.985);
      } // too tall: shrink just enough
      else if (cur < 1 && ratio > 1.08) next = Math.min(1, cap.z - 0.03, cur * ratio * 0.97); // room again: grow back, below what overflowed
      if (next > cur + 0.004 || next < cur - 0.004) {
        zr.current = next;
        setZ(next);
      }
    };
    const later = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(fit);
    };
    const ro = new ResizeObserver(later);
    ro.observe(o);
    ro.observe(i);
    window.addEventListener('resize', later);
    fit();
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', later);
    };
  }, [min]);
  return (
    <div
      ref={outer}
      className={`di-fitbox ${className}`}
      data-di-fitbox
      data-di-fitz={z.toFixed(2)}
      data-di-fit-scroll={scrolls ? '' : undefined}
      {...rest}
    >
      <div ref={inner} className={`di-fitbox__in ${innerClass}`} style={z < 1 ? { zoom: z } : undefined}>
        {children}
      </div>
    </div>
  );
}

const px = (el, prop) => parseFloat(getComputedStyle(el)[prop]) || 0;
/** The room of a pop-up card: the height of its veil, less the paddings of the veil and of the card. */
export function cardRoom(box) {
  const card = box.parentElement;
  const veil = card.parentElement;
  return (
    veil.clientHeight -
    px(veil, 'paddingTop') -
    px(veil, 'paddingBottom') -
    px(card, 'paddingTop') -
    px(card, 'paddingBottom') -
    6
  );
}
/** The room of the bottom panel of a case: the screen, less the order card above it. */
export function stepRoom(box) {
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const panel = box.parentElement;
  return window.innerHeight - 20 * rem - px(panel, 'paddingTop') - px(panel, 'paddingBottom');
}
