// « مختبري » — walk of the LAB of a lesson as a STUDENT (simulated session, no API).
// Lesson 1 of 4AM (in its game world): its three instruments, the cabinet of the EARLIER lessons only, numbers that follow the
// student from one instrument to the next, « جرّب » ticked only by what he makes. Then the PGCD lesson (mission home): its own
// instrument and the cabinet of two grades. Nothing may scroll, at any moment.
// Run (dev server up): [E2E_SIZE=1366x768] node apps/web/e2e/lesson-lab.mjs [outDir]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';

const BASE = `${process.env.E2E_BASE || 'http://localhost:5173'}/courses/moyen/4am/ansab_al_aadad_wal_hisab`;
const OUT = process.argv[2] || `${tmpdir()}/lesson-lab`;
const SIZE = (process.env.E2E_SIZE || '1366x768').split('x').map(Number);
mkdirSync(OUT, { recursive: true });
const expect = (cond, msg) => { if (!cond) { console.log('FAIL', msg); process.exitCode = 1; throw new Error(msg); } console.log('ok  ', msg); };
const browser = await chromium.launch({ args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: SIZE[0], height: SIZE[1] } });
await ctx.addInitScript(() => {
  localStorage.setItem('token', 'qa-fake-token');
  localStorage.setItem('u_9402_smarter_mission_bahth-pgcd', JSON.stringify({ opened: true, seen: {}, answered: {} })); // the returning home (the first view is the opening scene)
  const real = window.fetch.bind(window);
  window.fetch = async (input, init) => {
    const url = typeof input === 'string' ? input : input.url;
    if (url.includes('/api/')) return new Response(JSON.stringify(url.includes('/auth/me') ? { success: true, user: { id: 9402, name: 'تلميذ', role: 'student', roles: ['student'], email_verified_at: '2026-09-01T00:00:00Z', emailVerified: true, nameComplete: true, level: '4am', grade: '4am' } } : { success: true, data: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    return real(input, init);
  };
});
const page = await ctx.newPage(); const errors = [];
page.on('pageerror', (e) => { errors.push(e.message); console.log('pageerror', e.message); });
let n = 0;
/** Nothing scrolls, nothing leaves the screen, no text is tiny — checked at every screenshot. */
const shot = async (name) => {
  await page.waitForTimeout(450);
  const bad = await page.evaluate(() => {
    const out = []; const root = document.querySelector('.ll-root'); if (!root) return ['no lab on screen'];
    for (const el of root.querySelectorAll('*')) { const cs = getComputedStyle(el); if (/(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 2) out.push(`scrolls: ${el.className}`); }
    for (const el of root.querySelectorAll('.ll-head, .ll-rail, .ll-bench, .ll-quests, .ll-cabinet, .ll-reading, .ll-tile, .ll-cabinet-btn, .ll-quests li, .ll-sent__card, .ll-zone, .ll-sheet, .ll-think, .ll-lamp, .ll-toolhead')) { const r = el.getBoundingClientRect(); if (r.height > 0 && (r.top < -1 || r.bottom > window.innerHeight + 1 || r.left < -1 || r.right > window.innerWidth + 1)) out.push(`leaves the screen: ${el.className}`); }
    const stage = root.querySelector('.ll-stage').getBoundingClientRect();
    for (const el of root.querySelectorAll('.ll-draw > *, .ll-reading')) { const r = el.getBoundingClientRect(); if (r.bottom > stage.bottom + 2 || r.top < stage.top - 2) out.push(`out of the stage: ${el.className?.baseVal ?? el.className} (${Math.round(r.bottom - stage.bottom)}px)`); }
    for (const t of root.querySelectorAll('.ll-draw svg text')) { const r = t.getBoundingClientRect(); if (r.width > 0 && (r.left < stage.left - 1 || r.right > stage.right + 1 || r.top < stage.top - 1 || r.bottom > stage.bottom + 1)) out.push(`clipped label: ${t.textContent}`); }
    for (const el of root.querySelectorAll('.ll-quests, .ll-reading__text, .ll-sent__cards, .ll-think, .ll-cabinet__list')) if (el.scrollHeight > el.clientHeight + 3 || el.scrollWidth > el.clientWidth + 3) out.push(`overflows: ${el.className}`);
    if (document.documentElement.scrollHeight > window.innerHeight + 1 && !root.classList.contains('ll-root--inline') === false) out.push('the page scrolls');
    return out;
  });
  if (bad.length) { console.log('FAIL at «', name, '»:', [...new Set(bad)].join(' | ')); process.exitCode = 1; throw new Error(`layout at ${name}`); }
  n += 1; await page.screenshot({ path: `${OUT}/${String(n).padStart(2, '0')}-${name}.png` });
};
const px = (sel) => page.evaluate((s) => { const el = document.querySelector(s); const z = Number(document.querySelector('.ll-fit').style.zoom || 1); return el ? Math.round(parseFloat(getComputedStyle(el).fontSize) * z) : 0; }, sel);
const setNum = async (id, v) => { await page.fill(`[data-ll-input="${id}"]`, String(v)); await page.waitForTimeout(120); };
const quest = (id) => page.getAttribute(`[data-ll-quest="${id}"]`, 'data-ll-quest-done');
/** The sounds the lab has played so far (sound.js writes their names here in dev), and those played since a mark. */
const sounds = () => page.evaluate(() => [...(window.__labSounds ?? [])]);
let heard = 0; const since = async () => { const all = await sounds(); const fresh = all.slice(heard); heard = all.length; return fresh; };
/** Drags an svg handle to the viewBox abscissa `vx` (and ordinate `vy`), through real pointer events. */
const dragTo = async (handle, vx, vy = null) => {
  const box = await page.locator(handle).boundingBox(); const svg = await page.locator('.ll-draw > svg').boundingBox();
  const k = Math.min(svg.width / 940, svg.height / 370); const ox = svg.x + (svg.width - 940 * k) / 2; const oy = svg.y + (svg.height - 370 * k) / 2;
  const from = { x: box.x + box.width / 2, y: box.y + box.height / 2 }; const to = { x: ox + vx * k, y: vy == null ? from.y : oy + vy * k };
  await page.mouse.move(from.x, from.y); await page.mouse.down(); await page.mouse.move((from.x + to.x) / 2, (from.y + to.y) / 2, { steps: 6 }); await page.mouse.move(to.x, to.y, { steps: 6 }); await page.mouse.up(); await page.waitForTimeout(200);
};

// ══ 1. the first lesson of 4AM: the lab opens from the title screen of its game world ══
await page.goto(`${BASE}/qasim-adad-tabii`, { waitUntil: 'networkidle' }); heard = 0;
await page.waitForSelector('[data-di-lab-open]'); await page.click('[data-di-lab-open]'); await page.waitForSelector('[data-lesson-lab="qasim-adad-tabii"]'); await page.waitForSelector('[data-ll-rows]');
expect((await page.locator('.ll-rail [data-ll-tool]').evaluateAll((els) => els.map((e) => e.dataset.llTool))).join() === 'rows,jumps,sentences', 'the bench shows the three instruments of THIS lesson');
expect(await page.locator('[data-ll-cabinet-open]').count() === 1 && (await page.textContent('[data-ll-cabinet-open]')).includes('(2)'), '« خزانتي » holds the two instruments of the earlier lessons');
console.log('    text on screen (px): tool', await px('.ll-tile strong'), '· quest', await px('.ll-quests li'), '· reading', await px('.ll-reading__text'), '· hint', await px('.ll-toolhead p'));
expect(await px('.ll-quests li') >= 15 && await px('.ll-tile strong') >= 16, 'the text is comfortable to read');
// صفوف القسمة: 42 counters in rows of 5 → 8 rows and 2 left
expect(await page.getAttribute('[data-ll-rows]', 'data-q') === '8' && await page.getAttribute('[data-ll-rows]', 'data-r') === '2' && await page.locator('.ll-counter').count() === 42, 'صفوف القسمة: 42 counters in rows of 5 — 8 rows, 2 left over');
expect(await quest('zero') === '0', 'no « جرّب » is ticked before the student does anything');
await shot('rows-42-5');
{ const s0 = await since(); expect(s0.includes('enter') && !s0.includes('fit') && !s0.includes('quest'), `the lab opens on its own short chime, and an instrument is silent until it is touched (${s0.join(' ') || 'nothing'})`); }
// the hand moves the WALL: rows of 6 → nothing left
await dragTo('[data-ll-wall]', 910 - 6 * (760 / 24) - 7);
expect(await page.inputValue('[data-ll-input="b"]') === '6' && await page.getAttribute('[data-ll-rows]', 'data-r') === '0' && await page.getAttribute('[data-ll-reading]', 'data-ll-reading') === 'good', 'dragging the wall to rows of 6: the remainder is 0, the tray turns green, the number box follows');
expect(await quest('zero') === '1' && await quest('two') === '0', '« اجعل الباقي 0 » is ticked — by what the student made');
await shot('rows-42-6');
{ await page.waitForTimeout(500); const s1 = await since(); expect(s1.includes('tick') && s1.filter((x) => x === 'fit').length === 1 && s1.at(-1) === 'quest', `the wall ticks as it moves, ONE chime marks the rows that are full, then the mission rings (${s1.join(' ')})`); }
// the switch of the lab: off is silent, on answers at once
await page.click('[data-ll-sound]'); await dragTo('[data-ll-wall]', 910 - 9 * (760 / 24) - 7); await dragTo('[data-ll-wall]', 910 - 6 * (760 / 24) - 7);
{ const off = await since(); expect(off.length === 0 && await page.getAttribute('[data-ll-sound]', 'aria-pressed') === 'false', `« الصوت » off: the same gestures make no sound (${off.join(' ') || 'silence'})`); }
await page.click('[data-ll-sound]');
{ const on = await since(); expect(on.join() === 'on', 'switched back on, it answers with its two notes'); }
await dragTo('[data-ll-wall]', 910 - 7 * (760 / 24) - 7);
expect(await quest('two') === '1' && await page.getAttribute('[data-ll-stars]', 'data-ll-stars') === '2', 'a second divisor of the same number ticks the second mission; the lab counts 2 missions');
// قفزات المضاعفات — the SAME numbers follow the student
await page.click('[data-ll-tool="jumps"]'); await page.waitForSelector('[data-ll-jumps]');
expect(await page.inputValue('[data-ll-input="a"]') === '42' && await page.inputValue('[data-ll-input="b"]') === '7' && await page.getAttribute('[data-ll-jumps]', 'data-q') === '6', 'قفزات المضاعفات opens with the same numbers: 6 jumps of 7 reach 42');
await setNum('b', 5);
expect(await page.getAttribute('[data-ll-jumps]', 'data-r') === '2' && (await page.textContent('[data-ll-jumps]')).includes('يبقى 2'), 'jumps of 5: the last one lands on 40, and the line shows what is missing: 2');
await shot('jumps-42-5');
await page.click('[data-ll-run]'); await page.waitForTimeout(3600);
{ const before = await page.inputValue('[data-ll-input="a"]'); await dragTo('[data-ll-flag]', 40 + (30 / 48) * 860); const after = await page.inputValue('[data-ll-input="a"]'); expect(before === '42' && after === '30' && await page.getAttribute('[data-ll-jumps]', 'data-r') === '0', 'dragging the FLAG to 30: six jumps of 5 land on it exactly'); }
await shot('jumps-30-5');
{ const s2 = await since(); expect(s2.includes('open') && s2.filter((x) => x === 'hop').length === 8 && s2.includes('short') && s2.includes('fit'), `قفزات: the instrument is set on the bench, 8 hops are heard one by one, a landing before the flag sounds « short », the exact one chimes (${[...new Set(s2)].join(' ')})`); }
// آلة الجمل الأربع
await page.click('[data-ll-tool="sentences"]'); await page.waitForSelector('[data-ll-view="sentences"]');
expect(await page.locator('.ll-sent__card.is-ok').count() === 4 && (await page.textContent('.ll-sent__cards')).includes('5 قاسم للعدد 30'), 'آلة الجمل الأربع: 30 and 5 — the four sentences are true together');
await page.click('[data-ll-swap]');
expect(await page.locator('.ll-sent__card.is-ko').count() === 4 && (await page.textContent('[data-ll-reading]')).includes('5 < 30'), 'the lever swaps them: « 30 قاسم للعدد 5 » — the four are false together, and the reason is written');
await shot('sentences-swapped');
{ await page.waitForTimeout(300); const s3 = await since(); expect(s3.includes('swap') && s3.includes('rest'), `the lever whooshes, then the four false sentences fall on the soft low notes — never a buzzer (${s3.join(' ')})`); }
// خزانتي: only the PAST
await page.click('[data-ll-cabinet-open]'); await page.waitForSelector('[data-ll-cabinet]');
{
  const lessons = await page.locator('[data-ll-cabinet-lesson]').evaluateAll((els) => els.map((e) => e.dataset.llCabinetLesson));
  const tools = await page.locator('[data-ll-cabinet-tool]').evaluateAll((els) => els.map((e) => e.dataset.llCabinetTool));
  expect(lessons.join() === 'qisma-iqlidiya-baqi,qawaid-qabiliyat-qisma' && tools.join() === 'paper,rules' && await page.locator('[data-ll-grade]').count() === 1, 'the cabinet lists the two lessons of 1AM with their instruments');
  expect(!(await page.textContent('.ll-root')).includes('إقليدس') && !(await page.textContent('.ll-root')).includes('قوس القواسم'), 'NOTHING of the lessons after this one is shown — not even locked');
}
await shot('cabinet');
await page.click('[data-ll-cabinet-tool="paper"]'); await page.waitForSelector('[data-ll-sheet]');
expect(await page.locator('.ll-rail [data-ll-tool="paper"]').count() === 1 && (await page.textContent('[data-ll-from]')).includes('القسمة الإقليدية'), 'the picked instrument is on the bench, under « من خزانتي », and says which lesson it comes from');
await setNum('a', 756); await setNum('b', 36);
for (let i = 0; i < 2; i += 1) await page.click('[data-ll-step]');
await page.waitForTimeout(300);
expect((await page.textContent('[data-ll-quotient]')).trim() === '21' && await page.locator('[data-ll-paper-done]').count() === 1 && (await page.textContent('[data-ll-think]')).includes('36 \\times 21 + 0 = 756'), 'القسمة على الورقة: 756 ÷ 36 written in two steps — quotient 21, then the check 36 × 21 + 0 = 756');
expect((await page.textContent('[data-ll-paper-done]')).includes('36 قاسم للعدد 756') && await quest('end') === '1' && await quest('exact') === '1', 'the sheet ends on the sentence, and two missions are ticked');
await shot('paper-756-36');
{ await page.waitForTimeout(400); const s4 = await since(); expect(s4.includes('drawer') && s4.filter((x) => x === 'pencil').length === 2 && s4.includes('fit'), `the cabinet is a drawer, each step of the division is a pencil, a remainder 0 chimes (${[...new Set(s4)].join(' ')})`); }
await page.click('[data-ll-cabinet-open]'); await page.click('[data-ll-cabinet-tool="rules"]'); await page.waitForSelector('[data-ll-lock]');
expect(await page.getAttribute('[data-ll-lock]', 'data-ll-lock') === '756' && await page.getAttribute('[data-ll-lamp="9"]', 'data-ll-lit') === '1' && await page.getAttribute('[data-ll-lamp="5"]', 'data-ll-lit') === '0', 'كاشف قابلية القسمة takes the same 756: the lamps of 2, 3, 4, 9 are lit, 5 and 10 are dark');
await page.click('[data-ll-lamp="9"]');
expect(await page.locator('.ll-wheel.is-read').count() === 3 && (await page.textContent('[data-ll-reading]')).includes('مجموع الأرقام 18'), 'tapping the lamp of 9 raises the three digits its rule reads: their sum, 18');
await page.click('[data-ll-up="2"]'); // 756 → 757
expect(await page.getAttribute('[data-ll-lock]', 'data-ll-lock') === '757' && await page.getAttribute('[data-ll-lamp="9"]', 'data-ll-lit') === '0', 'rolling one digit of the padlock (757) puts the lamp out');
await shot('rules-757');
{ const s5 = await since(); expect(s5.includes('lamp') && s5.includes('click') && s5.includes('lamps') === false, `the padlock clicks; 757 lights no lamp, so no lamp rings (${[...new Set(s5)].join(' ')})`); }
await page.click('[data-ll-down="2"]'); await page.waitForTimeout(250);
{ const s6 = await since(); expect(s6.includes('click') && s6.includes('lamps'), 'back to 756: the lit lamps ring, one soft note each'); }
await page.click('[data-ll-close]');
expect(await page.locator('.ll-root').count() === 0 && await page.locator('[data-di-lab-open]').count() === 1, 'closing the lab returns to the lesson');

// ══ 2. another lesson — the PGCD: its own instrument, and the cabinet of everything before it ══
await page.goto(`${BASE}/bahth-pgcd`, { waitUntil: 'networkidle' }); heard = 0;
await page.waitForSelector('[data-mission-lab]'); await page.click('[data-mission-lab]'); await page.waitForSelector('[data-lesson-lab="bahth-pgcd"]'); await page.waitForSelector('[data-ll-euclid]');
expect((await page.locator('.ll-rail [data-ll-tool]').evaluateAll((els) => els.map((e) => e.dataset.llTool))).slice(0, 1).join() === 'euclid' && page.url().includes('lab=1'), 'the PGCD lesson opens the SAME lab from its home: its instrument is مربّعات إقليدس');
expect(await page.getAttribute('[data-ll-stars]', 'data-ll-stars') !== '0', 'the missions made in the other lesson are still counted: one toolbox for the student');
await setNum('a', 48); await setNum('b', 18);
const squares = Number(await page.getAttribute('[data-ll-euclid]', 'data-squares'));
for (let i = 0; i < squares; i += 1) await page.click('[data-ll-cut]');
await page.waitForTimeout(300);
expect(squares === 5 && (await page.textContent('[data-ll-lines]')).includes('12 = 6 × 2 + 0') && (await page.textContent('[data-ll-lines]')).includes('48 = 18 × 2 + 12'), 'مربّعات إقليدس: 48 × 18 is cut in 5 squares, and each family of squares wrote its division (48 = 18 × 2 + 12 … 12 = 6 × 2 + 0)');
expect(await page.getAttribute('[data-ll-pgcd]', 'data-ll-pgcd') === '6' && await quest('one') === '1' && await quest('three') === '1', 'the last square has side 6: the PGCD — and the missions are ticked');
{ // every text of the drawing stays inside the stage (a clipped label is a wrong drawing)
  const out = await page.evaluate(() => { const st = document.querySelector('.ll-stage').getBoundingClientRect(); return [...document.querySelectorAll('.ll-draw svg text')].filter((t) => { const r = t.getBoundingClientRect(); return r.left < st.left - 1 || r.right > st.right + 1 || r.top < st.top - 1 || r.bottom > st.bottom + 1; }).map((t) => t.textContent); });
  expect(out.length === 0, `the three divisions are written beside the rectangle, fully visible (${out.join(' | ') || 'none clipped'})`);
}
await shot('euclid-48-18');
{ await page.waitForTimeout(400); const s7 = await since(); expect(s7.filter((x) => x === 'snip').length === 5 && s7.includes('pencil') && s7.includes('crown'), `إقليدس: five snips of the scissors, the pencil writes each division, the last square is crowned (${[...new Set(s7)].join(' ')})`); }
{ const u = Math.min(640 / 48, 318 / 18, 46); await dragTo('[data-ll-corner]', 48 + 30 * u, 14 + 12 * u); }
expect(await page.inputValue('[data-ll-input="a"]') === '30' && await page.inputValue('[data-ll-input="b"]') === '12' && await page.getAttribute('[data-ll-euclid]', 'data-cut') === '0', 'dragging the CORNER makes another rectangle (30 × 12), uncut');
await page.click('[data-ll-cabinet-open]'); await page.waitForSelector('[data-ll-cabinet]');
{
  const grades = await page.locator('[data-ll-grade]').evaluateAll((els) => els.map((e) => e.dataset.llGrade));
  expect(grades.join() === '1am,4am', 'its cabinet has two grades: 1AM and the earlier lessons of 4AM');
  const lessons = await page.locator('[data-ll-cabinet-lesson]').evaluateAll((els) => els.map((e) => e.dataset.llCabinetLesson));
  expect(lessons.join() === 'qasim-adad-tabii,qawasim-adad-tabii,qasim-mushtarak-akbar', 'the 4AM shelf: the three earlier lessons that have instruments');
  await shot('cabinet-pgcd');
  await page.click('[data-ll-grade="1am"]');
  expect((await page.locator('[data-ll-cabinet-tool]').evaluateAll((els) => els.map((e) => e.dataset.llCabinetTool))).join() === 'paper,rules', 'the 1AM shelf is one tap away');
  await page.click('[data-ll-grade="4am"]');
}
await page.click('[data-ll-cabinet-tool="divisors"]'); await page.waitForSelector('[data-ll-divisors]');
await setNum('a', 36);
await dragTo('[data-ll-lens]', 896);
{
  const box = await page.locator('.ll-draw > svg').boundingBox(); const k = Math.min(box.width / 940, box.height / 370); const ox = box.x + (box.width - 940 * k) / 2; const oy = box.y + (box.height - 370 * k) / 2;
  await page.mouse.move(ox + 896 * k, oy + 268 * k); await page.mouse.down(); await page.mouse.move(ox + 44 * k, oy + 268 * k, { steps: 120 }); await page.mouse.up(); await page.waitForTimeout(250);
}
expect(await page.getAttribute('[data-ll-divisors]', 'data-found') === '1,2,3,4,6,9,12,18,36' && await page.locator('[data-ll-complete]').count() === 1, 'قوس القواسم: sweeping the lens over the line finds the nine divisors of 36, each with its partner');
expect(await quest('all') === '1' && await quest('odd') === '1', 'an odd number of divisors: the mission is ticked');
await shot('divisors-36');
await page.click('[data-ll-cabinet-open]'); await page.click('[data-ll-cabinet-tool="common"]'); await page.waitForSelector('[data-ll-view="common"]');
await setNum('b', 24);
expect(await page.getAttribute('[data-ll-pgcd]', 'data-ll-pgcd') === '12' && await page.locator('[data-ll-zone="both"] .ll-dchip.is-top').count() === 1 && (await page.locator('[data-ll-zone="both"] [data-ll-d]').evaluateAll((els) => els.map((e) => e.dataset.llD))).join() === '1,2,3,4,6,12', 'القواسم المشتركة of 36 and 24: 1, 2, 3, 4, 6, 12 — the 12 wears the crown');
await shot('common-36-24');
await page.keyboard.press('Escape'); await page.waitForTimeout(500);
expect(await page.locator('.ll-root').count() === 0 && !page.url().includes('lab=1') && await page.locator('[data-mission-lab]').count() === 1, 'Escape closes the lab and returns to the lesson home');

// ══ 3. a lesson with nothing before it has no lab door ══
await page.goto(`${process.env.E2E_BASE || 'http://localhost:5173'}/courses/moyen/1am/ansab_al_aadad_wal_hisab/kitabat-adad-tabii?lab=1`, { waitUntil: 'networkidle' }); heard = 0;
await page.waitForTimeout(800);
expect(await page.locator('.ll-root').count() === 0 && await page.locator('[data-lesson-lab-open], [data-mission-lab]').count() === 0, 'the very first lesson of 1AM: no instrument is reached yet — no door, no lab');
expect(errors.length === 0, 'no page error');
await browser.close();
