import { useEffect, useRef } from "react";
import { useTheme } from "../useTheme";

/* ─── Color palettes ──────────────────────────────────────────────── */
const DASH_COLORS_DARK  = ["#2e82f7","#5666f8","#845cfd","#ab59fc","#4cc3fa"];
const DASH_COLORS_LIGHT = ["#f59e0b","#ec8106","#9e3ffd","#7041fd","#e231fd"];

/* ─── Interaction tuning ─────────────────────────────────────────── */
const LIGHTNING_PARTICLE_FORCE = 80;
const LIGHTNING_PARTICLE_RADIUS = 350;

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

  update() {
    this.angle += this.angleVel;
    this.ax *= 0.8; this.ay *= 0.8;
    this.x += Math.cos(this.angle) * this.speed + this.ax;
    this.y += Math.sin(this.angle) * this.speed + this.ay;
    if (this.isDash) this.rotation += this.rotSpeed;
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
      ctx.fillStyle   = isDark ? "#b4c8ff" : "#6b5b3d";
      ctx.beginPath(); ctx.arc(0, 0, this.radius, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
}

/* ─── Lightning ──────────────────────────────────────────────────── */

function stepBolt(x1, y1, x2, y2, jitter, segLen = 16) {
  const pts = [{ x: x1, y: y1 }];
  let cx = x1, cy = y1;
  const totalDist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const steps = Math.max(6, Math.floor(totalDist / segLen));
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

    cx += Math.cos(heading) * segLen;
    cy += Math.sin(heading) * segLen;
    pts.push({ x: cx, y: cy });
  }

  pts.push({ x: x2, y: y2 });
  return pts;
}

function buildBolt(x1, y1, x2, y2) {
  const jitter = 0.8 + Math.random() * 1.1;
  const mainPts = stepBolt(x1, y1, x2, y2, jitter, 15);

  const globalAngle = Math.atan2(y2 - y1, x2 - x1);
  const totalLen    = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  const branches = [];
  const startIdx = Math.floor(mainPts.length * 0.12);
  const endIdx   = Math.floor(mainPts.length * 0.88);
  const count    = 3 + Math.floor(Math.random() * 4); // 3–6 branches
  const gap      = Math.floor((endIdx - startIdx) / (count + 1));

  for (let b = 0; b < count; b++) {
    const idx = Math.min(endIdx - 1,
      startIdx + gap * (b + 1) + Math.floor((Math.random() - 0.5) * gap * 0.6)
    );
    const p = mainPts[idx];
    const sign   = Math.random() < 0.5 ? 1 : -1;
    const fork   = sign * (0.25 + Math.random() * 0.7);
    const bAngle = globalAngle + fork;
    const bLen   = totalLen * (0.12 + Math.random() * 0.22);

    branches.push({
      pts: stepBolt(
        p.x, p.y,
        p.x + Math.cos(bAngle) * bLen,
        p.y + Math.sin(bAngle) * bLen,
        0.45, 18
      ),
    });
  }

  return { pts: mainPts, branches };
}

/* ─── Render helpers ─────────────────────────────────────────────── */
function strokePath(ctx, pts) {
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
}

function drawSegment(ctx, pts, thickness, opacity, colorRGB, isMain) {
  if (pts.length < 2) return;
  const f = opacity * (0.82 + Math.random() * 0.18);

  // Outer glow
  strokePath(ctx, pts);
  ctx.lineWidth   = thickness * 11;
  ctx.strokeStyle = `rgba(${colorRGB},${(f * 0.07).toFixed(3)})`;
  ctx.shadowBlur  = 44;
  ctx.shadowColor = `rgba(${colorRGB},1)`;
  ctx.lineJoin = "round"; ctx.lineCap = "round";
  ctx.stroke();

  // Mid glow
  strokePath(ctx, pts);
  ctx.lineWidth   = thickness * 3.5;
  ctx.strokeStyle = `rgba(${colorRGB},${(f * 0.38).toFixed(3)})`;
  ctx.shadowBlur  = 12;
  ctx.stroke();

  // Core bright line
  strokePath(ctx, pts);
  ctx.lineWidth   = thickness;
  ctx.strokeStyle = `rgba(240,250,255,${(f * 0.96).toFixed(3)})`;
  ctx.shadowBlur  = 0;
  ctx.lineJoin    = isMain ? "miter" : "round";
  ctx.miterLimit  = 22;
  ctx.lineCap     = "butt";
  ctx.stroke();
}

