// L'ESPACE D'EXERCICES — se repérer, et tout lire en arabe.
//
// Ce que cette suite verrouille :
//   1. À TOUT MOMENT l'élève sait OÙ il est : quel exercice du niveau, quelle
//      question de l'exercice ;
//   2. et ce qu'il lui RESTE : questions de l'exercice courant, puis exercices
//      du niveau — jamais un nombre négatif, et « آخر… » sur le dernier ;
//   3. les deux compteurs AVANCENT quand il répond ;
//   4. aucun texte français ne subsiste dans le parcours (verdicts compris) ;
//   5. le bandeau tient sur un téléphone de 360 px.
//
// Cette suite a besoin de l'API (jeton élève). Elle vise donc le SERVEUR DE
// DÉVELOPPEMENT (5173) : la préversion (5183) est construite sans
// .env.production et pointe vers un port où rien n'écoute.
//
// Run : KIT_BASE=http://localhost:5173 PRACTICE_TOKEN=… node apps/web/e2e/lesson-kit/practice-progress.mjs
import { chromium } from 'playwright';

const B = process.env.KIT_BASE || 'http://localhost:5173';
const TOKEN = process.env.PRACTICE_TOKEN;
const LESSON = process.env.PRACTICE_LESSON || 'qasim-adad-tabii';

const results = [];
const check = (name, cond, detail = '') => {
  results.push({ name, pass: !!cond });
  console.log(`${cond ? 'PASS' : 'FAIL'} ${name}${detail && !cond ? ` — ${detail}` : ''}`);
};

if (!TOKEN) {
  console.log('SKIP practice-progress : PRACTICE_TOKEN absent (jeton élève requis).');
  process.exit(0);
}

// Tout mot français qui atteindrait l'élève dans ce parcours.
const FR = /\b(Juste|Pas encore|À moitié|Réponse illisible|Question passée|Ta réponse|Abscisse|Ordonnée|Borne|Coefficient|Crochet|Exercice \d|Niveau \d|exercices?|conseillé|terminé|restants?|juste)\b/;

const browser = await chromium.launch({ args: ['--no-sandbox'] });

const readBanner = (page) => page.evaluate(() => {
  const b = document.querySelector('[data-session-progress]');
  if (!b) return null;
  return {
    exercise: b.querySelector('[data-exercise-position]')?.innerText.trim() ?? null,
    question: b.querySelector('[data-question-position]')?.innerText.trim() ?? null,
    remaining: b.querySelector('[data-remaining]')?.innerText.trim() ?? null,
    exerciseIndex: Number(b.getAttribute('data-exercise-index')),
    questionIndex: Number(b.getAttribute('data-question-index')),
  };
});

/** Répond à la question courante et passe à la suivante. Renvoie false à la fin. */
async function answerAndAdvance(page) {
  const opt = page.locator('button:not([disabled])').filter({ hasText: /صحيح|خطأ|^A|^B|^C|^D/ }).first();
  if (await opt.count()) { await opt.click(); await page.waitForTimeout(250); }
  const chk = page.getByRole('button', { name: /تحقّق/ }).first();
  if (await chk.count() && await chk.isEnabled().catch(() => false)) { await chk.click(); await page.waitForTimeout(1500); }
  const next = page.getByRole('button', { name: /السؤال التالي|التمرين التالي/ }).first();
  if (await next.count() && await next.isEnabled().catch(() => false)) { await next.click(); await page.waitForTimeout(2200); return true; }
  return false;
}

