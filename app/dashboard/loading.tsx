export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-black text-white p-4 sm:p-6 pb-24">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="space-y-2 animate-pulse">
          <div className="h-8 bg-neutral-800 rounded w-48" />
          <div className="h-4 bg-neutral-800 rounded w-64" />
        </header>

        <div className="rounded-2xl border border-neutral-800 p-6 space-y-4 animate-pulse">
          <div className="h-32 bg-neutral-800 rounded" />
        </div>

        <div className="space-y-3 animate-pulse">
          <div className="h-5 bg-neutral-800 rounded w-56" />
          <div className="rounded-2xl border border-neutral-800 p-6">
            <div className="h-24 bg-neutral-800 rounded" />
          </div>
        </div>
      </div>
    </main>
  );
}
