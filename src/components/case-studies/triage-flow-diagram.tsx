/** Text-only / SVG diagram: multi-layer support triage flow (Full Swing case study). */
export function TriageFlowDiagram() {
  return (
    <figure className="my-6 overflow-x-auto rounded-lg border border-border bg-muted/30 p-4">
      <figcaption className="mb-3 text-center text-xs font-medium text-muted-foreground">
        Figure: hypothesis-driven triage (symptom to verified fix)
      </figcaption>
      <svg
        viewBox="0 0 688 120"
        className="mx-auto h-auto w-full max-w-2xl text-foreground"
        role="img"
        aria-label="Flow from symptoms through classification, targeted checks, fix, and verification"
      >
        <defs>
          <marker
            id="arrow"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 Z" className="fill-muted-foreground" />
          </marker>
        </defs>
        {[
          { x: 8, label: "Symptoms" },
          { x: 118, label: "Classify" },
          { x: 228, label: "Layer test" },
          { x: 358, label: "Fix" },
          { x: 468, label: "Verify" },
          { x: 578, label: "Document" },
        ].map((box, i, arr) => (
          <g key={box.label}>
            <rect
              x={box.x}
              y="36"
              width="92"
              height="48"
              rx="6"
              className="fill-card stroke-border"
              strokeWidth="1"
            />
            <text
              x={box.x + 46}
              y="64"
              textAnchor="middle"
              className="fill-foreground text-[11px] font-medium"
            >
              {box.label}
            </text>
            {i < arr.length - 1 && (
              <line
                x1={box.x + 92}
                y1="60"
                x2={arr[i + 1].x}
                y2="60"
                className="stroke-muted-foreground"
                strokeWidth="1.5"
                markerEnd="url(#arrow)"
              />
            )}
          </g>
        ))}
      </svg>
    </figure>
  );
}
