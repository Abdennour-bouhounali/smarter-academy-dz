import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import SphereProbe from './SphereProbe';
import ManipulationWorkspace from '../ManipulationWorkspace';
import { LEVELS } from '../levels';

/**
 * sphere-probe se rend aux deux niveaux de levels.js, seul et dans un workspace, sans WebGL (le repli SpaceFigure occupe la
 * fenêtre 3D), avec TOUTES ses commandes HTML, sans clé i18n brute ni interpolation oubliée — et sans aucun verdict écrit avant
 * que l'élève n'ait jugé.
 */
const RAW = /manipulation\.[a-zA-Z]/;

describe('sphere-probe — rendu', () => {
  it('مبتدئ : la lampe-globe, la sonde M, les sondes A, B, C, trois déclarations, OM² lu, aucun verdict', () => {
    const html = renderToString(<SphereProbe level="beginner" {...LEVELS['sphere-probe'].beginner.numbers} />);
    expect(html).toContain('data-sphere-probe');
    expect(html).toContain('data-world="glass-globe"');
    expect(html).toContain('data-mode="classify"');
    expect(html).toContain('data-sp-glance');
    expect(html).toContain('data-stage3d');
    expect(html).toContain('data-stage3d-fallback');
    expect(html).toContain('data-space-figure');
    for (const c of ['surface', 'inside', 'outside']) expect(html).toContain(`data-sp-claim="${c}"`);
    expect((html.match(/data-sp-coord="/g) ?? []).length).toBe(3);
    expect((html.match(/role="spinbutton"/g) ?? []).length).toBe(3);
    expect(html).toContain('data-sp-object="sphere"');
    expect(html).toContain('data-sp-object="ball"');
    expect(html).toContain('data-sp-reading');
    expect(html).toContain('data-sp-verdict="start"');
    expect((html.match(/data-sp-chip="/g) ?? []).length).toBe(3);
    expect(html).toContain('data-deco="glass-globe"');
    // aucun verdict avant la déclaration de l'élève
    for (const leak of ['صحيح', 'data-done="true"', 'data-sp-formal']) expect(html).not.toContain(leak);
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
  });

  it('متقدم : le stade, la tâche « M sur la كرة », OM jamais écrite pendant le geste', () => {
    // Les indices (formule générale) sont affichés d'emblée : « OM jamais écrite » se mesure hors d'eux.
    const html = renderToString(<SphereProbe {...LEVELS['sphere-probe'].advanced.numbers} />).replace(/<ol[^>]*data-manipulation-hints[\s\S]*?<\/ol>/, '');
    expect(html).toContain('data-world="shot-put"');
    expect(html).toContain('data-mode="tasks"');
    expect(html).toContain('data-task="surface"');
    expect(html).toContain('data-sp-place');
    expect(html).not.toContain('data-sp-claim');
    expect(html).not.toContain('data-sp-to-circles');
    expect(html).not.toContain('OM^2 =');
    expect((html.match(/data-sp-chip="/g) ?? []).length).toBe(6);
    expect(html).toContain('data-deco="shot-put"');
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
  });

  it('numbers groupés (contrat de la leçon) et workspace : deux niveaux montés, des ids SVG distincts', () => {
    const html = renderToString(
      <ManipulationWorkspace defaultLevel="advanced" levels={{
        beginner: () => <SphereProbe level="beginner" theme="glass-globe" numbers={LEVELS['sphere-probe'].beginner.numbers} />,
        advanced: () => <SphereProbe level="advanced" theme="shot-put" numbers={LEVELS['sphere-probe'].advanced.numbers} />,
      }} />,
    );
    expect((html.match(/data-sphere-probe="true"|data-sphere-probe=""/g) ?? []).length).toBe(2);
    const ids = [...html.matchAll(/ id="(sp[A-Za-z]+[^"]*)"/g)].map((m) => m[1]);
    expect(ids.length).toBeGreaterThan(3);
    expect(new Set(ids).size).toBe(ids.length);
    expect(html).not.toMatch(RAW);
  });
});
