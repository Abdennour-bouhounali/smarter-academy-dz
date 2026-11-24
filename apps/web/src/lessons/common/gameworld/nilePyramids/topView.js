/**
 * « منظر من الأعلى » — THE TOP VIEW of a stage (owner, 2026-11-24: « to see all the distances and the shape »). Pure
 * framing and label placement; `Game.js › toggleTop` uses them. The camera stands above the stage's figure and looks
 * straight down; the top of the screen is the way the lens looked before (so left and right stay his).
 */
import * as THREE from 'three';

const MARGIN = 10; // metres of ground kept round the figure

/**
 * The part of the screen the HUD leaves clear, as fractions of the view: the instruction and the fact above, the buttons
 * below, the register's and the recall's cards on the sides (the walk's screenshots of the river, 2026-11-24).
 */
const CLEAR = { top: 0.3, bottom: 0.12, width: 0.8 };

/**
 * The shot framing every point (x, y, z) of a stage from above, inside the part of the screen the HUD leaves clear:
 * `dir` the ground direction « up » on screen as the lens looked (the view may turn by a quarter so that a long figure
 * lies along the screen's width), `fov` the vertical angle of the lens (degrees), `aspect` width / height.
 * Returns { pos, look, k, height, dir }.
 */
export function topFrame({ points, dir, fov = 55, aspect = 16 / 9 }) {
  const pts = points.filter((p) => p && Number.isFinite(p.x) && Number.isFinite(p.z));
  const l = Math.hypot(dir.x, dir.z) || 1;
  const t = Math.tan(((fov / 2) * Math.PI) / 180);
  const top = Math.max(0, ...pts.map((p) => p.y ?? 0));
  const band = 1 - CLEAR.top - CLEAR.bottom;
  const frame = (f) => {
    const r = { x: -f.z, z: f.x }; // the screen's right for a lens looking along f
    const along = pts.map((p) => p.x * f.x + p.z * f.z);
    const across = pts.map((p) => p.x * r.x + p.z * r.z);
    const [a0, a1] = [Math.min(...along), Math.max(...along)];
    const [b0, b1] = [Math.min(...across), Math.max(...across)];
    const height =
      Math.max(((a1 - a0) / 2 + MARGIN) / (t * band), ((b1 - b0) / 2 + MARGIN) / (t * aspect * CLEAR.width), 30) + top;
    // the clear band's middle is below the screen's: the figure is moved down the screen by looking further up
    const am = (a0 + a1) / 2 + ((CLEAR.top - CLEAR.bottom) / 2) * 2 * height * t;
    const bm = (b0 + b1) / 2;
    return { f, height, c: { x: f.x * am + r.x * bm, z: f.z * am + r.z * bm } };
  };
  const f0 = { x: dir.x / l, z: dir.z / l };
  const turns = [f0, { x: -f0.z, z: f0.x }, { x: f0.z, z: -f0.x }];
  const best = turns.map(frame).reduce((b, x) => (x.height < b.height * 0.9 ? x : b));
  const { f, height, c } = best;
  return {
    pos: new THREE.Vector3(c.x - f.x * height * 0.02, height, c.z - f.z * height * 0.02),
    look: new THREE.Vector3(c.x, 0, c.z),
    k: 3,
    height,
    dir: f,
  };
}

/** The screen rectangle of a fixed-size sprite at `p` (projected NDC), in pixels. */
const rectOf = (ndc, s, W, H, k) => ({ x: ((ndc.x + 1) / 2) * W, y: ((1 - ndc.y) / 2) * H, w: s.x * k, h: s.y * k });
const meet = (a, b, pad) =>
  Math.abs(a.x - b.x) * 2 < a.w + b.w + pad * 2 && Math.abs(a.y - b.y) * 2 < a.h + b.h + pad * 2;

/**
 * Moves the labels `sprites` (each a fixed-size sprite) so that none prints over another in the top view `shot`: a label
 * meeting one already placed goes up the screen (along the shot's `dir`) just enough. Each keeps its home
 * (`userData.home`) and is moved FROM it; returns the sprites moved (to put back when the view closes).
 */
export function declutter(sprites, shot, { viewH = 768, aspect = 16 / 9, fov = 55, pad = 3 } = {}) {
  const cam = new THREE.PerspectiveCamera(fov, aspect, 1, 20000);
  cam.position.copy(shot.pos);
  cam.lookAt(shot.look);
  cam.updateMatrixWorld();
  const W = viewH * aspect;
  const k = viewH / 2 / Math.tan(((fov / 2) * Math.PI) / 180);
  const metrePerPx = (2 * shot.height * Math.tan(((fov / 2) * Math.PI) / 180)) / viewH;
  const v = new THREE.Vector3();
  const items = sprites.map((o) => {
    if (!o.userData.home) o.userData.home = o.position.clone();
    o.position.copy(o.userData.home);
    o.updateMatrixWorld();
    o.getWorldPosition(v);
    return { o, r: rectOf(v.clone().project(cam), o.scale, W, viewH, k) };
  });
  items.sort((a, b) => b.r.y - a.r.y); // from the bottom of the screen up
  const placed = [];
  const moved = [];
  for (const it of items) {
    let dy = 0;
    for (let n = 0; n < 40; n += 1) {
      const r = { ...it.r, y: it.r.y - dy };
      const hit = placed.find((p) => meet(p, r, pad));
      if (!hit) break;
      dy += r.y + r.h / 2 - (hit.y - hit.h / 2) + pad + 1;
    }
    placed.push({ ...it.r, y: it.r.y - dy });
    if (dy > 0) {
      const m = dy * metrePerPx;
      it.o.position.x += shot.dir.x * m;
      it.o.position.z += shot.dir.z * m;
      moved.push(it.o);
    }
  }
  return moved;
}
