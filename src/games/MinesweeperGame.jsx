import { useCallback, useEffect, useMemo, useState } from "react";

const GRID = 10;
const MINES = 15;

function createCell(x, y) {
  return {
    x,
    y,
    mine: false,
    adjacent: 0,
    revealed: false,
    flagged: false,
  };
}

function createEmptyBoard() {
  return Array.from({ length: GRID }, (_, y) =>
    Array.from({ length: GRID }, (_, x) => createCell(x, y))
  );
}

function getNeighbors(x, y) {
  const neighbors = [];

  for (let dy = -1; dy <= 1; dy += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      if (dx === 0 && dy === 0) continue;

      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && nx < GRID && ny >= 0 && ny < GRID) {
        neighbors.push({ x: nx, y: ny });
      }
    }
  }

  return neighbors;
}

function placeMines(excludeX, excludeY) {
  const blocked = new Set(
    [{ x: excludeX, y: excludeY }, ...getNeighbors(excludeX, excludeY)].map(
      ({ x, y }) => `${x},${y}`
    )
  );
  const candidates = [];

  for (let y = 0; y < GRID; y += 1) {
    for (let x = 0; x < GRID; x += 1) {
      const key = `${x},${y}`;
      if (!blocked.has(key)) candidates.push({ x, y });
    }
  }

  for (let i = candidates.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  return candidates.slice(0, MINES);
}

function buildBoard(excludeX, excludeY) {
  const board = createEmptyBoard();

  placeMines(excludeX, excludeY).forEach(({ x, y }) => {
    board[y][x].mine = true;
  });

  for (let y = 0; y < GRID; y += 1) {
    for (let x = 0; x < GRID; x += 1) {
      if (board[y][x].mine) continue;

      board[y][x].adjacent = getNeighbors(x, y).filter(
        ({ x: nx, y: ny }) => board[ny][nx].mine
      ).length;
    }
  }

  return board;
}

function cloneBoard(board) {
  return board.map((row) => row.map((cell) => ({ ...cell })));
}

function revealConnected(board, startX, startY) {
  const nextBoard = cloneBoard(board);
  const queue = [{ x: startX, y: startY }];

  while (queue.length) {
    const current = queue.shift();
    const cell = nextBoard[current.y][current.x];

    if (cell.revealed || cell.flagged) continue;

    cell.revealed = true;

    if (cell.adjacent !== 0 || cell.mine) continue;

    getNeighbors(current.x, current.y).forEach((neighbor) => {
      const neighborCell = nextBoard[neighbor.y][neighbor.x];
      if (!neighborCell.revealed && !neighborCell.mine) {
        queue.push(neighbor);
      }
    });
  }

  return nextBoard;
}

function revealAllMines(board) {
  return board.map((row) =>
    row.map((cell) => ({
      ...cell,
      revealed: cell.revealed || cell.mine,
    }))
  );
}

function checkWin(board) {
  return board.every((row) =>
    row.every((cell) => cell.mine || cell.revealed)
  );
}

function countFlags(board) {
  return board.flat().filter((cell) => cell.flagged).length;
}

const NUMBER_COLORS = [
  "",
  "#7ef58a",
  "#63b3ff",
  "#f6ad55",
  "#fc8181",
  "#a3e635",
  "#4fd1c5",
  "#f687b3",
  "#fbd38d",
];

export default function MinesweeperGame({ open, onClose }) {
  const [board, setBoard] = useState(() => createEmptyBoard());
  const [status, setStatus] = useState("ready");
  const [elapsed, setElapsed] = useState(0);

  const flagsUsed = useMemo(() => countFlags(board), [board]);
  const minesLeft = MINES - flagsUsed;

  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setStatus("ready");
    setElapsed(0);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const frame = requestAnimationFrame(() => {
      resetGame();
    });

    return () => cancelAnimationFrame(frame);
  }, [open, resetGame]);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open || status !== "playing") return undefined;

    const timer = setInterval(() => {
      setElapsed((current) => current + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [open, status]);

  useEffect(() => {
    if (!open) return undefined;

    const onKey = (event) => {
      const key = event.key.toLowerCase();
      if (!["escape", "r"].includes(key)) return;

      event.preventDefault();
      event.stopPropagation();

      if (key === "escape") {
        onClose();
        return;
      }

      resetGame();
    };

    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [onClose, open, resetGame]);

  const revealCell = useCallback((x, y) => {
    const current = board[y][x];
    if (status === "lost" || status === "won") return;

    // Chord click: clicking a revealed numbered cell auto-reveals all unflagged
    // neighbors when the number of adjacent flags matches the cell's number,
    // exactly like classic Minesweeper behavior.
    if (current.revealed && current.adjacent > 0) {
      const neighbors = getNeighbors(x, y);
      const flaggedCount = neighbors.filter(
        ({ x: nx, y: ny }) => board[ny][nx].flagged
      ).length;

      if (flaggedCount !== current.adjacent) return;

      const unflaggedHidden = neighbors.filter(
        ({ x: nx, y: ny }) => !board[ny][nx].revealed && !board[ny][nx].flagged
      );

      // If any unflagged hidden neighbor is a mine, it's game over
      const hitMine = unflaggedHidden.some(
        ({ x: nx, y: ny }) => board[ny][nx].mine
      );
      if (hitMine) {
        setBoard(revealAllMines(board));
        setStatus("lost");
        return;
      }

      let nextBoard = cloneBoard(board);
      unflaggedHidden.forEach(({ x: nx, y: ny }) => {
        nextBoard = revealConnected(nextBoard, nx, ny);
      });

      setBoard(nextBoard);
      if (checkWin(nextBoard)) setStatus("won");
      return;
    }

    if (current.revealed || current.flagged) return;

    if (status === "ready") {
      const nextBoard = revealConnected(buildBoard(x, y), x, y);
      setBoard(nextBoard);
      setStatus(checkWin(nextBoard) ? "won" : "playing");
      return;
    }

    if (current.mine) {
      setBoard(revealAllMines(board));
      setStatus("lost");
      return;
    }

    const nextBoard = revealConnected(board, x, y);
    setBoard(nextBoard);
    if (checkWin(nextBoard)) setStatus("won");
  }, [board, status]);

  const toggleFlag = useCallback((event, x, y) => {
    event.preventDefault();

    if (status === "lost" || status === "won") return;

    const current = board[y][x];
    if (current.revealed) return;

    const nextBoard = cloneBoard(board);
    nextBoard[y][x].flagged = !nextBoard[y][x].flagged;
    setBoard(nextBoard);
  }, [board, status]);

  if (!open) return null;

  return (
    <div className="snake-overlay">
      <div className="snake-modal mine-modal">
        <div className="snake-header">
          <span>mine.exe</span>
          <button onClick={onClose}>X</button>
        </div>

        <div className="snake-hud mine-hud">
          <span>mines: {minesLeft}</span>
          <span>time: {elapsed}s</span>
          <span>{status === "lost" ? "boom" : status === "won" ? "cleared" : "safe"}</span>
        </div>

        <div className="mine-board" role="grid" aria-label="10 by 10 minesweeper board">
          {board.map((row, y) =>
            row.map((cell, x) => {
              const cellLabel = cell.revealed
                ? cell.mine
                  ? "Mine"
                  : cell.adjacent > 0
                    ? `${cell.adjacent} adjacent mines`
                    : "Empty"
                : cell.flagged
                  ? "Flagged cell"
                  : "Hidden cell";

              return (
                <button
                  key={`${x}-${y}`}
                  type="button"
                  role="gridcell"
                  className={`mine-cell ${cell.revealed ? "mine-cell--revealed" : ""} ${cell.flagged ? "mine-cell--flagged" : ""} ${cell.mine && cell.revealed ? "mine-cell--mine" : ""}`}
                  onClick={() => revealCell(x, y)}
                  onContextMenu={(event) => toggleFlag(event, x, y)}
                  aria-label={`${cellLabel} at row ${y + 1}, column ${x + 1}`}
                >
                  {cell.revealed ? (
                    cell.mine ? (
                      "*"
                    ) : cell.adjacent > 0 ? (
                      <span style={{ color: NUMBER_COLORS[cell.adjacent] }}>
                        {cell.adjacent}
                      </span>
                    ) : (
                      ""
                    )
                  ) : cell.flagged ? (
                    "F"
                  ) : (
                    ""
                  )}
                </button>
              );
            })
          )}
        </div>

        <div className="mine-help">
          <span>left click: reveal</span>
          <span>right click: flag</span>
          <span>r: reset</span>
        </div>
      </div>
    </div>
  );
}