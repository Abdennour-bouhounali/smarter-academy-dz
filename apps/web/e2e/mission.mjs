/**
 * The walk of an integration mission (dev server on :5173): `node e2e/mission.mjs <1|2> <out dir>`.
 * Plays the mission END TO END THROUGH ITS UI at 1366×768, with a wrong answer on the way (its guidance must show and
 * no success with it), and checks on every screen it photographs: no text of the mission under 18 px, nothing of the
 * mission beyond the screen, no page error; then the big success at the end.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { GL_ARGS } from './lib/gpu.mjs';

const which = process.argv[2] ?? '1';
const out = process.argv[3] ?? `/tmp/mission-${which}`;
mkdirSync(out, { recursive: true });
const b = await chromium.launch({ args: GL_ARGS });
const p = await b.newPage({ viewport: { width: 1366, height: 768 } });
const errors = [];
const bad = [];
p.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
let n = 0;
const shot = async (name) => {
  n += 1;
  await p.screenshot({ path: `${out}/${String(n).padStart(2, '0')}-${name}.png` });
  const r = await p.evaluate(() => {
    let min = 99;
    let low = 0;
    document.querySelectorAll('.ms-root *').forEach((e) => {
      if (![...e.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim())) return;
      if (e.closest('.katex')) return;
      const box = e.getBoundingClientRect();
      if (!box.width) return;
      min = Math.min(min, parseFloat(getComputedStyle(e).fontSize));
      low = Math.max(low, box.bottom);
    });
    const wide = [...document.querySelectorAll('.ms-paper,.ms-book,.ms-stage > *')].filter(
      (e) => e.scrollWidth > e.clientWidth + 2,
    ).length;
    return { min, low: Math.round(low), wide };
  });
  const flag = r.min < 18 || r.low > 768 || r.wide ? ' <<< DEFECT' : '';
  if (flag) bad.push(name);
  console.log(`${String(n).padStart(2, '0')} ${name} | min ${r.min}px | lowest text ${r.low} | wide ${r.wide}${flag}`);
};
const idle = async () => {
  await p.waitForTimeout(400);
  await p.waitForSelector('[data-ms-busy="false"]', { timeout: 120000 });
  await p.waitForTimeout(300);
};
const written = async () => {
  try {
    await p.waitForSelector('[data-ms-written]:not([disabled])', { timeout: 6000 });
    await p.click('[data-ms-written]');
    await p.waitForTimeout(200);
  } catch {
    /* no gate on this screen */
  }
};
const type = (k, v) => p.fill(`[data-ms-in="${k}"]`, String(v));
const wins = [];
const win = async (label, want = 1) => {
  await p.waitForTimeout(250);
  const w = await p.locator('[data-ms-win]').count();
  wins.push(`${label}:${w}`);
  if (w !== want) bad.push(`success ${label}`);
};

await p.goto(`http://localhost:5173/__qa/mission-${which}`);
await p.waitForSelector('[data-ms-start]', { timeout: 60000 });
await shot('card');
await p.click('[data-ms-start]');
await p.waitForSelector('[data-ms-clock-warn]');
if (await p.locator('[data-ms-clock-warn] button').count()) bad.push('the clock warning has a button');
await p.waitForSelector('.is-reading', { timeout: 30000 });
await shot('read');
await p.waitForSelector('[data-ms-read-done]', { timeout: 20000 });
await p.click('[data-ms-read-done]');

