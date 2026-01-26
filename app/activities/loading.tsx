export default function ActivitiesLoading() {
  return (
    <main className="min-h-screen bg-black text-white p-4 sm:p-6 pb-24">
      <div className="max-w-3xl mx-auto space-y-8 animate-pulse">
        <header className="space-y-2">
          <div className="h-8 bg-neutral-800 rounded w-48" />
          <div className="h-4 bg-neutral-800 rounded w-64" />
        </header>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-neutral-800 p-6">
              <div className="h-20 bg-neutral-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
