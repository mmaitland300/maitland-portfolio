import type { ResumeHighlight } from "@/content/resume";

interface HighlightTextProps {
  highlight: ResumeHighlight;
}

export function HighlightText({ highlight }: HighlightTextProps) {
  if (!highlight.href) {
    return <>{highlight.text}</>;
  }

  const isExternal = /^https?:\/\//.test(highlight.href);

  return (
    <a
      href={highlight.href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="underline decoration-brand-violet/50 underline-offset-4 transition-colors hover:text-foreground"
    >
      {highlight.text}
    </a>
  );
}

