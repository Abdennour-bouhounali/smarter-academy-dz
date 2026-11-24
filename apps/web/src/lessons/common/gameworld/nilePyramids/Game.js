/**
 * « الأهرامات » — THE WORLD OF A UNIT ABOUT THALÈS'S PROPERTY, played with a lesson's story (it names no lesson).
 * Design: `docs/reports/PYRAMIDS_WORLD_PLAN.md` (§1 the world, §2.2 this class). PHASE 1, a grey box of the risks (§6 row 1):
 *
 *   the Nile runs away from the camera; five DOCKS stand on its east bank in the order of play, the Great Pyramid on
 *   the horizon from the first second;
 *   stage 1 « حقل النيل » is playable WITH its prediction (gate B1): he measures AM and AN with the knotted rope, TYPES
 *   the canal's length, then the rope laid along the canal reads it — as typed · longer · shorter;
 *   stage 2 « ورشة البنّائين » plays ONE course order: the rope up the edge on the built steps (BM), then he computes
 *   the course MN, the quarry cuts his number, the masons lay it — fits · gap · overhang (a fact, never « wrong »);
 *   stages 3 and 5 are the two SCALE BOXES of gate B6 (the 416 m river, the 146 m pyramid and its drawn shadow);
 *   stage 4 is a placeholder; between two docks he sails on the kit's rail AS IT IS (gate F3).
 *
 * THE ONE GESTURE is `gestures.js › slide`, THE ONE ORDER `orders.js › order`; the law is `logic.js`; the look
 * `scenery.js`; every word `strings.js`. One unit is one metre.
 *
 * THE STORY is the lesson's (`lesson.story`, every field optional): `text` (its sentences over the world's), `legs[i]`
 * (the content of the kit's rail from dock i to dock i + 1 — without it the felucca simply sails),
 * `recall(game, stageId)`, `onArrive(game, stageId)`.
 */
import * as THREE from 'three';
import { WorldRuntime } from '../kit/WorldRuntime';
import { GateRun } from '../kit/GateRun';
import {
  FIELD,
  FACE,
  RIVER,
  PLATEAU,
  canalReading,
  fieldPoints,
  courseAt,
  riverWidth,
  pyramidHeight,
  shadowTip,
  sunVector,
  topRate,
  frameDistance,
  typedLength,
  approx,
} from './logic';
import { order, holds } from './orders';
import { slide, slideStep, slideTap, knotsOf, slidePoint, tied } from './gestures';
import {
  BANK_X,
  RIVER_W,
  WATER_Y,
  makePhysicalSky,
  makeGround,
  makePalm,
  makeDock,
  makeFelucca,
  makeField,
  makeStake,
  makeKnottedRope,
  makeTape,
  makeLabel,
  makeStepPyramid,
  makeSlab,
  makeRing,
  makeRay,
  makeGreyPost,
  makeGroundShadow,
  makeStick,
} from './scenery';
import { WORLD_TEXT, withStory } from './strings';

const SKY = [0xa9c4dd, 0xe6cfa2, 0xfff0d6, 4.4, 0.35, 0];
const DOCK_Z = [0, -160, -330, -560, -760];
const STAGE_IDS = ['field', 'workshop', 'river', 'summit', 'plateau'];
const PLAY = { x0: BANK_X, x1: 700, z0: -1150, z1: 60 };
const JETTY = { x0: -12.3, half: 1.8 };
const RAIL = { x: -300, y: 0.3, z: -380 };
const GREAT = { x: 300, z: -800 };
const WORKSHOP = { x: 70, z: -225, courses: 54 }; // 54 courses: the mark BM = 10 is the top of the 6th
const SUN_DAY = sunVector('4/5', 2.5);
const SUN_PLATEAU = sunVector(PLATEAU.tan, Math.PI / 2); // from the east, square to the west face
const AMBER = 0xf59e0b;
const VIOLET = 0x8b5cf6;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const v3 = (p) => new THREE.Vector3(p.x, p.y ?? 0, p.z);

export class NilePyramidsGame extends WorldRuntime {
  // ───────────────────────────── the world's hooks ─────────────────────────────
  initWorld(sv) {
    this.story = this.lesson.story ?? {};
    this.T = withStory(WORLD_TEXT, this.story.text);
    this.done = { ...(sv?.done ?? {}) }; // step id → what it gave (the knots of a measure, the number of an order)
    this.log = [...(sv?.log ?? [])]; // every order and its fact: { stage, kind, typed, fact }
    this.hold = null; // the rope in his hand: { step, s (the slide), sign, cam }
    this.cine = null;
    this.layout();
    this.atStart = clamp(sv?.dock ?? 0, 0, DOCK_Z.length - 1);
  }

