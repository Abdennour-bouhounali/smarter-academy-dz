// « أتوقّع القاعدة » — predict-rule.mjs generalised to ANY lesson (rollout 2026-10-06).
// Real student account (API :8000). For each content module of the lesson, the modules before it
// are seeded done; an AUTOPILOT then answers the open step (first option / a number) until a
// prediction panel appears, and every panel met is checked: the lesson's OWN prompt is shown (never
// the generic one), the reveal button waits for writing, the palette holds only symbols, the rule
// appears with « توقّعك ». A rule the autopilot cannot reach (a lab must be solved first) is
// reported, not failed. Reset the student's progress row first; publish a draft lesson locally only.
// Run: PREDICT_LESSON=qawasim-adad-tabii KIT_BASE=http://localhost:5173 node apps/web/e2e/lesson-kit/predict-lesson.mjs
import { launch, newCtx, check, summary, watchErrors, BASE, SHOT_DIR } from './helpers.mjs';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const CODE = process.env.PREDICT_LESSON;
if (!CODE) { console.error('PREDICT_LESSON=<lesson code> is required'); process.exit(2); }
const ROOT = new URL('../../src/lessons/moyen/4am/', import.meta.url).pathname;
function findDir(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const p = join(dir, e.name);
    if (e.name === CODE && existsSync(join(p, 'lesson.config.js'))) return p;
    const r = findDir(p);
    if (r) return r;
  }
  return null;
}
const DIR = findDir(ROOT);
const { LESSON_CONFIG, LESSON_BASE_PATH } = await import(join(DIR, 'lesson.config.js'));
const LESSON = `${BASE}${LESSON_BASE_PATH}`;
const API = process.env.KIT_API || 'http://localhost:8000/api/v1';
const AR = JSON.parse(readFileSync(new URL('../../src/i18n/locales/ar/lesson.json', import.meta.url)));
const GENERIC = AR.predict.prompt;
const only = process.env.PREDICT_MODULES?.split(',').map(Number);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// The prompts as written in knowledge.jsx (static read: the file is JSX).
const KNOW = readFileSync(join(DIR, 'knowledge.jsx'), 'utf8');
const promptOf = (id) => {
  const at = KNOW.search(new RegExp(`id:\\s*'${id}'`));
  if (at < 0) return null;
  const m = KNOW.slice(at, at + 4000).match(/predictPrompt:\s*'((?:[^'\\]|\\.)*)'/);
  return m ? m[1].replace(/\\\\/g, '\\') : null;
};
// A fragment of plain Arabic text of the prompt (outside $…$), to recognise it on the page.
const fragment = (p) => (p.split(/\$[^$]*\$/).map((s) => s.trim()).sort((a, b) => b.length - a.length)[0] || '').slice(0, 18);

