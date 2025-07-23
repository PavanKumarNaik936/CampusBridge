"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";

type Application = {
  id: string;
  status: "pending" | "shortlisted" | "rejected" | "accepted";
  resumeSnapshotUrl?: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  job: {
    title: string;
  };
};

export default function ApplicationsTable() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      const res = await axios.get("/api/applications/all"); // you should create this route
      setApplications(res.data);
    };

    fetchApplications();
  }, []);

  const handleStatusChange = async (id: string, newStatus: Application["status"]) => {
    await axios.put(`/api/applications/update-status/${id}`, { status: newStatus });
    setApplications(prev =>
      prev.map(app => (app.id === id ? { ...app, status: newStatus } : app))
    );
  };

  const filtered = applications
    .filter(
      (app) =>
        app.user.name.toLowerCase().includes(search.toLowerCase()) ||
        app.user.email.toLowerCase().includes(search.toLowerCase()) ||
        app.job.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
      <h3 className="text-lg font-semibold mb-4">📋 Job Applications</h3>

      <input
        type="text"
        placeholder="Search by name, email, or title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 px-4 py-2 border rounded w-full"
      />

      <table className="w-full text-sm text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Candidate</th>
            <th className="p-2">Email</th>
            <th className="p-2">Job Title</th>
            <th className="p-2">Status</th>
            <th className="p-2">Change</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((app) => (
            <tr key={app.id} className="border-t">
              <td className="p-2">{app.user.name}</td>
              <td className="p-2">{app.user.email}</td>
              <td className="p-2">{app.job.title}</td>
              <td className="p-2">
            <span
                className={`capitalize text-xs font-semibold px-2 py-1 rounded-full
                ${app.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""}
                ${app.status === "shortlisted" ? "bg-blue-100 text-blue-800" : ""}
                ${app.status === "rejected" ? "bg-red-100 text-red-800" : ""}
                ${app.status === "accepted" ? "bg-green-100 text-green-800" : ""}
                `}
            >
                {app.status}
            </span>
            </td>
              <td className="p-2">
                <select
                  value={app.status}
                  onChange={(e) =>
                    handleStatusChange(app.id, e.target.value as Application["status"])
                  }
                  className="text-sm border rounded px-2 py-1"
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
  );
}
