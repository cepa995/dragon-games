export function AuthShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-6 py-16"
    >
      <div className="rounded-hero border-border bg-surface border p-6 sm:p-8">
        <h1 className="mb-6 text-2xl">{title}</h1>
        {children}
      </div>
    </main>
  );
}