  /** Where everything stands, in metres, from the law's numbers (`logic.js`). */
  layout() {
    // stage 1: B and C on a line parallel to the bank (the river side of the field), A inland
    const B = { x: 14, z: -6 };
    const C = { x: 14, z: -6 - approx(FIELD.BC) };
    const [ab, ac, bc] = [approx(FIELD.AB), approx(FIELD.AC), approx(FIELD.BC)];
    const t = (ab * ab - ac * ac + bc * bc) / (2 * bc);
    const A = { x: B.x + Math.sqrt(ab * ab - t * t), z: B.z - t };
    const fp = fieldPoints(FIELD);
    const eu = { x: (B.x - A.x) / ab, z: (B.z - A.z) / ab };
    const cos = approx(FIELD.cosA);
    const sin = Math.sqrt(1 - cos * cos);
    const ev = { x: (C.x - A.x - ac * cos * eu.x) / (ac * sin), z: (C.z - A.z - ac * cos * eu.z) / (ac * sin) };
    const field = {};
    for (const [k, p] of Object.entries(fp))
      field[k] = { x: A.x + p.u * eu.x + p.v * ev.x, y: 0, z: A.z + p.u * eu.z + p.v * ev.z };
    // stage 2: the unfinished pyramid; its face SBC looks at the river (west)
    const half = approx(FACE.base) / 2;
    const h = pyramidHeight(FACE.base, FACE.edge);
    const ws = {
      B: { x: WORKSHOP.x - half, y: 0, z: WORKSHOP.z + half },
      C: { x: WORKSHOP.x - half, y: 0, z: WORKSHOP.z - half },
      S: { x: WORKSHOP.x, y: h, z: WORKSHOP.z },
      h,
    };
    // stage 3: the ferry — A on this bank opposite the far post F, S along the bank, E further, R inland
    const as = approx(RIVER.AS);
    const se = approx(RIVER.SE);
    const er = approx(RIVER.ER);
    const A3 = { x: BANK_X + 1.5, z: DOCK_Z[2] - 8 };
    const river = {
      A: A3,
      S: { x: A3.x, z: A3.z - as },
      E: { x: A3.x, z: A3.z - as - se },
      R: { x: A3.x + er, z: A3.z - as - se },
      F: { x: A3.x - approx(riverWidth(RIVER)), z: A3.z },
    };
    this.pts = { field, ws, river };
    this.stages = this.stageData();
  }

  /** The five stages as DATA: their steps, in order. A step is a slide, a prediction, an order or a look. */
  stageData() {
    const [fresh, old] = FIELD.canals;
    const canalSteps = (c, longOf) => {
      const [m, n] = c.ends;
      return [
        { id: `A${m}`, kind: 'slide', from: 'A', toward: 'B', stake: m, line: '[AB]', target: c.AM, max: FIELD.AB },
        { id: `A${n}`, kind: 'slide', from: 'A', toward: 'C', stake: n, line: '[AC]', target: c.AN, max: FIELD.AC },
        { id: `${m}${n}?`, kind: 'predict', seg: `${m}${n}`, at: m },
        {
          id: `${m}${n}`,
          kind: 'slide',
          canal: true,
          from: m,
          toward: n,
          stake: n,
          seg: `${m}${n}`,
          target: longOf,
          max: String(Number(longOf) + 4),
          predicted: `${m}${n}?`,
        },
      ];
    };
    const course = courseAt(FACE, FACE.courses[0]);
    return [
      {
        id: STAGE_IDS[0],
        longest: FIELD.AC,
        steps: [...canalSteps(fresh, canalReading(FIELD, fresh)), ...canalSteps(old, canalReading(FIELD, old))],
      },
      {
        id: STAGE_IDS[1],
        longest: FACE.courses[0],
        steps: [
          {
            id: 'BM',
            kind: 'slide',
            edge: true,
            from: 'B',
            toward: 'S',
            stake: 'M',
            target: FACE.courses[0],
            max: FACE.courses[0], // the rope walks only on what is BUILT: up to the last course laid
            view: { x: -1, z: 0.35 },
          },
          { id: 'course', kind: 'order', order: 'course', seg: 'MN', at: 'B', truth: course.MN },
        ],
      },
      { id: STAGE_IDS[2], steps: [{ id: 'bank', kind: 'look', box: 'bank' }] },
      { id: STAGE_IDS[3], steps: [], later: true },
      { id: STAGE_IDS[4], steps: [{ id: 'plateau', kind: 'look', box: 'plateau' }] },
    ];
  }

  worldState(sv) {
    const at = clamp(sv?.dock ?? 0, 0, DOCK_Z.length - 1);
    return {
      at,
      objective: '',
      recall: [],
      rope: null,
      register: null,
      verdict: null,
      look: null,
      run: null,
      stars: { ...(sv?.stars ?? {}) },
      hasSave: Boolean(sv && (sv.dock > 0 || Object.keys(sv.done ?? {}).length)),
      islandName: WORLD_TEXT.docks[at],
    };
  }
  /** `dock`: where he stands — never `at`, which the kit's save keeps for its own date (defects D19). */
  worldSave() {
    return { dock: this.state.at, done: this.done, log: this.log, stars: this.state.stars };
  }
  worldCentre() {
    return { x: 200, z: -500 };
  }
  skyTarget() {
    return SKY;
  }
  spawnPoint() {
    return this.dockSpot(this.atStart);
  }
  respawnPoint() {
    return this.dockSpot(this.state.at);
  }
  dockSpot(i) {
    return new THREE.Vector3(BANK_X + 3, 0, DOCK_Z[i]);
  }
  heading() {
    return Math.PI; // down the river, into the screen
  }
  freeLook() {
    return true;
  }
  /** While he holds the rope, ← → are the knots of his slide: they do not walk him. */
  steers() {
    return !this.hold;
  }
  fov() {
    const ph = this.state.phase;
    return ph === 'run' ? 60 : ph === 'look' ? 50 : 55;
  }
  stepPhase(ph) {
    return ph === 'run' || ph === 'build' || ph === 'look' || ph === 'sail';
  }
  lanesLive(ph) {
    return ph === 'run';
  }
  busy() {
    const ph = this.state.phase;
    return ph === 'run' || ph === 'build' || ph === 'sail';
  }
  robotPose(ph) {
    if (ph === 'run') return this.gateRun.pose() ?? { lift: 0, speed: null, sad: false };
    if (ph === 'sail') return { lift: 0.55, speed: 0, sad: false };
    if (this.hold) return { lift: 0, speed: Math.abs(this.hold.s.way) * 3, sad: false };
    return { lift: 0, speed: null, sad: false };
  }
  cameraShot(ph) {
    if (ph === 'run') return this.gateRun.camera();
    if (ph === 'look' && this.cine) return { pos: this.cine.pos, look: this.cine.look, k: 1.6 };
    if (ph === 'sail' && this.sailing) {
      const b = this.felucca.position;
      return { pos: new THREE.Vector3(b.x + 26, 16, b.z + 30), look: new THREE.Vector3(b.x, 1, b.z - 20), k: 3 };
    }
    if (this.hold && (ph === 'play' || ph === 'dialog'))
      return { pos: this.hold.cam.pos, look: this.hold.cam.look, k: 3 };
    // what the masons built is SEEN: the camera stays over the course until he walks again
    if ((ph === 'build' || this.courseShot) && this.cine) return { pos: this.cine.pos, look: this.cine.look, k: 2 };
    return null;
  }
  /** The ground: the east bank and the jetties; the bounds of the play. The water itself pushes him back (`onGround`). */
  walkable(x, z) {
    return x >= JETTY.x0 - 1 && x <= PLAY.x1 && z >= PLAY.z0 && z <= PLAY.z1;
  }
  /** On the bank, or on a jetty? (never in the water) */
  onLand(x, z) {
    if (x >= BANK_X + 0.4) return true;
    return x >= JETTY.x0 && DOCK_Z.some((dz) => Math.abs(z - dz) <= JETTY.half);
  }
  onGround() {
    const p = this.hero.pos;
    if (this.onLand(p.x, p.z)) {
      (this.safe ??= new THREE.Vector3()).copy(p);
      return;
    }
    // the water's edge pushes him back: no fall, no heart (hearts are lost only on the felucca, §1.2)
    if (this.safe) p.set(this.safe.x, p.y, this.safe.z);
    else p.x = BANK_X + 0.5;
    this.hero.vel.set(0, this.hero.vel.y, 0);
    if (this.time - (this.saidWater ?? -99) > 6) {
      this.saidWater = this.time;
      this.say(this.T.say.water, 3);
    }
  }

