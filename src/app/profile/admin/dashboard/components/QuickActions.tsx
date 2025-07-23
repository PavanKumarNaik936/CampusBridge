// components/admin/QuickActions.tsx
import { useRouter } from "next/navigation";

export default function QuickActions() {
  const router = useRouter();

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
      <h3 className="text-lg font-semibold mb-4">⚡ Quick Actions</h3>
      <div className="flex flex-wrap gap-4">
        <button onClick={() => router.push("/profile/jobs")} className="bg-blue-600 text-white px-4 py-2 rounded-lg">+ Job</button>
        <button onClick={() => router.push("/profile/events")} className="bg-green-600 text-white px-4 py-2 rounded-lg">+ Event</button>
        <button onClick={() => router.push("/profile/admin/resources")} className="bg-purple-600 text-white px-4 py-2 rounded-lg">+ Resource</button>
      </div>
    </div>
  );
}
