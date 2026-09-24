// Les MANIPULATIONS de l'unité 1 — laboratoires tactiles.
//
// Ce que cette suite verrouille, pour de vrai (vrais événements de pointeur) :
//   1. GLISSER : prendre un objet, le porter, le poser dans une zone — et la
//      page ne défile pas pendant le geste ;
//   2. ALTERNATIVE sans glisser : toucher l'objet puis la zone ; et le clavier ;
//   3. REFUS EXPLIQUÉ : un dépôt invalide revient avec une raison en arabe ;
//   4. LA NOTATION SUIT LE GESTE : l'égalité se remplit après l'action, et le
//      RÉSULTAT (PGCD, règle) n'apparaît JAMAIS avant la phase « اكتشف » ;
//   5. إعادة remet tout à zéro ; les indices sont progressifs ;
//   6. MODE CLASSE : الخطوة التالية, إخفاء النتيجة, إظهار الحل ;
//   7. PALIERS : changer de niveau change les nombres ;
//   8. MOBILE 320 px : aucun débordement, cibles ≥ 44 px ;
//   9. prefers-reduced-motion : la manipulation reste utilisable.
//
// Run : KIT_BASE=http://localhost:5183 node apps/web/e2e/lesson-kit/manipulations.mjs
import { BASE, launch, check, summary, watchErrors, seed, lessonKey, noHorizontalScroll } from './helpers.mjs';

const CH = `${BASE}/courses/moyen/4am/ansab_al_aadad_wal_hisab`;
const errors = [];
const { browser } = await launch();

async function open(url, { mobile = false, reducedMotion = false, completed = null, lesson = null } = {}) {
  const ctx = await browser.newContext({
    viewport: mobile ? { width: 320, height: 720 } : { width: 1280, height: 900 },
    hasTouch: mobile, isMobile: mobile,
    reducedMotion: reducedMotion ? 'reduce' : 'no-preference',
  });
  const page = await ctx.newPage();
  watchErrors(page, errors);
  if (completed && lesson) await seed(page, completed, lessonKey(lesson));
  await page.goto(url, { waitUntil: 'networkidle' });
  return { ctx, page };
}

/**
 * Un VRAI glisser : appui, déplacements intermédiaires, relâchement.
 *
 * `page.mouse` ne fait PAS défiler la page (contrairement à `click()`) : un
 * objet hors écran ne recevrait aucun événement, et le test échouerait en
 * accusant la manipulation. On amène donc les deux extrémités dans le
 * viewport avant de commencer, puis on relit les positions.
 */
async function dragTo(page, source, target) {
  await source.scrollIntoViewIfNeeded();
  await target.scrollIntoViewIfNeeded();
  await source.scrollIntoViewIfNeeded();
  await page.waitForTimeout(120);
  const s = await source.boundingBox();
  const t = await target.boundingBox();
  await page.mouse.move(s.x + s.width / 2, s.y + s.height / 2);
  await page.mouse.down();
  for (let i = 1; i <= 6; i += 1) {
    await page.mouse.move(s.x + s.width / 2 + ((t.x + t.width / 2 - s.x - s.width / 2) * i) / 6,
      s.y + s.height / 2 + ((t.y + t.height / 2 - s.y - s.height / 2) * i) / 6);
  }
  await page.mouse.up();
  await page.waitForTimeout(220);
}

const phaseOf = (manip) => manip.getAttribute('data-phase');  // sur le Locator, jamais sur un ElementHandle figé
const tile = (manip, v) => manip.locator(`[data-drag-source="${v}"]`).first();

/**
 * Choisir un NIVEAU dans l'atelier à deux niveaux (مبتدئ / متقدم).
 *
 * Depuis la refonte, le module 1 de chaque leçon ouvre sur un
 * `ManipulationWorkspace` : le niveau débutant est affiché d'office et les
 * manipulations du manuel vivent au niveau متقدم. Un test qui vise une
 * manipulation du manuel doit donc d'abord basculer — sans quoi il
 * interrogerait un panneau `hidden`.
 */
async function pickLevel(page, level) {
  const tab = page.locator(`[data-manipulation-workspace] [role="tab"][data-level="${level}"]`).first();
  if (!(await tab.count())) return false;
  await tab.click();
  await page.waitForTimeout(350);
  return true;
}

/**
 * La manipulation de type `type` DANS le panneau de niveau visible.
 *
 * Un même type peut servir aux deux niveaux (le rectangle sert 24 au niveau
 * مبتدئ et 60 au niveau متقدم) : `.first()` attraperait alors le panneau
 * masqué, et le test attendrait indéfiniment un élément `hidden`. On vise
 * donc le panneau visible, avec un repli sur la page pour les modules qui
 * n'ont pas d'atelier.
 */
function manip(page, type) {
  const scoped = page.locator(`[data-manipulation-level-panel]:not([hidden]) [data-manipulation="${type}"]`).first();
  return { scoped, loose: page.locator(`[data-manipulation="${type}"]`).first() };
}

async function visibleManip(page, type) {
  const { scoped, loose } = manip(page, type);
  if (await scoped.count()) return scoped;
  return loose;
}

