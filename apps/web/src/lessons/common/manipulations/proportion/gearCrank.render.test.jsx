import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import i18n from '../../../../i18n';
import GearCrank, { discoveryOptions, Formal } from './GearCrank';
import { LEVELS } from '../levels';
import * as L from '../logic/gearCrank';

const RAW = /manipulation\.[a-zA-Z]/;
const html = (props) => renderToString(<GearCrank {...props} />);
const text = (out) => out.replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<svg[\s\S]*?<\/svg>/g, (m) => m.replace(/<(?!\/?text)[^>]+>/g, ' ')).replace(/<[^>]+>/g, ' ').replace(/[⁦⁩]/g, '').replace(/\s+/g, ' ');
const prose = (out) => text(out.replace(/<span class="katex[\s\S]*?<\/span><\/span><\/span>/g, ' ').replace(/<math[\s\S]*?<\/math>/g, ' '));
const k = (key, o) => i18n.t(`lesson:manipulation.gearCrank.${key}`, o);
const LV = LEVELS['gear-crank'];
const HOOKS = ['data-gear-crank', 'data-gc-glance', 'data-gc-stage', 'data-gc-crank', 'data-gc-teeth-less', 'data-gc-teeth-more', 'data-gc-pedal', 'data-gc-wheel', 'data-gc-flag', 'data-gc-verdict', 'data-gc-free', 'data-gc-free-f', 'data-gc-free-r', 'data-gc-free-target', 'role="slider"'];

describe('gear-crank — rendu', () => {
  for (const level of ['beginner', 'advanced']) {
    it(`${level} : la vue d'ensemble, la scène, deux compteurs, le panneau libre ; ni clé brute ni prose latine`, () => {
      const out = html({ ...LV[level].numbers, level });
      for (const hook of HOOKS) expect(out, hook).toContain(hook);
      expect(out).not.toContain('data-gc-next');
      expect(out).not.toContain('data-gc-formal');
      expect(out).not.toMatch(RAW);
      expect(out).not.toContain('{{');
      const words = (prose(out).match(/[A-Za-z]{2,}/g) ?? []).filter((w) => !['a', 'b', 'c', 'x', 't', 'F', 'R'].includes(w));
      expect(words).toEqual([]);
    });
  }

  it('نموذج m1 : le plateau de 48 dents et le pignon de 24 sont dessinés avec leurs dents', () => {
    const out = html({ ...LV.beginner.numbers, level: 'beginner' });
    expect(out).toContain('data-gc-gear="48"');
    expect(out).toContain('data-gc-gear="24"');
    expect(out).toContain('data-gc-valve');
  });

  it('مبتدئ : les compteurs sont lisibles en direct (0) ; متقدم : la manivelle est bloquée et la prédiction attendue', () => {
    const b = html({ ...LV.beginner.numbers, level: 'beginner' });
    expect(b).toContain('data-veiled="false"');
    expect(b).not.toContain('data-gc-predict');
    const a = html({ ...LV.advanced.numbers, level: 'advanced' });
    expect(a).toContain('data-gc-predict');
    expect(a).toContain('data-gc-predict-num');
    expect(a).toContain('data-gc-predict-den');
    expect(a).toContain('data-gc-go');
    expect(a).toContain('data-locked="true"');
    expect(a).toContain('data-gc-lock');
    expect(a).toContain('disabled');
  });

  it('ouvre sur son CONTEXTE puis UNE question qui nomme le but (§17.9), sans titre visible', () => {
    const out = html({ ...LV.beginner.numbers, level: 'beginner' });
    expect(out).toContain('data-lab-context');
    expect(out).toContain('data-lab-question');
    const t = text(out);
    expect(t).toContain('على درّاجة النادي صحنٌ أمامي فيه 48 سنًّا وترسٌ خلفي فيه 24 سنًّا');
    expect(t).toContain('العلم على بُعد 3 دورات للعجلة');
    expect(t).toContain(k('question.ride'));
    // ni titre visible : le titre du shell est sr-only
    expect(out).toMatch(/<h3 class="sr-only">/);
  });

  it('dit chaque chose UNE fois : la consigne, les titres des compteurs et la question ne se répètent pas', () => {
    const t = text(html({ ...LV.beginner.numbers, level: 'beginner' }));
    const count = (s) => t.split(s).length - 1;
    expect(count(k('question.ride'))).toBe(1);
    expect(count(k('counter.pedal'))).toBe(1);
    expect(count(k('counter.wheel'))).toBe(1);
    expect(count(k('idle.ride'))).toBe(1);
    expect(count('على درّاجة النادي')).toBe(1);
    expect(count(k('free.title'))).toBe(1);
  });

  it('le monde `reverse` : les deux tâches, jamais de découverte, le contexte « نقلت لينا السلسلة » à la 2e', () => {
    const out = html({ ...L.PRESETS.reverse, levels: false });
    expect(out).toContain('data-world="reverse"');
    expect(out).toContain('data-gc-step="1"');
    expect(out).not.toContain('data-gc-formal');
    expect(out).not.toMatch(RAW);
    expect(text(out)).toContain('العلم على بُعد دورة واحدة للعجلة');
    expect(k('context.moved', { F: 24, R: 40, turns: 'x' })).toContain('نقلت لينا السلسلة');
  });

  it('les grammaires du nombre de tours : دورة واحدة / دورتين / n دورات / n دورة / fraction', () => {
    const one = html({ tasks: [{ id: 't', F: 24, R: 24, target: '1' }], levels: false });
    expect(text(one)).toContain('العلم على بُعد دورة واحدة للعجلة');
    const frac = html({ tasks: [{ id: 't', F: 36, R: 48, target: '9/2' }], levels: false });
    expect(text(frac)).toContain('9/2 دورة للعجلة');
    const two = html({ tasks: [{ id: 't', F: 24, R: 24, target: '2' }], levels: false });
    expect(text(two)).toContain('دورتين للعجلة');
  });

  it('les réfutations de la découverte citent SES tâches (m1 : 3 → 3/2, m2 : 6 → 8, 6 × 3/4 = 9/2)', () => {
    let s = L.init(LV.beginner.numbers);
    for (let i = 0; i < 3; i += 1) { s = L.release(L.turnTo(s, L.taskOf(s).goalTeeth)); s = L.nextTask(s); }
    expect(L.discoveryReady(s)).toBe(true);
    const opts = discoveryOptions(s, k);
    expect(opts.filter((o) => o.correct)).toHaveLength(1);
    const wrong = opts.filter((o) => !o.correct).map((o) => renderToString(<span>{o.why}</span>)).join(' ').replace(/[⁦⁩]/g, '');
    expect(wrong).toContain('3 دورات');
    expect(wrong).toContain('3/2 دورة');
    expect(wrong).toContain('5 دورات');
    expect(wrong).toContain('9/2');
    const formal = renderToString(<Formal lab={s} k={k} />);
    expect(formal).toContain('data-gc-formal');
    expect(formal).toContain('frac');
  });
});

describe('gear-crank — questions pendant le labo (LabCheckpoint)', () => {
  it('m1 · m2 · m3 : chaque question a un texte, une seule bonne réponse, deux indices, et ni clé brute ni {{', async () => {
    const { CHAINS, QUESTIONS } = await import('./GearCrank');
    let s = L.init(LV.beginner.numbers);
    for (let i = 0; i < 3; i += 1) { s = L.release(L.turnTo(s, L.taskOf(s).goalTeeth)); if (i < 2) s = L.nextTask(s); }
    for (const tk of s.tasks) {
      for (const qid of CHAINS[tk.id]) {
        const q = QUESTIONS[qid](s, tk, k);
        const out = renderToString(<div>{q.prompt}{q.options?.map((o, i) => <span key={i}>{o.text}{o.why}</span>)}{q.hints}{q.explain}</div>);
        expect(out, `${tk.id}.${qid}`).not.toMatch(RAW);
        expect(out, `${tk.id}.${qid}`).not.toContain('{{');
        expect(q.hints, `${tk.id}.${qid}`).toHaveLength(2);
        if (q.kind === 'choice') expect(q.options.filter((o) => o.correct), `${tk.id}.${qid}`).toHaveLength(1);
        else expect(q.expected).toBeTruthy();
      }
    }
    expect(QUESTIONS.read(s, s.tasks[1], k).expected).toBe('8');
    expect(QUESTIONS.read(s, s.tasks[2], k).expected).toBe('4/3');
    expect(QUESTIONS.compare(s, s.tasks[0], k).options[0].correct).toBe(true);   // 3/2 < 3 : la pédale tourne MOINS
  });
});
