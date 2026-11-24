/**
 * The 3D views of the MOCK-UP `../thales-egypt.html` (the « pyramids » world propositions for خاصية طالس).
 * Owner, 2026-11-23: « i need a real 3d in it » — « it is not a boy game it a real game » — « just a mocup »:
 * realistic rendering (physical sky, real sun and shadows, limestone, dunes, the Nile) and a few controls to feel each
 * idea; the real game is built after the owner chooses. Units: metres (A, B) and cubits (C). y is up.
 * Each view has its own renderer and draws only when something changes.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { makeRobot } from '../../../../apps/web/src/lessons/common/gameworld/engine/robot';

// ───────────────────────────── the world's progress: stages, hearts, stars (shared by the map and the scenes)
const STAGES = [
  { name: 'حقل النيل', game: 'C' },
  { name: 'ورشة البنّائين', game: 'B' },
  { name: 'المنحدر المائل', train: true },
  { name: 'مسلّة الواحة', train: true },
  { name: 'ظلّ الهرم الأكبر', game: 'A' },
];
const progress = {
  hearts: 3,
  stars: 0,
  current: 0,
  traveling: false,
  subs: [],
  emit(kind) {
    this.subs.forEach((f) => f(kind));
  },
  win(game) {
    const st = STAGES[this.current];
    if (!st) return '🏆 العالم مكتمل.';
    if (st.game !== game) return `(المرحلة الحالية هي ${this.current + 1}: « ${st.name} » — هذه لا تُحسب بعد)`;
    if (this.traveling) return '(زيرو في القارب: أكمل الرحلة أوّلًا)';
    this.stars += 3;
    this.current += 1;
    if (this.current >= STAGES.length) {
      this.emit('advance');
      return '+3 ⭐ — 🏆 أكملت عالم الأهرامات.';
    }
    this.traveling = true;
    this.emit('travel');
    return `+3 ⭐ — زيرو يركب القارب نحو المرحلة ${this.current + 1}: أكمل الرحلة على النيل.`;
  },
  winTrain() {
    this.stars += 3;
    this.current += 1;
    this.traveling = this.current < STAGES.length;
    this.emit('travel');
  },
  arrive() {
    this.traveling = false;
    this.emit('arrive');
    return `المرحلة ${this.current + 1}: « ${STAGES[this.current].name} » مفتوحة.`;
  },
  lose() {
    this.hearts -= 1;
    if (this.hearts <= 0) {
      this.hearts = 3;
      this.emit('hearts');
      return '💔 نفدت القلوب: تعيد المرحلة من بدايتها.';
    }
    this.emit('hearts');
    return '−1 ❤️';
  },
  reset() {
    Object.assign(this, { hearts: 3, stars: 0, current: 0, traveling: false });
    this.emit('reset');
  },
};

/** « زيرو », the hero of every world (the game engine's robot), at `scale` */
function zero(S, scale = 1) {
  const r = makeRobot();
  r.group.scale.setScalar(scale);
  r.group.traverse((o) => {
    if (o.isMesh) o.castShadow = true;
  });
  r.speed = 0;
  S.scene.add(r.group);
  S.ticks.push((dt) => r.update(dt, { speed: r.speed }));
  return r;
}

// ───────────────────────────── noise and procedural textures
const hash = (x, y) => {
  const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return h - Math.floor(h);
};
const vnoise = (x, y) => {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const s = (t) => t * t * (3 - 2 * t);
  const u = s(x - xi);
  const v = s(y - yi);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};
const fbm = (x, y, o = 5) => {
  let f = 0;
  let a = 0.5;
  for (let i = 0; i < o; i++) {
    f += a * vnoise(x, y);
    x *= 2.03;
    y *= 2.03;
    a *= 0.5;
  }
  return f;
};

function canvasTexture(size, paint) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const img = g.createImageData(size, size);
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const [r, gg, b] = paint(x, y);
      const i = (y * size + x) * 4;
      img.data[i] = r;
      img.data[i + 1] = gg;
      img.data[i + 2] = b;
      img.data[i + 3] = 255;
    }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
}

const SAND = () =>
  canvasTexture(256, (x, y) => {
    const n = 0.82 + 0.3 * fbm(x / 26, y / 26) + (hash(x, y) - 0.5) * 0.09;
    return [214 * n, 172 * n, 112 * n];
  });
let limestoneImage = null;
/** limestone blocks: 64 × 32 px, every other row offset; dark joints; weathered noise (one image, many repeats) */
const LIMESTONE = () => {
  if (!limestoneImage)
    limestoneImage = canvasTexture(256, (x, y) => {
      const row = Math.floor(y / 32);
      const bx = (x + (row % 2) * 32) % 64;
      const joint = bx < 2 || y % 32 < 2;
      const n = 0.78 + 0.32 * fbm(x / 18 + row * 7.1, y / 18) + (hash(x, y) - 0.5) * 0.08;
      const tone = 0.92 + 0.12 * hash(row, Math.floor((x + (row % 2) * 32) / 64));
      const k = joint ? 0.58 : n * tone;
      return [222 * k, 196 * k, 152 * k];
    }).image;
  const t = new THREE.CanvasTexture(limestoneImage);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
};
const SILT = () =>
  canvasTexture(256, (x, y) => {
    const n = 0.75 + 0.35 * fbm(x / 30, y / 30) + (hash(x, y) - 0.5) * 0.1;
    return [112 * n, 92 * n, 62 * n];
  });
const CROPS = () =>
  canvasTexture(256, (x, y) => {
    const rowLine = Math.sin((x / 256) * Math.PI * 2 * 18) > 0.35;
    const n = 0.75 + 0.4 * fbm(x / 14, y / 14) + (hash(x, y) - 0.5) * 0.15;
    return rowLine ? [70 * n, 128 * n, 46 * n] : [96 * n, 84 * n, 52 * n];
  });

// ───────────────────────────── a label that always faces the camera and keeps its size on screen
function label(text, { bg = 'rgba(16,20,36,0.82)', fg = '#ffffff', size = 0.05 } = {}) {
  const c = document.createElement('canvas');
  const g = c.getContext('2d');
  const font = '700 64px "Noto Naskh Arabic", "Segoe UI", Tahoma, sans-serif';
  g.font = font;
  c.width = Math.ceil(g.measureText(text).width + 56);
  c.height = 96;
  g.font = font;
  g.fillStyle = bg;
  g.beginPath();
  g.roundRect(0, 0, c.width, c.height, 40);
  g.fill();
  g.fillStyle = fg;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.direction = /[؀-ۿ]/.test(text) ? 'rtl' : 'ltr';
  g.fillText(text, c.width / 2, 52);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true, sizeAttenuation: false }),
  );
  s.scale.set((size * c.width) / c.height, size, 1);
  s.renderOrder = 99;
  return s;
}
const setLabel = (holder, text, opts) => {
  holder.clear();
  if (text) holder.add(label(text, opts));
};

