// Pilote « مسائل » (2026-10-05) — درس 1 qasim-adad-tabii, modules 4–6 + test 7.
// Vrai compte élève (API :8000), réponses VOLONTAIREMENT fausses partout :
// le parcours guidé doit avancer quand même (non bloquant), chaque module se
// terminer, AUCUNE requête d'evidence partir, et le test (7) rester ouvert.
// Run: KIT_BASE=http://localhost:5173 node apps/web/e2e/lesson-kit/masail-pilot.mjs
import { launch, newCtx, check, summary, watchErrors, BASE, SHOT_DIR } from './helpers.mjs';
import { readFileSync } from 'node:fs';
import { PROBLEMS } from '../../src/lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/qasim-adad-tabii/content/problems.js';

const API = process.env.KIT_API || 'http://localhost:8000/api/v1';
const EMAIL = 'qa-eleve@smarter.dz';
const PASSWORD = 'QaPass2026!';
const LESSON = `${BASE}/courses/moyen/4am/ansab_al_aadad_wal_hisab/qasim-adad-tabii`;
const AR = JSON.parse(readFileSync(new URL('../../src/i18n/locales/ar/lesson.json', import.meta.url)));

const login = await fetch(`${API}/auth/login`, {
  method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
}).then((r) => r.json());
const TOKEN = login.token ?? login.data?.token;
const UID = login.user?.id ?? login.data?.user?.id;
if (!TOKEN || !UID) { console.error('login failed', login); process.exit(1); }

const { browser } = await launch();
const errors = [];
const evidence = [];