  // ───────────────────────────── K-f: the sun, its shadow box, the fog ─────────────────────────────
  sunDir() {
    const v = this.state.at === 4 ? SUN_PLATEAU : SUN_DAY;
    return (this.sunVec ??= new THREE.Vector3()).set(v.x, v.y, v.z);
  }
  shadowBox() {
    const at = this.state.at;
    if (at === 4) return { half: 270, near: 10, far: 2000, distance: 900, at: { x: 200, z: GREAT.z } };
    if (at === 1) return { half: 75, near: 1, far: 700, distance: 320, at: WORKSHOP };
    if (at === 0) return { half: 60, near: 1, far: 460, distance: 220, at: { x: 34, z: -44 } };
    return { half: 40, near: 1, far: 420, distance: 200, at: null };
  }
  fogRange() {
    return [700, 4500]; // the Great Pyramid stays in view from the first dock
  }

  // ───────────────────────────── build ─────────────────────────────
  buildWorld() {
    const sc = this.scene;
    // the physical sky of the mock-up replaces the kit's painted one; no sea of clouds over a desert
    this.sky.visible = false;
    for (const c of this.clouds) c.visible = false;
    this.renderer.toneMappingExposure = 0.5;
    this.physSky = makePhysicalSky();
    sc.add(this.physSky.sky);
    this.pmrem = new THREE.PMREMGenerator(this.renderer);
    this.sunStage = null;

    sc.add(makeGround(PLAY));
    this.buildPalms();
    this.docks = DOCK_Z.map((z, i) => {
      const d = makeDock(this.T.docks[i]);
      d.position.set(BANK_X, 0, z);
      sc.add(d);
      return d;
    });
    this.felucca = makeFelucca();
    this.mooring(this.atStart);
    sc.add(this.felucca);
    this.buildField();
    this.buildWorkshop();
    this.buildRiverBox();
    this.buildSummit();
    this.buildPlateau();

    this.rope = makeKnottedRope();
    sc.add(this.rope);
    this.laid = new THREE.Group();
    sc.add(this.laid);

    // the dock of the stage he stands on: look at it, or board the felucca
    DOCK_Z.forEach((z, i) =>
      this.addInteract(
        BANK_X + 2,
        z,
        () => this.dockPrompt(i),
        () => this.dockAct(i),
        3.2,
      ),
    );
    // the rope in his hand: E lets it go wherever he is (defects D26) — read here, not as a bubble over the knot
    this.onDropKey = (e) => {
      if (e.code === 'KeyE' && !e.repeat && this.hold && this.state.phase === 'play') this.drop();
    };
    window.addEventListener('keydown', this.onDropKey);
    this.labelsAt = -1;
    this.gateRun = new GateRun(this, { ...RAIL, onOver: (r) => this.runOver(r) });
    this.gateRun.build();
  }

  buildPalms() {
    let seed = 3;
    const plant = (x, z) => {
      const p = makePalm(seed, 8 + ((seed * 37) % 50) / 10);
      p.position.set(x, 0, z);
      p.rotation.y = seed * 1.7;
      this.scene.add(p);
      seed += 1;
    };
    // the east bank between the stages (never on a dock, a field or a stage's ground)
    for (const [z0, z1] of [
      [50, 12],
      [-100, -140],
      [-260, -320],
      [-500, -545],
      [-600, -740],
    ])
      for (let z = z0; z > z1; z -= 16) plant(BANK_X + 5 + ((seed * 13) % 7), z);
    // the west bank: a line of palms over the crops
    for (let z = 40; z > -1100; z -= 70) plant(BANK_X - RIVER_W - 12 - ((seed * 11) % 20), z);
  }

  buildField() {
    const f = this.pts.field;
    const [fresh, old] = FIELD.canals;
    this.scene.add(
      makeField(
        [f.A, f.B, f.C],
        [fresh, old].map((c) => [f[c.ends[0]], f[c.ends[1]]]),
      ),
    );
    this.stakes = {};
    for (const k of ['A', 'B', 'C', ...fresh.ends, ...old.ends]) {
      const s = makeStake(k);
      s.position.set(f[k].x, 0, f[k].z);
      this.scene.add(s);
      this.stakes[`field:${k}`] = s;
      this.colliders.push({ x: f[k].x, z: f[k].z, r: 0.18 });
    }
    // where a step of the field begins: E there takes the rope (or opens the order)
    for (const k of ['A', ...fresh.ends.slice(0, 1), ...old.ends.slice(0, 1)])
      this.addInteract(
        f[k].x,
        f[k].z,
        () => this.stakePrompt(0, k),
        () => this.stakeAct(0, k),
        2.4,
      );
  }

