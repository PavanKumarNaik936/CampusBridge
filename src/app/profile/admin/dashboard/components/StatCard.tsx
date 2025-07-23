"use client";

import { useEffect, useState } from "react";
import { FaUserGraduate, FaBriefcase, FaCalendarAlt, FaBookOpen } from "react-icons/fa";
import axios from "axios";

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
}

const ICONS = {
  totalStudents: <FaUserGraduate />,
  jobsPosted: <FaBriefcase />,
  eventsCreated: <FaCalendarAlt />,
  resourcesShared: <FaBookOpen />,
};

export default function StatCards() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get("/api/admin/stats");
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };

    fetchStats();
  }, []);
  // console.log(stats);
  if (!stats) return <p>Loading...</p>;

  const statItems: StatCardProps[] = [
    { label: "Total Students", value: stats.totalStudents, icon: ICONS.totalStudents },
    { label: "Jobs Posted", value: stats.jobsPosted, icon: ICONS.jobsPosted },
    { label: "Events Created", value: stats.eventsCreated, icon: ICONS.eventsCreated },
    { label: "Resources Shared", value: stats.resourcesShared, icon: ICONS.resourcesShared },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      {statItems.map((s, i) => (
        <div key={i} className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
          {s.icon && <div className="text-2xl text-blue-600">{s.icon}</div>}
          <div>
            <h4 className="text-gray-500 text-sm">{s.label}</h4>
            <p className="text-xl font-bold">{s.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
