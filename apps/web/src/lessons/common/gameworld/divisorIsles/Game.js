/**
 * « أرخبيل القواسم » — a game world (student only), played with the content of the lesson that names it in its pack.
 *
 * A chain of floating islands. Between two islands a gap of `a` cells; the student carries a mould of length `b` and fires
 * planks of that length: the scene lays q planks and shows the r cells left (a = b × q + r). The bridge HOLDS only when r = 0,
 * otherwise it crumbles — so « b is a divisor of a » is something the student sees happen before any word names it.
 *
 * This file is the MECHANIC: the islands, the gaps, the moulds, the forge, the storm, the statues, the last bridge, the gate
 * dash and the real-world cases. The scene, the loop, the robot, the camera, the hub and the save are the kit's
 * (`kit/WorldRuntime.js`), which it extends and feeds through its hooks. The lesson's content comes as `this.lesson`.
 * React (DivisorIsles.jsx) only draws the HUD and overlays from `state` and calls the public methods.
 */
import * as THREE from 'three';
import {
  seeded,
  std,
  glow,
  textSprite,
  makeIsland,
  makeTree,
  makeRock,
  makeFlower,
  makeBigCrystal,
  mouldColor,
  makePedestal,
  makeMould,
  makeAltar,
  makeBeacon,
  makePylon,
  makeSign,
  makeAnvil,
  makeStatue,
  makeHoverboard,
  makeLighthouse,
} from '../engine/builders';
import { divide, predictOptions, bridgeStars, buildLayout, DASH_WAVES, DASH, checkDivision, STATUES } from './logic';
import { T, waveSay, waveHint } from './strings';
import { gatePoints, PRACTICE_HEARTS, MAX_WAVES } from '../kit/ladder';
import { makeMission, judge, facts, answerParts, WORLD_OF, ORDER_PAY, MISTAKE_COST, CASE_HEARTS } from './cases';
import { Depot } from './Depot';
import { WorldRuntime, easeOut, damp } from '../kit/WorldRuntime';
import { ShareScene, TileScene } from './Worlds';

/** The 3D worlds of the real cases, built the first time they are played. */
const WORLDS = { depot: Depot, share: ShareScene, tiling: TileScene };

const BRIDGE_HALF = 1.15;

/** Sky palettes along the journey: morning → noon → gold → dusk → night. [top, bottom, sun colour, sun intensity, ambient, night] */
const SKIES = [
  [0x3f94ff, 0xd4f1ff, 0xfff4dc, 2.5, 1.0, 0],
  [0x3a8dff, 0xcfeeff, 0xfff6e6, 2.6, 1.0, 0],
  [0x3585f5, 0xc9eaff, 0xfffaf0, 2.7, 1.0, 0],
  [0x3f86ee, 0xd3e9ff, 0xfff4e0, 2.6, 1.0, 0],
  [0x4a84e6, 0xdfe8ff, 0xffeed2, 2.6, 0.98, 0],
  [0x5682dc, 0xf2e4f0, 0xffe6c4, 2.5, 0.95, 0],
  [0x5f72cc, 0xf1dbe6, 0xffd9bb, 2.4, 0.95, 0.1],
  [0x2c3788, 0xc6c4ea, 0xffd0b4, 2.1, 0.92, 0.45],
  [0x0b1038, 0x2a3a7a, 0x9fb8ff, 1.1, 0.8, 1],
];

export class DivisorIslesGame extends WorldRuntime {
  // ───────────────────────────── what this world gives the runtime (kit/WorldRuntime.js › hooks) ─────────────────────────────
  initWorld(sv) {
    this.layout = buildLayout();
    this.isl = this.layout.islands;
    this.segs = this.layout.segs.map((s) => ({
      ...s,
      planks: [],
      builtLen: 0,
      complete: false,
      stat: { firstPrediction: null, falls: 0, fails: 0 },
    }));
    // the student's crossing as evidence for the rule forge (every bridge fired)
    this.log = [...(sv?.log ?? [])];
  }
  worldState(sv) {
    return {
      held: null,
      equation: null,
      pinned: null,
      stars: { ...(sv?.stars ?? {}) },
      verdict: null,
      objective: '',
      dash: null,
      hasSave: Boolean(sv && (sv.stage > 0 || Object.keys(sv.stars ?? {}).length)),
      islandName: this.isl[sv?.stage ?? 0].name,
      depot: null,
    };
  }
  worldSave() {
    return { stars: this.state.stars, log: this.log };
  }
  worldCentre() {
    return this.isl[Math.floor(this.isl.length / 2)];
  }
  buildWorld(cr) {
    // far islets, only scenery
    for (let i = 0; i < 16; i += 1) {
      const isl = this.isl[Math.floor(cr() * this.isl.length)];
      const a = cr() * Math.PI * 2;
      const d = 45 + cr() * 70;
      const R = 2.5 + cr() * 4;
      const x = isl.x + Math.cos(a) * d;
      const z = isl.z + Math.sin(a) * d;
      if (this.isl.some((o) => Math.hypot(o.x - x, o.z - z) < o.R + R + 14) || this.nearAnySegment(x, z, R + 8))
        continue;
      const g = makeIsland(R, ['meadow', 'pine', 'autumn', 'crystal'][i % 4], 300 + i);
      g.position.set(x, -6 + cr() * 14, z);
      const tr = makeTree(['meadow', 'pine', 'autumn', 'crystal'][i % 4], cr, 1.2);
      g.add(tr);
      g.userData.bob = cr() * 6;
      this.scene.add(g);
      this.clouds.push(g);
      g.userData.v = 0;
    }

    this.isl.forEach((isl, i) => this.buildIsland(isl, i));
    this.segs.forEach((seg) => (seg.kind === 'rail' ? this.buildRail(seg) : this.buildBridge(seg)));
    this.heldMesh = null;
  }
  spawnPoint() {
    return this.spawnOf(this.state.stage);
  }
  /** The sky follows the journey; the depot of the practice game works in daylight, whatever the hour of the story. */
  skyTarget() {
    return this.caseRun ? SKIES[1] : SKIES[Math.min(this.state.finished ? 8 : this.state.stage, 8)];
  }
  heading() {
    const seg = this.segs[Math.min(this.state.stage, this.segs.length - 1)];
    return Math.atan2(seg.dx, seg.dz);
  }
  cameraShot(ph) {
    const h = this.hero;
    const want = new THREE.Vector3();
    const look = new THREE.Vector3();
    let k = 4.5;
    if (ph === 'title' && !this.dash && !this.caseRun) {
      const a = this.time * 0.12 + 0.6;
      const c = this.isl[this.state.stage];
      want.set(c.x + Math.sin(a) * 19, 8.5, c.z + Math.cos(a) * 19);
      look.set(c.x, 1.2, c.z);
      k = 2;
    } else if (ph === 'end') {
      const a = this.time * 0.16;
      const c = this.lighthouseWorld;
      want.set(c.x + Math.sin(a) * 30, 15, c.z + Math.cos(a) * 30);
      look.set(c.x, 8, c.z);
      k = 1.2;
    } else {
      const cine = super.cameraShot(ph);
      if (cine) return cine;
      if (this.caseRun) {
        want.copy(this.depot.camPos);
        look.copy(this.depot.camLook);
        k = 2.4;
      } else if (this.dash) {
        const rail = this.segs[5];
        const off = this.dash.v * 0.7;
        want.set(h.pos.x - rail.dx * 7.5 - rail.rx * off, 4.6, h.pos.z - rail.dz * 7.5 - rail.rz * off);
        look.set(h.pos.x + rail.dx * 9 - rail.rx * off, 1.6, h.pos.z + rail.dz * 9 - rail.rz * off);
        k = 8;
      } else return null;
    }
    return { pos: want, look, k };
  }
  followsHero(ph) {
    return super.followsHero(ph) && !this.dash && !this.caseRun;
  }
  fov() {
    return this.dash ? 60 : this.caseRun ? 50 : 55;
  }
  busy() {
    return Boolean(this.dash || this.caseRun);
  }
  /** The rule forge is a full-screen page too. */
  pausesWorld(page) {
    return page === 'forge' || super.pausesWorld(page);
  }
  onStart() {
    if (this.state.stage === 0 && !this.segs[0].complete) this.say(T.say.hello, 10);
    // a forge left unfinished (the page was closed on island « المرايا ») opens again: the key cannot be skipped
    if (this.state.stage === 3 && !this.state.keys.includes('qasim-baqi'))
      this.wait(0.9).then(() => !this.dead && this.state.phase === 'play' && !this.state.overlay && this.openForge());
  }
  onGround() {
    const h = this.hero;
    const i = this.isl.findIndex((isl) => Math.hypot(h.pos.x - isl.x, h.pos.z - isl.z) <= isl.R - 0.12);
    if (i >= 0) {
      h.island = i;
      if (i === this.state.stage + 1 && this.segs[this.state.stage]?.complete) this.arrive(i);
    }
  }
  respawnPoint() {
    return this.isl[this.hero.island].spawn;
  }
  onFall() {
    const seg = this.segs[this.state.stage];
    if (seg && !seg.complete) seg.stat.falls += 1;
    this.say(T.say.fall[this.state.falls % T.say.fall.length], 4);
  }
  stepPhase(ph, dt) {
    if (ph !== 'dash' || !this.dash) return false;
    this.updateDash(dt);
    return true;
  }
  lanesLive(ph) {
    return ph === 'dash';
  }
  robotPose(ph) {
    const eq = this.state.equation;
    return {
      lift: this.dash ? 0.15 : 0,
      speed: this.dash ? 4 : null,
      sad: Boolean(ph === 'forge' && eq && !eq.live && eq.r > 0 && this.state.verdict?.right !== true),
    };
  }
  stepWorld(dt, ph) {
    const h = this.hero;
    if (this.heldMesh) {
      this.heldMesh.position.set(h.pos.x, h.pos.y + 2.75 + Math.sin(this.time * 2.5) * 0.08, h.pos.z);
      this.heldMesh.userData.box.rotation.y += dt * 1.2;
    }
    for (const isl of this.isl)
      for (const p of isl.pedestals) {
        const m = p.group.userData.mould;
        m.position.y = 1.75 + Math.sin(this.time * 2 + p.b) * 0.1;
        m.userData.box.rotation.y += dt * 0.8;
      }
    for (const seg of this.segs)
      if (seg.altar) {
        const u = seg.altar.userData;
        u.prism.rotation.y += dt * 1.5;
        u.prism.position.y = 1.55 + Math.sin(this.time * 2.2) * 0.12;
        // the beacon: this platform is the next step (a mould is in hand, or the last bridge is open)
        const next =
          ph === 'play' &&
          seg.index === this.state.stage &&
          (seg.boss
            ? Boolean(this.flags.key4) && !(seg.complete && this.flags.bossPaid)
            : !seg.complete && this.state.held != null);
        u.beacon.visible = next;
        if (next) u.beacon.userData.animate(this.time, dt, this.activeIt === seg.altarIt);
      }
    if (this.stoneBeacon) {
      const on = ph === 'play' && this.state.stage === 7 && !this.flags.key4;
      this.stoneBeacon.visible = on;
      if (on) this.stoneBeacon.userData.animate(this.time, dt, this.activeIt === this.stoneIt);
    }
    if (this.gapPulse) this.gapPulse.material.opacity = 0.35 + Math.abs(Math.sin(this.time * 7)) * 0.45;
    if (this.anvil) {
      this.anvil.userData.spark.rotation.y += dt * 2;
      this.anvil.userData.spark.visible = Boolean(this.flags.anvil);
    }
    if (this.statueRing) this.statueRing.visible = !this.flags.statues;
    if (this.board && !this.dash && !this.segs[5].complete)
      this.board.position.y = 0.35 + Math.sin(this.time * 2.4) * 0.07;
    if (this.lit) this.lighthouse.userData.beams.rotation.y += dt * 0.5;
    if (this.depot) this.depot.update(this.time);
  }