  buildWorkshop() {
    const { B, C, S, h } = this.pts.ws;
    const n = WORKSHOP.courses;
    const level = Math.round((approx(FACE.courses[0]) / approx(FACE.edge)) * n); // 6 courses built of 54
    this.wsLevel = (h * level) / n;
    this.wsCourse = h / n;
    const pyr = makeStepPyramid({ base: approx(FACE.base), h, courses: n, upTo: level });
    pyr.position.set(WORKSHOP.x, 0, WORKSHOP.z);
    this.scene.add(pyr);
    this.colliders.push({ x: WORKSHOP.x, z: WORKSHOP.z, r: approx(FACE.base) / 2 });
    // the four edges, faint, up to the apex not built yet — the rope never walks on them
    const half = approx(FACE.base) / 2;
    for (const [sx, sz] of [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
    ])
      this.scene.add(makeRay({ x: WORKSHOP.x + sx * half, y: 0, z: WORKSHOP.z + sz * half }, S, 0.08, 0xfff3d6));
    const sB = makeStake('B');
    sB.position.set(B.x - 0.6, 0, B.z + 0.6);
    this.scene.add(sB);
    this.stakes['workshop:B'] = sB;
    const cLabel = makeLabel('C', { bg: 'rgba(29,78,216,0.92)' });
    cLabel.position.set(C.x - 0.6, 2.6, C.z - 0.6);
    const sLabel = makeLabel('S', { bg: 'rgba(29,78,216,0.92)' });
    sLabel.position.set(S.x, S.y + 4, S.z);
    this.scene.add(cLabel, sLabel);
    this.addInteract(
      B.x - 0.6,
      B.z + 0.6,
      () => this.stakePrompt(1, 'B'),
      () => this.stakeAct(1, 'B'),
      2.6,
    );
    this.course = null;
  }

  buildRiverBox() {
    const r = this.pts.river;
    for (const k of ['A', 'S', 'E', 'R']) {
      const p = makeGreyPost(k, 2.4);
      p.position.set(r[k].x, 0, r[k].z);
      this.scene.add(p);
    }
    const far = makeGreyPost('F', 6);
    far.position.set(r.F.x, 0, r.F.z);
    this.scene.add(far);
  }

  buildSummit() {
    // stage 4 is built later (phase 3): a plain limestone capstone waits at its dock
    const cap = makeStepPyramid({ base: 1.5, h: 1.1, courses: 4 });
    cap.position.set(BANK_X + 20, 0, DOCK_Z[3] - 14);
    this.scene.add(cap);
  }

  buildPlateau() {
    const H = approx(PLATEAU.h);
    const base = approx(PLATEAU.base);
    const great = makeStepPyramid({ base, h: H, courses: 64 });
    great.position.set(GREAT.x, 0, GREAT.z);
    this.scene.add(great);
    this.colliders.push({ x: GREAT.x, z: GREAT.z, r: base / 2 });
    for (const [x, z, b, h, n] of [
      [640, -1180, 215, 136, 50],
      [930, -1480, 104, 65, 26],
    ]) {
      const p = makeStepPyramid({ base: b, h, courses: n });
      p.position.set(x, 0, z);
      this.scene.add(p);
    }
    // THE SHADOWS THAT CARRY MATHEMATICS ARE DRAWN (B2, B5): the apex's shadow tip A from `shadowTip`, the triangle of
    // the shadow beyond the west base edge, the stick IN THE SUN beside it, its shadow and its ray
    const az = Math.PI / 2;
    const tip = shadowTip({ tan: PLATEAU.tan, azimuth: az, height: PLATEAU.h, foot: GREAT });
    const half = base / 2;
    this.scene.add(
      makeGroundShadow([
        { x: GREAT.x - half, z: GREAT.z - half },
        { x: GREAT.x - half, z: GREAT.z + half },
        { x: tip.x, z: tip.z },
      ]),
    );
    this.scene.add(makeRay({ x: GREAT.x, y: H, z: GREAT.z }, { x: tip.x, y: 0, z: tip.z }, 0.35, 0xffb21e));
    const A = makeLabel('A', { bg: 'rgba(200,85,61,0.94)' });
    A.position.set(tip.x, 4, tip.z);
    this.scene.add(A);
    const foot = { x: tip.x + 14, z: GREAT.z + 55 };
    const stick = makeStick(approx(PLATEAU.stick));
    stick.position.set(foot.x, 0, foot.z);
    this.scene.add(stick);
    const st = shadowTip({ tan: PLATEAU.tan, azimuth: az, height: PLATEAU.stick, foot });
    this.scene.add(
      makeGroundShadow(
        [
          { x: foot.x, z: foot.z - 0.06 },
          { x: foot.x, z: foot.z + 0.06 },
          { x: st.x, z: st.z + 0.03 },
          { x: st.x, z: st.z - 0.03 },
        ],
        0.6,
      ),
    );
    this.scene.add(
      makeRay({ x: foot.x, y: approx(PLATEAU.stick), z: foot.z }, { x: st.x, y: 0, z: st.z }, 0.03, 0xffb21e),
    );
    this.plateau = { tip, foot, stickTip: st };
  }

  /** The felucca waits at the end of a dock's jetty. */
  mooring(i) {
    this.felucca.position.set(BANK_X - 9, WATER_Y + 0.15, DOCK_Z[i] + 3.6);
    this.felucca.rotation.y = 0;
  }

