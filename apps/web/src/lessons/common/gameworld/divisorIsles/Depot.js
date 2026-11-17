/**
 * « تعاونية الواحة » — the 3D depot of the real-world practice game (three.js, drawn in code).
 * An oasis island far from the archipelago: a warehouse, a pallet of goods, a packing floor and a truck. `runSim` PACKS FOR
 * REAL what the student decided: q containers appear one by one (the HUD's equality follows), and what does not fit stays
 * visible — items left on a red mat (crates), or a last truck half empty (trucks). Nothing here decides: all maths is cases.js.
 */
import * as THREE from 'three';
import { THEMES, makeIsland, makeRock, std, glow, textSprite, seeded } from '../engine/builders';
import { divide } from './logic';

THEMES.oasis = {
  grass: 0xe4c98a,
  lip: 0xf1dcaa,
  rock: 0xb38a5c,
  rockDark: 0x8a6843,
  leaf: [0x3f9a4a, 0x57b25a, 0x2f8748],
  trunk: 0x8a6239,
  flower: [0xffffff, 0xffd27a],
};
const DEPOT_AT = { x: -340, z: 280 };
const PAD = { w: 14.5, d: 8.2, z: 0.4 };
const easeOut = (t) => 1 - (1 - t) ** 3;

function makePalm(rand, s = 1) {
  const g = new THREE.Group();
  const h = (3.6 + rand() * 1.4) * s;
  for (let i = 0; i < 5; i += 1) {
    const seg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16 * s, 0.2 * s, h / 5 + 0.05, 6),
      std(i % 2 ? 0x8a6239 : 0x9b7244),
    );
    seg.position.set(Math.sin(i * 0.35) * 0.18 * s, (i + 0.5) * (h / 5), 0);
    seg.castShadow = true;
    g.add(seg);
  }
  for (let i = 0; i < 7; i += 1) {
    const leaf = new THREE.Mesh(
      new THREE.ConeGeometry(0.34 * s, 2.5 * s, 4),
      std([0x3f9a4a, 0x57b25a, 0x2f8748][i % 3]),
    );
    const a = (i / 7) * Math.PI * 2;
    leaf.position.set(Math.cos(a) * 1.0 * s + 0.2 * s, h + 0.05, Math.sin(a) * 1.0 * s);
    leaf.rotation.set(0, -a, -Math.PI / 2 - 0.45);
    leaf.rotation.order = 'YXZ';
    leaf.scale.z = 0.35;
    leaf.castShadow = true;
    g.add(leaf);
  }
  const dates = new THREE.Mesh(new THREE.IcosahedronGeometry(0.26 * s, 0), std(0xb5651d));
  dates.position.set(0.2 * s, h - 0.25, 0.25 * s);
  g.add(dates);
  return g;
}

function makeTruck() {
  const g = new THREE.Group();
  const cab = new THREE.Mesh(new THREE.BoxGeometry(2.1, 2.0, 2.4), std(0x2f6fd0, { flatShading: false }));
  cab.position.set(2.9, 1.5, 0);
  cab.castShadow = true;
  g.add(cab);
  const glass = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.8, 1.9),
    std(0xbfe6ff, { flatShading: false, roughness: 0.2 }),
  );
  glass.position.set(3.97, 1.85, 0);
  g.add(glass);
  const bed = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.3, 2.5), std(0x394766));
  bed.position.set(-0.6, 0.85, 0);
  bed.castShadow = true;
  g.add(bed);
  for (const z of [-1.2, 1.2]) {
    const side = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.7, 0.1), std(0x4a5b80));
    side.position.set(-0.6, 1.35, z);
    g.add(side);
  }
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.7, 2.5), std(0x4a5b80));
  back.position.set(-2.9, 1.35, 0);
  g.add(back);
  for (const [x, z] of [
    [2.7, 1.25],
    [2.7, -1.25],
    [-1.6, 1.25],
    [-1.6, -1.25],
  ]) {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.35, 12), std(0x1c1f2b, { flatShading: false }));
    w.rotation.x = Math.PI / 2;
    w.position.set(x, 0.5, z);
    g.add(w);
  }
  const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.22, 0.4), glow(0xffe27a, 0.9));
  lamp.position.set(3.97, 0.95, 0.8);
  g.add(lamp);
  g.userData.load = new THREE.Vector3(-0.6, 1.6, 0);
  return g;
}

