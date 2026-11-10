import { describe, it, expect } from 'vitest';

/**
 * Unité 2 — ce que l'élève LIT de la mission et de la carte des معارف (revue ECC 2026-11-10) :
 *   - aucun caractère de contrôle dans un point d'étape (« \times » dans une chaîne JS à apostrophes devient TAB + « imes ») ;
 *   - aucune ligne de la carte des معارف (knowledgeGraph.js) ne renvoie au manuel.
 */
const configs = import.meta.glob('../*/lesson.config.js', { eager: true });
const graphs = import.meta.glob('../*/knowledgeGraph.js', { eager: true });
const CONTROL = /[\t\n\r\f\v\b]/;

describe('unit 2 — mission strings and knowledge maps', () => {
  it('found the lessons', () => {
    expect(Object.keys(configs).length).toBeGreaterThanOrEqual(5);
    expect(Object.keys(graphs).length).toBeGreaterThanOrEqual(5);
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
  it('no knowledge-map line sends the student to the textbook', () => {
    Object.entries(graphs).forEach(([path, m]) => {
      expect(JSON.stringify(m.KNOWLEDGE_GRAPH ?? {}).includes('الكتاب'), path).toBe(false);
    });
  });
});