/** a straight glowing dashed ray from a to b, made of short cylinders */
function ray(a, b, r, color) {
  const g = new THREE.Group();
  const A = new THREE.Vector3(...a);
  const B = new THREE.Vector3(...b);
  const L = A.distanceTo(B);
  const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 });
  const dash = L / 40;
  const dir = B.clone().sub(A).normalize();
  for (let s = 0; s < L; s += dash * 1.8) {
    const len = Math.min(dash, L - s);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 8), mat);
    m.position.copy(A.clone().lerp(B, (s + len / 2) / L));
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    g.add(m);
  }
  return g;
}

/** a tape or rope from a to b (a thin box) */
function tape(a, b, w, h, color) {
  const A = new THREE.Vector3(...a);
  const B = new THREE.Vector3(...b);
  const m = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, Math.max(0.01, A.distanceTo(B))),
    new THREE.MeshStandardMaterial({ color, roughness: 0.6 }),
  );
  m.position.copy(A.clone().add(B).multiplyScalar(0.5));
  m.lookAt(B);
  m.castShadow = true;
  return m;
}

/** a date palm: a leaning ringed trunk and drooping fronds */
function palm(seed, h) {
  const g = new THREE.Group();
  const bark = new THREE.MeshStandardMaterial({ color: 0x7b5a3a, roughness: 0.95 });
  const lean = (hash(seed, 1) - 0.5) * 0.25;
  const n = Math.round(h / 0.7);
  let top = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.26 - 0.06 * t, 0.3 - 0.06 * t, 0.72, 9), bark);
    seg.position.set(lean * t * t * h, 0.36 + i * 0.7, 0);
    seg.castShadow = true;
    g.add(seg);
    top = seg.position.clone();
  }
  top.y += 0.3;
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x3f7a35, roughness: 0.8, side: THREE.DoubleSide });
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2 + hash(seed, i) * 0.4;
    const len = 3.2 + hash(i, seed) * 1.2;
    const geo = new THREE.PlaneGeometry(len, 0.55, 8, 1);
    geo.translate(len / 2, 0, 0);
    const p = geo.attributes.position;
    for (let k = 0; k < p.count; k++) {
      const x = p.getX(k);
      p.setY(k, p.getY(k) * (1 - x / len) * 1.3);
      p.setZ(k, -0.09 * x * x);
    }
    geo.computeVertexNormals();
    const f = new THREE.Mesh(geo, leafMat);
    f.position.copy(top);
    f.rotation.set(-Math.PI / 2 + 0.25, 0, a);
    f.castShadow = true;
    g.add(f);
  }
  return g;
}

// ───────────────────────────── a stage: renderer, physical sky, sun, controls, draw on demand
function stage(canvas, { shadow = 300, center = [0, 0, 0], fog = [900, 4200] } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.5;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xe6cfa2, ...fog);
  const sky = new Sky();
  sky.scale.setScalar(20000);
  const su = sky.material.uniforms;
  su.turbidity.value = 9;
  su.rayleigh.value = 1.4;
  su.mieCoefficient.value = 0.006;
  su.mieDirectionalG.value = 0.82;
  scene.add(sky);
  const envSky = new Sky();
  envSky.scale.setScalar(20000);
  const envScene = new THREE.Scene();
  envScene.add(envSky);
  const pmrem = new THREE.PMREMGenerator(renderer);
  let envRT = null;

  scene.add(new THREE.HemisphereLight(0xcfdcff, 0x9a7444, 0.22));
  const sun = new THREE.DirectionalLight(0xfff0d6, 3.1);
  sun.castShadow = true;
  sun.shadow.mapSize.set(4096, 4096);
  Object.assign(sun.shadow.camera, { left: -shadow, right: shadow, top: shadow, bottom: -shadow, near: 1, far: 3200 });
  sun.shadow.camera.updateProjectionMatrix();
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.04;
  scene.add(sun, sun.target);
  const target = new THREE.Vector3(...center);
  const sunDir = new THREE.Vector3();

  const camera = new THREE.PerspectiveCamera(42, 2, 0.5, 30000);
  const controls = new OrbitControls(camera, canvas);
  controls.maxPolarAngle = Math.PI * 0.495;

  const ticks = [];
  let queued = false;
  let visible = true;
  let last = 0;
  const frame = (now) => {
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
    last = now;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== Math.round(w * renderer.getPixelRatio())) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    ticks.forEach((f) => f(dt));
    renderer.render(scene, camera);
    canvas.dataset.drawn = '1';
    if (visible && ticks.length) requestAnimationFrame(frame);
    else {
      queued = false;
      last = 0;
    }
  };
  const render = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(frame);
  };
  controls.addEventListener('change', render);
  new ResizeObserver(render).observe(canvas);
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) render();
  }).observe(canvas);

  /** the sun at `elev`° above the horizon, `az`° around y (−90 = from −x, so shadows point to +x) */
  function setSun(elev, az) {
    sunDir.setFromSphericalCoords(1, THREE.MathUtils.degToRad(90 - elev), THREE.MathUtils.degToRad(az));
    su.sunPosition.value.copy(sunDir);
    for (const k of ['turbidity', 'rayleigh', 'mieCoefficient', 'mieDirectionalG'])
      envSky.material.uniforms[k].value = su[k].value;
    envSky.material.uniforms.sunPosition.value.copy(sunDir);
    sun.position.copy(target).addScaledVector(sunDir, 1500);
    sun.target.position.copy(target);
    sun.intensity = 2.6 + 2.6 * Math.sin(THREE.MathUtils.degToRad(elev));
    if (envRT) envRT.dispose();
    envRT = pmrem.fromScene(envScene, 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.18;
    render();
  }

  function view(pos, look) {
    camera.position.set(...pos);
    controls.target.set(...look);
    controls.update();
    render();
  }
  return { scene, camera, controls, render, setSun, view, ticks };
}

/** sand ground: flat where the play happens, dunes beyond `flat` metres */
function desert(scene, flat, size = 6000) {
  const geo = new THREE.PlaneGeometry(size, size, 220, 220);
  geo.rotateX(-Math.PI / 2);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const z = p.getZ(i);
    const k = THREE.MathUtils.smoothstep(Math.hypot(x, z), flat, flat * 2.2);
    p.setY(i, k * (fbm(x / 260, z / 260, 4) - 0.38) * 70 - 0.05);
  }
  geo.computeVertexNormals();
  const tex = SAND();
  tex.repeat.set(size / 9, size / 9);
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.96 }));
  m.receiveShadow = true;
  scene.add(m);
}

