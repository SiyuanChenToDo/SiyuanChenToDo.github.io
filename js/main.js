/* ============================================================
   main.js — 线索板交互：红线 / 卡片拖拽·旋转·置顶 / 点击开案卷 / 导航
   ============================================================ */

import { openDossier } from './dossier.js';

const board = document.getElementById('board');
const svg = document.getElementById('threads');
const nav = document.getElementById('topnav');
const mobileQuery = window.matchMedia('(max-width: 767px)');

/* 红线连接关系：推理脉络 */
const LINKS = [
  ['card-about', 'card-figmac'],
  ['card-about', 'card-rapeseed'],
  ['card-about', 'card-memescope'],
  ['card-figmac', 'card-internship'],
  ['card-memescope', 'card-other'],
  ['card-rapeseed', 'card-honors'],
  ['card-memescope', 'card-honors'],
  ['card-internship', 'card-contact'],
];

const cardEls = [...document.querySelectorAll('#board .card')];
const cardMap = new Map(cardEls.map((el) => [el.id, el]));

/* ---------- 初始化：百分比定位固化为像素，角度固化到 dataset ---------- */
function normalizePositions() {
  if (mobileQuery.matches) return;
  const b = board.getBoundingClientRect();
  for (const el of cardEls) {
    const r = el.getBoundingClientRect();
    el.style.left = `${r.left - b.left}px`;
    el.style.top = `${r.top - b.top}px`;
  }
}

for (const el of cardEls) {
  // 初始角度已在 HTML 里以 --rot 声明，CSS 的 transform 直接引用它；
  // 不要用内联 transform，否则会盖住 hover/dragging 的摆正样式。
  el.dataset.rot = parseFloat(el.style.getPropertyValue('--rot')) || 0;
}

function cardRotation(el) {
  return parseFloat(el.dataset.rot) || 0;
}

/* ---------- 红线绘制 ---------- */

// 图钉锚点：卡片顶部中心随旋转后的位置（板面坐标系）
function pinAnchor(el) {
  const l = parseFloat(el.style.left) || 0;
  const t = parseFloat(el.style.top) || 0;
  const w = el.offsetWidth;
  const h = el.offsetHeight;
  const cx = l + w / 2;
  const cy = t + h / 2;
  const rad = cardRotation(el) * Math.PI / 180;
  const d = h / 2 + 6; // 图钉略高出卡片顶边
  return { x: cx + d * Math.sin(rad), y: cy - d * Math.cos(rad) };
}

