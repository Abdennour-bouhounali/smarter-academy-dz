// 4AM — قواسم عدد طبيعي والقاسم المشترك الأكبر (PGCD).
//
// Ce fichier garde la RÈGLE DURE du laboratoire d'ouverture
// (INTERACTION_PEDAGOGY.md §6bis / §6bis.0) : en arrivant sur le module 1,
// l'élève voit et peut utiliser la manipulation IMMÉDIATEMENT — aucune
// question, aucun bouton « commencer », aucune étape verrouillée entre lui
// et l'instrument. C'est une régression facile à réintroduire (il suffit de
// déplacer la manipulation dans `steps[0]`), donc elle est vérifiée ici et
// pas seulement relue.
//
// Run : KIT_BASE=http://localhost:5175 node apps/web/e2e/lesson-kit/4am-pgcd.mjs
import {
  BASE, launch, newCtx, watchErrors, check, summary, seed, lessonKey,
  noHorizontalScroll, SHOT_DIR,
} from './helpers.mjs';

const L = `${BASE}/courses/moyen/4am/ansab_al_aadad_wal_hisab/pgcd`;
const KEY = lessonKey('pgcd');
const errors = [];
const { browser } = await launch();

async function freshPage(completed, { mobile = false } = {}) {
  const ctx = await newCtx(browser, { mobile });
  const page = await ctx.newPage();
  watchErrors(page, errors);
  if (completed) await seed(page, completed, KEY);
  return { ctx, page };
}
const S = (page, n) => page.locator(`#step-${n}`);

// ── MODULE 1 : le laboratoire est là DÈS L'ENTRÉE ────────────────────────
{
  const { ctx, page } = await freshPage(null);
  await page.goto(`${L}/taqsim-adil`, { waitUntil: 'networkidle' });
  await page.waitForSelector('text=تقسيم عادل');

  // LA RÈGLE. Sur une PREMIÈRE visite (aucun module complété), le rail des
  // tailles doit être visible et cliquable sans rien avoir fait avant.
  const rail = page.getByRole('group', { name: 'أحجام الطرود' });
  check('m1: le rail des tailles est visible dès l\'entrée', await rail.isVisible().catch(() => false));

  const size12 = rail.getByRole('button', { name: /^حجم 12/ });
  check('m1: une taille est cliquable dès l\'entrée', await size12.isEnabled().catch(() => false));

  // Et il est bien AVANT la première étape dans le document : c'est ce qui
  // garantit qu'aucune carte d'étape ne s'interpose.
  const railBeforeStep1 = await page.evaluate(() => {
    const r = document.querySelector('[aria-label="أحجام الطرود"]');
    const s1 = document.querySelector('#step-1');
    if (!r || !s1) return false;
    return !!(r.compareDocumentPosition(s1) & Node.DOCUMENT_POSITION_FOLLOWING);
  });
  check('m1: le laboratoire précède l\'étape 1 dans le document', railBeforeStep1);

  // Aucune étape verrouillée ne masque la manipulation au premier affichage.
  check('m1: aucune étape verrouillée ne contient la manipulation',
    (await page.locator('[aria-label="أحجام الطرود"]').count()) === 1);

  // Les deux quantités et leur reste sont peints d'emblée (taille 5 = reste
  // des deux côtés, le déclencheur).
  check('m1: le verdict initial annonce un reste', await page.getByRole('status').first().innerText().then((t) => /لا يناسب/.test(t)).catch(() => false));

  await page.screenshot({ path: SHOT_DIR + 'pgcd-m1-entree.png', fullPage: true });

  // ── L'INTERACTION : action → conséquence, sans clic de validation ──────
  await size12.click();
  await page.waitForTimeout(250);
  const verdict12 = await page.getByRole('status').first().innerText();
  check('m1: taille 12 → « لا يبقى شيء في الجهتين »', /لا يبقى شيء في الجهتين/.test(verdict12), verdict12.slice(0, 80));

  // 8 divise 24 mais pas 36 : le cas « une seule jambe », qui porte toute la
  // distinction diviseur / diviseur commun.
  await rail.getByRole('button', { name: /^حجم 8/ }).click();
  await page.waitForTimeout(250);
  const verdict8 = await page.getByRole('status').first().innerText();
  check('m1: taille 8 → reste 0 d\'un côté, 4 de l\'autre', /لا يناسب/.test(verdict8), verdict8.slice(0, 80));

  // La MÉMOIRE du rail : 12 reste marqué ✓ après être passé à 8.
  const label12 = await rail.getByRole('button', { name: /^حجم 12/ }).getAttribute('aria-label');
  check('m1: le rail garde la trace de 12 (يصلح في الجهتين)', /يصلح في الجهتين/.test(label12 || ''), label12 || '');

  // Deux trouvailles → l'étape 1 se valide, SANS avoir répondu à une question.
  await rail.getByRole('button', { name: /^حجم 6/ }).click();
  await page.waitForTimeout(400);
  check('m1: étape 1 validée par la seule manipulation',
    await S(page, 1).getByText(/وجدت حتى الآن/).isVisible().catch(() => false));

  check('m1: pas de défilement horizontal', await noHorizontalScroll(page));

  // ── TYPOGRAPHIE ARABE : Cairo, GLOBALE (master spec §14) ───────────────
  // Ce n'est plus un essai borné à ce module : Cairo est la police arabe de
  // toute la plateforme. On vérifie donc ce que le navigateur REND vraiment,
  // pas la pile déclarée — une pile peut nommer Cairo tout en le plaçant
  // derrière une police système qui, elle, possède des glyphes arabes.
  const arabicFonts = await (async () => {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
    const n = await page.evaluate(() => {
      const AR = /[؀-ۿ]/;
      let i = 0;
      for (const el of document.querySelectorAll('body *')) {
        if (el.closest('.katex, math-field, svg')) continue;
        const own = [...el.childNodes].filter(t => t.nodeType === 3).map(t => t.textContent).join('').replace(/\s/g, '');
        if (own.length < 3 || !AR.test(own)) continue;
        if (!(el.offsetWidth || el.offsetHeight)) continue;
        el.setAttribute('data-ar', String(i++));
      }
      return i;
    });
    const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
    const bad = [];
    for (let i = 0; i < n; i++) {
      const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: `[data-ar="${i}"]` });
      if (!nodeId) continue;
      const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
      // Nombre de caractères NON arabes du sous-arbre : ce que Inter /
      // JetBrains Mono ont légitimement le droit de rendre.
      const latin = await page.evaluate((k) => {
        const t = document.querySelector(`[data-ar="${k}"]`).textContent;
        return t.length - (t.match(/[؀-ۿ]/g) || []).length;
      }, String(i));
      for (const f of fonts) {
        if (f.familyName !== 'Cairo' && !/emoji/i.test(f.familyName) && f.glyphCount > latin) {
          bad.push(`${f.familyName}×${f.glyphCount}`);
        }
      }
    }
    return bad;
  })();
  check('m1: tout l\'arabe du module est rendu en Cairo', arabicFonts.length === 0,
    arabicFonts.slice(0, 5).join(', ') || 'Cairo partout');

  // Les mathématiques gardent leurs polices.
  const katexFont = await page.evaluate(() => {
    const k = document.querySelector('.katex');
    return k ? getComputedStyle(k).fontFamily : 'aucune-expression';
  });
  check('m1: KaTeX n\'hérite pas de Cairo', !/Cairo/.test(katexFont), katexFont);

  await page.screenshot({ path: SHOT_DIR + 'pgcd-m1-manipule.png', fullPage: true });
  await ctx.close();
}

