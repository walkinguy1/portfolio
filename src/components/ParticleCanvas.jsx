import { useEffect, useRef } from "react";
import { useTheme } from "../useTheme";

/* ─── Color palettes ──────────────────────────────────────────────── */
/* Emerald ramp — mirrors --accent / --accent-bright / --accent-secondary
   in styles/global.css. Canvas can't read CSS vars cheaply per-frame, so
   these are kept in sync by hand; update both if the palette changes. */
const DASH_COLORS_DARK  = ["#10b981","#34d399","#5eead4","#047857","#6ee7b7"];
const DASH_COLORS_LIGHT = ["#0d7d5c","#0f766e","#10b981","#065f46","#14b8a6"];

/* Bolt palettes. Dark theme burns a near-white core into an emerald halo.
   Light theme inverts it — a deep emerald core against a pale page — and
   needs heavier weight throughout: additive-looking glow barely registers
   on a light ground, so the halo alphas and the core width are both up. */
const BOLT_DARK = {
  glow: "52,211,153", core: "240,255,250",
  outerA: 0.07, midA: 0.38, coreA: 0.96,
  outerW: 11, midW: 3.5, coreMul: 1,
  outerBlur: 44, midBlur: 12,
};
/* A wide, blurred halo reads as glowing light on a dark ground but as a
   dirty smudge on a pale one, so light mode drops most of the halo and
   carries the bolt on a crisp, thin, dark core instead. */
const BOLT_LIGHT = {
  glow: "16,140,102", core: "3,62,45",
  outerA: 0.13, midA: 0.42, coreA: 1,
  outerW: 5, midW: 2.2, coreMul: 1.15,
  outerBlur: 12, midBlur: 5,
};

/* ─── Interaction tuning ─────────────────────────────────────────── */
const LIGHTNING_PARTICLE_FORCE = 80;
const LIGHTNING_PARTICLE_RADIUS = 350;

/* ─── Timing (milliseconds) ──────────────────────────────────────── */
/* Every envelope below is a function of elapsed time, not frame count,
   so a 144Hz display and a throttled tab see the same strike. */
const STRIKE_LIFE    = 900;  // main bolt, spawn → fully faded
const SCREEN_FLASH   = 45;   // full-canvas whiteout on impact
const IMPACT_LIFE    = 450;  // expanding glow at the strike point
const AFTER_DELAY    = 60;   // afterglow bolt lags the main channel
const AFTER_LIFE     = 340;
const MAX_STRIKES    = 4;
const FRAME          = 1000 / 60; // reference frame for per-frame tunings

/* ─── Bolt geometry ──────────────────────────────────────────────── */
const BOLT_THICKNESS = 2.4;
const BRANCH_DEPTH   = 2;    // main channel + 2 generations of forks
const BOLT_PAD       = 70;   // room for the widest glow stroke + blur

/* ─── Particle ───────────────────────────────────────────────────── */
class Particle {
  constructor(w, h, isDash) {
    this.isDash = isDash; this.w = w; this.h = h;
    this.x = Math.random() * w; this.y = Math.random() * h;
    this.angle    = Math.random() * Math.PI * 2;
    this.angleVel = (Math.random() - 0.5) * 0.006;
    this.speed    = Math.random() * 0.35 + 0.1;
    this.rotation = Math.random() * Math.PI * 2;
    this.ax = 0; this.ay = 0;
    if (isDash) {
      this.depth    = Math.random();
      this.length   = this.depth * 2 + 3;
      this.thick    = this.depth * 2 + 3;
      this.colorIdx = Math.floor(Math.random() * 5);
      this.rotSpeed = (Math.random() - 0.5) * 0.004;
    } else {
      this.radius = Math.random() * 1.2 + 0.4;
    }
  }

  repel(tx, ty, strength = 45, radius = 250) {
    const dx = this.x - tx, dy = this.y - ty;
    const dist = Math.sqrt(dx * dx + dy * dy) + 0.1;
    const R = radius;
    if (dist < R) {
      const f = ((R - dist) / R) * strength;
      this.ax += (dx / dist) * f;
      this.ay += (dy / dist) * f;
    }
  }