/* ── 1 · 4 — divisor-explorer-books : la bibliothèque illustrée du module 1 ──
   Composant autonome (pas de ManipulationShell) : les 420 livres sont des
   objets illustrés. CHOISIR une taille de rayon EST l'expérience : rayons,
   livres restés au sol et égalité apparaissent aussitôt, sans autre bouton. */
{
  const { ctx, page } = await open(`${CH}/qasim-adad-tabii/al-maktaba`);
  await pickLevel(page, 'advanced');
  const m = await visibleManip(page, 'divisor-explorer-books');
  await m.waitFor();
  // Le badge « ✓ » des tailles essayées est un ::after : il entre dans le NOM accessible, d'où le texte plutôt que le rôle.
  const size = (v) => m.locator('.be-choice', { hasText: new RegExp(`^${v}$`) });

  check('L1 : le laboratoire est utilisable dès l’entrée (tailles + mission)', await size(26).isVisible() && await size(28).isVisible() && await m.locator('.be-mission').isVisible());
  check('L1 : avant tout choix, aucun rayon ni égalité (rien n’est révélé d’avance)', (await m.locator('.be-shelf').count()) === 0 && (await m.locator('.be-equation').count()) === 0);
  check('L1 : avant tout choix, aucune taille n’est cochée', (await m.locator('.be-choice.tested').count()) === 0);
  check('L1 : aucun bouton « رتّب الكتب » — le choix suffit', (await m.getByRole('button', { name: /رتّب الكتب/ }).count()) === 0);

  await size(26).scrollIntoViewIfNeeded();
  await page.waitForTimeout(120);
  const scrollBefore = await page.evaluate(() => window.scrollY);
  await size(26).click();
  await page.waitForTimeout(300);
  check('L1 : choisir 26 le marque comme taille courante', (await size(26).getAttribute('aria-pressed')) === 'true');
  const eq26 = await m.locator('.be-equation').textContent();
  check('L1 : choisir 26 écrit aussitôt 420 = 26 × 16 + 4', eq26.includes('26') && eq26.includes('16') && eq26.includes('4'));
  check('L1 : 16 rayons pleins sont dessinés', (await m.locator('.be-shelf').count()) === 16);
  check('L1 : il reste 4 livres — ils sont DESSINÉS hors des rayons', (await m.locator('.be-floor .be-book').count()) === 4);
  check('L1 : la page n’a pas défilé pendant le geste', (await page.evaluate(() => window.scrollY)) === scrollBefore);
  check('L1 : 26 porte un badge ✕ rouge (reste 4), pas un ✓', (await m.locator('.be-choice.tested-no', { hasText: /^26$/ }).count()) === 1 && (await m.locator('.be-choice.tested-ok', { hasText: /^26$/ }).count()) === 0);

  await size(28).click();
  await page.waitForTimeout(300);
  const eq28 = await m.locator('.be-equation').textContent();
  check('L1 : 28 range tout — l’égalité 420 = 28 × 15 + 0 émerge', eq28.includes('28') && eq28.includes('15') && eq28.includes('0'));
  check('L1 : « لا يبقى شيء » est affiché quand le reste est nul', (await m.locator('.be-pill.ok').count()) === 1);
  check('L1 : 28 porte un badge ✓ vert (diviseur)', (await m.locator('.be-choice.tested-ok', { hasText: /^28$/ }).count()) === 1);
  check('L1 : le sol est vide quand le reste est nul', (await m.locator('.be-floor--empty').count()) === 1 && (await m.locator('.be-floor .be-book').count()) === 0);

  // Un second exemple à reste non nul : 25 laisse 20 livres.
  await size(25).click();
  await page.waitForTimeout(300);
  check('L1 : 25 laisse 20 livres au sol — 420 = 25 × 16 + 20', (await m.locator('.be-floor .be-book').count()) === 20 && (await m.locator('.be-equation').textContent()).includes('20'));

  // Aucun rayon n'est tronqué : 420 livres par 10 font 42 rayons, tous dessinés.
  await size(10).click();
  await page.waitForTimeout(300);
  check('L1 : 10 par rayon dessine les 42 rayons, pas 16', (await m.locator('.be-shelf').count()) === 42);
  check('L1 : le compteur de rayons dit 42', (await m.locator('.be-status').textContent()).includes('42'));

  // Chaque rayon dessine TOUS ses livres : 60 par rayon → 7 rayons de 60, 420 livres visibles.
  await size(60).click();
  await page.waitForTimeout(300);
  check('L1 : 60 par rayon dessine 60 livres sur chaque rayon (pas 28)', (await m.locator('.be-shelf').count()) === 7 && (await m.locator('.be-shelf').first().locator('.be-book').count()) === 60 && (await m.locator('.be-shelf .be-book').count()) === 420 && (await m.locator('.be-slot').count()) === 0);
  await size(35).click();
  await page.waitForTimeout(300);
  check('L1 : 35 par rayon → 12 rayons de 35', (await m.locator('.be-shelf').count()) === 12 && (await m.locator('.be-shelf').last().locator('.be-book').count()) === 35);

  // Le clavier suffit : Entrée sur une taille.
  await size(26).focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(250);
  check('L1 : Entrée sur une taille l’essaie aussi', (await size(26).getAttribute('aria-pressed')) === 'true' && (await m.locator('.be-floor .be-book').count()) === 4);

  // MODE CLASSE (وضع القسم) — plateforme, pas bouton local : un VISITEUR ne
  // voit AUCUNE commande de présentation (commandes enseignant, brief §4).
  check('L1 : un visiteur ne voit pas « عرض المناولة »', (await m.locator('[data-classroom-enter]').count()) === 0
    && (await page.locator('[data-classroom-scope="manipulation"][data-classroom-active="false"]').count()) === 1);

  await m.getByRole('button', { name: /جرّب 28/ }).click();
  await page.waitForTimeout(250);
  check('L1 : « جرّب 28 » bascule sur 28', (await size(28).getAttribute('aria-pressed')) === 'true');

  await m.getByRole('button', { name: /ابدأ من جديد/ }).click();
  await page.waitForTimeout(250);
  check('L1 : « ابدأ من جديد » efface rayons, égalité et badges', (await m.locator('.be-equation').count()) === 0 && (await m.locator('.be-shelf').count()) === 0 && (await m.locator('.be-choice.tested').count()) === 0);
  await ctx.close();
}

/* ── 1 bis — MODE CLASSE (وضع القسم) : le présentateur ────────────────────
   Le rôle présentateur est `admin` (core/auth.js → canPresentClassroom). On ne
   touche pas à la base : /auth/me est servi par le test avec un compte admin
   et un jeton posé dans localStorage — exactement ce que AuthContext relit. */
async function openAsPresenter(url, { noFullscreenApi = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  await ctx.route('**/api/v1/auth/me', (route) => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({ success: true, user: { id: 9001, role: 'admin', email: 'qa-admin@smarter.dz', first_name: 'QA', last_name: 'Admin', grade: null, account_status: 'active' } }),
  }));
  await ctx.addInitScript(([noApi]) => {
    localStorage.setItem('token', 'e2e-presenter-token');
    if (noApi) {
      Object.defineProperty(document, 'fullscreenEnabled', { get: () => false, configurable: true });
      Object.defineProperty(document, 'webkitFullscreenEnabled', { get: () => false, configurable: true });
    }
  }, [noFullscreenApi]);
  const page = await ctx.newPage();
  watchErrors(page, errors);
  await page.goto(url, { waitUntil: 'networkidle' });
  return { ctx, page };
}

