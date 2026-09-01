/* ============================================================
   radio.js — 深夜电台播放器
   数据：js/data/playlist.js（用户往 assets/music/ 丢 mp3 即可）
   音频缺失的曲目自动置灰「音频待补充」，连播时自动跳过。
   ============================================================ */

import { PLAYLIST } from './data/playlist.js';

const root = document.getElementById('radio');
if (root) init();

function init() {
  const audio = new Audio();
  const listEl = document.getElementById('radio-list');
  const trackEl = document.getElementById('radio-track');
  const noteEl = document.getElementById('radio-note');
  const fillEl = document.getElementById('radio-fill');
  const progressEl = document.getElementById('radio-progress');
  const playBtn = document.getElementById('radio-play');
  const prevBtn = document.getElementById('radio-prev');
  const nextBtn = document.getElementById('radio-next');
  const timeEl = document.getElementById('radio-time');

  let current = -1;
  const dead = new Set(); // 确认缺失的曲目下标

  /* ---------- 曲目列表 ---------- */
  PLAYLIST.forEach((t, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="track-no">${String(i + 1).padStart(2, '0')}</span>
      <span class="track-name">${t.title}</span>
      <span class="track-artist">${t.artist}</span>
      <span class="track-state"></span>`;
    if (!t.src) markDead(i, li); // src 留空：直接置灰
    li.addEventListener('click', () => select(i));
    listEl.appendChild(li);
  });

  function markDead(i, li) {
    dead.add(i);
    const el = li || listEl.children[i];
    if (el) {
      el.classList.add('unavailable');
      el.querySelector('.track-state').textContent = '音频待补充';
    }
    if (i === current) {
      audio.pause();
      setPlaying(false);
    }
  }

  function li(i) { return listEl.children[i]; }

  /* ---------- 选曲 / 播放 ---------- */
  function select(i, autoplay = true) {
    if (i < 0 || i >= PLAYLIST.length) return;
    if (dead.has(i)) {
      // 置灰曲目不可播，自动跳到下一首可用的
      const next = findAlive(i, 1);
      if (next !== -1) select(next, autoplay);
      return;
    }
    current = i;
    [...listEl.children].forEach((el, j) => el.classList.toggle('active', j === i));
    const t = PLAYLIST[i];
    trackEl.textContent = `${t.title} · ${t.artist}`;
    noteEl.textContent = t.note || '';
    audio.src = t.src;
    fillEl.style.width = '0%';
    timeEl.textContent = '00:00 / 00:00';
    if (autoplay) audio.play().catch(() => {});
  }

  function findAlive(from, step) {
    for (let n = 1; n <= PLAYLIST.length; n++) {
      const j = (from + step * n + PLAYLIST.length * 10) % PLAYLIST.length;
      if (!dead.has(j) && PLAYLIST[j].src) return j;
    }
    return -1;
  }

  function setPlaying(on) {
    root.classList.toggle('playing', on);
    playBtn.textContent = on ? '⏸' : '▶';
    playBtn.setAttribute('aria-label', on ? '暂停' : '播放');
  }

  playBtn.addEventListener('click', () => {
    if (current === -1) { select(0); return; }
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  });
  prevBtn.addEventListener('click', () => {
    const j = findAlive(current === -1 ? PLAYLIST.length - 1 : current, -1);
    if (j !== -1) select(j);
  });
  nextBtn.addEventListener('click', () => {
    const j = findAlive(current === -1 ? 0 : current, 1);
    if (j !== -1) select(j);
  });

  audio.addEventListener('play', () => setPlaying(true));
  audio.addEventListener('pause', () => setPlaying(false));
  audio.addEventListener('ended', () => {
    const j = findAlive(current, 1);
    if (j !== -1) select(j);
  });
  // 音频加载失败：置灰；仅在播放中时才自动跳到下一首
  audio.addEventListener('error', () => {
    if (current === -1) return;
    const wasPlaying = !audio.paused;
    markDead(current);
    if (wasPlaying) {
      const j = findAlive(current, 1);
      if (j !== -1) select(j);
    } else {
      current = -1;
      trackEl.textContent = '— 未在播放 —';
      noteEl.textContent = '';
      [...listEl.children].forEach((el) => el.classList.remove('active'));
    }
  });

  /* ---------- 进度条（点击 / 拖动 seek） ---------- */
  const fmt = (s) => {
    if (!isFinite(s)) return '00:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      fillEl.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
      timeEl.textContent = `${fmt(audio.currentTime)} / ${fmt(audio.duration)}`;
    }
  });

  function seekTo(clientX) {
    const r = progressEl.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    if (audio.duration) audio.currentTime = ratio * audio.duration;
    fillEl.style.width = `${ratio * 100}%`;
  }
  progressEl.addEventListener('pointerdown', (e) => {
    progressEl.setPointerCapture(e.pointerId);
    seekTo(e.clientX);
    const onMove = (ev) => seekTo(ev.clientX);
    const onUp = () => {
      progressEl.removeEventListener('pointermove', onMove);
      progressEl.removeEventListener('pointerup', onUp);
      progressEl.removeEventListener('pointercancel', onUp);
    };
    progressEl.addEventListener('pointermove', onMove);
    progressEl.addEventListener('pointerup', onUp);
    progressEl.addEventListener('pointercancel', onUp);
  });

  // 默认选中第一首（不自动播放）
  select(0, false);
}