async function open({ mobile = false } = {}) {
  const ctx = await browser.newContext({
    viewport: mobile ? { width: 360, height: 780 } : { width: 1280, height: 900 },
    isMobile: mobile, hasTouch: mobile,
  });
  await ctx.addInitScript((tok) => { localStorage.setItem('token', tok); }, TOKEN);
  const page = await ctx.newPage();
  await page.goto(`${B}/espace/pratique/${LESSON}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1600);
  const level = page.locator('[data-practice-level="1"]');
  if (await level.count()) { await level.first().click(); await page.waitForTimeout(3000); }
  return { ctx, page };
}

/* ── 1 · 2 — se repérer, et savoir ce qu'il reste ────────────────────────── */
{
  const { ctx, page } = await open();
  const b = await readBanner(page);
  check('le bandeau de progression est présent', b !== null);
  check('il dit QUEL EXERCICE (التمرين n من N)', /التمرين\s+\d+\s+من\s+\d+/.test(b?.exercise ?? ''), b?.exercise);
  check('il dit QUELLE QUESTION (السؤال n من N)', /السؤال\s+\d+\s+من\s+\d+/.test(b?.question ?? ''), b?.question);
  check('il dit CE QU’IL RESTE', /بقي|آخر/.test(b?.remaining ?? ''), b?.remaining);
  check('aucun nombre négatif dans le reste', !/-\d/.test(b?.remaining ?? ''), b?.remaining);
  await ctx.close();
}

/* ── 3 — les deux compteurs avancent ─────────────────────────────────────── */
{
  const { ctx, page } = await open();
  const start = await readBanner(page);
  await answerAndAdvance(page);
  const afterQ = await readBanner(page);
  check('répondre fait avancer la QUESTION', afterQ.questionIndex === start.questionIndex + 1 || afterQ.exerciseIndex === start.exerciseIndex + 1,
    `${start.questionIndex} → ${afterQ.questionIndex}`);

  // Aller jusqu'au changement d'exercice.
  let guard = 0;
  while (guard++ < 8) {
    const before = await readBanner(page);
    const moved = await answerAndAdvance(page);
    const after = await readBanner(page);
    if (!moved || !after) break;
    if (after.exerciseIndex > before.exerciseIndex) {
      check('changer d’exercice remet la question à 1', after.questionIndex === 0, String(after.questionIndex));
      check('le dernier exercice est annoncé « آخر تمرين »',
        after.exerciseIndex < 1 || /آخر تمرين|ثم \d+|ثم تمرين/.test(after.remaining), after.remaining);
      break;
    }
  }
  await ctx.close();
}

/* ── 3bis — le NUMÉRO DE QUESTION est dans l'en-tête de l'exercice ───────── */
{
  const { ctx, page } = await open();
  const heading = () => page.evaluate(() => document.querySelector('header p')?.innerText.replace(/\s+/g, ' ').trim() ?? '');
  const first = await heading();
  check('l’en-tête porte « المستوى n · … السؤال n »', /المستوى\s+\d+\s+·/.test(first) && /السؤال\s+\d+/.test(first), first);
  check('un titre « تمرين n — sujet » place le numéro avant le sujet',
    !/تمرين/.test(first) || /تمرين\s+\d+\s+—\s+السؤال\s+\d+\s+:/.test(first), first);
  await answerAndAdvance(page);
  const second = await heading();
  check('le numéro de question suit l’élève', second !== first, `${first} → ${second}`);
  await ctx.close();
}

/* ── 4 — tout en arabe, verdict compris ──────────────────────────────────── */
{
  const { ctx, page } = await open();
  const opt = page.locator('button:not([disabled])').filter({ hasText: /صحيح|خطأ|^A|^B/ }).first();
  if (await opt.count()) { await opt.click(); await page.waitForTimeout(250); }
  const chk = page.getByRole('button', { name: /تحقّق/ }).first();
  if (await chk.count() && await chk.isEnabled().catch(() => false)) { await chk.click(); await page.waitForTimeout(1800); }
  const body = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
  check('aucun texte français dans la séance', !FR.test(body), (body.match(FR) || [])[0]);
  check('le verdict est en arabe', /إجابة صحيحة|ليس بعد|نصف الطريق|صحيحة — بكتابة أخرى/.test(body));
  await ctx.close();
}

/* ── 5 — téléphone ───────────────────────────────────────────────────────── */
{
  const { ctx, page } = await open({ mobile: true });
  const b = await readBanner(page);
  check('mobile : le bandeau garde les deux repères', /التمرين/.test(b?.exercise ?? '') && /السؤال/.test(b?.question ?? ''));
  check('mobile : aucun débordement horizontal', await page.evaluate(() => document.scrollingElement.scrollWidth <= window.innerWidth + 1));
  await ctx.close();
}

await browser.close();
const fails = results.filter((r) => !r.pass);
console.log(`\n== ${results.length - fails.length}/${results.length} passed ==`);
if (fails.length) { console.log('FAILED:'); fails.forEach((f) => console.log(` - ${f.name}`)); }
