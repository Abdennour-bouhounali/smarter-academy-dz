import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { getModulePath, getLessonConfig, getAnyRegisteredLessonId } from '../../../registry';

const here = dirname(fileURLToPath(import.meta.url));
const srcRoot = resolve(here, '../../../..');

/**
 * « Continuer » menait l'élève à la page d'accueil marketing.
 *
 * Le modèle de progression raisonne en NUMÉROS de module (1, 2, 3…) ; les
 * routes, elles, sont déclarées avec le CHEMIN du module, construit sur son
 * slug. Les trois appelants assemblaient `${lesson.path}/${numéro}` — une URL
 * qui ne correspond à aucune route. React Router la fait alors retomber sur
 * `*`, c'est-à-dire la page d'accueil, SANS erreur : ni la console, ni les
 * tests, ni le build ne pouvaient le signaler. Seul un clic le révélait.
 *
 * Ces tests verrouillent les deux moitiés du correctif : le pont numéro →
 * chemin, et l'absence de tout retour à l'assemblage manuel.
 *
 * Le test tire sa leçon-fixture du registre ACTIF plutôt que de coder en dur
 * 'fonction-affine-2nde' (une leçon de seconde, désormais dormante pour
 * l'Algérie — voir activeGrades.js) : le pont numéro → chemin doit être
 * vérifié sur une leçon réellement enregistrée, quelle que soit la classe
 * active du moment. `describe.skipIf` couvre le cas transitoire où aucune
 * classe n'est encore active (avant la Phase 7 du roadmap Algérie).
 */
const fixtureLessonId = getAnyRegisteredLessonId();

describe.skipIf(!fixtureLessonId)('getModulePath — le pont entre numéro et route', () => {
  const config = fixtureLessonId ? getLessonConfig(fixtureLessonId) : null;
  const secondModule = config?.modules?.find((m) => Number(m.number) === config.modules[0]?.number + 1) ?? config?.modules?.[1];

  it('rend le chemin par SLUG du module, jamais son numéro', () => {
    const path = getModulePath(fixtureLessonId, secondModule.number);
    expect(path).toBe(secondModule.path);
    expect(path).not.toMatch(new RegExp(`/${secondModule.number}$`));
  });

  it('accepte un numéro donné sous forme de chaîne', () => {
    expect(getModulePath(fixtureLessonId, String(secondModule.number))).toBe(getModulePath(fixtureLessonId, secondModule.number));
  });

  it('rend null — et non une URL fabriquée — pour un module ou une leçon inconnus', () => {
    expect(getModulePath(fixtureLessonId, 999999)).toBeNull();
    expect(getModulePath('lecon-qui-nexiste-pas', 1)).toBeNull();
    expect(getModulePath(fixtureLessonId, undefined)).toBeNull();
    expect(getModulePath(undefined, 1)).toBeNull();
  });

  it('rend, pour CHAQUE module de la leçon, exactement le chemin que la route déclare', () => {
    for (const m of config.modules) {
      expect(getModulePath(fixtureLessonId, m.number)).toBe(m.path);
    }
  });
});

describe('les appelants n’assemblent plus l’URL à la main', () => {
  const CALLERS = [
    'pages/Courses.jsx',
    'pages/student/StudentHome.jsx',
    'components/student/StudentHomeBanner.jsx',
  ];

  it.each(CALLERS)('%s utilise resumePath', (file) => {
    const src = readFileSync(resolve(srcRoot, file), 'utf8');
    expect(src).toMatch(/continueCourse\.resumePath/);
  });

  it('aucun fichier ne recolle un chemin de leçon à un numéro de module', () => {
    const offenders = [];
    const walk = (dir) => {
      for (const name of readdirSync(dir)) {
        const full = join(dir, name);
        if (statSync(full).isDirectory()) { walk(full); continue; }
        if (!/\.jsx?$/.test(name) || /\.test\./.test(name)) continue;
        const src = readFileSync(full, 'utf8');
        // La signature du défaut : `${...path}/${...resumeModule}`.
        if (/\$\{[^}]*\.path\}\/\$\{[^}]*resumeModule\}/.test(src)) {
          offenders.push(full.slice(srcRoot.length + 1));
        }
      }
    };
    walk(srcRoot);
    expect(offenders).toEqual([]);
  });
});
