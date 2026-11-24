/**
 * PREVIEW page (development builds only, `/__qa/gate-river`): the kit's gate run (`kit/GateRun.js`) with the felucca's
 * options (`nilePyramids/riverMeshes.js › riverRun()`, kit work K-b) mounted ALONE — no world, no lesson — so the river
 * skin and the crocodiles can be looked at before the world « الأهرامات » passes them. The host below is the least the run
 * needs: a renderer, a sky colour and a sun, Zero, the keys ← → and Space, and a placeholder course of four buoys.
 */
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import * as THREE from 'three';
import { GateRun } from '../../lessons/common/gameworld/kit/GateRun';
import GateRunHud from '../../lessons/common/gameworld/kit/GateRunHud';
import { makeRobot } from '../../lessons/common/gameworld/engine/robot';
import { Particles } from '../../lessons/common/gameworld/engine/builders';
import { riverRun } from '../../lessons/common/gameworld/nilePyramids/riverMeshes';
import '../../lessons/common/gameworld/kit/styles';

const pick = (random, list) => list[Math.floor(random() * list.length)];
/** A placeholder buoy: AM / AB = AN / AC with whole numbers (the world's own legs replace it). */
function round(level, random) {
  for (;;) {
    const p = pick(random, [2, 3, 4, 5]);
    const q = p + pick(random, [2, 3, 4, 5]);
    const m = pick(random, [2, 3, 4, 6]);
    const AM = p * m;
    const AB = q * m;
    const AN = p * pick(random, [3, 5, 7]);
    const opts = [(AB * AN) / AM, (AN * (AB - AM)) / AM, (AM * AN) / AB];
    if (new Set(opts).size < 3 || !opts.every((v) => Number.isInteger(v))) continue;
    const order = [0, 1, 2].sort(() => random() - 0.5);
    return {
      ask: '',
      tex: `AM = ${AM},\\ AB = ${AB},\\ AN = ${AN} \\Rightarrow AC = ?`,
      options: order.map((k) => ({ t: String(opts[k]) })),
      right: order.indexOf(0),
      why: order.map((k) => (k === 0 ? '' : `$\\dfrac{${AM}}{${AB}} = \\dfrac{${AN}}{AC}$`)),
    };
  }
}
const LEG = {
  levels: [{ name: 'النيل', from: '' }],
  gates: 4,
  total: 4,
  round,
  text: {
    title: 'رحلة على النيل',
    say: 'أربع عوّامات قبل المرسى التالي.',
    rule: 'خذ العوّامة التي تحمل الطول الصحيح، وتفادَ التماسيح.',
    start: 'أبحر',
    again: 'أعد الرحلة من المرسى',
    leave: 'إلى المرسى',
    order: 'المطلوب',
    gate: 'العوّامة',
    of: 'من',
    left: 'يسارًا',
    right: 'يمينًا',
    pause: 'توقّف',
    resume: 'واصل',
    quit: 'عُد إلى المرسى',
    pausedTitle: 'القارب متوقّف',
    pausedText: 'واصل متى شئت.',
    bump: '🐊 تمساح! −1 ❤️',
    won: { title: 'وصلت إلى المرسى', text: 'أربع عوّامات صحيحة.' },
    lost: { title: 'نفدت القلوب', text: 'تعيد الرحلة من المرسى.' },
  },
};
const KEYS = { ArrowLeft: 'left', ArrowRight: 'right', Space: 'jump' };

/** The least of a world the run needs (`kit/GateRun.js` header): its scene, its robot, its keys, its state. */
function makeHost(canvas, onState) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa9c4dd);
  scene.fog = new THREE.Fog(0xd9c9a8, 90, 260);
  scene.add(new THREE.HemisphereLight(0xdfeeff, 0x8a6f48, 1.1));
  const sun = new THREE.DirectionalLight(0xfff0d6, 2.6);
  sun.position.set(30, 40, 20);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 140 });
  scene.add(sun, sun.target);
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1200);
  const keys = new Set();
  const particles = new Particles(400);
  scene.add(particles.points);
  const robot = makeRobot();
  robot.group.traverse((o) => o.isMesh && (o.castShadow = true));
  scene.add(robot.group);
  const host = {
    scene,
    camera,
    canvas,
    robot,
    particles,
    hero: { pos: new THREE.Vector3(), vel: new THREE.Vector3(), yaw: 0 },
    audio: { unlock() {}, startMusic() {}, play() {}, fast: false },
    input: { clear: () => keys.clear(), take: (k) => keys.delete(k) },
    shake: 0,
    state: { run: null },
    set(patch) {
      host.state = { ...host.state, ...patch };
      onState(host.state);
    },
    startRun: () => host.gateRun.start(),
    leaveRun: () => host.gateRun.open(LEG),
    pauseRun: (on) => host.gateRun.pause(on),
    runLane: (d) => host.gateRun.lane(d),
  };
  host.gateRun = new GateRun(host, { x: 0, y: 0, z: 0, ...riverRun() });
  host.gateRun.build();
  host.gateRun.open(LEG);
  if (import.meta.env.DEV) window.__world = host;
  const onKey = (e) => {
    if (KEYS[e.code]) {
      keys.add(KEYS[e.code]);
      e.preventDefault();
    }
  };
  window.addEventListener('keydown', onKey);
  const camPos = new THREE.Vector3(-10, 6, 0);
  const camLook = new THREE.Vector3(12, 1, 0);
  let last = performance.now();
  let raf = 0;
  const frame = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== Math.floor(w * renderer.getPixelRatio())) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    host.gateRun.step(dt);
    const pose = host.gateRun.pose() ?? { lift: 0, speed: 0, sad: false };
    robot.group.position.copy(host.hero.pos);
    robot.group.rotation.y = host.hero.yaw;
    robot.update(dt, { speed: pose.speed, sad: pose.sad });
    particles.update(dt);
    const shot = host.gateRun.camera();
    const k = 1 - Math.exp(-shot.k * dt);
    camPos.lerp(shot.pos, k);
    camLook.lerp(shot.look, k);
    host.shake = Math.max(0, host.shake - dt);
    camera.position.copy(camPos).add(new THREE.Vector3(0, Math.sin(now / 30) * host.shake * 0.3, 0));
    camera.lookAt(camLook);
    camera.updateMatrixWorld();
    host.gateRun.place();
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  host.dispose = () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('keydown', onKey);
    host.gateRun.dispose();
    renderer.dispose();
    if (window.__world === host) delete window.__world;
  };
  return host;
}

export default function GateRiverPreview() {
  const canvas = useRef(null);
  const [host, setHost] = useState(null);
  const [state, setState] = useState({ run: null });
  useEffect(() => {
    const h = makeHost(canvas.current, setState);
    setHost(h);
    setState(h.state);
    return () => h.dispose();
  }, []);
  // over the page's own bars, as `kit/LessonWorld.jsx` mounts a world
  return createPortal(
    <div className="di-root" dir="rtl" data-qa="gate-river">
      <canvas ref={canvas} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      {host && state.run && <GateRunHud run={state.run} game={host} content={LEG} />}
    </div>,
    document.body,
  );
}
