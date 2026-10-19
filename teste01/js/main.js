import { THREE } from './core.js';
import { BIOMES, L, buildSegment } from './biomes.js';
import { T } from './core.js';
import { createRobot, spawnPattern, LANES } from './entities.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const $ = id => document.getElementById(id), host = $('scene');
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .95;
host.appendChild(renderer.domElement);
const scene = new THREE.Scene(); scene.background = new THREE.Color(BIOMES[0].bg); scene.fog = new THREE.FogExp2(BIOMES[0].bg, .028);
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), .04).texture;
const camera = new THREE.PerspectiveCamera(62, 1, .1, 170);
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), .5, .6, .9); composer.addPass(bloom); composer.addPass(new OutputPass());

const hemi = new THREE.HemisphereLight(0xcfe6ff, 0x1a1a1a, .5); scene.add(hemi);
const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(-6, 12, 6); key.target.position.set(0, 0, -4);
key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -.0004;
Object.assign(key.shadow.camera, { left: -12, right: 12, top: 14, bottom: -14, near: 1, far: 40 }); scene.add(key, key.target);
const accent = new THREE.PointLight(0xffffff, 45, 34, 2); accent.position.set(0, 5, -5); scene.add(accent);
const lamp = new THREE.SpotLight(0xffffff, 140, 48, .55, .7, 1.4); lamp.target.position.set(0, .5, -14); scene.add(lamp, lamp.target);

const rb = createRobot(); rb.root.position.z = 2.1; scene.add(rb.root);
const N = 15; let segs = [];
function buildAll(bi) { segs.forEach(s => scene.remove(s)); segs = []; for (let i = 0; i < N; i++) { const s = buildSegment(bi); s.position.z = 10 - i * L; scene.add(s); segs.push(s); } }
buildAll(0);

