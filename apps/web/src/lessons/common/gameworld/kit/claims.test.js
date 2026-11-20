import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CLAIM_KINDS, verifyClaim } from './claims';

const api = (path) => fileURLToPath(new URL(`../../../../../../api/${path}`, import.meta.url));
const FIXTURE = JSON.parse(readFileSync(api('tests/Fixtures/game-claims.json'), 'utf8'));
const SERVER = readFileSync(api('app/Domain/GameWorld/ClaimVerifier.php'), 'utf8');

describe('the claims of a game answer — one rule for the browser and for the server', () => {
  it('knows exactly the kinds the server knows', () => {
    const list = /const KINDS = \[([^\]]+)\]/.exec(SERVER)[1];
    const server = [...list.matchAll(/'([a-zA-Z]+)'/g)].map((m) => m[1]);
    expect([...CLAIM_KINDS].sort()).toEqual(server.sort());
  });

  it('gives the SAME verdict as the server on the shared fixture, and every kind has rows of both verdicts', () => {
    expect(FIXTURE.cases.length).toBeGreaterThan(30);
    for (const c of FIXTURE.cases) expect(verifyClaim(c.claim), JSON.stringify(c.claim)).toBe(c.ok);
    for (const kind of CLAIM_KINDS) {
      const rows = FIXTURE.cases.filter((c) => c.claim.kind === kind);
      expect(
        rows.some((c) => c.ok),
        `${kind}: a row that is true`,
      ).toBe(true);
      expect(
        rows.some((c) => !c.ok),
        `${kind}: a row that is false`,
      ).toBe(true);
    }
  });

  it('a common divisor OTHER THAN 1 (`notOne: true`) refuses 1; only the boolean true asks for it, as on the server', () => {
    const c = { kind: 'commonDivisor', a: 85, b: 119 };
    expect(verifyClaim({ ...c, d: 1 })).toBe(true);
    expect(verifyClaim({ ...c, d: 1, notOne: true })).toBe(false);
    expect(verifyClaim({ ...c, d: 17, notOne: true })).toBe(true);
    expect(verifyClaim({ ...c, d: 1, notOne: 1 })).toBe(true);
  });

  it('never trusts a claim it does not understand', () => {
    expect(verifyClaim(null)).toBe(false);
    expect(verifyClaim({})).toBe(false);
    expect(verifyClaim({ kind: 'toString', a: 1, b: 1 })).toBe(false);
    expect(verifyClaim({ kind: 'division', a: 143, b: 0, q: 0, r: 143, fits: false })).toBe(false);
  });
});
