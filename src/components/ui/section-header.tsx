import { createElement, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface SectionHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  badges?: ReactNode;
  actions?: ReactNode;
  align?: "left" | "center";
  /** Use 2+ when this header is not the page's primary title (e.g. homepage below the hero). */
  headingLevel?: SectionHeadingLevel;
  titleClassName?: string;
  descriptionClassName?: string;
  className?: string;
}

const headingTags: Record<
  SectionHeadingLevel,
  "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
};

export function SectionHeader({
  title,
  description,
  eyebrow,
  badges,
  actions,
  align = "center",
  headingLevel = 1,
  titleClassName,
  descriptionClassName,
  className,
}: SectionHeaderProps) {
  const centered = align === "center";
  const HeadingTag = headingTags[headingLevel];

  return (
    <div
      className={cn(
        "space-y-4",
        centered ? "text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "flex items-center gap-3",
            centered ? "justify-center" : "justify-start"
          )}
        >
          <span className="section-eyebrow-line shrink-0" aria-hidden />
          <p className="section-eyebrow" suppressHydrationWarning>
            {eyebrow}
          </p>
        </div>
      )}
      {createElement(
        HeadingTag,
        {
          className: cn(
            "page-title accent-title text-balance text-4xl font-semibold tracking-tight sm:text-5xl",
            titleClassName
          ),
        },
        title
      )}
      {badges && (
        <div
          className={cn(
            "flex flex-wrap gap-2",
            centered ? "justify-center" : "justify-start"
          )}
        >
          {badges}
        </div>
      )}
      {description && (
        <p
          className={cn(
            "text-pretty text-muted-foreground",
            centered ? "mx-auto max-w-2xl" : "max-w-2xl",
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
      {actions && (
        <div
          className={cn(
            "flex flex-wrap items-center gap-3",
            centered ? "justify-center" : "justify-start"
          )}
        >
          {actions}
        </div>
      )}
    </div>
  );
}