// partículas
const PN = 160, pp = new Float32Array(PN * 3), pc = new Float32Array(PN * 3), pv = new Float32Array(PN * 3), pl = new Float32Array(PN); let pi = 0;
const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3)); pg.setAttribute('color', new THREE.BufferAttribute(pc, 3));
const pts = new THREE.Points(pg, new THREE.PointsMaterial({ size: .16, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
pts.frustumCulled = false; scene.add(pts);
function burst(x, y, z, hex, n = 18) {
  const c = new THREE.Color(hex);
  for (let k = 0; k < n; k++) { const i = pi++ % PN; pp.set([x, y, z], i * 3); pv.set([(Math.random() - .5) * 5, Math.random() * 5, (Math.random() - .5) * 5], i * 3); pc.set([c.r, c.g, c.b], i * 3); pl[i] = .7; }
}

// áudio sintetizado
let ac; const beep = (f, d = .08, type = 'square', v = .04, f2) => {
  try { ac ??= new AudioContext(); const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + d); o.connect(g).connect(ac.destination); o.start(); o.stop(t + d); } catch { }
};

const S = { mode: 'idle', v: 4, dist: 0, energy: 0, lane: 1, y: 0, vy: 0, slide: 0, t: 0, biome: 0, combo: 0, comboT: 0, mag: 0, shield: 0, spawn: 1, dying: 0, shake: 0, lean: 0 };
let objs = [], gate = false, best = +(localStorage.getItem('roboRun3dBest') || 0), last = performance.now(), toastT, bannerT; const tmp = new THREE.Color();
$('best').textContent = String(best).padStart(5, '0');

function toast(t) { const e = $('toast'); e.textContent = t; e.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => e.classList.remove('show'), 900); }
function banner(b, tag) { $('bannerTag').textContent = tag; $('bannerName').textContent = b.name; $('bannerSub').textContent = b.sub; $('banner').classList.add('show'); clearTimeout(bannerT); bannerT = setTimeout(() => $('banner').classList.remove('show'), 3200); }
const add = o => { scene.add(o.g); objs.push(o); o.g.position.y = o.y0 ?? 0; };
function reset() {
  objs.forEach(o => scene.remove(o.g)); objs = [];
  Object.assign(S, { mode: 'run', v: 16, dist: 0, energy: 0, lane: 1, y: 0, vy: 0, slide: 0, biome: 0, combo: 0, mag: 0, shield: 0, spawn: .8, shake: 0 });
  buildAll(0); gate = false; rb.root.position.x = 0; rb.root.rotation.set(0, 0, 0);
  ['startScreen', 'pauseScreen', 'endScreen'].forEach(i => $(i).classList.add('hidden')); banner(BIOMES[0], 'SETOR 01');
}
function die() { S.mode = 'dying'; S.dying = .9; S.shake = 1; burst(rb.root.position.x, 1.3, 2.1, 0xff5a3a, 70); beep(180, .5, 'sawtooth', .08, 40); }
function finish() {
  S.mode = 'over'; best = Math.max(best, S.dist | 0); localStorage.setItem('roboRun3dBest', best); $('best').textContent = String(best).padStart(5, '0');
  $('finalDistance').textContent = S.dist | 0; $('finalEnergy').textContent = S.energy; $('finalBiome').textContent = BIOMES[S.biome].name; $('endScreen').classList.remove('hidden');
}
const run = () => S.mode === 'run';
function move(d) { if (run()) { const n = Math.max(0, Math.min(2, S.lane + d)); if (n !== S.lane) { S.lane = n; beep(520, .05, 'triangle', .03); } } }
function jump() { if (run() && S.y <= 0) { S.vy = 9.8; beep(300, .15, 'triangle', .05, 700); } }
function duck() { if (run()) { S.slide = .7; if (S.y > 0) S.vy = -17; beep(200, .12, 'sine', .05, 90); } }
function pause() {
  if (S.mode === 'run') { S.prev = 'run'; S.mode = 'paused'; } else if (S.mode === 'paused') { S.mode = 'run'; last = performance.now(); } else return;
  $('pauseScreen').classList.toggle('hidden', S.mode !== 'paused'); $('pause').textContent = S.mode === 'paused' ? '▶' : 'Ⅱ';
}
addEventListener('keydown', e => {
  const k = e.key.toLowerCase(); if (['arrowleft', 'arrowright', 'arrowup', 'arrowdown', ' '].includes(k)) e.preventDefault();
  if (k === 'arrowleft' || k === 'a') move(-1); if (k === 'arrowright' || k === 'd') move(1);
  if (k === 'arrowup' || k === 'w' || k === ' ') jump(); if (k === 'arrowdown' || k === 's') duck(); if (k === 'p' || k === 'escape') pause();
});
let td = null; const cv = renderer.domElement;
cv.addEventListener('pointerdown', e => td = { x: e.clientX, y: e.clientY });
cv.addEventListener('pointerup', e => {
  if (!td) return; const dx = e.clientX - td.x, dy = e.clientY - td.y; td = null;
  if (Math.max(Math.abs(dx), Math.abs(dy)) > 18) { if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 1 : -1); else if (dy < 0) jump(); else duck(); }
  else { const w = cv.clientWidth, x = e.offsetX; if (x < w * .35) move(-1); else if (x > w * .65) move(1); else jump(); }
});
$('start').onclick = $('again').onclick = reset; $('pause').onclick = $('resume').onclick = pause;
function resize() { const w = host.clientWidth, h = host.clientHeight; renderer.setSize(w, h, false); composer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); }
new ResizeObserver(resize).observe(host); resize();

