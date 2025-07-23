"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaTrash,
} from "react-icons/fa";
import { Prisma } from "@/generated/prisma";

interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  mode: string;
  salary: string;
  deadline: string;
  createdBy: string;
}

type JobWithApplications = Prisma.JobGetPayload<{
  include: {
    applications: true;
    company: true;
  };
}>;

export default function MyPostedJobs() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState<JobWithApplications[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = session?.user?.id;

  const handleDelete = async (jobId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job? This action cannot be undone."
    );

    if (!confirmed) return;

    toast.promise(
      axios.delete(`/api/jobs/${jobId}`),
      {
        loading: "Deleting job...",
        success: () => {
          setJobs((prev) => prev.filter((job) => job.id !== jobId));
          return "Job deleted successfully";
        },
        error: (err) => err.response?.data?.error || "Failed to delete job",
      }
    );
  };

  useEffect(() => {
    if (!userId) return;

    const fetchJobs = async () => {
      try {
        const res = await axios.get(`/api/jobs/user/${userId}`);
        setJobs(res.data.jobs || []);
      } catch (err) {
        setError("Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [userId]);
  // console.log(jobs);
  if (status === "loading" || loading) {
    return (
      <div className="text-center py-20 text-gray-600">
        Loading your posted jobs...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-20">{error}</div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div>
        <div className="text-center py-20 text-gray-500">
          You haven't posted any jobs yet.
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => router.push("/profile/jobs/post")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md transition"
          >
            ➕ Post New Job
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">
        📋 Your Posted Jobs
      </h1>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => router.push("/profile/jobs/post")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md transition"
        >
          ➕ Post New Job
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition-all border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <FaBriefcase /> {job.title}
            </h2>
            <p className="text-sm text-gray-500 mb-2">
            🏢 {job.company?.name || "Unknown Company"}
          </p>
            <p className="text-gray-600 mb-2 line-clamp-3">
              {job.description}
            </p>

            <div className="text-sm text-gray-700 mt-4 space-y-1">
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-500" /> {job.location}
              </p>
              <p className="flex items-center gap-2">
                <FaMoneyBillWave className="text-green-500" />{" "}
                {job.salary || "Not disclosed"}
              </p>
              <p className="flex items-center gap-2">
                <FaCalendarAlt className="text-red-500" /> Deadline:{" "}
                {job.deadline
                  ? new Date(job.deadline).toLocaleDateString()
                  : "No deadline"}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                🧑‍💻 Applications: {job?.applications.length}
              </p>

              <p className="text-sm italic">
                Type: {job.type} | Mode: {job.mode}
              </p>
              <button
                onClick={() =>
                  router.push(`/profile/jobs/${job.id}/applications`)
                }
                className="mt-4 text-blue-600 hover:underline text-sm font-medium"
              >
                📄 View Applications
              </button>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => handleDelete(job.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm shadow-md flex items-center gap-2"
                >
                  <FaTrash className="w-4 h-4" />
                  
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
