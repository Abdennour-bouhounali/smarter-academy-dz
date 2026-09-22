import { describe, it, expect } from 'vitest';
import { groupingLayout, itemWidthFor, perRowFor } from './groupingLayout';
import { ITEM_THEME_IDS } from './itemThemes';
import { VISUAL_THEME_IDS } from '@smarter-academy/core';

/* Les nombres du manuel : 90 fleurs rouges et 54 blanches (activité 4),
   12 et 18 (معارف 3), 8 et 12, 17 et 18 (activité 7), 84/48 (activité 8). */

describe('groupingLayout — la répartition dessinée dit la même chose que la division', () => {
  it('9 bouquets de 90 et 54 : 10 rouges et 6 blanches chacun, rien ne reste', () => {
    const g = groupingLayout({ a: 90, b: 54, k: 9 });
    expect([g.qa, g.qb, g.ra, g.rb, g.works]).toEqual([10, 6, 0, 0, true]);
    expect(g.shown).toBe(9);
    expect(g.hidden).toBe(0);
  });

  it('18 bouquets : le PGCD, 5 rouges et 3 blanches chacun', () => {
    const g = groupingLayout({ a: 90, b: 54, k: 18 });
    expect([g.qa, g.qb, g.works]).toEqual([5, 3, true]);
  });

  it('4 bouquets : 90 tombe juste (22, reste 2) mais 54 aussi (13, reste 2) — les restes SONT dessinés', () => {
    const g = groupingLayout({ a: 90, b: 54, k: 4 });
    expect([g.qa, g.ra, g.qb, g.rb, g.works]).toEqual([22, 2, 13, 2, false]);
  });

  it('17 et 18 en 2 trousses : un stylo reste — le seul k qui marche est 1', () => {
    expect(groupingLayout({ a: 17, b: 18, k: 2 }).works).toBe(false);
    expect(groupingLayout({ a: 17, b: 18, k: 1 }).works).toBe(true);
    for (let k = 2; k <= 17; k += 1) expect(groupingLayout({ a: 17, b: 18, k }).works, `k = ${k}`).toBe(false);
  });

  it('84 et 48 en 4 parts : 21 et 12 par part — la recette réduite', () => {
    const g = groupingLayout({ a: 84, b: 48, k: 4 });
    expect([g.qa, g.qb, g.works]).toEqual([21, 12, true]);
  });

  it('au-delà de maxGroups les groupes sont résumés, jamais tronqués en silence', () => {
    const g = groupingLayout({ a: 90, b: 54, k: 27, maxGroups: 18 });
    expect(g.shown).toBe(18);
    expect(g.hidden).toBe(9);
    expect(g.shown + g.hidden).toBe(27);
  });

  it('sans nombre de groupes, la scène montre les deux piles entières', () => {
    const g = groupingLayout({ a: 90, b: 54, k: null });
    expect(g.k).toBeNull();
    expect(g.works).toBeNull();
    expect(g.itemWidth).toBe(10);
  });

  it('la taille des objets suit la charge d’un groupe — jamais plus petite que lisible', () => {
    expect(itemWidthFor(3)).toBeGreaterThan(itemWidthFor(30));
    expect(itemWidthFor(30)).toBeGreaterThan(itemWidthFor(200));
    expect(itemWidthFor(200)).toBeGreaterThanOrEqual(10);
    expect(perRowFor(200)).toBeLessThanOrEqual(12);
    expect(perRowFor(3)).toBeGreaterThanOrEqual(3);
  });
});

describe('les thèmes d’objets sont des thèmes du registre fermé', () => {
  it('chaque thème dessiné existe dans VISUAL_THEMES (packages/core)', () => {
    for (const id of ITEM_THEME_IDS) expect(VISUAL_THEME_IDS, id).toContain(id);
  });
});
