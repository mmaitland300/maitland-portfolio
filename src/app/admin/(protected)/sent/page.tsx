import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/admin";
import { SectionHeader } from "@/components/ui/section-header";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

interface Props {
  searchParams: Promise<{ page?: string }>;
}

function sentHref(page: number) {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  const q = params.toString();
  return `/admin/sent${q ? `?${q}` : ""}`;
}

export default async function AdminSentPage({ searchParams }: Props) {
  await requireAdminPage();

  const { page: pageParam } = await searchParams;
  const total = await prisma.sentEmail.count();
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rawPage = parseInt(pageParam ?? "1", 10);
  const pageNum =
    Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;
  const currentPage = Math.min(pageNum, totalPages);
  const skip = (currentPage - 1) * PAGE_SIZE;

  const emails = await prisma.sentEmail.findMany({
    orderBy: { createdAt: "desc" },
    skip,
    take: PAGE_SIZE,
    select: {
      id: true,
      toEmail: true,
      toName: true,
      subject: true,
      body: true,
      createdAt: true,
      fromEmail: true,
      replyToEmail: true,
      resendMessageId: true,
      submissionId: true,
      sentBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return (
    <div className="py-32">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeader
          align="left"
          eyebrow="Admin"
          title="Sent Email"
          className="mb-2 space-y-2"
          titleClassName="text-3xl"
        />
        <p className="mb-6 text-sm text-muted-foreground">
          {total} sent message{total === 1 ? "" : "s"}
        </p>

        {emails.length === 0 ? (
          <div className="rounded-xl border border-border bg-card/50 py-16 text-center">
            <p className="text-muted-foreground">No sent emails yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {emails.map((email) => (
              <details
                key={email.id}
                className="rounded-xl border border-border bg-card/30 p-4"
              >
                <summary className="cursor-pointer list-none">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {email.subject}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        To {email.toName ? `${email.toName} ` : ""}
                        {`<${email.toEmail}>`}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {email.createdAt.toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </summary>

                <div className="mt-4 space-y-3 border-t border-border pt-3">
                  <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                    <p>
                      <span className="font-medium text-foreground">From:</span>{" "}
                      {email.fromEmail ?? "-"}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Reply-To:</span>{" "}
                      {email.replyToEmail ?? "-"}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Type:</span>{" "}
                      {email.submissionId ? "Reply to inbox message" : "Standalone compose"}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Sent by:</span>{" "}
                      {email.sentBy?.name ?? email.sentBy?.email ?? "Unknown"}
                    </p>
                    <p className="sm:col-span-2">
                      <span className="font-medium text-foreground">Resend ID:</span>{" "}
                      {email.resendMessageId ?? "-"}
                    </p>
                  </div>
                  <div className="rounded-md border border-border/70 bg-card/40 p-3">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Body
                    </p>
                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                      {email.body}
                    </p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        )}

        {totalPages > 1 ? (
          <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-sm sm:flex-row">
            {currentPage > 1 ? (
              <Link
                href={sentHref(currentPage - 1)}
                className="text-brand-violet hover:text-brand-violet-hover"
              >
                Previous
              </Link>
            ) : (
              <span className="text-muted-foreground">Previous</span>
            )}
            <span className="text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages ? (
              <Link
                href={sentHref(currentPage + 1)}
                className="text-brand-violet hover:text-brand-violet-hover"
              >
                Next
              </Link>
            ) : (
              <span className="text-muted-foreground">Next</span>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
