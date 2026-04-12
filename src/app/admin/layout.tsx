export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full flex flex-col flex-1 bg-background text-foreground">
      {children}
    </div>
  );
}