/** a stepped limestone pyramid of `courses` courses, base `base`, height `h`; returns its courses */
function pyramid(scene, { base, h, courses, x = 0, z = 0, upTo = courses, ry = 0 }) {
  const g = new THREE.Group();
  const hc = h / courses;
  const list = [];
  for (let k = 0; k < courses; k++) {
    const w = base * (1 - (k + 0.5) / courses);
    const tex = LIMESTONE();
    tex.repeat.set(Math.max(1, w / 7), 1);
    const course = new THREE.Mesh(
      new THREE.BoxGeometry(w, hc, w),
      new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.9,
        color: new THREE.Color().setHSL(0.095, 0.5, 0.7 + 0.06 * hash(k, 3)),
      }),
    );
    course.position.y = hc * (k + 0.5);
    course.castShadow = true;
    course.receiveShadow = true;
    course.visible = k < upTo;
    g.add(course);
    list.push(course);
  }
  g.position.set(x, 0, z);
  g.rotation.y = ry;
  scene.add(g);
  return list;
}

// ───────────────────────────── A — the shadow of the pyramid (« عصا طاليس »)
function gameA(canvas, hud) {
  const H = 146;
  const HALF = 115;
  const STICK = 2;
  const S = stage(canvas, { shadow: 260, center: [140, 0, 0] });
  desert(S.scene, 520);
  pyramid(S.scene, { base: 2 * HALF, h: H, courses: 64 });
  pyramid(S.scene, { base: 215, h: 136, courses: 60, x: -420, z: -330, ry: 0.05 });
  pyramid(S.scene, { base: 104, h: 65, courses: 30, x: -760, z: -620, ry: -0.04 });
  for (let i = 0; i < 8; i++) {
    const p = palm(i + 3, 9 + hash(i, 9) * 5);
    p.position.set(-260 + i * 38 + hash(i, 2) * 20, 0, 230 + hash(i, 4) * 60);
    S.scene.add(p);
  }
  const stick = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.09, STICK, 10),
    new THREE.MeshStandardMaterial({ color: 0x5a3b1e, roughness: 0.85 }),
  );
  stick.castShadow = true;
  S.scene.add(stick);
  const Z = zero(S, 1);
  const marks = new THREE.Group();
  S.scene.add(marks);
  const L = {};
  ['A', 'B', 'C', 'M', 'N', 's', 'd'].forEach((k) => S.scene.add((L[k] = new THREE.Group())));

  hud.innerHTML = `
    <label>ارتفاع الشمس <input type="range" data-sun min="24" max="50" step="0.1" value="30"><b data-sunv></b></label>
    <label>مكان العصا <input type="range" data-stick min="125" max="330" step="0.1" value="200"><b data-stickv></b></label>
    <div class="row"><button data-cam="far">المنظر الكامل</button><button data-cam="near">عند العصا</button></div>
    <div class="facts" data-facts></div>
    <div class="row ask"><span>ارتفاع الهرم =</span><input type="number" data-guess placeholder="؟" step="0.1"><span>m</span><button data-check>تحقّق</button></div>
    <div class="verdict" data-verdict></div>`;
  const $ = (s) => hud.querySelector(s);
  const state = { elev: 30, d: 200 };

  function update() {
    const t = Math.tan(THREE.MathUtils.degToRad(state.elev));
    const T = H / t; // the pyramid's shadow tip, from the centre of its base
    const s = STICK / t; // the stick's shadow
    const tipStick = state.d + s;
    const meet = Math.abs(tipStick - T) < 0.35;
    stick.position.set(state.d, STICK / 2, 0);
    Z.group.position.set(state.d - 1.6, 0, 1.8);
    Z.group.rotation.y = Math.PI / 2;
    marks.clear();
    // the student's two tapes on the sand: base edge → shadow tip, stick foot → its shadow tip
    marks.add(tape([HALF + 0.5, 0.04, 6], [T, 0.04, 6], 0.5, 0.06, 0xf2c14e));
    marks.add(tape([state.d, 0.04, 1.2], [tipStick, 0.04, 1.2], 0.25, 0.05, 0xf2c14e));
    setLabel(L.s, `ظلّ العصا ${s.toFixed(1)} m`, { size: 0.042 });
    L.s.position.set(state.d + s / 2, 1.2, 2.4);
    setLabel(L.d, `من حافة القاعدة ${(T - HALF).toFixed(1)} m`, { size: 0.042 });
    L.d.position.set((HALF + T) / 2, 34, 110);
    if (meet) {
      marks.add(ray([0, H, 0], [T, 0, 0], 0.16, 0xffb21e));
      setLabel(L.A, 'A', { bg: '#c8553d' });
      L.A.position.set(T, 3, 0);
      setLabel(L.M, 'M', { bg: '#2f7fb5' });
      L.M.position.set(state.d, -1, -3);
      setLabel(L.N, 'N', { bg: '#2f7fb5' });
      L.N.position.set(state.d, STICK + 1.6, 0);
      setLabel(L.B, 'B', { bg: '#8a4b12' });
      L.B.position.set(0, 2, 0);
      setLabel(L.C, 'C ؟', { bg: '#8a4b12' });
      L.C.position.set(0, H + 10, 0);
    } else ['A', 'B', 'C', 'M', 'N'].forEach((k) => L[k].clear());
    $('[data-sunv]').textContent = `${state.elev.toFixed(1)}°`;
    $('[data-stickv]').textContent = `${state.d.toFixed(1)} m`;
    $('[data-facts]').innerHTML = meet
      ? `<p class="ok">طرفا الظلّين يلتقيان في A.</p>
         <p>نصف القاعدة 115 m (معروف) · من الحافة إلى A: ${(T - HALF).toFixed(1)} m · ظلّ العصا AM = ${s.toFixed(1)} m · العصا MN = 2 m</p>`
      : `<p>طرف ظلّ العصا ${tipStick > T ? 'بعد' : 'قبل'} طرف ظلّ الهرم بـ ${Math.abs(tipStick - T).toFixed(1)} m.</p>`;
    $('[data-verdict]').textContent = '';
    state.T = T;
    state.meet = meet;
    S.setSun(state.elev, -90);
  }
  $('[data-sun]').addEventListener('input', (e) => {
    state.elev = +e.target.value;
    update();
  });
  $('[data-stick]').addEventListener('input', (e) => {
    state.d = +e.target.value;
    update();
  });
  $('[data-cam="far"]').onclick = () => S.view([-150, 120, 330], [150, 35, 0]);
  $('[data-cam="near"]').onclick = () => S.view([state.d - 8, 3.4, 10], [state.d + 1, 1, 0]);
  $('[data-check]').onclick = () => {
    const v = parseFloat($('[data-guess]').value);
    const out = $('[data-verdict]');
    if (!state.meet) return (out.textContent = 'اجعل طرفي الظلّين يلتقيان أوّلًا: بغير ذلك لا يتشابه المثلّثان.');
    if (!Number.isFinite(v)) return (out.textContent = 'اكتب ارتفاعًا.');
    const tip = v / Math.tan(THREE.MathUtils.degToRad(state.elev));
    const okA = Math.abs(v - H) < 1;
    if (okA) Z.cheer();
    out.textContent =
      (okA
        ? '✓ صعد المسّاح بالحبل: 146 m. قست الهرم دون أن تتسلّقه، كما فعل طاليس. '
        : `بارتفاع ${v} m يقع ظلّ القمّة على ${tip.toFixed(1)} m من المركز، والظلّ على الرمل ينتهي عند ${state.T.toFixed(1)} m. `) +
      (okA ? progress.win('A') : progress.lose());
  };
  // the opening moment: the sun of tan = 2/3 (shadows 3 m and 219 m), the stick where the tips meet
  state.elev = (Math.atan(2 / 3) * 180) / Math.PI;
  state.d = 219 - 3;
  $('[data-sun]').value = state.elev;
  $('[data-stick]').value = state.d;
  S.view([-150, 120, 330], [150, 35, 0]);
  update();
}

