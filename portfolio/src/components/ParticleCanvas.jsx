import { useEffect, useRef } from "react";
import { useTheme } from "../useTheme";

const DASH_COLORS_DARK = ["#5b9cf6", "#818cf8", "#a78bfa", "#c084fc", "#7dd3fc"];
const DASH_COLORS_LIGHT = ["#c0fa3a", "#c3fc3f", "#8bfd1f", "#aef739", "#33f76d"];

class Particle {
  constructor(w, h, isDash) {
    this.isDash = isDash;
    this.w = w;
    this.h = h;
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.angle = Math.random() * Math.PI * 2;
    this.angleVel = (Math.random() - 0.5) * 0.006;
    this.speed = Math.random() * 0.35 + 0.1;
    this.rotation = Math.random() * Math.PI * 2;

    if (isDash) {
      this.depth = Math.random();
      this.length = this.depth * 2 + 3;
      this.thick = this.depth * 2 + 3;
      this.colorIdx = Math.floor(Math.random() * 5);
      this.rotSpeed = (Math.random() - 0.5) * 0.004;
    } else {
      this.radius = Math.random() * 1.2 + 0.4;
    }

    this.ax = 0;
    this.ay = 0;
  }

  repel(targetX, targetY) {
    const dx = this.x - targetX;
    const dy = this.y - targetY;
    const distance = Math.sqrt(dx * dx + dy * dy) + 0.1;
    const forceRadius = 450;

    if (distance < forceRadius) {
      const force = (forceRadius - distance) / forceRadius;
      const strength = 45;
      this.ax += (dx / distance) * force * strength;
      this.ay += (dy / distance) * force * strength;
    }
  }

  update() {
    this.angle += this.angleVel;

    this.ax *= 0.8;
    this.ay *= 0.8;

    const vx = Math.cos(this.angle) * this.speed + this.ax;
    const vy = Math.sin(this.angle) * this.speed + this.ay;

    this.x += vx;
    this.y += vy;

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
      const colors = isDark ? DASH_COLORS_DARK : DASH_COLORS_LIGHT;
      ctx.globalAlpha = isDark ? 0.45 + this.depth * 0.35 : 0.55 + this.depth * 0.35;
      ctx.fillStyle = colors[this.colorIdx];

      ctx.beginPath();
      ctx.roundRect(
        -this.length / 2,
        -this.thick / 2,
        this.length,
        this.thick,
        this.thick / 2
      );
      ctx.fill();
    } else {
      ctx.globalAlpha = isDark ? 0.25 : 0.18;
      ctx.fillStyle = isDark ? "#b4c8ff" : "#282840";

      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

export const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  const lightningRef = useRef(null);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const section = canvas.parentElement;

    let W = 0;
    let H = 0;

    const setSize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };

    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(section);

    const particles = [
      ...Array.from({ length: 420 }, () => new Particle(W, H, true)),
      ...Array.from({ length: 140 }, () => new Particle(W, H, false)),
    ];

    function createFractalBolt(x1, y1, x2, y2, thickness, depth) {
      const results = [];
      const path = [{ x: x1, y: y1 }];

      const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      const segments = Math.max(8, Math.floor(dist / 14));

      for (let i = 1; i <= segments; i++) {
        const p = i / segments;

        const jitterX = (Math.random() - 0.5) * 28;
        const jitterY = Math.random() * 14;

        const nextX = x1 + (x2 - x1) * p + jitterX;
        const nextY = y1 + (y2 - y1) * p + jitterY;

        path.push({ x: nextX, y: nextY });

        if (depth > 0 && Math.random() > 0.93) {
          const splitAngle = Math.PI / 4 + (Math.random() - 0.5) * 0.8;
          const branchLength = 100 + Math.random() * 150;

          const bx = nextX + Math.cos(splitAngle) * branchLength;
          const by = nextY + Math.sin(splitAngle) * branchLength;

          results.push(
            ...createFractalBolt(nextX, nextY, bx, by, thickness * 0.5, depth - 1)
          );
        }
      }

      results.push({ path, thickness });
      return results;
    }

    function handleStrike(e) {
      if (e.target.closest("button") || e.target.closest("a")) return;

      const rect = canvas.getBoundingClientRect();
      const tx = e.clientX - rect.left;
      const ty = e.clientY - rect.top;

      particles.forEach((p) => p.repel(tx, ty));

      const startX = tx + (Math.random() - 0.5) * 350;

      const bolts = createFractalBolt(startX, 0, tx, ty, 2.5, 2);

      lightningRef.current = {
        bolts,
        opacity: 1,
      };
    }

    section.addEventListener("mousedown", handleStrike);

    function drawLightning(ctx) {
      const l = lightningRef.current;
      if (!l || l.opacity <= 0) return;

      const isDark = themeRef.current === "dark";
      const flicker = l.opacity * (0.85 + Math.random() * 0.15);
      const colorRGB = isDark ? "140,190,255" : "90,110,255";

      ctx.save();

      l.bolts.forEach(({ path, thickness }) => {
        function drawSmoothPath() {
          ctx.moveTo(path[0].x, path[0].y);

          for (let i = 1; i < path.length - 1; i++) {
            const xc = (path[i].x + path[i + 1].x) / 2;
            const yc = (path[i].y + path[i + 1].y) / 2;

            ctx.quadraticCurveTo(path[i].x, path[i].y, xc, yc);
          }
        }

        ctx.beginPath();
        ctx.lineWidth = thickness * 14;
        ctx.strokeStyle = `rgba(${colorRGB},${flicker * 0.05})`;
        ctx.shadowBlur = 60;
        ctx.shadowColor = `rgba(${colorRGB},1)`;
        drawSmoothPath();
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = thickness * 6;
        ctx.strokeStyle = `rgba(${colorRGB},${flicker * 0.2})`;
        ctx.shadowBlur = 35;
        drawSmoothPath();
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = thickness * 0.7;
        ctx.strokeStyle = `rgba(255,255,255,${flicker})`;
        ctx.shadowBlur = 0;
        drawSmoothPath();
        ctx.stroke();
      });

      ctx.restore();

      l.opacity -= 0.04 + Math.random() * 0.03;
    }

    let raf;

    function loop() {
      ctx.clearRect(0, 0, W, H);

      const isDark = themeRef.current === "dark";

      if (lightningRef.current && lightningRef.current.opacity > 0.88) {
        ctx.fillStyle = isDark
          ? `rgba(255,255,255,0.18)`
          : `rgba(0,0,150,0.07)`;
        ctx.fillRect(0, 0, W, H);
      }

      particles.forEach((p) => {
        p.w = W;
        p.h = H;
        p.update();
        p.draw(ctx, isDark);
      });

      drawLightning(ctx);

      raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      section.removeEventListener("mousedown", handleStrike);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
      aria-hidden="true"
    />
  );
};