import type { MetadataRoute } from "next";
import { parseDateValue } from "@/lib/date";
import { getAllPosts } from "@/lib/mdx";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  const posts = getAllPosts();
  const blogEntries = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: parseDateValue(post.frontmatter.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    { url: baseUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/projects`, changeFrequency: "monthly", priority: 0.8 },
    {
      url: `${baseUrl}/projects/stringflux`,
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: `${baseUrl}/stringflux`,
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/projects/full-swing-tech-support`,
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: `${baseUrl}/projects/portfolio-site`,
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: `${baseUrl}/projects/research-radar`,
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: `${baseUrl}/projects/snake-detector`,
      changeFrequency: "monthly",
      priority: 0.55,
    },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/blog`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/music`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/resume`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/contact`, changeFrequency: "yearly", priority: 0.5 },
    ...blogEntries,
  ];
}
