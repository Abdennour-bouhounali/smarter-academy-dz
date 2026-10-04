import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import MidpointDistance from './MidpointDistance';
import ManipulationWorkspace from '../ManipulationWorkspace';
import { LEVELS } from '../levels';

/**
 * midpoint-distance se rend aux deux niveaux de levels.js (le rendez-vous des Sablettes ; le نشاط 3 à Oran), seul et
 * dans le workspace, sans clé i18n brute, sans interpolation oubliée.
 */
const RAW = /manipulation\.[a-zA-Z]/;
const { beginner, advanced } = LEVELS['midpoint-distance'];

describe('midpoint-distance — rendu', () => {
  it('beginner: the map, the axes, the meeting pin, the four moves, the two chat proposals, the live components', () => {
    const html = renderToString(<MidpointDistance {...beginner.numbers} level="beginner" theme="gps-meet" />);
    expect(html).toContain('data-midpoint-distance');
    expect(html).toContain('data-stage="meet"');
    expect(html).toContain('data-city="alger"');
    expect(html).toContain('data-md-glance');
    expect(html).toContain('data-md-handle="M"');
    expect((html.match(/data-md-move=/g) ?? []).length).toBe(4);
    expect(html).toContain('data-md-commit');
    expect(html).toContain('data-md-proposal="sum"');
    expect(html).toContain('data-md-proposal="diff"');
    expect(html).toContain('data-md-axes');
    expect(html).toContain('data-md-shadows');
    expect(html).toContain('data-md-arrow="AM"');
    expect(html).toContain('data-deco="map"'); // la trottinette (bouton décor) n'apparaît qu'au-delà de 380 px
    expect(html).not.toContain('data-md-next');
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
  });

  it('advanced (نشاط 3): K, L and J, no live reading before the pin is fixed, Oran', () => {
    const html = renderToString(<MidpointDistance {...advanced.numbers} level="advanced" theme="gps-meet" />);
    expect(html).toContain('data-city="oran"');
    expect(html).toContain('data-md-handle="M"');
    expect(html).not.toContain('data-md-shadows');
    expect(html).toContain('سارة');
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
  });

  it('inside a workspace: both levels mounted, one selector', () => {
    const html = renderToString(
      <ManipulationWorkspace defaultLevel="advanced" levels={{
        beginner: () => <MidpointDistance level="beginner" numbers={beginner.numbers} />,
        advanced: () => <MidpointDistance level="advanced" numbers={advanced.numbers} />,
      }} />,
    );
    expect((html.match(/data-midpoint-distance/g) ?? []).length).toBe(2);
    expect(html).not.toMatch(RAW);
  });
});
