"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { FaBookmark, FaSpinner } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";



interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  mode: string;
  salary?: string;
  deadline?: string;
  postedBy: {
    name: string;
  };
  company?: {
    name: string;
  };
}

export default function JobListingPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState({ location: "", type: "", mode: "" });
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loadingApply, setLoadingApply] = useState(false);
  const [loadingBookmarkId, setLoadingBookmarkId] = useState<string | null>(null);

  const router = useRouter();
    const { data: session } = useSession();

    const searchParams = useSearchParams();
    const highlightId = searchParams.get("highlight");
  
    useEffect(() => {
      if (highlightId) {
        const el = document.getElementById(highlightId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add("ring", "ring-blue-400"); // Temporary highlight
          setTimeout(() => {
            el.classList.remove("ring", "ring-blue-400");
          }, 2000);
        }
      }
    }, [highlightId]);

  useEffect(() => {
    const fetchJobs = async () => {
      const query = new URLSearchParams(filters as any).toString();
      const { data } = await axios.get(`/api/jobs?${query}`);
      setJobs(data);
    };

    fetchJobs();
  }, [filters]);
  // console.log(jobs);

  const handleBookmark = async (targetId: string, type: "job" | "event" | "resource") => {
    setLoadingBookmarkId(targetId);
    try {
      await axios.post("/api/bookmarks", { targetId, type });
      toast.success("🔖 Bookmarked!");
    } catch(err:any) {
        if (err.response?.data?.error === "Already bookmarked") {
            toast.warning("You've already bookmarked this.");
          } else {
            toast.error("❌ Failed to bookmark. Try again.");
          }
    } finally {
      setLoadingBookmarkId(null);
    }
  };
  



  
  const handleApply = async () => {
    if (!selectedJob || !session?.user?.id) return;
  
    setLoadingApply(true);
    try {
      // Use session user ID to fetch full profile
      const { data: user } = await axios.get(`/api/users/${session.user.id}`);
      if (user.role !== "student") {
        toast.error("Only students can apply for jobs.");
        return;
      }
    //   console.log(user);
      if (!user.resumeUrl) {
        toast.error("Please upload your resume before applying.");
        router.push("/profile/edit");
        return;
      }
      // console.log("📦 Sending application payload:", {
      //   jobId: selectedJob.id,
      //   resumeSnapshotUrl: user.resumeUrl,
      //   coverLetter: "",
      // });
      
      await axios.post("/api/applications", {
        jobId: selectedJob.id,
        resumeSnapshotUrl: user.resumeUrl,
        coverLetter: "",
      });
  
      toast.success("🎉 Applied successfully!");
      setSelectedJob(null);
    } catch (err: any) {
      if (err?.response?.data?.error === "Already applied to this job") {
        toast.warning("You’ve already applied to this job.");
      } else {
        toast.error("❌ Failed to apply. Try again.");
      }
    } finally {
      setLoadingApply(false);
    }
  };
  

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
        💼 Job & Internship Listings
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <select
          className="border px-3 py-2 rounded-xl shadow-sm"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        >
          <option value="">All Locations</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Remote">Remote</option>
        </select>

        <select
          className="border px-3 py-2 rounded-xl shadow-sm"
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">All Types</option>
          <option value="Internship">Internship</option>
          <option value="Full-Time">Full-Time</option>
        </select>

        <select
          className="border px-3 py-2 rounded-xl shadow-sm"
          value={filters.mode}
          onChange={(e) => setFilters({ ...filters, mode: e.target.value })}
        >
          <option value="">All Modes</option>
          <option value="Remote">Remote</option>
          <option value="On-Site">On-Site</option>
          <option value="Hybrid">Hybrid</option>
        </select>
            <button
        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-xl font-medium shadow-sm"
        onClick={() => setFilters({ location: "", type: "", mode: "" })}
      >
        🔄 Refresh
      </button>
      </div>


      {/* Job Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-all border border-gray-100">
            {job.company?.name && (
            <p className="text-sm text-gray-600 italic">🏢 {job.company.name}</p>
          )}
            <h2 className="text-xl font-bold text-blue-900 mb-2">{job.title}</h2>
            <p className="text-gray-700 mb-2 line-clamp-3">{job.description.slice(0, 100)}...</p>
            <p className="text-sm text-gray-500">
              {job.location} • {job.type} • {job.mode}
            </p>

            <div className="flex justify-between items-center mt-4">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium"
                onClick={() => setSelectedJob(job)}
              >
                Apply
              </button>

              <button
                onClick={() => handleBookmark(job.id,"job")}
                className="text-gray-600 hover:text-blue-600"
              >
                {loadingBookmarkId === job.id ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaBookmark size={20} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg relative animate-fadeIn">
            <h2 className="text-2xl font-bold text-blue-800 mb-2">{selectedJob.title}</h2>
            <p className="text-gray-700 mb-2">{selectedJob.description}</p>
            <ul className="text-sm text-gray-600 space-y-1 mb-4">
            {selectedJob.company?.name && (
              <li><strong>🏢 Company:</strong> {selectedJob.company.name}</li>
            )}

              <li><strong>📍 Location:</strong> {selectedJob.location}</li>
              <li><strong>💼 Type:</strong> {selectedJob.type}</li>
              <li><strong>🖥️ Mode:</strong> {selectedJob.mode}</li>
              {selectedJob.salary && <li><strong>💰 Salary:</strong> {selectedJob.salary}</li>}
              {selectedJob.deadline && <li><strong>📅 Deadline:</strong> {new Date(selectedJob.deadline).toLocaleDateString()}</li>}
              <li><strong>🧑‍💼 Posted by:</strong> {selectedJob.postedBy.name}</li>
            </ul>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setSelectedJob(null)}
                className="border px-4 py-2 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={loadingApply}
                className={`bg-blue-600 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 ${
                  loadingApply ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
                }`}
              >
                {loadingApply && <FaSpinner className="animate-spin" />}
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
