/* ============================================================
   map.js — 旅行线索地图（SVG 中国地图 + 城市图钉 + 航线）
   数据：js/data/china-geo.json（本地 GeoJSON）+ js/data/travel.js
   投影：等距圆柱投影 + 经度乘 cos(32°)≈0.85 的纬度修正，自计算边界适配
   ============================================================ */

import { CITIES, ROUTE } from './data/travel.js';
import { openDossier } from './dossier.js';

const container = document.getElementById('travel-map');

/* 城市名标签偏移（展示层调参，单位 px）：[dx, dy, textAnchor] */
const LABEL_POS = {
  dali: [-10, 20, 'end'],
  lijiang: [-10, -14, 'end'],
  changsha: [-10, -14, 'end'],
  hangzhou: [12, 18, 'start'],
  shenzhen: [12, 16, 'start'],
  shanghai: [12, -6, 'start'],
};

const VIEW_W = 960;
const VIEW_H = 700;
const PAD = 30;

async function init() {
  if (!container) return;

  let geo;
  try {
    const res = await fetch('js/data/china-geo.json');
    geo = await res.json();
  } catch (err) {
    container.innerHTML = '<p class="map-fallback">地图数据加载失败</p>';
    console.warn('地图数据加载失败：', err);
    return;
  }

  /* ---------- 投影与边界 ---------- */
  const LAT_FIX = 0.85; // cos(32°)
  const proj = (lng, lat) => [lng * LAT_FIX, -lat];

  // 扫描全部坐标求边界
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  const scan = (coords) => {
    for (const [lng, lat] of coords) {
      const [x, y] = proj(lng, lat);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  };
  const walkGeom = (g, fn) => {
    const polys = g.type === 'MultiPolygon' ? g.coordinates : [g.coordinates];
    for (const poly of polys) for (const ring of poly) fn(ring);
  };
  for (const f of geo.features) walkGeom(f.geometry, scan);

  const k = Math.min(
    (VIEW_W - PAD * 2) / (maxX - minX),
    (VIEW_H - PAD * 2) / (maxY - minY)
  );
  const offX = PAD - minX * k + (VIEW_W - PAD * 2 - (maxX - minX) * k) / 2;
  const offY = PAD - minY * k + (VIEW_H - PAD * 2 - (maxY - minY) * k) / 2;
  const P = (lng, lat) => {
    const [x, y] = proj(lng, lat);
    return [x * k + offX, y * k + offY];
  };

  /* ---------- 渲染 ---------- */
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${VIEW_W} ${VIEW_H}`);
  svg.setAttribute('class', 'clue-map');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', '旅行足迹中国地图');

  // 省界
  for (const f of geo.features) {
    let d = '';
    walkGeom(f.geometry, (ring) => {
      ring.forEach(([lng, lat], i) => {
        const [x, y] = P(lng, lat);
        d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
      });
      d += 'Z';
    });
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', d);
    path.setAttribute('class', 'map-province');
    svg.appendChild(path);
  }

  // 航线：红色虚线弧线（二次贝塞尔，向上鼓出），流动虚线动画
  const cityById = Object.fromEntries(CITIES.map((c) => [c.id, c]));
  for (let i = 0; i < ROUTE.length - 1; i++) {
    const a = cityById[ROUTE[i]];
    const b = cityById[ROUTE[i + 1]];
    if (!a || !b) continue;
    const [x1, y1] = P(a.lng, a.lat);
    const [x2, y2] = P(b.lng, b.lat);
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2 - Math.max(18, dist * 0.22); // 向上鼓出
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`);
    path.setAttribute('class', 'route-line');
    svg.appendChild(path);
  }

  // 城市图钉 + 标签
  for (const c of CITIES) {
    const [x, y] = P(c.lng, c.lat);
    const [dx = 10, dy = -10, anchor = 'start'] = LABEL_POS[c.id] || [];

    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'map-pin');
    g.setAttribute('tabindex', '0');
    g.setAttribute('role', 'button');
    g.setAttribute('aria-label', `查看${c.name}的案卷`);

    // 针尖
    const needle = document.createElementNS(NS, 'path');
    needle.setAttribute('d', `M ${x} ${y} L ${x - 2.5} ${y - 10} L ${x + 2.5} ${y - 10} Z`);
    needle.setAttribute('class', 'pin-needle');
    g.appendChild(needle);

    // 钉头（复用板卡图钉视觉：红色径向 + 高光点）
    const head = document.createElementNS(NS, 'circle');
    head.setAttribute('cx', x);
    head.setAttribute('cy', y - 12);
    head.setAttribute('r', 7.5);
    head.setAttribute('class', 'pin-head');
    g.appendChild(head);

    const dot = document.createElementNS(NS, 'circle');
    dot.setAttribute('cx', x - 2);
    dot.setAttribute('cy', y - 14.5);
    dot.setAttribute('r', 2);
    dot.setAttribute('class', 'pin-dot');
    g.appendChild(dot);

    // 城市名标签
    const label = document.createElementNS(NS, 'text');
    label.setAttribute('x', x + dx);
    label.setAttribute('y', y + dy);
    label.setAttribute('text-anchor', anchor);
    label.setAttribute('class', 'pin-label');
    label.textContent = c.name;
    g.appendChild(label);

    const open = () => openDossier(`travel-${c.id}`);
    g.addEventListener('click', open);
    g.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });

    svg.appendChild(g);
  }

  container.innerHTML = '';
  container.appendChild(svg);
}

init();
