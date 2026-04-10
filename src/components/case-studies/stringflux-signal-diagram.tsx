/** Simplified wet-path signal flow for StringFlux case study (not a full schematic). */
export function StringFluxSignalDiagram() {
  return (
    <figure className="my-6 overflow-x-auto rounded-lg border border-border bg-muted/30 p-4">
      <figcaption className="mb-3 text-center text-xs font-medium text-muted-foreground">
        Figure: wet-path overview (dry path bypasses advanced processing)
      </figcaption>
      <svg
        viewBox="0 0 720 200"
        className="mx-auto h-auto w-full max-w-3xl text-foreground"
        role="img"
        aria-label="Input splits to dry mix and wet path through crossover, history rings, grains, shaper, feedback, then mix"
      >
        <rect
          x="8"
          y="76"
          width="72"
          height="48"
          rx="6"
          className="fill-card stroke-border"
          strokeWidth="1"
        />
        <text x="44" y="104" textAnchor="middle" className="fill-foreground text-[10px]">
          Input
        </text>
        <line
          x1="80"
          y1="100"
          x2="108"
          y2="100"
          className="stroke-muted-foreground"
          strokeWidth="1.5"
        />
        <text x="120" y="96" className="fill-muted-foreground text-[9px]">
          split
        </text>
        <line
          x1="128"
          y1="100"
          x2="148"
          y2="40"
          className="stroke-muted-foreground"
          strokeWidth="1.5"
        />
        <line
          x1="128"
          y1="100"
          x2="148"
          y2="160"
          className="stroke-muted-foreground"
          strokeWidth="1.5"
        />
        <rect
          x="152"
          y="16"
          width="88"
          height="48"
          rx="6"
          className="fill-card stroke-border"
          strokeWidth="1"
        />
        <text x="196" y="44" textAnchor="middle" className="fill-foreground text-[10px]">
          Dry
        </text>
        <rect
          x="152"
          y="136"
          width="100"
          height="48"
          rx="6"
          className="fill-brand-violet/10 stroke-brand-violet/40"
          strokeWidth="1"
        />
        <text x="202" y="164" textAnchor="middle" className="fill-foreground text-[9px]">
          3-band XO
        </text>
        <line
          x1="252"
          y1="160"
          x2="280"
          y2="160"
          className="stroke-muted-foreground"
          strokeWidth="1.5"
        />
        <rect
          x="284"
          y="136"
          width="100"
          height="48"
          rx="6"
          className="fill-brand-violet/10 stroke-brand-violet/40"
          strokeWidth="1"
        />
        <text x="334" y="164" textAnchor="middle" className="fill-foreground text-[9px]">
          History
        </text>
        <line
          x1="384"
          y1="160"
          x2="412"
          y2="160"
          className="stroke-muted-foreground"
          strokeWidth="1.5"
        />
        <rect
          x="416"
          y="136"
          width="88"
          height="48"
          rx="6"
          className="fill-brand-violet/10 stroke-brand-violet/40"
          strokeWidth="1"
        />
        <text x="460" y="164" textAnchor="middle" className="fill-foreground text-[9px]">
          Grains
        </text>
        <line
          x1="504"
          y1="160"
          x2="532"
          y2="160"
          className="stroke-muted-foreground"
          strokeWidth="1.5"
        />
        <rect
          x="536"
          y="136"
          width="72"
          height="48"
          rx="6"
          className="fill-brand-violet/10 stroke-brand-violet/40"
          strokeWidth="1"
        />
        <text x="572" y="164" textAnchor="middle" className="fill-foreground text-[9px]">
          Shaper
        </text>
        <line
          x1="608"
          y1="160"
          x2="636"
          y2="160"
          className="stroke-muted-foreground"
          strokeWidth="1.5"
        />
        <rect
          x="640"
          y="136"
          width="72"
          height="48"
          rx="6"
          className="fill-brand-violet/10 stroke-brand-violet/40"
          strokeWidth="1"
        />
        <text x="676" y="164" textAnchor="middle" className="fill-foreground text-[9px]">
          FB
        </text>
        <path
          d="M 676 136 Q 676 80 400 80 Q 196 80 196 64"
          fill="none"
          className="stroke-brand-cyan/50"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        <text x="420" y="72" className="fill-muted-foreground text-[8px]">
          feedback (host rate)
        </text>
        <rect
          x="300"
          y="8"
          width="120"
          height="36"
          rx="6"
          className="fill-card stroke-border"
          strokeWidth="1"
        />
        <text x="360" y="30" textAnchor="middle" className="fill-foreground text-[10px]">
          Mix / Limiter
        </text>
        <line
          x1="196"
          y1="40"
          x2="300"
          y2="40"
          className="stroke-muted-foreground"
          strokeWidth="1.5"
        />
        <line
          x1="360"
          y1="44"
          x2="360"
          y2="120"
          className="stroke-muted-foreground"
          strokeWidth="1.5"
        />
        <line
          x1="360"
          y1="120"
          x2="400"
          y2="136"
          className="stroke-muted-foreground"
          strokeWidth="1.5"
        />
      </svg>
    </figure>
  );
}
