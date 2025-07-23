"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Activity {
  time: string;
  text: string;
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const res = await axios.get("/api/admin/activities");
        setActivities(res.data.activities);
      } catch (err) {
        console.error("Failed to fetch recent activities", err);
      }
    }

    fetchActivities();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
      <h3 className="text-lg font-semibold mb-4">🕒 Recent Activities</h3>
      <ul className="space-y-3">
        {activities.length === 0 ? (
          <li className="text-gray-500 text-sm">No recent activity</li>
        ) : (
          activities.map((item, idx) => (
            <li key={idx} className="text-sm text-gray-700 flex justify-between">
              <span>{item.text}</span>
              <span className="text-gray-400">{item.time}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