  restore() {
    for (const st of this.stages)
      for (const step of st.steps) if (step.kind === 'slide' && this.done[step.id] != null) this.layRope(st, step);
    const last = [...this.log].reverse().find((l) => l.stage === STAGE_IDS[1] && l.kind === 'course');
    if (last) this.layCourse(last, false);
    this.hero.island = this.state.at;
    this.set({ recall: this.story.recall?.(this, STAGE_IDS[this.state.at]) ?? [], register: this.registerOf() });
    this.refreshObjective();
  }

  // ───────────────────────────── where he is in the stage ─────────────────────────────
  stageNow() {
    return this.stages[this.state.at];
  }
  stepNow() {
    return this.stageNow().steps.find((s) => this.done[s.id] == null) ?? null;
  }
  stageDone(i = this.state.at) {
    return this.stages[i].steps.every((s) => this.done[s.id] != null);
  }
  /** A point of a stage, by its letter (3D: the edge's points carry their height). */
  point(stageIndex, k) {
    if (stageIndex === 0) return this.pts.field[k];
    return this.pts.ws[k];
  }

  refreshObjective() {
    const ph = this.state.phase;
    if (ph === 'run' || ph === 'sail' || ph === 'build') return;
    const T = this.T.objective;
    const i = this.state.at;
    const step = this.stepNow();
    let o;
    if (!step) o = i === DOCK_Z.length - 1 ? T.end : this.stageNow().later ? T.later : T.board(this.T.docks[i + 1]);
    else if (step.kind === 'slide')
      o = step.edge
        ? T.edge(step.from, step.stake)
        : step.canal
          ? T.canal(step.from, step.stake)
          : T.slide(step.from, step.line, step.stake);
    else if (step.kind === 'predict') o = T.predict(step.seg);
    else if (step.kind === 'order') o = T.course(step.seg);
    else o = T.look;
    if (o !== this.state.objective) this.set({ objective: o });
    this.lightUp();
  }

  /** THE NEXT PLACE IS LIT (`play.md` §1): the stake where the next step begins, or the dock when the stage is over. */
  lightUp() {
    const step = this.stepNow();
    const i = this.state.at;
    const key = step && (step.from ?? step.at) ? `${STAGE_IDS[i]}:${step.from ?? step.at}` : null;
    for (const [k, s] of Object.entries(this.stakes)) s.userData.lamp.visible = !this.hold && k === key;
    this.docks.forEach((d, j) => {
      d.userData.lamp.visible = j === i && (step?.kind === 'look' || (!step && j < DOCK_Z.length - 1));
    });
  }

  /** « سجلّ الحقل »: the rope-stretchers' record, then what HE measured and typed, in the order he did it. */
  registerOf() {
    const i = this.state.at;
    const st = this.stages[i];
    const rows = [];
    if (i === 0) {
      for (const k of ['AB', 'AC', 'BC']) rows.push({ id: k, tex: `${k} = ${FIELD[k]}`, kind: 'record' });
    } else if (i === 1) {
      rows.push(
        { id: 'SB', tex: `SB = SC = ${FACE.edge}`, kind: 'record' },
        { id: 'BC', tex: `BC = ${FACE.base}`, kind: 'record' },
      );
    } else return null;
    for (const step of st.steps) {
      const v = this.done[step.id];
      if (step.kind === 'predict') {
        const typed = this.typed?.[step.id] ?? v;
        if (typed != null)
          rows.push({
            id: step.id,
            tex: `${step.seg} = ${typed.replace(',', '{,}')}`,
            kind: 'typed',
            by: this.T.hud.typed,
          });
      } else if (step.kind === 'order') {
        const last = [...this.log].reverse().find((l) => l.stage === st.id && l.kind === 'course');
        if (last)
          rows.push({
            id: step.id,
            tex: `${step.seg} = ${last.typed.replace(',', '{,}')}`,
            kind: 'typed',
            by: this.T.hud.typed,
            fact: last.fact,
          });
      } else if (step.kind === 'slide' && v != null)
        rows.push({
          id: step.id,
          tex: `${step.seg ?? step.id} = ${v}`,
          kind: 'measured',
          by: step.canal ? this.T.hud.reads : null,
        });
    }
    return { title: i === 0 ? this.T.hud.register : this.T.hud.plan, rows };
  }

  // ───────────────────────────── the stakes and the docks ─────────────────────────────
  stakePrompt(i, k) {
    if (this.state.at !== i || this.hold) return null;
    const step = this.stepNow();
    if (!step) return null;
    if (step.kind === 'slide' && step.from === k) return this.T.prompt.take(k);
    if (step.kind === 'predict' && step.at === k) return this.T.prompt.predict;
    if (step.kind === 'order' && step.at === k) return this.T.prompt.order;
    return null;
  }
  stakeAct(i, k) {
    if (!this.stakePrompt(i, k)) return;
    const step = this.stepNow();
    if (step.kind === 'slide') this.take(step);
    else this.openOrder(step);
  }
  dockPrompt(i) {
    if (this.state.at !== i || this.hold) return null;
    const step = this.stepNow();
    if (step?.kind === 'look') return this.T.prompt.look;
    if (!step && i < DOCK_Z.length - 1) return this.T.prompt.board(this.T.docks[i + 1]);
    return null;
  }
  dockAct(i) {
    const step = this.stepNow();
    if (step?.kind === 'look') this.lookAt(step);
    else if (!step && i < DOCK_Z.length - 1) this.board(i);
  }