// ───────────────────────────── B — the courses (« ورشة البنّائين »)
function gameB(canvas, hud) {
  const H = 120;
  const BASE = 180;
  const N = 60; // courses of 2 m
  const TARGET_Y = 80; // 40 m under the apex
  const S = stage(canvas, { shadow: 170, center: [0, 30, 0] });
  desert(S.scene, 360);
  const courses = pyramid(S.scene, { base: BASE, h: H, courses: N, upTo: 30 });
  [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ].forEach(([sx, sz]) => S.scene.add(ray([(sx * BASE) / 2, 0, (sz * BASE) / 2], [0, H, 0], 0.22, 0xfff3d6)));
  const w80 = (BASE * (H - TARGET_Y)) / H;
  const red = 0xd9442b;
  [
    [
      [-w80 / 2, TARGET_Y, -w80 / 2],
      [w80 / 2, TARGET_Y, -w80 / 2],
    ],
    [
      [w80 / 2, TARGET_Y, -w80 / 2],
      [w80 / 2, TARGET_Y, w80 / 2],
    ],
    [
      [w80 / 2, TARGET_Y, w80 / 2],
      [-w80 / 2, TARGET_Y, w80 / 2],
    ],
    [
      [-w80 / 2, TARGET_Y, w80 / 2],
      [-w80 / 2, TARGET_Y, -w80 / 2],
    ],
  ].forEach(([a, b]) => S.scene.add(ray(a, b, 0.32, red)));
  const qLabel = label('المدماك على ارتفاع 80 m: عرضه ؟', { bg: 'rgba(217,68,43,.9)', size: 0.045 });
  qLabel.position.set(0, TARGET_Y + 8, 0);
  S.scene.add(qLabel);
  const hLabel = label('القمّة 120 m', { size: 0.04 });
  hLabel.position.set(0, H + 7, 0);
  S.scene.add(hLabel);
  const bLabel = label('القاعدة 180 m', { size: 0.04 });
  bLabel.position.set(0, 2, BASE / 2 + 14);
  S.scene.add(bLabel);
  const ramp = new THREE.Mesh(
    new THREE.BoxGeometry(14, 1.2, 1),
    new THREE.MeshStandardMaterial({ map: SAND(), roughness: 1, color: 0xc89a62 }),
  );
  ramp.castShadow = ramp.receiveShadow = true;
  S.scene.add(ramp);
  const stoneMat = new THREE.MeshStandardMaterial({ map: LIMESTONE(), roughness: 0.9 });
  for (let i = 0; i < 9; i++) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(2, 1.2, 1.4), stoneMat);
    b.position.set(-30 + (i % 3) * 3.2, 0.6 + Math.floor(i / 3) * 1.2, BASE / 2 + 40 + (i % 2));
    b.castShadow = true;
    S.scene.add(b);
  }
  const cut = new THREE.Group();
  S.scene.add(cut);
  const Z = zero(S, 4);
  Z.group.position.set(-44, 0, BASE / 2 + 36);
  Z.group.rotation.y = Math.PI * 0.85;
  for (let i = 0; i < 6; i++) {
    const p = palm(i + 20, 8 + hash(i, 1) * 4);
    p.position.set(120 + i * 18, 0, 140 + hash(i, 7) * 40);
    S.scene.add(p);
  }

  hud.innerHTML = `
    <label>البناء <input type="range" data-built min="1" max="${N}" step="1" value="30"><b data-builtv></b></label>
    <div class="facts" data-facts></div>
    <div class="row ask"><span>عرض المدماك على ارتفاع 80 m =</span><input type="number" data-guess placeholder="؟" step="0.1"><span>m</span><button data-check>اقطع وارفع</button></div>
    <div class="verdict" data-verdict></div>`;
  const $ = (s) => hud.querySelector(s);
  let built = 30;
  function update() {
    courses.forEach((c, k) => (c.visible = k < built));
    const top = built * 2;
    const wTop = (BASE * (H - top)) / H;
    const run = 220;
    const len = Math.hypot(top, run);
    ramp.geometry.dispose();
    ramp.geometry = new THREE.BoxGeometry(14, 1.2, len);
    ramp.position.set(-(wTop / 2) - run / 2, top / 2, 0);
    ramp.rotation.set(0, 0, 0);
    ramp.rotation.y = Math.PI / 2;
    ramp.rotateX(-Math.atan2(top, run));
    $('[data-builtv]').textContent = `${built} مدماكًا · ${top} m`;
    $('[data-facts]').innerHTML =
      `<p>آخر مدماك مبنيّ: على ارتفاع ${top} m، عرضه ${wTop.toFixed(1)} m (يقاس بالحبل).</p>`;
    S.render();
  }
  $('[data-built]').addEventListener('input', (e) => {
    built = +e.target.value;
    cut.clear();
    update();
  });
  $('[data-check]').onclick = () => {
    const v = parseFloat($('[data-guess]').value);
    const out = $('[data-verdict]');
    if (!Number.isFinite(v) || v <= 0) return (out.textContent = 'اكتب عرضًا.');
    built = TARGET_Y / 2;
    $('[data-built]').value = built;
    update();
    cut.clear();
    const ok = Math.abs(v - w80) < 0.3;
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(v, 2, v),
      new THREE.MeshStandardMaterial({ map: LIMESTONE(), color: ok ? 0xffe7a0 : 0xff9a85, roughness: 0.8 }),
    );
    m.position.set(0, TARGET_Y + 1, 0);
    m.castShadow = true;
    cut.add(m);
    if (ok) Z.cheer();
    out.textContent =
      (ok
        ? '✓ الحجارة تنطبق على حافّتي الهرم: 60 m. '
        : v > w80
          ? `المدماك يبرز ${((v - w80) / 2).toFixed(1)} m من كلّ جهة خارج وجه الهرم. `
          : `المدماك يترك ${((w80 - v) / 2).toFixed(1)} m فارغة من كلّ جهة: الوجه لا يصل إلى القمّة مستقيمًا. `) +
      (ok ? progress.win('B') : progress.lose());
    S.render();
  };
  S.setSun(38, -125);
  S.view([210, 120, 260], [0, 50, 0]);
  update();
}

