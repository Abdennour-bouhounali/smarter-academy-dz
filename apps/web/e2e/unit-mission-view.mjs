// QA — la page d'UNITÉ, regard élève (UnitMissionView, propriétaire 2026-11-09 ; conseil : la fenêtre ne défile pas).
//
// Lancement (Vite sur 5173 ; l'API n'est PAS nécessaire — la session est simulée dans la page) :
//   node apps/web/e2e/unit-mission-view.mjs
// À 1366×768, 1024×768 et 1920×1080 : la page de l'unité 1 ne défile pas et s'agrandit à 1920 ; CHAQUE station et chaque pastille ouvre
// une fenêtre qui ne défile pas — repliée ET avec « المزيد » ouvert ; « واصل الدرس » mène à la leçon en cours ; l'enseignant garde l'ancienne
// page (aucun `[data-unit-mission-view]`). Échec = code de sortie 1. Captures dans /tmp/unit-mission-view-qa.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.env.QA_BASE || 'http://localhost:5173';
const OUT = process.env.QA_OUT || '/tmp/unit-mission-view-qa';
const URL = `${BASE}/courses/moyen/4am/ansab_al_aadad_wal_hisab/units/aadad-tabiiya-natiqa`;
mkdirSync(OUT, { recursive: true });

/** la barre latérale de l'application (WorkspaceLayoutContext › SIDEBAR_KEY) */
const SIDEBAR_KEY = 'sidebarCollapsed';
const failures = [];
const check = (ok, label) => { if (!ok) failures.push(label); console.log(`${ok ? '✓' : '✗'} ${label}`); };
const USER = { id: 9001, name: 'تلميذ تجريبي', email: 'eleve@example.com', grade: '4am', level: 'moyen', email_verified_at: '2026-01-01T00:00:00Z', nameComplete: true, firstName: 'تلميذ', lastName: 'تجريبي' };
// trois leçons terminées : la 4e est « درسك الآن »
const ALL = ['00', 0, 1, 2, 3, 4, 5, 6, 7, 8];
const SEED = {
  'u_9001_smarter_lesson_qasim-adad-tabii': { completedModules: ALL, completedExercises: [] },
  'u_9001_smarter_lesson_qawasim-adad-tabii': { completedModules: ALL, completedExercises: [] },
  'u_9001_smarter_lesson_khawass-qawasim': { completedModules: [...ALL, 9], completedExercises: [] },
  'u_9001_smarter_stars_qasim-adad-tabii': { lab: { r1: 3, r2: 3, r3: 3 } },
};

async function open(viewport, role = 'student', collapsed = false) {
  const ctx = await browser.newContext({ viewport, locale: 'ar', reducedMotion: 'reduce' });
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  await ctx.addInitScript(({ user, seed }) => {
    try { localStorage.setItem('token', 'qa-fake-token'); } catch { /* storage blocked */ }
    for (const [k, v] of Object.entries(seed)) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage blocked */ } }
    const real = window.fetch.bind(window);
    window.fetch = async (input, init) => {
      const url = typeof input === 'string' ? input : input.url;
      if (url.includes('/api/')) {
        const ok = (b) => new Response(JSON.stringify(b), { status: 200, headers: { 'Content-Type': 'application/json' } });
        if (url.includes('/auth/me')) return ok({ success: true, user });
        return ok({ success: true, data: [] });
      }
      return real(input, init);
    };
  }, { user: { ...USER, role, roles: [role] }, seed: { ...SEED, [SIDEBAR_KEY]: collapsed } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  return { ctx, page, errors };
}
const dialogFits = (page) => page.evaluate(() => {
  const d = document.querySelector('[data-mission-dialog] [role="dialog"]');
  return d ? d.scrollHeight <= d.clientHeight + 1 : false;
});
const closeDialog = async (page) => { await page.keyboard.press('Escape'); await page.waitForTimeout(150); };

const browser = await chromium.launch();
// the app sidebar OPEN (the default) and collapsed: both must fit
for (const [w, h, collapsed] of [[1366, 768, false], [1024, 768, false], [1024, 768, true], [1920, 1080, false], [1856, 959, true]]) {
  const { ctx, page, errors } = await open({ width: w, height: h }, 'student', collapsed);
  const m = await page.evaluate(() => ({
    view: !!document.querySelector('[data-unit-mission-view]'),
    scroll: document.scrollingElement.scrollHeight - document.scrollingElement.clientHeight,
    cut: (() => { const v = document.querySelector('[data-unit-mission-view]').getBoundingClientRect(); const r = document.querySelector('[data-unit-fit]').getBoundingClientRect(); return Math.round(Math.max(0, v.left - r.left, r.right - v.right)); })(),
    zoom: Number(document.querySelector('[data-unit-fit]')?.style.zoom || 1),
    now: document.querySelector('[data-unit-now]')?.getAttribute('data-unit-now'),
    done: document.querySelector('[data-unit-done]')?.getAttribute('data-unit-done'),
  }));
  check(m.view, `${w}: the student sees the unit mission view`);
  check(m.scroll <= 1, `${w}: the page does not scroll (${m.scroll}px)`);
  check(m.cut <= 1, `${w}: nothing is cut on the sides (${m.cut}px)`);
  check(m.now === 'qasim-mushtarak-akbar' && m.done === '3', `${w}: 3 lessons done, « درسك الآن » is lesson 4 (${m.now}, ${m.done})`);
  if (w === 1920) check(m.zoom > 1.2, `1920: the page grows to fill the screen (×${m.zoom})`);
  await page.screenshot({ path: `${OUT}/unit-${w}${collapsed ? '-collapsed' : ''}.png` });
  const stations = await page.$$eval('[data-unit-station]', (els) => els.map((e) => e.getAttribute('data-unit-station')).filter((x) => x !== 'challenge'));
  check(stations.length === 9, `${w}: 9 stations on the path (${stations.length})`);
  for (const id of stations) {
    await page.click(`[data-unit-station="${id}"]`); await page.waitForTimeout(250);
    const folded = await dialogFits(page);
    await page.click('[data-unit-more]'); await page.waitForTimeout(200);
    const more = await dialogFits(page);
    check(folded && more, `${w}: window « ${id} » does not scroll (folded ${folded}, « المزيد » ${more})`);
    if (w === 1366 && id === 'tayin-pgcd') { await page.click('[data-unit-more]'); await page.waitForTimeout(150); await page.screenshot({ path: `${OUT}/window-${id}.png` }); }
    await closeDialog(page);
  }
  for (const chip of ['goals', 'challenge', 'history', 'review']) {
    await page.click(`[data-unit-chip="${chip}"]`); await page.waitForTimeout(250);
    check(await dialogFits(page), `${w}: window « ${chip} » does not scroll`);
    await closeDialog(page);
  }
  check(errors.length === 0, `${w}: no page error ${errors.slice(0, 2).join(' | ')}`);
  await ctx.close();
}
{
  const { ctx, page } = await open({ width: 1366, height: 768 }, 'teacher');
  const m = await page.evaluate(() => ({ view: !!document.querySelector('[data-unit-mission-view]'), blocks: document.querySelectorAll('[data-unit-lesson]').length }));
  check(!m.view && m.blocks > 0, `teacher: keeps the detailed unit page (${m.blocks} lesson blocks)`);
  await ctx.close();
}
await browser.close();
console.log(failures.length ? `\n${failures.length} failure(s)` : '\nall checks passed');
process.exit(failures.length ? 1 : 0);
