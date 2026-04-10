"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDisplayDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/lib/mdx";
import type { BlogCoreTag } from "@/lib/mdx";

interface BlogListProps {
  posts: BlogPost[];
  tags: BlogCoreTag[];
}

export function BlogList({ posts, tags }: BlogListProps) {
  const [activeTag, setActiveTag] = useState<BlogCoreTag | null>(null);

  const filtered = activeTag
    ? posts.filter((p) => p.frontmatter.tags.includes(activeTag))
    : posts;

  return (
    <div>
      {/* Tag filter */}
      {tags.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveTag(null)}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
              !activeTag
                ? "bg-brand-violet/20 text-brand-violet border border-brand-violet/30"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                tag === activeTag
                  ? "bg-brand-violet/20 text-brand-violet border border-brand-violet/30"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Post list */}
      <div className="space-y-6">
        {filtered.map((post, i) => (
          <motion.article
            key={post.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="group block p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm hover:border-brand-violet/30 transition-all duration-300"
            >
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {formatDisplayDate(post.frontmatter.date)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {post.readingTime}
                </span>
                <Badge variant="outline" className="text-[10px] font-medium">
                  {post.frontmatter.type}
                </Badge>
              </div>

              <h2 className="text-xl font-semibold group-hover:text-brand-violet transition-colors mb-2">
                {post.frontmatter.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {post.frontmatter.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {post.frontmatter.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs font-normal"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-brand-violet transition-colors flex items-center gap-1">
                  Read more <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          No posts match that tag.
        </p>
      )}
    </div>
  );
}