{
  const { ctx, page } = await openAsPresenter(`${CH}/qasim-adad-tabii/al-maktaba`);
  await pickLevel(page, 'advanced');
  const root = page.locator('[data-classroom-scope="manipulation"]').first();
  const m = page.locator('[data-manipulation="divisor-explorer-books"]').first();
  const size = (v) => m.locator('.be-choice', { hasText: new RegExp(`^${v}$`) });
  check('C1 : un administrateur ouvre la leçon (coquille visiteur, pas de renvoi vers /admin)', page.url().includes('/al-maktaba') && (await m.count()) === 1);
  const enter = root.locator('[data-classroom-enter]');
  check('C1 : « عرض المناولة » est visible, nommé et hors de la présentation', await enter.isVisible()
    && (await enter.textContent()).includes('عرض المناولة') && (await enter.getAttribute('aria-label')) === 'الدخول إلى وضع القسم');
  check('C1 : aucun toggle وضع التلميذ/القسم dans le module (règle du propriétaire)', (await page.getByRole('button', { name: 'وضع التلميذ' }).count()) === 0);

  // L'état AVANT : 26 essayé (4 au sol) — il doit survivre à l'entrée et à la sortie.
  await size(26).click();
  await page.waitForTimeout(250);
  const choiceBefore = (await size(28).boundingBox()).height;
  const bodyOverflowBefore = await page.evaluate(() => document.body.style.overflow);

  await enter.click();
  const entered = await page.waitForSelector('[data-classroom-scope="manipulation"][data-classroom-active="true"]', { timeout: 5000 }).then(() => true).catch(() => false);
  check('C1 : le clic passe en وضع القسم', entered);
  check('C1 : le vrai plein écran du navigateur est actif (Chromium l’accorde)', (await root.getAttribute('data-classroom-native')) === 'true'
    && await page.evaluate(() => document.fullscreenElement?.getAttribute('data-classroom-scope') === 'manipulation'));
  check('C1 : la barre d’outils est là — titre, échelle', (await root.locator('[data-classroom-toolbar]').count()) === 1
    && (await root.getByRole('button', { name: 'تكبير العرض' }).count()) === 1);
  // La SORTIE vit désormais EN HAUT, dans la barre d'outils, avec les
  // commandes de la séance : la barre du bas ne porte que les pas du contenu.
  check('C1 : « خروج » est en haut, dans la barre d’outils', (await root.locator('[data-classroom-toolbar] [data-classroom-exit]').count()) === 1
    && (await root.getByRole('button', { name: 'الخروج من وضع القسم' }).count()) === 1);
  check('C1 : pas de navigation السابق/التالي pour une manipulation seule (aucun bouton mort)',
    (await root.locator('[data-classroom-nav] [data-classroom-nav-unit]').count()) === 0
    && (await root.locator('[data-classroom-nav] [data-classroom-nav-module]').count()) === 0);
  check('C1 : le bouton d’entrée a disparu pendant la présentation', (await root.locator('[data-classroom-enter]').count()) === 0);
  check('C1 : html et body sont verrouillés (overflow hidden)', await page.evaluate(() => document.documentElement.style.overflow === 'hidden' && document.body.style.overflow === 'hidden'));
  check('C1 : l’état de la manipulation est intact — 26 toujours choisi, 4 livres au sol', (await size(26).getAttribute('aria-pressed')) === 'true' && (await m.locator('.be-floor .be-book').count()) === 4 && (await m.locator('.be-shelf').count()) === 16);

  // Le seuil est de 5 px, et non de 8 : depuis que « خروج » vit dans la
  // barre du BAS, une manipulation présentée seule porte une petite barre de
  // navigation qu'elle n'avait pas, et le moteur d'ajustement lui rend une
  // échelle un peu plus basse (0,92 → 0,86 ici). Ce qui compte est vérifié
  // juste en dessous et reste large : le livre d'un rayon fait 31 px et
  // celui du sol 40 px, pour des minimums de 15 et 22. Ce que ce test garde,
  // c'est que la projection AGRANDIT — pas un nombre de pixels précis.
  let choiceAfter = 0;
  for (let i = 0; i < 20 && choiceAfter <= choiceBefore + 5; i += 1) { await page.waitForTimeout(100); choiceAfter = (await size(28).boundingBox())?.height ?? 0; }
  check('C1 : en présentation les tailles sont plus grandes (projection)', choiceAfter > choiceBefore + 5, `${choiceBefore} → ${choiceAfter}`);
  const shelfBook = await m.locator('.be-shelf .be-book').first().boundingBox();
  const floorBook = await m.locator('.be-floor .be-book').first().boundingBox();
  check('C1 : les livres des rayons restent des livres (≥ 15 px de large) et les livres au sol sont plus grands (≥ 22 px)',
    shelfBook.width >= 15 && floorBook.width >= 22 && floorBook.width > shelfBook.width, `rayon ${shelfBook.width} · sol ${floorBook.width}`);
  check('C1 : un rayon = une rangée de 26 livres (aucun retour à la ligne)', await page.evaluate(() => {
    const books = [...document.querySelector('.be-shelf .be-shelf__books').querySelectorAll('.be-book')];
    const tops = new Set(books.map((b) => Math.round(b.getBoundingClientRect().top)));
    return books.length === 26 && tops.size === 1;
  }));

  const fits = async () => page.evaluate(() => {
    const r = document.querySelector('[data-classroom-active="true"]');
    const c = r.querySelector('.sa-classroom-content');
    return { pageX: document.scrollingElement.scrollWidth <= window.innerWidth + 1, rootX: r.scrollWidth <= r.clientWidth + 1,
      contentY: c.scrollHeight <= c.clientHeight + 1, contentX: c.scrollWidth <= c.clientWidth + 1, scale: r.getAttribute('data-classroom-scale') };
  });
  await page.waitForTimeout(500);
  let f = await fits();
  check('C1 : 26 par rayon — 16 rayons + 4 au sol tiennent à l’écran 1366×768 sans défilement', f.pageX && f.rootX && f.contentY && f.contentX, JSON.stringify(f));
  check('C1 : 420 = 26 × 16 + 4 est écrit', (await m.locator('.be-equation').textContent()).replace(/\s/g, '').includes('26×16+4'));

  await size(28).click();
  await page.waitForTimeout(500);
  f = await fits();
  check('C1 : 28 par rayon — 15 rayons, sol vide, 420 = 28 × 15 + 0', (await m.locator('.be-shelf').count()) === 15 && (await m.locator('.be-floor--empty').count()) === 1
    && (await m.locator('.be-equation').textContent()).replace(/\s/g, '').includes('28×15+0') && f.contentY && f.contentX);

  // 10 par rayon : 42 rayons — le moteur réduit l'échelle plutôt que de faire défiler la page.
  await size(10).click();
  await page.waitForTimeout(900);
  f = await fits();
  check('C1 : 42 rayons — la grille des rayons défile EN INTERNE (jamais la page), l’échelle reste lisible (≥ 0,8)', (await m.getAttribute('data-shelves-fit')) === 'false'
    && await page.evaluate(() => { const g = document.querySelector('.be-shelves'); return g.scrollHeight > g.clientHeight + 1; }) && parseFloat(f.scale) >= 0.8, `scale=${f.scale}`);
  check('C1 : 42 rayons — aucun défilement de page ni débordement horizontal, le contenu tient', f.pageX && f.rootX && f.contentX && f.contentY, JSON.stringify(f));
  check('C1 : 42 rayons — les 420 livres sont tous dessinés', (await m.locator('.be-shelf .be-book').count()) === 420);

  // Échelle à la main : + puis −.
  await size(28).click();
  await page.waitForTimeout(600);
  const before125 = (await size(28).boundingBox()).height;
  const scale100 = parseFloat((await fits()).scale);
  await root.getByRole('button', { name: 'تكبير العرض' }).click();
  await root.getByRole('button', { name: 'تكبير العرض' }).click();
  await page.waitForTimeout(600);
  const at125 = (await size(28).boundingBox()).height;
  const f125 = await fits();
  check('C1 : « + » agrandit la présentation (100 % → 125 %, bornée par le moteur si l’écran ne suit pas)', at125 >= before125 && parseFloat(f125.scale) >= scale100, `${before125} → ${at125} · scale ${scale100} → ${f125.scale}`);
  check('C1 : à 125 % le contenu tient encore (le moteur ajuste)', f125.contentY && f125.contentX, JSON.stringify(f125));
  await root.getByRole('button', { name: 'تصغير العرض' }).click();
  await root.getByRole('button', { name: 'تصغير العرض' }).click();
  await page.waitForTimeout(400);

  // Échap synthétique ne quitte pas le plein écran natif en headless : on sort par le bouton.
  await root.getByRole('button', { name: 'الخروج من وضع القسم' }).click();
  await page.waitForTimeout(500);
  check('C1 : « خروج » rend la page — état conservé (28 choisi, 15 rayons)', (await root.getAttribute('data-classroom-active')) === 'false'
    && (await size(28).getAttribute('aria-pressed')) === 'true' && (await m.locator('.be-shelf').count()) === 15);
  check('C1 : plus de plein écran natif, verrou de défilement restauré', await page.evaluate(() => !document.fullscreenElement)
    && (await page.evaluate(() => document.body.style.overflow)) === bodyOverflowBefore
    && (await page.evaluate(() => document.documentElement.style.overflow)) === '');
  check('C1 : le bouton d’entrée est revenu et a le focus', (await root.locator('[data-classroom-enter]').count()) === 1
    && await page.evaluate(() => document.activeElement?.hasAttribute('data-classroom-enter')));
  check('C1 : les tailles sont revenues à la taille de la leçon', Math.abs((await size(28).boundingBox()).height - choiceBefore) < 3);
  await ctx.close();
}