// ───────────────────────────── C — the rope-stretchers of the Nile (« شادّو الحبال »), in cubits
function gameC(canvas, hud) {
  const AB = 30;
  const AC = 40;
  const BC = 45;
  const bx = (AB * AB - AC * AC + BC * BC) / (2 * BC);
  const hA = Math.sqrt(AB * AB - bx * bx);
  const B = new THREE.Vector3(-BC / 2, 0, 12);
  const C = new THREE.Vector3(BC / 2, 0, 12);
  const A = new THREE.Vector3(-BC / 2 + bx, 0, 12 - hA);
  const S = stage(canvas, { shadow: 70, center: [0, 0, 0], fog: [400, 2600] });
  const silt = SILT();
  silt.repeat.set(120, 120);
  const plain = new THREE.Mesh(
    new THREE.PlaneGeometry(2000, 2000),
    new THREE.MeshStandardMaterial({ map: silt, roughness: 1 }),
  );
  plain.rotation.x = -Math.PI / 2;
  plain.receiveShadow = true;
  S.scene.add(plain);
  const water = new THREE.Mesh(
    new THREE.PlaneGeometry(2000, 60),
    new THREE.MeshPhysicalMaterial({ color: 0x2c6e8f, roughness: 0.08, clearcoat: 1 }),
  );
  water.rotation.x = -Math.PI / 2;
  water.position.set(0, 0.06, A.z - 48);
  S.scene.add(water);
  const shape = new THREE.Shape([
    new THREE.Vector2(A.x, -A.z),
    new THREE.Vector2(B.x, -B.z),
    new THREE.Vector2(C.x, -C.z),
  ]);
  const crops = CROPS();
  crops.repeat.set(0.05, 0.05);
  const field = new THREE.Mesh(
    new THREE.ShapeGeometry(shape),
    new THREE.MeshStandardMaterial({ map: crops, roughness: 0.9 }),
  );
  field.rotation.x = -Math.PI / 2;
  field.position.y = 0.03;
  field.receiveShadow = true;
  S.scene.add(field);
  const stakeMat = new THREE.MeshStandardMaterial({ color: 0x4a3018, roughness: 0.9 });
  [A, B, C].forEach((P) => {
    const s = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 1.6, 8), stakeMat);
    s.position.set(P.x, 0.8, P.z);
    s.castShadow = true;
    S.scene.add(s);
  });
  const knotMat = new THREE.MeshStandardMaterial({ color: 0x6b4520 });
  [
    [A, B],
    [A, C],
  ].forEach(([P, Q]) => {
    S.scene.add(tape([P.x, 0.35, P.z], [Q.x, 0.35, Q.z], 0.09, 0.09, 0xc89b5a));
    const len = P.distanceTo(Q);
    for (let d = 0; d <= len + 0.01; d += 6) {
      const k = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), knotMat);
      k.position.copy(P.clone().lerp(Q, d / len)).setY(0.35);
      S.scene.add(k);
    }
  });
  [
    ['A', A, [0, 2.4, -1]],
    ['B', B, [-1.5, 2.2, 1]],
    ['C', C, [1.5, 2.2, 1]],
  ].forEach(([t, P, o]) => {
    const l = label(t, { bg: '#2b1d0e' });
    l.position.set(P.x + o[0], o[1], P.z + o[2]);
    S.scene.add(l);
  });
  const bcLabel = label('BC = 45', { size: 0.04 });
  bcLabel.position.set(0, 1.2, 14.5);
  S.scene.add(bcLabel);
  for (let i = 0; i < 12; i++) {
    const p = palm(i + 40, 7 + hash(i, 5) * 5);
    p.position.set(-70 + i * 12 + hash(i, 3) * 5, 0, A.z - 12 - hash(i, 8) * 5);
    S.scene.add(p);
  }
  const canal = new THREE.Group();
  S.scene.add(canal);
  const Z = zero(S, 3.2);
  Z.group.position.set(A.x - 4, 0, A.z - 1.5);
  Z.group.rotation.y = Math.PI * 0.2;
  const tags = { M: new THREE.Group(), N: new THREE.Group() };
  Object.values(tags).forEach((t) => S.scene.add(t));

  hud.innerHTML = `
    <label>الوتد M على الحبل AB <input type="range" data-am min="6" max="24" step="6" value="18"><b data-amv></b></label>
    <label class="check"><input type="checkbox" data-tilt> حفر القناة مائلة</label>
    <div class="facts" data-facts></div>
    <div class="row ask"><span>طول القناة MN =</span><input type="number" data-guess placeholder="؟" step="0.1"><span>ذراعًا</span><button data-check>احفر</button></div>
    <div class="verdict" data-verdict></div>`;
  const $ = (s) => hud.querySelector(s);
  const state = { am: 18, tilt: false };
  function update() {
    const t = state.am / AB;
    const M = A.clone().lerp(B, t);
    const N = A.clone().lerp(C, Math.min(1, t + (state.tilt ? 0.15 : 0)));
    canal.clear();
    const c = tape([M.x, 0.05, M.z], [N.x, 0.05, N.z], 0.9, 0.04, 0x2c7fb0);
    c.material = new THREE.MeshPhysicalMaterial({ color: 0x2a7fb0, roughness: 0.1, clearcoat: 1 });
    canal.add(c);
    setLabel(tags.M, 'M', { bg: '#2f7fb5' });
    tags.M.position.set(M.x - 1.6, 1.8, M.z);
    setLabel(tags.N, 'N', { bg: '#2f7fb5' });
    tags.N.position.set(N.x + 1.6, 1.8, N.z);
    $('[data-amv]').textContent = `AM = ${state.am} ذراعًا`;
    $('[data-facts]').innerHTML =
      `<p>على الحبل: AM = ${state.am} · AB = 30 · AN = ${A.distanceTo(N).toFixed(1)} · AC = 40 (ذراعًا)</p>`;
    $('[data-verdict]').textContent = '';
    state.MN = M.distanceTo(N);
    S.render();
  }
  $('[data-am]').addEventListener('input', (e) => {
    state.am = +e.target.value;
    update();
  });
  $('[data-tilt]').addEventListener('change', (e) => {
    state.tilt = e.target.checked;
    update();
  });
  $('[data-check]').onclick = () => {
    const v = parseFloat($('[data-guess]').value);
    const out = $('[data-verdict]');
    if (!Number.isFinite(v)) return (out.textContent = 'اكتب طولًا.');
    const okC = Math.abs(v - state.MN) < 0.15 && !state.tilt;
    if (okC) Z.cheer();
    out.textContent =
      (Math.abs(v - state.MN) < 0.15
        ? `✓ جرى الماء من M إلى N تمامًا: ${state.MN.toFixed(1)} ذراعًا. `
        : `حفرت ${v} ذراعًا: ${v < state.MN ? `توقّف الماء قبل الضفّة بـ ${(state.MN - v).toFixed(1)}` : `فاض الماء خارج الحقل بـ ${(v - state.MN).toFixed(1)}`} ذراعًا. `) +
      (Math.abs(v - state.MN) < 0.15 ? (state.tilt ? '(قناة مائلة: الحقّان غير عادلين، لا تُحسب)' : progress.win('C')) : progress.lose());
  };
  S.setSun(42, -140);
  S.view([-30, 34, 52], [0, 0, 0]);
  update();
}

