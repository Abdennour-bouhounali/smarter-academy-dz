// QA — la FRONTIÈRE DE ROUTES DES LEÇONS et le lot d'entrée (BUNDLE_BOUNDARIES.md §3, 2026-10-14).
//
// Lancement (Vite sur 5173 et l'API sur 8000 en marche) :
//   node apps/web/e2e/lesson-route-boundary.mjs
// Sur le build de PRODUCTION (le découpage réel de Rollup) :
//   VITE_API_URL=http://localhost:8000/api/v1 npx vite build --outDir /tmp/dist-qa   (dans apps/web)
//   npx vite preview --outDir /tmp/dist-qa --port 4173   puis   QA_BASE=http://localhost:4173 node …
//
// Ce que la frontière doit garder exactement comme avant, dans un vrai navigateur :
//   1. « / » (visiteur) ne demande AUCUN fichier de leçon ni les textes des manipulations ;
//   2. un lien PROFOND vers un محور (enseignant : tout est ouvert) monte la leçon — coquille du mode classe,
//      laboratoire rendu, AUCUNE clé `manipulation.*` brute, « بطاقتي » et « كرّاسي » présents ;
//   3. passer du sommaire à un محور par un lien GARDE la coquille du mode classe montée (même nœud DOM) ;
//   4. une URL de محور inconnue retombe sur `*` (comme avant : l'élève est renvoyé vers /espace) ;
//   5. page d'unité (enseignant) : les puces des محاور et les manipulations / méthodes (config chargée à part) ;
//   6. « مذكرة الدرس » se construit (config + contenu chargés à la demande) ;
//   7. aucune erreur console sur tout le parcours.
// Deux connexions API (/auth/login est limité à 6/min). Captures dans /tmp/lesson-route-boundary-qa.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.env.QA_BASE || 'http://localhost:5173';
const API = process.env.QA_API || 'http://localhost:8000/api/v1';
const PASSWORD = process.env.QA_PASSWORD || 'QaPass2026!';
const TEACHER = { email: process.env.QA_TEACHER_EMAIL || 'qa-prof@smarter.dz', password: PASSWORD };
const STUDENT = { email: process.env.QA_STUDENT_EMAIL || 'qa-eleve@smarter.dz', password: PASSWORD };
const OUT = process.env.QA_OUT || '/tmp/lesson-route-boundary-qa';
const CH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab';
const LESSON = `${CH}/qasim-adad-tabii`;
const MODULE1 = `${LESSON}/al-maktaba`; // module 1 — le laboratoire à deux niveaux
const UNIT = `${CH}/units/aadad-tabiiya-natiqa`;
mkdirSync(OUT, { recursive: true });

const failures = [];
const check = (ok, label) => { if (!ok) failures.push(label); console.log(`${ok ? '✓' : '✗'} ${label}`); };