  // ───────────────────────────── store ─────────────────────────────

  // ───────────────────────────── helpers ─────────────────────────────
  segPoint(seg, u, v = 0, y = 0) {
    return new THREE.Vector3(seg.sx + seg.dx * u + seg.rx * v, y, seg.sz + seg.dz * u + seg.rz * v);
  }
  exitDir(i) {
    const s = this.segs[Math.min(i, this.segs.length - 1)];
    return { dx: s.dx, dz: s.dz, rx: s.rx, rz: s.rz };
  }
  entryDir(i) {
    const s = this.segs[Math.max(0, i - 1)];
    return { dx: s.dx, dz: s.dz, rx: s.rx, rz: s.rz };
  }
  spawnOf(i) {
    const isl = this.isl[i];
    if (i === 0) return new THREE.Vector3(isl.x, 0, isl.z + 3.2);
    const d = this.entryDir(i);
    return new THREE.Vector3(isl.x - d.dx * (isl.R - 2.6), 0, isl.z - d.dz * (isl.R - 2.6));
  }

  // ───────────────────────────── build ─────────────────────────────

  nearAnySegment(x, z, margin) {
    return this.layout.segs.some((s) => {
      const u = (x - s.sx) * s.dx + (z - s.sz) * s.dz;
      const v = (x - s.sx) * s.rx + (z - s.sz) * s.rz;
      return u > -margin && u < s.len + margin && Math.abs(v) < margin;
    });
  }

  buildIsland(isl, i) {
    const g = makeIsland(isl.R, isl.theme, 11 + i * 7);
    g.position.set(isl.x, 0, isl.z);
    this.scene.add(g);
    isl.group = g;
    isl.pedestals = [];
    const rand = seeded(500 + i * 13);
    const out = this.exitDir(i);
    const inn = this.entryDir(i);
    const last = i === this.isl.length - 1;
    const reserved = [];
    const axis = last ? inn : out;
    const local = (u, v) => ({ x: axis.dx * u + axis.rx * v, z: axis.dz * u + axis.rz * v });

    // name sign near the entrance
    const sign = makeSign(isl.name);
    const sp =
      i === 0
        ? { x: -3.4, z: 4.4 }
        : { x: -inn.dx * (isl.R - 1.6) + inn.rx * 2.6, z: -inn.dz * (isl.R - 1.6) + inn.rz * 2.6 };
    sign.position.set(sp.x, 0, sp.z);
    g.add(sign);
    reserved.push({ ...sp, r: 1.6 });
    this.signs.push({ obj: sign, x: isl.x + sp.x, z: isl.z + sp.z });

    const seg = this.segs[i];
    if (seg && seg.kind === 'bridge') {
      // the forge platform, to the right of the bridge's entrance
      const ap = local(isl.R - 2.9, 2.7);
      const altar = makeAltar();
      altar.position.set(ap.x, 0, ap.z);
      g.add(altar);
      seg.altar = altar;
      seg.altarWorld = new THREE.Vector3(isl.x + ap.x, 0, isl.z + ap.z);
      reserved.push({ ...ap, r: 2.4 });
      seg.altarIt = this.addInteract(
        isl.x + ap.x,
        isl.z + ap.z,
        () => this.altarPrompt(seg),
        () => this.actAltar(seg),
        2.8,
        3.0,
      );
      this.placePedestals(isl, i, seg.moulds, local, reserved);
    }
    if (i === 5) this.buildGuardians(isl, local, reserved);
    if (i === 6) {
      const p = local(-5.2, -2.7);
      const anvil = makeAnvil();
      anvil.position.set(p.x, 0, p.z);
      g.add(anvil);
      this.anvil = anvil;
      reserved.push({ ...p, r: 2 });
      this.colliders.push({ x: isl.x + p.x, z: isl.z + p.z, r: 1.0 });
      this.addInteract(
        isl.x + p.x,
        isl.z + p.z,
        () => (this.flags.anvil ? T.prompt.anvil : T.prompt.anvilLocked),
        () => this.actAnvil(),
        2.6,
      );
    }
    if (i === 7) {
      // the question stone of the last harbour
      const p = local(-1.5, -3.6);
      const stone = new THREE.Group();
      const slab = new THREE.Mesh(new THREE.BoxGeometry(1.7, 2.3, 0.4), std(0x8d8d95));
      slab.position.y = 1.15;
      slab.castShadow = true;
      stone.add(slab);
      const rune = new THREE.Mesh(new THREE.OctahedronGeometry(0.3, 0), glow(0xffc12e, 0.7));
      rune.position.set(0, 1.5, 0.3);
      stone.add(rune);
      stone.position.set(p.x, 0, p.z);
      stone.rotation.y = Math.atan2(-p.x, -p.z);
      g.add(stone);
      reserved.push({ ...p, r: 2 });
      this.colliders.push({ x: isl.x + p.x, z: isl.z + p.z, r: 0.9 });
      this.stoneIt = this.addInteract(
        isl.x + p.x,
        isl.z + p.z,
        () => (this.state.stage === 7 && !this.flags.key4 ? T.prompt.stone : null),
        () => this.openStone(),
        2.8,
        3.6,
      );
      this.stoneBeacon = makeBeacon(1.25);
      this.stoneBeacon.position.set(p.x, 0, p.z);
      g.add(this.stoneBeacon);
    }
    if (last) {
      const lh = makeLighthouse();
      const p = local(2.4, 0);
      lh.position.set(p.x, 0, p.z);
      lh.rotation.y = Math.atan2(-inn.dx, -inn.dz);
      g.add(lh);
      this.lighthouse = lh;
      this.lighthouseWorld = new THREE.Vector3(isl.x + p.x, 0, isl.z + p.z);
      reserved.push({ ...p, r: 4.6 });
      this.colliders.push({ x: isl.x + p.x, z: isl.z + p.z, r: 3.2 });
    }

    // scenery, kept off the path (entrance → centre → exit) and off the reserved spots
    const onPath = (x, z) => {
      const d1 = i === 0 ? 99 : distToSeg(x, z, -inn.dx * isl.R, -inn.dz * isl.R, 0, 0);
      const d2 = last ? 99 : distToSeg(x, z, 0, 0, out.dx * isl.R, out.dz * isl.R);
      return Math.min(d1, d2) < 2.3;
    };
    const free = (x, z, rr) => !onPath(x, z) && reserved.every((q) => Math.hypot(q.x - x, q.z - z) > q.r + rr);
    const scatter = (n, minD, maxD, rr, make, collide) => {
      let placed = 0;
      let tries = 0;
      while (placed < n && tries < n * 30) {
        tries += 1;
        const a = rand() * Math.PI * 2;
        const d = minD + rand() * (maxD - minD);
        const x = Math.cos(a) * d;
        const z = Math.sin(a) * d;
        if (!free(x, z, rr)) continue;
        const m = make();
        m.position.x = x;
        m.position.z = z;
        m.rotation.y = rand() * Math.PI * 2;
        g.add(m);
        if (collide === 0.4) this.occluders.push({ obj: m, x: isl.x + x, z: isl.z + z, s: 1 });
        reserved.push({ x, z, r: rr });
        if (collide) this.colliders.push({ x: isl.x + x, z: isl.z + z, r: collide });
        placed += 1;
      }
    };
    scatter(
      isl.theme === 'stone' ? 3 : 6,
      isl.R * 0.5,
      isl.R - 1.3,
      1.1,
      () => makeTree(isl.theme, rand, 0.9 + rand() * 0.5),
      0.4,
    );
    scatter(4, isl.R * 0.3, isl.R - 0.9, 0.8, () => makeRock(isl.theme, rand, 0.35 + rand() * 0.45), 0.5);
    if (isl.theme === 'crystal')
      scatter(
        3,
        isl.R * 0.5,
        isl.R - 1.2,
        1.0,
        () => makeBigCrystal([0xb69cff, 0x7dfcff, 0xff9de0][Math.floor(rand() * 3)], rand, 0.9),
        0.5,
      );
    scatter(16, 1, isl.R - 0.6, 0.25, () => makeFlower(isl.theme, rand), 0);

    // gems
    for (let k = 0; k < 4; k += 1) {
      const a = rand() * Math.PI * 2;
      const d = 2 + rand() * (isl.R - 3.2);
      this.addGem(`i${i}-${k}`, isl.x + Math.cos(a) * d, k === 0 ? 1.9 : 0.9, isl.z + Math.sin(a) * d);
    }
    isl.spawn = this.spawnOf(i);
  }