/** a flat strip of `width` along a smooth curve through `points` (the Nile, the fields, the path) */
function ribbon(points, width, mat, y) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  const N = 240;
  const pos = [];
  const idx = [];
  for (let i = 0; i <= N; i++) {
    const p = curve.getPoint(i / N);
    const tg = curve.getTangent(i / N);
    const nx = -tg.z;
    const nz = tg.x;
    const l = Math.hypot(nx, nz) || 1;
    pos.push(p.x + (nx / l) * width * 0.5, y, p.z + (nz / l) * width * 0.5);
    pos.push(p.x - (nx / l) * width * 0.5, y, p.z - (nz / l) * width * 0.5);
    if (i < N) idx.push(i * 2, i * 2 + 2, i * 2 + 1, i * 2 + 1, i * 2 + 2, i * 2 + 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, mat);
  m.material.side = THREE.DoubleSide;
  m.receiveShadow = true;
  return { mesh: m, curve };
}

// ───────────────────────────── the felucca: Zero's boat on the Nile
function felucca(S, scale = 1) {
  const g = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: 0x7a4f2a, roughness: 0.8 });
  const hullGeo = new THREE.BoxGeometry(2.4, 0.7, 5.6, 1, 1, 6);
  const p = hullGeo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const z = p.getZ(i);
    const k = 1 - Math.pow(Math.abs(z) / 2.8, 2.2) * 0.75; // narrow to the prow and the stern
    p.setX(i, p.getX(i) * k);
    if (p.getY(i) < 0) p.setX(i, p.getX(i) * 0.6);
    p.setY(i, p.getY(i) + Math.pow(Math.abs(z) / 2.8, 3) * 0.6);
  }
  hullGeo.computeVertexNormals();
  const hull = new THREE.Mesh(hullGeo, wood);
  hull.position.y = 0.3;
  hull.castShadow = true;
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 5.5, 8), wood);
  mast.position.set(0, 3.2, -0.6);
  const sailShape = new THREE.Shape([new THREE.Vector2(0, 0), new THREE.Vector2(3.6, 0.4), new THREE.Vector2(0.2, 5)]);
  const sail = new THREE.Mesh(
    new THREE.ShapeGeometry(sailShape),
    new THREE.MeshStandardMaterial({ color: 0xf4ead6, roughness: 0.9, side: THREE.DoubleSide }),
  );
  sail.position.set(0, 1.1, -0.6);
  sail.rotation.y = -Math.PI / 2 + 0.35;
  sail.castShadow = true;
  g.add(hull, mast, sail);
  const Z = zero(S, 0.8);
  S.scene.remove(Z.group);
  Z.group.position.set(0, 0.55, 1.2);
  g.add(Z.group);
  g.scale.setScalar(scale);
  S.scene.add(g);
  return { group: g, Z };
}

/** a Nile crocodile: low body, long snout, ridged back, yellow eyes — half under the water */
function crocodile() {
  const g = new THREE.Group();
  const skin = new THREE.MeshStandardMaterial({ color: 0x3d5228, roughness: 0.85 });
  const belly = new THREE.MeshStandardMaterial({ color: 0x6f7a45, roughness: 0.9 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.55, 3.6), skin);
  body.position.y = 0.05;
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.42, 1.2), skin);
  head.position.set(0, 0.08, 2.3);
  const snout = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.28, 1.5), belly);
  snout.position.set(0, 0.02, 3.5);
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.55, 3.4, 6), skin);
  tail.rotation.x = -Math.PI / 2;
  tail.position.set(0, 0.02, -3.4);
  g.add(body, head, snout, tail);
  for (let i = 0; i < 7; i++) {
    const r = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.22, 0.3), skin);
    r.position.set(i % 2 ? 0.3 : -0.3, 0.38, -1.4 + i * 0.45);
    g.add(r);
  }
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0xf2d02a, emissive: 0x4a3a00 });
  [-0.3, 0.3].forEach((x) => {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), eyeMat);
    e.position.set(x, 0.36, 2.0);
    g.add(e);
  });
  g.traverse((o) => o.isMesh && (o.castShadow = true));
  return g;
}

/** a number buoy */
function buoy(n) {
  const g = new THREE.Group();
  const m = new THREE.Mesh(
    new THREE.CylinderGeometry(0.9, 1.1, 1.6, 16),
    new THREE.MeshStandardMaterial({ color: 0xe8692c, roughness: 0.5 }),
  );
  m.position.y = 0.5;
  m.castShadow = true;
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.93, 0.93, 0.35, 16), new THREE.MeshStandardMaterial({ color: 0xffffff }));
  band.position.y = 0.6;
  const tag = label(String(n), { bg: '#0f2147', size: 0.07 });
  tag.position.y = 2.6;
  g.add(m, band, tag);
  return g;
}

