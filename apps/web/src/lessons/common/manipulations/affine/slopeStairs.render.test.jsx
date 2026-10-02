import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import SlopeStairs from './SlopeStairs';

/**
 * slope-stairs se rend avec les props EXACTES de la leçon 3 (tanasub-taghayyurat) : l'escalier du
 * manuel (نشاط 4, stade), le préréglage مبتدئ (50x + 100), et le تحدّ (deux couples, thermomètre) —
 * sans clé i18n brute, avec le bloc « glance » que l'e2e de l'unité mesure.
 */
const RAW = /manipulation\.[a-zA-Z]/;

describe('slope-stairs — les props de la leçon', () => {
  it('نشاط 4 (متقدم) : la droite, six marches dont deux imprimées, les deux poignées, la carte d\'abonnement', () => {
    const html = renderToString(<SlopeStairs rule="200x+2000" marks="0|1|4|6|10|12|15" shown={2} theme="stadium" />);
    expect(html).toContain('data-slope-stairs');
    expect(html).toContain('data-mode="rule"');
    expect(html).toContain('data-ss-glance');
    expect(html).toContain('data-ss-line="f(x) = 200x + 2000"');
    expect((html.match(/data-ss-ghost=/g) ?? []).length).toBe(6);
    expect((html.match(/data-printed="true"/g) ?? []).length).toBe(2);
    expect(html).toContain('data-ss-handle="1"');
    expect(html).toContain('data-ss-handle="2"');
    expect(html).toContain('data-ss-less="1"');
    expect(html).toContain('data-ss-more="2"');
    expect(html).toContain('data-ss-fill');
    expect(html).toContain('data-total="4"');
    expect(html).toContain('data-deco="stadium"');
    expect(html).toContain('data-q="200"');
    expect(html).toContain('عدد المقابلات x');
    expect(html).not.toMatch(RAW);
  });

  it('مبتدئ (plateforme) : 50x + 100, deux marches à compléter', () => {
    const html = renderToString(<SlopeStairs rule="50x+100" marks="0|2|4" theme="stadium" />);
    expect((html.match(/data-ss-ghost=/g) ?? []).length).toBe(2);
    expect(html).toContain('data-q="50"');
    expect(html).not.toMatch(RAW);
  });

  it('le تحدّ (deux couples) : f inconnue, pas de droite, les deux points donnés, le thermomètre', () => {
    const html = renderToString(<SlopeStairs points="10:50|30:86" theme="thermo" />);
    expect(html).toContain('data-mode="points"');
    expect(html).toContain('data-found="false"');
    expect(html).not.toContain('data-ss-line=');
    expect(html).toContain('data-ss-given="10:50"');
    expect(html).toContain('data-ss-given="30:86"');
    expect(html).toContain('data-deco="thermo"');
    expect(html).toContain('بالسلسيوس');
    // aucune graduation °F ne donne b
    expect(html).not.toContain('°F');
    expect(html).not.toMatch(RAW);
  });

  it('un contrat incomplet est une erreur de contenu', () => {
    expect(() => renderToString(<SlopeStairs points="10:50" />)).toThrow();
  });
});