  /* k = elapsed / 60fps-frame. At 60Hz k is 1 and this is identical to the
     original per-frame math; it only stops faster displays running fast. */
  update(k) {
    this.angle += this.angleVel * k;
    const damp = Math.pow(0.8, k);
    this.ax *= damp; this.ay *= damp;
    this.x += (Math.cos(this.angle) * this.speed + this.ax) * k;
    this.y += (Math.sin(this.angle) * this.speed + this.ay) * k;
    if (this.isDash) this.rotation += this.rotSpeed * k;
    if (this.x < -30) this.x = this.w + 30;
    if (this.x > this.w + 30) this.x = -30;
    if (this.y < -30) this.y = this.h + 30;
    if (this.y > this.h + 30) this.y = -30;
  }

  draw(ctx, isDark) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    if (this.isDash) {
      ctx.globalAlpha = isDark ? 0.45 + this.depth * 0.35 : 0.55 + this.depth * 0.35;
      ctx.fillStyle = (isDark ? DASH_COLORS_DARK : DASH_COLORS_LIGHT)[this.colorIdx];
      ctx.beginPath();
      ctx.roundRect(-this.length / 2, -this.thick / 2, this.length, this.thick, this.thick / 2);
      ctx.fill();
    } else {
      ctx.globalAlpha = isDark ? 0.25 : 0.18;
      ctx.fillStyle   = isDark ? "#a8d8c4" : "#3d5b4e";
      ctx.beginPath(); ctx.arc(0, 0, this.radius, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
}

/* ─── Lightning geometry ─────────────────────────────────────────── */

function stepBolt(x1, y1, x2, y2, jitter, segLen = 16) {
  const pts = [{ x: x1, y: y1 }];
  let cx = x1, cy = y1;
  const totalDist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  /* Step length is derived from the distance rather than fixed: a short
     fork walked at a fixed segLen overshoots its target, and the closing
     push() below then snaps back across the path, drawing a loop. */
  const steps = Math.max(2, Math.round(totalDist / segLen));
  const step  = totalDist / steps;
  let heading = Math.atan2(y2 - y1, x2 - x1);

  for (let i = 1; i <= steps; i++) {
    const progress = i / steps;
    const remDx = x2 - cx, remDy = y2 - cy;
    const targetAngle = Math.atan2(remDy, remDx);

    let diff = targetAngle - heading;
    if (diff >  Math.PI) diff -= Math.PI * 2;
    if (diff < -Math.PI) diff += Math.PI * 2;

    heading += diff * (0.06 + progress * 0.45);
    heading += (Math.random() - 0.5) * jitter;

    cx += Math.cos(heading) * step;
    cy += Math.sin(heading) * step;
    pts.push({ x: cx, y: cy });
  }

  pts.push({ x: x2, y: y2 });
  return pts;
}

/* Forks hang off the middle of a channel and recurse, so each generation
   is shorter, thinner and splays wider than its parent. */
function buildBranches(pts, parentAngle, parentLen, depth) {
  if (depth > BRANCH_DEPTH) return [];

  const branches = [];
  const startIdx = Math.floor(pts.length * 0.12);
  const endIdx   = Math.floor(pts.length * 0.88);
  const count    = depth === 1
    ? 2 + Math.floor(Math.random() * 3)  // 2–4 off the main channel
    : Math.floor(Math.random() * 2);     // 0–1 off each fork
  const gap = Math.floor((endIdx - startIdx) / (count + 1));
  if (gap < 1) return branches;

  for (let b = 0; b < count; b++) {
    const idx = Math.min(endIdx - 1,
      startIdx + gap * (b + 1) + Math.floor((Math.random() - 0.5) * gap * 0.6)
    );
    const p = pts[idx];
    if (!p) continue;

    const sign   = Math.random() < 0.5 ? 1 : -1;
    /* Forks stay in the parent's forward arc and narrow with depth. Letting
       the angle grow instead sends them sideways and backward, which reads
       as roots or veins rather than lightning. */
    const fork   = sign * (0.18 + Math.random() * 0.42) / (1 + depth * 0.4);
    const bAngle = parentAngle + fork;
    const bLen   = parentLen * (0.12 + Math.random() * 0.22);
    const bPts   = stepBolt(
      p.x, p.y,
      p.x + Math.cos(bAngle) * bLen,
      p.y + Math.sin(bAngle) * bLen,
      0.45, 18
    );

    branches.push({
      pts: bPts,
      branches: buildBranches(bPts, bAngle, bLen, depth + 1),
    });
  }

  return branches;
}

function buildBolt(x1, y1, x2, y2) {
  const jitter   = 0.75 + Math.random() * 0.7;
  const mainPts  = stepBolt(x1, y1, x2, y2, jitter, 15);
  const angle    = Math.atan2(y2 - y1, x2 - x1);
  const totalLen = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  return { pts: mainPts, branches: buildBranches(mainPts, angle, totalLen, 1) };
}

/* ─── Render helpers ─────────────────────────────────────────────── */
function strokePath(ctx, pts) {
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
}

/* Two diffuse glow passes over the whole path, then a tapered core drawn
   segment-by-segment. `taper` is how much width is lost by the tip: the
   main channel barely thins, forks nearly vanish. */
function drawSegment(ctx, pts, thickness, alpha, pal, taper) {
  if (pts.length < 2) return;

  // Outer glow
  strokePath(ctx, pts);
  ctx.lineWidth   = thickness * pal.outerW;
  ctx.strokeStyle = `rgba(${pal.glow},${(alpha * pal.outerA).toFixed(3)})`;
  ctx.shadowBlur  = pal.outerBlur;
  ctx.shadowColor = `rgba(${pal.glow},1)`;
  ctx.lineJoin = "round"; ctx.lineCap = "round";
  ctx.stroke();

  // Mid glow
  strokePath(ctx, pts);
  ctx.lineWidth   = thickness * pal.midW;
  ctx.strokeStyle = `rgba(${pal.glow},${(alpha * pal.midA).toFixed(3)})`;
  ctx.shadowBlur  = pal.midBlur;
  ctx.stroke();

  // Core, tapering toward the tip
  ctx.shadowBlur  = 0;
  ctx.strokeStyle = `rgba(${pal.core},${(alpha * pal.coreA).toFixed(3)})`;
  const last = pts.length - 1;
  for (let i = 1; i <= last; i++) {
    const t = i / last;
    ctx.lineWidth = Math.max(0.35, thickness * pal.coreMul * (1 - taper * t * t));
    ctx.beginPath();
    ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
    ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();
  }
}

function drawBoltTree(ctx, bolt, pal, depth = 0) {
  const thickness = BOLT_THICKNESS * Math.pow(0.45, depth);
  const alpha     = Math.pow(0.55, depth);
  const taper     = depth === 0 ? 0.3 : 0.75;
  drawSegment(ctx, bolt.pts, thickness, alpha, pal, taper);
  bolt.branches.forEach(b => drawBoltTree(ctx, b, pal, depth + 1));
}

/* ─── Offscreen bake ─────────────────────────────────────────────── */
/* A bolt's geometry never changes after it spawns, but its glow costs
   several blurred strokes per path. Render the whole tree once into its
   own bitmap; the frame loop then blits it and varies globalAlpha. */

function collectPaths(bolt, out) {
  out.push(bolt.pts);
  bolt.branches.forEach(b => collectPaths(b, out));
  return out;
}

function bakeBolt(bolt, pal, dpr) {
  const paths = collectPaths(bolt, []);
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const path of paths) {
    for (const p of path) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }
  }
  if (!Number.isFinite(minX)) return null;

