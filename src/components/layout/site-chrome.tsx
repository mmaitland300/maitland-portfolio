import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SpectrumRibbon } from "@/components/layout/spectrum-ribbon";
import { cn } from "@/lib/utils";

/** Dark site shell: nav, footer, decorative background. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex flex-col relative bg-background text-foreground">
      <a
        href="#main-content"
        className={cn(
          "fixed top-4 z-[100] whitespace-nowrap rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg",
          "outline-none transition-[left] duration-150",
          "-left-[9999px] focus:left-4",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
      >
        Skip to content
      </a>
      <div className="animated-bg-glow" aria-hidden="true" />
      <Navbar />
      <main className="flex-1 relative z-10">{children}</main>
      <Footer />
      <SpectrumRibbon />
    </div>
  );
}
