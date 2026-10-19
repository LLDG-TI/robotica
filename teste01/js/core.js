// Utilitários compartilhados: geometria, materiais e texturas procedurais
import * as THREE from 'three';
export { THREE };

const U = new THREE.BoxGeometry(1, 1, 1), Y = new THREE.CylinderGeometry(.5, .5, 1, 18);
export const B = (p, m, s, q, cast = false) => {
  const x = new THREE.Mesh(U, m); x.scale.set(...s); x.position.set(...q);
  x.castShadow = cast; x.receiveShadow = true; p.add(x); return x;
};
export const C = (p, m, r, h, q, rot = [0, 0, 0], cast = true) => {
  const x = new THREE.Mesh(Y, m); x.scale.set(r * 2, h, r * 2); x.position.set(...q);
  x.rotation.set(...rot); x.castShadow = cast; p.add(x); return x;
};
export const M = (color, o = {}) => new THREE.MeshStandardMaterial({ color, metalness: .3, roughness: .6, ...o });
export const glow = (color, i = 3) => new THREE.MeshStandardMaterial({ color: 0x111111, emissive: color, emissiveIntensity: i });

function tex(w, h, draw, rx = 1, ry = 1) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
const grain = (g, w, h, a) => {
  for (let i = 0; i < w * h / 5; i++) {
    const v = Math.random() * 255 | 0;
    g.fillStyle = `rgba(${v},${v},${v},${a})`; g.fillRect(Math.random() * w, Math.random() * h, 2, 2);
  }
};
export const T = {
  floor: tex(256, 256, (g, w, h) => {
    g.fillStyle = '#a2a2a2'; g.fillRect(0, 0, w, h); grain(g, w, h, .22);
    g.strokeStyle = '#4a4a4a'; g.lineWidth = 4; g.strokeRect(0, 0, w, h);
    g.fillStyle = '#00000022'; for (let i = 0; i < 14; i++) g.fillRect(Math.random() * w, Math.random() * h, 30 + Math.random() * 50, 6);
  }, 4, 3),
  panel: tex(256, 256, (g, w, h) => {
    g.fillStyle = '#c4c4c4'; g.fillRect(0, 0, w, h); grain(g, w, h, .12);
    g.strokeStyle = '#3c3c3c'; g.lineWidth = 5; g.strokeRect(3, 3, w - 6, h - 6);
    g.fillStyle = '#2c2c2c'; for (const [x, y] of [[18, 18], [238, 18], [18, 238], [238, 238]]) { g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill(); }
  }, 3, 2),
  led: tex(128, 256, (g, w, h) => {
    g.fillStyle = '#0c0f13'; g.fillRect(0, 0, w, h);
    for (let y = 8; y < h; y += 16) {
      g.fillStyle = '#1b222a'; g.fillRect(6, y, w - 12, 12);
      for (let x = 12; x < w - 12; x += 10) if (Math.random() < .5) { g.fillStyle = ['#3dff7a', '#38b6ff', '#ffb02e'][Math.random() * 3 | 0]; g.fillRect(x, y + 4, 5, 4); }
    }
  }),
  belt: tex(64, 64, (g, w, h) => {
    g.fillStyle = '#16191c'; g.fillRect(0, 0, w, h); grain(g, w, h, .2);
    g.strokeStyle = '#3a3f45'; g.lineWidth = 6; g.beginPath(); g.moveTo(0, 40); g.lineTo(32, 20); g.lineTo(64, 40); g.stroke();
  }, 1, 5),
  hazard: tex(128, 64, (g, w, h) => {
    g.fillStyle = '#e8b400'; g.fillRect(0, 0, w, h); g.fillStyle = '#15171a';
    for (let x = -h; x < w; x += 32) { g.beginPath(); g.moveTo(x, h); g.lineTo(x + 16, h); g.lineTo(x + 16 + h, 0); g.lineTo(x + h, 0); g.fill(); }
    grain(g, w, h, .15);
  }, 2, 1),
};
