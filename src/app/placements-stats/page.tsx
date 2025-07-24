import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import PlacementStats from "../profile/admin/placementsStats/page";

export default async function PlacementStatsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login"); // 🔐 redirect if not logged in
  }

  return (
    <div className="max-w-7xl mx-auto my-10 px-4">
      <PlacementStats />
    </div>
  );
}
