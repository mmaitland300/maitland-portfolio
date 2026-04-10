"use client";

import { useId, useState } from "react";

const workflowSteps = [
  {
    x: 12,
    w: 88,
    label: "Data",
    detail:
      "Capture raw images and label sources. This is where class imbalance and label quality risks start.",
  },
  {
    x: 118,
    w: 92,
    label: "Clean / split",
    detail:
      "Apply deterministic cleanup and stratified train/validation splits so runs remain directly comparable.",
  },
  {
    x: 226,
    w: 72,
    label: "Train",
    detail:
      "Run training with fixed settings and logged changes. Avoid changing multiple variables between runs.",
  },
  {
    x: 314,
    w: 88,
    label: "Metrics",
    detail:
      "Track per-class precision/recall and loss trends, not just aggregate accuracy.",
  },
  {
    x: 418,
    w: 100,
    label: "Confusion review",
    detail:
      "Inspect confusion matrix and wrong predictions to identify exact failure modes before architecture changes.",
  },
  {
    x: 534,
    w: 94,
    label: "Next change",
    detail:
      "Choose one controlled update (data, augmentation, or model tweak), then repeat the same loop.",
  },
] as const;

/** Interactive train/eval/review loop for ML case studies. */
export function MlEvalWorkflowDiagram() {
  const arrowMarkerId = useId().replace(/:/g, "");
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStep = workflowSteps[activeIndex];

  return (
    <figure className="my-6 overflow-x-auto rounded-lg border border-border bg-muted/30 p-4">
      <figcaption className="mb-3 text-center text-xs font-medium text-muted-foreground">
        Interactive workflow: inspect each stage of the reproducible evaluation loop
      </figcaption>
      <svg
        viewBox="0 0 640 100"
        className="mx-auto h-auto w-full max-w-2xl text-foreground"
        role="img"
        aria-label="Flow from raw data through clean and split, train, metrics and confusion review, then decide next change"
      >
        <defs>
          <marker
            id={arrowMarkerId}
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 Z" className="fill-muted-foreground" />
          </marker>
        </defs>
        {workflowSteps.map((box, i, arr) => (
          <g key={box.label}>
            <rect
              x={box.x}
              y="28"
              width={box.w}
              height="44"
              rx="6"
              className={
                i === activeIndex
                  ? "fill-card stroke-[rgba(136,212,255,0.95)]"
                  : "fill-card stroke-border"
              }
              strokeWidth={i === activeIndex ? "1.5" : "1"}
            />
            <text
              x={box.x + box.w / 2}
              y="54"
              textAnchor="middle"
              className="fill-foreground text-[10px] font-medium"
            >
              {box.label}
            </text>
            {i < arr.length - 1 && (
              <line
                x1={box.x + box.w}
                y1="50"
                x2={arr[i + 1].x}
                y2="50"
                className="stroke-muted-foreground"
                strokeWidth="1.5"
                markerEnd={`url(#${arrowMarkerId})`}
              />
            )}
          </g>
        ))}
      </svg>
      <div className="mt-4 rounded-md border border-border bg-card/60 p-3 text-sm">
        <p className="font-medium text-foreground">{activeStep.label}</p>
        <p className="mt-1 text-muted-foreground">{activeStep.detail}</p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {workflowSteps.map((step, i) => (
          <button
            key={step.label}
            type="button"
            onClick={() => setActiveIndex(i)}
            className={
              i === activeIndex
                ? "rounded-md border border-brand-violet/30 bg-brand-violet/20 px-2.5 py-1 text-xs text-brand-violet-muted"
                : "rounded-md border border-border bg-card/60 px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
            }
          >
            {step.label}
          </button>
        ))}
      </div>
    </figure>
  );
}
