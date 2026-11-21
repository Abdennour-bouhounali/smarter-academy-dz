import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { Court, CourtMini, COURT_VIEW } from './courtParts';

const draw = (area, rod, stage = 'done', more = {}) =>
  renderToString(<Court area={area} rod={rod} stage={stage} {...more} />);
const count = (out, re) => (out.match(re) ?? []).length;
const attr = (out, name) => out.match(new RegExp(`${name}="([^"]*)"`))?.[1];
/** Every <text> of a drawing: its attributes and what it reads (tspans included). */
const texts = (out) =>
  [...out.matchAll(/<text([^>]*)>(.*?)<\/text>/g)].map(([, a, inner]) => ({
    a,
    t: inner.replace(/<[^>]+>/g, '').replace(/<!-- -->/g, ''),
    size: Number(a.match(/font-size="([\d.]+)"/)?.[1]),
  }));
const ARABIC = /[؀-ۿ]/;

const CASES = [
  ['36', { q: '6' }],
  ['30', { q: '5' }],
  ['30', { q: '6' }],
  ['30', { q: '5,47' }],
  ['30', { q: '5,48' }],
  ['30', { q: '5,477225575' }],
  ['30', { root: '30' }],
  ['0,25', { q: '0,5' }],
  ['0,25', { q: '0,125' }],
  ['49/64', { q: '0,875' }],
  ['49/64', { q: '1' }],
  ['400', { q: '19' }],
  ['400', { q: '20' }],
  ['1225', { q: '36' }],
  ['81', { q: '-9' }],
  ['2', { root: '2' }],
  ['30', null],
];

describe('a court, stage by stage — the platform hovers, lowers, then the world shows what it did', () => {
  it('ask: the platform as a dashed outline over the court, nothing decided, no fact, no kind', () => {
    const out = draw('30', { q: '5' }, 'ask');
    expect(out).toContain('data-court="30"');
    expect(out).toContain('data-court-rod="5"');
    expect(out).toContain('data-court-stage="ask"');
    expect(out).toContain('crt-plat is-ask');
    expect(out).not.toContain('data-court-kind');
    expect(out).not.toContain('data-court-zoom');
    expect(out).not.toContain('data-court-fact');
    expect(out).not.toContain('crt-band');
    expect(out).not.toContain('is-lit'); // the tiles light up only under a platform that is lowered
  });
  it('build: it lowers (animated), the tiles under it light up — still no verdict', () => {
    const out = draw('30', { q: '5' }, 'build');
    expect(out).toContain('crt-plat is-build');
    expect(count(out, /is-lit/g)).toBe(25);
    expect(out).not.toContain('data-court-kind');
    expect(out).not.toContain('data-court-fact');
    expect(out).toMatch(/animation-delay:\d+ms/);
  });
  it('done, a RIDE: the platform seated and glowing, the fact written', () => {
    const out = draw('36', { q: '6' });
    expect(attr(out, 'data-court-kind')).toBe('ride');
    expect(out).toContain('crt-plat is-done is-ride');
    expect(out).toContain('تركب المصعد');
    expect(out).not.toMatch(/crt-band|crt-over/);
    expect(count(out, /is-lit/g)).toBe(36);
  });
  it('done, a BAND: the amber L the platform leaves, its exact area written', () => {
    const out = draw('30', { q: '5' });
    expect(attr(out, 'data-court-kind')).toBe('band');
    expect(attr(out, 'data-court-band')).toBe('5');
    expect(attr(out, 'data-court-diff')).toBe('5');
    expect(out).toContain('يبقى شريط مساحته');
    expect(out).toContain('5 بلاطات');
    expect(attr(out, 'data-court-zoom')).toBe('1'); // a band of 5 tiles is seen: no lens
    expect(out).not.toContain('data-court-lens');
  });
  it('done, a JAM: the overhang in violet, what sticks out written', () => {
    const out = draw('30', { q: '6' });
    expect(attr(out, 'data-court-kind')).toBe('jam');
    expect(attr(out, 'data-court-over')).toBe('6');
    expect(out).toContain('crt-plat is-done is-jam');
    expect(out).toContain('تعلق: ما يبرز منها');
    expect(out).toContain('6 بلاطات');
  });
  it('a court with no rod yet: the court and its gate, no platform', () => {
    const out = draw('30', null, 'ask');
    expect(out).not.toMatch(/crt-plat|data-court-rod|crt-rod/);
    expect(out).toContain('data-court-plaque="30"');
  });
});

