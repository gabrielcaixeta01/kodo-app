export default function LoginLoading() {
  return (
    <main className="min-h-screen bg-black text-white p-4 sm:p-6 flex items-center justify-center">
      <div className="max-w-sm w-full rounded-2xl border border-neutral-800 p-6 space-y-4 animate-pulse">
        <div className="h-6 bg-neutral-800 rounded w-32" />
        <div className="h-4 bg-neutral-800 rounded w-full" />
        <div className="h-4 bg-neutral-800 rounded w-3/4" />
        <div className="h-10 bg-neutral-800 rounded" />
      </div>
    </main>
  );
}
