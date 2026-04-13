"use client";

/**
 * Sine-style stroke between main content and `<Footer />` (scrolls with the page).
 * Hidden in print.
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

const STRIP_CSS_H = 26;
const STROKE_ALPHA = 0.52;
/** Full cycles of the fundamental across the strip width. */
const CYCLES = 1.55;
/** Small harmonic for “scope” feel without reading as separate bars. */
const H2 = 0.1;

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

/** Fixed viewBox path for reduced-motion (smooth sine, not bars). */
function staticSinePath(
  viewW: number,
  viewH: number,
  cycles: number,
  steps: number
): string {
  const mid = viewH * 0.52;
  const amp = viewH * 0.38;
  const parts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = t * viewW;
    const y = mid + amp * Math.sin(t * Math.PI * 2 * cycles);
    parts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(2)}`);
  }
  return parts.join(" ");
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

  const hide = isResumePrintPath(pathname);

  useEffect(() => {
    startTransition(() => {
      setMounted(true);
    });
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

    const samples = () =>
      Math.min(720, Math.max(160, Math.floor(canvas.width / 2.2)));

    const tick = (now: number) => {
      const dt = Math.min(0.06, Math.max(0, (now - lastFrameRef.current) / 1000));
      lastFrameRef.current = now;
      phaseRef.current += dt * 1.05;

      const cw = canvas.width;
      const ch = canvas.height;
      const mid = ch * 0.52;
      const amp = ch * 0.38;
      const n = samples();
      const ph = phaseRef.current;
      const breathe = 0.9 + 0.1 * Math.sin(now * 0.0009);

      ctx.clearRect(0, 0, cw, ch);

      const { cyan, violet } = brandRgb();
      const grad = ctx.createLinearGradient(0, 0, cw, 0);
      grad.addColorStop(0, rgba(violet, STROKE_ALPHA * 0.85));
      grad.addColorStop(0.45, rgba(cyan, STROKE_ALPHA));
      grad.addColorStop(1, rgba(violet, STROKE_ALPHA * 0.9));

      const dpr = cw / Math.max(1, wrap.getBoundingClientRect().width);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = Math.max(1.15, dpr * 1.25);

      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const t = i / n;
        const x = t * cw;
        const u = t * Math.PI * 2 * CYCLES + ph;
        const y =
          mid +
          amp *
            breathe *
            (Math.sin(u) + H2 * Math.sin(u * 2.05 + ph * 0.4));
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = grad;
      ctx.stroke();

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
          viewBox="0 0 400 26"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="wave-ribbon-static" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--brand-violet-muted)" stopOpacity="0.45" />
              <stop offset="50%" stopColor="var(--brand-cyan)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="var(--brand-violet-muted)" stopOpacity="0.45" />
            </linearGradient>
          </defs>
          <path
            fill="none"
            stroke="url(#wave-ribbon-static)"
            strokeWidth="1.6"
            strokeLinecap="round"
            d={staticSinePath(400, 26, CYCLES, 96)}
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
