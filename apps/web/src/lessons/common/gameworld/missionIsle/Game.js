/**
 * « جزيرة المهمّات » — THE WORLD OF A UNIT'S LAST LESSON (« أدمج تعلّماتي », `INTEGRATION_LESSON_PLAN.md` §4): one island,
 * the oasis depot, and nothing to forge. The lesson gives its missions as DATA (`lesson.missions`); this world shows
 * them from the island's home, plays the one he opens (the scenes are the depot's: `divisorIsles/Depot.js`), keeps
 * what he finished (stars, coins) in his save, and opens the lesson's exam sitting (the bank, the kit's screen).
 * It names no lesson. The robot does not walk here: the island is the stage of the missions.
 */
import * as THREE from 'three';
import { WorldRuntime } from '../kit/WorldRuntime';
import { Depot } from '../divisorIsles/Depot';

const SKY = [0x3a8dff, 0xcfeeff, 0xfff6e6, 2.6, 1.0, 0];
const MISSION_PAN = new THREE.Vector3(0, 2.4, 3.2); // the notebook and the paper stand on the two sides
const CENTRE = { x: -340, z: 280 };

export class MissionIsleGame extends WorldRuntime {
  initWorld(sv) {
    this.done = { ...(sv?.missions ?? {}) };
  }
  worldState() {
    return { mission: null, missions: this.done, stars: {}, islandName: this.lesson.text.island };
  }
  worldSave() {
    return { missions: this.done };
  }
  worldCentre() {
    return CENTRE;
  }
  buildWorld() {
    this.depot = new Depot(this);
  }
  spawnPoint() {
    return this.depot.robotSpot.clone();
  }
  respawnPoint() {
    return this.depot.robotSpot.clone();
  }
  skyTarget() {
    return SKY;
  }
  heading() {
    return 1.9;
  }
  followsHero() {
    return false;
  }
  restore() {
    this.hero.yaw = 1.9;
    // no title screen and no road: the world opens on its home, the missions of the lesson
    this.state = { ...this.state, phase: 'home', stars: this.starsOf(), stage: this.stageOf() };
    this.qaMission();
  }
  starsOf() {
    return Object.fromEntries(Object.entries(this.done).map(([id, d]) => [id, d.stars ?? 0]));
  }
  stageOf() {
    return Object.keys(this.done).length;
  }
  busy() {
    return Boolean(this.state.mission);
  }
  cameraShot(ph) {
    const cine = super.cameraShot(ph);
    if (cine) return cine;
    const pan = this.state.mission ? MISSION_PAN : new THREE.Vector3(0, 3.4, 4.6);
    return { pos: this.depot.camPos.clone().add(pan), look: this.depot.camLook.clone().add(pan), k: 2.4 };
  }

  /** The dev pages `/__qa/…` name a mission in `window.__qaMission`: the world opens on it (never in a real lesson). */
  qaMission() {
    if (!import.meta.env.DEV || typeof window === 'undefined' || !window.__qaMission) return;
    if (!window.location.pathname.startsWith('/__qa/')) return;
    this.startMission(window.__qaMission);
  }

  // ── the kit's doors: this world has no map, no launch kit and no title — they all lead home ──
  home() {
    this.set({ overlay: null, phase: 'home' });
  }
  openMap() {
    this.home();
  }
  closeMap() {
    this.home();
  }
  closeOverlay() {
    this.home();
  }
  roam() {
    this.home();
  }
  openBag() {}
  openSitting(level = 1) {
    this.audio.unlock();
    super.openSitting(level);
  }

