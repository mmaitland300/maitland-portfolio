import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/admin";
import { SectionHeader } from "@/components/ui/section-header";
import { CommentList } from "@/components/sections/comment-list";

export const dynamic = "force-dynamic";

export default async function AdminCommentsPage() {
  await requireAdminPage();

  const rawComments = await prisma.projectComment.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      projectSlug: true,
      body: true,
      hidden: true,
      createdAt: true,
      user: { select: { name: true, image: true } },
    },
  });

  const visibleCount = rawComments.filter((c) => !c.hidden).length;
  const hiddenCount = rawComments.filter((c) => c.hidden).length;

  return (
    <div className="py-32">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeader
          align="left"
          eyebrow="Admin"
          title="Project Comments"
          className="space-y-2 mb-8"
          titleClassName="text-3xl"
        />
        <p className="text-sm text-muted-foreground mb-6">
          {visibleCount} visible &middot; {hiddenCount} hidden &middot;{" "}
          {rawComments.length} total
        </p>

        {rawComments.length === 0 ? (
          <p className="text-muted-foreground">No comments yet.</p>
        ) : (
          <div className="space-y-4">
            {rawComments.map((comment) => (
              <div key={comment.id}>
                <p className="text-xs text-muted-foreground mb-1">
                  on{" "}
                  <a
                    href={`/projects/${comment.projectSlug}`}
                    className="text-brand-violet hover:text-brand-violet-hover transition-colors"
                  >
                    {comment.projectSlug}
                  </a>
                </p>
                <CommentList
                  comments={[
                    {
                      ...comment,
                      createdAt: comment.createdAt,
                    },
                  ]}
                  isAdmin
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