// ── CAIRO EST GLOBALE : le module 2 en hérite sans classe dédiée ──────────
{
  const { ctx, page } = await freshPage(['1']);
  await page.goto(`${L}/al-qawasim-al-mushtaraka`, { waitUntil: 'networkidle' });
  await page.waitForSelector('text=من القاسم إلى القاسم المشترك الأكبر');
  // Aucune classe de police au niveau de la leçon : l'héritage global suffit
  // (master spec §14, LESSON_DESIGN_PLAYBOOK §13bis).
  const overrides = await page.locator('[class*="font-trial"], [class*="font-cairo"]').count();
  check('m2: aucune classe de police au niveau du module', overrides === 0, `${overrides} élément(s)`);
  const bodyFont = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  check('m2: le corps hérite de la pile arabe globale', /Cairo/.test(bodyFont), bodyFont);
  await ctx.close();
}

// ── MOBILE 375 px : la règle tient aussi sur téléphone ────────────────────
{
  const { ctx, page } = await freshPage(null, { mobile: true });
  await page.goto(`${L}/taqsim-adil`, { waitUntil: 'networkidle' });
  await page.waitForSelector('text=تقسيم عادل');
  check('m1 mobile: le rail est visible dès l\'entrée',
    await page.getByRole('group', { name: 'أحجام الطرود' }).isVisible().catch(() => false));
  check('m1 mobile: pas de défilement horizontal', await noHorizontalScroll(page));

  // Cibles tactiles : le rail compte min(24,36) = 24 boutons, c'est le
  // passage le plus dense de la leçon.
  const small = await page.locator('main').getByRole('button').evaluateAll((els) =>
    els.filter((e) => !e.disabled && e.offsetParent !== null)
      .map((e) => { const r = e.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height), e.textContent.trim().slice(0, 12)]; })
      .filter(([w, h]) => h < 40 || w < 40));
  check('m1 mobile: toutes les cibles ≥ 40 px', small.length === 0, JSON.stringify(small.slice(0, 5)));

  // Balayage de TOUT le rail (§17bis : on balaie, on n'échantillonne pas) :
  // aucune taille ne doit provoquer de débordement horizontal.
  let overflow = null;
  for (let n = 1; n <= 24; n += 1) {
    await page.getByRole('button', { name: new RegExp(`^حجم ${n}(\\s|$|\\s—)`) }).first().tap();
    if (!(await noHorizontalScroll(page))) { overflow = n; break; }
  }
  check('m1 mobile: aucune taille ne déborde (balayage 1→24)', overflow === null, overflow ? `taille ${overflow}` : '');
  await page.screenshot({ path: SHOT_DIR + 'pgcd-m1-mobile.png', fullPage: true });
  await ctx.close();
}

check('aucune erreur console', errors.length === 0, errors.slice(0, 3).join(' | '));
await browser.close();
process.exit(summary());