const login = await fetch(`${API}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  body: JSON.stringify({ email: 'qa-eleve@smarter.dz', password: 'QaPass2026!' }) }).then((x) => x.json());
const TOKEN = login.token ?? login.data?.token;
const UID = login.user?.id ?? login.data?.user?.id;
if (!TOKEN || !UID) { console.error('login failed', login); process.exit(1); }

const { browser } = await launch();
const errors = [];
const seen = new Set();

async function open(done, mobile) {
  const ctx = await newCtx(browser, { mobile });
  await ctx.addInitScript(([token, uid, code, done]) => {
    localStorage.setItem('token', token);
    if (!sessionStorage.getItem('seeded')) {
      localStorage.setItem(`u_${uid}_smarter_lesson_${code}`, JSON.stringify({ completedModules: done, completedExercises: [], layoutVersion: 2 }));
      localStorage.removeItem(`u_${uid}_smarter_predictions_${code}`);
      sessionStorage.setItem('seeded', '1');
    }
  }, [TOKEN, UID, CODE, done]);
  const page = await ctx.newPage();
  watchErrors(page, errors);
  return { ctx, page };
}

/** Answers something in the first open, unfinished step. false = nothing to do. */
async function advance(page) {
  const step = page.locator('section[id^="step-"]:not(.border-emerald-300)').first();
  if (!(await step.count())) return false;
  const input = step.locator('input:not([type="range"]):not([type="checkbox"]):visible').first();
  if (await input.count() && await input.isEnabled() && !(await input.inputValue())) {
    await input.fill('1');
    const ok = step.getByRole('button', { name: AR.question.ok }).first();
    if (await ok.count() && await ok.isEnabled()) await ok.click(); else await input.press('Enter');
    return true;
  }
  const opt = step.locator('button[aria-pressed="false"]:visible:enabled').first();
  if (await opt.count()) { await opt.click(); return true; }
  const next = step.getByRole('button', { name: new RegExp(AR.textbook.nextLine) }).first();
  if (await next.count() && await next.isVisible()) { await next.click(); return true; }
  return false;
}

async function checkPanel(page, id, n, mobile) {
  const panel = page.locator(`[data-predict-for="${id}"]`).first();
  const text = (await panel.innerText()).replace(/\s+/g, ' ');
  const own = promptOf(id);
  check(`${CODE} M${n} ${id}: the lesson's own prompt is shown`, own && text.includes(fragment(own)) && !text.includes(GENERIC.slice(0, 20)), own ? fragment(own) : 'no predictPrompt in knowledge.jsx (PredictRule prompt?)');
  const btn = panel.getByRole('button', { name: AR.predict.reveal });
  check(`${CODE} M${n} ${id}: reveal disabled before writing`, await btn.isDisabled());
  const palette = await panel.locator('[data-math-symbols] button').allInnerTexts();
  check(`${CODE} M${n} ${id}: palette is short (rule symbols only)`, palette.length <= 14, JSON.stringify(palette));
  await panel.locator('textarea').fill('أكتب القاعدة بكلماتي هنا');
  await panel.scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${SHOT_DIR}predict-${CODE}-m${n}-${id}${mobile ? '-phone' : ''}.png` });
  check(`${CODE} M${n} ${id}: reveal enabled after writing`, await btn.isEnabled());
  await btn.click();
  await page.locator(`[data-predict-own="${id}"], [data-predict-revealed="${id}"] [data-predict-own]`).first().waitFor({ timeout: 8000 });
  check(`${CODE} M${n} ${id}: the rule appears with « توقّعك »`, true);
  if (mobile) check(`${CODE} M${n} ${id}: phone, no horizontal overflow`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  seen.add(id);
}

const content = LESSON_CONFIG.modules.filter((m) => !['prerequisite_check', 'evaluation'].includes(m.stage) && m.track !== 'problem' && (!only || only.includes(m.number)));
let k = 0;
for (const mod of content) {
  const mobile = k++ % 2 === 1; // alternate desktop / phone
  const done = LESSON_CONFIG.modules.filter((m) => m.number < mod.number).map((m) => String(m.number));
  const { ctx, page } = await open(done, mobile);
  await page.goto(`${LESSON}/${mod.slug}`, { waitUntil: 'networkidle' });
  check(`${CODE} M${mod.number}: real session`, !page.url().includes('/login'), page.url());
  let idle = 0;
  for (let it = 0; it < 80 && idle < 3; it++) {
    const pending = page.locator('[data-predict-for]:visible');
    if (await pending.count()) {
      const id = await pending.first().getAttribute('data-predict-for');
      await checkPanel(page, id, mod.number, mobile);
      idle = 0;
      await sleep(400);
      continue;
    }
    const moved = await advance(page).catch(() => false);
    idle = moved ? 0 : idle + 1;
    await sleep(moved ? 450 : 700);
  }
  await ctx.close();
}

console.log(`\nprompts met in the browser: ${[...seen].join(', ') || '(none)'}`);
check(`${CODE}: at least one predicted rule met`, seen.size > 0);
check('no console/page error', errors.length === 0, errors.slice(0, 5).join(' | '));
await browser.close();
process.exit(summary() ? 1 : 0);
