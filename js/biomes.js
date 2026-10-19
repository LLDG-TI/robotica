// Cenários: cada bioma monta segmentos de corredor de 10 m com props de robótica
import { THREE, B, C, M, glow, T } from './core.js';
export const L = 10;
export const BIOMES = [
  { type: 'fab', name: 'FÁBRICA DE MONTAGEM', sub: 'Linha 04 · braços robóticos em operação', bg: 0x12161b, fog: .028, wall: 0x4b555d, floor: 0x383d42, trim: 0xffa21a, light: 0xffb25a, hemi: .55 },
  { type: 'dc', name: 'DATA CENTER', sub: 'Sala fria · racks de servidores', bg: 0x050a12, fog: .032, wall: 0x232d3a, floor: 0x1b222c, trim: 0x3aa8ff, light: 0x4aa3ff, hemi: .35 },
  { type: 'wh', name: 'ARMAZÉM AUTÔNOMO', sub: 'Logística · robôs AGV em circulação', bg: 0x15120e, fog: .025, wall: 0x5a5245, floor: 0x45403a, trim: 0xffd23a, light: 0xffd9a0, hemi: .6 },
  { type: 'lab', name: 'LABORATÓRIO DE IA', sub: 'Sala limpa · bancadas de pesquisa', bg: 0x6f8389, fog: .016, wall: 0xc1cbcf, floor: 0x8b979c, trim: 0x40ffe0, light: 0xd8fff8, hemi: 1.5 },
];
const mats = BIOMES.map(b => ({
  wall: M(b.wall, { map: T.panel, metalness: .45, roughness: .55 }),
  floor: M(b.floor, { map: T.floor, metalness: .2, roughness: .6 }),
  trim: glow(b.trim, 2.8),
  lamp: glow(b.light, b.type === 'lab' ? 2.4 : 1.5),
  dark: M(0x14181c, { metalness: .8, roughness: .35 }),
  metal: M(0x8a96a0, { metalness: .9, roughness: .28 }),
  accent: M(b.trim, { metalness: .4, roughness: .4 }),
}));
export const rackMat = M(0x8a8a8a, { map: T.led, emissiveMap: T.led, emissive: 0xffffff, emissiveIntensity: 1.1, metalness: .6, roughness: .4 });
export const cardboard = [0xb08a5a, 0x9c7a4c, 0xc29a66].map(c => M(c, { roughness: .88, metalness: 0 }));
const beltMat = M(0x9a9a9a, { map: T.belt, metalness: .3, roughness: .7 });
const glass = new THREE.MeshPhysicalMaterial({ color: 0xaee8ff, transparent: true, opacity: .16, roughness: .05, metalness: 0 });
const white = M(0xe6eaec, { metalness: .2, roughness: .35 });

function arm(g, m, s, x, z, sc) {
  C(g, m.dark, .5 * sc, .5 * sc, [x, .25 * sc, z]);
  const pv = new THREE.Group(); pv.position.set(x, .5 * sc, z); g.add(pv);
  B(pv, m.accent, [.3 * sc, 1.8 * sc, .3 * sc], [0, .95 * sc, 0], true);
  const el = new THREE.Group(); el.position.set(0, 1.85 * sc, 0); pv.add(el);
  C(el, m.dark, .22 * sc, .36 * sc, [0, 0, 0], [Math.PI / 2, 0, 0]);
  B(el, m.metal, [1.7 * sc, .22 * sc, .22 * sc], [-s * .85 * sc, 0, 0], true);
  B(el, m.dark, [.18 * sc, .5 * sc, .3 * sc], [-s * 1.7 * sc, -.2 * sc, 0], true);
  g.userData.arms.push({ p: pv, e: el, ph: Math.random() * 6 });
}

export function buildSegment(bi, gate = false) {
  const b = BIOMES[bi], m = mats[bi], g = new THREE.Group(); g.userData.arms = [];
  B(g, m.floor, [14.6, .4, L], [0, -.2, 0]);
  B(g, m.dark, [14.6, .4, L], [0, 6.6, 0]);
  for (const x of [-1.1, 1.1, -3.3, 3.3]) B(g, m.trim, [.06, .02, L], [x, .005, 0]);
  for (const x of [-2.4, 2.4]) B(g, m.lamp, [1.1, .08, 3.2], [x, 6.36, 0]);
  for (const s of [-1, 1]) {
    B(g, m.wall, [.6, 6.4, L], [s * 7.2, 3.2, 0]);
    B(g, m.trim, [.06, .12, L], [s * 6.88, 1.1, 0]);
    B(g, m.trim, [.06, .1, L], [s * 6.88, 5.7, 0]);
    B(g, m.dark, [.5, 6.4, .5], [s * 6.9, 3.2, 4.75]);
    if (b.type === 'fab') {
      B(g, beltMat, [.9, .5, L], [s * 5.2, .25, 0]); g.userData.belt = true;
      B(g, m.dark, [.12, .62, L], [s * 4.7, .31, 0]);
      for (let k = 0; k < 2; k++) B(g, cardboard[k], [.6, .45, .6], [s * 5.2, .72, -3 + Math.random() * 6], true);
      B(g, m.metal, [.3, .3, L], [s * 4.2, 5.5, 0]);
      arm(g, m, s, s * 6.3, -2.2, 1); arm(g, m, s, s * 6.3, 2.6, .8);
    } else if (b.type === 'dc') {
      for (let k = 0; k < 3; k++) B(g, rackMat, [1.15, 3.3, 1.05], [s * 6.2, 1.65, -3.4 + k * 3.3], true);
      B(g, m.dark, [1.4, .15, L], [s * 4.2, 5.8, 0]);
      for (let k = 0; k < 3; k++) B(g, m.trim, [.05, 3, .05], [s * 5.55, 1.7, -2 + k * 3.3]);
    } else if (b.type === 'wh') {
      for (const y of [.9, 2.3, 3.7]) {
        B(g, m.metal, [1.25, .08, L - .4], [s * 6.2, y, 0]);
        for (let k = 0; k < 4; k++) B(g, cardboard[(Math.random() * 3) | 0], [.95, .5 + Math.random() * .35, 1.5], [s * 6.2, y + .35, -3.6 + k * 2.4], true);
      }
      for (const z of [-4.8, -.1, 4.6]) B(g, m.accent, [.14, 4.6, .14], [s * 5.55, 2.3, z]);
      B(g, m.trim, [.1, .02, L], [s * 4.6, .01, 0]);
    } else {
      B(g, glass, [.08, 3.4, L], [s * 6.35, 1.9, 0]);
      for (const z of [-4.9, 0, 4.9]) B(g, m.metal, [.12, 3.4, .12], [s * 6.35, 1.9, z]);
      B(g, white, [1.1, .9, L - 1], [s * 5.7, .45, 0], true);
      B(g, m.dark, [1.12, .06, L - 1], [s * 5.7, .92, 0]);
      arm(g, m, s, s * 5.7, 0, .45);
    }
  }
  if (gate) {
    for (const s of [-1, 1]) B(g, m.trim, [.35, 6.2, .35], [s * 6.5, 3.1, 0]);
    B(g, m.trim, [13.4, .35, .35], [0, 6.1, 0]);
  }
  return g;
}
