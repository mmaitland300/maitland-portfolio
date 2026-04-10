"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { ProjectCard } from "@/components/sections/project-card";
import { SectionHeader } from "@/components/ui/section-header";
import { getHomepageFeaturedProjects } from "@/content/projects";
import { getResearchRadarDemoUrl } from "@/lib/research-radar";

export function FeaturedProjects() {
  const featured = getHomepageFeaturedProjects();
  const researchRadarDemoUrl = getResearchRadarDemoUrl();
  const featuredDescription = researchRadarDemoUrl
    ? "StringFlux, Research Radar with a linked hosted prototype, and Full Swing support in public—plus case studies for this site, Snake Detector, and more on the projects page."
    : "StringFlux, Research Radar (case study and repository as evidence), and Full Swing support in public—plus case studies for this site, Snake Detector, and more on the projects page.";

  return (
    <section className="py-24 relative z-10">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <SectionHeader
            eyebrow="Selected Work"
            title="Featured Projects"
            description={featuredDescription}
            headingLevel={2}
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} compact />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/projects"
            className={buttonVariants({ variant: "outline" })}
          >
            View All Projects <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
