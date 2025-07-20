"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import ProfileOverview from "@/components/ProfileOverview";
import StudentDetails from "@/components/StudentDetails";
import RecruiterDetails from "@/components/RecruiterDetails";

import { User } from "@/generated/prisma"; // assuming this is generated

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [fullUser, setFullUser] = useState<User | null>(null);
// console.log(session);
  useEffect(() => {
    if (session?.user.id) {
      fetch(`/api/users/${session.user.id}`)
        .then((res) => res.json())
        .then((data) => setFullUser(data));
    }
  }, [session]);

  if (status === "loading" || !fullUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }
  

  return (
    <div className="min-h-screen flex bg-gray-50">
      
      <main className="flex-1 p-6 space-y-6">
        <ProfileOverview user={fullUser} />
        {fullUser.role === "student" && <StudentDetails user={fullUser} />}
        {fullUser.role === "recruiter" && <RecruiterDetails user={fullUser} />}
      </main>
    </div>
  );
}
