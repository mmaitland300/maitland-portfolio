// Load env the same way Next.js does: `.env` then `.env.local` (local wins).
// `import "dotenv/config"` only reads `.env`, so Prisma CLI would miss `DATABASE_URL`
// if it lives only in `.env.local` (common for local dev).
import { config } from "dotenv";
import { resolve } from "node:path";
import { defineConfig, env } from "prisma/config";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local"), override: true });

const prismaPreviewPlaceholderUrl =
  "postgresql://placeholder:placeholder@127.0.0.1:5432/placeholder";

// Vercel Preview builds should not need production database secrets, but
// `prisma generate` still requires syntactically valid datasource URLs.
if (process.env.VERCEL_ENV === "preview") {
  process.env.DATABASE_URL ||= prismaPreviewPlaceholderUrl;
  process.env.DIRECT_URL ||= prismaPreviewPlaceholderUrl;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
    directUrl: env("DIRECT_URL"),
  },
});
