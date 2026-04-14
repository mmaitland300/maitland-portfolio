"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/** Left-to-right: simplest surface first, then waveform, then advanced. */
const views = [
  {
    src: "/images/stringflux/ui-preset.png",
    alt: "StringFlux core layout: primary controls and mod-source envelope meters with live levels",
    label: "Core",
    width: 577,
    height: 461,
  },
  {
    src: "/images/stringflux/ui-waveform.png",
    alt: "StringFlux waveform layout: core controls, waveform editor with region highlight, and mod-source envelope meters with live levels",
    label: "Waveform",
    width: 576,
    height: 579,
  },
  {
    src: "/images/stringflux/ui-advanced.png",
    alt: "StringFlux advanced layout: modulation matrix, string transients, modulation sources, core controls, and mod-source envelope meters with live levels",
    label: "Advanced",
    width: 601,
    height: 848,
  },
] as const;

export function StringFluxPluginPreview() {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const activeView = views[active];

  useEffect(() => {
    if (!zoomed) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setZoomed(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [zoomed]);

  return (
    <>
      <figure className="overflow-hidden rounded-xl border border-border bg-zinc-950">
        <div className="flex justify-center bg-zinc-950 p-2">
          <button
            type="button"
            onClick={() => setZoomed(true)}
            className="group flex w-full justify-center cursor-zoom-in"
            aria-label={`Open StringFlux ${activeView.label} layout screenshot in full resolution`}
          >
            <Image
              key={activeView.src}
              src={activeView.src}
              alt={activeView.alt}
              width={activeView.width}
              height={activeView.height}
              quality={100}
              unoptimized
              className="h-auto w-auto max-h-[680px] max-w-full object-contain transition-opacity group-hover:opacity-95"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 700px"
              priority
            />
          </button>
        </div>
        <div className="flex items-center justify-center gap-2 border-t border-border bg-zinc-950/80 px-4 py-2.5">
          {views.map((view, i) => (
            <button
              key={view.label}
              onClick={() => setActive(i)}
              className={`rounded-md px-3 py-1 font-mono text-xs transition-colors ${
                i === active
                  ? "bg-brand-violet/20 text-brand-violet"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {view.label}
            </button>
          ))}
          <span className="ml-auto font-mono text-[10px] text-muted-foreground/50">
            v0.3-dev
          </span>
        </div>
      </figure>

      {zoomed ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setZoomed(false)}
          role="dialog"
          aria-modal="true"
          aria-label="StringFlux layout full resolution preview"
        >
          <button
            type="button"
            onClick={() => setZoomed(false)}
            className="absolute right-4 top-4 rounded border border-white/20 px-2.5 py-1 text-xs text-white/80 hover:bg-white/10 hover:text-white"
            aria-label="Close full resolution preview"
          >
            Close
          </button>

          <div
            className="max-h-[95vh] max-w-[95vw] overflow-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={activeView.src}
              alt={activeView.alt}
              width={activeView.width}
              height={activeView.height}
              quality={100}
              unoptimized
              className="h-auto w-auto max-w-none"
              sizes="95vw"
              priority
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