// ───────────────────────────── W — the world map: five docks along the Nile, the boat between them
function gameW(canvas, hud) {
  const S = stage(canvas, { shadow: 320, center: [-150, 0, 0], fog: [600, 3200] });
  desert(S.scene, 620);
  const nilePts = [
    [-300, 0, 300],
    [-170, 0, 160],
    [-150, 0, 20],
    [-190, 0, -130],
    [-150, 0, -320],
  ];
  const nile = new THREE.CatmullRomCurve3(nilePts.map((p) => new THREE.Vector3(...p)));
  S.scene.add(ribbon(nilePts, 130, new THREE.MeshStandardMaterial({ map: CROPS(), roughness: 0.9, color: 0xe6ffc8 }), 0.05).mesh);
  S.scene.add(
    ribbon(nilePts, 46, new THREE.MeshPhysicalMaterial({ color: 0x2c6e8f, roughness: 0.08, clearcoat: 1 }), 0.12).mesh,
  );
  for (let i = 0; i < 30; i++) {
    const c = nile.getPoint(i / 29);
    const p = palm(i + 70, 8 + hash(i, 6) * 5);
    const side = i % 2 ? 1 : -1;
    p.position.set(c.x + side * (32 + hash(i, 2) * 22), 0, c.z + (hash(i, 3) - 0.5) * 20);
    S.scene.add(p);
  }
  const U = [0.08, 0.3, 0.5, 0.7, 0.9]; // the docks along the river
  const east = (u, d) => {
    const c = nile.getPoint(u);
    const t = nile.getTangent(u);
    const n = new THREE.Vector3(-t.z, 0, t.x).normalize();
    if (n.x < 0) n.negate();
    return c.clone().addScaledVector(n, d);
  };
  const last = east(U[4], 40);
  pyramid(S.scene, { base: 130, h: 82, courses: 36, x: last.x + 120, z: last.z - 40 });
  pyramid(S.scene, { base: 70, h: 44, courses: 20, x: last.x + 210, z: last.z + 70 });
  const ringMat = (c) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.6 });
  const plates = U.map((u, i) => {
    const g = new THREE.Group();
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(9, 10, 1.6, 32),
      new THREE.MeshStandardMaterial({ map: LIMESTONE(), roughness: 0.9 }),
    );
    base.position.y = 0.8;
    base.castShadow = base.receiveShadow = true;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(9.4, 0.5, 10, 48), ringMat(0x888888));
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 1.7;
    const tag = new THREE.Group();
    tag.position.y = 14;
    g.add(base, ring, tag);
    g.position.copy(east(u, 36));
    // the wooden jetty from the stage to the water
    const jetty = tape(east(u, 27).setY(0.5).toArray(), east(u, 16).setY(0.5).toArray(), 3, 0.3, 0x8a5a2b);
    S.scene.add(g, jetty);
    return { ring, tag, i };
  });
  const boat = felucca(S, 3);
  let sail = null;
  const place = (u) => {
    const p = nile.getPoint(u);
    const tg = nile.getTangent(u);
    boat.group.position.set(p.x + 8, 0.1, p.z);
    boat.group.rotation.y = Math.atan2(tg.x, tg.z);
  };
  place(U[0]);
  S.ticks.push((dt) => {
    boat.group.position.y = 0.1 + Math.sin(performance.now() / 500) * 0.15;
    if (!sail) return;
    sail.t = Math.min(1, sail.t + dt / 4);
    const e = sail.t < 0.5 ? 2 * sail.t * sail.t : 1 - (-2 * sail.t + 2) ** 2 / 2;
    place(U[sail.from] + (U[sail.to] - U[sail.from]) * e);
    boat.Z.speed = sail.t < 1 ? 4 : 0;
    if (sail.t >= 1) {
      sail = null;
      boat.Z.cheer();
    }
  });
  const paint = () => {
    plates.forEach(({ ring, tag, i }) => {
      const done = i < progress.current;
      const cur = i === progress.current && !progress.traveling;
      ring.material = ringMat(done ? 0xf5c542 : cur ? 0x37e0ff : 0x777777);
      setLabel(tag, `${done ? '⭐' : cur ? '▶' : '🔒'} ${i + 1} · ${STAGES[i].name}`, {
        bg: done ? 'rgba(160,110,10,.9)' : cur ? 'rgba(12,110,140,.92)' : 'rgba(40,40,48,.8)',
        size: 0.042,
      });
    });
    const st = STAGES[progress.current];
    const now = hud.querySelector('[data-now]');
    const go = hud.querySelector('[data-go]');
    if (progress.traveling) {
      now.innerHTML = `⛵ زيرو في القارب نحو المرحلة ${progress.current + 1}: <b>${st.name}</b> — أكمل الرحلة على النيل`;
      go.textContent = 'إلى الرحلة ⬇';
    } else if (st) {
      now.innerHTML = `المرحلة ${progress.current + 1} من ${STAGES.length}: <b>${st.name}</b>`;
      go.textContent = st.train ? 'أنجز التدريب (محاكاة)' : 'العب هذه المرحلة ⬇';
    } else {
      now.innerHTML = '<b>🏆 العالم مكتمل</b>';
      go.textContent = '—';
    }
    go.disabled = !st;
    S.render();
  };
  hud.innerHTML = `
    <div class="row"><span data-now></span></div>
    <div class="row"><button data-go></button><button data-reset>أعد العالم من البداية</button></div>
    <p class="note">كلّ مرحلة تحدٍّ على ضفّة النيل: الجواب الصحيح يعطي ⭐⭐⭐ ويفتح المرحلة التالية؛ الجواب الخاطئ يكلّف ❤️. بين مرحلتين يركب زيرو القارب: رحلة يحلّ فيها مسائل الأعداد ويتفادى التماسيح. في هذا النموذج المراحل 1 و2 و5 قابلة للّعب، والمرحلتان 3 و4 تدريب محاكًى.</p>`;
  hud.querySelector('[data-go]').onclick = () => {
    const st = STAGES[progress.current];
    if (!st) return;
    if (progress.traveling) document.querySelector('canvas[data-game="R"]').scrollIntoView({ behavior: 'smooth', block: 'center' });
    else if (st.train) progress.winTrain();
    else document.querySelector(`canvas[data-game="${st.game}"]`).scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  hud.querySelector('[data-reset]').onclick = () => progress.reset();
  let at = 0;
  progress.subs.push((kind) => {
    if (kind === 'arrive' && progress.current < U.length) {
      sail = { from: at, to: progress.current, t: 0 };
      at = progress.current;
    }
    if (kind === 'reset') {
      at = 0;
      sail = null;
      place(U[0]);
    }
    paint();
  });
  S.setSun(40, -120);
  S.view([140, 330, 420], [-150, 0, 0]);
  paint();
}

// ───────────────────────────── R — the trip on the Nile: steer the boat, take the right buoy, dodge the crocodiles
const QUESTIONS = (() => {
  const out = [];
  const R = [
    [3, 4],
    [2, 5],
    [3, 5],
    [4, 7],
    [5, 6],
    [2, 3],
    [3, 8],
  ];
  for (const [p, q] of R)
    for (const k of [2, 3, 4, 5]) {
      const ab = q * k;
      const am = p * k;
      const wrong = [...new Set([ab - p, am + q, p + k, q * k - am, am + 1].filter((x) => x > 0 && x !== am))];
      out.push({ text: `AM / AB = ${p}/${q}  و  AB = ${ab}  ⟸  AM = ؟`, right: am, wrong, fact: (x) => `${x}/${ab} ≠ ${p}/${q}` });
    }
  return out;
})();

