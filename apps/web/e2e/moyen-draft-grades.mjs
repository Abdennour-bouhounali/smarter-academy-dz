/**
 * QA navigateur — les années 1AM–3AM « قيد الإعداد » et le « راجع » après une erreur
 * (déploiement du cycle moyen, phase 2, 2026-10-14 ; docs/architecture/LEARNING_NET.md §3–§3bis).
 *
 * Lancement (dev server 5173, API 8000, élève QA local, base importée) :
 *   node apps/web/e2e/moyen-draft-grades.mjs [dossier-captures]
 *
 * Vérifie, sur bureau (1440) et téléphone (320) : le catalogue 1AM annonce « البرنامج متوفّر، الدروس
 * قيد الإعداد » et ses cartes d'unité « قيد الإعداد » ; la page d'unité montre les leçons en brouillon sans
 * aucun lien vers une leçon non écrite ; les prérequis d'une autre année (3AM) disent leur année sans
 * lien ; 4AM est inchangée ; aucun débordement, aucune erreur console. Puis, en pratique 4AM
 * (jidhr-tarbii), une réponse fausse affiche « راجع: … (السنة الثالثة متوسط) », en texte tant que la
 * leçon 3AM n'est pas publiée. Une seule connexion (throttle 6/min), puis storageState.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const BASE = process.env.QA_BASE || 'http://localhost:5173';
const OUT = process.argv[2] || '/tmp/moyen-draft-grades';
mkdirSync(OUT, { recursive: true });
import { randomUUID } from 'node:crypto';
const API = process.env.QA_API || 'http://localhost:8000/api/v1';
const browser = await chromium.launch();
// Une seule connexion (throttle 6/min), puis storageState pour chaque contexte.
let authState;
{
  const c = await browser.newContext();
  const p = await c.newPage();
  await p.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
  await p.fill('input[type="email"]', 'qa-eleve@smarter.dz');
  await p.fill('input[type="password"]', 'QaPass2026!');
  await p.click('button[type="submit"]');
  await p.waitForURL(/\/espace/, { timeout: 20000 });
  authState = await c.storageState();
  await c.close();
}
const token = (() => {
  for (const o of authState.origins) for (const { name, value } of o.localStorage) {
    if (/token/i.test(name)) { try { const v = JSON.parse(value); return typeof v === 'string' ? v : v?.token ?? value; } catch { return value; } }
  }
  return null;
})();
const fails = [];
const check = (ok, label) => { if (!ok) fails.push(label); console.log(`${ok ? '✓' : '✗'} ${label}`); };
for (const [vp, viewport] of [['desktop', { width: 1440, height: 900 }], ['phone', { width: 320, height: 760 }]]) {
  const ctx = await browser.newContext({ viewport, storageState: authState });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`${BASE}/courses?level=moyen&grade=1am`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  check(await page.locator('[data-grade-drafting]').count() === 1, `${vp}: 1AM catalogue says « البرنامج متوفّر، الدروس قيد الإعداد »`);
  const drafts = await page.locator('[data-unit-draft]').count();
  check(drafts > 0, `${vp}: 1AM unit cards show « قيد الإعداد » (${drafts})`);
  const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check(ov <= 1, `${vp}: catalogue — no horizontal overflow (${ov}px)`);
  await page.screenshot({ path: `${OUT}/${vp}-courses-1am.png`, fullPage: false });
  await page.locator('[data-unit-group]').first().click();
  await page.waitForTimeout(1200);
  check(/\/units\//.test(page.url()), `${vp}: unit card opens the unit page (${page.url().replace(BASE, '')})`);
  const draftLessons = await page.locator('[data-lesson-draft]').count();
  check(draftLessons > 0, `${vp}: unit page shows draft lessons (${draftLessons})`);
  check(await page.locator('[data-unit-lesson] a[href*="/courses/moyen/1am/"]').count() === 0, `${vp}: no link to an unwritten 1AM lesson`);
  const ov2 = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check(ov2 <= 1, `${vp}: unit page — no horizontal overflow (${ov2}px)`);
  await page.screenshot({ path: `${OUT}/${vp}-unit-1am.png`, fullPage: false });
  // A 3AM lesson whose prerequisites come from 1AM/2AM: chips name the year, no link.
  await page.goto(`${BASE}/courses/moyen/3am/ansab_al_aadad_wal_hisab/units/kusur-natiqa`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const chips = await page.locator('[data-prerequisite-status="coming_soon"]').count();
  check(chips > 0, `${vp}: 3AM unit page — prerequisite chips of unpublished lessons (${chips}), none a link: ${await page.locator('[data-prerequisite-status="coming_soon"] a').count() === 0}`);
  await page.screenshot({ path: `${OUT}/${vp}-unit-3am.png`, fullPage: true });
  await page.goto(`${BASE}/courses?level=moyen&grade=4am`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  check(await page.locator('[data-grade-drafting]').count() === 0, `${vp}: 4AM catalogue unchanged (no drafting notice)`);
  check(errors.length === 0, `${vp}: no console error${errors.length ? ` — ${errors[0]}` : ''}`);
  // « راجع » after a wrong answer — a 4AM practice question whose lesson builds on 3AM.
  if (vp === 'desktop') {
    const sessionId = randomUUID();
    const res = await fetch(`${API}/lessons/jidhr-tarbii/practice/sessions`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ sessionId, level: 1 }) });
    check(res.status < 300, `practice session opened (${res.status})`);
    await page.goto(`${BASE}/espace/pratique/jidhr-tarbii/session/${sessionId}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    const start = page.locator('[data-step-start]');
    if (await start.count()) { await page.waitForSelector('[data-step-start]:not([disabled])', { timeout: 15000 }); await start.click(); await page.waitForTimeout(700); }
    const field = page.locator('[data-exam-step="current"] math-field, math-field').first();
    if (await field.count()) {
      await field.evaluate((e) => e.scrollIntoView({ block: 'center' }));
      await page.waitForTimeout(150);
      const bb = await field.boundingBox();
      await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2);
      await page.waitForTimeout(200);
      await page.keyboard.type('999');
      await page.waitForTimeout(250);
      await page.getByRole('button', { name: /تحقّق|تحقق/ }).first().click();
      await page.waitForTimeout(2500);
      const review = page.locator('[data-earlier-year-review]');
      check(await review.count() === 1, `practice: wrong answer shows « راجع » (${(await review.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 140)})`);
      check(await page.locator('[data-earlier-year-linked="true"]').count() === 0, 'practice: unpublished 3AM targets are text, not links');
      await page.screenshot({ path: `${OUT}/${vp}-practice-wrong.png`, fullPage: false });
    } else {
      check(false, 'practice: no answer field found');
      await page.screenshot({ path: `${OUT}/${vp}-practice-nofield.png`, fullPage: false });
    }
  }
  await ctx.close();
}
await browser.close();
console.log(fails.length ? `\n✗ ${fails.length} failure(s)` : '\n✓ all checks passed');
process.exit(fails.length ? 1 : 0);