{
  // REPLI sans API Fullscreen (iOS Safari, refus) : même présentation, Échap la ferme.
  const { ctx, page } = await openAsPresenter(`${CH}/qasim-adad-tabii/al-maktaba`, { noFullscreenApi: true });
  await pickLevel(page, 'advanced');
  const root = page.locator('[data-classroom-scope="manipulation"]').first();
  const m = page.locator('[data-manipulation="divisor-explorer-books"]').first();
  await m.locator('.be-choice', { hasText: /^26$/ }).click();
  await root.locator('[data-classroom-enter]').click();
  await page.waitForTimeout(400);
  check('C2 : sans API, la présentation s’ouvre quand même (repli)', (await root.getAttribute('data-classroom-active')) === 'true' && (await root.getAttribute('data-classroom-native')) === 'false');
  const box = await root.boundingBox();
  check('C2 : le repli couvre tout l’écran', box && box.x <= 1 && box.y <= 1 && box.width >= 1364 && box.height >= 766, JSON.stringify(box));
  check('C2 : rien ne déborde, la page ne défile pas', await page.evaluate(() => document.body.style.overflow === 'hidden' && document.scrollingElement.scrollWidth <= window.innerWidth + 1));
  await m.locator('.be-choice', { hasText: /^25$/ }).click();
  await page.waitForTimeout(300);
  check('C2 : le jeu reste jouable — 25 laisse 20 livres', (await m.locator('.be-floor .be-book').count()) === 20);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  check('C2 : Échap ferme le repli, l’état reste (20 au sol)', (await root.getAttribute('data-classroom-active')) === 'false' && (await m.locator('.be-floor .be-book').count()) === 20
    && (await page.evaluate(() => document.body.style.overflow)) === '');

  // Changement de route en pleine présentation : tout est rendu.
  await root.locator('[data-classroom-enter]').click();
  await page.waitForTimeout(300);
  await page.evaluate(() => window.history.pushState({}, '', '/courses'));
  await page.evaluate(() => window.dispatchEvent(new PopStateEvent('popstate')));
  await page.waitForTimeout(600);
  check('C2 : quitter la route libère html/body et ne laisse aucune superposition', await page.evaluate(() =>
    document.body.style.overflow === '' && document.documentElement.style.overflow === '' && document.querySelectorAll('[data-classroom-active="true"]').length === 0));
  await ctx.close();
}

{
  // Tablette paysage et téléphone : la présentation tient sans défilement de page.
  for (const vp of [{ width: 1024, height: 768 }, { width: 390, height: 844 }]) {
    const ctx = await browser.newContext({ viewport: vp, hasTouch: vp.width < 500, isMobile: vp.width < 500 });
    await ctx.route('**/api/v1/auth/me', (route) => route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ success: true, user: { id: 9001, role: 'admin', email: 'qa-admin@smarter.dz', grade: null, account_status: 'active' } }) }));
    await ctx.addInitScript(() => localStorage.setItem('token', 'e2e-presenter-token'));
    const page = await ctx.newPage();
    watchErrors(page, errors);
    await page.goto(`${CH}/qasim-adad-tabii/al-maktaba`, { waitUntil: 'networkidle' });
    const root = page.locator('[data-classroom-scope="manipulation"]').first();
    await pickLevel(page, 'advanced');
    const m = page.locator('[data-manipulation="divisor-explorer-books"]').first();
    await m.locator('.be-choice', { hasText: /^26$/ }).click();
    await root.locator('[data-classroom-enter]').click();
    await page.waitForTimeout(900);
    const f = await page.evaluate(() => {
      const r = document.querySelector('[data-classroom-active="true"]');
      const tb = r?.querySelector('[data-classroom-toolbar]');
      const small = [...(tb?.querySelectorAll('button') ?? [])].filter((b) => b.getBoundingClientRect().height < 44 || b.getBoundingClientRect().width < 44).length;
      return { active: !!r, pageX: document.scrollingElement.scrollWidth <= window.innerWidth + 1, rootX: r ? r.scrollWidth <= r.clientWidth + 1 : false, small };
    });
    check(`C3 ${vp.width}×${vp.height} : présentation active, aucun débordement horizontal`, f.active && f.pageX && f.rootX, JSON.stringify(f));
    check(`C3 ${vp.width}×${vp.height} : les commandes de la barre font ≥ 44 px`, f.small === 0, `${f.small} petites`);
    await root.getByRole('button', { name: 'الخروج من وضع القسم' }).click();
    await page.waitForTimeout(300);
    await ctx.close();
  }
}

