export default function FocusLoading() {
  return (
    <main className="min-h-screen bg-black text-white p-4 sm:p-6 flex items-center justify-center">
      <div className="max-w-md w-full rounded-2xl border border-neutral-800 p-4 sm:p-6 space-y-4 animate-pulse">
        <div className="h-6 bg-neutral-800 rounded" />
        <div className="h-4 bg-neutral-800 rounded w-2/3" />
        <div className="h-24 bg-neutral-800 rounded" />
      </div>
    </main>
  );
}