function hit(o, dx, dz) {
  const k = o.kind, z = o.g.position.z, x = o.g.position.x;
  if (k === 'block') return dz < 1 && Math.abs(x - rb.root.position.x) < 1.05;
  if (k === 'low') return dz < .6 && Math.abs(x - rb.root.position.x) < 1 && S.y < .75;
  if (k === 'high') return dz < .6 && Math.abs(x - rb.root.position.x) < 1 && S.slide <= 0;
  if (k === 'mover') return dz < .9 && Math.abs(x - rb.root.position.x) < 1.1 && S.y < .7;
}
function update(dt) {
  S.t += dt;
  if (run()) { S.v = Math.min(34, S.v + dt * .16); S.dist += S.v * dt * .5; }
  else if (S.mode === 'dying') { S.v = Math.max(0, S.v - dt * 30); if ((S.dying -= dt) <= 0) finish(); }
  else if (S.mode === 'idle' || S.mode === 'over') S.v = 4;
  const v = S.v, rx = rb.root.position.x, bt = BIOMES[S.biome];
  const nb = Math.floor(S.dist / 500) % BIOMES.length;
  if (run() && nb !== S.biome) { S.biome = nb; gate = true; banner(BIOMES[nb], 'SETOR 0' + (nb + 1)); beep(440, .5, 'sine', .05, 880); }
  // transição suave de ambiente
  const k = Math.min(1, dt * 1.2); scene.fog.color.lerp(tmp.set(bt.bg), k); scene.background.copy(scene.fog.color); scene.fog.density += (bt.fog - scene.fog.density) * k;
  accent.color.lerp(tmp.set(bt.light), k); lamp.color.lerp(tmp.set(bt.light), k); hemi.intensity += (bt.hemi - hemi.intensity) * k;
  // corredor infinito
  for (let i = 0; i < segs.length; i++) {
    const s = segs[i]; s.position.z += v * dt;
    for (const a of s.userData.arms) { a.p.rotation.y = Math.sin(S.t * 1.3 + a.ph) * .7; a.e.rotation.z = Math.sin(S.t * 1.9 + a.ph) * .35; }
    if (s.position.z > 15) { const z = s.position.z - N * L; scene.remove(s); const n = buildSegment(S.biome, gate); gate = false; n.position.z = z; scene.add(n); segs[i] = n; }
  }
  T.belt.offset.y += dt * .5;
  // geração e entidades
  if (run() && (S.spawn -= dt) <= 0) { spawnPattern(bt.type, -105, v, add); S.spawn = (22 + Math.random() * 12) / v; }
  if (S.comboT > 0 && (S.comboT -= dt) <= 0) { S.combo = 0; $('combo').textContent = ''; }
  if (S.mag > 0) S.mag -= dt; if (S.shield > 0 && run()) S.shield -= dt;
  const mult = 1 + Math.min(4, S.combo / 8 | 0);
  for (const o of objs) {
    const g = o.g; g.position.z += v * dt; o.upd?.(S.t);
    if (o.kind === 'coin' || o.kind === 'mag' || o.kind === 'shield') {
      g.position.y = o.y0 + Math.sin(S.t * 4 + g.position.x) * .08;
      if (S.mag > 0 && o.kind === 'coin' && g.position.z > -9 && g.position.z < 4) { g.position.x += (rx - g.position.x) * dt * 9; g.position.z += (2.1 - g.position.z) * dt * 3; }
      if (run() && !o.done && Math.abs(g.position.z - 2.1) < 1 && Math.abs(g.position.x - rx) < 1 && Math.abs(g.position.y - (S.y + 1.2)) < 1.3) {
        o.done = true; g.visible = false;
        if (o.kind === 'coin') { S.energy += mult; S.combo++; S.comboT = 2.5; beep(900 + Math.min(S.combo, 20) * 40, .07, 'sine', .04); burst(g.position.x, g.position.y, 2.1, 0xffc23a, 8); if (mult > 1) $('combo').textContent = 'x' + mult + ' COMBO'; }
        else { S[o.kind] = 8; toast(o.kind === 'mag' ? 'ÍMÃ DE ENERGIA' : 'ESCUDO ATIVO'); beep(500, .35, 'sine', .05, 1200); burst(g.position.x, g.position.y, 2.1, 0x40ffe0, 30); }
      }
    } else if (run() && !o.done) {
      const dz = Math.abs(g.position.z - 2.1);
      if (hit(o, 0, dz)) {
        if (S.shield > 0) { S.shield = 0; o.done = true; g.visible = false; S.shake = .6; burst(g.position.x, 1.2, 2.1, 0x40e8ff, 40); toast('ESCUDO ROMPIDO'); beep(150, .3, 'sawtooth', .06, 60); } else die();
      } else if (!o.near && g.position.z > 3.3) { o.near = true; if (Math.abs(g.position.x - rx) < 2.5 && o.kind !== 'block' || Math.abs(g.position.x - rx) > 1.3 && Math.abs(g.position.x - rx) < 2.5) { S.energy += 2; toast('PASSOU RENTE +2'); } }
    }
  }
  objs = objs.filter(o => { const gone = o.g.position.z > 8 || o.done && !o.g.visible; if (gone) scene.remove(o.g); return !gone; });
  // física do robô
  rb.root.position.x += (LANES[S.lane] - rx) * Math.min(1, dt * 11);
  if (S.y > 0 || S.vy > 0) { S.y += S.vy * dt; S.vy -= 26 * dt; if (S.y <= 0) { S.y = 0; S.vy = 0; if (run()) burst(rx, .1, 2.1, 0xcccccc, 6); } }
  if (S.slide > 0) S.slide -= dt;
  const sl = S.slide > 0 && S.mode !== 'dying', ph = S.t * (9 + v * .25), sn = Math.sin(ph), air = S.y > 0;
  rb.root.position.y = S.y; rb.root.rotation.z = (LANES[S.lane] - rx) * -.04; rb.root.rotation.y = (LANES[S.lane] - rx) * .06;
  const moving = S.mode !== 'idle' && S.mode !== 'over';
  rb.body.scale.y += ((sl ? .55 : 1) - rb.body.scale.y) * Math.min(1, dt * 20); rb.body.rotation.x += ((sl ? .5 : moving ? .12 : 0) - rb.body.rotation.x) * Math.min(1, dt * 12);
  rb.body.position.y = moving && !air ? Math.abs(sn) * .07 : 0;
  rb.legs.forEach((l, i) => { const s = i ? -sn : sn, a = moving ? (air ? .9 * (i ? -1 : 1) : s * .95) : 0; l.hip.rotation.x = a; l.knee.rotation.x = moving ? (air ? 1 : Math.max(0, -Math.cos(ph + (i ? Math.PI : 0))) * 1.2) : 0; });
  rb.arms.forEach((a, i) => { const s = i ? sn : -sn; a.sh.rotation.x = moving ? (air ? -1.1 : s * .8) : 0; a.el.rotation.x = moving ? -1 : 0; });
  rb.shield.visible = S.shield > 0 && (S.shield > 2 || Math.sin(S.t * 25) > 0); rb.shield.rotation.y = S.t;
  if (S.mode === 'dying') { rb.root.rotation.x -= dt * 2.2; }
  // câmera
  S.shake = Math.max(0, S.shake - dt * 2.5);
  camera.position.set(rb.root.position.x * .4 + (Math.random() - .5) * S.shake * .5, 4.3 + S.y * .3 + (Math.random() - .5) * S.shake * .5, 9.6);
  camera.fov += (62 + (v - 16) * .35 - camera.fov) * dt * 3; camera.updateProjectionMatrix();
  camera.lookAt(rb.root.position.x * .25, 1.5, -8);
  lamp.position.set(rb.root.position.x, 2.4 + S.y, 2.6); lamp.target.position.set(rb.root.position.x * .5, .4, -14);
  bloom.strength = bt.type === 'lab' ? .22 : .5;
  for (let i = 0; i < PN; i++) { if (pl[i] > 0) { pl[i] -= dt; pp[i * 3] += pv[i * 3] * dt; pp[i * 3 + 1] += pv[i * 3 + 1] * dt; pv[i * 3 + 1] -= 9 * dt; pp[i * 3 + 2] += (pv[i * 3 + 2] + v) * dt; } else pp[i * 3 + 1] = -50; }
  pg.attributes.position.needsUpdate = true; pg.attributes.color.needsUpdate = true;
  // HUD
  $('distance').textContent = String(S.dist | 0).padStart(5, '0'); $('energy').textContent = S.energy; $('speed').textContent = Math.round(v * 3.2) + ' KM/H';
  $('powers').innerHTML = (S.mag > 0 ? `<span>ÍMÃ ${Math.ceil(S.mag)}s</span>` : '') + (S.shield > 0 ? `<span>ESCUDO ${Math.ceil(S.shield)}s</span>` : '');
}
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min((now - last) / 1000 || 0, .035); last = now;
  if (S.mode === 'paused') return;
  update(dt); composer.render();
}
requestAnimationFrame(frame);
