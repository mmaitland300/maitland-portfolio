import { MessageSquare } from "lucide-react";
import { parseAppEnv } from "@/lib/env";
import { isAdminAuthConfigured } from "@/lib/feature-config";
import { getSessionUser } from "@/lib/session";
import { isAdmin } from "@/lib/admin";
import { CommentForm } from "@/components/sections/comment-form";
import { CommentList, type CommentData } from "@/components/sections/comment-list";

interface ProjectCommentsProps {
  projectSlug: string;
  currentPath: string;
}

export async function ProjectComments({
  projectSlug,
  currentPath,
}: ProjectCommentsProps) {
  if (!parseAppEnv().DATABASE_URL) return null;

  const authConfigured = isAdminAuthConfigured();

  let user: Awaited<ReturnType<typeof getSessionUser>> = null;
  let admin = false;
  let comments: CommentData[] = [];
  let loadFailed = false;

  try {
    const { prisma } = await import("@/lib/prisma");

    [user, admin] = authConfigured
      ? await Promise.all([getSessionUser(), isAdmin()])
      : [null, false];

    const where = admin
      ? { projectSlug }
      : { projectSlug, hidden: false };

    const rawComments = await prisma.projectComment.findMany({
      where,
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        body: true,
        hidden: true,
        createdAt: true,
        user: { select: { name: true, image: true } },
      },
    });

    comments = rawComments.map((c) => ({
      ...c,
      createdAt: c.createdAt,
    }));
  } catch (error) {
    console.error("ProjectComments: failed to load comments", error);
    loadFailed = true;
  }

  return (
    <section className="mt-16 rounded-xl border border-border bg-card/40 p-6">
      <div className="mb-4 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-brand-violet" />
        <h2 className="text-xl font-semibold">Leave a question or comment</h2>
        {comments.length > 0 && (
          <span className="text-sm text-muted-foreground">
            ({comments.length})
          </span>
        )}
      </div>

      {loadFailed ? (
        <p className="text-sm text-muted-foreground">
          Questions and comments are temporarily unavailable.
        </p>
      ) : (
        <CommentList
          comments={comments}
          isAdmin={admin}
          inviteToPost={authConfigured}
        />
      )}

      {authConfigured && !loadFailed && (
        <div className="mt-6 border-t border-border pt-4" suppressHydrationWarning>
          <CommentForm
            projectSlug={projectSlug}
            currentPath={currentPath}
            isSignedIn={!!user}
          />
        </div>
      )}
    </section>
  );
}