  // ───────────────────────────── THE ONE GESTURE: the rope ─────────────────────────────
  /** E at the stake: the rope's end in his hand, along the step's line; the camera frames the whole line. */
  take(step) {
    const i = this.state.at;
    const from = this.point(i, step.from);
    const to = this.point(i, step.toward);
    const dir = { x: to.x - from.x, y: (to.y ?? 0) - (from.y ?? 0), z: to.z - from.z };
    const max = approx(step.max);
    const s = slide({
      id: step.id,
      from,
      dir,
      max,
      target: approx(step.target),
      top: topRate(this.stageNow().longest),
    });
    // the camera stands beside the line, on the dock's side (or where the step says); the key whose arrow points the
    // way the rope grows on the screen lengthens it
    const hl = Math.hypot(s.dir.x, s.dir.z) || 1;
    const hx = s.dir.x / hl;
    const hz = s.dir.z / hl;
    let n = step.view ?? (Math.abs(hx) > 0.15 ? (hx > 0 ? { x: -hz, z: hx } : { x: hz, z: -hx }) : { x: -1, z: 0 });
    if (!step.view && n.z < 0) n = { x: -n.x, z: -n.z };
    const nl = Math.hypot(n.x, n.z);
    n = { x: n.x / nl, z: n.z / nl };
    const right = { x: n.z, z: -n.x };
    const sign = hx * right.x + hz * right.z >= 0 ? 1 : -1;
    const mid = slidePoint(s, max / 2);
    const D = Math.max(13, frameDistance(max * 1.25, max * 0.7, 55));
    const cam = {
      pos: new THREE.Vector3(mid.x + n.x * D * 0.82, mid.y + D * 0.55 + 2, mid.z + n.z * D * 0.82),
      look: new THREE.Vector3(mid.x, mid.y + 0.5, mid.z),
    };
    this.hold = { step, s, sign, cam };
    this.audio.play('ui');
    this.input.take('left');
    this.input.take('right');
    this.set({ rope: { knots: 0, id: step.id, seg: step.seg ?? step.id }, verdict: null });
    this.lightUp();
  }

  /** He lets the rope go: it is rolled back to its stake. */
  drop() {
    const h = this.hold;
    if (!h) return;
    this.hold = null;
    this.rope.visible = false;
    if (h.step.edge) this.standAtFoot(h.step);
    this.set({ rope: null });
    this.refreshObjective();
  }

  /** Back on the ground beside the stake the slide started from (after a slide up an edge). */
  standAtFoot(step) {
    const p = this.point(this.state.at, step.from);
    this.hero.pos.set(p.x - 1.4, 0, p.z + 1.4);
    this.hero.vel.set(0, 0, 0);
    this.hero.grounded = true;
  }

  /** The keys let go on the stake's knot: the rope ties there and its reading goes into the register. */
  tie() {
    const { step } = this.hold;
    const st = this.stageNow();
    this.hold = null;
    this.rope.visible = false;
    this.done[step.id] = step.target;
    this.audio.play('success');
    this.layRope(st, step);
    if (step.edge) this.standAtFoot(step);
    let verdict = null;
    if (step.canal) {
      // the rope reads the canal AFTER he typed it: as typed · longer · shorter (no difference written — gate P1)
      const typed = this.done[step.predicted];
      const out = order('canal', typed, step.target);
      this.log.push({ stage: st.id, kind: 'canal', seg: step.seg, typed, fact: out.fact });
      verdict = { kind: 'canal', fact: out.fact, typed, reading: step.target, seg: step.seg };
      if (holds(out.fact) && step.id === `${FIELD.canals[0].ends.join('')}`) this.addStar(st.id);
    } else this.say(this.T.say.tied(step.seg ?? step.id, step.target), 4);
    this.set({ rope: null, verdict, register: this.registerOf() });
    this.save();
    this.refreshObjective();
    // what comes next is asked at once: the canal's length, the course's order
    const next = this.stepNow();
    if (next && (next.kind === 'predict' || next.kind === 'order'))
      setTimeout(() => !this.dead && this.openOrder(next), 650);
  }

  /** A measured rope stays laid on the ground (or the edge), its knots read over it. */
  layRope(st, step) {
    const i = this.stages.indexOf(st);
    const from = this.point(i, step.from);
    const to = this.point(i, step.toward);
    const L = Math.hypot(to.x - from.x, (to.y ?? 0) - (from.y ?? 0), to.z - from.z);
    const k = approx(step.target) / L;
    const end = {
      x: from.x + (to.x - from.x) * k,
      y: (from.y ?? 0) + ((to.y ?? 0) - (from.y ?? 0)) * k,
      z: from.z + (to.z - from.z) * k,
    };
    const lift = (p) => ({ x: p.x, y: (p.y ?? 0) + 0.1, z: p.z });
    this.laid.add(makeTape(lift(from), lift(end), 0.08, 0.08));
    const label = makeLabel(step.target, { bg: 'rgba(120,72,12,0.9)', px: 18 });
    label.position.set((from.x + end.x) / 2, ((from.y ?? 0) + end.y) / 2 + 1.6, (from.z + end.z) / 2);
    this.laid.add(label);
  }

  addStar(stageId) {
    const stars = { ...this.state.stars, [stageId]: Math.min(3, (this.state.stars[stageId] ?? 0) + 1) };
    this.audio.play('star', 1);
    this.say(this.T.say.star, 3);
    this.set({ stars });
  }

