"use client";

/**
 * Smooth waveform-style stroke between main content and `<Footer />`.
 * Faint graticule + light 2nd harmonic read as “scope / meter” more than a lone sine;
 * motion stays slow and non-distracting.
 */

import {
  startTransition,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

const STRIP_CSS_H = 38;
const STROKE_ALPHA = 0.55;
/** Base cycles across strip width (lower = wider, calmer peaks on wide screens). */
const CYCLES = 1.14;
const CYCLES_LFO = 0.07;
const MAX_SAMPLES = 1400;
/** Second harmonic weight (bounded so peaks stay ~within strip). */
const HARM2 = 0.11;
/** Vertical tick positions (fraction of width) for a subtle scope read. */
const GRATICULE_X_FRAC = [0.1, 0.26, 0.5, 0.74, 0.9] as const;

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
    if (![r, g, b].every((c) => Number.isFinite(c) && c >= 0 && c <= 255)) {
      return null;
    }
    return [r, g, b];
  }
  const r = parseInt(h.slice(1, 3), 16);
  const g = parseInt(h.slice(3, 5), 16);
  const b = parseInt(h.slice(5, 7), 16);
  if (![r, g, b].every((c) => Number.isFinite(c) && c >= 0 && c <= 255)) {
    return null;
  }
  return [r, g, b];
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
  const amp = viewH * 0.48;
  const parts: string[] = [];
  const ph = 0;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = t * viewW;
    const u = t * Math.PI * 2 * cycles + ph;
    const w =
      Math.sin(u) + HARM2 * Math.sin(2 * u + ph * 0.38);
    const y = mid + (amp * w) / (1 + HARM2);
    parts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(2)}`);
  }
  return parts.join(" ");
}

function drawScopeGraticule(
  ctx: CanvasRenderingContext2D,
  cw: number,
  mid: number,
  cyan: [number, number, number],
  violet: [number, number, number],
  dpr: number
) {
  ctx.save();
  ctx.lineCap = "round";
  const tickH = Math.max(2.6, dpr * 3);
  ctx.lineWidth = Math.max(1, dpr * 1.05);
  ctx.strokeStyle = rgba(violet, 0.09);
  ctx.beginPath();
  ctx.moveTo(0, mid);
  ctx.lineTo(cw, mid);
  ctx.stroke();

  ctx.strokeStyle = rgba(cyan, 0.055);
  for (const fx of GRATICULE_X_FRAC) {
    const x = fx * cw;
    ctx.beginPath();
    ctx.moveTo(x, mid - tickH);
    ctx.lineTo(x, mid + tickH);
    ctx.stroke();
  }
  ctx.restore();
}

/** 3-tap blur on interior samples (edges unchanged). */
function smooth1D(dst: Float32Array, src: Float32Array, len: number) {
  if (len < 3) return;
  dst[0] = src[0];
  dst[len - 1] = src[len - 1];
  for (let i = 1; i < len - 1; i++) {
    dst[i] = 0.18 * src[i - 1] + 0.64 * src[i] + 0.18 * src[i + 1];
  }
}

/** ~Gaussian 5-tap on interior; 3-tap near edges to avoid kinks. */
function smooth1D5(dst: Float32Array, src: Float32Array, len: number) {
  if (len < 3) return;
  dst[0] = src[0];
  dst[len - 1] = src[len - 1];
  if (len < 5) {
    smooth1D(dst, src, len);
    return;
  }
  dst[1] = 0.22 * src[0] + 0.56 * src[1] + 0.22 * src[2];
  dst[len - 2] =
    0.22 * src[len - 3] + 0.56 * src[len - 2] + 0.22 * src[len - 1];
  const w0 = 0.06;
  const w1 = 0.24;
  const w2 = 0.4;
  for (let i = 2; i < len - 2; i++) {
    dst[i] =
      w0 * src[i - 2] +
      w1 * src[i - 1] +
      w2 * src[i] +
      w1 * src[i + 1] +
      w0 * src[i + 2];
  }
}

/** Uniform Catmull–Rom → cubic Béziers (smoother than midpoint quadratics). */
function strokeCatmullPath(
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
  for (let i = 0; i < len - 1; i++) {
    const i0 = i === 0 ? 0 : i - 1;
    const i1 = i;
    const i2 = i + 1;
    const i3 = i + 2 < len ? i + 2 : len - 1;
    const p0x = xs[i0];
    const p0y = ys[i0];
    const p1x = xs[i1];
    const p1y = ys[i1];
    const p2x = xs[i2];
    const p2y = ys[i2];
    const p3x = xs[i3];
    const p3y = ys[i3];
    const cp1x = p1x + (p2x - p0x) / 6;
    const cp1y = p1y + (p2y - p0y) / 6;
    const cp2x = p2x - (p3x - p1x) / 6;
    const cp2y = p2y - (p3y - p1y) / 6;
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2x, p2y);
  }
}

function svgDefId(reactId: string, suffix: string) {
  return `wave-ribbon-${suffix}-${reactId.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}

