import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import ProblemIllustration from './ProblemIllustration';
import { validateIllustration, ILLUSTRATION_KINDS } from './problemIllustration';
import { PROBLEMS } from '../../moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/wadiya-idmajiya-aadad/content/problems';

describe('ProblemIllustration — le dessin de la situation', () => {
  it('chaque وضعية de أدمج تعلّماتي a son illustration, d\'un genre différent, valide', () => {
    expect(PROBLEMS.map((p) => p.illustration.kind)).toEqual(['books', 'bouquets', 'field', 'orchard', 'glass', 'hall']);
    for (const p of PROBLEMS) expect(validateIllustration(p.illustration), p.id).toEqual([]);
    expect(new Set(PROBLEMS.map((p) => p.illustration.kind)).size).toBe(6);
  });

  it('les cotes dessinées sont celles de l\'énoncé — le dessin ne donne pas la réponse', () => {
    for (const p of PROBLEMS) {
      const html = renderToString(<ProblemIllustration illustration={p.illustration} />);
      expect(html).toContain(`data-problem-illustration="${p.illustration.kind}"`);
      expect(html).toContain('direction:ltr');
      expect(html).toContain(p.illustration.ariaLabel);
      const il = p.illustration;
      const nums = [il.notebooks, il.books, il.white, il.red, il.length, il.width, ...(il.sides ?? [])].filter((n) => n != null);
      for (const n of nums) {
        expect(p.statement, `${p.id} ${n}`).toContain(String(n));
        expect(html, `${p.id} ${n}`).toContain(`>${n}`);
      }
    }
  });

  it('la plaque et la salle montrent un découpage générique marqué « ؟ » : le vrai nombre de carreaux est la réponse', () => {
    for (const id of ['wadiya-5', 'wadiya-6']) {
      const html = renderToString(<ProblemIllustration illustration={PROBLEMS.find((p) => p.id === id).illustration} />);
      expect(html).toContain('؟');
    }
  });

  it('le validateur refuse un genre inconnu ou un ariaLabel non arabe', () => {
    expect(ILLUSTRATION_KINDS).toHaveLength(14);
    expect(validateIllustration({ kind: 'x', ariaLabel: 'x' }).length).toBeGreaterThan(0);
    expect(validateIllustration({ kind: 'field', length: 1, width: 1, unit: 'م', ariaLabel: 'field' })).toContain('ariaLabel arabe obligatoire');
  });
});
