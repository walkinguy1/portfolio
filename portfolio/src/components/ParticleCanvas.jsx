import { useEffect, useRef } from 'react';
import { useTheme } from '../useTheme';

const DASH_COLORS_DARK  = ['#5b9cf6','#818cf8','#a78bfa','#c084fc','#7dd3fc'];
const DASH_COLORS_LIGHT = ['#e53935','#c62828','#fb8c00','#fdd835','#ad1457'];

class Particle {
  constructor(w, h, isDash) {
    this.isDash = isDash;
    this.w = w;
    this.h = h;
    // Random position within canvas
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    // Slow random drift angle — this is what creates the wavy feel
    this.angle    = Math.random() * Math.PI * 2;
    this.angleVel = (Math.random() - 0.5) * 0.006; // how fast direction changes
    this.speed    = Math.random() * 0.35 + 0.1;    // px/frame
    this.vx = Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;
    this.rotation = Math.random() * Math.PI * 2;

    if (isDash) {
      this.depth    = Math.random();
      this.length   = this.depth * 6 + 3;
      this.thick    = this.depth * 1.5 + 1;
      this.colorIdx = Math.floor(Math.random() * 5);
      this.rotSpeed = (Math.random() - 0.5) * 0.004;
    } else {
      this.radius = Math.random() * 1.2 + 0.4;
    }
  }

  update(mouseX, mouseY) {
    // Slowly curve the drift direction — this makes the wavy/floaty motion
    this.angle    += this.angleVel;
    this.angleVel += (Math.random() - 0.5) * 0.0008; // gentle noise on turn rate
    this.angleVel  = Math.max(-0.012, Math.min(0.012, this.angleVel)); // clamp

    this.vx = Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;

    // Cursor repulsion — soft nudge, no snapping
    if (mouseX !== null) {
      const dx   = this.x - mouseX;
      const dy   = this.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const R    = 300; // repel radius
      if (dist < R && dist > 0) {
        const strength = (1 - dist / R) * 1.4;
        this.vx += (dx / dist) * strength;
        this.vy += (dy / dist) * strength;
      }
    }

    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.isDash ? this.rotSpeed : 0;

    // Wrap within banner canvas bounds
    if (this.x < -10) this.x = this.w + 10;
    if (this.x > this.w + 10) this.x = -10;
    if (this.y < -10) this.y = this.h + 10;
    if (this.y > this.h + 10) this.y = -10;
  }

  draw(ctx, isDark) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    if (this.isDash) {
      const colors = isDark ? DASH_COLORS_DARK : DASH_COLORS_LIGHT;
      ctx.globalAlpha = isDark
        ? 0.45 + this.depth * 0.35
        : 0.55 + this.depth * 0.35;
      ctx.fillStyle = colors[this.colorIdx];
      ctx.beginPath();
      ctx.roundRect(-this.length / 2, -this.thick / 2, this.length, this.thick, this.thick / 2);
      ctx.fill();
    } else {
      ctx.globalAlpha = isDark ? 0.25 : 0.18;
      ctx.fillStyle   = isDark ? '#b4c8ff' : '#282840';
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
  const themeRef  = useRef(theme);

  useEffect(() => { themeRef.current = theme; }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Size canvas to match the banner section
    let W = 0, H = 0;
    const setSize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W;
      canvas.height = H;
    };
    setSize();

    const ro = new ResizeObserver(setSize);
    ro.observe(canvas.parentElement);

    // 120 dashes + 70 ambient dots
    let particles = [
      ...Array.from({ length: 420 }, () => new Particle(W, H, true)),
      ...Array.from({ length: 140  }, () => new Particle(W, H, false)),
    ];

    // Mouse coords relative to the canvas (banner-local)
    let mouseX = null;
    let mouseY = null;

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    const onMouseLeave = () => { mouseX = null; mouseY = null; };

    // Listen on the banner section (parent of canvas)
    const section = canvas.parentElement;
    section.addEventListener('mousemove', onMouseMove);
    section.addEventListener('mouseleave', onMouseLeave);

    let rafId;
    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      const isDark = themeRef.current === 'dark';
      particles.forEach(p => {
        // Keep particle bounds in sync if canvas resized
        p.w = W; p.h = H;
        p.update(mouseX, mouseY);
        p.draw(ctx, isDark);
      });
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      section.removeEventListener('mousemove', onMouseMove);
      section.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
      aria-hidden="true"
    />
  );
};