(function () {
  'use strict';

  const canvas = document.getElementById('stormCanvas');
  const flashLayer = document.getElementById('stormFlash');

  // En móvil no arrancamos ni siquiera el canvas: cero RAF, cero gotas,
  // cero rayos y cero trabajo de CPU/GPU.
  const mobileLite = document.body.classList.contains('mobile-performance') ||
    window.matchMedia?.('(max-width: 900px) and (hover: none) and (pointer: coarse)')?.matches;

  if (mobileLite) {
    if (canvas) canvas.hidden = true;
    if (flashLayer) flashLayer.hidden = true;
    return;
  }

  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const lightningColors = [
    [143, 211, 255],
    [155, 137, 255],
    [84, 239, 204],
    [197, 220, 255],
    [221, 184, 255]
  ];

  let width = 0;
  let height = 0;
  let dpr = 1;
  let drops = [];
  let raf = 0;
  let lastTime = performance.now();
  let nextLightningAt = performance.now() + random(1600, 4200);
  let bolts = [];
  let lightningStrength = 0;
  let lightningColor = lightningColors[0];
  let hidden = document.hidden;

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function makeDrop(initial = true) {
    const depth = random(0.3, 1);
    return {
      x: random(-width * 0.15, width),
      y: initial ? random(-height * 0.1, height) : random(-height * 0.25, -10),
      length: random(10, 26) * (0.55 + depth * 0.7),
      speed: random(430, 970) * (0.55 + depth * 0.75),
      alpha: random(0.08, 0.34) * (0.6 + depth * 0.6),
      width: random(0.45, 1.15),
      wind: random(42, 78),
      depth
    };
  }

  function rebuildDrops() {
    const area = width * height;
    const target = Math.max(80, Math.min(360, Math.round(area / 5200)));
    drops = Array.from({ length: target }, () => makeDrop(true));
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width || window.innerWidth);
    height = Math.max(1, rect.height || window.innerHeight);
    dpr = Math.min(1.75, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    rebuildDrops();
  }

  function branchFrom(x, y, angle, remaining, scale, points) {
    let px = x;
    let py = y;
    let heading = angle;
    for (let i = 0; i < remaining; i += 1) {
      heading += random(-0.35, 0.35);
      const step = random(18, 42) * scale;
      const nx = px + Math.sin(heading) * step;
      const ny = py + Math.cos(heading) * step;
      points.push([px, py, nx, ny]);
      if (i > 1 && Math.random() < 0.22 && scale > 0.42) {
        const side = [];
        branchFrom(nx, ny, heading + random(-1.05, 1.05), Math.max(2, Math.floor((remaining - i) * 0.45)), scale * 0.62, side);
        points.push(...side.map((segment) => [...segment, 'branch']));
      }
      px = nx;
      py = ny;
      if (py > height * random(0.48, 0.92)) break;
    }
  }

  function triggerLightning(now) {
    const boltCount = Math.random() < 0.28 ? 2 : 1;
    lightningColor = lightningColors[Math.floor(Math.random() * lightningColors.length)];
    bolts = [];
    for (let i = 0; i < boltCount; i += 1) {
      const segments = [];
      branchFrom(random(width * 0.08, width * 0.92), random(-20, height * 0.06), random(-0.18, 0.18), 16 + Math.floor(random(0, 9)), random(0.75, 1.08), segments);
      bolts.push(segments);
    }
    lightningStrength = random(0.62, 1);
    nextLightningAt = now + random(2600, 7200);
    if (flashLayer) {
      const [r, g, b] = lightningColor;
      flashLayer.style.setProperty('--flash-rgb', `${r}, ${g}, ${b}`);
      flashLayer.classList.remove('flash-now');
      void flashLayer.offsetWidth;
      flashLayer.classList.add('flash-now');
    }
  }

  function drawRain(dt) {
    ctx.lineCap = 'round';
    for (let i = 0; i < drops.length; i += 1) {
      const drop = drops[i];
      drop.y += drop.speed * dt;
      drop.x += drop.wind * dt;
      if (drop.y > height + 35 || drop.x > width + 35) drops[i] = makeDrop(false);
      const d = drops[i];
      ctx.beginPath();
      ctx.strokeStyle = `rgba(167, 211, 235, ${d.alpha})`;
      ctx.lineWidth = d.width;
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - d.length * 0.17, d.y + d.length);
      ctx.stroke();
    }
  }

  function drawLightning() {
    if (lightningStrength <= 0.01 || !bolts.length) return;
    const [r, g, b] = lightningColor;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${lightningStrength * 0.045})`;
    ctx.fillRect(0, 0, width, height);

    bolts.forEach((segments) => {
      segments.forEach((segment) => {
        const [x1, y1, x2, y2, kind] = segment;
        const branch = kind === 'branch';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${lightningStrength * (branch ? 0.46 : 0.9)})`;
        ctx.lineWidth = branch ? 0.8 : 1.7;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${lightningStrength})`;
        ctx.shadowBlur = branch ? 8 : 17;
        ctx.stroke();
      });
    });

    ctx.restore();
    lightningStrength *= 0.82;
  }

  function drawStaticStorm() {
    ctx.clearRect(0, 0, width, height);
    drops.slice(0, Math.min(90, drops.length)).forEach((drop) => {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(167, 211, 235, ${Math.min(0.18, drop.alpha)})`;
      ctx.lineWidth = drop.width;
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x - drop.length * 0.17, drop.y + drop.length);
      ctx.stroke();
    });
  }

  function frame(now) {
    if (hidden) return;
    const dt = Math.min(0.035, Math.max(0, (now - lastTime) / 1000));
    lastTime = now;

    if (reducedMotion?.matches) {
      drawStaticStorm();
      return;
    }

    ctx.clearRect(0, 0, width, height);
    drawRain(dt);
    if (now >= nextLightningAt) triggerLightning(now);
    drawLightning();
    raf = requestAnimationFrame(frame);
  }

  function restartAnimation() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    lastTime = performance.now();
    if (!hidden) raf = requestAnimationFrame(frame);
  }

  document.addEventListener('visibilitychange', () => {
    hidden = document.hidden;
    restartAnimation();
  });

  window.addEventListener('resize', () => {
    resize();
    restartAnimation();
  }, { passive: true });

  reducedMotion?.addEventListener?.('change', restartAnimation);

  resize();
  restartAnimation();
})();
