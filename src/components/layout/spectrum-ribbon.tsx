"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

const BAR_CSS = 2;
const GAP_CSS = 1;
const STRIP_CSS_PX = 3;
const LERP = 2.8;
const TARGET_INTERVAL_MS = 420;
const MAX_ALPHA = 0.2;

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

function mix(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): string {
  const u = Math.min(1, Math.max(0, t));
  const r = Math.round(a[0] + (b[0] - a[0]) * u);
  const g = Math.round(a[1] + (b[1] - a[1]) * u);
  const bl = Math.round(a[2] + (b[2] - a[2]) * u);
  return `rgb(${r} ${g} ${bl})`;
}

export function SpectrumRibbon() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const valuesRef = useRef<number[]>([]);
  const targetsRef = useRef<number[]>([]);
  const lastResampleRef = useRef(0);
  const rafRef = useRef(0);
  const lastFrameRef = useRef(0);

  const hide = isResumePrintPath(pathname);

  useEffect(() => {
    startTransition(() => {
      setMounted(true);
    });
  }, []);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
    const w = Math.floor(window.innerWidth);
    const h = Math.ceil(STRIP_CSS_PX * dpr);
    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, h);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${STRIP_CSS_PX}px`;

    const slice = (BAR_CSS + GAP_CSS) * dpr;
    const n = Math.max(8, Math.floor(canvas.width / slice));
    const prevV = valuesRef.current;
    const prevT = targetsRef.current;
    if (prevV.length !== n) {
      valuesRef.current = Array.from({ length: n }, (_, i) =>
        prevV[i] ?? 0.22 + Math.random() * 0.58
      );
      targetsRef.current = Array.from({ length: n }, (_, i) =>
        prevT[i] ?? 0.22 + Math.random() * 0.58
      );
    }
  }, []);

  useEffect(() => {
    if (!mounted || hide || reduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    resize();
    lastResampleRef.current = performance.now();
    lastFrameRef.current = performance.now();

    const pickTargets = () => {
      const n = targetsRef.current.length;
      for (let i = 0; i < n; i++) {
        if (Math.random() < 0.35) {
          targetsRef.current[i] = 0.12 + Math.random() * 0.88;
        }
      }
    };

    const ro = new ResizeObserver(() => resize());
    ro.observe(document.documentElement);
    window.addEventListener("resize", resize);

    const tick = (now: number) => {
      const dt = Math.min(0.055, Math.max(0, (now - lastFrameRef.current) / 1000));
      lastFrameRef.current = now;

      if (now - lastResampleRef.current > TARGET_INTERVAL_MS) {
        lastResampleRef.current = now;
        pickTargets();
      }

      const vals = valuesRef.current;
      const targs = targetsRef.current;
      for (let i = 0; i < vals.length; i++) {
        vals[i] += (targs[i] - vals[i]) * Math.min(1, dt * LERP);
      }

      const { cyan, violet } = brandRgb();
      const w = Math.max(1, window.innerWidth);
      const dpr = canvas.width / w;
      const slice = (BAR_CSS + GAP_CSS) * dpr;
      const barW = BAR_CSS * dpr;
      const ch = canvas.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = MAX_ALPHA;

      for (let i = 0; i < vals.length; i++) {
        const v = vals[i];
        const h = Math.max(0.5 * dpr, v * ch * 0.92);
        const x = i * slice;
        ctx.fillStyle = mix(violet, cyan, v);
        ctx.fillRect(x, ch - h, barW, h);
      }
      ctx.globalAlpha = 1;

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
        className="pointer-events-none fixed bottom-0 left-0 right-0 z-[15] h-[3px] opacity-[0.38]"
        style={{
          background:
            "linear-gradient(90deg, color-mix(in srgb, var(--brand-violet-muted) 42%, transparent), color-mix(in srgb, var(--brand-cyan) 48%, transparent), color-mix(in srgb, var(--brand-cta-from) 32%, transparent), color-mix(in srgb, var(--brand-cyan) 46%, transparent), color-mix(in srgb, var(--brand-violet-muted) 42%, transparent))",
        }}
        aria-hidden
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed bottom-0 left-0 right-0 z-[15]"
      aria-hidden
    />
  );
}
