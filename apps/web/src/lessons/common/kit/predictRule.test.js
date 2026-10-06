import { describe, it, expect } from 'vitest';
import { shouldPredict, readPredictions, savePrediction, PREDICTABLE_TYPES } from './predictRule';

const memory = () => { const m = new Map(); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, v) }; };

describe('shouldPredict', () => {
  it('asks before a NEW rule the student has not found yet', () => {
    for (const type of PREDICTABLE_TYPES) expect(shouldPredict({ itemType: type })).toBe(true);
  });

  it('never asks for vocabulary, reminders, teachers, known or already-predicted rules', () => {
    expect(shouldPredict({ itemType: 'vocabulaire' })).toBe(false);
    expect(shouldPredict({ itemType: 'regles', variant: 'rappel' })).toBe(false);
    expect(shouldPredict({ itemType: 'regles', freeNavigation: true })).toBe(false);
    expect(shouldPredict({ itemType: 'regles', known: true })).toBe(false);
    expect(shouldPredict({ itemType: 'regles', predicted: true })).toBe(false);
  });

  it('lets the author opt out or in, the brick winning over the item', () => {
    expect(shouldPredict({ itemType: 'regles', itemPredict: false })).toBe(false);
    expect(shouldPredict({ itemType: 'vocabulaire', itemPredict: true })).toBe(true);
    expect(shouldPredict({ itemType: 'regles', itemPredict: true, brickPredict: false })).toBe(false);
    expect(shouldPredict({ itemType: 'regles', brickPredict: true, freeNavigation: true })).toBe(false);
  });
});

describe('prediction storage', () => {
  it('keeps what the student wrote, per lesson', () => {
    const s = memory();
    savePrediction(s, 'l1', 'qasim-baqi', 'الباقي صفر', 1);
    expect(readPredictions(s, 'l1')).toEqual({ 'qasim-baqi': { text: 'الباقي صفر', at: 1 } });
    expect(readPredictions(s, 'l2')).toEqual({});
  });

  it('survives corrupted storage', () => {
    const s = memory();
    s.setItem('smarter_predictions_l1', '{oops');
    expect(readPredictions(s, 'l1')).toEqual({});
  });
});
