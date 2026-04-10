"use client";

import { useState } from "react";
import { ExternalLink, Play } from "lucide-react";

interface LazySoundCloudTrackProps {
  title: string;
  trackUrl: string;
  embedParams: string;
}

export function LazySoundCloudTrack({
  title,
  trackUrl,
  embedParams,
}: LazySoundCloudTrackProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card/50 backdrop-blur-sm">
      {loaded && !errored ? (
        <iframe
          width="100%"
          height="300"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(trackUrl)}${embedParams}`}
          title={title}
          className="block"
          onError={() => setErrored(true)}
        />
      ) : errored ? (
        <div className="flex h-[300px] w-full flex-col items-center justify-center gap-3 text-center px-4">
          <p className="text-sm text-muted-foreground">
            Embed failed to load.
          </p>
          <a
            href={trackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-brand-violet hover:text-brand-violet-hover transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open {title} on SoundCloud
          </a>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="flex h-[300px] w-full flex-col items-center justify-center gap-3 text-center"
          aria-label={`Load SoundCloud player for ${title}`}
        >
          <span className="rounded-full bg-brand-violet/20 p-3 text-brand-violet-muted">
            <Play className="h-5 w-5" />
          </span>
          <span className="text-sm font-medium text-foreground">
            Load player for {title}
          </span>
          <span className="max-w-xs text-xs text-muted-foreground">
            Click to load the SoundCloud embed only when needed.
          </span>
        </button>
      )}
    </div>
  );
}
