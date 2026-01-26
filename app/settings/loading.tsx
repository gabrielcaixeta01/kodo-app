export default function SettingsLoading() {
  return (
    <main className="min-h-screen bg-black text-white p-4 sm:p-6 pb-24">
      <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-neutral-800 rounded w-48" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-neutral-800 rounded" />
          ))}
        </div>
      </div>
    </main>
  );
}