  placePedestals(isl, i, moulds, local, reserved) {
    isl.pedestals.forEach((p) => {
      p.group.parent?.remove(p.group);
      p.dead = true;
    });
    isl.pedestals = [];
    const n = moulds.length;
    moulds.forEach((b, k) => {
      const off = (k - (n - 1) / 2) * (n > 4 ? 2.5 : 2.9);
      const p = local(0.6 - Math.abs(off) * 0.22, -off - (n === 1 ? 2.2 : 0));
      const ped = makePedestal(b);
      ped.position.set(p.x, 0, p.z);
      isl.group.add(ped);
      const rec = { b, group: ped, x: isl.x + p.x, z: isl.z + p.z, dead: false };
      isl.pedestals.push(rec);
      reserved?.push({ ...p, r: 1.5 });
      const col = { x: rec.x, z: rec.z, r: 0.85 };
      this.colliders.push(col);
      rec.col = col;
      this.addInteract(
        rec.x,
        rec.z,
        () => (rec.dead || this.state.held === b ? null : T.prompt.take(b)),
        () => {
          if (!rec.dead) this.take(b);
        },
        2.1,
        3.7,
      );
    });
  }

  buildGuardians(isl, local, reserved) {
    this.statues = [];
    for (let k = 0; k < 4; k += 1) {
      const side = k < 2 ? -1 : 1;
      const p = local(1.6 - Math.abs(k - 1.5) * 1.1, (k - 1.5) * 2.4 + side * 1.7);
      const s = makeStatue(k);
      s.position.set(p.x, 0, p.z);
      const back = local(-6, 0);
      s.rotation.y = Math.atan2(back.x - p.x, back.z - p.z);
      isl.group.add(s);
      this.statues.push(s);
      reserved.push({ ...p, r: 1.6 });
      this.colliders.push({ x: isl.x + p.x, z: isl.z + p.z, r: 0.9 });
    }
    const c = local(-1.2, 0);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.08, 6, 30), glow(0xffc12e, 0.7));
    ring.rotation.x = Math.PI / 2;
    ring.position.set(c.x, 0.06, c.z);
    isl.group.add(ring);
    this.statueRing = ring;
    reserved.push({ ...c, r: 2 });
    this.addInteract(
      isl.x + c.x,
      isl.z + c.z,
      () => (!this.flags.statues ? T.prompt.statues : null),
      () => this.openStatues(),
      2.4,
    );
    const b = local(isl.R - 2.4, 0);
    const board = makeHoverboard();
    board.position.set(isl.x + b.x, 0.35, isl.z + b.z);
    this.scene.add(board);
    const out = this.exitDir(5);
    board.rotation.y = Math.atan2(out.dx, out.dz);
    this.board = board;
    this.boardHome = board.position.clone();
    this.addInteract(
      isl.x + b.x,
      isl.z + b.z,
      () => (this.segs[5].complete ? null : T.prompt.board),
      () => this.actBoard(),
      2.2,
    );
  }

  buildBridge(seg) {
    const g = new THREE.Group();
    this.scene.add(g);
    seg.group = g;
    const yaw = Math.atan2(seg.dx, seg.dz);
    seg.yaw = yaw;
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
    seg.pylons = [];
    for (const [u, v] of [
      [0.2, 1.55],
      [0.2, -1.55],
      [seg.len - 0.2, 1.55],
      [seg.len - 0.2, -1.55],
    ]) {
      const p = makePylon();
      p.position.copy(this.segPoint(seg, u, v));
      g.add(p);
      seg.pylons.push(p);
      this.colliders.push({ x: p.position.x, z: p.position.z, r: 0.35 });
    }
    // the gap drawn as a faint strip of light with one tick per cell: its length can be counted
    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(2.3, 0.02, seg.len),
      new THREE.MeshBasicMaterial({ color: 0x9fe8ff, transparent: true, opacity: 0.13, depthWrite: false }),
    );
    strip.position.copy(this.segPoint(seg, seg.len / 2, 0, -0.04));
    strip.quaternion.copy(q);
    g.add(strip);
    if (seg.a <= 200) {
      const tick = new THREE.InstancedMesh(
        new THREE.BoxGeometry(2.3, 0.03, Math.min(0.05, seg.cell * 0.14)),
        new THREE.MeshBasicMaterial({ color: 0xd8f6ff, transparent: true, opacity: 0.75 }),
        seg.a + 1,
      );
      const m = new THREE.Matrix4();
      for (let k = 0; k <= seg.a; k += 1) {
        m.compose(this.segPoint(seg, k * seg.cell, 0, -0.01), q, new THREE.Vector3(1, 1, 1));
        tick.setMatrixAt(k, m);
      }
      g.add(tick);
    }
    const label = textSprite(`${seg.a} خانة`, { h: 1.25, bg: 'rgba(10,26,60,0.86)', stroke: null, color: '#e9fbff' });
    label.position.copy(this.segPoint(seg, seg.len / 2, 0, 3.4));
    g.add(label);
    seg.label = label;
    const gap = new THREE.Mesh(
      new THREE.BoxGeometry(2.3, 0.12, 1),
      new THREE.MeshBasicMaterial({ color: 0xff9d3c, transparent: true, opacity: 0.55, depthWrite: false }),
    );
    gap.visible = false;
    gap.quaternion.copy(q);
    g.add(gap);
    seg.gap = gap;
    const count = textSprite('0', { h: 1.3, color: '#fff3b0' });
    count.visible = false;
    g.add(count);
    seg.count = count;
    for (let k = 1; k <= 3; k += 1) {
      const p = this.segPoint(seg, (seg.len * k) / 4);
      this.addGem(`${seg.id}-${k}`, p.x, 1.0, p.z);
    }
  }

  buildRail(seg) {
    const g = new THREE.Group();
    this.scene.add(g);
    seg.group = g;
    const yaw = Math.atan2(seg.dx, seg.dz);
    seg.yaw = yaw;
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
    for (const v of [-3.8, 3.8]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, seg.len), glow(0x35d8f0, 0.8));
      rail.position.copy(this.segPoint(seg, seg.len / 2, v, 0));
      rail.quaternion.copy(q);
      g.add(rail);
    }
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(7.5, 0.05, seg.len),
      new THREE.MeshBasicMaterial({ color: 0x9fe8ff, transparent: true, opacity: 0.1, depthWrite: false }),
    );
    floor.position.copy(this.segPoint(seg, seg.len / 2, 0, -0.05));
    floor.quaternion.copy(q);
    g.add(floor);
    const n = Math.floor(seg.len / 4);
    const sl = new THREE.InstancedMesh(
      new THREE.BoxGeometry(7.6, 0.05, 0.16),
      new THREE.MeshBasicMaterial({ color: 0xd8f6ff, transparent: true, opacity: 0.5 }),
      n,
    );
    const m = new THREE.Matrix4();
    for (let k = 0; k < n; k += 1) {
      m.compose(this.segPoint(seg, k * 4 + 2, 0, -0.02), q, new THREE.Vector3(1, 1, 1));
      sl.setMatrixAt(k, m);
    }
    g.add(sl);
    for (const v of [-1.25, 1.25]) {
      const ln = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.02, seg.len),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 }),
      );
      ln.position.copy(this.segPoint(seg, seg.len / 2, v, 0));
      ln.quaternion.copy(q);
      g.add(ln);
    }
    seg.gates = DASH_WAVES.map((w, k) => {
      const u = DASH.first + k * DASH.gap;
      const arches = DASH.lanes.map((v) => {
        const a = new THREE.Group();
        a.position.copy(this.segPoint(seg, u, v));
        a.quaternion.copy(q);
        const mat = glow(0x6f9dff, 0.6);
        for (const sx of [-1.05, 1.05]) {
          const post = new THREE.Mesh(new THREE.BoxGeometry(0.14, 3.0, 0.14), mat);
          post.position.set(sx, 1.5, 0);
          a.add(post);
        }
        const bar = new THREE.Mesh(new THREE.BoxGeometry(2.24, 0.14, 0.14), mat);
        bar.position.y = 3.0;
        a.add(bar);
        const veil = new THREE.Mesh(
          new THREE.PlaneGeometry(2.0, 2.9),
          new THREE.MeshBasicMaterial({
            color: 0x8fb8ff,
            transparent: true,
            opacity: 0.16,
            side: THREE.DoubleSide,
            depthWrite: false,
          }),
        );
        veil.position.y = 1.5;
        a.add(veil);
        const num = textSprite('0', { h: 2.1 });
        num.position.y = 4.3;
        a.add(num);
        g.add(a);
        return { group: a, mat, veil, num };
      });
      return { u, arches, wave: w, order: [0, 1, 2] };
    });
  }

  /** Puts the world in the state of the save: earlier bridges rebuilt, flags applied. */
  restore() {
    const stage = this.state.stage;
    this.segs.forEach((seg, i) => {
      if (i >= stage) return;
      if (seg.kind === 'bridge') {
        const b = { s15: 3, s16: 4, s42: 6, s48: 8, s120: 6, s7: 7, s756: 36 }[seg.id];
        this.layPlanksInstant(seg, b);
      }
      this.markComplete(seg, true);
    });
    if (this.flags.storm) this.swapStormPedestals();
    if (this.flags.statues) this.statues.forEach((s) => s.userData.lit(true));
    if (this.segs[5].complete) this.board.position.copy(this.segPoint(this.segs[5], this.segs[5].len - 3, 0, 0.35));
    if (this.state.finished) this.lightUp(true);
    this.skyNow = SKIES[Math.min(this.state.finished ? 8 : stage, 8)].slice();
    this.refreshObjective();
  }

  // ───────────────────────────── moulds & forge ─────────────────────────────
  take(b) {
    if (b != null) this.audio.play('pick');
    if (this.heldMesh) this.scene.remove(this.heldMesh);
    this.heldMesh = b == null ? null : makeMould(b);
    if (this.heldMesh) {
      this.heldMesh.scale.setScalar(0.72);
      this.scene.add(this.heldMesh);
    }
    this.set({ held: b });
    if (b != null && this.state.stage === 0 && !this.segs[0].complete && !this.toldAltar) {
      this.toldAltar = true;
      this.say(T.say.goAltar, 9);
    }
  }

  altarPrompt(seg) {
    // the store of the last bridge opens only once the island's question is answered: never a prompt that does nothing
    if (seg.boss) return !this.flags.key4 || (seg.complete && this.flags.bossPaid) ? null : T.prompt.boss;
    if (this.state.held == null) return seg.complete ? null : T.prompt.needMould;
    return T.prompt.forge(this.state.held);
  }

  actAltar(seg) {
    if (this.state.phase !== 'play') return;
    if (seg.boss) {
      if (!this.flags.key4) return;
      if (!seg.complete || !this.flags.bossPaid) this.openBoss();
      return;
    }
    if (this.state.held == null) {
      this.say(seg.complete ? T.say.done : T.prompt.needMould, 3);
      return;
    }
    const b = this.state.held;
    if (seg.predict) {
      this.audio.play('ui');
      this.set({
        phase: 'dialog',
        overlay: { type: 'predict', a: seg.a, b, options: predictOptions(seg.a, b), seg: seg.index },
      });
    } else this.forge(seg, b, null);
  }

  answerPredict(value) {
    const o = this.state.overlay;
    if (o?.type !== 'predict') return;
    this.forge(this.segs[o.seg], o.b, value);
  }

  plankMesh(seg, b, k) {
    const len = b * seg.cell;
    const col = mouldColor(b);
    if (k % 2) col.offsetHSL(0, -0.05, 0.1);
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.24, Math.max(0.05, len - Math.min(0.07, len * 0.12))),
      new THREE.MeshStandardMaterial({
        color: col,
        emissive: col,
        emissiveIntensity: 0.22,
        roughness: 0.45,
        transparent: true,
      }),
    );
    m.rotation.y = seg.yaw;
    m.castShadow = true;
    m.receiveShadow = true;
    m.userData.home = this.segPoint(seg, (k + 0.5) * len, 0, -0.12);
    return m;
  }

  layPlanksInstant(seg, b) {
    this.clearPlanks(seg);
    const { q } = divide(seg.a, b);
    for (let k = 0; k < q; k += 1) {
      const m = this.plankMesh(seg, b, k);
      m.position.copy(m.userData.home);
      seg.group.add(m);
      seg.planks.push(m);
    }
  }

  clearPlanks(seg) {
    seg.planks.forEach((m) => {
      seg.group.remove(m);
      m.geometry.dispose();
      m.material.dispose();
    });
    seg.planks = [];
    seg.gap.visible = false;
    seg.count.visible = false;
  }

  markComplete(seg, silent = false) {
    seg.complete = true;
    seg.builtLen = seg.len + 0.7;
    seg.pylons?.forEach((p) => {
      p.userData.orb.material.color.set(0x2fe37a);
      p.userData.orb.material.emissive.set(0x2fe37a);
    });
    if (seg.label) seg.label.visible = false;
    if (!silent) this.refreshObjective();
  }

  async crumble(seg, wind = false) {
    const planks = seg.planks.slice();
    seg.planks = [];
    seg.builtLen = 0;
    seg.complete = false;
    seg.pylons?.forEach((p) => {
      p.userData.orb.material.color.set(0x35d8f0);
      p.userData.orb.material.emissive.set(0x35d8f0);
    });
    if (seg.label) seg.label.visible = true;
    if (!planks.length) {
      seg.gap.visible = false;
      seg.count.visible = false;
      return;
    }
    this.audio.play(wind ? 'wind' : 'crumble');
    const data = planks.map((m, k) => ({
      m,
      from: m.position.clone(),
      rx: (Math.random() - 0.5) * 3,
      rz: (Math.random() - 0.5) * 3,
      side: wind ? 14 + Math.random() * 18 : (Math.random() - 0.5) * 4,
      delay: wind ? k * 0.03 : (planks.length - 1 - k) * Math.min(0.05, 0.6 / planks.length),
    }));
    const total = 1.15 + Math.max(...data.map((d) => d.delay));
    await this.tween(
      total,
      (t) => {
        const el = t * total;
        data.forEach((d) => {
          const p = Math.max(0, Math.min(1, (el - d.delay) / 1.1));
          d.m.position.set(
            d.from.x + seg.rx * d.side * p,
            d.from.y - 14 * p * p + (wind ? 10 * p * (1 - p) : 0),
            d.from.z + seg.rz * d.side * p,
          );
          d.m.rotation.x = d.rx * p;
          d.m.rotation.z = d.rz * p;
          d.m.material.opacity = 1 - p;
        });
      },
      (t) => t,
    );
    planks.forEach((m) => {
      seg.group.remove(m);
      m.geometry.dispose();
      m.material.dispose();
    });
    seg.gap.visible = false;
    seg.count.visible = false;
  }

  /** The forge: lays q planks of length b one by one, then the bridge holds (r = 0) or crumbles (r > 0). */
  async forge(seg, b, predicted) {
    const a = seg.a;
    const { q, r } = divide(a, b);
    this.logBridge(a, b);
    this.input.clear();
    this.set({
      phase: 'forge',
      overlay: null,
      prompt: null,
      verdict: null,
      equation: { a, b, q: 0, r: a, live: true },
    });
    // cinematic camera: from the side, the whole gap in view
    const mid = this.segPoint(seg, seg.len / 2);
    const dist = seg.len * 0.62 + 7;
    this.cine = {
      pos: new THREE.Vector3(
        mid.x + seg.rx * dist - seg.dx * seg.len * 0.12,
        seg.len * 0.3 + 5.5,
        mid.z + seg.rz * dist - seg.dz * seg.len * 0.12,
      ),
      look: new THREE.Vector3(mid.x, 0.4, mid.z),
    };
    if (seg.planks.length) await this.crumble(seg);
    this.clearPlanks(seg);
    this.robot.setChest('…');
    await this.wait(0.9);
    const from = seg.altarWorld.clone().setY(1.6);
    seg.count.visible = q > 0;
    seg.count.userData.setText('0');
    const per = Math.min(0.42, Math.max(0.1, 3.4 / Math.max(1, q)));
    if (q === 0) {
      // the plank is longer than the whole gap: it tips over the edge and falls
      const m = this.plankMesh(seg, b, 0);
      seg.group.add(m);
      const home = this.segPoint(seg, seg.len * 0.5, 0, 0.6);
      await this.tween(
        0.5,
        (t) => {
          m.position.lerpVectors(from, home, t);
        },
        easeOut,
      );
      this.audio.play('fall');
      await this.tween(1.0, (t) => {
        m.position.y = home.y - 16 * t * t;
        m.rotation.x = t * 2.2;
        m.material.opacity = 1 - t;
      });
      seg.group.remove(m);
    }
    for (let k = 0; k < q; k += 1) {
      if (this.dead) return;
      const m = this.plankMesh(seg, b, k);
      m.position.copy(from);
      m.scale.setScalar(0.2);
      seg.group.add(m);
      seg.planks.push(m);
      const home = m.userData.home;
      await this.tween(
        per,
        (t) => {
          m.position.lerpVectors(from, home, t);
          m.position.y += Math.sin(t * Math.PI) * 2.2;
          m.scale.setScalar(0.2 + 0.8 * t);
        },
        easeOut,
      );
      this.audio.play('plank', k);
      this.particles.burst(home.clone().setY(0.2), mouldColor(b), 6, 2, 1.5, 0.5);
      seg.count.userData.setText(String(k + 1));
      seg.count.position.copy(this.segPoint(seg, (k + 0.5) * b * seg.cell, 0, 1.6));
      this.set({ equation: { a, b, q: k + 1, r: a - b * (k + 1), live: true } });
    }
    await this.wait(0.35);
    if (this.dead) return;
    this.set({ equation: { a, b, q, r, live: false } });
    this.robot.setChest(String(r), r === 0 ? true : null);
    seg.count.visible = false;
    // TWO results, never mixed: was the PREDICTION right? — then, does this mould fill the gap? A right prediction of a
    // remainder that is not 0 is a success of the student (the division was done), even though the bridge will not hold.
    let right = null;
    let first = false;
    if (predicted != null) {
      right = predicted === r;
      first = seg.stat.firstPrediction == null;
      if (first) seg.stat.firstPrediction = right;
      if (right) {
        this.audio.play('star', 1);
        setTimeout(() => this.audio.play('star', 2), 160);
        this.robot.cheer();
      }
    }
    this.set({ verdict: { right, first, predicted, a, b, r, holds: r === 0 } });
    if (seg.label) seg.label.visible = false; // the result panel takes its place on screen; crumble() brings it back

    if (r === 0) {
      this.audio.play('success');
      this.robot.cheer();
      for (let k = 0; k <= 8; k += 1)
        this.particles.burst(this.segPoint(seg, (seg.len * k) / 8, 0, 0.4), 0x8dffb0, 10, 3, 3, 1.1);
      if (seg.id === 's48' && !this.flags.storm && b === 6) {
        await this.storm(seg);
        return;
      }
      await this.wait(1.3);
      this.finishBridge(seg, b, q);
    } else {
      seg.stat.fails += 1;
      if (right !== true) {
        this.audio.play('fail');
        this.shake = 0.15;
      }
      if (q > 0) {
        const gl = r * seg.cell;
        seg.gap.scale.z = gl;
        seg.gap.position.copy(this.segPoint(seg, seg.len - gl / 2, 0, 0));
        seg.gap.visible = true;
        this.gapPulse = seg.gap;
      }
      await this.wait(q > 0 ? 1.9 : 0.4);
      this.gapPulse = null;
      await this.crumble(seg);
      this.cine = null;
      this.set({ phase: 'play' });
      this.afterFail(seg, b, q, r, right);
    }
  }

  finishBridge(seg, b, q) {
    this.markComplete(seg);
    this.cine = null;
    if (seg.boss) {
      this.set({ phase: 'dialog', overlay: this.bossOverlay('cost', { b, q }) });
      this.say(T.say.bossOk, 7);
      return;
    }
    if (!this.state.stars[seg.id]) {
      const stars = bridgeStars({
        firstPrediction: seg.predict ? seg.stat.firstPrediction : null,
        falls: seg.stat.falls,
      });
      this.set({ stars: { ...this.state.stars, [seg.id]: stars } });
      for (let k = 0; k < stars; k += 1) setTimeout(() => this.audio.play('star', k), 200 + k * 220);
    }
    this.set({ phase: 'play' });
    if (seg.id === 's15') this.say(T.say.first);
    else if (seg.id === 's48') this.say(T.say.stormOk, 7);
    else this.say(T.say.ok(b, q));
    this.save();
  }

  afterFail(seg, b, q, r, right = null) {
    if (seg.boss) {
      this.flags.bossTried = { ...(this.flags.bossTried ?? {}), [b]: r };
      this.say(T.say.bossFail(b, r), 8);
      this.set({ phase: 'dialog', overlay: this.bossOverlay('choose') });
      this.save();
      return;
    }
    if (q === 0) this.say(T.say.tooLong(b, seg.a), 7);
    else if (right === true) this.say(T.say.gapRight(r), 8);
    else if (seg.stat.fails === 1) this.say(T.say.gap(r), 7);
    else this.say(T.say.gapShort(r), 5);
    if (seg.id === 's7' && seg.stat.fails >= 2 && !this.flags.anvil) {
      this.flags.anvil = true;
      this.audio.play('key');
      this.particles.burst(this.anvil.getWorldPosition(new THREE.Vector3()).setY(1.5), 0xff9d3c, 40, 4, 4, 1.2);
      setTimeout(() => !this.dead && this.say(T.say.anvilOpen, 9), 2600);
      this.save();
    }
  }

  /** Island « المرايا »: the bridge of 48 held with 6 (8 planks); a gust takes it away and leaves moulds 5, 7, 8, 9. */
  async storm(seg) {
    await this.wait(2.0);
    this.say(T.say.storm, 8);
    this.shake = 0.6;
    await this.crumble(seg, true);
    this.flags.storm = true;
    this.take(null);
    this.swapStormPedestals();
    this.robot.setChest('•');
    this.cine = null;
    this.set({ phase: 'play', pinned: '48 = 6 \\times 8', equation: null, verdict: null });
    this.refreshObjective();
    setTimeout(() => !this.dead && this.say(T.say.stormHint, 8), 4200);
    this.save();
  }

  swapStormPedestals() {
    const i = 3;
    const isl = this.isl[i];
    const out = this.exitDir(i);
    const local = (u, v) => ({ x: out.dx * u + out.rx * v, z: out.dz * u + out.rz * v });
    isl.pedestals.forEach((p) => {
      const k = this.colliders.indexOf(p.col);
      if (k >= 0) this.colliders.splice(k, 1);
    });
    this.placePedestals(isl, i, this.segs[i].mouldsAfterStorm, local, null);
    if (!this.segs[i].complete && this.state.stage === 3) this.state = { ...this.state, pinned: '48 = 6 \\times 8' };
  }

  // ───────────────────────────── scripted moments ─────────────────────────────
  refreshObjective() {
    const i = this.state.stage;
    const seg = this.segs[i];
    let o = T.objective.end;
    if (seg) {
      if (i === 7 && !this.flags.key4) o = T.objective.stone;
      else if (seg.boss) o = seg.complete && this.flags.bossPaid ? T.objective.bossCross : T.objective.bossGo;
      else if (seg.complete) o = T.objective.cross;
      else if (seg.kind === 'rail') o = this.flags.statues ? T.objective.board : T.objective.statues;
      else if (seg.id === 's48' && this.flags.storm) o = T.objective.storm;
      else if (seg.id === 's7') o = T.objective.stubborn;
      else o = T.objective.bridge(seg.a);
    }
    if (this.state.objective !== o) this.set({ objective: o });
  }

  arrive(k) {
    this.set({ stage: k, islandName: this.isl[k].name, equation: null, pinned: null, verdict: null });
    this.robot.setChest('•');
    this.audio.mood = Math.min(1, k / 8);
    if (this.state.held != null && k !== 1) this.take(null);
    this.refreshObjective();
    this.save();
    const openTablet = (key) => {
      this.audio.play('key');
      this.set({ phase: 'dialog', overlay: { type: 'tablet', key } });
    };
    if (k === 1) this.say(T.say.carry3, 7);
    if (k === 2) this.say(T.say.c42, 8);
    if (k === 3) this.openForge(); // the rule is not told: the student forges it in the mirror of the island (RuleForge)
    if (k === 4) {
      openTablet('qasim-jidaa');
      this.queue.push(() => this.say(T.say.e120, 7));
    }
    if (k === 5) this.say(T.say.f, 9);
    if (k === 6) {
      this.onModule('3');
      this.say(T.say.g7, 7);
    }
    if (k === 7) {
      this.say(T.say.h, 6);
      // on the GAME's clock, not the wall's: the world may be paused behind a page, or fast-forwarded by a walk
      this.wait(1.5).then(() => !this.dead && this.state.phase === 'play' && this.openStone());
    }
    if (k === 8) this.finale();
  }

  openStone() {
    if (this.flags.key4 || this.state.phase !== 'play') return;
    this.set({ phase: 'dialog', overlay: { type: 'quiz', id: this.flags.seven ? 'big' : 'seven', closable: true } });
  }

  /** Called by the HUD with the chosen values; returns { ok, feedback }. */
  answerQuiz(id, picked) {
    const spec = T.quiz[id];
    const ok = picked.length === spec.answer.length && spec.answer.every((v) => picked.includes(v));
    if (!ok) {
      this.audio.play('fail');
      if (!spec.a) return { ok: false, feedback: spec.wrong?.[picked[0]] ?? spec.wrongGeneric };
      // each chosen mould is judged on its own, with the division that proves it — the missing ones are counted, never named
      const marks = [...picked].sort((x, y) => x - y).map((v) => ({ v, a: spec.a, ...divide(spec.a, v) }));
      return { ok: false, marks, missing: spec.answer.filter((v) => !picked.includes(v)).length };
    }
    this.audio.play('success');
    if (id === 'rule') {
      this.set({ overlay: null });
      const next = this.queue.shift();
      next?.();
    }
    if (id === 'seven') {
      this.flags.seven = true;
      this.set({ overlay: { type: 'quiz', id: 'big', closable: true } });
    }
    if (id === 'big') {
      this.audio.play('key');
      this.set({ overlay: { type: 'tablet', key: 'wahid-wa-nafsuh' } });
      this.queue.push(() => {
        this.flags.key4 = true;
        this.onModule('2');
        this.refreshObjective();
        this.say(T.say.boss, 9);
        this.save();
      });
    }
    return { ok: true };
  }

  // ───────────────────────────── the rule forge (island « المرايا ») ─────────────────────────────
  /** Every bridge fired is a line of evidence: the forge tests the student's rule on HIS crossing (the last twelve are kept). */
  logBridge(a, b, mirror = false) {
    const was = this.log.find((x) => x.a === a && x.b === b);
    this.log = [
      ...this.log.filter((x) => x !== was),
      { a, b, ...(mirror && (!was || was.mirror) ? { mirror: true } : {}) },
    ].slice(-16);
  }
  /** A bridge the mirror of the forge built in front of him: evidence too, marked as the mirror's. */
  logMirror(a, b) {
    this.logBridge(a, b, true);
    this.save();
  }
  /** The evidence a save from before the forge still gives: the bridges that are standing, with the mould that holds them. */
  crossing() {
    if (this.log.length) return this.log;
    return this.segs
      .filter((seg, i) => i < 3 && seg.kind === 'bridge' && seg.complete)
      .map((seg) => ({ a: seg.a, b: { s15: 3, s16: 4, s42: 6 }[seg.id] }));
  }
  openForge() {
    this.audio.play('crystal');
    this.set({ phase: 'dialog', overlay: { type: 'forge', key: 'qasim-baqi', log: this.crossing() }, prompt: null });
  }
  /** The rule survived the mirror: it is kept as HIS rule, and the tablet then gives it its name. */
  sealRule(key, record) {
    this.rules = { ...this.rules, [key]: record };
    this.audio.play('key');
    this.set({ rules: this.rules, overlay: { type: 'tablet', key } });
    this.queue.push(() => {
      this.onModule('1');
      this.say(T.say.d48, 7);
    });
    this.save();
  }

  closeTablet() {
    const key = this.state.overlay?.key;
    const keys = key && !this.state.keys.includes(key) ? [...this.state.keys, key] : this.state.keys;
    if (key) this.keysEver.add(key);
    this.set({ overlay: null, phase: 'play', keys, openKeys: [...this.keysEver] });
    this.input.clear();
    const next = this.queue.shift();
    next?.();
    this.save();
  }

  quizBack() {
    this.set({ overlay: null, phase: 'play' });
    this.say(T.say.stoneWaits, 7);
    this.input.clear();
  }

  openStatues() {
    if (this.state.phase === 'play') {
      this.audio.play('ui');
      this.set({ phase: 'dialog', overlay: { type: 'statues' } });
    }
  }

  /** `order[i]` = true when sentence i is written divisor first (6 … 120). Returns the per-sentence verdicts. */
  submitStatues(order) {
    const res = STATUES.sentences.map((s, i) => order[i] === s.smallFirst);
    if (res.every(Boolean)) {
      this.flags.statues = true;
      this.statues.forEach((s, i) =>
        setTimeout(() => {
          if (this.dead) return;
          s.userData.lit(true);
          this.audio.play('star', i);
          this.particles.burst(s.getWorldPosition(new THREE.Vector3()).setY(3), 0xffd166, 24, 3, 3, 1);
        }, i * 260),
      );
      this.audio.play('success');
      this.set({ overlay: { type: 'tablet', key: 'siyagh-mutakafia' } });
      this.queue.push(() => {
        this.refreshObjective();
        this.say(T.say.boardReady, 7);
        this.save();
      });
    } else this.audio.play('fail');
    return res;
  }

  actAnvil() {
    if (this.state.phase !== 'play') return;
    if (!this.flags.anvil) {
      this.say(T.prompt.anvilLocked, 3);
      return;
    }
    this.audio.play('ui');
    this.set({ phase: 'dialog', overlay: { type: 'workshop', a: 7, ...this.segs[6].workshop } });
  }

  craft(b) {
    this.set({ overlay: null, phase: 'play' });
    this.take(b);
    this.say(T.say.crafted(b), 4);
    this.input.clear();
  }

  // ───────────────────────────── the last bridge ─────────────────────────────
  /** The store: the student CHOOSES a mould (32 or 36), types its Euclidean division, and the world shows what it builds. */
  bossOverlay(view, extra = {}) {
    return { type: 'boss', view, tried: { ...(this.flags.bossTried ?? {}) }, ...extra };
  }

  openBoss() {
    const seg = this.segs[7];
    this.audio.play('ui');
    this.set({
      phase: 'dialog',
      overlay: seg.complete ? this.bossOverlay('cost', { b: 36, q: 21 }) : this.bossOverlay('choose'),
    });
  }

  bossPick(b) {
    this.audio.play('pick');
    this.set({ overlay: this.bossOverlay('divide', { b }) });
  }
  bossBack() {
    this.set({ overlay: this.bossOverlay('choose') });
  }

  bossDivision(b, q, r) {
    const status = checkDivision(756, b, q, r);
    if (status !== 'ok') {
      this.flags.bossWrong = (this.flags.bossWrong ?? 0) + 1;
      this.audio.play('fail');
      return status;
    }
    this.forge(this.segs[7], b, null);
    return 'ok';
  }

  bossCost(n) {
    if (n !== 21 * 1850) {
      this.flags.bossWrong = (this.flags.bossWrong ?? 0) + 1;
      this.audio.play('fail');
      return false;
    }
    this.flags.bossPaid = true;
    this.audio.play('key');
    const seg = this.segs[7];
    const stars = Math.max(1, 3 - (this.flags.bossWrong ?? 0));
    this.set({
      overlay: null,
      phase: 'play',
      stars: { ...this.state.stars, [seg.id]: Math.max(stars, this.state.stars[seg.id] ?? 0) },
    });
    this.onModule('4');
    this.say(T.say.pay, 6);
    this.refreshObjective();
    this.save();
    this.input.clear();
    return true;
  }

  // ───────────────────────────── the gate dash (story) and the practice runs ─────────────────────────────
  actBoard() {
    if (this.state.phase !== 'play') return;
    if (!this.flags.statues) {
      this.say(T.say.statuesFirst, 4);
      return;
    }
    this.startDash(0);
  }

  /** The story's eight waves, in the run format: { say, gates, good }. */
  storyWaves() {
    return DASH_WAVES.map((w) => {
      const gates = w.gates.slice().sort(() => Math.random() - 0.5);
      return { say: w.say, gates, good: gates.findIndex(w.test) };
    });
  }

  dressGate(k) {
    const g = this.segs[5].gates[k];
    const w = this.dash?.waves[k];
    g.arches.forEach((ar, lane) => {
      ar.group.visible = Boolean(w);
      if (w) ar.num.userData.setText(String(w.gates[lane]));
      ar.num.visible = false;
      ar.mat.color.set(0x6f9dff);
      ar.mat.emissive.set(0x6f9dff);
      ar.veil.material.color.set(0x8fb8ff);
      ar.veil.material.opacity = 0.16;
    });
  }

  /** Starts a run on the rail. `d` = { mode: 'story' | 'practice', waves, hearts, … }. */
  beginRun(d) {
    this.dash = {
      s: 0,
      lane: 1,
      v: 0,
      wave: 0,
      slow: 0,
      stickLatch: false,
      score: 0,
      streak: 0,
      bestStreak: 0,
      mistakes: 0,
      ...d,
    };
    this.segs[5].gates.forEach((_, k) => this.dressGate(k));
    this.input.clear();
    if (this.state.held != null) this.take(null);
    this.audio.fast = true;
    this.set({ phase: 'dash', prompt: null, overlay: null });
    this.showWave();
  }

  startDash(restarts) {
    this.beginRun({ mode: 'story', waves: this.storyWaves(), hearts: DASH.hearts, restarts });
    this.say(restarts ? T.say.dashAgain : T.say.dashGo, 5);
  }

  showWave() {
    const seg = this.segs[5];
    const d = this.dash;
    seg.gates.forEach((g, k) =>
      g.arches.forEach((ar) => {
        ar.num.visible = k === d.wave;
      }),
    );
    const w = d.waves[d.wave];
    const practice = d.mode === 'practice';
    this.set({
      dash: {
        mode: d.mode,
        say: w ? (practice ? waveSay(w) : w.say) : '',
        hint: w && practice ? waveHint(w) : null,
        index: Math.min(d.wave + 1, d.waves.length),
        total: d.waves.length,
        hearts: d.hearts,
        done: !w,
        score: d.score,
        streak: d.streak,
        node: d.node,
        level: d.level,
      },
    });
  }

  updateDash(dt) {
    const seg = this.segs[5];
    const d = this.dash;
    const practice = d.mode === 'practice';
    let move = 0;
    if (this.input.take('left')) move -= 1;
    if (this.input.take('right')) move += 1;
    const sx = this.input.stick.x;
    if (Math.abs(sx) > 0.55 && !d.stickLatch) {
      move += Math.sign(sx);
      d.stickLatch = true;
    }
    if (Math.abs(sx) < 0.25) d.stickLatch = false;
    if (move) {
      const nl = Math.max(0, Math.min(2, d.lane + move));
      if (nl !== d.lane) {
        d.lane = nl;
        this.audio.play('lane');
      }
    }
    d.slow = Math.max(0, d.slow - dt);
    const cruise = practice ? d.speed + Math.min(d.streak, 6) * 0.12 : 7.2 + d.wave * 0.38;
    d.s += cruise * (d.slow > 0 ? 0.35 : 1) * dt;
    d.v += (DASH.lanes[d.lane] - d.v) * damp(14, dt);
    const p = this.segPoint(seg, d.s, d.v, 0.25);
    this.hero.pos.copy(p);
    this.hero.yaw = seg.yaw;
    this.board.position.copy(p).setY(0.3);
    this.board.rotation.y = seg.yaw;
    this.board.rotation.z = (DASH.lanes[d.lane] - d.v) * -0.25;
    // the trail warms up with the streak
    if (Math.random() < dt * 40)
      this.particles.burst(
        p.clone().setY(0.2),
        d.streak >= 5 ? 0xffc12e : d.streak >= 3 ? 0xff9de0 : 0x7dfcff,
        d.streak >= 3 ? 2 : 1,
        1,
        0.2,
        0.5,
      );
    const gate = seg.gates[d.wave];
    const w = d.waves[d.wave];
    if (w && d.s >= gate.u) {
      const hit = d.lane === w.good;
      gate.arches.forEach((ar, lane) => {
        const c = lane === w.good ? 0x2fe37a : 0xff6b81;
        ar.mat.color.set(c);
        ar.mat.emissive.set(c);
        ar.veil.material.color.set(c);
        ar.veil.material.opacity = lane === w.good ? 0.35 : 0.12;
      });
      d.wave += 1;
      if (hit) {
        d.streak += 1;
        d.bestStreak = Math.max(d.bestStreak, d.streak);
        d.score += gatePoints(d.streak);
        this.audio.play('gate');
        if (d.streak >= 3) this.audio.play('star', Math.min(d.streak - 2, 4));
        this.particles.burst(p.clone().setY(1.5), 0x8dffb0, 36, 6, 2, 0.9);
        this.robot.cheer();
      } else {
        d.hearts -= 1;
        d.streak = 0;
        d.mistakes += 1;
        d.slow = 0.9;
        this.shake = 0.5;
        this.audio.play('hit');
        this.particles.burst(p.clone().setY(1.2), 0xff6b81, 30, 5, 2, 0.8);
        if (!practice) {
          this.say(T.say.dashHit, 3);
          if (d.hearts <= 0) {
            this.startDash(d.restarts + 1);
            return;
          }
        } else {
          if (d.hearts <= 0) {
            this.endPractice(false);
            return;
          }
          // GUIDED: the run stops on the mistake, says why with the true division, and a question of the same kind comes back
          let again = false;
          if (d.waves.length < MAX_WAVES) {
            d.waves.push(this.lesson.ladder.makeWave(Math.random, d.node, d.level, w));
            this.dressGate(d.waves.length - 1);
            again = true;
          }
          this.set({
            phase: 'dialog',
            overlay: { type: 'guide', wave: w, picked: w.gates[d.lane], again, lost: d.mistakes >= 2 },
          });
          this.showWave();
          return;
        }
      }
      this.showWave();
    }
    if (practice) {
      if (d.wave >= d.waves.length && d.s >= seg.gates[d.waves.length - 1].u + 9) this.endPractice(true);
    } else if (d.s >= seg.len - 3) this.finishDash();
  }

  async finishDash() {
    const seg = this.segs[5];
    const d = this.dash;
    this.dash = null;
    this.audio.fast = false;
    this.set({ phase: 'forge', dash: null });
    const from = this.hero.pos.clone();
    const to = this.spawnOf(6);
    this.audio.play('jump');
    await this.tween(
      0.7,
      (t) => {
        this.hero.pos.lerpVectors(from, to, t);
        this.hero.pos.y = Math.sin(t * Math.PI) * 2.2;
      },
      (t) => t,
    );
    this.hero.pos.y = 0;
    this.hero.vel.set(0, 0, 0);
    this.hero.grounded = true;
    this.markComplete(seg, true);
    const stars = d.restarts > 0 ? 1 : Math.max(1, d.hearts);
    this.set({
      phase: 'play',
      stars: { ...this.state.stars, [seg.id]: Math.max(this.state.stars[seg.id] ?? 0, stars) },
    });
    this.audio.play('success');
    this.hero.island = 6;
    this.arrive(6);
  }

  // ───────────────────────────── « خريطة المعرفة » and the practice game ─────────────────────────────

  /** A help was opened during the current step of a case (the rule, a model sheet): its answer is no longer evidence. */
  markHelped() {
    if (this.caseRun) this.caseRun.helped = true;
  }

  closeMap() {
    const from = this.mapFrom ?? 'play';
    this.mapFrom = null;
    this.ret = null;
    this.set({ overlay: null, phase: from === 'title' ? 'title' : 'play' });
    this.input.clear();
  }

  /** Plays level `level` (0-based) of node `node` of the map: a run of the gate dash, wherever the robot is in the story. */
  startPractice(node, level) {
    const keys = [...this.keysEver];
    if (this.dash || this.caseRun || !this.lesson.ladder.levelOpen(node, level, keys, this.practice)) return false;
    this.audio.unlock();
    this.audio.startMusic();
    if (!this.mapFrom) this.mapFrom = this.state.phase === 'title' ? 'title' : 'play';
    if (!this.ret)
      this.ret = { pos: this.hero.pos.clone(), yaw: this.hero.yaw, island: this.hero.island, held: this.state.held };
    if (this.lesson.ladder.isCase(node, level)) return this.startCase(node, level);
    this.beginRun({
      mode: 'practice',
      node,
      level,
      waves: this.lesson.ladder.makeRun(Math.random, node, level),
      hearts: PRACTICE_HEARTS,
      speed: this.lesson.ladder.nodes[node].levels[level].speed,
    });
    return true;
  }

  /** Puts the robot and the board back where the story left them. */
  leaveRail() {
    this.dash = null;
    this.audio.fast = false;
    const r = this.ret;
    const h = this.hero;
    if (r) {
      h.pos.copy(r.pos);
      h.yaw = r.yaw;
      h.island = r.island;
      h.vel.set(0, 0, 0);
      h.grounded = true;
      if (r.held != null && this.state.held == null) this.take(r.held);
    }
    const rail = this.segs[5];
    if (rail.complete) this.board.position.copy(this.segPoint(rail, rail.len - 3, 0, 0.35));
    else this.board.position.copy(this.boardHome);
    this.board.rotation.z = 0;
    rail.gates.forEach((g) =>
      g.arches.forEach((ar) => {
        ar.group.visible = true;
        ar.num.visible = false;
      }),
    );
    this.camPos.set(h.pos.x - this.camDir.x * 10.5, 7.6, h.pos.z - this.camDir.y * 10.5);
    this.camLook.copy(h.pos);
  }

  endPractice(win) {
    const d = this.dash;
    const id = this.lesson.ladder.levelId(d.node, d.level);
    const before = this.practice[id] ?? { stars: 0, best: 0 };
    const stars = win ? Math.max(1, d.hearts) : 0;
    if (win) {
      this.practice = {
        ...this.practice,
        [id]: { stars: Math.max(before.stars, stars), best: Math.max(before.best, d.score) },
      };
      this.audio.play(stars === 3 ? 'finale' : 'success');
    } else this.audio.play('fail');
    this.leaveRail();
    const next = win ? this.lesson.ladder.nextLevel([...this.keysEver], this.practice) : null;
    this.set({
      phase: this.mapFrom === 'title' ? 'title' : 'dialog',
      dash: null,
      practice: this.practice,
      overlay: {
        type: 'result',
        win,
        node: d.node,
        level: d.level,
        stars,
        score: d.score,
        best: Math.max(before.best, win ? d.score : 0),
        newBest: win && d.score > before.best,
        streak: d.bestStreak,
        mistakes: d.mistakes,
        key: d.waves[Math.min(d.wave, d.waves.length) - 1]?.key ?? null,
        next,
      },
    });
    this.save();
  }

  quitPractice() {
    if (this.caseRun) {
      const { node } = this.caseRun;
      this.leaveDepot();
      this.openMap(node);
      return;
    }
    if (this.dash?.mode !== 'practice') return;
    const { node } = this.dash;
    this.leaveRail();
    this.set({ dash: null });
    this.openMap(node);
  }

  /** After the guidance (or the rule), the run goes on. */
  resumeRun() {
    if (!this.dash) return;
    this.set({ overlay: null, phase: 'dash' });
    this.input.clear();
    this.showWave();
  }

  /** « ذكّرني بالقاعدة »: the tablet of the rule the current question uses — from the HUD of a run, or from the guidance. */
  showRule(key) {
    const d = this.dash;
    const c = this.caseRun;
    this.markHelped();
    const k = key ?? (c ? c.orders[c.oi]?.key : d?.waves[Math.min(d.wave, d.waves.length - 1)]?.key);
    if (!k) return;
    this.audio.play('ui');
    this.set({
      phase: d || c ? 'dialog' : this.state.phase,
      overlay: { type: 'rule', key: k, back: c ? 'case' : d ? 'run' : this.state.overlay },
    });
  }

  closeRule() {
    const o = this.state.overlay;
    if (o?.back === 'run') this.resumeRun();
    else if (o?.back === 'case') this.resumeCase();
    else this.set({ overlay: o?.back ?? null });
  }

  // ───────────────────────────── « تعاونية الواحة »: the real-world practice game ─────────────────────────────
  /** A day at the depot: the orders of the level's mission, solved step by step; the depot packs what the student decides. */
  startCase(node, level) {
    const { mission } = this.lesson.ladder.nodes[node].levels[level];
    const world = WORLD_OF[mission];
    if (!this.worlds) this.worlds = {};
    this.depot = this.worlds[world] ?? (this.worlds[world] = new WORLDS[world](this));
    const orders = makeMission(Math.random, mission);
    this.caseRun = {
      log: [],
      world,
      node,
      level,
      orders,
      oi: 0,
      si: 0,
      hearts: CASE_HEARTS,
      mistakes: 0,
      orderMistakes: 0,
      earned: 0,
      busy: false,
      note: null,
    };
    if (this.state.held != null) this.take(null);
    const h = this.hero;
    h.pos.copy(this.depot.robotSpot);
    h.vel.set(0, 0, 0);
    h.grounded = true;
    h.yaw = 1.9;
    this.camPos.copy(this.depot.camPos).add(new THREE.Vector3(0, 6, 8));
    this.camLook.copy(this.depot.camLook);
    this.depot.setOrder(orders[0]);
    this.skyNow = SKIES[1].slice();
    this.input.clear();
    this.set({ phase: 'depot', overlay: null, prompt: null, equation: null, verdict: null });
    this.publishCase();
    return true;
  }

  publishCase() {
    const c = this.caseRun;
    if (!c) return;
    const o = c.orders[c.oi];
    this.set({
      depot: {
        history: c.log.slice(),
        world: c.world,
        tip: c.tip ?? null,
        facts: facts(o, Math.min(c.si, o.steps.length)),
        node: c.node,
        level: c.level,
        kind: o.kind,
        client: o.client,
        brief: o.brief,
        index: c.oi + 1,
        total: c.orders.length,
        hearts: c.hearts,
        earned: c.earned,
        step: o.steps[c.si] ?? null,
        stepIndex: Math.min(c.si, o.steps.length - 1),
        steps: o.steps.length,
        busy: c.busy,
        note: c.note,
      },
    }); // step null = the order is done, the truck is leaving
  }

  /** The student's answer to the current step: the depot shows its consequence, then the step is confirmed or explained. */
  async answerCase(value) {
    const c = this.caseRun;
    if (!c || c.busy || this.state.phase !== 'depot') return;
    const o = c.orders[c.oi];
    const res = judge(o, c.si, value);
    // every answer is kept, right or wrong: the student can go back and read any earlier step of the day
    let rec = c.log.find((x) => x.oi === c.oi && x.si === c.si);
    this.evidence(
      'case',
      this.lesson.evidence.caseEvidence(o, c.si, value, { firstTry: !rec, helped: Boolean(c.helped) }),
    );
    if (!rec) {
      rec = {
        oi: c.oi,
        si: c.si,
        steps: o.steps.length,
        prompt: o.steps[c.si].prompt,
        brief: o.brief,
        facts: facts(o, c.si),
        attempts: [],
        tip: null,
        done: false,
      };
      c.log.push(rec);
    }
    rec.attempts.push({ parts: answerParts(o.steps[c.si], value), ok: res.ok, text: res.text });
    if (res.ok) {
      rec.done = true;
      rec.tip = res.tip ?? null;
    }
    c.busy = true;
    c.note = null;
    c.tip = null;
    this.publishCase();
    for (const sim of res.sims) {
      await this.depot.runSim(sim, o.good, (eq) => this.set({ equation: { ...eq, mode: sim.mode ?? 'crates' } }));
      await this.wait(0.55);
      if (this.dead || this.caseRun !== c) return;
    }
    if (res.ok) {
      this.audio.play('success');
      this.robot.cheer();
      c.note = res.text;
      c.tip = res.tip ?? null;
      c.si += 1; // the shortcut comes AFTER the right answer
      c.helped = false;
      if (res.sims.length) c.keep = res.sims.at(-1); // what was built stays in the world for the next steps
      if (c.si >= o.steps.length) {
        c.earned += Math.max(MISTAKE_COST, ORDER_PAY - c.orderMistakes * MISTAKE_COST);
        this.publishCase();
        await this.wait(1.1);
        await this.depot.ship();
        if (this.dead || this.caseRun !== c) return;
        c.oi += 1;
        c.si = 0;
        c.orderMistakes = 0;
        c.note = null;
        c.tip = null;
        c.keep = null;
        this.set({ equation: null });
        if (c.oi >= c.orders.length) {
          this.endCase(true);
          return;
        }
        this.depot.setOrder(c.orders[c.oi]);
      }
      c.busy = false;
      this.publishCase();
    } else {
      c.hearts -= 1;
      c.mistakes += 1;
      c.orderMistakes += 1;
      c.busy = false;
      if (!res.sims.length) this.audio.play('fail');
      this.publishCase();
      if (c.hearts <= 0) {
        await this.wait(res.sims.length ? 1.4 : 0.3);
        if (this.caseRun === c) this.endCase(false, res.text);
        return;
      }
      this.set({
        phase: 'dialog',
        overlay: { type: 'caseGuide', text: res.text, key: o.key, lost: c.mistakes >= 2, prompt: o.steps[c.si].prompt },
      });
    }
  }

  /**
   * After a guidance card the wrong attempt is cleared — but what the student had already built in this case comes back
   * at once (no animation, no sound): the world keeps the data the next step needs.
   */
  async resumeCase() {
    const c = this.caseRun;
    if (!c) return;
    this.depot.clearSim();
    this.set({ overlay: null, phase: 'depot', equation: null });
    if (c.keep) {
      c.busy = true;
      this.publishCase();
      const sound = this.audio.enabled;
      this.audio.enabled = false;
      this.instantSim = true;
      await this.depot.runSim(c.keep, c.orders[c.oi].good, (eq) => {
        if (!eq.live) this.set({ equation: { ...eq, mode: c.keep.mode ?? 'crates' } });
      });
      this.instantSim = false;
      this.audio.enabled = sound;
      if (this.caseRun !== c) return;
      c.busy = false;
    }
    this.publishCase();
  }

  leaveDepot() {
    this.caseRun = null;
    this.depot?.clearSim();
    const r = this.ret;
    const h = this.hero;
    if (r) {
      h.pos.copy(r.pos);
      h.yaw = r.yaw;
      h.island = r.island;
      h.vel.set(0, 0, 0);
      h.grounded = true;
      if (r.held != null && this.state.held == null) this.take(r.held);
    }
    this.camPos.set(h.pos.x - this.camDir.x * 10.5, 7.6, h.pos.z - this.camDir.y * 10.5);
    this.camLook.copy(h.pos);
    this.skyNow = SKIES[Math.min(this.state.finished ? 8 : this.state.stage, 8)].slice();
    this.set({ depot: null, equation: null });
  }

  endCase(win, why = null) {
    const c = this.caseRun;
    const id = this.lesson.ladder.levelId(c.node, c.level);
    const before = this.practice[id] ?? { stars: 0, best: 0 };
    const stars = win ? Math.max(1, c.hearts) : 0;
    if (win) {
      this.practice = {
        ...this.practice,
        [id]: { stars: Math.max(before.stars, stars), best: Math.max(before.best, c.earned) },
      };
      this.audio.play(stars === 3 ? 'finale' : 'success');
    } else this.audio.play('fail');
    const key = c.orders[Math.min(c.oi, c.orders.length - 1)].key;
    this.leaveDepot();
    const next = win ? this.lesson.ladder.nextLevel([...this.keysEver], this.practice) : null;
    this.set({
      phase: this.mapFrom === 'title' ? 'title' : 'dialog',
      practice: this.practice,
      overlay: {
        type: 'result',
        money: true,
        world: c.world,
        win,
        node: c.node,
        level: c.level,
        stars,
        score: c.earned,
        best: Math.max(before.best, win ? c.earned : 0),
        newBest: win && c.earned > before.best,
        mistakes: c.mistakes,
        key,
        why,
        next,
      },
    });
    this.save();
  }

  // ───────────────────────────── ending ─────────────────────────────
  lightUp(instant = false) {
    const { lamp, beams, light } = this.lighthouse.userData;
    lamp.material.color.set(0xfff1a8);
    lamp.material.emissive.set(0xffe27a);
    lamp.material.emissiveIntensity = 3;
    beams.visible = true;
    light.intensity = instant ? 260 : 0;
    this.lit = true;
    if (!instant)
      this.tween(2, (t) => {
        light.intensity = 260 * t;
      });
  }

  async finale() {
    const again = this.state.finished;
    this.set({ phase: 'end', prompt: null, finished: true });
    this.save();
    await this.wait(1.2);
    if (this.dead) return;
    if (!again) {
      this.lightUp();
      this.audio.play('finale');
      this.robot.cheer();
      this.particles.burst(this.lighthouseWorld.clone().setY(13), 0xfff1a8, 120, 9, 5, 2);
      this.say(T.say.end, 8);
    }
    await this.wait(again ? 0.5 : 4.2);
    if (this.dead) return;
    this.set({ overlay: { type: 'end', elapsed: Date.now() - this.startedAt } });
  }

  // ───────────────────────────── public: shell commands ─────────────────────────────

  // ───────────────────────────── loop ─────────────────────────────
  walkable(x, z) {
    for (const isl of this.isl) if (Math.hypot(x - isl.x, z - isl.z) <= isl.R - 0.12) return true;
    for (const seg of this.segs) {
      if (seg.kind !== 'bridge' || seg.builtLen <= 0) continue;
      const u = (x - seg.sx) * seg.dx + (z - seg.sz) * seg.dz;
      const v = (x - seg.sx) * seg.rx + (z - seg.sz) * seg.rz;
      if (Math.abs(v) <= BRIDGE_HALF && u >= -0.7 && u <= seg.builtLen) return true;
    }
    return false;
  }
}

function distToSeg(px, pz, ax, az, bx, bz) {
  const dx = bx - ax;
  const dz = bz - az;
  const l2 = dx * dx + dz * dz || 1;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (pz - az) * dz) / l2));
  return Math.hypot(px - (ax + dx * t), pz - (az + dz * t));
}