function drawThreads() {
  if (mobileQuery.matches) return;

  const w = board.clientWidth;
  const h = board.clientHeight;
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.setAttribute('width', w);
  svg.setAttribute('height', h);
  svg.innerHTML = '';

  for (const [fromId, toId] of LINKS) {
    const from = cardMap.get(fromId);
    const to = cardMap.get(toId);
    if (!from || !to) continue;

    const p1 = pinAnchor(from);
    const p2 = pinAnchor(to);

    // 二次贝塞尔模拟棉线重力下垂
    const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const sag = 30 + dist * 0.08;
    const mx = (p1.x + p2.x) / 2;
    const my = Math.max(p1.y, p2.y) + sag;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${p1.x} ${p1.y} Q ${mx} ${my} ${p2.x} ${p2.y}`);
    path.setAttribute('class', 'thread');
    path.dataset.from = fromId;
    path.dataset.to = toId;
    svg.appendChild(path);

    for (const p of [p1, p2]) {
      const knot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      knot.setAttribute('cx', p.x);
      knot.setAttribute('cy', p.y);
      knot.setAttribute('r', 3.5);
      knot.setAttribute('class', 'thread-knot');
      svg.appendChild(knot);
    }
  }
}

/* ---------- 卡片交互：拖拽 / 旋转 / 置顶 / 点击开案卷 ---------- */
let zTop = 10;
const CLICK_TOLERANCE = 5; // 移动 <5px 视为点击而非拖拽

for (const el of cardEls) {
  el.addEventListener('pointerdown', (e) => {
    if (mobileQuery.matches) return;
    if (e.target.closest('a') || e.target.closest('.rot-handle')) return;

    el.style.zIndex = ++zTop; // 点击置顶
    el.setPointerCapture(e.pointerId);

    const startX = e.clientX;
    const startY = e.clientY;
    const b = board.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const offX = e.clientX - r.left;
    const offY = e.clientY - r.top;
    let moved = false;

    const onMove = (ev) => {
      if (!moved && Math.hypot(ev.clientX - startX, ev.clientY - startY) < CLICK_TOLERANCE) return;
      if (!moved) { moved = true; el.classList.add('dragging'); }

      const bb = board.getBoundingClientRect();
      let x = ev.clientX - bb.left - offX;
      let y = ev.clientY - bb.top - offY;
      x = Math.max(0, Math.min(x, bb.width - el.offsetWidth));
      y = Math.max(0, Math.min(y, bb.height - el.offsetHeight));
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      drawThreads(); // 红线实时跟随
    };
    const onUp = (ev) => {
      el.classList.remove('dragging');
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      // 区分点击与拖拽：位移 <5px → 打开案卷
      if (!moved && Math.hypot(ev.clientX - startX, ev.clientY - startY) < CLICK_TOLERANCE) {
        openDossier(el.id);
      }
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
  });

  // 移动端：tap 直接打开案卷（桌面端点击判定在 pointerup 里）
  el.addEventListener('click', () => {
    if (mobileQuery.matches) openDossier(el.id);
  });

  // 旋转手柄
  const handle = el.querySelector('.rot-handle');
  if (handle) {
    handle.addEventListener('pointerdown', (e) => {
      if (mobileQuery.matches) return;
      e.stopPropagation();
      handle.setPointerCapture(e.pointerId);

      const onMove = (ev) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        // 手柄在卡片底部中心：rot=0 时指向正下方
        let deg = Math.atan2(ev.clientY - cy, ev.clientX - cx) * 180 / Math.PI - 90;
        if (ev.shiftKey) deg = Math.round(deg / 15) * 15;
        el.dataset.rot = deg.toFixed(1);
        el.style.setProperty('--rot', `${el.dataset.rot}deg`);
        drawThreads();
      };
      const onUp = () => {
        handle.removeEventListener('pointermove', onMove);
        handle.removeEventListener('pointerup', onUp);
        handle.removeEventListener('pointercancel', onUp);
      };
      handle.addEventListener('pointermove', onMove);
      handle.addEventListener('pointerup', onUp);
      handle.addEventListener('pointercancel', onUp);
    });
  }

  // hover 高亮相连红线
  el.addEventListener('mouseenter', () => {
    svg.querySelectorAll('.thread').forEach((t) => {
      if (t.dataset.from === el.id || t.dataset.to === el.id) t.classList.add('active');
    });
  });
  el.addEventListener('mouseleave', () => {
    svg.querySelectorAll('.thread.active').forEach((t) => t.classList.remove('active'));
  });
}

/* ---------- 生活切片拍立得：点击开案卷 ---------- */
document.querySelectorAll('.polaroid[data-dossier]').forEach((el) => {
  el.addEventListener('click', () => openDossier(el.dataset.dossier));
});

/* ---------- 导航条滚动加深 ---------- */
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ---------- 初始化 ---------- */
window.addEventListener('resize', drawThreads);
window.addEventListener('load', () => {
  normalizePositions();
  drawThreads();

  // 调试参数：?jump=board / ?jump=life 无动画直达某锚点（截图调试用）
  const params = new URLSearchParams(location.search);
  const jump = params.get('jump');
  if (jump) {
    const target = document.getElementById(jump);
    if (target) {
      document.documentElement.style.scrollBehavior = 'auto';
      target.scrollIntoView();
    }
  }
  // 调试参数：?flat=1 压扁 Hero 区高度，方便一屏截全页
  if (params.has('flat')) {
    document.querySelector('.hero').style.minHeight = '0';
  }
});
normalizePositions();
drawThreads();
