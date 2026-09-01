/* ============================================================
   bgm.js — 背景音乐：WebAudio 生成式 lo-fi / ambient
   不依赖任何音频文件：和弦垫音（3 振荡器 + 低通 + delay 空间感）
   + 五声音阶随机漫步旋律 + 滤波噪声雨声。音量压得很低。
   浏览器自动播放策略：默认关，用户点击右下角「♪」按钮才创建/恢复
   AudioContext。AudioContext 不可用时按钮静默隐藏。
   ============================================================ */

(() => {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return; // 静默降级：不渲染按钮

  /* ---------- 按钮 ---------- */
  const btn = document.createElement('button');
  btn.id = 'bgm-toggle';
  btn.type = 'button';
  btn.setAttribute('aria-pressed', 'false');
  btn.setAttribute('aria-label', '背景音乐开关');
  btn.title = '背景音乐 · 深夜电台氛围音';
  btn.innerHTML = '<span class="bgm-disc" aria-hidden="true">♪</span><span class="bgm-text">背景音乐</span>';
  document.body.appendChild(btn);

  /* ---------- 音高工具 ---------- */
  const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);

  // 和弦垫音进行（A 小调色彩，低把位三音组）
  const CHORDS = [
    [45, 48, 52], // Am
    [41, 45, 48], // F
    [48, 52, 55], // C
    [43, 47, 50], // G
  ];
  // 五声音阶旋律池（A 小调五声，中高把位）
  const SCALE = [69, 72, 74, 76, 79, 81, 84]; // A4 C5 D5 E5 G5 A5 C6

  let ctx = null;
  let nodes = null;     // 图节点引用，便于停止时断开
  let timers = [];
  let playing = false;
  let chordIdx = 0;
  let melodyDeg = 2;    // 旋律随机漫步的当前音级

  function buildGraph() {
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    // 空间感：delay 模拟轻混响
    const delay = ctx.createDelay(1);
    delay.delayTime.value = 0.42;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.34;
    const wet = ctx.createGain();
    wet.gain.value = 0.3;
    delay.connect(feedback).connect(delay);
    delay.connect(wet).connect(master);

    /* 和弦垫音：3 个正弦振荡器 → 低通（LFO 缓慢扫频）→ master */
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.value = 520;
    padFilter.Q.value = 0.6;
    padFilter.connect(master);
    const padSend = ctx.createGain();
    padSend.gain.value = 0.25;
    padFilter.connect(padSend).connect(delay);

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.05; // 20 秒一周期的慢扫
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 260;
    lfo.connect(lfoGain).connect(padFilter.frequency);
    lfo.start();

    const padOscs = CHORDS[0].map((m) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = midi(m);
      const g = ctx.createGain();
      g.gain.value = 0.09;
      osc.connect(g).connect(padFilter);
      osc.start();
      return osc;
    });

    /* 雨声底噪：循环噪声缓冲 → 低通 → 极低音量 */
    const len = ctx.sampleRate * 2;
    const noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 680;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.016;
    noiseFilter.connect(noiseGain).connect(master);

    return { master, delay, feedback, wet, padFilter, padSend, lfo, lfoGain, padOscs, noiseBuf, noiseFilter, noiseGain, noiseSrc: null };
  }

  // BufferSource 只能 start 一次：每次开播都新建噪声源
  function startNoise() {
    const src = ctx.createBufferSource();
    src.buffer = nodes.noiseBuf;
    src.loop = true;
    src.connect(nodes.noiseFilter);
    src.start();
    nodes.noiseSrc = src;
  }

  /* ---------- 和弦切换：频率缓动滑向下一组和弦 ---------- */
  function nextChord() {
    chordIdx = (chordIdx + 1) % CHORDS.length;
    const t = ctx.currentTime;
    nodes.padOscs.forEach((osc, i) => {
      osc.frequency.setTargetAtTime(midi(CHORDS[chordIdx][i]), t, 1.8);
    });
  }

  /* ---------- 旋律：五声音阶随机漫步，偶发单音 ---------- */
  function maybeNote() {
    if (Math.random() > 0.55) return; // 留白
    melodyDeg += Math.floor(Math.random() * 5) - 2; // -2..+2 漫步
    melodyDeg = Math.max(0, Math.min(SCALE.length - 1, melodyDeg));

    const t0 = ctx.currentTime + 0.05;
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = midi(SCALE[melodyDeg]);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(0.055, t0 + 0.03); // 快起音
    g.gain.setTargetAtTime(0, t0 + 0.03, 0.55);        // 长衰减
    osc.connect(g);
    g.connect(nodes.master);
    const send = ctx.createGain();
    send.gain.value = 0.6;
    g.connect(send).connect(nodes.delay);
    osc.start(t0);
    osc.stop(t0 + 2.5); // 包络已归零，及时释放
  }

  function startTimers() {
    timers.push(setInterval(nextChord, 7000));
    timers.push(setInterval(maybeNote, 1300));
  }
  function stopTimers() {
    timers.forEach(clearInterval);
    timers = [];
  }

  /* ---------- 开关 ---------- */
  async function start() {
    try {
      if (!ctx) {
        ctx = new AudioCtx();
        nodes = buildGraph();
      }
      if (ctx.state === 'suspended') await ctx.resume(); // 必须在点击手势内
      startNoise();
      startTimers();
      nodes.master.gain.setTargetAtTime(0.14, ctx.currentTime, 1.2); // 淡入
      playing = true;
      btn.classList.add('on');
      btn.setAttribute('aria-pressed', 'true');
    } catch (err) {
      console.warn('背景音乐启动失败，已降级：', err);
      btn.remove();
    }
  }

  function stop() {
    if (!ctx || !playing) return;
    stopTimers();
    nodes.master.gain.setTargetAtTime(0, ctx.currentTime, 0.4); // 淡出
    // 淡出完成后挂起上下文并停掉噪声源，避免空转
    setTimeout(() => {
      try {
        nodes.noiseSrc.stop();
        nodes.noiseSrc.disconnect();
        nodes.noiseSrc = null;
        ctx.suspend();
      } catch (_) { /* 已停止则忽略 */ }
    }, 1200);
    playing = false;
    btn.classList.remove('on');
    btn.setAttribute('aria-pressed', 'false');
  }

  btn.addEventListener('click', () => (playing ? stop() : start()));
})();
