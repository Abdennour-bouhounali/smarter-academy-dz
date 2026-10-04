import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import BridgePath from './BridgePath';
import ManipulationWorkspace from '../ManipulationWorkspace';
import { LEVELS } from '../levels';

/**
 * bridge-path se rend aux deux niveaux de levels.js (la passerelle du Rhummel ; la rue de l'école du manuel), seul et
 * dans un workspace, sans clé i18n brute, sans interpolation oubliée, et sans la longueur minimale écrite au départ.
 */
const RAW = /manipulation\.[a-zA-Z]/;

describe('bridge-path — rendu', () => {
  it('advanced (وضعية): la rue, le passage, la poignée, la lecture — la réponse nulle part', () => {
    const html = renderToString(<BridgePath theme="crosswalk" {...LEVELS['bridge-path'].advanced.numbers} />);
    expect(html).toContain('data-bridge-path');
    expect(html).toContain('data-world="crosswalk"');
    expect(html).toContain('data-stage="explore"');
    expect(html).toContain('data-bp-glance');
    expect(html).toContain('data-bp-handle="2"');
    expect(html).toContain('data-deco="crosswalk"');
    expect(html).toContain('role="slider"');
    expect(html).not.toContain('data-bp-pin');
    expect(html).not.toContain('data-bp-open');
    expect(html).not.toContain('11,22');
    expect(html).not.toContain('11{,}22');
    expect(html).not.toContain('\\sqrt{85}');
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
  });

  it('beginner: la gorge du Rhummel, la passerelle', () => {
    const html = renderToString(<BridgePath theme="bridge" level="beginner" {...LEVELS['bridge-path'].beginner.numbers} />);
    expect(html).toContain('data-world="bridge"');
    expect(html).toContain('data-deco="bridge"');
    expect(html).toContain('data-bp-crossing');
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
  });

  it('numbers groupés (contrat de la leçon) et workspace : deux niveaux montés, un seul sélecteur', () => {
    const html = renderToString(
      <ManipulationWorkspace defaultLevel="advanced" levels={{
        beginner: () => <BridgePath level="beginner" theme="bridge" numbers={LEVELS['bridge-path'].beginner.numbers} />,
        advanced: () => <BridgePath level="advanced" theme="crosswalk" numbers={LEVELS['bridge-path'].advanced.numbers} />,
      }} />,
    );
    expect((html.match(/data-bridge-path/g) ?? []).length).toBe(2);
    expect(html).toContain('data-world="bridge"');
    expect(html).toContain('data-world="crosswalk"');
    expect(html).not.toMatch(RAW);
  });
});
