// Robô, obstáculos, coletáveis e padrões de geração de pista
import { THREE, B, C, M, glow, T } from './core.js';
import { rackMat, cardboard } from './biomes.js';
export const LANES = [-2.2, 0, 2.2];

export function createRobot() {
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const shell = M(0xe9ecef, { metalness: .35, roughness: .3 }), dark = M(0x1b2026, { metalness: .8, roughness: .3 }),
    orange = M(0xff7a1a, { metalness: .4, roughness: .35 }), metal = M(0x9aa6ae, { metalness: .9, roughness: .25 }), eye = glow(0x45f5ff, 4);
  B(body, shell, [.9, .85, .5], [0, 1.5, 0], true); B(body, dark, [.7, .5, .52], [0, 1.52, .02], true);
  B(body, eye, [.34, .06, .02], [0, 1.56, .28]); B(body, orange, [.92, .16, .52], [0, 1.1, 0], true);
  B(body, orange, [.3, .5, .12], [0, 1.55, -.3], true);                       // mochila de bateria
  C(body, metal, .08, .16, [0, 1.95, 0]);
  B(body, shell, [.54, .46, .46], [0, 2.2, 0], true); B(body, dark, [.44, .26, .1], [0, 2.22, .2]);
  B(body, eye, [.3, .07, .02], [0, 2.24, .26]); B(body, orange, [.04, .3, .04], [.16, 2.55, 0]);
  const legs = [], arms = [];
  for (const x of [-.24, .24]) {
    const hip = new THREE.Group(); hip.position.set(x, 1.05, 0); body.add(hip);
    B(hip, shell, [.24, .5, .26], [0, -.25, 0], true);
    const knee = new THREE.Group(); knee.position.y = -.5; hip.add(knee);
    C(knee, dark, .11, .26, [0, 0, 0], [0, 0, Math.PI / 2]);
    B(knee, dark, [.2, .5, .22], [0, -.25, 0], true); B(knee, orange, [.28, .12, .42], [0, -.52, .08], true);
    legs.push({ hip, knee });
  }
  for (const x of [-.58, .58]) {
    const sh = new THREE.Group(); sh.position.set(x, 1.85, 0); body.add(sh);
    C(sh, dark, .13, .24, [0, 0, 0], [0, 0, Math.PI / 2]);
    B(sh, metal, [.18, .5, .2], [0, -.25, 0], true);
    const el = new THREE.Group(); el.position.y = -.5; sh.add(el);
    B(el, shell, [.2, .45, .22], [0, -.2, 0], true); B(el, dark, [.18, .16, .2], [0, -.46, .02], true);
    arms.push({ sh, el });
  }
  const shield = new THREE.Mesh(new THREE.SphereGeometry(1.5, 24, 16),
    new THREE.MeshBasicMaterial({ color: 0x40e8ff, transparent: true, opacity: .16, depthWrite: false }));
  shield.position.y = 1.3; shield.visible = false; root.add(shield);
  return { root, body, legs, arms, shield };
}

const hazard = M(0xbbbbbb, { map: T.hazard, metalness: .3, roughness: .6 });
const red = glow(0xff2a20, 4), dark = M(0x14181c, { metalness: .8, roughness: .35 }), metal = M(0x8a96a0, { metalness: .9, roughness: .28 });
const blockMat = { fab: M(0xd9731a, { metalness: .5, roughness: .45 }), dc: rackMat, wh: cardboard[0], lab: M(0xdfe5e8, { metalness: .3, roughness: .35 }) };

