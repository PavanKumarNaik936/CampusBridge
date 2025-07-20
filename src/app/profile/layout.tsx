// app/profile/layout.tsx
import Sidebar from "@/components/Sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma"; // adjust path if needed

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;

  if (!sessionUser?.email) {
    return <div className="p-4">Not authorized</div>;
  }

  // ✅ Fetch full user from DB using Prisma
  const dbUser = await prisma.user.findUnique({
    where: { email: sessionUser.email },
  });

  if (!dbUser) {
    return <div className="p-4">User not found</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar user={dbUser} /> {/* ✅ Pass full user */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
