import type { Metadata } from "next";
import { MainContentAnchor } from "@/components/layout/main-content-anchor";
import { AboutContent } from "@/components/sections/about-content";
import { SectionHeader } from "@/components/ui/section-header";
import { getPublicContactEmail } from "@/lib/site-contact";

export const metadata: Metadata = {
  title: "About",
  description:
    "Technical support specialist at Auxillium (Full Swing simulators): how triage habits carry into reliable web tools, audio software, and research prototypes built on the side.",
};

export default function AboutPage() {
  return (
    <div className="py-32">
      <MainContentAnchor />
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeader
          eyebrow="About"
          title="Technical support specialist, practical software builder"
          description="How customer-facing triage—observe, isolate, validate—shows up in the web apps, audio tools, and research prototypes I build outside my Auxillium role."
          className="mb-16"
        />
        <AboutContent publicEmail={getPublicContactEmail()} />
      </div>
    </div>
  );
}
