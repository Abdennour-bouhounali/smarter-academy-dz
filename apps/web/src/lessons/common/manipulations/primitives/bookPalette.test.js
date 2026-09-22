import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { BOOK_PALETTE } from './BookFigure';

/**
 * LES DEUX BIBLIOTHÈQUES DOIVENT MONTRER LE MÊME LIVRE.
 *
 * `divisor-explorer-books` (les 420 livres sur des rayons) dessine son livre
 * lui-même, parce qu'il est soudé à ses classes `be-book*` — le moteur de
 * mise en page du mode classe et les sélecteurs e2e les lisent. `factor-pairs`
 * (les rectangles de livres) passe, lui, par la primitive partagée.
 *
 * La palette est donc DUPLIQUÉE à dessein. Ce test est le prix de cette
 * duplication : si l'une des deux change de teintes, l'élève verrait deux
 * bibliothèques différentes dans la même leçon, et ce test tombe.
 *
 * On lit la SOURCE plutôt que d'importer le composant : il tire des styles
 * et du contexte React dont ce test n'a pas besoin, et qui demanderaient un
 * environnement DOM que ce dépôt n'a pas.
 */
const source = readFileSync(
  new URL('../divisibility/DivisorExplorerBooks.jsx', import.meta.url),
  'utf8',
);

/** Les triplets `["#cover", "#spine", "#page"]` du tableau `palette` du lab. */
function labPalette() {
  const block = source.slice(source.indexOf('const palette = ['));
  const rows = block.slice(0, block.indexOf('];')).match(/\[[^\]]*\]/g) ?? [];
  return rows.map((row) => (row.match(/#[0-9A-Fa-f]{6}/g) ?? []));
}

describe('la palette des livres — une seule bibliothèque, deux laboratoires', () => {
  it('la primitive partagée et le laboratoire des rayons ont la MÊME palette', () => {
    expect(labPalette()).toEqual(BOOK_PALETTE.map((row) => [...row]));
  });

  it('chaque teinte donne bien trois couleurs (couverture, dos, pages)', () => {
    for (const [i, tone] of BOOK_PALETTE.entries()) {
      expect(tone, `teinte ${i}`).toHaveLength(3);
      for (const c of tone) expect(c, `teinte ${i}`).toMatch(/^#[0-9A-F]{6}$/i);
    }
  });

  it('la teinte se choisit par la position, de façon déterministe et cyclique', () => {
    const n = BOOK_PALETTE.length;
    expect(BOOK_PALETTE[0 % n]).toBe(BOOK_PALETTE[0]);
    expect(BOOK_PALETTE[n % n]).toBe(BOOK_PALETTE[0]);
    expect(BOOK_PALETTE[(n + 3) % n]).toBe(BOOK_PALETTE[3]);
  });
});
