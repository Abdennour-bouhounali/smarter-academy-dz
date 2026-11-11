import { describe, it, expect } from 'vitest';
import { LESSON_CONFIG } from '../lesson.config';

/**
 * La mission de natiqa-ghayr-natiqa (rollout 2026-11-09, revue ECC) : les points d'étape ne touchent à aucun nombre de la مسألة — les aires
 * 2,89, 4 (ses 9 pièces) et 3, les côtés 1,7 et √3, la lecture 1,74, les 12 jours et les 500 دج — ni à son argument (encadrer √3 par
 * des carrés). Et aucun texte destiné à l'élève ne renvoie au manuel.
 */
const { mission } = LESSON_CONFIG;
const text = (cp) => [cp.prompt, ...cp.options, cp.explain].join(' ');
const INTEGERS = ['4', '9', '3', '12', '500'];
/** un entier ISOLÉ (pas un chiffre d'un autre nombre, pas une décimale « 3{,}5 », pas un exposant « ^2 ») */
const isolated = (s, n) => new RegExp(`(^|[^0-9,{}^.])${n}([^0-9,{}.]|$)`).test(s);

describe('the mission of natiqa-ghayr-natiqa', () => {
  it('one checkpoint after each module before the climax', () => {
    expect(mission.climaxModule).toBe(4);
    expect(mission.checkpoints.map((c) => c.afterModule)).toEqual([1, 2, 3]);
  });
  it('the checkpoints never use the climax numbers', () => {
    mission.checkpoints.forEach((cp) => {
      const s = text(cp);
      ['2{,}89', '2,89', '1{,}7', '1,7', '1{,}74', '\\sqrt{3}'].forEach((x) => expect(s.includes(x), `${cp.id} ${x}`).toBe(false));
      INTEGERS.forEach((n) => expect(isolated(s, n), `${cp.id} ${n}`).toBe(false));
    });
  });
  it('each checkpoint has its right answer among three options', () => {
    mission.checkpoints.forEach((cp) => { expect(cp.options).toHaveLength(3); expect(cp.options[cp.correct]).toBeTruthy(); });
  });
  it('no student-visible line of the config sends to the textbook', () => {
    const visible = [mission.title, mission.opening.text, ...mission.tools.map((t) => t.label), ...mission.checkpoints.map(text),
      ...LESSON_CONFIG.modules.map((m) => `${m.title} ${m.desc}`), ...LESSON_CONFIG.resources.map((r) => `${r.title} ${r.objective} ${r.autonomy ?? ''}`)];
    visible.forEach((s) => expect(s.includes('الكتاب'), s).toBe(false));
  });
});
