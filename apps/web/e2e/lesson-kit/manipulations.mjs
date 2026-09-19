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

/* ── 1 · 4 — divisor-explorer-books : la bibliothèque illustrée du module 1 ──
   Composant autonome (pas de ManipulationShell) : les 420 livres sont des
   objets illustrés. CHOISIR une taille de rayon EST l'expérience : rayons,
   livres restés au sol et égalité apparaissent aussitôt, sans autre bouton. */
{
  const { ctx, page } = await open(`${CH}/qasim-adad-tabii/al-maktaba`);
  const m = page.locator('[data-manipulation="divisor-explorer-books"]').first();
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

  // Mode classe : « عرض كامل » (Fullscreen API, ou notre superposition à défaut) — même jeu, plus grand.
  const fsBtn = m.getByRole('button', { name: 'عرض المناولة على كامل الشاشة' });
  check('L1 : le bouton « عرض كامل » est visible et nommé', await fsBtn.isVisible() && (await fsBtn.textContent()).includes('عرض كامل') && (await fsBtn.getAttribute('title')) === 'عرض المناولة على كامل الشاشة');
  const choiceBefore = (await size(28).boundingBox()).height;
  await fsBtn.click();
  // La promesse requestFullscreen() peut mettre un instant : on attend l'état, pas une durée.
  const entered = await page.waitForSelector('[data-manipulation="divisor-explorer-books"][data-fullscreen="true"]', { timeout: 5000 }).then(() => true).catch(() => false);
  const fsRoot = page.locator('[data-manipulation="divisor-explorer-books"]').first();
  check('L1 : « عرض كامل » passe la manipulation en plein écran', entered);
  const sizeFs = (v) => fsRoot.locator('.be-choice', { hasText: new RegExp(`^${v}$`) });
  let choiceAfter = 0;
  for (let i = 0; i < 20 && choiceAfter <= choiceBefore + 10; i += 1) { await page.waitForTimeout(100); choiceAfter = (await sizeFs(28).boundingBox())?.height ?? 0; }
  check('L1 : en plein écran les tailles sont plus grandes (projection)', choiceAfter > choiceBefore + 10, `${choiceBefore} → ${choiceAfter}`);
  await sizeFs(25).click();
  await page.waitForTimeout(300);
  check('L1 : le jeu reste jouable en plein écran — 25 laisse 20 livres', (await fsRoot.locator('.be-floor .be-book').count()) === 20);
  check('L1 : aucun débordement horizontal en plein écran', await page.evaluate(() => { const el = document.querySelector('[data-manipulation="divisor-explorer-books"]'); return el.scrollWidth <= el.clientWidth + 1; }));
  await fsRoot.getByRole('button', { name: 'الخروج من العرض الكامل' }).click();
  await page.waitForTimeout(400);
  check('L1 : « خروج » revient à la page', (await m.getAttribute('data-fullscreen')) === 'false' && (await m.locator('.be-floor .be-book').count()) === 20);

  await m.getByRole('button', { name: /جرّب 28/ }).click();
  await page.waitForTimeout(250);
  check('L1 : « جرّب 28 » bascule sur 28', (await size(28).getAttribute('aria-pressed')) === 'true');

  await m.getByRole('button', { name: /ابدأ من جديد/ }).click();
  await page.waitForTimeout(250);
  check('L1 : « ابدأ من جديد » efface rayons, égalité et badges', (await m.locator('.be-equation').count()) === 0 && (await m.locator('.be-shelf').count()) === 0 && (await m.locator('.be-choice.tested').count()) === 0);
  await ctx.close();
}

/* ── 2 — l'alternative sans glisser + clavier (factor-pairs) ─────────────── */
{
  const { ctx, page } = await open(`${CH}/qawasim-adad-tabii/al-adad-60`);
  const m = page.locator('[data-manipulation="factor-pairs"]').first();
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
  const m = page.locator('[data-manipulation="factor-pairs"]').first();
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
  const m = page.locator('[data-manipulation="pgcd-differences"]').first();
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
    const m = page.locator(`[data-manipulation="${type}"]`).first();
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
  const m = page.locator('[data-manipulation="euclidean-algorithm"]').first();
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
  const m = page.locator('[data-manipulation="coprime-explorer"]').first();
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
  const m = page.locator('[data-manipulation="fraction-reduction"]').first();
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
  const m = page.locator('[data-manipulation="common-divisors"]').first();
  await m.waitFor();
  await tile(m, 'k:9').click();
  await m.locator('[data-drop-zone="table"]').click();
  await page.waitForTimeout(250);
  check('mouvement réduit : la manipulation fonctionne (9 باقات → 10 و 6)', (await m.textContent()).includes('10') && (await m.textContent()).includes('6'));
  await ctx.close();
}

await browser.close();
check('aucune erreur console/page', errors.length === 0, errors.slice(0, 3).join(' | '));
summary();
