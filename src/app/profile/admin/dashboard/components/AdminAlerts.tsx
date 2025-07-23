"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Alert {
  message: string;
  type: "warning" | "danger" | "info" | "notice";
}

export default function AdminAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await axios.get("/api/admin/alerts");
        setAlerts(res.data.alerts);
      } catch (err) {
        console.error("Failed to fetch alerts:", err);
      }
    };
    fetchAlerts();
  }, []);

  const getColor = (type: Alert["type"]) => {
    switch (type) {
      case "danger":
        return "text-red-700";
      case "warning":
        return "text-yellow-600";
      case "info":
        return "text-blue-600";
      case "notice":
        return "text-green-600";
      default:
        return "text-gray-700";
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
      <h3 className="text-lg font-semibold mb-4">🛡️ Alerts & Pending Actions</h3>
      <ul className="space-y-2 font-medium">
        {alerts.map((alert, idx) => (
          <li key={idx} className={`${getColor(alert.type)} flex items-center`}>
            • {alert.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