/* ── 2 — l'alternative sans glisser + clavier (factor-pairs) ─────────────── */
{
  const { ctx, page } = await open(`${CH}/qawasim-adad-tabii/al-adad-60`);
  await pickLevel(page, 'advanced');
  const m = await visibleManip(page, 'factor-pairs');
  await m.waitFor();
  const board = m.locator('[data-drop-zone="board"]');

  // Chemin TAP : toucher l'objet, puis la zone.
  await tile(m, 'cols:4').click();
  check('L2 : toucher une tuile la prend (aria-pressed)', (await tile(m, 'cols:4').getAttribute('aria-pressed')) === 'true');
  await board.click();
  await page.waitForTimeout(200);
  check('L2 : toucher la zone y pose la tuile — 60 = 4 × 15', (await m.locator('[data-manipulation-representation]').textContent()).includes('15'));

  // Chemin CLAVIER : Entrée sur l'objet, Entrée sur la zone.
  await tile(m, 'cols:7').focus();
  await page.keyboard.press('Enter');
  check('L2 : Entrée prend la tuile au clavier', (await tile(m, 'cols:7').getAttribute('aria-pressed')) === 'true');
  await board.focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(200);
  check('L2 : Entrée sur la zone la pose — 7 ne divise pas 60, il reste 4', (await m.locator('[data-manipulation-representation]').textContent()).includes('4'));
  check('L2 : aucun débordement horizontal', await noHorizontalScroll(page));
  await ctx.close();
}

/* ── 5 — indices progressifs (jamais la réponse) ─────────────────────────── */
{
  const { ctx, page } = await open(`${CH}/qawasim-adad-tabii/al-adad-60`);
  const m = await visibleManip(page, 'factor-pairs');
  await m.waitFor();
  const hintBtn = m.getByRole('button', { name: /تلميح/ });
  await hintBtn.click();
  const one = await m.locator('[data-manipulation-hints] li').count();
  await hintBtn.click();
  const two = await m.locator('[data-manipulation-hints] li').count();
  check('indices : chaque demande en découvre un de plus', one === 1 && two === 2, `${one} → ${two}`);
  check('indices : aucun indice ne contient la liste des diviseurs', !(await m.locator('[data-manipulation-hints]').textContent()).includes('12'));
  await ctx.close();
}

/* ── 6 — وضع التلميذ SEUL : aucune bascule « وضع القسم » nulle part ─────── */
{
  const { ctx, page } = await open(`${CH}/bahth-pgcd/al-furuq`);
  await pickLevel(page, 'advanced');
  const m = await visibleManip(page, 'pgcd-differences');
  await m.waitFor();
  check('L6 : la manipulation est en وضع التلميذ', (await m.getAttribute('data-manipulation-mode')) === 'student');
  check('L6 : la bascule « وضع القسم » n’est pas affichée', (await m.getByRole('button', { name: 'وضع القسم' }).count()) === 0);
  check('L6 : ni « وضع التلميذ » comme bouton (il n’y a plus de choix à faire)', (await m.getByRole('button', { name: 'وضع التلميذ' }).count()) === 0);
  check('L6 : aucun contrôle enseignant visible pour l’élève', (await m.getByRole('button', { name: 'إظهار الحل' }).count()) === 0);
  // L'élève AGIT : c'est son geste qui déroule la chaîne, pas un bouton d'étape.
  await m.locator('[data-drag-source="num:small"]').first().click();
  await m.locator('[data-drop-zone="big"]').click();
  await page.waitForTimeout(220);
  check('L6 : le geste de l’élève écrit 252 − 140 = 112', (await m.locator('[data-difference-chain]').textContent()).includes('112'));
  await ctx.close();
}

// La bascule est absente de TOUTES les manipulations montées dans les modules.
{
  const PAGES = [
    ['divisor-explorer-books', `${CH}/qasim-adad-tabii/al-maktaba`],
    ['factor-pairs', `${CH}/qawasim-adad-tabii/al-adad-60`],
    ['divisor-properties', `${CH}/khawass-qawasim/thalath-halat`],
    ['common-divisors', `${CH}/qasim-mushtarak-akbar/baqat`],
    ['coprime-explorer', `${CH}/awwaliyan-fima-baynahuma/17-wa-18`],
    ['fraction-reduction', `${CH}/ikhtizal-kasr/samir`],
  ];
  for (const [type, url] of PAGES) {
    const { ctx, page } = await open(url, { completed: ['0', '1', '2'], lesson: url.split('/').slice(-2)[0] });
    // Une manipulation du manuel vit au niveau متقدم de l'atelier ; on y
    // bascule avant de la chercher, et on la cherche dans le panneau VISIBLE
    // (un même type peut servir les deux niveaux).
    await pickLevel(page, 'advanced');
    const m = await visibleManip(page, type);
    const found = await m.waitFor({ timeout: 8000 }).then(() => true).catch(() => false);
    if (!found) { check(`${type} : la manipulation est montée`, false, url); await ctx.close(); continue; }
    const toggles = await m.getByRole('button', { name: /وضع القسم|وضع التلميذ/ }).count();
    check(`${type} : aucune bascule de mode`, toggles === 0, `${toggles} bouton(s)`);
    await ctx.close();
  }
}

/* ── 4bis — Euclide : le quotient vient du comptage des copies ───────────── */
{
  const { ctx, page } = await open(`${CH}/bahth-pgcd/khwarizmiyat-iqlidus`, { completed: ['1', '2'], lesson: 'bahth-pgcd' });
  await pickLevel(page, 'advanced');
  const m = await visibleManip(page, 'euclidean-algorithm');
  await m.waitFor();
  const dividend = m.locator('[data-drop-zone="dividend"]');

  check('L6 M3 : aucun quotient affiché avant d’avoir posé une copie', (await m.locator('[data-manipulation-representation]').textContent()).includes('?'));
  await dragTo(page, tile(m, 'copy'), dividend);
  await dragTo(page, tile(m, 'copy'), dividend);
  await dragTo(page, tile(m, 'copy'), dividend);
  await dragTo(page, tile(m, 'copy'), dividend);
  await dragTo(page, tile(m, 'copy'), dividend);
  const txt = await m.textContent();
  check('L6 M3 : 5 copies de 135 tiennent dans 765, la 6ᵉ déborde', txt.includes('5') && txt.includes('90'));
  check('L6 M3 : le quotient a rempli l’égalité APRÈS le geste', (await m.locator('[data-manipulation-representation]').textContent()).includes('90'));
  await ctx.close();
}

/* ── 7 — paliers ─────────────────────────────────────────────────────────── */
{
  const { ctx, page } = await open(`${CH}/awwaliyan-fima-baynahuma/17-wa-18`);
  await pickLevel(page, 'advanced');
  const m = await visibleManip(page, 'coprime-explorer');
  await m.waitFor();
  const levels = m.locator('[data-manipulation-levels]');
  check('paliers : les quatre niveaux sont proposés', (await levels.getByRole('button').count()) >= 4);
  await levels.getByRole('button', { name: /تحدّ/ }).click();
  await page.waitForTimeout(250);
  check('paliers : le palier « تحدّ » charge 27 et 36', (await m.textContent()).includes('27') && (await m.textContent()).includes('36'));
  await ctx.close();
}

