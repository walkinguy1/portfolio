import { useEffect, useRef, useState, useCallback } from "react";

const GRID = 20;
const CELL = 16;
const SIZE = GRID * CELL;
const HIGH_KEY = "origami-snake-high";

const DIR_VEC = {
  U: { x: 0, y: -1 },
  D: { x: 0, y: 1 },
  L: { x: -1, y: 0 },
  R: { x: 1, y: 0 },
};

const OPP = { U: "D", D: "U", L: "R", R: "L" };

function randCell(snake) {
  while (true) {
    const c = {
      x: Math.floor(Math.random() * GRID),
      y: Math.floor(Math.random() * GRID),
    };
    if (!snake.some((s) => s.x === c.x && s.y === c.y)) return c;
  }
}

export default function SnakeGame({ open, onClose }) {
  const canvasRef = useRef(null);

  const stateRef = useRef(null);
  const highRef = useRef(0);

  const [score, setScore] = useState(0);
  const [high, setHigh] = useState(0);
  const [, forceRender] = useState(0);

  // Load high score (safe, deferred)
  useEffect(() => {
    const h = parseInt(localStorage.getItem(HIGH_KEY) || "0", 10);

    requestAnimationFrame(() => {
      setHigh(h);
    });

    highRef.current = h;
  }, []);

  // Reset game logic ONLY (no React state)
  const resetRef = useCallback(() => {
    stateRef.current = {
      snake: [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }],
      dir: "R",
      nextDir: "R",
      food: randCell([{ x: 10, y: 10 }]),
      paused: false,
      dead: false,
      score: 0,
    };
  }, []);

  // Reset UI safely
  const resetUI = useCallback(() => {
    setScore(0);
  }, []);

  // Handle open → reset (FIXED: no sync setState)
  useEffect(() => {
    if (!open) return;

    resetRef();

    requestAnimationFrame(() => {
      resetUI();
    });

  }, [open, resetRef, resetUI]);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // GAME LOOP
  useEffect(() => {
    if (!open) return;

    let raf;
    let last = performance.now();
    let acc = 0;

    const step = (now) => {
      const dt = now - last;
      last = now;

      const s = stateRef.current;
      if (!s) return;

      if (!s.paused && !s.dead) {
        acc += dt;

        const speed = Math.max(60, 110 - Math.floor(s.score / 50) * 5);

        while (acc >= speed) {
          acc -= speed;

          if (s.nextDir !== OPP[s.dir]) s.dir = s.nextDir;

          const v = DIR_VEC[s.dir];
          const head = s.snake[0];
          const next = { x: head.x + v.x, y: head.y + v.y };

          // Wall collision
          if (
            next.x < 0 || next.x >= GRID ||
            next.y < 0 || next.y >= GRID
          ) {
            s.dead = true;
            break;
          }

          // Self collision
          if (s.snake.some((c) => c.x === next.x && c.y === next.y)) {
            s.dead = true;
            break;
          }

          s.snake.unshift(next);

          if (next.x === s.food.x && next.y === s.food.y) {
            s.score += 10;
            setScore(s.score);

            s.food = randCell(s.snake);

            if (s.score > highRef.current) {
              highRef.current = s.score;
              setHigh(s.score);
              localStorage.setItem(HIGH_KEY, String(s.score));
            }
          } else {
            s.snake.pop();
          }
        }
      }

      draw();
      forceRender((t) => t + 1);

      raf = requestAnimationFrame(step);
    };

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      const s = stateRef.current;

      ctx.fillStyle = "#0d1f0d";
      ctx.fillRect(0, 0, SIZE, SIZE);

      // Grid
      ctx.strokeStyle = "#143614";
      for (let i = 0; i <= GRID; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL + 0.5, 0);
        ctx.lineTo(i * CELL + 0.5, SIZE);
        ctx.moveTo(0, i * CELL + 0.5);
        ctx.lineTo(SIZE, i * CELL + 0.5);
        ctx.stroke();
      }

      // Food
      ctx.fillStyle = "#ff5a5a";
      ctx.fillRect(
        s.food.x * CELL + 2,
        s.food.y * CELL + 2,
        CELL - 4,
        CELL - 4
      );

      // Snake
      s.snake.forEach((seg, i) => {
        ctx.fillStyle = i === 0 ? "#7ef58a" : "#3fc94d";
        ctx.fillRect(
          seg.x * CELL + 1,
          seg.y * CELL + 1,
          CELL - 2,
          CELL - 2
        );
      });

      // Overlay
      if (s.paused || s.dead) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, SIZE, SIZE);

        ctx.fillStyle = "#7ef58a";
        ctx.font = "bold 20px monospace";
        ctx.textAlign = "center";

        ctx.fillText(
          s.dead ? "GAME OVER" : "PAUSED",
          SIZE / 2,
          SIZE / 2
        );
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [open]);

  // CONTROLS
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      const s = stateRef.current;
      if (!s) return;

      const key = e.key.toLowerCase();
      const shouldBlock = [
        "escape",
        " ",
        "r",
        "arrowup",
        "arrowdown",
        "arrowleft",
        "arrowright",
        "w",
        "a",
        "s",
        "d",
      ].includes(key);

      if (shouldBlock) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (key === "escape") return onClose();

      if (e.key === " ") {
        s.paused = !s.paused;
        return;
      }

      if (key === "r") {
        resetRef();
        resetUI();
        return;
      }

      if (s.dead) return;

      if (key === "arrowup" || key === "w") s.nextDir = "U";
      if (key === "arrowdown" || key === "s") s.nextDir = "D";
      if (key === "arrowleft" || key === "a") s.nextDir = "L";
      if (key === "arrowright" || key === "d") s.nextDir = "R";
    };

    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [open, onClose, resetRef, resetUI]);

  // Pause on tab switch
  useEffect(() => {
    const onBlur = () => {
      if (stateRef.current) stateRef.current.paused = true;
    };
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, []);

  if (!open) return null;

  return (
    <div className="snake-overlay">
      <div className="snake-modal">
        <div className="snake-header">
          <span>snake.py</span>
          <button onClick={onClose}>X</button>
        </div>

        <div className="snake-hud">
          <span>score: {score}</span>
          <span>high: {high}</span>
        </div>

        <div style={{ position: "relative" }}>
          <canvas ref={canvasRef} width={SIZE} height={SIZE} />
          <div className="crt" />
        </div>
        <div className="snake-help">
          <span>w a s d (or arrow keys): move</span>
          <span>esc: close</span>
          <span>r: reset</span>
        </div>
      </div>
    </div>
  );
}