  // ───────────────────────────── THE ONE ORDER ─────────────────────────────
  openOrder(step) {
    if (this.state.phase !== 'play' && this.state.phase !== 'dialog') return;
    this.set({
      overlay: {
        type: 'order',
        kind: step.kind === 'predict' ? 'canal' : step.order,
        seg: step.seg,
        id: step.id,
        refused: null,
      },
      phase: 'dialog',
      prompt: null,
    });
  }
  /** « لاحقًا »: the card closes; the stake where it is asked opens it again. */
  closeOrder() {
    this.closeOverlay();
    this.refreshObjective();
  }
  /** His number: a prediction is kept for the rope to answer; a course is cut and laid — the world builds his number. */
  sendOrder(text) {
    const o = this.state.overlay;
    const step = this.stageNow().steps.find((s) => s.id === o?.id);
    if (!step) return;
    if (step.kind === 'predict') {
      const typed = typedLength(text);
      if (typed == null) return this.set({ overlay: { ...o, refused: 'empty' } });
      this.done[step.id] = typed;
      this.closeOverlay();
      this.set({ register: this.registerOf() });
      this.save();
      this.refreshObjective();
      return undefined;
    }
    const out = order(step.order, text, step.truth);
    if (out.refused) return this.set({ overlay: { ...o, refused: out.refused } });
    const entry = { stage: this.stageNow().id, kind: step.order, seg: step.seg, typed: out.typed, fact: out.fact };
    this.log.push(entry);
    this.closeOverlay();
    this.set({ verdict: null, register: this.registerOf() });
    this.layCourse(entry, true).then(() => {
      if (this.dead) return;
      if (holds(out.fact)) {
        this.done[step.id] = out.typed;
        if (this.log.filter((l) => l.stage === entry.stage && l.kind === 'course').length === 1)
          this.addStar(entry.stage);
      }
      this.set({ phase: 'play', verdict: { kind: 'course', fact: out.fact, typed: out.typed, seg: step.seg } });
      this.save();
      this.refreshObjective();
    });
    return undefined;
  }

  /** The quarry cuts his course and the masons lower it onto its level; a gap or an overhang is drawn, never measured. */
  layCourse(entry, animate) {
    if (this.course) {
      this.scene.remove(this.course);
      this.course.traverse((o) => o.geometry?.dispose());
    }
    const side = approx(entry.typed);
    const need = approx(courseAt(FACE, FACE.courses[0]).MN);
    const g = new THREE.Group();
    const slab = makeSlab(side, this.wsCourse);
    g.add(slab);
    if (entry.fact === 'gap') {
      const ring = makeRing(side, need, 0.12, AMBER);
      ring.position.y = -this.wsCourse / 2 + 0.06;
      g.add(ring);
    } else if (entry.fact === 'overhang') {
      const ring = makeRing(need, side, 0.12, VIOLET);
      ring.position.y = -this.wsCourse / 2 - 0.02;
      g.add(ring);
    }
    const y = this.wsLevel + this.wsCourse / 2;
    g.position.set(WORKSHOP.x, animate ? y + 16 : y, WORKSHOP.z);
    this.scene.add(g);
    this.course = g;
    if (!animate) return Promise.resolve();
    const top = this.wsLevel;
    this.cine = {
      pos: new THREE.Vector3(WORKSHOP.x - 80, top + 52, WORKSHOP.z + 62),
      look: new THREE.Vector3(WORKSHOP.x, top, WORKSHOP.z),
    };
    this.courseShot = true;
    this.set({ phase: 'build', prompt: null });
    this.say(this.T.say.built, 3);
    this.audio.play('ui');
    return this.tween(2.4, (t) => {
      g.position.y = y + 16 * (1 - t);
    }).then(() => {
      this.shake = 0.25;
      this.audio.play(holds(entry.fact) ? 'success' : 'hit');
    });
  }

  // ───────────────────────────── the scale boxes: a look at the whole stage (B6) ─────────────────────────────
  lookAt(step) {
    const shots = {
      // the ferry: from the bank behind A, the far post F 416 m across in view
      bank: { pos: new THREE.Vector3(160, 120, -250), look: new THREE.Vector3(-170, 0, -420) },
      // the plateau, about 350 m: the pyramid, its drawn shadow up to A, the stick in the sun
      plateau: { pos: new THREE.Vector3(-60, 150, -430), look: new THREE.Vector3(190, 40, -800) },
    };
    this.cine = shots[step.box];
    this.lookStep = step;
    this.lookSince = this.time;
    this.set({ phase: 'look', look: step.box, prompt: null });
  }
  endLook() {
    if (this.state.phase !== 'look') return;
    this.cine = null;
    if (this.lookStep) this.done[this.lookStep.id] = '1';
    this.lookStep = null;
    this.input.clear();
    this.set({ phase: 'play', look: null });
    this.save();
    this.refreshObjective();
  }

  // ───────────────────────────── between two docks: the felucca, on the kit's rail as it is (gate F3) ─────────────────────────────
  board(i) {
    if (this.busy() || !this.stageDone(i)) return; // the game holds the order (§3.2)
    this.fromDock = i;
    const leg = this.story.legs?.[i];
    if (leg) {
      this.runContent = leg;
      this.runWon = false;
      this.set({ objective: '', verdict: null });
      this.gateRun.open(leg);
    } else this.sail(i);
  }
  startRun() {
    this.gateRun.start();
    return true;
  }
  runLane(d) {
    this.gateRun.lane(d);
  }
  pauseRun(on) {
    this.gateRun.pause(on);
  }
  runOver(result) {
    this.runWon = result.won;
    return {};
  }
  leaveRun() {
    this.gateRun.hide();
    this.set({ run: null });
    if (this.runWon) this.arrive(this.fromDock + 1);
    else {
      this.hero.pos.copy(this.dockSpot(this.state.at));
      this.hero.vel.set(0, 0, 0);
      this.hero.grounded = true;
      this.set({ phase: 'play' });
      this.lookTo(Math.PI);
      this.refreshObjective();
    }
  }
  /** Without a course of gates the felucca simply sails, Zero aboard. */
  sail(i) {
    this.sailing = { from: i, to: i + 1, t: 0 };
    this.say(this.T.say.sail, 3);
    this.set({ phase: 'sail', prompt: null, objective: '', verdict: null });
  }
  arrive(i) {
    this.sailing = null;
    this.mooring(i);
    this.hero.pos.copy(this.dockSpot(i));
    this.hero.vel.set(0, 0, 0);
    this.hero.grounded = true;
    this.safe = null;
    this.lookTo(Math.PI);
    const id = STAGE_IDS[i];
    this.set({
      at: i,
      stage: Math.max(this.state.stage, i),
      phase: 'play',
      islandName: this.T.docks[i],
      recall: this.story.recall?.(this, id) ?? [],
      register: null,
      verdict: null,
    });
    this.set({ register: this.registerOf() });
    this.story.onArrive?.(this, id);
    this.save(); // after the story's hook: a flag it sets survives a reload (defects D20)
    this.refreshObjective();
  }

