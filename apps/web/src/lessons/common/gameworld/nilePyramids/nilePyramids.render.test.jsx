/**
 * The world's screens rendered without a DOM — and the shell file imported, so that a wrong import path in it fails
 * here and not only in the browser (defects D35).
 */
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import NilePyramids, { Fact, Register, OrderCard, RopeChip } from './NilePyramids';
import { WORLDS } from '../worlds';
import { WORLD_TEXT } from './strings';

const game = { T: WORLD_TEXT, drop() {}, sendOrder() {}, closeOrder() {} };
const plain = (html) => html.replace(/<[^>]+>/g, ' ');

describe('« الأهرامات » on screen', () => {
  it('is registered last among the worlds and its shell is a component', async () => {
    expect(Object.keys(WORLDS).at(-1)).toBe('nile-pyramids');
    expect(typeof NilePyramids).toBe('function');
    expect((await WORLDS['nile-pyramids']()).default).toBe(NilePyramids);
  });

  it('a fact says what the world did and never a size (gate P1)', () => {
    const gap = renderToString(<Fact verdict={{ kind: 'course', fact: 'gap', typed: '11', seg: 'MN' }} game={game} />);
    expect(gap).toContain('data-np-fact="gap"');
    expect(plain(gap)).toContain(WORLD_TEXT.fact.gap);
    expect(plain(gap)).not.toMatch(/\b77\b/);
    const canal = renderToString(
      <Fact verdict={{ kind: 'canal', fact: 'longer', typed: '31,5', reading: '41', seg: 'PQ' }} game={game} />,
    );
    expect(canal).toContain('data-np-fact="longer"');
    expect(plain(canal)).toContain(WORLD_TEXT.fact.longer);
  });

  it('the register lists its rows, each with its hook', () => {
    const reg = {
      title: WORLD_TEXT.hud.register,
      rows: [
        { id: 'AB', tex: 'AB = 63', kind: 'record' },
        { id: 'AM', tex: 'AM = 14', kind: 'measured' },
      ],
    };
    const out = renderToString(<Register reg={reg} />);
    expect(out).toContain('data-np-register="2"');
    expect(out).toContain('data-np-row="AM"');
  });

  it('the rope shows its knots and a way to let it go', () => {
    const out = renderToString(<RopeChip rope={{ knots: 14 }} game={game} />);
    expect(out).toContain('data-np-rope="14"');
    expect(out).toContain('data-np-drop');
  });

  it('the order card: one box, its unit printed, the canal card marked as a prediction', () => {
    const out = renderToString(<OrderCard o={{ kind: 'canal', seg: 'MN', id: 'MN?', refused: 'empty' }} game={game} />);
    expect(out).toContain('data-np-order="canal"');
    expect(out).toContain('data-np-predict');
    expect(out).toContain('data-np-order-in');
    expect(out).toContain('data-np-refused="empty"');
    expect(plain(out)).toContain(WORLD_TEXT.unit);
  });
});
