"use client";

import { useEffect, useState } from "react";
import type { TocEntry } from "@/lib/mdx";

interface TableOfContentsProps {
  toc: TocEntry[];
}

export function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0% -80% 0%" }
    );

    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <nav className="hidden xl:block sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
        On this page
      </p>
      <ul className="space-y-1.5">
        {toc.map((entry) => (
          <li
            key={entry.id}
            style={{ paddingLeft: `${(entry.depth - 2) * 12}px` }}
          >
            <a
              href={`#${entry.id}`}
              className={`block text-xs leading-relaxed transition-colors ${
                activeId === entry.id
                  ? "text-brand-violet font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}