"use client";
import { useSession } from "@/contexts/SessionContext";
import { useRouter } from "next/navigation";


type Props = {
  title: string;
  estimatedTime: number;
  energyRequired: string;
  reason: string;
};

export function NextActionCard({
  title,
  estimatedTime,
  energyRequired,
  reason,
}: Props) {
  const { startSession } = useSession();
  const router = useRouter();


  return (
    <div className="rounded-2xl border border-neutral-800 p-6 bg-neutral-950">
      <h2 className="text-xs uppercase tracking-widest text-neutral-500">
        Next Right Action
      </h2>

      <p className="mt-4 text-xl font-medium text-white">
        {title}
      </p>

      <div className="mt-4 text-sm text-neutral-400 space-y-1">
        <p>Estimated time: {estimatedTime} min</p>
        <p>Energy required: {energyRequired}</p>
      </div>

      <p className="mt-6 text-xs text-neutral-500">
        {reason}
      </p>

      <button
        onClick={() => {
          startSession(title);
          router.push("/session");
        }}
        className="mt-6 w-full rounded-xl bg-white text-black py-2 text-sm font-medium hover:opacity-90 transition"
      >
        Start session
      </button>
    </div>
  );
}
