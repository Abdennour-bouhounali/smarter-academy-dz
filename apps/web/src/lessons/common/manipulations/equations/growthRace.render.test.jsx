import { it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import GrowthRace from './GrowthRace';

/**
 * growth-race se rend pour les DEUX thèmes (âges : la leçon ترييض مشكلة ; piscine : la
 * synthèse) et pour chaque forme d'expression du contrat (somme d'âges, groupe k(…),
 * tarifs + abonnement), sans clé i18n brute ni texte latin hors des formules.
 */
const CASES = [
  { left: '36+x', right: '4+x+6+x+8+x', theme: 'ages', goal: 'equal', expect: ['الأب', 'الابن الثاني', 'مجموع أعمار الأبناء'] },
  { left: '30+x', right: '2(6+x)', theme: 'ages', goal: 'equal', expect: ['الابن', 'ضعف عمر الابن'] },
  { left: '43+x', right: '2(4+x+7+x)', theme: 'ages', goal: 'equal', expect: ['ضعف مجموع أعمار الأبناء'] },
  { left: '75x', right: '560+5x', theme: 'pool', goal: 'greater', expect: ['الصيغة 1', 'الصيغة 2', 'الاشتراك السنوي', 'تذكرة الحصّة'] },
];

it('les deux thèmes se rendent, dans l’étape « construire », avec les mots de l’histoire', () => {
  for (const c of CASES) {
    const html = renderToString(<GrowthRace left={c.left} right={c.right} theme={c.theme} goal={c.goal} />);
    expect(html, c.left).toContain('data-growth-race');
    expect(html).toContain('data-stage="build"');
    expect(html).toContain(`data-theme="${c.theme}"`);
    expect(html).toContain('data-gr-token');
    for (const w of c.expect) expect(html, `${c.left}: ${w}`).toContain(w);
    expect(html).not.toMatch(/manipulation\.growthRace\./);
    expect(html).toContain('data-decor');
  }
});

it('un thème qui contredit l’opération cède au bon (des tarifs restent une piscine)', () => {
  const html = renderToString(<GrowthRace left="75x" right="560+5x" theme="ages" goal="greater" />);
  expect(html).toContain('data-theme="pool"');
  expect(html).toContain('data-op="mul"');
});

it('le contexte de la leçon remplace les mots du thème', () => {
  const html = renderToString(<GrowthRace left="75x" right="560+5x" theme="pool" goal="greater" context={{ leftTitle: 'تذاكر فقط', names: { R0: 'بطاقة السنة' } }} />);
  expect(html).toContain('تذاكر فقط');
  expect(html).toContain('بطاقة السنة');
});

it('« startWith="race" » épingle la course : la règle, les colonnes, la lecture du manuel', () => {
  for (const c of CASES) {
    const html = renderToString(<GrowthRace left={c.left} right={c.right} theme={c.theme} goal={c.goal} startWith="race" />);
    expect(html, c.left).toContain('data-stage="race"');
    expect(html).toContain('data-gr-ruler');
    expect(html).toContain('data-gr-columns');
    expect(html).toContain('data-gr-back');
    expect(html).not.toMatch(/manipulation\.growthRace\./);
  }
  // à x = 0 : le père 36, les enfants 4 + 6 + 8 = 18
  const html = renderToString(<GrowthRace startWith="race" />);
  expect(html).toContain('data-rel="&gt;"');
  expect(html).toContain('36 سنة');
});