  /**
   * A label keeps its size on screen, so a far one would clutter the horizon: in play only the labels near the camera
   * show; a look at a stage shows that stage's; the rail shows none (its numbers are the page's).
   */
  showLabels(ph) {
    if (this.time - this.labelsAt < 0.25) return;
    this.labelsAt = this.time;
    const cam = this.camera.position;
    const p = this.tmpL ?? (this.tmpL = new THREE.Vector3());
    this.scene.traverse((o) => {
      if (!o.isSprite || !o.userData.set) return;
      o.getWorldPosition(p);
      if (ph === 'run') o.visible = false;
      else if (ph === 'look') o.visible = !o.userData.dock && this.stageOf(p.z) === this.state.at;
      else o.visible = p.distanceTo(cam) < (o.userData.dock ? 120 : 170);
    });
  }
  /** The stage a point of the world belongs to, by its place along the river. */
  stageOf(z) {
    const mid = [-45, -225, -410, -575, -800];
    return mid.reduce((best, m, i) => (Math.abs(z - m) < Math.abs(z - mid[best]) ? i : best), 0);
  }

  dispose() {
    window.removeEventListener('keydown', this.onDropKey);
    this.gateRun?.dispose();
    this.envRT?.dispose();
    this.pmrem?.dispose();
    super.dispose();
  }

  // ───────────────────────────── each step ─────────────────────────────
  stepWorld(dt, ph) {
    if (ph === 'run') this.gateRun.step(dt);
    // the sky's sun follows the stage (K-f): its environment is rebuilt only when the stage changes
    if (this.sunStage !== this.state.at) {
      this.sunStage = this.state.at;
      this.physSky.setSun(this.sunDir());
      this.envRT?.dispose();
      this.envRT = this.pmrem.fromScene(this.physSky.envScene, 0.04);
      this.scene.environment = this.envRT.texture;
      this.scene.environmentIntensity = 0.2;
    }
    this.physSky.sky.position.copy(this.camera.position);
    this.felucca.position.y = WATER_Y + 0.15 + Math.sin(this.time * 1.6) * 0.08;
    if (ph === 'sail' && this.sailing) this.stepSail(dt);
    if (ph === 'look' && this.time - this.lookSince > 0.8) {
      const ax = this.input.axis();
      if (Math.hypot(ax.x, ax.y) > 0.3) this.endLook();
    }
    for (const s of Object.values(this.stakes))
      if (s.userData.lamp.visible) s.userData.lamp.scale.setScalar(1 + Math.sin(this.time * 4) * 0.15);
    for (const d of this.docks)
      if (d.userData.lamp.visible) d.userData.lamp.material.emissiveIntensity = 1.1 + Math.sin(this.time * 3) * 0.4;
    const h = this.hold;
    this.showLabels(ph);
    if (this.courseShot && ph === 'play') {
      const ax = this.input.axis();
      if (Math.hypot(ax.x, ax.y) > 0.3 || this.hold) {
        this.courseShot = false;
        this.cine = null;
      }
    }
    if (!h || ph !== 'play') return;
    // HIS SLIDE IS THE LENGTH: a tap is a knot, a key held goes faster and faster
    let s = h.s;
    if (this.input.take('left')) s = slideTap(s, -h.sign);
    if (this.input.take('right')) s = slideTap(s, h.sign);
    const ax = this.input.axis().x;
    s = slideStep(s, Math.abs(ax) > 0.5 ? Math.sign(ax) * h.sign : 0, dt);
    h.s = s;
    const p = slidePoint(s);
    const hero = this.hero;
    hero.pos.set(p.x, p.y, p.z);
    if (h.step.edge) hero.pos.x -= 0.5;
    hero.vel.set(0, 0, 0);
    hero.grounded = true;
    hero.yaw = Math.atan2(s.dir.x, s.dir.z) * (s.way < 0 ? -1 : 1);
    this.view = Math.atan2(s.dir.x, s.dir.z);
    const knots = knotsOf(s);
    this.rope.visible = true;
    this.rope.userData.set(s.from, p, s.pos);
    this.rope.userData.label.userData.set(String(knots));
    if (knots !== this.state.rope?.knots) this.set({ rope: { ...this.state.rope, knots } });
    if (tied(s)) this.tie();
  }

  stepSail(dt) {
    const sl = this.sailing;
    sl.t = Math.min(1, sl.t + dt / 6);
    const e = sl.t < 0.5 ? 2 * sl.t * sl.t : 1 - (-2 * sl.t + 2) ** 2 / 2;
    const z = DOCK_Z[sl.from] + (DOCK_Z[sl.to] - DOCK_Z[sl.from]) * e;
    this.felucca.position.set(BANK_X - 24 - Math.sin(e * Math.PI) * 30, this.felucca.position.y, z + 3.6);
    this.felucca.rotation.y = 0;
    const b = this.felucca.position;
    this.hero.pos.set(b.x, b.y + 0.2, b.z + 1.2);
    this.hero.yaw = Math.PI;
    if (sl.t >= 1) this.arrive(sl.to);
  }
}

/** For the walks (`window.__np`, in development only): Zero placed at a dock, a step marked done — never an answer. */
export const devHandles = {
  __np: {
    toDock: (i) => window.__world?.arrive(i),
    stepNow: () => window.__world?.stepNow()?.id ?? null,
    points: () => window.__world?.pts,
    v3,
  },
};