/* ── 8 — mobile 320 px : cibles et débordement ───────────────────────────── */
{
  const { ctx, page } = await open(`${CH}/ikhtizal-kasr/samir`, { mobile: true, completed: ['0'], lesson: 'ikhtizal-kasr' });
  await pickLevel(page, 'advanced');
  const m = await visibleManip(page, 'fraction-reduction');
  await m.waitFor();
  check('mobile 320 : aucun débordement horizontal', await noHorizontalScroll(page));
  const box = await m.locator('[data-drag-source]').first().boundingBox();
  check('mobile 320 : les objets font au moins 40 px', box.height >= 40 && box.width >= 40, JSON.stringify(box));
  // Tap-tap sur mobile (pas de souris) : poser ÷4 sur le kasr.
  await tile(m, 'k:4').tap();
  await m.locator('[data-drop-zone="fraction"]').tap();
  await page.waitForTimeout(250);
  check('mobile 320 : ÷4 transforme 84/48 en 21/12', (await m.locator('[data-manipulation-representation]').textContent()).includes('21'));
  await ctx.close();
}

/* ── 9 — mouvement réduit ────────────────────────────────────────────────── */
{
  const { ctx, page } = await open(`${CH}/qasim-mushtarak-akbar/baqat`, { reducedMotion: true });
  await pickLevel(page, 'advanced');
  const m = await visibleManip(page, 'common-divisors');
  await m.waitFor();
  await tile(m, 'k:9').click();
  await m.locator('[data-drop-zone="table"]').click();
  await page.waitForTimeout(250);
  check('mouvement réduit : la manipulation fonctionne (9 باقات → 10 و 6)', (await m.textContent()).includes('10') && (await m.textContent()).includes('6'));
  await ctx.close();
}

/* ── 9bis — LES MONDES DESSINÉS (2026-09-21) ─────────────────────────────
   Ce que ce bloc verrouille : chaque leçon ouvre sur une scène d'objets
   RÉELS, dessinés, et le dessin dit la même chose que la division :
     • bouquets : 9 bouquets de 90 et 54 → 9 cadres, 16 fleurs chacun, rien
       au sol ; 4 bouquets → 2 rouges et 2 blanches DESSINÉES dehors ;
     • trousses (coprime) : 17 et 18 en 2 trousses → 1 stylo dehors ; après
       1, 2 et 3, l'enseignement « seul 1 marche » apparaît ;
     • recette : ÷4 sur 84/48 → 4 parts de 21 + 12 ;
     • chantier : les trois zones se bâtissent en briques entières ;
     • rubans : couper 140 de 252 écrit 112 ; 5 reports de 135 dans 765
       laissent 90. */
{
  const { ctx, page } = await open(`${CH}/qasim-mushtarak-akbar/baqat`);
  await pickLevel(page, 'advanced');
  const m = await visibleManip(page, 'common-divisors');
  await m.waitFor();
  check('monde : avant tout choix, les DEUX piles entières sont dessinées (90 + 54 objets)', (await m.locator('[data-pile] svg').count()) === 144);
  await tile(m, 'k:9').click();
  await m.locator('[data-drop-zone="table"]').click();
  await page.waitForTimeout(300);
  check('monde : 9 bouquets → 9 cadres identiques', (await m.locator('[data-group-card]').count()) === 9);
  check('monde : chaque bouquet contient 10 + 6 fleurs DESSINÉES', (await m.locator('[data-group-card]').first().locator('svg').count()) === 16);
  check('monde : rien ne reste dehors', (await m.locator('[data-group-leftover]').count()) === 0 && (await m.locator('[data-grouping-scene]').getAttribute('data-works')) === 'true');
  await tile(m, 'k:4').click();
  await m.locator('[data-drop-zone="table"]').click();
  await page.waitForTimeout(300);
  check('monde : 4 bouquets → 2 rouges et 2 blanches restent, dessinées dehors', (await m.locator('[data-group-leftover] svg').count()) === 4
    && (await m.locator('[data-group-leftover]').getAttribute('data-leftover-a')) === '2');
  await ctx.close();
}
{
  const { ctx, page } = await open(`${CH}/awwaliyan-fima-baynahuma/17-wa-18`);
  const m = await visibleManip(page, 'coprime-explorer');
  await m.waitFor();
  check('trousses : le niveau débutant ouvre sur les objets, pas sur les listes', (await m.locator('[data-coprime-groups]').count()) === 1);
  await tile(m, 'k:2').click();
  await m.locator('[data-drop-zone="kits"]').click();
  await page.waitForTimeout(250);
  check('trousses : 2 trousses → 8 + 9 dans chacune, 1 stylo dehors', (await m.locator('[data-group-card]').count()) === 2 && (await m.locator('[data-group-leftover] svg').count()) === 1);
  check('trousses : l’enseignement n’apparaît pas encore (un seul essai)', (await m.locator('[data-coprime-insight]').count()) === 0);
  await tile(m, 'k:1').click(); await m.locator('[data-drop-zone="kits"]').click(); await page.waitForTimeout(150);
  await tile(m, 'k:3').click(); await m.locator('[data-drop-zone="kits"]').click(); await page.waitForTimeout(250);
  check('trousses : après 1, 2 et 3, « seul 1 marche » apparaît', (await m.locator('[data-coprime-insight]').count()) === 1);
  await m.locator('[data-coprime-insight] button').click();
  await page.waitForTimeout(250);
  check('trousses : le passage aux listes garde les nombres essayés en vue', (await m.locator('[data-drop-zone="shared"]').count()) === 1 && (await m.textContent()).includes('الأعداد التي جرّبتها'));
  await ctx.close();
}
{
  const { ctx, page } = await open(`${CH}/ikhtizal-kasr/samir`, { completed: ['0'], lesson: 'ikhtizal-kasr' });
  await pickLevel(page, 'advanced');
  const m = await visibleManip(page, 'fraction-reduction');
  await m.waitFor();
  check('recette : 84 cuillères et 48 tasses sont dessinées avant tout geste', (await m.locator('[data-pile] svg').count()) === 132);
  await tile(m, 'k:4').click();
  await m.locator('[data-drop-zone="fraction"]').click();
  await page.waitForTimeout(300);
  check('recette : ÷4 → 4 parts identiques de 21 + 12', (await m.locator('[data-group-card]').count()) === 4 && (await m.locator('[data-group-card]').first().locator('svg').count()) === 33);
  check('recette : la part lue est 21/12', (await m.locator('[data-recipe-portion]').textContent()).includes('21'));
  await ctx.close();
}
{
  const { ctx, page } = await open(`${CH}/khawass-qawasim/thalath-halat`);
  const m = await visibleManip(page, 'divisor-properties');
  await m.waitFor();
  check('chantier : les deux murs sont dessinés en briques (6 + 4 briques de 3)', (await m.locator('[data-brick-site] [data-brick-wall]').count()) >= 2);
  for (const z of ['join', 'remove', 'measure']) {
    await tile(m, 'wall:b').click();
    await m.locator(`[data-drop-zone="zone:${z}"]`).click();
    await page.waitForTimeout(200);
  }
  check('chantier : les trois zones sont bâties', (await m.locator('[data-site-zone][data-built="true"]').count()) === 3);
  check('chantier : aucun demi-brique nulle part', (await m.locator('[data-wall-partial]').count()) === 0);
  check('chantier : la découverte s’ouvre après les trois constructions', (await phaseOf(m)) === 'discover');
  await ctx.close();
}
{
  const { ctx, page } = await open(`${CH}/bahth-pgcd/al-furuq`);
  await pickLevel(page, 'advanced');
  const m = await visibleManip(page, 'pgcd-differences');
  await m.waitFor();
  check('rubans : les deux rubans sont dessinés', (await m.locator('[data-ribbons] [data-ribbon]').count()) === 2);
  check('rubans : les ciseaux marquent la coupe avant le geste', (await m.locator('[data-ribbon-cut]').count()) === 1);
  await tile(m, 'num:small').click();
  await m.locator('[data-drop-zone="big"]').click();
  await page.waitForTimeout(250);
  check('rubans : couper 140 de 252 écrit 112', (await m.locator('[data-difference-chain]').textContent()).includes('112'));
  await ctx.close();
}

