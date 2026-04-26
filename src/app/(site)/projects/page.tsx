import type { Metadata } from "next";
import { MainContentAnchor } from "@/components/layout/main-content-anchor";
import { ProjectGrid } from "@/components/sections/project-grid";
import { SectionHeader } from "@/components/ui/section-header";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Featured case studies with named limits, evidence, and honest boundaries. Experiments sit in their own section so the flagship work stays easy to scan.",
};

export default function ProjectsPage() {
  return (
    <div className="py-32">
      <MainContentAnchor />
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          eyebrow="Projects"
          title="Case Studies and Experiments"
          description="Featured case studies first: named limits, decisions, and evidence. Experiments and smaller builds are grouped below so the main thread stays easy to scan."
          className="mb-12"
        />
        <ProjectGrid />
      </div>
    </div>
  );
}
