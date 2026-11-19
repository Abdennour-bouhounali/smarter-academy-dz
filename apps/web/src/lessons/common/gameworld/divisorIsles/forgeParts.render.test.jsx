import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { FORGE_PARTS } from './forgeParts';
import { outcome } from './ruleForge';

// the investigation screens expose their state on `window` (dev only): give the server render one
globalThis.window = globalThis.window ?? {};

const { Mirror, Line, beats } = FORGE_PARTS;
const count = (out, re) => (out.match(re) ?? []).length;
/** A sharing case as a lesson writes it (forgeParts.jsx › `c.deal`). */
const sharing = (nA, nB, k, claim, extra = {}) => {
  const fits = nA % k === 0 && nB % k === 0;
  return {
    ...outcome(fits ? nB : nA, k),
    fits,
    held: fits,
    tag: `tag[${k}]`,
    deal: { a: { n: nA, item: 'rose' }, b: { n: nB, item: 'lily' }, k, lot: 'vase', ...(claim ? { claim } : {}) },
    ...extra,
  };
};

describe('a case of a forge that is a SHARING — drawn as the experiment draws it, never as a bridge', () => {
  it('ask: the two collections on the table, one item each, and the k EMPTY lots — no plank, no cell', () => {
    const out = renderToString(<Mirror c={sharing(36, 60, 12)} stage="ask" fast />);
    expect(out).toContain('data-rf-deal="36:60:12"');
    expect(out).toContain('data-rf-stage="ask"');
    expect(out).not.toContain('data-rf-bridge');
    expect(out).not.toMatch(/لوح|خانة/);
    expect(count(out, /data-iq-lot="/g)).toBe(12);
    expect(count(out, /data-iq-holds="0,0"/g)).toBe(12);
    expect(out).toContain('data-iq-pile="a" data-iq-count="36"');
    expect(out).toContain('data-iq-pile="b" data-iq-count="60"');
    expect(count(out, /href="#rfd-rose"/g)).toBe(36);
    expect(count(out, /href="#rfd-lily"/g)).toBe(60);
    // its own symbols (never the ids of the experiment's scene) and the number of lots written between the piles
    expect(out).toContain('id="rfd-rose"');
    expect(out).toMatch(/data-rf-deal-k="true">12</);
  });

  it('build and done: every lot holds the same; what is left stays on the table, set apart — the held / fell look', () => {
    const shared = renderToString(<Mirror c={sharing(36, 60, 12)} stage="done" fast />);
    expect(count(shared, /data-iq-holds="3,5"/g)).toBe(12);
    expect(shared).toContain('data-iq-count="0"');
    expect(shared).toMatch(/class="rf-deal is-done is-held/);
    expect(shared).not.toContain('iqd-apart');

    const left = renderToString(<Mirror c={sharing(40, 56, 6)} stage="done" fast />);
    expect(count(left, /data-iq-holds="6,9"/g)).toBe(6);
    expect(left).toContain('data-iq-pile="a" data-iq-count="4"');
    expect(left).toContain('data-iq-pile="b" data-iq-count="2"');
    expect(count(left, /iqd-apart/g)).toBe(2);
    expect(left).toMatch(/class="rf-deal is-done is-fell/);

    const building = renderToString(<Mirror c={sharing(40, 56, 6)} stage="build" fast={false} />);
    expect(building).toContain('data-rf-stage="build"');
    expect(building).toContain('animation-delay:880ms'); // the 9th lily of a lot: dealt in round 9 (110 ms a round)
    expect(beats(sharing(40, 56, 6))).toBe(9); // one stroke per round of the deal
  });

  it('a claim « each lot holds x and y » is drawn faint in the empty lots — or once over them when it would be too small', () => {
    const fits = renderToString(<Mirror c={sharing(36, 60, 12, [3, 5])} stage="ask" fast />);
    expect(count(fits, /data-iq-holds="3,5"/g)).toBe(12);
    expect(count(fits, /is-ghost/g)).toBe(12 * 8);
    expect(fits).not.toContain('data-rf-claim');

    const big = renderToString(<Mirror c={sharing(36, 60, 12, [24, 48])} stage="ask" fast />);
    expect(count(big, /data-iq-holds="0,0"/g)).toBe(12);
    expect(big).toContain('data-rf-claim="24,48"');
    expect(big).not.toMatch(/[؀-ۿ]/); // the claim is numbers and drawings, no word of any lesson

    // once dealt, the lots hold what the world gave — the claim is the panel's question, not the drawing's
    const done = renderToString(<Mirror c={sharing(36, 60, 12, [24, 48])} stage="done" fast />);
    expect(count(done, /data-iq-holds="3,5"/g)).toBe(12);
    expect(done).not.toContain('data-rf-claim');
  });

  it('its line of evidence: the two counts with their items, the tag, and a mini of lots — never « لوح »', () => {
    const out = renderToString(<Line c={sharing(40, 56, 5)} />);
    expect(out).toContain('rf-dealhead');
    expect(out).toMatch(/<strong>40<\/strong>/);
    expect(out).toMatch(/<strong>56<\/strong>/);
    expect(out).toContain('tag[5]');
    expect(out).not.toMatch(/لوح|خانة/);
    expect(out).toContain('rf-mini--deal');
    expect(count(out, /<rect/g)).toBe(5 + 1); // five lots and what is left
    const all = renderToString(<Line c={sharing(40, 56, 8)} />);
    expect(count(all, /<rect/g)).toBe(8);
    expect(count(all, /class="is-held"/g)).toBe(8);
  });

  it('a case with no `deal` is still a bridge, drawn as before', () => {
    const c = { ...outcome(56, 5), fits: false };
    const out = renderToString(<Mirror c={c} stage="ask" fast />);
    expect(out).toContain('data-rf-bridge="56:5"');
    expect(out).not.toContain('data-rf-deal');
    expect(out).toContain('لوح');
    expect(renderToString(<Line c={c} />)).toContain('لوح 5');
    expect(beats(c)).toBe(c.q);
  });
});