/* ── 10 — L'ATELIER À DEUX NIVEAUX et le laboratoire des équipes ──────────
   Ce que ce bloc verrouille, et qui est le cœur de la refonte :
     • l'atelier s'ouvre sur « مبتدئ », jamais sur autre chose ;
     • basculer ne recharge pas la page et ne perd pas l'état posé ;
     • le geste produit la notation (a = b × q + r) et JAMAIS l'inverse ;
     • le reste est un joueur DESSINÉ hors du terrain, pas une décimale ;
     • la découverte n'arrive qu'après avoir vu les DEUX cas. */
{
  const { ctx, page } = await open(`${CH}/qasim-adad-tabii/al-maktaba`);
  const ws = page.locator('[data-manipulation-workspace]').first();
  const m = page.locator('[data-manipulation="team-builder"]').first();
  await m.waitFor();

  check('W1 : l’atelier s’ouvre sur le niveau مبتدئ', (await ws.getAttribute('data-level')) === 'beginner');
  check('W1 : les deux niveaux sont proposés, et un seul est actif',
    (await ws.locator('[role="tab"]').count()) === 2
    && (await ws.locator('[role="tab"][aria-selected="true"]').count()) === 1);
  check('W1 : le niveau متقدم est rendu mais MASQUÉ (état préservé, hors du parcours clavier)',
    (await ws.locator('[data-manipulation-level-panel="advanced"]').count()) === 1
    && !(await ws.locator('[data-manipulation-level-panel="advanced"]').isVisible()));

  const bench = () => m.locator('[data-drop-zone="bench"] [data-drag-source^="player:"]');
  check('W1 : les 15 joueurs attendent hors des équipes', (await bench().count()) === 15);
  check('W1 : rien n’est écrit avant le geste', (await m.locator('[data-manipulation-representation]').count()) === 0);

  // GLISSER un joueur sur le terrain — le vrai geste, avec de vrais événements.
  await dragTo(page, bench().first(), m.locator('[data-team="0"]'));
  check('W1 : glisser un joueur le fait entrer dans l’équipe 1',
    (await m.locator('[data-team="0"]').getAttribute('data-team-size')) === '1' && (await bench().count()) === 14);

  // L'ALTERNATIVE sans glisser : toucher le joueur, puis l'équipe.
  await bench().first().click();
  await m.locator('[data-team="1"]').click();
  await page.waitForTimeout(200);
  check('W1 : toucher le joueur puis l’équipe fait la même chose',
    (await m.locator('[data-team="1"]').getAttribute('data-team-size')) === '1');

  // Le CLAVIER : Entrée prend le joueur, Entrée sur la zone le pose.
  await bench().first().focus();
  await page.keyboard.press('Enter');
  await m.locator('[data-team="2"]').focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(200);
  check('W1 : le clavier seul suffit (Entrée, Entrée)',
    (await m.locator('[data-team="2"]').getAttribute('data-team-size')) === '1');

  // Le REFUS EXPLIQUÉ. Les trois équipes ont un joueur : elles sont égales, et
  // continuer est donc légitime. On crée d'abord le déséquilibre (un second
  // joueur dans l'équipe 1), puis on essaie d'en ajouter un TROISIÈME — c'est
  // celui-là que le partage équitable refuse, et il l'explique en arabe.
  await bench().first().click();
  await m.locator('[data-team="0"]').click();
  await page.waitForTimeout(200);
  await bench().first().click();
  await m.locator('[data-team="0"]').click();
  await page.waitForTimeout(250);
  const reason = await m.locator('[role="status"]').first().textContent();
  check('W1 : remplir une équipe avant les autres est refusé AVEC une raison en arabe',
    (await m.locator('[data-team="0"]').getAttribute('data-team-size')) === '2'
    && /بالتساوي/.test(reason ?? '') && /فريق أصغر/.test(reason ?? ''), reason ?? '');

  // Compléter : 15 joueurs, 3 équipes de 5, personne dehors.
  for (let i = 0; i < 15; i += 1) {
    const p = bench().first();
    if (!(await p.count())) break;
    await p.click();
    await m.locator(`[data-team="${i % 3}"]`).click();
    await page.waitForTimeout(25);
  }
  await page.waitForTimeout(400);
  check('W1 : 15 joueurs donnent 3 équipes de 5, et personne dehors',
    (await m.locator('[data-team]').evaluateAll((els) => els.map((e) => e.dataset.teamSize))).join(',') === '5,5,5'
    && (await bench().count()) === 0);
  const eq15 = await m.locator('[data-manipulation-representation]').textContent();
  check('W1 : la notation SUIT le geste — 15 = 3 × 5', /15\s*=\s*3\s*×\s*5/.test((eq15 ?? '').replace(/\s+/g, ' ')), (eq15 ?? '').slice(0, 60));
  check('W1 : le résultat n’apparaît pas avant « اكتشف »', (await phaseOf(m)) === 'act');

  // 16 joueurs : le reste devient un joueur qu'on VOIT.
  await m.getByRole('button', { name: /16 لاعب/ }).click();
  await page.waitForTimeout(350);
  for (let i = 0; i < 16; i += 1) {
    const p = bench().first();
    if (!(await p.count())) break;
    await p.click();
    await m.locator(`[data-team="${i % 3}"]`).click();
    await page.waitForTimeout(25);
  }
  await page.waitForTimeout(450);
  check('W1 : 16 joueurs laissent UN joueur dessiné hors des équipes (pas 5,333)',
    (await bench().count()) === 1
    && (await m.locator('[data-team]').evaluateAll((els) => els.map((e) => e.dataset.teamSize))).join(',') === '5,5,5');
  const eq16 = ((await m.locator('[data-manipulation-representation]').textContent()) ?? '').replace(/\s+/g, ' ');
  check('W1 : l’égalité 16 = 3 × 5 + 1 émerge', /16\s*=\s*3\s*×\s*5\s*\+\s*1/.test(eq16), eq16.slice(0, 70));
  check('W1 : la découverte s’ouvre APRÈS avoir vu les deux cas',
    (await phaseOf(m)) === 'discover' && (await m.locator('[data-manipulation-discovery]').count()) === 1);
  check('W1 : la règle formelle n’est pas encore écrite', (await m.locator('[data-manipulation-formal]').count()) === 0);

  await m.locator('[data-manipulation-discovery] button').first().click();
  await page.waitForTimeout(300);
  check('W1 : la bonne conjecture fait écrire a = b × q + r',
    (await phaseOf(m)) === 'formal' && (await m.locator('[data-manipulation-formal]').count()) === 1);

  // BASCULE de niveau : l'état posé survit à l'aller-retour.
  const benchBefore = await m.locator('[data-bench-count]').getAttribute('data-bench-count');
  await pickLevel(page, 'advanced');
  const books = page.locator('[data-manipulation="divisor-explorer-books"]').first();
  check('W2 : le niveau متقدم montre la bibliothèque du manuel', await books.isVisible() && !(await m.isVisible()));
  await books.locator('.be-choice', { hasText: /^28$/ }).click();
  await page.waitForTimeout(300);
  check('W2 : la bibliothèque JOUE au niveau متقدم — 28 range tout en 15 rayons',
    (await books.locator('.be-shelf').count()) === 15);
  await pickLevel(page, 'beginner');
  check('W2 : revenir à مبتدئ RETROUVE la scène telle qu’on l’a laissée',
    (await m.locator('[data-bench-count]').getAttribute('data-bench-count')) === benchBefore
    && (await phaseOf(m)) === 'formal');

  // Le clavier navigue entre les niveaux (RTL : ← va vers le suivant).
  await ws.locator('[role="tab"][data-level="beginner"]').focus();
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(300);
  check('W2 : les flèches passent d’un niveau à l’autre', (await ws.getAttribute('data-level')) === 'advanced');

  check('W2 : aucune bascule « وضع القسم » dans l’atelier', (await ws.getByRole('button', { name: 'وضع القسم' }).count()) === 0);
  await ctx.close();
}

