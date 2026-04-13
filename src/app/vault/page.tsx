import type { Metadata } from "next";
import { CatchPixelGame } from "@/components/easter-egg/catch-pixel-game";

export const metadata: Metadata = {
  title: "Vault",
  description: "Hidden catch game.",
  robots: { index: false, follow: false },
};

export default function VaultPage() {
  return (
    <main className="flex min-h-full flex-col items-center justify-center bg-background px-4 py-16">
      <h1 className="mb-2 font-mono text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">
        Vault
      </h1>
      <p className="mb-10 max-w-md text-center text-xs text-muted-foreground">
        Unlisted corner of the site. A few rounds, then back to work.
      </p>
      <CatchPixelGame />
    </main>
  );
}
