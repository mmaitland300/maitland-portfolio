"use client";

import { usePathname } from "next/navigation";
import { SiteChrome } from "@/components/layout/site-chrome";

/** Bare chrome for /resume/print, optional future subpaths, and trailing-slash URLs. */
function isResumePrintPath(pathname: string | null): boolean {
  if (!pathname) return false;
  const normalized = pathname.replace(/\/+$/, "") || "/";
  return (
    normalized === "/resume/print" || normalized.startsWith("/resume/print/")
  );
}

/**
 * /resume uses site chrome; /resume/print stays bare for PDF and paper layout.
 * (Single app/resume tree avoids Next.js route-group merge edge cases for /resume/print.)
 */
export default function ResumeShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (isResumePrintPath(pathname)) {
    return <>{children}</>;
  }
  return <SiteChrome>{children}</SiteChrome>;
}
