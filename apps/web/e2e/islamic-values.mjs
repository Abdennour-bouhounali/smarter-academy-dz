// QA — la couche « القيم الإسلامية » (features/islamic, ISLAMIC_VALUES.md).
//
// Lancement (Vite sur 5173 en marche ; API SIMULÉE, aucun backend) :
//   node apps/web/e2e/islamic-values.mjs
//
// Élève et enseignant, bureau 1440 et téléphone 390 : la salutation
// (l'accueil élève montre « ٱقْرَأْ » en mise en page مصحف, MushafVerse),
// « السلام عليكم … 🌿 » (et plus « أهلًا »), UNE seule carte de rappel par
// page, en RTL, sans débordement horizontal, sur l'accueil élève, l'accueil
// enseignant et le sommaire d'une leçon (élève : lesson_start ; enseignant :
// teacher_start). Le texte coranique porte sa référence, un ḥadīth son recueil
// et son degré. Aucune erreur console. Captures dans /tmp/islamic-values-qa.
//
// L'API est simulée avec l'enveloppe RÉELLE ({ success, user } pour /auth/me) :
// sans elle tout redirige vers /login et le scan passerait faussement au vert —
// d'où le contrôle de l'URL finale.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.env.QA_BASE || 'http://localhost:5173';
const OUT = process.env.QA_OUT || '/tmp/islamic-values-qa';
mkdirSync(OUT, { recursive: true });
const LESSON = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/jidhr-tarbii';

const failures = [];
const check = (ok, label) => { if (!ok) failures.push(label); console.log(`${ok ? '✓' : '✗'} ${label}`); };

const USERS = {
  student: { id: 9001, role: 'student', firstName: 'عمر', lastName: 'بن علي', email: 'qa@example.dz', grade: '4am', emailVerified: true, emailVerifiedAt: '2026-01-01' },
  teacher: { id: 9002, role: 'teacher', firstName: 'أمينة', lastName: 'سعدي', email: 'qa-prof@example.dz', emailVerified: true, emailVerifiedAt: '2026-01-01' },
};
const DASHBOARD = {
  entitlements: {
    plan: null, request: null,
    students: { current: 0, maximum: 30, overLimit: false },
    classes: { current: 0, maximum: null, overLimit: false, canCreate: true },
  },
  classrooms: [],
};

async function stub(ctx, role) {
  await ctx.addInitScript(() => localStorage.setItem('token', 'qa-fake-token'));
  await ctx.route(/\/api\/v1\//, (route) => {
    const url = route.request().url();
    let body = { success: true, data: [] };
    if (url.includes('/auth/me')) body = { success: true, user: USERS[role] };
    else if (url.includes('/teacher/dashboard')) body = { success: true, dashboard: DASHBOARD };
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
  });
}

const PAGES = [
  { role: 'student', path: '/espace', name: 'student-home', expect: 'mushaf' },
  { role: 'student', path: LESSON, name: 'student-lesson', expect: 'card' },
  { role: 'teacher', path: '/enseignant', name: 'teacher-home', expect: 'card' },
  { role: 'teacher', path: LESSON, name: 'teacher-lesson', expect: 'card' },
];

const browser = await chromium.launch();
for (const [vpName, viewport] of [['desktop', { width: 1440, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
  for (const p of PAGES) {
    const ctx = await browser.newContext({ viewport, locale: 'ar' });
    await stub(ctx, p.role);
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error' && !/fonts\.g|Failed to load resource/.test(m.text())) errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(String(e)));
    const tag = `${vpName} ${p.name}`;
    await page.goto(`${BASE}${p.path}`, { waitUntil: 'domcontentloaded' });
    const card = await page.waitForSelector('[data-islamic-card], [data-islamic-break], [data-mushaf-verse]', { timeout: 20000 }).catch(() => null);
    check(!page.url().includes('/login'), `${tag}: page rendue (pas de renvoi vers /login — ${page.url().replace(BASE, '')})`);
    check(Boolean(card), `${tag}: un rappel est affiché`);
    if (card) {
      const m = await page.evaluate(() => {
        const cards = document.querySelectorAll('[data-islamic-card], [data-islamic-break], [data-mushaf-verse]');
        const c = cards[0];
        const r = c.getBoundingClientRect();
        const kind = c.dataset.mushafVerse ? 'quran' : c.querySelector('[data-islamic-kind]')?.dataset.islamicKind;
        return {
          count: cards.length,
          variant: c.dataset.mushafVerse ? 'mushaf' : (c.dataset.islamicCard ?? 'break'),
          dir: getComputedStyle(c).direction,
          kind,
          ref: c.querySelector('[data-islamic-reference]')?.textContent ?? '',
          grade: c.querySelector('[data-islamic-grade]')?.textContent ?? '',
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          inside: r.left >= -1 && r.right <= window.innerWidth + 1,
          greeting: document.querySelector('[data-islamic-greeting]')?.textContent ?? document.querySelector('h1')?.textContent ?? '',
          ahlan: document.body.innerText.includes('أهلًا'),
        };
      });
      check(m.count === 1, `${tag}: une seule carte (${m.count})`);
      check(m.variant === p.expect, `${tag}: forme ${p.expect} (${m.variant})`);
      check(m.dir === 'rtl', `${tag}: RTL`);
      check(m.overflow <= 1 && m.inside, `${tag}: aucun débordement (${m.overflow}px)`);
      if (m.kind === 'quran') check(/سورة .+الآي/.test(m.ref), `${tag}: verset référencé (${m.ref})`);
      if (m.kind === 'hadith') check(/\(\d+\)/.test(m.ref) && m.grade.includes('درجة الحديث'), `${tag}: ḥadīth avec recueil et degré (${m.ref.trim()})`);
      if (p.path !== LESSON) check(m.greeting.includes('السلام عليكم') && !m.ahlan, `${tag}: « ${m.greeting.trim()} »`);
    }
    check(errors.length === 0, `${tag}: aucune erreur console${errors.length ? ` — ${errors[0]}` : ''}`);
    await page.screenshot({ path: `${OUT}/${vpName}-${p.name}.png`, fullPage: false });
    await ctx.close();
  }
}

await browser.close();
console.log(failures.length ? `\n${failures.length} échec(s)` : '\nTout est vert.');
process.exit(failures.length ? 1 : 0);
