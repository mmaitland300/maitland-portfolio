import type { Metadata } from "next";
import { MainContentAnchor } from "@/components/layout/main-content-anchor";
import { AboutContent } from "@/components/sections/about-content";
import { SectionHeader } from "@/components/ui/section-header";
import { getPublicContactEmail } from "@/lib/site-contact";

export const metadata: Metadata = {
  title: "About",
  description:
    "Full-stack web developer and technical support specialist. Day job is Auxillium supporting Full Swing simulators; side work is web apps, audio software, and research prototypes. Same habits, different problem domains.",
};

export default function AboutPage() {
  return (
    <div className="py-32">
      <MainContentAnchor />
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeader
          eyebrow="About"
          title="Full-stack developer and technical support specialist"
          description="Day job is supporting Full Swing simulator environments at Auxillium. Outside of that I build web apps, audio tools, and research prototypes. The triage habits from support work carry directly into how I build software."
          className="mb-16"
        />
        <AboutContent publicEmail={getPublicContactEmail()} />
      </div>
    </div>
  );
}