describe('the MAGNIFIER: a band or an overhang too thin to see is enlarged by a power of ten, and its area is WRITTEN', () => {
  it('5,47 on the court of 30: ×100, and « 0,0791 بلاطة »', () => {
    const out = draw('30', { q: '5,47' });
    expect(attr(out, 'data-court-zoom')).toBe('100');
    expect(out).toContain('data-court-lens="100"');
    expect(texts(out).map((x) => x.t)).toContain('×100');
    expect(out).toContain('0,0791 بلاطة');
    expect(attr(out, 'data-court-kind')).toBe('band');
  });
  it('5,48 jams by 0,0304 — ×100 again, on the other side of the wall', () => {
    const out = draw('30', { q: '5,48' });
    expect(attr(out, 'data-court-kind')).toBe('jam');
    expect(attr(out, 'data-court-zoom')).toBe('100');
    expect(out).toContain('crt-lens is-jam');
    expect(out).toContain('0,0304 بلاطة');
  });
  it('the calculator’s ten digits: a gap of a hundred-millionth — the factor written as a power, the 20 digits written', () => {
    const out = draw('30', { q: '5,477225575' });
    const k = Number(attr(out, 'data-court-zoom'));
    expect(k).toBeGreaterThanOrEqual(1e9);
    expect(Math.log10(k) % 1).toBe(0);
    expect(texts(out).find((x) => x.t.startsWith('×10'))?.t).toBe(`×10${Math.log10(k)}`);
    expect(out).toContain('0,000000000565919375'); // the exact difference, number by itself (too long with its noun)
    expect(attr(out, 'data-court-diff')).toBe('0,000000000565919375');
  });
  it('the student drives it: a forced factor shows the lens; 1 hides it; at a ride it shows the walls flush', () => {
    expect(attr(draw('30', { q: '5' }, 'done', { zoom: 1000 }), 'data-court-zoom')).toBe('1000');
    expect(draw('30', { q: '5,47' }, 'done', { zoom: 1 })).not.toContain('data-court-lens');
    const wall = draw('30', { root: '30' }, 'done', { zoom: 10000 });
    expect(wall).toContain('crt-lens is-ride');
    expect(wall).not.toMatch(/class="crt-band"|class="crt-over"/);
    // never before the world has done it
    expect(draw('30', { q: '5,47' }, 'build', { zoom: 100 })).not.toContain('data-court-lens');
  });
});

