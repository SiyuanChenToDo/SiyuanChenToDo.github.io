/* ============================================================
   bg3d.js — Three.js 氛围层
   板面之外的黑暗虚空：漂浮尘埃 + 雾感 + 深处若隐若现的红线。
   WebGL 不可用时静默降级，不影响页面其余部分。
   ============================================================ */

(async () => {
  const canvas = document.getElementById('bg3d');

  try {
    const THREE = await import('three');

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0d0906, 0.055); // 雾感：远处尘埃沉入黑暗

    const camera = new THREE.PerspectiveCamera(
      60, window.innerWidth / window.innerHeight, 0.1, 100
    );
    camera.position.z = 8;

    /* ---------- 漂浮尘埃 ---------- */

    // 柔和圆点贴图：高斯模糊感
    function makeSprite() {
      const c = document.createElement('canvas');
      c.width = c.height = 64;
      const ctx = c.getContext('2d');
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.4, 'rgba(255,255,255,0.3)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    }
    const sprite = makeSprite();

    const COUNT = 500;
    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 11;
      velocities[i * 3] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.0014 + 0.0005;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.08,
      map: sprite,
      color: 0xcbb98f,      // 台灯下的暖尘
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    scene.add(new THREE.Points(geo, mat));

    /* ---------- 深处若隐若现的红线 ---------- */

    const redLines = [];
    for (let i = 0; i < 5; i++) {
      const segs = 24;
      const pts = new Float32Array((segs + 1) * 3);
      const z = -5 - Math.random() * 4;
      const yBase = (Math.random() - 0.5) * 8;
      for (let s = 0; s <= segs; s++) {
        pts[s * 3] = -12 + (24 * s) / segs;
        pts[s * 3 + 1] = yBase;
        pts[s * 3 + 2] = z;
      }
      const lg = new THREE.BufferGeometry();
      lg.setAttribute('position', new THREE.BufferAttribute(pts, 3));
      const lm = new THREE.LineBasicMaterial({
        color: 0xc0392b,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(lg, lm);
      line.userData = { phase: Math.random() * Math.PI * 2, yBase, segs };
      scene.add(line);
      redLines.push(line);
    }

    /* ---------- 鼠标视差 ---------- */
    const mouse = { x: 0, y: 0 };
    window.addEventListener('pointermove', (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    /* ---------- 尺寸自适应 ---------- */
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    /* ---------- 动画循环 ---------- */
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let t = 0;

    function tick() {
      t += 0.007;

      const p = geo.attributes.position.array;
      for (let i = 0; i < COUNT; i++) {
        p[i * 3] += velocities[i * 3];
        p[i * 3 + 1] += velocities[i * 3 + 1];
        p[i * 3 + 2] += velocities[i * 3 + 2];
        if (p[i * 3] > 12) p[i * 3] = -12; else if (p[i * 3] < -12) p[i * 3] = 12;
        if (p[i * 3 + 1] > 7.5) p[i * 3 + 1] = -7.5; else if (p[i * 3 + 1] < -7.5) p[i * 3 + 1] = 7.5;
        if (p[i * 3 + 2] > 5.5) p[i * 3 + 2] = -5.5; else if (p[i * 3 + 2] < -5.5) p[i * 3 + 2] = 5.5;
      }
      geo.attributes.position.needsUpdate = true;

      for (const line of redLines) {
        const lp = line.geometry.attributes.position.array;
        const { phase, yBase, segs } = line.userData;
        for (let s = 0; s <= segs; s++) {
          lp[s * 3 + 1] = yBase + Math.sin(t * 0.6 + phase + s * 0.35) * 0.4;
        }
        line.geometry.attributes.position.needsUpdate = true;
        line.material.opacity = 0.07 + 0.06 * (0.5 + 0.5 * Math.sin(t * 0.45 + phase));
      }

      camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.03;
      camera.position.y += (-mouse.y * 0.4 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      if (!reduced) requestAnimationFrame(tick);
    }

    tick();
  } catch (err) {
    // WebGL / CDN 失败：静默移除氛围层
    console.warn('3D 氛围层初始化失败，已降级：', err);
    if (canvas) canvas.remove();
  }
})();
