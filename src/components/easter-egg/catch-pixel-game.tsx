"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

/** Internal canvas resolution (CSS size matches; DPR scales backing store). */
const W = 640;
const H = 360;
const PADDLE_W = 112;
const PADDLE_H = 9;
const PADDLE_MARGIN = 20;
const BALL = 9;
const BASE_SPEED = 3.15;
const MAX_SPEED = 5.75;
/** Pixels per ~16.7ms at full keyboard deflection; scaled by frame delta. */
const PADDLE_KEYBOARD_SPEED = 15;
const PADDLE_TOP_Y = H - PADDLE_MARGIN - PADDLE_H;

type GamePhase = "ready" | "playing" | "gameover";

export function CatchPixelGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const keysRef = useRef({ left: false, right: false });
  const phaseRef = useRef<GamePhase>("ready");
  const missPendingRef = useRef(false);
  const scoreRef = useRef(0);

  const ballRef = useRef({
    x: W * 0.5,
    y: H * 0.35,
    vx: BASE_SPEED * 0.85,
    vy: BASE_SPEED,
  });
  const paddleRef = useRef(W * 0.5);
  const speedRef = useRef(1);
  const lastTsRef = useRef(0);

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  const resetBall = useCallback(() => {
    missPendingRef.current = false;
    speedRef.current = 1;
    ballRef.current = {
      x: W * 0.5,
      y: H * 0.28,
      vx: (Math.random() > 0.5 ? 1 : -1) * BASE_SPEED * 0.9,
      vy: BASE_SPEED,
    };
  }, []);

  const startRound = useCallback(() => {
    phaseRef.current = "playing";
    resetBall();
    lastTsRef.current = performance.now();
  }, [resetBall]);

  const loseLife = useCallback(() => {
    setLives((lv) => {
      const next = lv - 1;
      if (next <= 0) {
        phaseRef.current = "gameover";
      } else {
        resetBall();
      }
      return next;
    });
  }, [resetBall]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
      const layoutW = wrap.clientWidth > 0 ? wrap.clientWidth : W;
      const cssW = Math.floor(Math.min(W, Math.max(280, layoutW)));
      const cssH = Math.floor(cssW * (H / W));
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      const sx = (cssW * dpr) / W;
      const sy = (cssH * dpr) / H;
      ctx.setTransform(sx, 0, 0, sy, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const tick = (ts: number) => {
      const ball = ballRef.current;
      const ph = phaseRef.current;
      const padX = paddleRef.current;

      if (ph === "playing") {
        if (!lastTsRef.current) lastTsRef.current = ts;
        const dt = Math.min(40, ts - lastTsRef.current);
        lastTsRef.current = ts;
        const step = (dt / 16) * PADDLE_KEYBOARD_SPEED;
        if (keysRef.current.left) paddleRef.current -= step;
        if (keysRef.current.right) paddleRef.current += step;
        paddleRef.current = Math.max(
          PADDLE_W * 0.5 + 2,
          Math.min(W - PADDLE_W * 0.5 - 2, paddleRef.current)
        );

        const sp = speedRef.current;
        ball.x += ball.vx * sp;
        ball.y += ball.vy * sp;

        const half = BALL * 0.5;
        if (ball.x < half) {
          ball.x = half;
          ball.vx = Math.abs(ball.vx);
        } else if (ball.x > W - half) {
          ball.x = W - half;
          ball.vx = -Math.abs(ball.vx);
        }
        if (ball.y < half) {
          ball.y = half;
          ball.vy = Math.abs(ball.vy);
        }

        const padLeft = padX - PADDLE_W * 0.5;
        const ballBottom = ball.y + half;
        const ballTop = ball.y - half;
        if (
          ballBottom >= PADDLE_TOP_Y &&
          ballTop <= PADDLE_TOP_Y + PADDLE_H &&
          ball.vy > 0
        ) {
          if (ball.x >= padLeft - half && ball.x <= padLeft + PADDLE_W + half) {
            missPendingRef.current = false;
            ball.y = PADDLE_TOP_Y - half - 0.01;
            ball.vy = -Math.abs(ball.vy);
            const hit = (ball.x - (padLeft + PADDLE_W * 0.5)) / (PADDLE_W * 0.5);
            ball.vx += hit * 1.35;
            ball.vx = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, ball.vx));
            speedRef.current = Math.min(
              MAX_SPEED / BASE_SPEED,
              speedRef.current * 1.035
            );
            setScore((s) => {
              const n = s + 1;
              scoreRef.current = n;
              return n;
            });
          }
        }

        if (ball.y - half > H + 2 && !missPendingRef.current) {
          missPendingRef.current = true;
          loseLife();
        }
      }

      ctx.fillStyle = "#0a0a0c";
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = "rgba(95, 212, 239, 0.12)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= W; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, H);
        ctx.stroke();
      }
      ctx.strokeStyle = "rgba(212, 203, 249, 0.08)";
      ctx.beginPath();
      ctx.moveTo(0, PADDLE_TOP_Y + 0.5);
      ctx.lineTo(W, PADDLE_TOP_Y + 0.5);
      ctx.stroke();

      const padDraw = paddleRef.current;
      const padLeft = padDraw - PADDLE_W * 0.5;
      ctx.fillStyle = "rgba(212, 203, 249, 0.85)";
      ctx.fillRect(padLeft, PADDLE_TOP_Y, PADDLE_W, PADDLE_H);

      ctx.fillStyle = "#5fd4ef";
      ctx.fillRect(
        Math.round(ball.x - BALL * 0.5),
        Math.round(ball.y - BALL * 0.5),
        BALL,
        BALL
      );

      if (ph === "ready" || ph === "gameover") {
        ctx.fillStyle = "rgba(10, 10, 12, 0.72)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "rgba(212, 203, 249, 0.92)";
        ctx.font = "600 15px var(--font-jetbrains-mono), ui-monospace, monospace";
        ctx.textAlign = "center";
        if (ph === "ready") {
          ctx.fillText("Catch the pixel before it slips past.", W * 0.5, H * 0.44);
          ctx.fillStyle = "rgba(95, 212, 239, 0.85)";
          ctx.font = "500 13px var(--font-jetbrains-mono), ui-monospace, monospace";
          ctx.fillText("←/→ or A/D · drag · Space to start", W * 0.5, H * 0.58);
        } else {
          ctx.fillText(
            `Game over · ${scoreRef.current} caught`,
            W * 0.5,
            H * 0.46
          );
          ctx.fillStyle = "rgba(95, 212, 239, 0.85)";
          ctx.font = "500 13px var(--font-jetbrains-mono), ui-monospace, monospace";
          ctx.fillText("Space to play again", W * 0.5, H * 0.58);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [loseLife]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") {
        keysRef.current.left = e.type === "keydown";
      }
      if (e.code === "ArrowRight" || e.code === "KeyD") {
        keysRef.current.right = e.type === "keydown";
      }
      if (e.code === "Space") {
        if (phaseRef.current === "ready" || phaseRef.current === "gameover") {
          e.preventDefault();
          if (phaseRef.current === "gameover") {
            setScore(0);
            scoreRef.current = 0;
            setLives(3);
          }
          startRound();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, [startRound]);

  const onPointerMove = (e: React.PointerEvent) => {
    if (phaseRef.current !== "playing") return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * W;
    paddleRef.current = Math.max(
      PADDLE_W * 0.5 + 2,
      Math.min(W - PADDLE_W * 0.5 - 2, x)
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4">
      <div className="flex w-full items-center justify-between font-mono text-xs text-muted-foreground">
        <span>
          score <span className="text-foreground tabular-nums">{score}</span>
        </span>
        <span>
          lives <span className="text-foreground tabular-nums">{lives}</span>
        </span>
      </div>
      <div
        ref={wrapRef}
        className="rounded-lg border border-border/60 bg-card/40 p-2 shadow-lg"
      >
        <canvas
          ref={canvasRef}
          className="block w-full max-w-[640px] touch-none [image-rendering:pixelated]"
          onPointerMove={onPointerMove}
          onPointerDown={(e) => {
            canvasRef.current?.setPointerCapture(e.pointerId);
            onPointerMove(e);
          }}
        />
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Walls and ceiling bounce. Only the bottom is a miss; keep the paddle under
        the cyan pixel.
      </p>
      <Link
        href="/"
        className="text-sm text-brand-cyan underline-offset-4 hover:underline"
      >
        ← Back to the site
      </Link>
    </div>
  );
}