export class Depot {
  constructor(game) {
    this.game = game;
    this.items = [];
    this.left = [];
    const g = new THREE.Group();
    g.position.set(DEPOT_AT.x, 0, DEPOT_AT.z);
    game.scene.add(g);
    this.group = g;
    const rand = seeded(4242);
    g.add(makeIsland(21, 'oasis', 91));
    // the warehouse
    const house = new THREE.Group();
    house.position.set(0, 0, -11.5);
    g.add(house);
    const body = new THREE.Mesh(new THREE.BoxGeometry(13, 5, 6), std(0xf3e6c8));
    body.position.y = 2.5;
    body.castShadow = true;
    body.receiveShadow = true;
    house.add(body);
    const roof = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 4.6, 2.2, 4, 1), std(0xc8553d));
    roof.rotation.y = Math.PI / 4;
    roof.scale.set(2.1, 1, 1);
    roof.position.y = 6.1;
    roof.castShadow = true;
    house.add(roof);
    const door = new THREE.Mesh(new THREE.BoxGeometry(4.2, 3.4, 0.2), std(0x4b3a2a));
    door.position.set(0, 1.7, 3.05);
    house.add(door);
    for (let i = 0; i < 6; i += 1) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.06, 0.24), std(0x6a543d));
      slat.position.set(0, 0.5 + i * 0.55, 3.06);
      house.add(slat);
    }
    // the cooperative's sign stands on its own posts beside the floor, where no panel of the screen hides it
    const board = new THREE.Group();
    board.position.set(10.2, 0, -5.6);
    g.add(board);
    for (const x of [-1.9, 1.9]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 2.6, 6), std(0x8a6239));
      post.position.set(x, 1.3, 0);
      post.castShadow = true;
      board.add(post);
    }
    const sign = textSprite('تعاونية الواحة', { h: 1.2, bg: 'rgba(22,101,52,0.96)', stroke: null, color: '#fff7d6' });
    sign.position.set(0, 2.9, 0);
    board.add(sign);
    // palms and rocks
    for (const [x, z, s] of [
      [-15, -9, 1.1],
      [15, -10, 1.2],
      [-17, 3, 1],
      [17.5, 5, 0.95],
      [-9.5, -14, 1.15],
      [10, -15, 1],
      [-13, 12, 0.9],
      [14, 12, 1],
    ]) {
      const p = makePalm(rand, s);
      p.position.set(x, 0, z);
      p.rotation.y = rand() * 6;
      g.add(p);
    }
    for (let i = 0; i < 6; i += 1) {
      const r = makeRock('oasis', rand, 0.4 + rand() * 0.5);
      const a = rand() * 6.28;
      r.position.x = Math.cos(a) * 17.5;
      r.position.z = Math.sin(a) * 17.5;
      g.add(r);
    }
    // the packing floor
    const floor = new THREE.Mesh(new THREE.BoxGeometry(PAD.w + 0.8, 0.12, PAD.d + 0.8), std(0xcfa565));
    floor.position.set(0, 0.03, PAD.z);
    floor.receiveShadow = true;
    g.add(floor);
    const inner = new THREE.Mesh(new THREE.BoxGeometry(PAD.w, 0.13, PAD.d), std(0xdcb878));
    inner.position.set(0, 0.04, PAD.z);
    inner.receiveShadow = true;
    g.add(inner);
    // the pallet of goods
    const pallet = new THREE.Group();
    pallet.position.set(-11.3, 0, 0.5);
    g.add(pallet);
    this.pallet = pallet;
    const base = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.3, 3), std(0x8a6239));
    base.position.y = 0.15;
    base.castShadow = true;
    pallet.add(base);
    this.goodsMat = std(0xb5651d);
    const pile = new THREE.InstancedMesh(new THREE.BoxGeometry(0.6, 0.5, 0.62), this.goodsMat, 60);
    pile.castShadow = true;
    const m = new THREE.Matrix4();
    let k = 0;
    for (let y = 0; y < 3; y += 1)
      for (let x = 0; x < 5; x += 1)
        for (let z = 0; z < 4; z += 1) {
          m.setPosition(-1.3 + x * 0.65, 0.58 + y * 0.53, -1.0 + z * 0.67);
          pile.setMatrixAt(k, m);
          k += 1;
        }
    pallet.add(pile);
    this.palletLabel = textSprite('0', { h: 1.5, bg: 'rgba(10,26,60,0.9)', stroke: null, color: '#fff7d6' });
    this.palletLabel.position.set(0, 3.5, 0);
    pallet.add(this.palletLabel);
    // the truck, and the red mat where what does not fit stays
    this.truck = makeTruck();
    this.truckHome = new THREE.Vector3(11.4, 0, 1.6);
    this.truck.position.copy(this.truckHome);
    this.truck.rotation.y = -0.12;
    g.add(this.truck);
    this.mat = new THREE.Mesh(
      new THREE.BoxGeometry(4.6, 0.1, 2.6),
      new THREE.MeshStandardMaterial({ color: 0xff7a5c, transparent: true, opacity: 0.85 }),
    );
    this.mat.position.set(-8.3, 0.08, 6.3);
    this.mat.visible = false;
    g.add(this.mat);
    this.leftLabel = textSprite('0', { h: 1.2, bg: 'rgba(190,40,40,0.95)', stroke: null, color: '#ffffff' });
    this.leftLabel.visible = false;
    g.add(this.leftLabel);
    this.counter = textSprite('0', { h: 1.5, color: '#fff3b0' });
    this.counter.visible = false;
    g.add(this.counter);
    this.robotSpot = new THREE.Vector3(DEPOT_AT.x - 3.6, 0, DEPOT_AT.z + 6.9);
    this.camPos = new THREE.Vector3(DEPOT_AT.x, 16.5, DEPOT_AT.z + 19.8);
    this.camLook = new THREE.Vector3(DEPOT_AT.x, 0.4, DEPOT_AT.z + 0.3);
  }

  setOrder(order) {
    this.clearSim();
    this.goodsMat.color.set(order.good.color);
    this.palletLabel.userData.setText(String(order.n));
  }

  clearSim() {
    for (const it of [...this.items, ...this.left]) {
      this.group.remove(it);
      it.traverse?.((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material && o.material !== this.goodsMat) o.material.dispose();
      });
    }
    this.items = [];
    this.left = [];
    this.mat.visible = false;
    this.leftLabel.visible = false;
    this.counter.visible = false;
  }

  container(size, color, trucks, fill = 1) {
    const g = new THREE.Group();
    const h = size * (trucks ? 0.55 : 0.62);
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(size, h, size * (trucks ? 0.62 : 1)),
      std(trucks ? 0x4f7cc4 : 0xc79a5b),
    );
    box.position.y = h / 2;
    box.castShadow = true;
    box.receiveShadow = true;
    g.add(box);
    const top = new THREE.Mesh(
      new THREE.BoxGeometry(size * 0.84 * Math.max(0.08, fill), 0.07, size * (trucks ? 0.5 : 0.84)),
      std(fill < 1 ? 0xffb14a : color),
    );
    top.position.set(-(size * 0.84 * (1 - fill)) / 2, h + 0.03, 0);
    g.add(top);
    if (fill < 1) {
      const rim = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(size * 1.04, h * 1.06, size * (trucks ? 0.66 : 1.04))),
        new THREE.LineBasicMaterial({ color: 0xff7a1a }),
      );
      rim.position.y = h / 2;
      g.add(rim);
    }
    return g;
  }

  /**
   * Packs n items in containers of b. `onStep({ a, b, q, r, live })` follows the count. Resolves to { q, r }.
   * mode 'crates': r items stay on the red mat; mode 'trucks': one more container, partly filled.
   */
  async runSim({ n, b, mode = 'crates' }, good, onStep = () => {}) {
    const game = this.game;
    const { q, r } = divide(n, b);
    const trucks = mode === 'trucks';
    this.clearSim();
    const total = q + (trucks && r > 0 ? 1 : 0);
    const cols = Math.max(1, Math.min(10, Math.ceil(Math.sqrt(Math.max(1, total) * 1.9))));
    const rows = Math.max(1, Math.ceil(total / cols));
    const cell = Math.min(2.6, PAD.w / cols, PAD.d / rows);
    const size = cell * 0.8;
    const slot = (k) =>
      new THREE.Vector3(
        ((k % cols) - (cols - 1) / 2) * cell,
        0.1,
        PAD.z + (Math.floor(k / cols) - (rows - 1) / 2) * cell,
      );
    const from = new THREE.Vector3(this.pallet.position.x, 2.2, this.pallet.position.z);
    onStep({ a: n, b, q: 0, r: n, live: true });
    this.counter.visible = q > 0;
    const per = game.instantSim ? 0.001 : Math.min(0.3, Math.max(0.06, 2.8 / Math.max(1, q)));
    for (let k = 0; k < q; k += 1) {
      if (game.dead) return { q, r };
      const c = this.container(size, good.color, trucks);
      c.position.copy(from);
      c.scale.setScalar(0.2);
      this.group.add(c);
      this.items.push(c);
      const home = slot(k);
      await game.tween(
        per,
        (t) => {
          c.position.lerpVectors(from, home, t);
          c.position.y += Math.sin(t * Math.PI) * 2;
          c.scale.setScalar(0.2 + 0.8 * t);
        },
        easeOut,
      );
      game.audio.play('plank', k);
      this.counter.userData.setText(String(k + 1));
      this.counter.position.set(home.x, size + 1.3, home.z);
      onStep({ a: n, b, q: k + 1, r: n - b * (k + 1), live: true });
    }
    await game.wait(game.instantSim ? 0.001 : 0.25);
    this.counter.visible = false;
    if (r > 0 && trucks) {
      const c = this.container(size, good.color, true, r / b);
      c.position.copy(slot(q));
      this.group.add(c);
      this.items.push(c);
      this.leftLabel.userData.setText(`${b - r} فارغة`);
      this.leftLabel.position.set(c.position.x, size + 1.2, c.position.z);
      this.leftLabel.visible = true;
      game.audio.play('plank', q);
    } else if (r > 0) {
      this.mat.visible = true;
      const show = Math.min(r, 36);
      const side = Math.ceil(Math.sqrt(show * 1.7));
      for (let i = 0; i < show; i += 1) {
        const cube = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.3, 0.34), this.goodsMat);
        cube.castShadow = true;
        cube.position.set(
          this.mat.position.x - 1.9 + (i % side) * (3.8 / Math.max(1, side - 1 || 1)) * (side > 1 ? 1 : 0),
          0.3,
          this.mat.position.z - 0.9 + Math.floor(i / side) * 0.45,
        );
        this.group.add(cube);
        this.left.push(cube);
      }
      this.leftLabel.userData.setText(`بقي ${r}`);
      this.leftLabel.position.set(this.mat.position.x, 2.1, this.mat.position.z);
      this.leftLabel.visible = true;
      game.audio.play('fail');
      game.shake = 0.12;
    } else {
      for (let i = 0; i <= 6; i += 1)
        game.particles.burst(
          new THREE.Vector3(DEPOT_AT.x - PAD.w / 2 + (PAD.w * i) / 6, 0.8, DEPOT_AT.z + PAD.z),
          0x8dffb0,
          8,
          3,
          3,
          1,
        );
    }
    onStep({ a: n, b, q, r, live: false });
    return { q, r };
  }

  /** The order is right: the containers go on the truck, the truck leaves, an empty one comes back. */
  async ship() {
    const game = this.game;
    const items = this.items.slice();
    this.items = [];
    const to = this.truck.position.clone().add(this.truck.userData.load);
    const data = items.map((c, i) => ({
      c,
      from: c.position.clone(),
      delay: i * Math.min(0.03, 0.5 / Math.max(1, items.length)),
    }));
    const total = 0.55 + (data.at(-1)?.delay ?? 0);
    if (items.length)
      await game.tween(
        total,
        (t) => {
          const el = t * total;
          data.forEach((d) => {
            const p = Math.max(0, Math.min(1, (el - d.delay) / 0.5));
            d.c.position.lerpVectors(d.from, to, p);
            d.c.position.y += Math.sin(p * Math.PI) * 2.5;
            d.c.scale.setScalar(1 - 0.72 * p);
          });
        },
        (t) => t,
      );
    items.forEach((c, i) => {
      this.truck.attach(c);
      c.position.set(-2.3 + (i % 4) * 1.1, 1.2 + Math.floor(i / 8) * 0.42, i % 8 < 4 ? -0.55 : 0.55);
      c.scale.setScalar(0.3);
      c.visible = i < 24;
    });
    game.audio.play('wind');
    const home = this.truckHome;
    await game.tween(
      1.2,
      (t) => {
        this.truck.position.x = home.x + t * t * 34;
      },
      (t) => t,
    );
    items.forEach((c) => this.truck.remove(c));
    this.clearSim();
    this.truck.position.x = home.x + 34;
    await game.tween(
      0.8,
      (t) => {
        this.truck.position.x = home.x + 34 * (1 - t);
      },
      easeOut,
    );
  }

  update(time) {
    this.truck.position.y = Math.sin(time * 9) * 0.012;
    if (this.leftLabel.visible) this.leftLabel.material.opacity = 0.75 + Math.abs(Math.sin(time * 4)) * 0.25;
  }
}
