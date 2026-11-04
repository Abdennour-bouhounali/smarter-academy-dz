import { describe, it, expect } from 'vitest';
import {
  emptyLog, logEvent, conditionMet, roundWon, starsFor, roundUnlocked, resumeRound, readStars, recordStars, totalStars, starsKey,
} from './roundsModel';

const play = (events) => events.reduce((log, [kind, ev]) => logEvent(log, kind, ev), emptyLog());
const verdict = (groups, exact) => ['verdict', { groups, exact }];
const answer = (ok, tries = 1, revealed = false) => ['trial', { tk: 'checkpoint', ok, tries, revealed }];
const done = (id) => ['trial', { tk: 'checkpoint-done', id }];
const memory = () => { const m = new Map(); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)) }; };

const R1 = { id: 'r1', goal: [{ checkpoint: 'first' }], stars: { maxTrials: 1 } };
const R3 = { id: 'r3', goal: [{ checkpoint: 'contrast' }], stars: { maxTrials: 3 } };
const CH = { id: 'ch', optional: true, goal: [{ allExact: [2, 3, 6, 7] }], stars: { maxTrials: 6 } };
const FREE = { id: 'free', free: true };

describe('round goals — measured from what the lab reports', () => {
  it('a checkpoint goal waits for the whole question set', () => {
    expect(roundWon(R1, play([verdict(3, true)]))).toBe(false);
    expect(roundWon(R1, play([verdict(3, true), answer(true), done('first')]))).toBe(true);
  });
  it('the challenge needs EVERY divisor seen as an exact split', () => {
    expect(roundWon(CH, play([verdict(2, true), verdict(3, true), verdict(6, true)]))).toBe(false);
    expect(roundWon(CH, play([verdict(2, true), verdict(3, true), verdict(6, true), verdict(5, false), verdict(7, true)]))).toBe(true);
    expect(conditionMet({ exact: 6 }, play([verdict(6, false)]))).toBe(false);
  });
  it('a free round is never "won" and never blocks', () => {
    expect(roundWon(FREE, play([verdict(4, true)]))).toBe(false);
  });
});

describe('stars — 1 for the win, 1 for first-try answers, 1 for few trials', () => {
  it('gives 3 stars to a clean, economical round', () => {
    expect(starsFor(R1, play([verdict(3, true), answer(true), answer(true), done('first')]))).toBe(3);
  });
  it('drops a star for a wrong or revealed answer, and one for too many trials', () => {
    expect(starsFor(R1, play([verdict(3, true), answer(false), answer(true, 2), done('first')]))).toBe(2);
    expect(starsFor(R1, play([verdict(4, false), verdict(3, true), answer(true), done('first')]))).toBe(2);
    expect(starsFor(R1, play([verdict(4, false), verdict(3, true), answer(true, 1, true), done('first')]))).toBe(1);
  });
  it('gives no star to a round not won', () => {
    expect(starsFor(R3, play([verdict(5, false)]))).toBe(0);
  });
});

describe('the path — unlocks and where to resume', () => {
  const rounds = [R1, { ...R3, id: 'r2' }, R3, CH, FREE];
  it('opens a round when the previous REQUIRED round is won; the free pitch is always open', () => {
    expect(roundUnlocked(rounds, 0, {})).toBe(true);
    expect(roundUnlocked(rounds, 1, {})).toBe(false);
    expect(roundUnlocked(rounds, 1, { r1: 1 })).toBe(true);
    expect(roundUnlocked(rounds, 4, {})).toBe(true);
  });
  it('resumes at the first required round not won, else the last won', () => {
    expect(resumeRound(rounds, {})).toBe(0);
    expect(resumeRound(rounds, { r1: 2 })).toBe(1);
    expect(resumeRound(rounds, { r1: 2, r2: 1, r3: 3 })).toBe(2);
  });
});

describe('best stars — per student, never lost by replaying', () => {
  it('keeps the best score and totals the lesson', () => {
    const s = memory();
    recordStars(s, 'l1', 'm1', 'r1', 2);
    recordStars(s, 'l1', 'm1', 'r1', 1);
    recordStars(s, 'l1', 'm2', 'a', 3);
    expect(readStars(s, 'l1')).toEqual({ m1: { r1: 2 }, m2: { a: 3 } });
    expect(totalStars(readStars(s, 'l1'))).toBe(5);
    s.setItem(starsKey('l2'), '{bad');
    expect(readStars(s, 'l2')).toEqual({});
  });
});
