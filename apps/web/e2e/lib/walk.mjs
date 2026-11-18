// What the game-world walks SHARE (owed by the project since 2026-11-17; the older walks keep their own copies).
// A walk: `const w = createWalk('name')` → w.student(...) gives a page signed in with a mocked API, w.shot(page, name, opts)
// checks the screen THEN takes the screenshot, w.expect / w.check assert, w.finish() prints the count and closes.
//
//   E2E_SIZE=WxH (default 1366x768)   E2E_TOUCH=1 (a phone: touch, coarse pointer — with 800x370, held sideways)
//   E2E_BASE (default http://localhost:5173)   argv[2] = the directory of the screenshots
//
// The checks run at EVERY screenshot (each prints `ok` or `FAIL`; a FAIL does not stop the walk, it marks it failed):
//   noScroll    nothing of the game can scroll, no fitted box cuts its content, no panel leaves the screen, the page itself
//               is not taller or wider than the window (a box that marks itself `data-di-fit-scroll` — a phone held
//               sideways, GAME_WORLD.md « On a phone » rule 3 — or `data-di-slides` may slide inside itself);
//   cut         no text of the game is cut by the edge of the window (except inside a box that slides on a phone);
//   rawLatex    no `$` and no backslash command readable on screen outside a drawn formula (`.katex`);
//   formulas    every drawn formula reads left to right (KaTeX's atoms in order) and keeps ONE line;
//   fontFloor   no visible text under 12 px (computed size × every CSS zoom above it): on a phone, and at every size for a
//               walk created with `fontFloor: true` (the knowledge map's labels, scaled to its panel, stay exempt);
//   wayOut      a way out (the selectors given) is on screen and nothing covers it; `sound: true` asks the sound button too;
//   foreign     no word of ANOTHER lesson (`FOREIGN`), no « نقطة التعلّم », money only in « دج ».
//
// createWalk(name, { foreign, foreignNumbers, fontFloor }) — per walk: more words and numbers of other lessons than the
// pilot's (a later lesson adds the lessons before it), and `fontFloor: true` to apply the 12 px floor at EVERY size (or a number: from that width only). The kit holds 12 px at every size since 2026-11-18 (GAME_WORLD.md « 12 px floor »).
import { chromium } from 'playwright';
import { GL_ARGS } from './gpu.mjs';
import { mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';

export const BASE = process.env.E2E_BASE || 'http://localhost:5173';
export const SIZE = (process.env.E2E_SIZE || '1366x768').split('x').map(Number);
export const TOUCH = process.env.E2E_TOUCH === '1';
/** A phone held sideways: touch, and at most 500 px high (engine/phoneScreen.js › SHORT_SCREEN). */
export const PHONE = TOUCH && SIZE[1] <= 500;
export const SIZE_NAME = `${SIZE[0]}x${SIZE[1]}${TOUCH ? '-touch' : ''}`;
export const lessonUrl = (unit, id) => `${BASE}/courses/moyen/4am/${unit}/${id}`;

/**
 * Words that belong to the PILOT lesson `qasim-adad-tabii` (its rules, its real-world worlds, its levels): none may be read
 * inside another lesson (GAME_WORLD.md § 2ter-0 rule 2). Its store's numbers (756, 32 / 36, 1850) are checked by number on the
 * screens that show no generated number (`numbers` option of `shot`).
 */
export const FOREIGN = [
  'القاسم بالباقي',
  'القاسم بالجداء',
  'أربع جمل، معنى واحد',
  'تعاونية الواحة',
  'قعدة الأصدقاء',
  'ورشة التبليط',
  'سباق: مضاعف ويقبل القسمة',
  'سباق: الجمل الأربع وفخاخها',
  'سباق: أعداد عنيدة',
  'الطلبيّة العنيدة',
  'مخزن الجسر الأعظم',
];
export const FOREIGN_NUMBERS = [756, 1850];
/**
 * What belongs to LESSON 2 `qawasim-adad-tabii` (its story, its key names, its store): read in a later lesson, it is a
 * screen of the wrong lesson. Its numbers: the stone's 252, the store's 96 books, 1400 and 11200 دج.
 */
export const QAWASIM_WORDS = ['جزر الأزواج', 'جزيرة الأزواج', 'جداء عاملين', 'القاسم: جداء بعدد طبيعي', 'أين نتوقّف', 'قواعد قابلية القسمة'];
export const QAWASIM_NUMBERS = [252, 96, 1400, 11200];

const LAUNCH = GL_ARGS; // the GPU when the machine has one, software otherwise (lib/gpu.mjs)

export function createWalk(name, { foreign = [], foreignNumbers = [], fontFloor = false } = {}) {
  const out = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : `${tmpdir()}/${name}`;
  mkdirSync(out, { recursive: true });
  const t0 = Date.now();
  let oks = 0;
  const fails = [];
  const errors = [];
  let n = 0;
  let browser = null;
  const shrunk = new Map();

  /** A HARD expectation: the walk cannot go on without it. */
  const expect = (cond, msg) => {
    if (!cond) {
      console.log('FAIL', msg);
      fails.push(msg);
      process.exitCode = 1;
      throw new Error(msg);
    }
    oks += 1;
    console.log('ok  ', msg);
  };
  /** A SOFT check: printed `FAIL` and counted, but the walk goes on to see the next screens. */
  const check = (cond, msg) => {
    if (!cond) {
      console.log('FAIL', msg);
      fails.push(msg);
      process.exitCode = 1;
      return false;
    }
    oks += 1;
    console.log('ok  ', msg);
    return true;
  };

  async function launch() {
    browser = await chromium.launch({ args: LAUNCH });
    return browser;
  }

  /**
   * A student session on a lesson page. `seed` = localStorage entries (already prefixed) written before the app starts;
   * every `/api/` call is answered by a mock (`auth/me` → the student) and RECORDED in `window.__api`; the bodies posted to
   * `/game-evidence` are kept in `window.__posts`. « عُدّة الانطلاق » of `lessonId` is seeded as played.
   */
  async function student({ uid, lessonId, url, seed = {} }) {
    if (!browser) await launch();
    const ctx = await browser.newContext({
      viewport: { width: SIZE[0], height: SIZE[1] },
      deviceScaleFactor: 1,
      ...(TOUCH ? { hasTouch: true, isMobile: true } : {}),
    });
    await ctx.addInitScript(
      ([id, lesson, entries]) => {
        window.__paperFast = true; // the paper gate's few seconds of « pick up your pen » are skipped by the walk
        window.__forgeFast = true;
        try {
          localStorage.setItem('token', 'qa-fake-token');
          const k = `u_${id}_smarter_launch_kit`;
          if (!localStorage.getItem(k)) localStorage.setItem(k, JSON.stringify({ lessons: { [lesson]: { tries: 1 } } }));
          for (const [key, v] of Object.entries(entries)) if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(v));
        } catch {
          /* noop */
        }
        const user = { id, name: 'تلميذ', firstName: 'ياسين', lastName: 'بلقاسم', role: 'student', roles: ['student'], email: 'eleve@example.test', email_verified_at: '2026-09-01T00:00:00Z', emailVerified: true, nameComplete: true, level: '4am', grade: '4am' };
        const real = window.fetch.bind(window);
        window.fetch = async (input, init) => {
          const url = typeof input === 'string' ? input : input.url;
          if (url.includes('/api/')) {
            const method = (init?.method || (typeof input === 'string' ? 'GET' : input.method) || 'GET').toUpperCase();
            let body = null;
            try {
              body = init?.body ? JSON.parse(init.body) : null;
            } catch {
              body = init?.body ?? null;
            }
            (window.__api ??= []).push({ method, url, body });
            if (url.includes('/game-evidence')) (window.__posts ??= []).push({ url, body });
            const res = url.includes('/auth/me') ? { success: true, user } : { success: true, data: [] };
            return new Response(JSON.stringify(res), { status: 200, headers: { 'Content-Type': 'application/json' } });
          }
          return real(input, init);
        };
      },
      [uid, lessonId, seed],
    );
    const page = await ctx.newPage();
    page.on('pageerror', (e) => {
      errors.push(e.message);
      console.log('pageerror', e.message);
    });
    page.on('console', (m) => {
      if (m.type() === 'error' && !/favicon|fonts|ERR_|Failed to load resource/.test(m.text())) console.log('console.error', m.text().slice(0, 300));
    });
    await page.goto(url, { waitUntil: 'networkidle' });
    return { page, ctx };
  }

  /** Fast-forwards the world by `sec` seconds of GAME time (the same dev hook the pilot's walks use: time, never an answer). */
  const ff = (page, sec) =>
    page.evaluate(async (s) => {
      const g = window.__world;
      for (let t = 0; t < s; t += 0.04) {
        g.step(0.04);
        await null;
        await null;
      }
    }, sec);

  // ───────────────────────────── the checks of every screen ─────────────────────────────
  async function noScroll(page) {
    const measure = () =>
      page.evaluate(() => {
        const bad = [];
        const small = [];
        const name = (el) => `${el.tagName.toLowerCase()}.${String(el.className?.baseVal ?? el.className).split(' ').slice(0, 2).join('.')}`;
        for (const el of document.querySelectorAll('.di-root *')) {
          const cs = getComputedStyle(el);
          if (/(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 2 && !el.closest('[data-di-fit-scroll]')) bad.push(`scrolls: ${name(el)}`);
          if (/(auto|scroll)/.test(cs.overflowX) && el.scrollWidth > el.clientWidth + 2 && !el.closest('[data-di-slides]')) bad.push(`scrolls sideways: ${name(el)}`);
        }
        for (const box of document.querySelectorAll('[data-di-fitbox]')) {
          const o = box.getBoundingClientRect();
          const i = box.firstElementChild.getBoundingClientRect();
          if (o.height > 0 && i.height > o.height + 3 && !box.hasAttribute('data-di-fit-scroll')) bad.push(`cut: ${name(box.parentElement)} (${Math.round(i.height)} in ${Math.round(o.height)}, scale ${box.dataset.diFitz})`);
          if (Number(box.dataset.diFitz) < 0.8 && o.height > 0) small.push(`${name(box.parentElement)} ×${box.dataset.diFitz}`);
        }
        for (const sel of ['.di-card', '.di-step', '.di-page__fit', '.di-jcard', '.di-kpanel', '.xs-head', '.xs-paper', '.xs-sheet', '.xs-foot', '.di-trainer']) {
          for (const el of document.querySelectorAll(sel)) {
            const r = el.getBoundingClientRect();
            if (r.height > 0 && (r.top < -2 || r.bottom > window.innerHeight + 2 || r.left < -2 || r.right > window.innerWidth + 2)) bad.push(`leaves the screen: ${sel} (${Math.round(r.left)},${Math.round(r.top)} → ${Math.round(r.right)},${Math.round(r.bottom)} of ${window.innerWidth}×${window.innerHeight})`);
          }
        }
        if (document.documentElement.scrollHeight > window.innerHeight + 1 || document.documentElement.scrollWidth > window.innerWidth + 1) bad.push(`the page itself scrolls (${document.documentElement.scrollWidth}×${document.documentElement.scrollHeight})`);
        return { bad: [...new Set(bad)], small };
      });
    let res = await measure();
    // a Fit box settles in a few frames (the world behind it is drawn by a software renderer): a cut that is only a fit in
    // progress gets a moment — a real cut stays
    for (let i = 0; i < 5 && res.bad.length && res.bad.every((b) => b.startsWith('cut:')); i += 1) {
      await page.waitForTimeout(300);
      res = await measure();
    }
    return res;
  }

  /** Visible text: no `$`, no `\command` outside a drawn formula; and every word of another lesson. */
  const readScreen = (page, numbers) =>
    page.evaluate(
      ([foreign, foreignNumbers, checkNumbers]) => {
        const raw = [];
        const tiny = [];
        const words = [];
        const cut = [];
        let text = '';
        const zoomOf = (el) => {
          let z = 1;
          for (let x = el; x && x.nodeType === 1; x = x.parentElement) z *= parseFloat(getComputedStyle(x).zoom) || 1;
          return z;
        };
        const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        for (let t = w.nextNode(); t; t = w.nextNode()) {
          const p = t.parentElement;
          const v = t.nodeValue;
          if (!p || !v.trim() || p.closest('script, style, noscript, .katex-mathml, title')) continue;
          const rects = p.getClientRects();
          if (!rects.length) continue;
          const cs = getComputedStyle(p);
          if (cs.visibility === 'hidden' || Number(cs.opacity) === 0) continue;
          const r = p.getBoundingClientRect();
          if (r.width <= 1 || r.height <= 1) continue;
          // a text the window cuts (a page taller than the screen whose overflow is hidden: nothing scrolls, the end is lost)
          {
            // the glyphs themselves (a Range), not the box around them: a link's padding may pass the edge, its words may not
            const range = document.createRange();
            range.selectNodeContents(t);
            const g = range.getBoundingClientRect();
            if (g.width > 0 && (g.bottom > window.innerHeight + 2 || g.top < -2 || g.right > window.innerWidth + 2 || g.left < -2) && p.closest('.di-root') && !p.closest('[data-di-fit-scroll], [data-di-slides], canvas')) cut.push(`« ${v.trim().slice(0, 28)} » (${Math.round(g.left)},${Math.round(g.top)} → ${Math.round(g.right)},${Math.round(g.bottom)})`);
          }
          if (r.bottom < 0 || r.top > window.innerHeight || r.right < 0 || r.left > window.innerWidth) continue;
          text += ` ${v}`;
          if (!p.closest('.katex') && /\$|\\[a-zA-Z]{2,}/.test(v)) raw.push(v.trim().slice(0, 70));
          if (!p.closest('.katex') && !p.closest('.di-kmap')) {
            const px = parseFloat(cs.fontSize) * zoomOf(p);
            if (px < 11.5) tiny.push(`${p.tagName.toLowerCase()}.${String(p.className?.baseVal ?? p.className).split(' ')[0]} ${px.toFixed(1)}px « ${v.trim().slice(0, 24)} »`);
          }
        }
        // a formula reads left to right: the atoms KaTeX writes in order must stand left to right on screen (a formula laid
        // into a right-to-left line without isolation shows « 72 = 8 × 9 » for « 9 × 8 = 72 »)
        const mirrored = [];
        for (const k of document.querySelectorAll('.katex-html')) {
          const r0 = k.getBoundingClientRect();
          if (r0.width < 2 || r0.bottom < 0 || r0.top > window.innerHeight) continue;
          const atoms = [...k.querySelectorAll('.mord, .mrel, .mbin, .mpunct')].filter((a) => !a.querySelector('.mord, .mrel, .mbin, .mpunct')).map((a) => a.getBoundingClientRect()).filter((r) => r.width > 0);
          if (atoms.length < 3) continue;
          // the atoms of one line (a wrapped formula is a different defect)
          const line = atoms.filter((r) => Math.abs(r.top - atoms[0].top) < r.height);
          let back = 0;
          for (let i = 1; i < line.length; i += 1) if (line[i].left < line[i - 1].left - 1) back += 1;
          if (back > line.length / 2) mirrored.push((k.parentElement.querySelector('annotation')?.textContent ?? k.textContent).slice(0, 40));
          // a formula never breaks across two lines: no atom starts below the bottom of the one before it
          if (atoms.some((r, i) => i > 0 && r.top >= atoms[i - 1].bottom - 1)) mirrored.push(`broken across two lines: ${(k.parentElement.querySelector('annotation')?.textContent ?? k.textContent).slice(0, 40)}`);
        }
        for (const f of foreign) if (text.includes(f)) words.push(f);
        if (checkNumbers) for (const k of foreignNumbers) if (new RegExp(`(^|[^0-9])${k}([^0-9]|$)`).test(text)) words.push(String(k));
        const learningPoint = text.includes('نقطة التعلّم') || text.includes('نقطة التعلم');
        const money = /\bDA\b|€|\bUSD\b|د\.ج/.test(text);
        return { raw: [...new Set(raw)], tiny: [...new Set(tiny)], words, learningPoint, money, mirrored: [...new Set(mirrored)], cut: [...new Set(cut)] };
      },
      [[...FOREIGN, ...foreign], [...FOREIGN_NUMBERS, ...foreignNumbers], numbers],
    );

  /** Is one of these selectors on screen, inside the window, and the element a tap at its centre reaches? */
  const reachable = (page, selectors) =>
    page.evaluate((sels) => {
      for (const sel of sels) {
        for (const el of document.querySelectorAll(sel)) {
          const r = el.getBoundingClientRect();
          if (r.width < 2 || r.height < 2 || r.left < -1 || r.top < -1 || r.right > window.innerWidth + 1 || r.bottom > window.innerHeight + 1) continue;
          const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
          if (top && (el === top || el.contains(top))) return sel;
        }
      }
      return null;
    }, selectors);

  /**
   * Checks the screen, then takes its screenshot (the visible screen only: a full-page capture switches the phone rules off).
   * opts: exit — selectors of the way out (one must be reachable); sound — the sound button must be reachable too (true: the
   *       world's `[data-di-sound]`; or the selectors of a screen's own button);
   *       numbers — the pilot's store numbers may not be read (screens with no generated number).
   */
  async function shot(page, label, { exit = null, sound = false, numbers = false } = {}) {
    await page.waitForTimeout(300);
    const where = `${label} @ ${SIZE_NAME}`;
    const s = await noScroll(page);
    for (const x of s.small) shrunk.set(x, label);
    check(s.bad.length === 0, `${where}: nothing scrolls, nothing is cut, nothing leaves the screen${s.bad.length ? ' — ' + s.bad.join(' | ') : ''}`);
    const t = await readScreen(page, numbers);
    check(t.cut.length === 0, `${where}: no text is cut by the edge of the window${t.cut.length ? ' — ' + t.cut.slice(0, 5).join(' | ') + (t.cut.length > 5 ? ` (+${t.cut.length - 5})` : '') : ''}`);
    check(t.raw.length === 0, `${where}: no raw formula on screen${t.raw.length ? ' — ' + t.raw.map((x) => `« ${x} »`).join(' | ') : ''}`);
    check(t.mirrored.length === 0, `${where}: every formula reads left to right, on one line${t.mirrored.length ? ' — ' + t.mirrored.map((x) => `« ${x} »`).join(' | ') : ''}`);
    check(t.words.length === 0, `${where}: nothing of another lesson on screen${t.words.length ? ' — ' + t.words.join(', ') : ''}`);
    check(!t.learningPoint && !t.money, `${where}: « الكفاءة », never « نقطة التعلّم »; money in « دج » only`);
    // the knowledge map is scaled to fit its panel by the kit: its edge labels are exempt from the laptop floor (phones are paused)
    const tiny = t.tiny.filter((x) => PHONE || !/di-kmap__edge/.test(x));
    if (PHONE || (fontFloor && SIZE[0] >= (fontFloor === true ? 0 : fontFloor))) check(tiny.length === 0, `${where}: ${PHONE ? 'on the phone ' : ''}no visible text under 12 px${tiny.length ? ' — ' + tiny.slice(0, 8).join(' | ') + (tiny.length > 8 ? ` (+${tiny.length - 8})` : '') : ''}`);
    if (exit) {
      const hit = await reachable(page, exit);
      check(Boolean(hit), `${where}: a way out is on screen and reachable (${hit ?? exit.join(' / ')})`);
    }
    if (sound) {
      const hit = await reachable(page, Array.isArray(sound) ? sound : ['[data-di-sound]']);
      check(Boolean(hit), `${where}: the sound button is on screen and reachable`);
    }
    n += 1;
    const file = `${out}/${String(n).padStart(2, '0')}-${label}.png`;
    await page.screenshot({ path: file });
    console.log('shot', file);
    return file;
  }

  async function finish() {
    check(errors.length === 0, `no page error${errors.length ? ' — ' + errors.slice(0, 3).join(' | ') : ''}`);
    if (shrunk.size) console.log('note: content scaled below ×0.8 to fit at:', [...shrunk].map(([k, v]) => `${k} @ ${v}`).join('; '));
    console.log(`walk ${name} @ ${SIZE_NAME}: ${oks} ok, ${fails.length} FAIL, ${Math.round((Date.now() - t0) / 1000)} s`);
    if (fails.length) console.log('failed:\n  - ' + fails.join('\n  - '));
    if (browser) await browser.close();
  }

  /** Runs the body; an exception (a hard expectation, a timeout) is printed and the walk still finishes. */
  async function run(body) {
    try {
      await body();
    } catch (e) {
      if (!fails.length || !String(e.message).startsWith(fails.at(-1))) {
        console.log('FAIL', `the walk stopped: ${String(e.message).split('\n')[0]}`);
        fails.push(`stopped: ${String(e.message).split('\n')[0]}`);
      }
      process.exitCode = 1;
    }
    await finish();
  }

  return { out, expect, check, student, shot, ff, reachable, run, errors };
}

// ───────────────────────────── arithmetic the walks compute THEMSELVES (never the lesson's own answers) ─────────────────────────────
export const divisorsOf = (a) => {
  const out = [];
  for (let d = 1; d <= a; d += 1) if (a % d === 0) out.push(d);
  return out;
};
export const isqrt = (a) => {
  let d = 0;
  while ((d + 1) * (d + 1) <= a) d += 1;
  return d;
};
export const digitSum = (a) => String(a).split('').reduce((s, x) => s + Number(x), 0);
/** What a divisibility rule reads in the number: the units for 2 and 5, the sum of the digits for 3 and 9, the last two digits for 4. */
export const readingOf = (a, b) => (b === 2 || b === 5 ? a % 10 : b === 3 || b === 9 ? digitSum(a) : a % 100);
