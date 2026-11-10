import { describe, it, expect } from 'vitest';

/**
 * Unité 9 « خاصية طالس » — ce que l'élève LIT de la mission, de la carte des معارف et des données du manuel (modèle : l'unité 2,
 * hisab-judhur/_unit/missionStrings.test.js ; rollout 2026-11-10). Une leçon CONVERTIE entre dans `CLIMAX` avec la signature de SA مسألة ;
 * les leçons 1 (talis-hisab-atwal) et 3 (inshaat-talis) s'y ajoutent quand elles sont converties (une ligne chacune) :
 *   - aucun caractère de contrôle dans un point d'étape ni dans l'ouverture (« \times » dans une chaîne JS à apostrophes devient TAB + « imes ») ;
 *   - aucune ligne de la carte des معارف (knowledgeGraph.js) ne renvoie au manuel ;
 *   - les cartes de connaissance (knowledge.jsx) et la carte des معارف — ouvertes dès le début (`knowledgeMapOpen`) — ne montrent pas la
 *     solution de la مسألة de LEUR leçon (sa signature : ses nombres, ses rapports, ses produits) ;
 *   - les points d'étape d'une leçon convertie ne la montrent pas non plus ;
 *   - les textes du manuel que l'élève lit (knowledge.jsx, knowledgeGraph.js, content/textbook.js, content/exercises.js) ne disent ni
 *     « الكتاب », ni « تمرين N : », ni « خطأً مطبعيًا » (indépendance du manuel) — hors commentaires et métadonnées `src(...)`.
 */
const configs = import.meta.glob('../*/lesson.config.js', { eager: true });
const graphs = import.meta.glob('../*/knowledgeGraph.js', { eager: true });
const raw = import.meta.glob(['../*/knowledge.jsx', '../*/knowledgeGraph.js', '../*/content/textbook.js', '../*/content/exercises.js'], { eager: true, query: '?raw', import: 'default' });
const CONTROL = /[\t\n\r\f\v\b]/;

/** Le texte d'un fichier sans ses commentaires ni ses métadonnées de source. */
const strings = (src) => src
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '')
  .replace(/\s\/\/ .*$/gm, '')
  .replace(/src\([^)]*\)/g, '');

/**
 * La signature de la مسألة de chaque leçon CONVERTIE : ce que ses cartes de connaissance et ses points d'étape ne montrent jamais.
 *   aksiya-talis (module 5, le tréteau des peintres) : les barres 80 / 100, les trous 24, 30, 36, 44, 45, 46, les produits 2400 / 3600 / 3680,
 *   les rapports 3/10, 9/20, 23/50 et leurs écritures décimales 0,3 / 0,45 / 0,46.
 */
const num = (list) => new RegExp(`(^|[^0-9,{}.])(${list.join('|')})(?![0-9]|\\{,\\})`);
const frac = (n, d) => new RegExp(`frac\\{${n}\\}\\{${d}\\}`);
const CLIMAX = {
  'aksiya-talis': [num(['80', '100', '24', '30', '36', '44', '45', '46', '2400', '3600', '3680']), frac(3, 10), frac(9, 20), frac(23, 50), /0\{?,\}?(3|45|46)(?![0-9])/],
};
const BOOK = [/الكتاب(?!ة)/, /تمرين\s*\d+\s*:/, /خطأً? مطبعي/];
const lessonOf = (path) => path.split('/')[1];

describe('unit 9 — mission strings and knowledge maps', () => {
  it('found the lessons', () => {
    expect(Object.keys(configs).length).toBeGreaterThanOrEqual(4);
    expect(Object.keys(graphs).length).toBeGreaterThanOrEqual(4);
    // the raw scans really read each converted lesson's knowledge, map, textbook and exercise files
    expect(Object.keys(raw).filter((path) => CLIMAX[lessonOf(path)]).length).toBeGreaterThanOrEqual(4 * Object.keys(CLIMAX).length);
    expect(Object.values(raw).every((src) => typeof src === 'string' && src.length > 100)).toBe(true);
  });
  it('the signature regexes catch what they must (negative controls)', () => {
    const sigs = CLIMAX['aksiya-talis'];
    const hit = (s) => sigs.some((re) => re.test(s));
    ['$AM = 24$', 'AB = 80', '\\dfrac{9}{20}', '$0{,}45$', '2400', 'الثقب 45'].forEach((s) => expect(hit(s), s).toBe(true));
    ['$AB = 9$', '\\dfrac{1}{3}', '$2{,}45$', '$0{,}35$', '124', '4,5'].forEach((s) => expect(hit(s), s).toBe(false));
  });
  it('no checkpoint string holds a control character (a lost backslash)', () => {
    Object.entries(configs).forEach(([path, m]) => {
      (m.LESSON_CONFIG?.mission?.checkpoints ?? []).forEach((cp) => {
        [cp.prompt, ...cp.options, cp.explain].forEach((s) => expect(CONTROL.test(String(s)), `${path} ${cp.id}: ${JSON.stringify(s)}`).toBe(false));
      });
      const o = m.LESSON_CONFIG?.mission?.opening?.text;
      if (o) expect(CONTROL.test(o), `${path} opening`).toBe(false);
    });
  });
  it('the checkpoints of a converted lesson never show its climax', () => {
    Object.entries(configs).forEach(([path, m]) => {
      const sigs = CLIMAX[m.LESSON_CONFIG?.id];
      if (!sigs) return;
      (m.LESSON_CONFIG.mission?.checkpoints ?? []).forEach((cp) => {
        const s = [cp.prompt, ...cp.options, cp.explain].join(' ');
        sigs.forEach((re) => expect(re.test(s), `${path} ${cp.id} ${re}`).toBe(false));
      });
    });
  });
  it('no knowledge-map line of a converted lesson sends the student to the textbook', () => {
    // les leçons pas encore converties (1 et 3 le 2026-11-10 : inshaat-talis en a encore une) entrent ici avec leur conversion
    Object.entries(graphs).filter(([path]) => CLIMAX[lessonOf(path)]).forEach(([path, m]) => {
      expect(JSON.stringify(m.KNOWLEDGE_GRAPH ?? {}).includes('الكتاب'), path).toBe(false);
    });
  });
  it('the knowledge cards and the knowledge map never show their own lesson\'s climax solution', () => {
    Object.entries(raw).filter(([path]) => /knowledge(Graph)?\.jsx?$/.test(path)).forEach(([path, src]) => {
      const sigs = CLIMAX[lessonOf(path)];
      if (!sigs) return;
      strings(src).split('\n').forEach((line, i) => sigs.forEach((re) => expect(re.test(line), `${path}:${i + 1} ${re} — ${line.trim().slice(0, 90)}`).toBe(false)));
    });
  });
  it('the textbook data a student reads never names the book, an exercise number or a printing error', () => {
    Object.entries(raw).filter(([path]) => CLIMAX[lessonOf(path)]).forEach(([path, src]) => {
      strings(src).split('\n').forEach((line, i) => BOOK.forEach((re) => expect(re.test(line), `${path}:${i + 1} ${re} — ${line.trim().slice(0, 90)}`).toBe(false)));
    });
  });
});
