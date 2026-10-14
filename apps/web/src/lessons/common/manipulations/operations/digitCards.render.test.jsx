import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import i18n from '../../../../i18n';
import DigitCards, { numbersFor } from './DigitCards';
import ManipulationWorkspace from '../ManipulationWorkspace';
import { LEVELS } from '../levels';

/**
 * digit-cards se rend aux deux niveaux de levels.js (la table du نشاط 4 ; les cartes du تمرين 26), sans clé i18n
 * brute, sans interpolation oubliée, sans prose latine, et sans case pré-coloriée ni lampe ouverte.
 */
const RAW = /manipulation\.[a-zA-Z]/;
const html = (props) => renderToString(<DigitCards {...props} />);
/** Le texte visible (hors balises) : aucune prose latine (a, b, q isolés sont des lettres de formule). */
const latinWords = (out) => {
  const text = out.replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ');
  return text.match(/[A-Za-z]{2,}/g) ?? [];
};
const attrs = (out, name) => [...out.matchAll(new RegExp(`${name}="([^"]*)"`, 'g'))].map((m) => m[1]);
const say = (key, o) => i18n.t(`lesson:manipulation.digitCards.${key}`, o);

describe('digit-cards — rendu', () => {
  it('beginner (grid, نشاط 4): 49 cells 0..48, nothing coloured, three colourings in order, no « أكمل » yet', () => {
    const out = html({ ...LEVELS['digit-cards'].beginner.numbers });
    expect(out).toContain('data-digit-cards');
    expect(out).toContain('data-mode="grid"');
    expect(out).toContain('data-solved="false"');
    expect(out).toContain('data-dc-glance');
    expect(out).toContain('data-dc-table');
    expect(attrs(out, 'data-dc-cell').map(Number)).toEqual(Array.from({ length: 49 }, (_, i) => i));
    expect(attrs(out, 'data-colour').every((c) => c === '')).toBe(true);
    expect(attrs(out, 'data-dc-colouring')).toEqual(['2', '5', '3']);
    expect(attrs(out, 'data-open')).toEqual(['false', 'false', 'false']);
    expect(out).toContain('data-dc-ledger');
    expect(out).toContain('data-dc-board');
    expect(out).not.toContain('data-dc-remainder');
    expect(out).not.toContain('data-dc-reveal');
    expect(out).not.toContain('data-dc-refused');
    expect(out).not.toContain('data-dc-formal');
    expect(out).toContain('data-manipulation-levels-selector');
    expect(out).not.toMatch(RAW);
    expect(out).not.toContain('{{');
    expect(latinWords(out)).toEqual([]);
  });

  it('advanced (cards, تمرين 26): four cards in the tray, four empty slots, five CLOSED lamps, the first target', () => {
    const out = html({ ...LEVELS['digit-cards'].advanced.numbers });
    expect(out).toContain('data-mode="cards"');
    expect(attrs(out, 'data-dc-card')).toEqual(['4', '5', '9', '3']);
    expect(attrs(out, 'data-placed')).toEqual(['false', 'false', 'false', 'false']);
    expect(attrs(out, 'data-dc-slot')).toEqual(['0', '1', '2', '3']);
    expect(out).toContain('data-dc-tray');
    expect(attrs(out, 'data-dc-lamp')).toEqual(['2', '3', '5', '4', '9']);
    expect(attrs(out, 'data-state')).toEqual(['closed', 'closed', 'closed', 'closed', 'closed']);
    expect(attrs(out, 'data-dc-claim')).toHaveLength(10);
    expect(attrs(out, 'data-dc-task')).toEqual(['2', '3', '5', '4', '9']);
    expect(out).toContain('data-dc-submit');
    expect(out).toContain('data-dc-none');
    expect(out).toContain('data-dc-number=""');
    // the lamps are drawn bulbs (inline SVG), all unlit before any claim
    expect(attrs(out, 'data-bulb')).toEqual(['closed', 'closed', 'closed', 'closed', 'closed']);
    expect(out).toContain('data-dc-stage');
    expect(out).not.toContain('data-dc-refused');
    expect(out).not.toMatch(RAW);
    expect(out).not.toContain('{{');
    expect(latinWords(out)).toEqual([]);
  });

  it('inside a workspace: one selector, one lab per level; the lesson\'s props reuse the level presets', () => {
    const out = renderToString(
      <ManipulationWorkspace levels={{
        beginner: () => <DigitCards level="beginner" mode="grid" />,
        advanced: () => <DigitCards level="advanced" mode="cards" />,
      }} />,
    );
    expect(out).toContain('data-mode="grid"');
    expect((out.match(/data-manipulation-levels-selector/g) ?? []).length).toBe(1);
    const g = numbersFor({ mode: 'grid', divisors: [2, 5, 3], level: 'beginner' });
    expect(g.divisors).toBe(LEVELS['digit-cards'].beginner.numbers.divisors);
    expect(g).toEqual(LEVELS['digit-cards'].beginner.numbers);
    expect(numbersFor({ mode: 'cards', level: 'beginner' })).toEqual(LEVELS['digit-cards'].advanced.numbers);
    expect(numbersFor({ level: 'advanced', digits: [1, 2, 3, 4] }).digits).toEqual([1, 2, 3, 4]);
  });

  it('every string a verdict, a refusal, the discovery or the formal line can show exists, in Arabic, fully interpolated', () => {
    const o = {
      n: 9534, d: 4, r: 2, q: 2383, from: 0, to: 48, columns: 7, count: 24, total: 25, larger: 9543, example: 3594, rs: '1 ، 2',
      list: '2 ، 3', colour: 'بالأحمر', digits: '4 ، 5', i: 1, place: 'الآحاد', digit: 4, m: 24, u: 2, eq: '21 = 2 × 10 + 1',
      a: 9534, b: 9543, s: 21, even: 9534, odd: 9543, word: 'صحيح',
    };
    const keys = ['explanation', 'tableAria', 'cellAria', 'cellAriaIn', 'reveal', 'revealAria', 'slotsTitle', 'slotAria', 'slotFullAria',
      'trayTitle', 'trayAria', 'trayEmpty', 'cardAria', 'lampsTitle', 'claimYes', 'claimNo', 'claimYesAria', 'claimNoAria', 'claimNeedNumber',
      'tasksTitle', 'question.cards', 'question.grid', 'context.cards', 'context.grid', 'taskAria', 'submit', 'submitAria', 'none', 'noneAria', 'answer', 'answerNone', 'trialsTitle', 'ok', 'notOk',
      'need.swap', 'need.targets', 'numberTitle', 'dragHint', 'ledger.unitsShort', 'ledger.sumsShort',
      ...['do', 'next', 'all', 'start'].map((x) => `prompt.grid.${x}`), 'ledger.title', 'ledger.units', 'ledger.sums', 'ledger.empty',
      'colouring.label', 'colouring.progress', 'colouring.progressShort', 'tasksShort', 'colouring.aria', 'colouring.locked', 'colouring.short',
      'discovery.column', 'discovery.whyColumn', 'discovery.units3', 'discovery.whyUnits3', 'discovery.even4', 'discovery.whyEven4',
      'discovery.sum2', 'discovery.whySum2', 'discovery.whyGeneric',
      'formal.def', 'formal.rule2', 'formal.rule5', 'formal.rule3', 'formal.rule9', 'formal.rule4', 'formal.why4',
      ...['grid', 'claim', 'largest', 'none'].map((x) => `trial.${x}`),
      ...['ok', 'again', 'refused', 'complete'].map((x) => `v.grid.${x}`),
      ...['empty', 'claimYesOk', 'claimNoOk', 'claimYesWrong', 'claimNoWrong', 'largestOk', 'notDivisible', 'notLargest', 'noneOk', 'noneWrong', 'change', 'flipped', 'kept'].map((x) => `v.cards.${x}`),
      ...['closed', 'wait', 'yes', 'no'].flatMap((x) => [`lampAria.${x}`, `lampState.${x}`]),
      'lampFlip.flipped', 'lampFlip.kept',
      ...['red', 'blue', 'green', 'amber', 'violet', 'slate'].map((x) => `colourName.${x}`),
      ...[0, 1, 2, 3].map((x) => `places.${x}`)];
    for (const m of ['grid', 'cards']) {
      keys.push(`title.${m}`, `discovery.prompt.${m}`, `discovery.right.${m}`);
      for (let i = 0; i < 3; i += 1) keys.push(`hints.${m}.${i}`);
    }
    for (const key of keys) {
      const s = say(key, o);
      expect(s, key).not.toMatch(RAW);
      expect(s, key).not.toContain('{{');
      expect(/[؀-ۿ]/.test(s) || /^[؟…]$/.test(s), key).toBe(true);
    }
    // no hint and no pre-discovery string states a rule (units digit, digit sum, last two digits)
    for (const m of ['grid', 'cards']) {
      for (let i = 0; i < 3; i += 1) {
        const h = say(`hints.${m}.${i}`);
        expect(h, `hints.${m}.${i}`).not.toMatch(/0 أو 2|0 أو 5|يقبل القسمة على 3 إذا|زوجي|الرقمين الأخيرين/);
      }
    }
    expect(say('explanation')).not.toMatch(/رقم آحاد|مجموع أرقام|الرقمين الأخيرين/);
  });

  it('opens on its CONTEXT then ONE question naming the end state — no title banner, no shell mission (MANIPULATION_DNA §17.9)', () => {
    const text = (out) => out.replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/[⁦⁩]/g, '').replace(/\s+/g, ' ');
    for (const [lv, m, context, question] of [
      ['beginner', 'grid', 'في الجدول الأعداد من 0 إلى 48.', 'لوّن كل مضاعفات 2 ثم 5 ثم 3.'],
      ['advanced', 'cards', 'عندك أربع بطاقات: 4 ، 5 ، 9 ، 3.', 'رتّب البطاقات حتى تكوّن أكبر عدد يقبل القسمة على 2 — أو قل إنه لا يوجد.'],
    ]) {
      const out = html({ ...LEVELS['digit-cards'][lv].numbers });
      expect(out).toMatch(/<h3 class="sr-only">/);
      expect(out).not.toContain('data-manipulation-mission');
      expect(out).not.toMatch(/<span class="inline-flex items-center gap-1\.5 rounded-full bg-indigo-50/);
      expect(out).toContain(`data-dc-context="${m}"`);
      const t = text(out);
      expect(t.indexOf(context), context).toBeGreaterThan(-1);
      expect(t.indexOf(question), question).toBeGreaterThan(t.indexOf(context));
      expect(t.split(question).length - 1).toBe(1);
      expect(out.indexOf('data-lab-context')).toBeLessThan(out.indexOf('data-lab-question'));
    }
  });
});
