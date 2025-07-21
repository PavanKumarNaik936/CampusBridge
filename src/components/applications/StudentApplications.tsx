"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function StudentApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await axios.get("/api/applications");
        setApplications(data);
      } catch (err) {
        toast.error("❌ Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) return <p className="text-gray-500 text-sm">Loading applications...</p>;
  if (!applications.length) return <p className="text-gray-500 text-sm">No applications found.</p>;

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {applications.map((app) => (
        <div
          key={app.id}
          className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">
                {app.job?.title || "Untitled Job"}
              </h3>
              <p className="text-sm text-gray-500">{app.job?.company || "Company name"}</p>
            </div>
            <span className="text-xs text-gray-400">
              {new Date(app.createdAt).toLocaleDateString()}
            </span>
          </div>

          <p className="mt-3 text-sm text-gray-600 line-clamp-3">
            {app.job?.description || "No job description provided."}
          </p>

          <div className="mt-4 flex justify-between items-center">
            <a
              href={app.resumeSnapshotUrl}
              target="_blank"
              className="text-blue-600 text-sm underline hover:text-blue-800 transition"
              rel="noopener noreferrer"
            >
              View Resume Snapshot
            </a>

            <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full font-medium">
              Applied
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