export function SpectrumRibbon() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const svgIds = useId();
  const [mounted, setMounted] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(0);
  const rafRef = useRef(0);
  const lastFrameRef = useRef(0);
  const rawYRef = useRef<Float32Array | null>(null);
  const smYRef = useRef<Float32Array | null>(null);
  const xBufRef = useRef<Float32Array | null>(null);
  const brandRef = useRef<{
    cyan: [number, number, number];
    violet: [number, number, number];
  } | null>(null);
  const strokeGradRef = useRef<{
    cw: number;
    grad: CanvasGradient;
  } | null>(null);

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
    /** Slightly above 2 helps thin strokes on 2.5×–3× displays without huge cost (small canvas height). */
    const dpr = Math.min(window.devicePixelRatio ?? 1, 2.75);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(STRIP_CSS_H * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${STRIP_CSS_H}px`;
    brandRef.current = brandRgb();
    strokeGradRef.current = null;
  }, []);

  useEffect(() => {
    if (!mounted || hide || reduceMotion) return;

    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
    });
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
        Math.max(180, Math.floor(cw * 0.78))
      );
    };

    const tick = (now: number) => {
      const dt = Math.min(0.06, Math.max(0, (now - lastFrameRef.current) / 1000));
      lastFrameRef.current = now;
      phaseRef.current += dt * 0.95;

      const cw = canvas.width;
      const ch = canvas.height;
      const mid = ch * 0.5;
      const amp = ch * 0.53;
      const n = sampleCount();
      const len = n + 1;
      const ph = phaseRef.current;
      const breathe = 0.88 + 0.12 * Math.sin(now * 0.00075);
      const cycles = CYCLES + CYCLES_LFO * Math.sin(now * 0.00028);

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
        const w =
          Math.sin(u) + HARM2 * Math.sin(2 * u + ph * 0.38);
        rawY[i] = mid + (amp * breathe * w) / (1 + HARM2);
      }

      smooth1D(smY, rawY, len);
      smooth1D(rawY, smY, len);
      smooth1D(smY, rawY, len);
      smooth1D5(rawY, smY, len);

      ctx.clearRect(0, 0, cw, ch);
      ctx.save();
      ctx.translate(0.5, 0.5);

      const brand = brandRef.current ?? brandRgb();
      brandRef.current = brand;
      const { cyan, violet } = brand;
      let strokeGrad = strokeGradRef.current;
      if (!strokeGrad || strokeGrad.cw !== cw) {
        const g = ctx.createLinearGradient(0, 0, cw, 0);
        g.addColorStop(0, rgba(violet, STROKE_ALPHA * 0.82));
        g.addColorStop(0.48, rgba(cyan, STROKE_ALPHA));
        g.addColorStop(1, rgba(violet, STROKE_ALPHA * 0.88));
        strokeGradRef.current = { cw, grad: g };
        strokeGrad = strokeGradRef.current;
      }

      const dpr = cw / Math.max(1, wrap.getBoundingClientRect().width);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      drawScopeGraticule(ctx, cw, mid, cyan, violet, dpr);

      ctx.beginPath();
      strokeCatmullPath(ctx, xBuf, rawY, len);

      /* Soft halo: eases stair-stepping on a very thin line (re-stroke same path). */
      ctx.strokeStyle = rgba(cyan, 0.1);
      ctx.lineWidth = Math.max(4.2, dpr * 4.8);
      ctx.shadowBlur = Math.max(5, dpr * 6);
      ctx.shadowColor = rgba(cyan, 0.28);
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";

      ctx.strokeStyle = rgba(cyan, 0.14);
      ctx.lineWidth = Math.max(2.6, dpr * 2.85);
      ctx.stroke();

      ctx.strokeStyle = strokeGrad.grad;
      ctx.lineWidth = Math.max(1.45, dpr * 1.65);
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
    const gradId = svgDefId(svgIds, "grad");
    const filtId = svgDefId(svgIds, "filt");
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
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--brand-violet-muted)" stopOpacity="0.48" />
              <stop offset="50%" stopColor="var(--brand-cyan)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="var(--brand-violet-muted)" stopOpacity="0.48" />
            </linearGradient>
            <filter id={filtId} x="-20%" y="-300%" width="140%" height="700%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.55" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g opacity={0.85}>
            <line
              x1="0"
              y1={STRIP_CSS_H * 0.5}
              x2="400"
              y2={STRIP_CSS_H * 0.5}
              stroke="var(--brand-violet-muted)"
              strokeOpacity={0.1}
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            {GRATICULE_X_FRAC.map((fx) => (
              <line
                key={fx}
                x1={400 * fx}
                y1={STRIP_CSS_H * 0.5 - 5}
                x2={400 * fx}
                y2={STRIP_CSS_H * 0.5 + 5}
                stroke="var(--brand-cyan)"
                strokeOpacity={0.07}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>
          <path
            fill="none"
            filter={`url(#${filtId})`}
            shapeRendering="geometricPrecision"
            stroke={`url(#${gradId})`}
            strokeWidth="2.25"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            d={staticSinePath(400, STRIP_CSS_H, CYCLES, 220)}
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
