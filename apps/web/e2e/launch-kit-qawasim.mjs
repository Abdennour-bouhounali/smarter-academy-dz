// « عُدّة الانطلاق » of lesson « قواسم عدد طبيعي » — walk of its LAUNCH as a STUDENT (simulated session, no API).
// Its one tool is the الكفاءة of the lesson before it (« التعرّف على قاسم », core): an equality to complete, sentences to sort,
// numbers to sort. Three students: one who knows (two answers, take-off), one who slips on the sentences (workshop at level 2),
// one who misses everything (the capsule, then the door opens). Nothing may scroll or leave the screen, at any moment.
// The kit itself (sounds, drag, the toolbox, the return button) is walked on the pilot by launch-kit.mjs.
// Run (dev server up): [E2E_SIZE=1366x768] [E2E_TOUCH=1] node apps/web/e2e/launch-kit-qawasim.mjs [outDir]
import { chromium } from 'playwright';
import { GL_ARGS } from './lib/gpu.mjs';
import { mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';

const ID = 'qawasim-adad-tabii';
const LESSON = `${process.env.E2E_BASE || 'http://localhost:5173'}/courses/moyen/4am/ansab_al_aadad_wal_hisab/${ID}`;
const OUT = process.argv[2] || `${tmpdir()}/launch-kit-qawasim`;
const SIZE = (process.env.E2E_SIZE || '1366x768').split('x').map(Number);
const PHONE = process.env.E2E_TOUCH === '1' && SIZE[1] <= 500;
const TOOL = '4am.m1.r01';
mkdirSync(OUT, { recursive: true });
const expect = (cond, msg) => { if (!cond) { console.log('FAIL', msg); process.exitCode = 1; if (process.env.E2E_SOFT !== '1') throw new Error(msg); return; } console.log('ok  ', msg); };
const browser = await chromium.launch({ args: GL_ARGS });
const errors = []; let n = 0; let page;

async function student(id) {
  const ctx = await browser.newContext({ viewport: { width: SIZE[0], height: SIZE[1] }, ...(process.env.E2E_TOUCH === '1' ? { hasTouch: true, isMobile: true } : {}) });
  await ctx.addInitScript((uid) => {
    window.__paperFast = true; window.__launchFast = true;
    localStorage.setItem('token', 'qa-fake-token');
    const real = window.fetch.bind(window);
    window.fetch = async (input, init) => {
      const url = typeof input === 'string' ? input : input.url;
      if (url.includes('/api/')) return new Response(JSON.stringify(url.includes('/auth/me') ? { success: true, user: { id: uid, name: 'تلميذ', role: 'student', roles: ['student'], email_verified_at: '2026-09-01T00:00:00Z', emailVerified: true, nameComplete: true, level: '4am', grade: '4am' } } : { success: true, data: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      return real(input, init);
    };
  }, id);
  const p = await ctx.newPage(); p.on('pageerror', (e) => { errors.push(e.message); console.log('pageerror', e.message); });
  return p;
}

/** Nothing scrolls, nothing leaves the screen or its panel — checked at every screenshot (the rules of launch-kit.mjs). */
const shot = async (name) => {
  await page.waitForTimeout(350);
  const bad = await page.evaluate((phone) => {
    const out = []; const root = document.querySelector('.lk-root'); if (!root) return ['no launch on screen'];
    for (const el of root.querySelectorAll('*')) { const cs = getComputedStyle(el); if (/(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 2 && !(phone && (el.classList.contains('lk-stage') || el.classList.contains('lk-capbody')))) out.push(`scrolls: ${el.className}`); }
    const stage = root.querySelector('.lk-stage').getBoundingClientRect(); const bag = root.querySelector('.lk-bag').getBoundingClientRect();
    for (const el of root.querySelectorAll('.lk-head, .lk-bag, .lk-stage, .lk-memo')) { const r = el.getBoundingClientRect(); if (r.top < -1 || r.bottom > window.innerHeight + 1 || r.left < -1 || r.right > window.innerWidth + 1) out.push(`leaves the screen: ${el.className}`); }
    if (!phone)
      for (const el of root.querySelectorAll('.lk-stage button, .lk-prompt, .lk-equation, .lk-card, .lk-box, .lk-example li, .lk-kcard, .lk-revise, .lk-score, .lk-result h3, .lk-intro > *')) { const r = el.getBoundingClientRect(); if (r.height > 0 && (r.top < stage.top - 1 || r.bottom > stage.bottom + 1 || r.left < stage.left - 1 || r.right > stage.right + 1)) out.push(`out of the stage: ${el.className} « ${el.textContent.slice(0, 24)} »`); }
    for (const el of root.querySelectorAll('.lk-tool, .lk-robot')) { const r = el.getBoundingClientRect(); if (r.top < bag.top - 1 || r.bottom > bag.bottom + 1) out.push(`out of the bag: ${el.className?.baseVal ?? el.className}`); }
    for (const el of root.querySelectorAll('.lk-prompt, .lk-example ol, .lk-revise > div, .lk-kit')) if (el.scrollWidth > el.clientWidth + 3 || (!phone && el.scrollHeight > el.clientHeight + 3)) out.push(`overflows: ${el.className}`);
    // a sentence card: inside its card, on two lines at most
    for (const el of root.querySelectorAll('.lk-card .lk-say')) { const r = el.getBoundingClientRect(); const c = el.closest('.lk-card').getBoundingClientRect(); const lines = Math.round(r.height / (parseFloat(getComputedStyle(el).lineHeight) * Number(root.querySelector('.lk-fit').style.zoom || 1))); if (r.left < c.left - 1 || r.right > c.right + 1 || r.top < c.top - 1 || r.bottom > c.bottom + 1) out.push('a sentence leaves its card'); if (lines > 2) out.push(`a sentence takes ${lines} lines`); }
    { const foot = root.querySelector('.lk-question .lk-qfoot')?.getBoundingClientRect(); const sort = root.querySelector('.lk-sort')?.getBoundingClientRect(); if (foot && sort && sort.bottom > foot.top + 1) out.push('the boxes lie under the buttons of the question'); }
    for (const el of root.querySelectorAll('.lk-chip')) { const r = el.getBoundingClientRect(); const b = el.closest('.lk-box').getBoundingClientRect(); if (r.left < b.left - 1 || r.right > b.right + 1 || r.bottom > b.bottom + 1) out.push('a placed card leaves its box'); }
    return out;
  }, PHONE);
  if (bad.length) { console.log('FAIL at «', name, '»:', [...new Set(bad)].join(' | ')); process.exitCode = 1; if (process.env.E2E_SOFT !== '1') throw new Error(`layout at ${name}`); }
  n += 1; await page.screenshot({ path: `${OUT}/${String(n).padStart(2, '0')}-${name}.png` });
};
const px = (sel) => page.evaluate((s) => { const el = document.querySelector(s); const z = Number(document.querySelector('.lk-fit').style.zoom || 1); return el ? Math.round(parseFloat(getComputedStyle(el).fontSize) * z) : 0; }, sel);
const cur = () => page.evaluate(() => window.__launch.cur);
const tool = async () => ({ band: await page.getAttribute(`[data-lk-tool="${TOOL}"]`, 'data-lk-band'), seg: await page.getAttribute(`[data-lk-tool="${TOOL}"]`, 'data-lk-segments') });
const kit = (id) => page.evaluate((uid) => JSON.parse(localStorage.getItem(`u_${uid}_smarter_launch_kit`) ?? 'null'), id);

/** Fills the answer of the question on screen — right or wrong — with real taps, WITHOUT handing it in. Returns the question. */
async function fill(right) {
  const { q } = await cur();
  if (q.gesture === 'write') for (const d of String(q.a / q.b + (right ? 0 : 1))) await page.click(`[data-lk-key="${d}"]`);
  else for (const c of q.cards) await page.click(`[data-lk-send="${right ? c.bin : c.bin === 'yes' ? 'no' : 'yes'}"]`);
  return q;
}
const hand = async () => { await page.click('[data-lk-done]'); };
const settle = async () => { await page.waitForFunction(() => !document.querySelector('[data-lk-signal]'), null, { timeout: 5000 }); await page.waitForTimeout(150); };
const open = async (id) => {
  page = await student(id);
  await page.goto(LESSON, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-di-start]'); await page.click('[data-di-start]'); await page.waitForSelector(`[data-launch-kit="${ID}"]`);
};

// ══ 1. a student who knows: the bag holds ONE tool, two answers light it, take-off ══
await open(9601);
expect(await page.evaluate(() => window.__world.getState().phase) === 'title', 'the first « ابدأ » opens the launch: the world has not started');
expect((await page.locator('[data-lk-tool]').evaluateAll((els) => els.map((e) => `${e.dataset.lkTool}:${e.dataset.lkBand}:${e.dataset.lkSegments}`))).join() === `${TOOL}:waiting:0`, 'the bag is NOT empty: it holds the الكفاءة of the lesson before, waiting');
expect((await page.textContent('[data-lk-bag]')).includes('قاسم عدد طبيعي'), 'the tool is named in the student’s words');
await shot('bag');
await page.click('[data-lk-start]'); await page.waitForSelector('[data-lk-question]');
let q = (await cur()).q;
expect(q.item === TOOL && q.level === 1 && q.gesture === 'write' && q.a <= 25 && q.a % q.b === 0, `the first question is a very easy one: the equality that shows a divisor (${q.a} = ${q.b} × ▢)`);
expect(await page.locator('[data-lk-slot]').count() === 1 && await page.locator('[data-lk-done]').isDisabled(), 'ONE box to write — no box for a remainder; « تمّ » waits for it');
console.log('    text on screen (px): prompt', await px('.lk-prompt'), '· equation', await px('.lk-equation'));
expect(await px('.lk-prompt') >= (PHONE ? 15 : 19), 'the question is comfortable to read');
await fill(true); await shot('write');
await hand(); await page.waitForSelector('[data-lk-signal="good"]');
expect((await tool()).seg === '1', 'a right answer lights one segment of the tool at once');
await settle();
q = (await cur()).q;
expect(q.item === TOOL && q.level === 2 && q.form === 'sentences' && q.cards.every((c) => c.say), 'then a harder one, by another gesture: three SENTENCES to sort into « صحيحة » / « خاطئة »');
expect((await page.textContent('[data-lk-card]')).trim() === q.cards[0].text && await page.getAttribute('[data-lk-card] .lk-say', 'dir') === 'rtl', `the card is the sentence itself, written right-to-left (« ${q.cards[0].text} »)`);
console.log('    text on screen (px): sentence', await px('.lk-card .lk-say'), '· box', await px('.lk-box__door strong'));
expect(await px('.lk-card .lk-say') >= (PHONE ? 13 : 17), 'a sentence card is comfortable to read');
await shot('sentences');
await page.click(`[data-lk-send="${q.cards[0].bin}"]`); await page.click(`[data-lk-send="${q.cards[1].bin}"]`); await shot('sentences-placed');
await page.click(`[data-lk-send="${q.cards[2].bin}"]`);
await hand(); await settle(); await page.waitForSelector('[data-lk-result]');
expect(await page.getAttribute('[data-lk-score]', 'data-lk-score') === '2/2' && JSON.stringify(await tool()) === JSON.stringify({ band: 'solid', seg: '2' }), 'two right answers: 2 / 2, the tool is « ثابتة » — the game asked nothing more');
expect(await page.locator('[data-lk-go]').count() === 1 && await page.locator('[data-lk-gate]').count() === 0, 'the take-off is open');
await shot('result-solid');
{ const k = await kit(9601); expect(k.items[TOOL].band === 'solid' && k.lessons[ID].tries === 1 && k.lessons[ID].last.percent === 100, 'the result is written in the student’s toolbox'); }
await page.click('[data-lk-go]'); await page.waitForFunction(() => !document.querySelector('[data-launch-kit]') && window.__world.getState().phase !== 'title', null, { timeout: 15000 });
expect(true, 'take-off: the launch closes and the world of the lesson starts');

// ══ 2. a student who slips on the sentences: « تحتاج تثبيتًا », the workshop repairs it on sentences ══
await open(9602);
await page.click('[data-lk-start]'); await page.waitForSelector('[data-lk-question]');
await fill(true); await hand(); await settle();
q = await fill(false);
// the signal lasts a moment: an observer set BEFORE the answer is handed in keeps what it said
await page.evaluate(() => { window.__said = null; new MutationObserver(() => { const el = document.querySelector('[data-lk-signal="later"]'); if (el && !window.__said) window.__said = { signal: el.textContent, stage: document.querySelector('.lk-stage').textContent }; }).observe(document.body, { childList: true, subtree: true, attributes: true }); });
await hand();
{ const said = await (await page.waitForFunction(() => window.__said)).jsonValue();
  expect(said.signal.includes('سنعود إليه') && !said.stage.includes('خطأ'), 'a miss says « سنعود إليه » — never « wrong », never the right answer'); }
await settle(); await page.waitForSelector('[data-lk-example]');
expect(JSON.stringify(await tool()) === JSON.stringify({ band: 'consolidate', seg: '1' }), 'one right, one missed: « تحتاج تثبيتًا » — and the workshop opens on it');
expect((await page.textContent('.lk-stage')).includes('انتبه'), 'the workshop opens on the mistake the answer showed');
await shot('workshop-mistake');
while (await page.locator('[data-lk-step-next]').count()) await page.click('[data-lk-step-next]');
await shot('workshop-example');
await page.click('[data-lk-try]'); await page.waitForSelector('[data-lk-qphase="workshop"]');
q = (await cur()).q;
expect(q.level === 2 && q.form === 'sentences', 'after the worked example, two questions LIKE the one he missed: sentences again, on other numbers');
await shot('workshop-question');
await fill(true); await hand(); await settle();
await fill(true); await hand(); await settle(); await page.waitForSelector('[data-lk-result]');
expect(await page.getAttribute('[data-lk-score]', 'data-lk-score') === '1/2' && await page.getAttribute(`[data-lk-kcard="${TOOL}"]`, 'data-lk-band') === 'consolidate' && await page.locator('[data-lk-go]').count() === 1, 'repaired, the tool keeps « تحتاج تثبيتًا » (1 / 2): what was just shown is not « ثابتة » yet — and the door is open');
await shot('result-repaired');

// ══ 3. a student who misses everything: ONE capsule of the core tool, then the door opens whatever he answers ══
await open(9603);
await page.click('[data-lk-start]'); await page.waitForSelector('[data-lk-question]');
await fill(false); await hand(); await settle();
q = (await cur()).q;
expect(q.level === 1 && q.form === 'pick', 'a tool is never judged on one answer: a second easy question, by another gesture — numbers to sort');
await shot('pick-easy');
await fill(false); await hand(); await settle();
await page.waitForSelector('[data-lk-example]');
while (await page.locator('[data-lk-step-next]').count()) await page.click('[data-lk-step-next]');
await page.click('[data-lk-try]'); await page.waitForSelector('[data-lk-qphase="workshop"]');
for (let i = 0; i < 2; i += 1) { await fill(false); await hand(); await settle(); }
await page.waitForSelector('[data-lk-result]');
expect(await page.getAttribute('[data-lk-score]', 'data-lk-score') === '0/2' && await page.locator('[data-lk-go]').count() === 0 && await page.getAttribute('[data-lk-gate]', 'data-lk-gate') === TOOL, 'everything missed: 0 / 2 — the take-off is replaced by ONE capsule of this core tool');
await shot('gate');
await page.click('[data-lk-capsule-start]'); await page.waitForSelector('[data-lk-capsule-step="card"]');
expect(await page.locator('[data-lk-capsule-card] li').count() === 4, 'the capsule opens on the card of the tool (four lines)');
await shot('capsule-card');
await page.click('[data-lk-capsule-next]'); await page.waitForSelector('[data-lk-capsule-step="example"]');
for (let i = 0; i < 2; i += 1) await page.click('[data-lk-capsule-next]');
expect(await page.locator('[data-lk-step]').count() === 3, 'then a worked example in three steps: the division, its remainder, the conclusion');
await shot('capsule-example');
await page.click('[data-lk-capsule-next]'); await page.waitForSelector('[data-lk-capsule-step="lab"]');
await shot('capsule-lab');
await page.click('[data-lk-capsule-lab]'); await page.waitForSelector('[data-lesson-lab]');
expect(await page.getAttribute('[data-lesson-lab]', 'data-ll-tool-on') === 'rows', 'then the instrument of the tool in the lab: the rows of the division, with his own numbers');
n += 1; await page.waitForTimeout(500); await page.screenshot({ path: `${OUT}/${String(n).padStart(2, '0')}-capsule-instrument.png` });
await page.click('[data-ll-close]'); await page.waitForFunction(() => !document.querySelector('[data-lesson-lab]'));
await page.click('[data-lk-capsule-next]'); await page.waitForSelector('[data-lk-qphase="capsule"]');
for (let i = 0; i < 2; i += 1) { await fill(false); await hand(); await settle(); }
await page.waitForSelector('[data-lk-capsule-end="done"]');
expect(await page.locator('[data-lk-go]').count() === 1 && await page.locator('[data-lk-gate]').count() === 0, 'both capsule answers missed — and the door is OPEN: never a second lock');
expect(await page.getAttribute(`[data-lk-kcard="${TOOL}"]`, 'data-lk-band') === 'start' && (await page.textContent(`[data-lk-kcard="${TOOL}"]`)).includes('كبسولة منجزة'), 'the tool stays « نبدأ منها », flagged « كبسولة منجزة »: nothing is pretended');
expect((await page.textContent('[data-lk-revise]')).includes('التعرّف على قاسم لعدد طبيعي'), 'what to revise is ONE lesson: the lesson before this one');
await shot('capsule-end');

expect(errors.length === 0, `no page error (${errors.length})`);
await browser.close();
console.log(process.exitCode ? 'FAILED' : `PASSED — screenshots in ${OUT}`);