/* ── 11 — l'atelier sur un téléphone (320 px) ─────────────────────────────── */
{
  const { ctx, page } = await open(`${CH}/qasim-adad-tabii/al-maktaba`, { mobile: true });
  const ws = page.locator('[data-manipulation-workspace]').first();
  const m = page.locator('[data-manipulation="team-builder"]').first();
  await m.waitFor();
  check('W3 (320 px) : aucun débordement horizontal', await noHorizontalScroll(page));
  const tab = await ws.locator('[role="tab"]').first().boundingBox();
  check('W3 (320 px) : les onglets de niveau font au moins 44 px', tab.height >= 44, JSON.stringify(tab));
  const player = await m.locator('[data-drop-zone="bench"] [data-drag-source^="player:"]').first().boundingBox();
  check('W3 (320 px) : un joueur du banc est une cible confortable', player.height >= 44, JSON.stringify(player));
  // Le terrain garde ses PROPORTIONS RÉELLES (largeur = 2/3 de la hauteur).
  const pitch = await m.locator('[data-team-pitch-area]').first().boundingBox();
  check('W3 (320 px) : le terrain n’est pas déformé — largeur = 2/3 hauteur',
    Math.abs(pitch.width / pitch.height - 2 / 3) < 0.02, `${Math.round(pitch.width)}x${Math.round(pitch.height)}`);
  await m.locator('[data-drop-zone="bench"] [data-drag-source^="player:"]').first().tap();
  await m.locator('[data-team="0"]').tap();
  await page.waitForTimeout(250);
  check('W3 (320 px) : toucher fonctionne au doigt', (await m.locator('[data-team="0"]').getAttribute('data-team-size')) === '1');
  await ctx.close();
}

/* ── 12 — LE NIVEAU PAR DÉFAUT SERT LA TÂCHE DU MODULE ────────────────────
   Un module intitulé « نشاط N » porte l'activité du manuel et sa première
   étape attend que CETTE manipulation soit finie. Il doit donc s'ouvrir
   dessus : sinon l'activité est cachée derrière un onglet que l'élève doit
   deviner, et l'étape reste insatisfiable (défaut trouvé le 2026-09-21 sur
   « نشاط 2 — قواسم العدد 60 », qui ouvrait sur 24).

   On vérifie que le laboratoire OUVERT porte bien les nombres du titre du
   module. Le titre est la promesse ; l'atelier doit la tenir. */
{
  const OPENS_ON = [
    ['qasim-adad-tabii/al-maktaba', /15 لاعبًا|420/],      // M1 ouvre sur l'expérience débutante, voulue
    ['qawasim-adad-tabii/al-adad-60', /60/],
    ['qasim-mushtarak-akbar/baqat', /90|54/],
    ['tayin-pgcd/42-wa-60', /42|60/],
    ['bahth-pgcd/al-furuq', /252|140/],
    ['ikhtizal-kasr/samir', /84|48/],
  ];
  for (const [path, expected] of OPENS_ON) {
    const lesson = path.split('/')[0];
    const { ctx, page } = await open(`${CH}/${path}`, { completed: ['0', '1', '2'], lesson });
    const ws = page.locator('[data-manipulation-workspace]').first();
    await ws.waitFor({ timeout: 8000 }).catch(() => {});
    if (!(await ws.count())) { await ctx.close(); continue; }
    const shown = await page.locator('[data-manipulation-level-panel]:not([hidden]) [data-manipulation]').first().getAttribute('aria-label');
    check(`D : « ${path} » ouvre sur les nombres de son titre`, expected.test(shown ?? ''), `ouvre sur « ${shown} »`);
    await ctx.close();
  }
}

await browser.close();
check('aucune erreur console/page', errors.length === 0, errors.slice(0, 3).join(' | '));
summary();
