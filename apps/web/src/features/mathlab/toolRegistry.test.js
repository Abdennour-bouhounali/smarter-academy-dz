import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { MATH_LAB_TOOLS, PLANNED_MATH_LAB_TOOLS, getMathLabTool, getMathLabToolBySlug } from './toolRegistry.js';
import { defineMathLabTool } from './toolContract.js';

const here = dirname(fileURLToPath(import.meta.url));

/**
 * Le registre du مختبر : chaque instrument respecte le contrat, aucun n'en
 * cache un autre, et le serveur connaît exactement les mêmes identifiants.
 */
describe('registre des instruments', () => {
  it('ne contient que des définitions complètes et figées', () => {
    for (const tool of MATH_LAB_TOOLS) {
      expect(Object.isFrozen(tool)).toBe(true);
      expect(() => defineMathLabTool(tool)).not.toThrow();
    }
  });

  it('a des identifiants et des segments d’URL uniques', () => {
    const ids = MATH_LAB_TOOLS.map((t) => t.id);
    const slugs = MATH_LAB_TOOLS.map((t) => t.slug);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('expose la سبّورة sous /espace/atelier/tableau, le grapheur sous /espace/atelier/grapheur, la géométrie 3D sous /espace/atelier/geometrie-3d', () => {
    expect(getMathLabTool('whiteboard')?.slug).toBe('tableau');
    expect(getMathLabToolBySlug('tableau')?.id).toBe('whiteboard');
    expect(getMathLabTool('functionGrapher')?.slug).toBe('grapheur');
    expect(getMathLabToolBySlug('grapheur')?.id).toBe('functionGrapher');
    expect(getMathLabTool('geometry3d')?.slug).toBe('geometrie-3d');
    expect(getMathLabToolBySlug('geometrie-3d')?.id).toBe('geometry3d');
    expect(getMathLabTool('probabilityStats')?.slug).toBe('probabilites-statistiques');
    expect(getMathLabToolBySlug('probabilites-statistiques')?.id).toBe('probabilityStats');
    expect(getMathLabToolBySlug('inconnu')).toBeNull();
    expect(getMathLabTool('graph')).toBeNull();
  });

  // Un instrument construit ne doit pas rester annoncé « قريبًا » : le
  // laboratoire des probabilités et statistiques livre à lui seul ce que
  // « الإحصاء » et « الاحتمالات » promettaient, donc les deux ont quitté
  // la liste des instruments à venir.
  it('n’annonce plus ce qui est livré', () => {
    const plannedIds = PLANNED_MATH_LAB_TOOLS.map((tool) => tool.id);
    expect(plannedIds).not.toContain('statistics');
    expect(plannedIds).not.toContain('probability');
    expect(plannedIds).not.toContain('probabilityStats');
  });

  it('les instruments annoncés ne sont pas des instruments : ni composant, ni route', () => {
    const active = new Set(MATH_LAB_TOOLS.map((t) => t.id));
    for (const planned of PLANNED_MATH_LAB_TOOLS) {
      expect(active.has(planned.id)).toBe(false);
      expect(planned.labelKey).toMatch(/^tools\.\w+\.name$/);
      expect(planned.icon).toBeTruthy();
      expect(planned.load).toBeUndefined();
      expect(planned.slug).toBeUndefined();
    }
  });

  it('le registre serveur (MathLabTools.php) connaît exactement les mêmes identifiants', () => {
    const php = readFileSync(resolve(here, '../../../../api/app/Domain/MathLab/MathLabTools.php'), 'utf8');
    const serverIds = [...php.matchAll(/^\s*'([a-zA-Z0-9]+)'\s*=>\s*\['maxBytes'/gm)].map((m) => m[1]).sort();
    const clientIds = MATH_LAB_TOOLS.map((t) => t.id).sort();
    expect(serverIds).toEqual(clientIds);
  });

  it('chaque libellé du registre existe dans le catalogue arabe', () => {
    const catalog = JSON.parse(readFileSync(resolve(here, '../../i18n/locales/ar/mathlab.json'), 'utf8'));
    const lookup = (key) => key.split('.').reduce((node, part) => node?.[part], catalog);
    for (const tool of MATH_LAB_TOOLS) {
      for (const key of [tool.labelKey, tool.descriptionKey, tool.newLabelKey, tool.defaultTitleKey]) {
        expect(typeof lookup(key), key).toBe('string');
      }
    }
    for (const planned of PLANNED_MATH_LAB_TOOLS) {
      expect(typeof lookup(planned.labelKey), planned.labelKey).toBe('string');
    }
  });
});

describe('defineMathLabTool', () => {
  const valid = {
    id: 'demo', slug: 'demo', labelKey: 'a', descriptionKey: 'b', newLabelKey: 'c', defaultTitleKey: 'd',
    icon: () => null, schemaVersion: 1, createInitialData: () => ({}), load: () => Promise.resolve({ default: () => null }),
  };

  it('refuse une définition incomplète, au chargement et non au premier clic', () => {
    expect(() => defineMathLabTool({ ...valid, load: undefined })).toThrow(/load/);
    expect(() => defineMathLabTool({ ...valid, id: 'Bad-Id' })).toThrow(/identifiant/);
    expect(() => defineMathLabTool({ ...valid, slug: 'Tableau' })).toThrow(/URL/);
    expect(() => defineMathLabTool({ ...valid, schemaVersion: 0 })).toThrow(/schemaVersion/);
  });

  it('fige la définition', () => {
    const tool = defineMathLabTool(valid);
    expect(Object.isFrozen(tool)).toBe(true);
    expect(tool.id).toBe('demo');
  });
});
