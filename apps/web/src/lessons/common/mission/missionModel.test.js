import { describe, it, expect } from 'vitest';
import {
  isMissionView, missionTools, pendingCheckpoint, missionStations, resumeStation, readMissionState, writeMissionState, missionKey, stationLabel, shouldWelcome,
} from './missionModel';
import { describeLearningViewer } from '../../../features/learning/learningViewer';

const viewer = (role) => describeLearningViewer({ role });
const MISSION = {
  climaxModule: 4,
  tools: [{ id: 'qasim-baqi', icon: '🔑', label: 'a' }, { id: 'qasim-jidaa', icon: '🔑', label: 'b' }],
  checkpoints: [{ id: 'cp-1', afterModule: 1 }, { id: 'cp-2', afterModule: 2 }],
};
const memoryStorage = () => {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)) };
};

describe('isMissionView — the mission changes the STUDENT view only', () => {
  it('is on for a learner in a lesson that opts in', () => {
    expect(isMissionView('mission', viewer('student'), { isClassroomMode: false })).toBe(true);
    expect(isMissionView('mission', viewer('visitor'), { isClassroomMode: false })).toBe(true);
  });
  it('is off for other lessons, the teacher, the admin and Classroom Mode', () => {
    expect(isMissionView('focus', viewer('student'), { isClassroomMode: false })).toBe(false);
    expect(isMissionView('mission', viewer('teacher'), { isClassroomMode: false })).toBe(false);
    expect(isMissionView('mission', viewer('admin'), { isClassroomMode: false })).toBe(false);
    expect(isMissionView('mission', viewer('student'), { isClassroomMode: true })).toBe(false);
  });
});

describe('missionTools — a tool is earned when its knowledge item is established', () => {
  it('marks each tool from the unlocked knowledge ids', () => {
    expect(missionTools(MISSION, ['qasim-baqi']).map((t) => t.earned)).toEqual([true, false]);
    expect(missionTools(undefined, ['x'])).toEqual([]);
  });
});

describe('pendingCheckpoint — asked on ARRIVAL at the next module, once', () => {
  it('waits for the previous module to be completed', () => {
    expect(pendingCheckpoint(MISSION, [0], {}, 2)).toBeNull();
    expect(pendingCheckpoint(MISSION, [0, 1], {}, 2)?.id).toBe('cp-1');
    expect(pendingCheckpoint(MISSION, ['00', '01'], {}, 2)?.id).toBe('cp-1');
  });
  it('is not asked again once answered or skipped, nor on a module without one', () => {
    expect(pendingCheckpoint(MISSION, [0, 1], { 'cp-1': 0 }, 2)).toBeNull();
    expect(pendingCheckpoint(MISSION, [0, 1], { 'cp-1': 'skipped' }, 2)).toBeNull();
    expect(pendingCheckpoint(MISSION, [0, 1, 2, 3], {}, 5)).toBeNull();
  });
});

describe('missionStations / resumeStation — the journey follows the real lock', () => {
  const config = { mission: MISSION, modules: [3, 4, 5].map((n) => ({ number: n, slug: `m${n}`, title: `M${n}` })) };
  it('labels the climax and the bonus stations, and keeps the status it is given', () => {
    const stations = missionStations(config, (m) => (m.number === 3 ? 'mastered' : 'locked'));
    expect(stations.map((s) => s.kind)).toEqual(['stage', 'climax', 'bonus']);
    expect(stations.map((s) => s.status)).toEqual(['mastered', 'locked', 'locked']);
  });
  it('resumes at the first station not done', () => {
    expect(resumeStation([{ number: 3, status: 'mastered' }, { number: 4, status: 'current' }])?.number).toBe(4);
    expect(resumeStation([{ number: 3, status: 'mastered' }])).toBeNull();
  });
});

describe('shouldWelcome — the « you are here » card, once per station', () => {
  it('greets a first arrival, never twice, never over a checkpoint', () => {
    expect(shouldWelcome({}, 2, null)).toBe(true);
    expect(shouldWelcome({ 2: true }, 2, null)).toBe(false);
    expect(shouldWelcome({}, 2, { id: 'cp' })).toBe(false);
  });
});

describe('stationLabel — the part of a module title that says WHAT', () => {
  it('keeps what follows the dash, or the whole title', () => {
    expect(stationLabel('نشاط 1 — 420 كتابًا في رفوف')).toBe('420 كتابًا في رفوف');
    expect(stationLabel('أستعدّ')).toBe('أستعدّ');
  });
});

describe('mission state — local, per lesson, never throws', () => {
  it('round-trips and defaults safely', () => {
    const s = memoryStorage();
    expect(readMissionState(s, 'l1')).toEqual({ opened: false, answered: {}, seen: {} });
    writeMissionState(s, 'l1', { opened: true, answered: { 'cp-1': 0 }, seen: { 2: true } });
    expect(readMissionState(s, 'l1')).toEqual({ opened: true, answered: { 'cp-1': 0 }, seen: { 2: true } });
    s.setItem(missionKey('l2'), '{broken');
    expect(readMissionState(s, 'l2')).toEqual({ opened: false, answered: {}, seen: {} });
    expect(readMissionState(null, 'l3')).toEqual({ opened: false, answered: {}, seen: {} });
  });
});
