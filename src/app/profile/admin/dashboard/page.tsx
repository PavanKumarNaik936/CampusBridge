// app/admin/dashboard/page.tsx
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardLayout from "./components/DashboardLayout";
import StatCard from "./components/StatCard";

import QuickActions from "./components/QuickActions";
import ChartsSection from "./components/ChartsSection";
import RecentActivity from "./components/RecentActivity";
import AdminAlerts from "./components/AdminAlerts";
import UsersTable from "./components/UsersTable";
import FeedbackPanel from "./components/FeedbackPanel";
import ApplicationsTable from "./components/ApplicationsTable";
export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  

  useEffect(() => {
    if (status === "authenticated" && session?.user.role !== "admin") {
      router.push("/unauthorized"); // create this route if needed
    }
  }, [status, session, router]);

  if (status === "loading") return <div>Loading...</div>;
  return (
    <DashboardLayout>
      {/* Content goes here */}
      <div className="p-4">Welcome, Admin!</div>
        <StatCard/> 
        <QuickActions />
      <ChartsSection />
      <RecentActivity />
      <AdminAlerts />
      <UsersTable />
      <ApplicationsTable/>
      <FeedbackPanel />
    </DashboardLayout>
  );
  
}