if (which === '1') {
  await p.waitForSelector('[data-ms-tap="b"]:not([disabled])', { timeout: 15000 });
  await p.waitForTimeout(2500);
  await shot('data');
  await p.click('[data-ms-tap="b"]');
  await written();
  await win('data');
  await p.waitForSelector('[data-ms-goal="most"]');
  await shot('goals');
  await p.click('[data-ms-goal="most"]');
  await p.click('[data-ms-goal="content"]');
  await written();
  await type('n', 7);
  await p.click('[data-ms-try]');
  await idle();
  await shot('try-7-guidance');
  await win('wrong-try', 0);
  await written();
  await type('n', 12);
  await p.click('[data-ms-try]');
  await idle();
  await written();
  await p.click('[data-ms-more]');
  await written();
  await shot('connect');
  for (const k of ['a', 'b', 'same', 'all']) await p.click(`[data-ms-need="${k}"]`);
  await p.click('[data-ms-tie]');
  await written();
  await type('q', 2);
  await type('r', 132);
  await p.click('[data-ms-pair]');
  await p.waitForSelector('[data-ms-win]', { timeout: 90000 });
  await shot('division-1');
  await idle();
  await written();
  await type('q', 4);
  await type('r', 0);
  await p.click('[data-ms-pair]');
  await idle();
  await written();
  await type('g', 132);
  await p.click('[data-ms-pgcd]');
  await p.waitForTimeout(1600);
  await shot('test');
  await p.click('[data-ms-test="12"]');
  await idle();
  await written();
  await type('n', 264);
  await p.click('[data-ms-attack]');
  await idle();
  await written();
  for (const k of ['a', 'b', 'ans']) await p.click(`[data-ms-need="${k}"]`);
  await p.click('[data-ms-tie]');
  await written();
  await type('pa', 9);
  await type('pb', 4);
  await p.click('[data-ms-fill]');
  await idle();
  await written();
  await type('sn', 132);
  await type('sa', 1188);
  await type('sb', 528);
  await shot('sentence');
  await p.click('[data-ms-name="pgcd"]');
} else {
  // ── a mission played from data (MissionRunner) ──
  await p.waitForTimeout(2600); // the robot underlines the first datum
  await shot('data-robot');
  for (let k = 0; k < 12; k += 1) {
    const next = p.locator('[data-ms-tap].ms-target');
    if (!(await next.count())) break;
    await next.first().click();
    await p.waitForTimeout(120);
  }
  await shot('data-all');
  await written();
  await win('data');
  await p.waitForSelector('[data-ms-goal]');
  await shot('goal');
  await p.click('[data-ms-goal]');
  await written();
  await p.waitForSelector('[data-ms-plan-pick]');
  await shot('plan');
  await p.waitForTimeout(1700); // the success of the question has left
  await p.click('[data-ms-need="count"]'); // too early: its guidance
  await shot('plan-too-early');
  await win('plan-too-early', 0);
  for (const k of ['gap', 'count', 'cost', 'price']) await p.click(`[data-ms-need="${k}"]`);
  await shot('plan-done');
  await written();
  const work = async (id, values, { wrong = false, name = null } = {}) => {
    await p.waitForSelector(`[data-ms-at="${id}"]`, { timeout: 20000 });
    await written();
    for (const [k, v] of Object.entries(values)) await type(k, v);
    await p.click('[data-ms-check]');
    await idle();
    if (name) await shot(name);
    if (wrong) {
      if (!(await p.locator('[data-ms-fact]').count())) bad.push(`no guidance at ${id}`);
      await win(`${id}-wrong`, 0);
    }
  };
  await work('e0', { q: 1, r: 8 }, { wrong: true, name: 'division-wrong' });
  await work('e0', { q: 1, r: 18 });
  await work('e1', { q: 2, r: 6 });
  await work('e2', { q: 3, r: 0 }, { name: 'divisions-done' });
  await work('gap', { d: 5 }, { wrong: true, name: 'gap-5-planted' });
  await work('gap', { d: 3 }, { wrong: true, name: 'gap-3-planted' });
  await work('gap', { d: 6 }, { name: 'gap-6-planted' });
  await work('around', { p: 102 }, { wrong: true });
  await work('around', { p: 204 });
  await work('count', { n: 35 }, { wrong: true, name: 'count-wrong' });
  await work('count', { n: 34 }, { name: 'count-34' });
  await work('left', { m: 30600 });
  await work('each', { c: 900 });
  await work('pct', { k: 125 }, { wrong: true, name: 'percent-wrong' });
  await work('pct', { k: 225 });
  await work('price', { x: 720 }, { wrong: true, name: 'price-wrong' });
  await work('price', { x: 400 }, { name: 'price-400' });
  await p.waitForSelector('[data-ms-at="answer"]');
  await written();
  await type('x', 400);
  await shot('sentence');
  await p.click('[data-ms-check]');
}

await p.waitForSelector('[data-ms-finale]', { timeout: 30000 });
await p.waitForTimeout(1300);
await shot('finale');
console.log(
  'finale:',
  await p.getAttribute('[data-ms-stars]', 'data-ms-stars'),
  'stars |',
  await p.getAttribute('[data-ms-coins]', 'data-ms-coins'),
  'coins',
);
await p.click('[data-ms-finale-next]');
await p.waitForTimeout(500);
await shot('model');
if (which !== '1') {
  await p.click('[data-ms-corrected]');
  await p.waitForSelector('[data-ms-tick="0"]');
  await p.click('[data-ms-tick="0"]');
  await shot('marker');
  for (const id of ['data', 'goal', 'work']) {
    await p.click(`[data-ms-open="${id}"]`);
    await shot(`copy-${id}`);
  }
}
console.log('small successes:', wins.join(' '));
console.log('page errors:', errors.length, errors);
console.log(bad.length ? `DEFECTS: ${bad.join(' | ')}` : 'NO DEFECT');
await b.close();
process.exit(bad.length || errors.length ? 1 : 0);
