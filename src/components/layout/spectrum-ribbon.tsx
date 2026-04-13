"use client";

/**
 * Smooth sine-style stroke between main content and `<Footer />`.
 * Tuned for a calm “scope / line level” read (music-adjacent) without bar noise.
 */

import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

const STRIP_CSS_H = 38;
const STROKE_ALPHA = 0.55;
/** Base cycles across strip width; slow LFO nudges this slightly (“living” pitch). */
const CYCLES = 1.42;
const CYCLES_LFO = 0.11;
/** Tiny harmonic — large values read as rough high-frequency grit. */
const H2 = 0.028;

const MAX_SAMPLES = 1400;

function isResumePrintPath(pathname: string | null) {
  if (!pathname) return false;
  const normalized = pathname.replace(/\/+$/, "") || "/";
  return (
    normalized === "/resume/print" ||
    normalized.startsWith("/resume/print/")
  );
}

function parseCssHex(hex: string): [number, number, number] | null {
  const h = hex.trim();
  if (!h.startsWith("#") || (h.length !== 7 && h.length !== 4)) return null;
  if (h.length === 4) {
    const r = parseInt(h[1] + h[1], 16);
    const g = parseInt(h[2] + h[2], 16);
    const b = parseInt(h[3] + h[3], 16);
    return [r, g, b];
  }
  return [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
}

function brandRgb(): { cyan: [number, number, number]; violet: [number, number, number] } {
  const root = getComputedStyle(document.documentElement);
  const cyan = parseCssHex(root.getPropertyValue("--brand-cyan")) ?? [95, 212, 239];
  const violet =
    parseCssHex(root.getPropertyValue("--brand-violet-muted")) ?? [212, 203, 249];
  return { cyan, violet };
}

function rgba(c: [number, number, number], a: number) {
  return `rgba(${c[0]} ${c[1]} ${c[2]} / ${a})`;
}

function staticSinePath(
  viewW: number,
  viewH: number,
  cycles: number,
  steps: number
): string {
  const mid = viewH * 0.5;
  const amp = viewH * 0.46;
  const parts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = t * viewW;
    const y = mid + amp * Math.sin(t * Math.PI * 2 * cycles);
    parts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(2)}`);
  }
  return parts.join(" ");
}

/** 3-tap blur on interior samples (edges unchanged). */
function smooth1D(dst: Float32Array, src: Float32Array, len: number) {
  if (len < 3) return;
  dst[0] = src[0];
  dst[len - 1] = src[len - 1];
  for (let i = 1; i < len - 1; i++) {
    dst[i] = 0.22 * src[i - 1] + 0.56 * src[i] + 0.22 * src[i + 1];
  }
}

/** Quadratic spline through (x[i], y[i]) for a smooth stroke. */
function strokeSmoothPath(
  ctx: CanvasRenderingContext2D,
  xs: Float32Array,
  ys: Float32Array,
  len: number
) {
  if (len < 2) return;
  ctx.moveTo(xs[0], ys[0]);
  if (len === 2) {
    ctx.lineTo(xs[1], ys[1]);
    return;
  }
  for (let i = 1; i < len - 2; i++) {
    const xc = (xs[i] + xs[i + 1]) * 0.5;
    const yc = (ys[i] + ys[i + 1]) * 0.5;
    ctx.quadraticCurveTo(xs[i], ys[i], xc, yc);
  }
  ctx.quadraticCurveTo(
    xs[len - 2],
    ys[len - 2],
    xs[len - 1],
    ys[len - 1]
  );
}

export function SpectrumRibbon() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(0);
  const rafRef = useRef(0);
  const lastFrameRef = useRef(0);
  const rawYRef = useRef<Float32Array | null>(null);
  const smYRef = useRef<Float32Array | null>(null);
  const xBufRef = useRef<Float32Array | null>(null);

  const hide = isResumePrintPath(pathname);

  useEffect(() => {
    startTransition(() => {
      setMounted(true);
    });
  }, []);

  useEffect(() => {
    rawYRef.current = new Float32Array(MAX_SAMPLES);
    smYRef.current = new Float32Array(MAX_SAMPLES);
    xBufRef.current = new Float32Array(MAX_SAMPLES);
  }, []);

  const resize = useCallback(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const w = Math.max(1, Math.floor(wrap.getBoundingClientRect().width));
    const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(STRIP_CSS_H * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${STRIP_CSS_H}px`;
  }, []);

  useEffect(() => {
    if (!mounted || hide || reduceMotion) return;

    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    resize();
    lastFrameRef.current = performance.now();

    const ro = new ResizeObserver(() => resize());
    ro.observe(wrap);
    window.addEventListener("resize", resize);

    const sampleCount = () => {
      const cw = canvas.width;
      return Math.min(
        MAX_SAMPLES - 1,
        Math.max(180, Math.floor(cw * 0.85))
      );
    };

    const tick = (now: number) => {
      const dt = Math.min(0.06, Math.max(0, (now - lastFrameRef.current) / 1000));
      lastFrameRef.current = now;
      phaseRef.current += dt * 0.95;

      const cw = canvas.width;
      const ch = canvas.height;
      const mid = ch * 0.5;
      const amp = ch * 0.5;
      const n = sampleCount();
      const len = n + 1;
      const ph = phaseRef.current;
      const breathe = 0.88 + 0.12 * Math.sin(now * 0.00075);
      const cycles =
        CYCLES + CYCLES_LFO * Math.sin(now * 0.00032);

      const rawY = rawYRef.current;
      const smY = smYRef.current;
      const xBuf = xBufRef.current;
      if (!rawY || !smY || !xBuf || len > MAX_SAMPLES) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      for (let i = 0; i < len; i++) {
        const t = i / n;
        xBuf[i] = t * cw;
        const u = t * Math.PI * 2 * cycles + ph;
        rawY[i] =
          mid +
          amp *
            breathe *
            (Math.sin(u) + H2 * Math.sin(u * 2.02 + ph * 0.35));
      }

      smooth1D(smY, rawY, len);
      smooth1D(rawY, smY, len);

      ctx.clearRect(0, 0, cw, ch);
      ctx.save();
      ctx.translate(0, 0.5);

      const { cyan, violet } = brandRgb();
      const grad = ctx.createLinearGradient(0, 0, cw, 0);
      grad.addColorStop(0, rgba(violet, STROKE_ALPHA * 0.82));
      grad.addColorStop(0.48, rgba(cyan, STROKE_ALPHA));
      grad.addColorStop(1, rgba(violet, STROKE_ALPHA * 0.88));

      const dpr = cw / Math.max(1, wrap.getBoundingClientRect().width);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      strokeSmoothPath(ctx, xBuf, rawY, len);

      ctx.strokeStyle = rgba(cyan, 0.14);
      ctx.lineWidth = Math.max(2.4, dpr * 2.6);
      ctx.stroke();

      ctx.strokeStyle = grad;
      ctx.lineWidth = Math.max(1.35, dpr * 1.55);
      ctx.stroke();

      ctx.restore();

      rafRef.current = requestAnimationFrame(tick);
    };

    const onVis = () => {
      if (document.visibilityState === "hidden") {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      } else if (!rafRef.current) {
        lastFrameRef.current = performance.now();
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [mounted, hide, reduceMotion, resize]);

  if (!mounted || hide) return null;

  if (reduceMotion) {
    return (
      <div
        ref={wrapRef}
        className="print:hidden pointer-events-none w-full shrink-0 border-t border-border/30 bg-background/90"
        aria-hidden
      >
        <svg
          className="block w-full"
          style={{ height: STRIP_CSS_H }}
          viewBox={`0 0 400 ${STRIP_CSS_H}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="wave-ribbon-static" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--brand-violet-muted)" stopOpacity="0.48" />
              <stop offset="50%" stopColor="var(--brand-cyan)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="var(--brand-violet-muted)" stopOpacity="0.48" />
            </linearGradient>
          </defs>
          <path
            fill="none"
            stroke="url(#wave-ribbon-static)"
            strokeWidth="2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            d={staticSinePath(400, STRIP_CSS_H, CYCLES, 128)}
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      className="print:hidden pointer-events-none w-full shrink-0 border-t border-border/30 bg-background/90"
      aria-hidden
    >
      <canvas ref={canvasRef} className="block w-full" />
    </div>
  );
}