async function loginToken(who) {
  const res = await fetch(`${API}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(who) });
  const data = await res.json().catch(() => ({}));
  const token = data.token ?? data.access_token ?? data.data?.token;
  if (!token) throw new Error(`login ${who.email}: ${res.status}`);
  return token;
}

async function contextFor(browser, token, viewport = { width: 1440, height: 900 }) {
  const ctx = await browser.newContext({ viewport, locale: 'ar' });
  // Les polices Google retiennent « load » hors réseau : réponse vide (un abort loguerait ERR_FAILED en console).
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  if (token) await ctx.addInitScript((tk) => { try { localStorage.setItem('token', tk); } catch { /* noop */ } }, token);
  return ctx;
}

function watch(page) {
  const errors = []; const requests = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('request', (r) => requests.push(r.url()));
  return { errors, requests };
}

/** Ferme la « جولة تعريفية » d'une première visite : sa carte intercepte les clics. */
async function closeTour(page) {
  for (let i = 0; i < 3 && await page.locator('[data-tour-card]').count(); i += 1) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(250);
  }
}

const rawKeys = (page) => page.evaluate(() => (document.body.innerText.match(/\bmanipulation\.[a-zA-Z][\w.]*/g) ?? []).slice(0, 5));

const browser = await chromium.launch();
const teacherToken = await loginToken(TEACHER);
const studentToken = await loginToken(STUDENT);

// ── 1. « / » : aucun contenu de leçon ─────────────────────────────────────
{
  const ctx = await contextFor(browser, null);
  const page = await ctx.newPage();
  const { errors, requests } = watch(page);
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const lessonFiles = requests.filter((u) => /\/src\/lessons\/moyen\/|lesson\.config|\/routes\.jsx|lessonRoutes|buildLessonRoutes|lesson\.manipulation|lessonLoaders/.test(u));
  check(lessonFiles.length === 0, `/ : aucun fichier de leçon demandé (${lessonFiles.slice(0, 3).join(', ') || 'aucun'})`);
  check(errors.length === 0, `/ : aucune erreur console ${errors.slice(0, 2).join(' | ')}`);
  await ctx.close();
}

// ── 2–3. Enseignant : lien profond vers un محور, puis sommaire → محور ─────
{
  const ctx = await contextFor(browser, teacherToken);
  const page = await ctx.newPage();
  const { errors, requests } = watch(page);
  await page.goto(`${BASE}${MODULE1}`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-classroom-scope]', { timeout: 20000 });
  await page.waitForTimeout(800);
  await closeTour(page);
  check(page.url() === `${BASE}${MODULE1}`, `lien profond : l'URL reste celle du محور (${page.url().replace(BASE, '')})`);
  await page.waitForSelector('[data-manipulation-workspace], [data-manipulation]', { timeout: 20000 }).catch(() => {});
  check(await page.locator('[data-manipulation-workspace], [data-manipulation]').count() > 0, 'lien profond : le laboratoire du محور 1 est rendu');
  check(requests.some((u) => /lesson\.manipulation(\.json|-[\w-]+\.js)/.test(u)), 'les textes des manipulations sont chargés AVEC la leçon');
  const keys = await rawKeys(page);
  check(keys.length === 0, `aucune clé manipulation.* brute à l'écran (${keys.join(', ')})`);
  check(await page.locator('[data-km-trigger]').count() > 0, '« بطاقتي » présent');
  check(await page.locator('[data-nb-trigger]').count() > 0, '« كرّاسي » présent');
  await page.screenshot({ path: `${OUT}/teacher-module1.png` });

  // Sommaire → محور par un LIEN : la coquille du mode classe ne se remonte pas.
  await page.goto(`${BASE}${LESSON}`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-classroom-scope]', { timeout: 20000 });
  await page.waitForTimeout(600);
  await closeTour(page);
  await page.evaluate(() => { document.querySelector('[data-classroom-scope]').__qaMarker = 'kept'; });
  const link = page.locator(`a[href$="/al-maktaba"]`).first();
  check(await link.count() > 0, 'le sommaire lie le محور 1');
  if (await link.count()) {
    await link.click();
    await page.waitForURL(`**/al-maktaba`, { timeout: 15000 });
    await page.waitForSelector('[data-manipulation-workspace], [data-manipulation]', { timeout: 20000 }).catch(() => {});
    const kept = await page.evaluate(() => document.querySelector('[data-classroom-scope]')?.__qaMarker ?? null);
    check(kept === 'kept', 'navigation sommaire → محور : la coquille du mode classe reste montée (même nœud)');
  }

  // 5. Page d'unité : puces des محاور et ressources (configs chargées à part).
  await page.goto(`${BASE}${UNIT}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await closeTour(page);
  const chips = await page.locator('[data-lesson-modules="qasim-adad-tabii"] [data-module-chip]').count();
  check(chips === 8, `page d'unité : 8 puces de محاور pour qasim-adad-tabii (${chips})`);
  const resources = await page.locator('[data-unit-lesson="qasim-adad-tabii"] li.bg-violet-100').count();
  check(resources > 0, `page d'unité : manipulations de la leçon affichées (${resources})`);
  await page.screenshot({ path: `${OUT}/teacher-unit.png`, fullPage: true });

  // 6. « مذكرة الدرس ».
  await page.goto(`${BASE}/enseignant/cours/qasim-adad-tabii/memoire`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await closeTour(page);
  check(await page.locator('[data-memo-not-found]').count() === 0, 'مذكرة الدرس : la leçon est trouvée');
  check(await page.locator('[data-lesson-memo="qasim-adad-tabii"] [data-memo-toolbar]').count() === 1, 'مذكرة الدرس : la page est construite');
  await page.screenshot({ path: `${OUT}/teacher-memo.png` });
  check(errors.length === 0, `enseignant : aucune erreur console ${errors.slice(0, 2).join(' | ')}`);
  await ctx.close();
}

// ── 4. Élève : une URL de محور inconnue retombe sur `*` ───────────────────
{
  const ctx = await contextFor(browser, studentToken, { width: 390, height: 844 });
  const page = await ctx.newPage();
  const { errors } = watch(page);
  await page.goto(`${BASE}${LESSON}/mihwar-la-yujad`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForURL((u) => !u.pathname.endsWith('/mihwar-la-yujad'), { timeout: 30000 }).catch(() => {});
  check(!page.url().includes('/mihwar-la-yujad'), `محور inconnu : retombe sur * (→ ${page.url().replace(BASE, '')})`);
  // Et le sommaire, lui, s'ouvre en lien profond sur téléphone.
  await page.goto(`${BASE}${LESSON}`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForSelector('[data-classroom-scope]', { timeout: 30000 });
  await page.waitForTimeout(800);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check(overflow <= 1, `élève 390 px : sommaire sans débordement horizontal (${overflow}px)`);
  check(await page.evaluate(() => document.documentElement.dir) === 'rtl', 'élève : la page est en RTL');
  check(errors.length === 0, `élève : aucune erreur console ${errors.slice(0, 2).join(' | ')}`);
  await page.screenshot({ path: `${OUT}/student-index-phone.png` });
  await ctx.close();
}

await browser.close();
console.log(failures.length ? `\n✗ ${failures.length} échec(s)` : '\nTout est vert.');
process.exit(failures.length ? 1 : 0);