  /** The mission served from the bank: one sheet of the lesson's bank in exam form (the kit's sitting), whatever the ladder. */
  openBank() {
    this.audio.unlock();
    const level = this.lesson.bank.level;
    this.openHub({ type: 'sitting', level, weak: this.exam.weak?.[level] ?? [], n: (this.exam.sittings ?? 0) + 1 });
  }
  quitSitting() {
    this.home();
  }
  finishSitting(level, mark, total, weak) {
    super.finishSitting(level, mark, total, weak);
    if (level !== this.lesson.bank.level) return;
    // the bank mission is done once a sheet was handed in; its stars are the sitting's
    const stars = this.exam.best?.[level]?.stars ?? 0;
    const before = this.done[this.lesson.bank.id];
    this.done = {
      ...this.done,
      [this.lesson.bank.id]: { stars: Math.max(before?.stars ?? 0, stars), times: (before?.times ?? 0) + 1 },
    };
    const all = this.allDone();
    this.set({ missions: this.done, stars: this.starsOf(), stage: this.stageOf(), finished: all });
    this.save();
  }
  allDone() {
    return [...this.lesson.missions.map((m) => m.id), this.lesson.bank.id].every((id) => this.done[id]);
  }

  // ── a mission ──
  startMission(sit) {
    this.audio.unlock();
    this.audio.startMusic();
    this.depot.clearSim();
    if (sit.scene?.kind === 'ring') this.depot.setPlot(sit.scene);
    else {
      this.depot.clearPlot();
      this.depot.setStock({ a: null, b: null }, sit.kinds);
      this.depot.stockLabel(null, null, sit.stock);
    }
    this.input.clear();
    this.set({ phase: 'mission', overlay: null, mission: sit });
  }
  async missionRun(spec, opts = {}) {
    const sit = this.state.mission;
    if (!sit) return null;
    if (spec.ring) return this.depot.runRing(spec.ring);
    if (spec.pairing) {
      this.depot.stockLabel(sit.stock.a, sit.stock.b, sit.stock);
      await this.depot.runPairing(spec.pairing, spec.colors);
    } else await this.depot.runLots(spec, sit.kinds, { cheer: Boolean(opts.cheer), stock: spec.stock ?? null });
    if (opts.ship && !this.dead && this.state.mission === sit) {
      this.robot.cheer();
      await this.wait(0.9);
      await this.depot.ship();
    }
    return null;
  }
  missionStock(a, b) {
    if (this.state.mission?.scene?.kind) return;
    this.depot.stockLabel(a, b, this.state.mission?.stock ?? null);
  }
  missionCheer(big = false) {
    if (this.dead || !this.state.mission) return;
    this.robot.cheer();
    const at = this.hero.pos.clone().setY(1.4);
    if (!big) {
      this.audio.play('star', 1);
      this.particles.burst(at, 0xfbbf24, 18, 3, 3, 0.9);
      return;
    }
    this.audio.play('success');
    [0, 1, 2].forEach((k) => setTimeout(() => !this.dead && this.audio.play('star', k), 250 + k * 240));
    for (let i = 0; i < 7; i += 1)
      setTimeout(
        () =>
          !this.dead &&
          this.particles.burst(
            at.clone().add(new THREE.Vector3((i - 3) * 2.2, 1, 0)),
            [0xfbbf24, 0x34d399, 0xa5f3fc][i % 3],
            26,
            4,
            5,
            1.4,
          ),
        i * 160,
      );
    this.shake = 0.1;
  }
  /** A mission reached its end: what he earned is kept (his best). All done = the lesson is finished (`save.finished`: the shell then marks every module, kit/storyEnd.js). */
  missionDone(result) {
    const sit = this.state.mission;
    if (!sit) return;
    const before = this.done[sit.id];
    this.done = {
      ...this.done,
      [sit.id]: {
        stars: Math.max(before?.stars ?? 0, result.stars),
        coins: Math.max(before?.coins ?? 0, result.coins),
        times: (before?.times ?? 0) + 1,
      },
    };
    const all = this.allDone();
    this.set({ missions: this.done, stars: this.starsOf(), stage: this.stageOf(), finished: all });
    this.save();
  }
  leaveMission() {
    this.depot.clearSim();
    this.depot.clearPlot();
    this.set({ mission: null, phase: 'home' });
  }
}