describe('the floor stays honest at every size', () => {
  it('unit tiles, CUT along the two far walls when the side is not whole', () => {
    const c30 = draw('30', { q: '5' });
    expect(attr(c30, 'data-court-mode')).toBe('tiles');
    expect(count(c30, /class="crt-tile/g)).toBe(36); // 6 × 6 cells: 5 whole a side, then the cut ones
    expect(count(c30, /crt-tile is-cut/g)).toBe(11);
    const c36 = draw('36', { q: '6' });
    expect(count(c36, /class="crt-tile/g)).toBe(36);
    expect(count(c36, /is-cut/g)).toBe(0);
  });
  it('a court of 400 is four blocks of 10 × 10, never 400 squares — each block says what it holds', () => {
    const out = draw('400', { q: '19' });
    expect(attr(out, 'data-court-mode')).toBe('blocks');
    expect(count(out, /class="crt-tile/g)).toBe(4);
    expect(texts(out).filter((x) => x.t === '100').length).toBe(4 + 1); // the four blocks and the key under the gate
    expect(attr(out, 'data-court-key')).toBe('100');
    const big = draw('1225', { q: '36' });
    expect(count(big, /class="crt-tile/g)).toBe(16); // 35 tiles a side: 3 whole blocks, then a cut one
    expect(count(big, /class="crt-tile[^"]*is-cut/g)).toBe(7);
  });
  it('a court under one tile is drawn INSIDE one enlarged tile and its subdivisions', () => {
    const quarter = draw('0,25', { q: '0,5' });
    expect(attr(quarter, 'data-court-mode')).toBe('sub');
    expect(attr(quarter, 'data-court-sub')).toBe('4');
    expect(count(quarter, /class="crt-tile/g)).toBe(4); // 0,5 a side = 2 sub-cells of 1/4
    expect(count(quarter, /crt-onetile__line/g)).toBe(2 * 3);
    expect(quarter).toContain('data-court-key="tile"'); // the key: the dashed square beside « بلاطة » is one tile
    const f = draw('49/64', { q: '0,875' });
    expect(attr(f, 'data-court-sub')).toBe('8');
    expect(count(f, /class="crt-tile/g)).toBe(49);
    expect(attr(f, 'data-court-kind')).toBe('ride');
    expect(f).toContain('data-court-frac="49/64"'); // the gate writes the fraction over a real bar
    // a court given as a fraction has its band written as a fraction too, never a decimal beside « 49/64 »
    const band = draw('49/64', { q: '0,5' });
    expect(band).toContain('33/64 بلاطة');
    expect(band).not.toContain('0,515625 بلاطة');
  });
});

describe('words and numbers drawn in the court', () => {
  it('no text without an Arabic letter is laid right to left, in any drawing', () => {
    for (const [a, r] of CASES)
      for (const stage of ['ask', 'build', 'done'])
        for (const t of texts(draw(a, r, stage)))
          expect(t.a.includes(ARABIC.test(t.t) ? 'direction="rtl"' : 'direction="ltr"'), `${a} ${t.t}`).toBe(true);
  });
  it('every glyph is at least 27 units: 27 × 152 / 240 × 1.067 = 18.2 px at the tight height in the forge', () => {
    expect(COURT_VIEW).toEqual({ w: 640, h: 240, font: 27 });
    for (const [a, r] of CASES)
      for (const t of texts(draw(a, r, 'done', { tight: true }))) {
        expect(t.size, `${a} ${t.t}`).toBeGreaterThanOrEqual(27);
        expect(((t.size * (9.5 * 16)) / 240) * (768 / 720)).toBeGreaterThanOrEqual(18);
      }
    // the exponent of the lens too (a tspan)
    for (const m of draw('30', { q: '5,477225575' }).matchAll(/<tspan[^>]*font-size="([\d.]+)"/g))
      expect(Number(m[1])).toBeGreaterThanOrEqual(27);
  });
  it('the gate’s noun agrees with its number: 1, 2, 3–10, 11+, past 100, a decimal', () => {
    const word = (a) => texts(draw(a, null, 'ask')).find((x) => ARABIC.test(x.t))?.t;
    expect(word('1')).toBe('بلاطة واحدة');
    expect(word('2')).toBe('بلاطتان');
    expect(word('5')).toBe('بلاطات');
    expect(word('30')).toBe('بلاطة');
    expect(word('103')).toBe('بلاطات');
    expect(word('0,25')).toBe('بلاطة');
  });
  it('a rod that is a WALL is written with a drawn radical over its number; a negative rod keeps its sign', () => {
    const out = draw('30', { root: '30' });
    expect(attr(out, 'data-court-rod')).toBe('√30');
    expect(out).toContain('data-court-radical="30"');
    expect(texts(out).some((x) => x.t.includes('√'))).toBe(false); // the sign is a stroke, never a glyph
    const neg = draw('81', { q: '-9' });
    expect(attr(neg, 'data-court-kind')).toBe('ride');
    expect(texts(neg).map((x) => x.t)).toContain('-9');
  });
  it('label={false}: the court alone, not a word', () => {
    const out = draw('30', { q: '5,47' }, 'done', { label: false });
    expect(texts(out)).toEqual([]);
    expect(out).not.toContain('data-court-lens');
    expect(attr(out, 'data-court-kind')).toBe('band');
  });
  it('shapes are never black', () => {
    for (const [a, r] of CASES) expect(draw(a, r)).not.toMatch(/#000\b|black/);
  });
});

describe('the thumbnail of a line', () => {
  it('a sliver of amber for a band, violet for an overhang, green for a ride — even when the gap is a hair', () => {
    const mini = (a, r) => renderToString(<CourtMini area={a} rod={r} />);
    expect(mini('30', { q: '5,47' })).toContain('crt-mini__band');
    expect(mini('30', { q: '5,48' })).toContain('crt-mini__over');
    expect(mini('36', { q: '6' })).toContain('crt-mini is-ride');
    expect(mini('30', { q: '5,47' })).not.toMatch(/<text/);
  });
});