  const ox = minX - BOLT_PAD, oy = minY - BOLT_PAD;
  const w  = Math.ceil(maxX - minX + BOLT_PAD * 2);
  const h  = Math.ceil(maxY - minY + BOLT_PAD * 2);

  const c = document.createElement("canvas");
  c.width  = Math.max(1, Math.round(w * dpr));
  c.height = Math.max(1, Math.round(h * dpr));
  const g = c.getContext("2d");
  // Map bolt coordinates into the bitmap: x_device = dpr * (x - ox)
  g.setTransform(dpr, 0, 0, dpr, -ox * dpr, -oy * dpr);
  drawBoltTree(g, bolt, pal);

  return { canvas: c, ox, oy, w, h };
}

function blitBolt(ctx, baked, alpha) {
  if (!baked || alpha <= 0) return;
  ctx.globalAlpha = Math.min(1, alpha);
  ctx.drawImage(baked.canvas, baked.ox, baked.oy, baked.w, baked.h);
  ctx.globalAlpha = 1;
}

/* ─── Envelopes ──────────────────────────────────────────────────── */

/* Smooth, time-driven brightness wobble. Summed sines rather than a
   frame-count modulo, so it never resolves into a strobe. */
function flickerAt(t, seed) {
  const n =
    Math.sin(t * 0.021 + seed)        * 0.5 +
    Math.sin(t * 0.047 + seed * 2.3)  * 0.3 +
    Math.sin(t * 0.089 + seed * 4.1)  * 0.2;
  return 0.62 + 0.38 * (n * 0.5 + 0.5);
}