function make(kind, type, x, z) {
  const g = new THREE.Group(); g.position.set(x, 0, z);
  const o = { g, kind, done: false, near: false };
  if (kind === 'block') {
    B(g, blockMat[type], [1.8, 2.3, 1.6], [0, 1.15, 0], true); B(g, dark, [1.86, .14, 1.66], [0, .1, 0], true);
    B(g, dark, [1.86, .14, 1.66], [0, 2.25, 0], true); B(g, red, [.14, .14, .04], [.6, 2.0, .82]);
    if (type !== 'dc') B(g, hazard, [1.8, .3, 1.62], [0, .5, 0]);
  } else if (kind === 'low') {
    for (const dx of [-.85, .85]) B(g, metal, [.14, .9, .3], [dx, .45, 0], true);
    B(g, hazard, [1.8, .45, .3], [0, .65, 0], true);
  } else if (kind === 'high') {
    for (const dx of [-1, 1]) B(g, dark, [.22, 2.5, .34], [dx, 1.25, 0], true);
    B(g, dark, [2.2, .3, .34], [0, 2.4, 0], true); B(g, red, [1.9, .1, .1], [0, 1.6, 0]);
    o.light = new THREE.PointLight(0xff3020, 6, 6, 2); o.light.position.set(0, 1.6, .6); g.add(o.light);
  } else if (kind === 'mover') {
    B(g, dark, [1.4, .45, 1.7], [0, .4, 0], true); B(g, M(0xff7a1a, { metalness: .4, roughness: .35 }), [1.2, .3, 1.5], [0, .75, 0], true);
    B(g, red, [.18, .16, .18], [0, 1, .4]); for (const dx of [-.55, .55]) C(g, dark, .2, .2, [dx, .2, .55], [0, 0, Math.PI / 2]);
    o.ph = Math.random() * 6; o.upd = (t) => { g.position.x = 2.2 * Math.sin(t * 1.5 + o.ph); };
  } else if (kind === 'coin') {
    const gold = glow(0xffc23a, 2.2);
    g.add(new THREE.Mesh(new THREE.TorusGeometry(.3, .08, 10, 24), gold)); g.add(new THREE.Mesh(new THREE.OctahedronGeometry(.16), gold));
    o.y0 = 1.1; o.upd = (t) => { g.rotation.y = t * 3; };
  } else {
    const col = kind === 'mag' ? 0x4a8bff : 0x40ffe0;
    g.add(new THREE.Mesh(kind === 'mag' ? new THREE.TorusGeometry(.32, .11, 10, 20, Math.PI * 1.4) : new THREE.IcosahedronGeometry(.4), glow(col, 3)));
    o.y0 = 1.3; o.upd = (t) => { g.rotation.y = t * 2; };
  }
  return o;
}

const pick = a => a[Math.random() * a.length | 0], lane = () => Math.random() * 3 | 0;
export function spawnPattern(type, z, speed, add) {
  const a = lane(), r = Math.random(), coins = (l, n, y = 1.1, z0 = z, arc = 0) => {
    for (let i = 0; i < n; i++) { const c = make('coin', type, LANES[l], z0 - i * 2.2); c.y0 = y + arc * Math.sin(i / (n - 1) * Math.PI); add(c); }
  };
  if (r < .22) coins(a, 6 + (Math.random() * 4 | 0));
  else if (r < .4) { add(make('block', type, LANES[a], z)); const b = (a + 1 + lane() % 2) % 3; coins(b, 5); }
  else if (r < .55) { const b = (a + 1 + (Math.random() * 2 | 0)) % 3, free = 3 - a - b; add(make('block', type, LANES[a], z)); add(make('block', type, LANES[b], z)); coins(free, 5); }
  else if (r < .72) { for (let l = 0; l < 3; l++) add(make('low', type, LANES[l], z)); coins(a, 5, 1.0, z + 3, 1.7); }
  else if (r < .86) { add(make('high', type, LANES[a], z)); add(make('block', type, LANES[(a + 1) % 3], z)); coins(a, 4, 1.0, z + 4); }
  else if (r < .94 || speed < 20) { add(make('mover', type, 0, z)); coins(a, 4, 1.1, z - 6); }
  else add(make(pick(['mag', 'shield']), type, LANES[a], z));
  if (Math.random() < .18) add(make(pick(['mag', 'shield']), type, LANES[lane()], z - 14));
}
