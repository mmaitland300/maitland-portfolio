"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full bg-background text-foreground">
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card/60 p-6 text-center">
            <div className="mx-auto mb-4 inline-flex rounded-full bg-warning/10 p-3 text-warning">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-semibold">Application error</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              A root-level error occurred. Retry the view, or reload if needed.
            </p>
            <button
              onClick={() => reset()}
              className="mt-5 inline-flex items-center gap-2 rounded-md border border-border bg-muted px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/70"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