async function openCtx({ mobile = false } = {}) {
  const ctx = await newCtx(browser, { mobile });
  await ctx.addInitScript(([token, uid]) => {
    localStorage.setItem('token', token);
    // Les modules 0–3 faits, dans la disposition courante (layoutVersion 2).
    const key = `u_${uid}_smarter_lesson_qasim-adad-tabii`;
    if (!sessionStorage.getItem('seeded')) {
      localStorage.setItem(key, JSON.stringify({ completedModules: ['0', '1', '2', '3'], completedExercises: [], layoutVersion: 2 }));
      sessionStorage.setItem('seeded', '1');
    }
  }, [TOKEN, UID]);
  // Seuls les ENVOIS vers l'API comptent (pas les fichiers source evidenceQueue.js, ni les lectures).
  ctx.on('request', (req) => { if (req.method() === 'POST' && /\/api\/v1\/.*(evidence|final-test-attempt)/.test(req.url())) evidence.push(req.url()); });
  const page = await ctx.newPage();
  watchErrors(page, errors);
  return { ctx, page };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Résout UNE sous-étape ouverte, toujours avec une mauvaise réponse. */
async function answerWrong(page, li, problem) {
  const role = await li.getAttribute('data-problem-substep');
  if (role === 'extract') {
    // Tout dans « مفيد » : le tri est faux (il y a des données inutiles).
    for (const d of problem.data) {
      await li.locator(`[aria-label="${d.text}"]`).first().click();
      // Le bord du bac : son centre peut porter une carte déjà rangée (clic = la retirer).
      await li.locator(`[data-drop-zone="utile"]`).click({ position: { x: 12, y: 12 } });
    }
    await li.getByRole('button', { name: AR.infoSorter.check }).click();
  } else if (role === 'translate' || role === 'conclude') {
    const opts = li.locator('button').filter({ hasNotText: AR.textbook.nextLine });
    const n = await opts.count();
    await opts.nth(n - 1).click(); // la dernière option : fausse dans ces données (sauf une, où elle est juste)
  } else if ((role === 'compute' || role === 'answer') && await li.locator('input').count()) {
    await li.locator('input').fill('1');
    await li.getByRole('button', { name: AR.question.ok }).click();
  } else if (role === 'answer') {
    // batch : la première option de chaque ligne (fausse sur deux lignes) ; correction à la dernière.
    const groups = li.locator('[role="group"]');
    for (let g = 0; g < await groups.count(); g++) await groups.nth(g).locator('button').first().click();
  } else if (role === 'written') {
    const show = li.getByRole('button', { name: new RegExp(AR.problem.write.show) });
    check('rédaction : « أظهر » désactivé tant que rien n\'est écrit', await show.isDisabled());
    await li.locator('textarea').fill('القسمة الإقليدية ثم الجواب');
    await show.click();
    const next = li.getByRole('button', { name: new RegExp(AR.problem.write.next) });
    let lines = 1;
    while (await next.count()) { await next.click(); lines++; await sleep(80); }
    check('rédaction : modèle révélé ligne par ligne, texte de l\'élève conservé',
      (await li.locator('[data-model-line]').count()) === lines && (await li.locator('[data-written-own]').innerText()).includes('القسمة الإقليدية'));
  }
  await sleep(250);
}

async function solveProblemModule(page, n, problem, shotPrefix) {
  await page.goto(`${LESSON}/masala-${n - 3}`, { waitUntil: 'networkidle' });
  check(`M${n}: le brief porte l'énoncé complet`, (await page.locator('[data-problem-statement]').innerText()).includes(problem.statement.slice(0, 25)));
  for (let p = 0; p < problem.parts.length; p++) {
    const part = page.locator(`[data-problem-part="${p + 1}"]`);
    await part.waitFor({ timeout: 10000 });
    // Deux questions = deux réponses, VISIBLES dès l'ouverture de la partie.
    const asks = problem.parts[p].asks.length;
    const answerSlots = await part.locator('[data-problem-ask]').evaluateAll((els) => new Set(els.map((e) => e.getAttribute('data-problem-ask'))).size);
    check(`M${n} partie ${p + 1}: ${asks} demande(s) listée(s) et chacune a sa case de réponse visible d'emblée`,
      (await part.locator('[data-problem-ask-item]').count()) === asks && answerSlots === asks);
    if (n === 6 && p === 1) await part.screenshot({ path: `${SHOT_DIR}${shotPrefix}-m6-part2-open.png` });
    for (let i = 0; i < problem.parts[p].steps.length; i++) {
      const li = part.locator('[data-problem-substep]').nth(i);
      await part.locator(`[data-problem-substep]:nth-child(${i + 1})[data-substep-locked="false"]`).waitFor({ timeout: 5000 });
      await li.scrollIntoViewIfNeeded();
      if (p === 0 && i === 1) await page.screenshot({ path: `${SHOT_DIR}${shotPrefix}-m${n}-part1.png`, fullPage: false });
      await answerWrong(page, li, problem);
      check(`M${n} partie ${p + 1} sous-étape ${i + 1}: faite malgré une réponse fausse`, (await li.getAttribute('data-substep-done')) === 'true');
    }
  }
  const answered = await page.locator('[data-problem-ask-item][data-answered="true"]').count();
  check(`M${n}: toutes les demandes cochées à la fin`, answered === problem.parts.reduce((a, pt) => a + pt.asks.length, 0));
  await page.screenshot({ path: `${SHOT_DIR}${shotPrefix}-m${n}-done.png`, fullPage: true });
  await sleep(600);
  const stored = await page.evaluate((uid) => JSON.parse(localStorage.getItem(`u_${uid}_smarter_lesson_qasim-adad-tabii`) || '{}'), UID);
  check(`M${n}: module marqué terminé`, stored.completedModules?.includes(String(n)), JSON.stringify(stored.completedModules));
}

// ── Desktop : sommaire, module 1, les trois مسائل, le test ────────────────
{
  const { ctx, page } = await openCtx();
  await page.goto(LESSON, { waitUntil: 'networkidle' });
  check('session réelle (pas de redirection /login)', !page.url().includes('/login'), page.url());
  const card = page.locator('[data-lesson-problem]');
  check('sommaire: carte « مسألة الدرس » visible', await card.isVisible());
  check('sommaire: la carte porte 756 et le lien vers مسألة 1', (await card.innerText()).includes('756') && (await card.locator('a').getAttribute('href'))?.endsWith('/masala-1'));
  await card.screenshot({ path: `${SHOT_DIR}masail-index-card.png` });
  check('sommaire: 8 modules dans le parcours', (await page.locator('a[href*="/qasim-adad-tabii/"]').evaluateAll((as) => new Set(as.map((a) => a.getAttribute('href').split('/').pop())).size)) >= 8);

  for (let k = 0; k < 3; k++) await solveProblemModule(page, 4 + k, PROBLEMS[k], 'masail-desktop');

  check('aucun envoi evidence/final-test pendant les مسائل', evidence.length === 0, evidence.join(', '));
  await page.goto(`${LESSON}/itqan`, { waitUntil: 'networkidle' });
  check('le test (module 7) est ouvert', !page.url().includes('/login') && (await page.locator('body').innerText()).includes('إختبار أولي'));
  await page.goto(LESSON, { waitUntil: 'networkidle' });
  await page.locator('[data-lesson-problem]').waitFor();
  await page.screenshot({ path: `${SHOT_DIR}masail-index-after.png`, fullPage: true });

  await page.goto(`${LESSON}/al-maktaba`, { waitUntil: 'networkidle' });
  check('module 1: le rappel « مسألة الدرس » est présent', (await page.locator('[data-lesson-problem]').count()) === 1);
  await ctx.close();
}

// ── Téléphone : pas de débordement horizontal, sous-étapes utilisables ────
{
  const { ctx, page } = await openCtx({ mobile: true });
  await page.goto(LESSON, { waitUntil: 'networkidle' });
  check('mobile: sommaire sans débordement horizontal', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  await page.goto(`${LESSON}/masala-1`, { waitUntil: 'networkidle' });
  check('mobile: مسألة 1 sans débordement horizontal', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  await page.screenshot({ path: `${SHOT_DIR}masail-mobile-m4.png`, fullPage: true });
  await ctx.close();
}

check('aucune erreur console/page', errors.length === 0, errors.slice(0, 5).join(' | '));
await browser.close();
process.exit(summary() ? 1 : 0);