function gameR(canvas, hud) {
  const S = stage(canvas, { shadow: 60, center: [0, 0, -20], fog: [90, 260] });
  S.controls.enabled = false;
  const W = 30; // the river's width
  const water = new THREE.Mesh(
    new THREE.PlaneGeometry(W, 600),
    new THREE.MeshPhysicalMaterial({ color: 0x2b6c8a, roughness: 0.12, clearcoat: 1 }),
  );
  water.rotation.x = -Math.PI / 2;
  water.position.set(0, 0, -200);
  water.receiveShadow = true;
  S.scene.add(water);
  [-1, 1].forEach((side) => {
    const silt = SILT();
    silt.repeat.set(4, 60);
    const bank = new THREE.Mesh(new THREE.BoxGeometry(60, 1.2, 600), new THREE.MeshStandardMaterial({ map: silt, roughness: 1 }));
    bank.position.set(side * (W / 2 + 30), 0.2, -200);
    bank.receiveShadow = true;
    S.scene.add(bank);
    const crops = CROPS();
    crops.repeat.set(2, 40);
    const field = new THREE.Mesh(new THREE.PlaneGeometry(40, 600), new THREE.MeshStandardMaterial({ map: crops }));
    field.rotation.x = -Math.PI / 2;
    field.position.set(side * (W / 2 + 34), 0.82, -200);
    S.scene.add(field);
  });
  const palms = [];
  for (let i = 0; i < 24; i++) {
    const p = palm(i + 90, 7 + hash(i, 4) * 4);
    p.position.set((i % 2 ? 1 : -1) * (W / 2 + 4 + hash(i, 5) * 6), 0.8, -i * 12);
    S.scene.add(p);
    palms.push(p);
  }
  const boat = felucca(S, 1);
  const LANES = [-8, 0, 8];
  const st = { lane: 1, x: 0, running: false, objs: [], spawn: 0, kind: 0, q: null, good: 0, shake: 0, practice: false };
  hud.innerHTML = `
    <div class="row"><b class="q" data-q>اضغط « ابدأ الرحلة »</b></div>
    <div class="row"><button data-start>ابدأ الرحلة</button><button data-left>◀ يسار</button><button data-right>يمين ▶</button><span data-score></span></div>
    <div class="verdict" data-msg></div>
    <p class="note">وجّه القارب بالأزرار أو بأسهم لوحة المفاتيح: خذ العوّامة التي تحمل الجواب الصحيح (+⭐) وتفادَ التماسيح (−❤️). أربعة أجوبة صحيحة توصلك إلى المرسى التالي.</p>`;
  const $ = (s) => hud.querySelector(s);
  const newQ = () => {
    st.q = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    $('[data-q]').textContent = st.q.text;
  };
  const say = (t) => ($('[data-msg]').textContent = t);
  const score = () => ($('[data-score]').textContent = `✓ ${st.good}/4`);
  const steer = (d) => (st.lane = Math.max(0, Math.min(2, st.lane + d)));
  $('[data-left]').onclick = () => steer(-1);
  $('[data-right]').onclick = () => steer(1);
  window.addEventListener('keydown', (e) => {
    if (!st.running) return;
    if (e.key === 'ArrowLeft') steer(-1), e.preventDefault();
    if (e.key === 'ArrowRight') steer(1), e.preventDefault();
  });
  $('[data-start]').onclick = () => {
    st.objs.forEach((o) => S.scene.remove(o.g));
    Object.assign(st, { objs: [], spawn: 0.5, kind: 0, good: 0, running: true, practice: !progress.traveling });
    newQ();
    score();
    say(st.practice ? 'رحلة تجريبية: لا مرحلة تنتظر في آخرها.' : `نحو المرحلة ${progress.current + 1}: « ${STAGES[progress.current].name} ».`);
    S.render();
  };
  const SPEED = 22;
  S.ticks.push((dt) => {
    st.x += (LANES[st.lane] - st.x) * (1 - Math.exp(-8 * dt));
    st.shake = Math.max(0, st.shake - dt);
    boat.group.position.set(st.x + (st.shake ? Math.sin(st.shake * 60) * 0.4 : 0), 0.15 + Math.sin(performance.now() / 400) * 0.12, 0);
    boat.group.rotation.set(0, Math.PI + (LANES[st.lane] - st.x) * -0.05, (LANES[st.lane] - st.x) * 0.04);
    S.camera.position.set(st.x * 0.4, 7.5, 15);
    S.camera.lookAt(st.x * 0.2, 1, -22);
    const mv = st.running ? SPEED * dt : 0;
    palms.forEach((p) => {
      p.position.z += mv;
      if (p.position.z > 30) p.position.z -= 288;
    });
    if (!st.running) return;
    st.spawn -= dt;
    if (st.spawn <= 0) {
      st.spawn = 2.4;
      if (st.kind % 2 === 0) {
        const lanes = [0, 1, 2].sort(() => Math.random() - 0.5).slice(0, 1 + (Math.random() < 0.5 ? 1 : 0));
        lanes.forEach((l) => {
          const g = crocodile();
          g.position.set(LANES[l], 0, -150);
          g.rotation.y = Math.PI + (Math.random() - 0.5) * 0.3;
          S.scene.add(g);
          st.objs.push({ g, lane: l, croc: true });
        });
      } else {
        const opts = [st.q.right, ...st.q.wrong.sort(() => Math.random() - 0.5).slice(0, 2)].sort(() => Math.random() - 0.5);
        opts.forEach((n, l) => {
          const g = buoy(n);
          g.position.set(LANES[l], 0, -150);
          S.scene.add(g);
          st.objs.push({ g, lane: l, n });
        });
      }
      st.kind += 1;
    }
    for (const o of st.objs) {
      o.g.position.z += mv;
      if (o.croc) o.g.rotation.y += Math.sin(performance.now() / 300 + o.lane) * 0.002;
      if (!o.done && o.g.position.z > -1.5) {
        o.done = true;
        if (o.lane !== st.lane) continue;
        if (o.croc) {
          st.shake = 0.6;
          say(`🐊 اصطدم القارب بتمساح. ${progress.lose()}`);
        } else if (o.n === st.q.right) {
          st.good += 1;
          progress.stars += 1;
          progress.emit('stars');
          boat.Z.cheer();
          say(`✓ ${o.n} — +⭐`);
          o.g.visible = false;
          score();
          if (st.good >= 4) {
            st.running = false;
            say(st.practice ? '⚓ انتهت الرحلة التجريبية.' : `⚓ وصلت إلى المرسى. ${progress.arrive()}`);
            $('[data-q]').textContent = 'وصلت.';
          } else newQ();
        } else say(`العوّامة ${o.n}: ${st.q.fact(o.n)}. السؤال باقٍ.`);
      }
    }
    st.objs = st.objs.filter((o) => {
      if (o.g.position.z > 25) {
        S.scene.remove(o.g);
        return false;
      }
      return true;
    });
  });
  S.setSun(46, -150);
  S.view([0, 7.5, 15], [0, 1, -22]);
}

/** the bar at the top of the page: hearts, stars, the stage */
function bar(el) {
  const paint = () => {
    el.innerHTML = `<span>${'❤️'.repeat(progress.hearts)}${'🤍'.repeat(3 - progress.hearts)}</span><span>⭐ ${progress.stars}</span><span>${progress.traveling ? '⛵ ' : ''}المرحلة ${Math.min(progress.current + 1, STAGES.length)}/${STAGES.length}</span>`;
  };
  progress.subs.push(paint);
  paint();
}

const GAMES = { A: gameA, B: gameB, C: gameC, W: gameW, R: gameR };
const start = () => {
  document.querySelectorAll('canvas[data-game]').forEach((c) => {
    try {
      GAMES[c.dataset.game](c, document.querySelector(`[data-hud="${c.dataset.game}"]`));
    } catch (e) {
      c.insertAdjacentHTML('afterend', `<p class="err">تعذّر رسم هذا المشهد: ${e.message}</p>`);
    }
  });
  document.querySelectorAll('[data-bar]').forEach(bar);
  window.__viewsReady = true;
};
(document.fonts?.ready ?? Promise.resolve()).then(start);