function drawBoltTree(ctx, bolt, opacity, colorRGB) {
  drawSegment(ctx, bolt.pts, 2.4, opacity, colorRGB, true);
  bolt.branches.forEach(b =>
    drawSegment(ctx, b.pts, 0.7, opacity * 0.45, colorRGB, false)
  );
}

/* ─── Impact flash at strike point ───────────────────────────────── */
function drawImpactFlash(ctx, x, y, opacity, isDark) {
  if (opacity <= 0) return;

  // Expanding bright circle
  const radius = (1 - opacity) * 80 + 10;
  const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
  if (isDark) {
    grad.addColorStop(0, `rgba(200,225,255,${(opacity * 0.7).toFixed(3)})`);
    grad.addColorStop(0.3, `rgba(130,190,255,${(opacity * 0.35).toFixed(3)})`);
    grad.addColorStop(1, `rgba(91,156,246,0)`);
  } else {
    grad.addColorStop(0, `rgba(255,220,130,${(opacity * 0.75).toFixed(3)})`);
    grad.addColorStop(0.3, `rgba(255,180,40,${(opacity * 0.35).toFixed(3)})`);
    grad.addColorStop(1, `rgba(217,119,6,0)`);
  }
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

/* ─── Mouse-follow glow ──────────────────────────────────────────── */
function drawMouseGlow(ctx, x, y, isDark) {
  if (x < 0 || y < 0) return;
  const grad = ctx.createRadialGradient(x, y, 0, x, y, 200);
  if (isDark) {
    grad.addColorStop(0, "rgba(91,156,246,0.06)");
    grad.addColorStop(1, "rgba(91,156,246,0)");
  } else {
    grad.addColorStop(0, "rgba(79,70,229,0.05)");
    grad.addColorStop(1, "rgba(79,70,229,0)");
  }
  ctx.fillStyle = grad;
  ctx.fillRect(x - 200, y - 200, 400, 400);
}

/* ─── Component ──────────────────────────────────────────────────── */
export const ParticleCanvas = () => {
  const canvasRef    = useRef(null);
  const { theme }    = useTheme();
  const themeRef     = useRef(theme);
  const lightningRef = useRef(null);
  const mouseRef     = useRef({ x: -1, y: -1 });

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

    let W = 0, H = 0;
    const setSize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;
    };
    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(section);

    // Reduce particle count on small viewports or low-end devices
    const dashCount = (isSmallViewport || isLowEndDevice) ? 210 : 420;
    const dotCount = (isSmallViewport || isLowEndDevice) ? 70 : 140;
    
    const particles = [
      ...Array.from({ length: dashCount }, () => new Particle(W, H, true)),
      ...Array.from({ length: dotCount }, () => new Particle(W, H, false)),
    ];

    const pushParticles = (tx, ty, strength, radius) => {
      particles.forEach(p => p.repel(tx, ty, strength, radius));
    };

    const spawnLightning = (tx, ty, mode = 'click', intensity = 1) => {
      let ox;
      let oy;
      const edge = Math.random();

      if (mode === 'splash') {
        if (edge < 0.5) {
          ox = tx + (Math.random() - 0.5) * 320;
          oy = -10;
        } else if (edge < 0.75) {
          ox = -10;
          oy = ty + (Math.random() - 0.5) * 240;
        } else {
          ox = W + 10;
          oy = ty + (Math.random() - 0.5) * 240;
        }
      } else if (edge < 0.65) {
        ox = tx + (Math.random() - 0.5) * 400;
        oy = -10;
      } else if (edge < 0.82) {
        ox = -10;
        oy = ty + (Math.random() - 0.5) * 300;
      } else {
        ox = W + 10;
        oy = ty + (Math.random() - 0.5) * 300;
      }

      const mainBolt = buildBolt(ox, oy, tx, ty);
      const ox2 = ox + (Math.random() - 0.5) * 60;
      const oy2 = oy + (Math.random() - 0.5) * 30;
      const afterglowBolt = buildBolt(ox2, oy2, tx + (Math.random() - 0.5) * 20, ty + (Math.random() - 0.5) * 20);

      lightningRef.current = {
        bolt: mainBolt,
        afterglow: afterglowBolt,
        opacity: mode === 'splash' ? 0.82 * intensity : 1.0,
        afterOpacity: 0,
        afterDelay: mode === 'splash' ? 1 : 3,
        flashOpacity: mode === 'splash' ? 0.75 * intensity : 1.0,
        tx,
        ty,
        flickerCount: 0,
        flickerPhase: 0,
      };
    };

    /* Track mouse for ambient glow */
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    /* Strike handler — always fires on click */
    const handleStrike = (e) => {
      if (e.target.closest("button") || e.target.closest("a")) return;

      const rect = canvas.getBoundingClientRect();
      const tx = e.clientX - rect.left;
      const ty = e.clientY - rect.top;

      // Strong scatter burst on impact
      pushParticles(tx, ty, LIGHTNING_PARTICLE_FORCE, LIGHTNING_PARTICLE_RADIUS);
      spawnLightning(tx, ty, 'click', 1);
    };

    section.addEventListener("mousedown", handleStrike);
    section.addEventListener("mousemove", handleMouseMove);

    let raf;
    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      const isDark = themeRef.current === "dark";
      const l = lightningRef.current;

      // Screen flash on initial strike
      if (l && l.opacity > 0.92) {
        ctx.fillStyle = isDark ? "rgba(200,225,255,0.15)" : "rgba(255,220,130,0.08)";
        ctx.fillRect(0, 0, W, H);
      }

      // Ambient mouse glow
      drawMouseGlow(ctx, mouseRef.current.x, mouseRef.current.y, isDark);

      // Update & draw particles
      particles.forEach(p => { p.w = W; p.h = H; p.update(); p.draw(ctx, isDark); });

      // Lightning rendering with flicker
      if (l && l.opacity > 0) {
        ctx.save();
        const boltRGB = isDark ? "130,190,255" : "255,180,40";

        // Flicker effect — the bolt blinks 2-3 times during decay
        let flickerMul = 1;
        if (l.opacity < 0.7 && l.opacity > 0.1) {
          l.flickerPhase += 1;
          // Create short flicker bursts
          if (l.flickerPhase % 4 < 2) {
            flickerMul = 0.3 + Math.random() * 0.3;
          } else {
            flickerMul = 0.8 + Math.random() * 0.2;
          }
        }

        drawBoltTree(ctx, l.bolt, l.opacity * flickerMul, boltRGB);

        // Afterglow bolt (starts a few frames later, fainter)
        if (l.afterDelay > 0) {
          l.afterDelay -= 1;
        } else if (l.afterOpacity < 0.5 && l.opacity > 0.4) {
          l.afterOpacity = 0.35;
        }
        if (l.afterOpacity > 0) {
          drawBoltTree(ctx, l.afterglow, l.afterOpacity * flickerMul * 0.5, boltRGB);
          l.afterOpacity -= 0.015 + Math.random() * 0.01;
        }

        ctx.restore();

        // Impact flash
        drawImpactFlash(ctx, l.tx, l.ty, l.flashOpacity, isDark);
        l.flashOpacity -= 0.04 + Math.random() * 0.03;

        // Decay — faster at start, slower tail
        l.opacity -= l.opacity > 0.6
          ? 0.055 + Math.random() * 0.045
          : 0.018 + Math.random() * 0.025;
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      section.removeEventListener("mousedown", handleStrike);
      section.removeEventListener("mousemove", handleMouseMove);
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