function mainAlphaAt(t) {
  if (t < 120) return 1 - 0.45 * (t / 120);           // hot initial channel
  const tail = 1 - (t - 120) / (STRIKE_LIFE - 120);   // long dim decay
  return tail <= 0 ? 0 : 0.55 * Math.pow(tail, 1.6);
}

function afterAlphaAt(t) {
  if (t < AFTER_DELAY) return 0;
  const k = 1 - (t - AFTER_DELAY) / AFTER_LIFE;
  return k <= 0 ? 0 : 0.4 * k;
}

/* ─── Impact flash at strike point ───────────────────────────────── */
function drawImpactFlash(ctx, x, y, opacity, isDark) {
  if (opacity <= 0) return;

  const radius = (1 - opacity) * 80 + 10;
  const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
  if (isDark) {
    grad.addColorStop(0, `rgba(214,250,236,${(opacity * 0.7).toFixed(3)})`);
    grad.addColorStop(0.3, `rgba(94,234,212,${(opacity * 0.35).toFixed(3)})`);
    grad.addColorStop(1, `rgba(16,185,129,0)`);
  } else {
    grad.addColorStop(0, `rgba(4,72,52,${(opacity * 0.5).toFixed(3)})`);
    grad.addColorStop(0.25, `rgba(16,140,102,${(opacity * 0.22).toFixed(3)})`);
    grad.addColorStop(1, `rgba(16,140,102,0)`);
  }
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

/* ─── Component ──────────────────────────────────────────────────── */
export const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const themeRef  = useRef(theme);

  useEffect(() => { themeRef.current = theme; }, [theme]);

  useEffect(() => {
    const canvas  = canvasRef.current;
    const ctx     = canvas.getContext("2d");
    const section = canvas.parentElement;

    // Performance fallback: disable or reduce particles on low-end devices
    const isSmallViewport = window.innerWidth < 768;
    const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    const shouldDisableCanvas = isSmallViewport && isLowEndDevice;

    if (shouldDisableCanvas) {
      return; // Don't initialize canvas on low-end small devices
    }

    // Retina-correct backing store; the 2D context stays in CSS pixels.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;

    // Reduce particle count on small viewports or low-end devices
    const dashCount = (isSmallViewport || isLowEndDevice) ? 210 : 420;
    const dotCount = (isSmallViewport || isLowEndDevice) ? 70 : 140;

    const particles = [
      ...Array.from({ length: dashCount }, () => new Particle(1, 1, true)),
      ...Array.from({ length: dotCount }, () => new Particle(1, 1, false)),
    ];

    const strikes = [];

    /* Assigning canvas.width wipes the bitmap and resets the transform, so
       anything already painted has to be repainted — otherwise the observer
       firing on observe() erases a static frame the moment it's drawn. */
    const setSize = () => {
      const first = W === 0 || H === 0;
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      // Particles are built before the first measurement, so seed them here.
      if (first) particles.forEach(p => { p.x = Math.random() * W; p.y = Math.random() * H; });
      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      kick();
    };

    const pushParticles = (tx, ty, strength, radius) => {
      particles.forEach(p => p.repel(tx, ty, strength, radius));
    };

    const spawnLightning = (tx, ty) => {
      /* Always strike from above. Entering from a side edge produces a
         near-horizontal path that reads as a wire or vine, not a bolt; a
         wide horizontal spread gives the diagonal variety instead. */
      const ox = tx + (Math.random() - 0.5) * Math.max(560, W * 0.5);
      const oy = -10;

      const isDark  = themeRef.current === "dark";
      const pal     = isDark ? BOLT_DARK : BOLT_LIGHT;

      /* Keep the geometry alongside the bitmap: the palette is baked in, so a
         theme toggle mid-strike has to re-bake from the same path to avoid a
         dark bolt lingering over the light page. */
      const mainGeom  = buildBolt(ox, oy, tx, ty);
      const afterGeom = buildBolt(
        ox + (Math.random() - 0.5) * 60,
        oy + (Math.random() - 0.5) * 30,
        tx + (Math.random() - 0.5) * 20,
        ty + (Math.random() - 0.5) * 20
      );

      if (strikes.length >= MAX_STRIKES) strikes.shift();
      strikes.push({
        mainGeom, afterGeom,
        main:  bakeBolt(mainGeom,  pal, dpr),
        after: bakeBolt(afterGeom, pal, dpr),
        dark: isDark,
        tx, ty, age: 0, seed: Math.random() * 100,
      });
      kick();
    };

    /* Strike handler — always fires on click or tap */
    const strikeAt = (clientX, clientY, target) => {
      if (target && (target.closest("button") || target.closest("a"))) return;

      const rect = canvas.getBoundingClientRect();
      const tx = clientX - rect.left;
      const ty = clientY - rect.top;

      // Strong scatter burst on impact
      pushParticles(tx, ty, LIGHTNING_PARTICLE_FORCE, LIGHTNING_PARTICLE_RADIUS);
      spawnLightning(tx, ty);
    };

    /* One pointerdown covers mouse, touch and pen. Listening for mousedown
       and touchstart together double-fired on touch: the browser emits a
       synthetic mousedown after every uncanceled tap. */
    const handlePointerDown = (e) => strikeAt(e.clientX, e.clientY, e.target);

    section.addEventListener("pointerdown", handlePointerDown, { passive: true });

    let raf = null;
    let last = 0;
    let visible = true, onScreen = true;

    const renderFrame = (dt) => {
      const k = dt / FRAME;
      const isDark = themeRef.current === "dark";

      ctx.clearRect(0, 0, W, H);

      /* Age and retire strikes before anything reads s.age, so the whiteout
         below and the bolts further down are drawn from the same frame's
         ages. Aging inside the draw loop left the flash one frame behind. */
      for (let i = strikes.length - 1; i >= 0; i--) {
        strikes[i].age += dt;
        if (strikes[i].age >= STRIKE_LIFE) strikes.splice(i, 1);
      }

      // Screen flash while any strike is inside its whiteout window
      const flash = strikes.reduce(
        (m, s) => Math.max(m, s.age < SCREEN_FLASH ? 1 - s.age / SCREEN_FLASH : 0), 0
      );
      if (flash > 0) {
        ctx.fillStyle = isDark
          ? `rgba(214,250,236,${(0.15 * flash).toFixed(3)})`
          : `rgba(167,243,208,${(0.10 * flash).toFixed(3)})`;
        ctx.fillRect(0, 0, W, H);
      }

      // Update & draw particles
      particles.forEach(p => { p.w = W; p.h = H; p.update(k); p.draw(ctx, isDark); });

      // Strikes, newest last; already aged and retired above
      for (const s of strikes) {
        // Theme flipped while this strike is still alive — re-bake to match.
        if (s.dark !== isDark) {
          const pal = isDark ? BOLT_DARK : BOLT_LIGHT;
          s.main  = bakeBolt(s.mainGeom,  pal, dpr);
          s.after = bakeBolt(s.afterGeom, pal, dpr);
          s.dark  = isDark;
        }

        const flick = flickerAt(s.age, s.seed);
        blitBolt(ctx, s.main,  mainAlphaAt(s.age) * flick);
        blitBolt(ctx, s.after, afterAlphaAt(s.age) * flick * 0.5);
        drawImpactFlash(ctx, s.tx, s.ty, Math.max(0, 1 - s.age / IMPACT_LIFE), isDark);
      }
    };

    const wantsFrames = () => visible && onScreen;

    const loop = (now) => {
      // Clamp: RAF timestamps can predate `last`, and a resumed tab can
      // hand us a huge gap that would teleport every particle.
      const dt = Math.min(Math.max(now - last, 0), 50);
      last = now;
      renderFrame(dt);
      raf = wantsFrames() ? requestAnimationFrame(loop) : null;
    };

    /* Start the loop if it should be running; if it shouldn't, make sure
       the canvas still holds a painted frame rather than an empty bitmap. */
    const kick = () => {
      if (W === 0 || H === 0) return;
      if (raf !== null) return;
      if (wantsFrames()) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      } else {
        renderFrame(0);
      }
    };

    const pause = () => {
      if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
    };

    const sync = () => { if (visible && onScreen) kick(); else pause(); };

    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(section);

    const handleVisibility = () => { visible = !document.hidden; sync(); };
    document.addEventListener("visibilitychange", handleVisibility);

    const io = new IntersectionObserver(
      ([entry]) => { onScreen = entry.isIntersecting; sync(); },
      { threshold: 0 }
    );
    io.observe(section);

    sync();

    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      section.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:1 }}
      aria-hidden="true"
    />
  );
};
