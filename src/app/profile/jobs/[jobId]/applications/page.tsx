"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Application } from "@/generated/prisma";
import { useRouter } from "next/navigation";

interface FullApplication extends Application {
  user: {
    name: string;
    email: string;
    resumeUrl?: string;
  };
  job: {
    title: string;
  };
}

export default function JobApplicationsPage() {
    const router = useRouter();

  const { jobId } = useParams();
  const [applications, setApplications] = useState<FullApplication[]>([]);
  const [jobTitle, setJobTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!jobId) return;
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`/api/jobs/${jobId}/applications`);
        const apps = res.data.applications || [];
        setApplications(apps);
        if (apps.length > 0) {
          setJobTitle(apps[0].job.title);
        }
      } catch (err) {
        setError("Failed to fetch applications.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [jobId]);
// console.log(applications);
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id
            ? { ...app, status: newStatus as Application["status"] }
            : app
        )
      );
      await axios.put(`/api/applications/update-status/${id}`, {
        status: newStatus,
      });
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-600">⏳ Loading applications...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2 text-blue-700 text-center">
        📄 Applications for Job
      </h1>
      <button
        onClick={() => router.push("/profile/jobs")} // replace with your actual route
        className="flex items-center text-blue-600 hover:underline mb-4"
        >
        <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to All Jobs
        </button>

      {jobTitle && (
        <p className="text-center text-gray-600 text-lg mb-6">
          Position: <span className="font-semibold">{jobTitle}</span>
        </p>
      )}

      {applications.length === 0 ? (
        <p className="text-gray-500 text-center">No applications submitted yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden text-sm">
            <thead className="bg-blue-50 text-blue-900 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Resume</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Update Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{app.user.name}</td>
                  <td className="px-4 py-3">{app.user.email}</td>
                  <td className="px-4 py-3">
                    {app.user.resumeUrl ? (
                      <a
                        href={app.user.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        View Resume
                      </a>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize
                        ${app.status === "pending" && "bg-yellow-100 text-yellow-800"}
                        ${app.status === "shortlisted" && "bg-blue-100 text-blue-800"}
                        ${app.status === "rejected" && "bg-red-100 text-red-800"}
                        ${app.status === "accepted" && "bg-green-100 text-green-800"}
                      `}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="pending">Pending</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                      <option value="accepted">Accepted</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
