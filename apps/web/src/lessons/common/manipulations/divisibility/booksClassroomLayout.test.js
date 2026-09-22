import { describe, it, expect } from 'vitest';
import { solveShelfLayout, MIN_BOOK_WIDTH, MAX_BOOK_WIDTH, BOOK_RATIO } from './booksClassroomLayout';

/**
 * Ce que ces tests verrouillent, sur les nombres du manuel (420 ÷ 26 → 16
 * rayons, 420 ÷ 28 → 15, 420 ÷ 10 → 42, 420 ÷ 60 → 7) et les écrans visés :
 * un rayon = une rangée, un livre ne descend jamais sous la taille lisible,
 * et quand tout tient on choisit les livres les plus grands possibles.
 */
const grid = (cols, rows, bookW) => ({ cols, rows, bookW });

// Hauteur d'une grille de `rows` rangées avec des livres de `bookW` (même modèle que le solveur).
const gridHeight = ({ rows, bookW, gap }, scale = 1) => rows * (bookW * BOOK_RATIO + Math.round(46 * scale)) + (rows - 1) * gap;

describe('solveShelfLayout — 16 rayons de 26 (420 ÷ 26)', () => {
  it('sur un grand écran (1920×1080) tout tient, avec des livres de la taille de ceux de la leçon (~22 px)', () => {
    const l = solveShelfLayout({ width: 1450, height: 800, shelves: 16, capacity: 26 });
    expect(l.fits).toBe(true);
    expect(l.bookW).toBeGreaterThanOrEqual(20);
    expect(l.cols * l.rows).toBeGreaterThanOrEqual(16);
    expect(gridHeight(l)).toBeLessThanOrEqual(800);
  });

  it('sur un projecteur 1366×768 le solveur ne descend pas sous la taille lisible ; la grille défile en interne', () => {
    const l = solveShelfLayout({ width: 1050, height: 520, shelves: 16, capacity: 26 });
    expect(l.bookW).toBeGreaterThanOrEqual(MIN_BOOK_WIDTH);
    expect(l.cols).toBeGreaterThanOrEqual(1);
    // Une rangée par rayon : la largeur des 26 livres tient dans la colonne.
    const colW = (1050 - (l.cols - 1) * l.gap) / l.cols;
    expect(26 * l.bookW + 25 * l.bookGap).toBeLessThanOrEqual(colW);
  });

  it('ne décide pas des livres au sol (leur taille est en CSS, indépendante de la grille)', () => {
    const l = solveShelfLayout({ width: 1050, height: 520, shelves: 16, capacity: 26 });
    expect(l).not.toHaveProperty('floorBookW');
  });
});

describe('solveShelfLayout — autres tailles du manuel', () => {
  it('15 rayons de 28 (420 ÷ 28) : même logique, rien de spécial', () => {
    const l = solveShelfLayout({ width: 1450, height: 800, shelves: 15, capacity: 28 });
    expect(l.fits).toBe(true);
    expect(l.cols * l.rows).toBeGreaterThanOrEqual(15);
  });

  it('42 rayons de 10 (420 ÷ 10) : beaucoup de colonnes, livres lisibles', () => {
    const l = solveShelfLayout({ width: 1450, height: 800, shelves: 42, capacity: 10 });
    expect(l.cols).toBeGreaterThanOrEqual(4);
    expect(l.bookW).toBeGreaterThanOrEqual(MIN_BOOK_WIDTH);
    expect(l.cols * l.rows).toBeGreaterThanOrEqual(42);
  });

  it('7 rayons de 60 (420 ÷ 60) : une colonne, la rangée de 60 tient en largeur', () => {
    const l = solveShelfLayout({ width: 1450, height: 800, shelves: 7, capacity: 60 });
    expect(l.cols).toBe(1);
    expect(60 * l.bookW + 59 * l.bookGap).toBeLessThanOrEqual(1450);
    expect(l.bookW).toBeGreaterThanOrEqual(MIN_BOOK_WIDTH);
  });
});

describe('solveShelfLayout — bornes et cas limites', () => {
  it('rien à ranger → null (avant le premier choix)', () => {
    expect(solveShelfLayout({ width: 1000, height: 500, shelves: 0, capacity: 26 })).toBeNull();
    expect(solveShelfLayout({ width: 0, height: 500, shelves: 16, capacity: 26 })).toBeNull();
  });

  it('un seul rayon prend la place mais ne dépasse pas la taille maximale', () => {
    const l = solveShelfLayout({ width: 1450, height: 800, shelves: 1, capacity: 10 });
    expect(l.cols).toBe(1);
    expect(l.bookW).toBe(MAX_BOOK_WIDTH);
  });

  it('un écran étroit (téléphone 390 px) garde des livres lisibles et défile', () => {
    const l = solveShelfLayout({ width: 360, height: 400, shelves: 16, capacity: 26 });
    expect(l.bookW).toBeGreaterThanOrEqual(MIN_BOOK_WIDTH);
    expect(l.cols).toBe(1);
    expect(l.fits).toBe(false);
  });

  it('l’échelle grossit les marges, pas la borne des livres', () => {
    const a = solveShelfLayout({ width: 1450, height: 800, shelves: 16, capacity: 26, scale: 1 });
    const b = solveShelfLayout({ width: 1450, height: 800, shelves: 16, capacity: 26, scale: 1.25 });
    expect(b.gap).toBeGreaterThan(a.gap);
    expect(b.bookW).toBeLessThanOrEqual(a.bookW);
  });

  it('les sorties sont des entiers de pixels', () => {
    const l = solveShelfLayout({ width: 1234.5, height: 777.7, shelves: 16, capacity: 26, scale: 1.1 });
    for (const k of ['cols', 'rows', 'bookW', 'bookH', 'bookGap', 'gap']) {
      expect(Number.isInteger(l[k])).toBe(true);
    }
    expect(Object.is(grid(1, 1, 1).cols, 1)).toBe(true);
  });
});
