"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaLaptop,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaFileAlt,
  FaSpinner,
  FaBuilding,
} from "react-icons/fa";

interface Company {
  id: string;
  name: string;
}

export default function PostJob() {
  const { data: session } = useSession();
  const router = useRouter();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [companyLoading, setCompanyLoading] = useState(true);

  const [form, setForm] = useState({
    companyId: "",
    title: "",
    description: "",
    location: "",
    type: "Internship",
    mode: "Remote",
    salary: "",
    deadline: "",
  });

  const userRole = session?.user?.role;
  const allowed = userRole === "admin" || userRole === "recruiter";

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await axios.get("/api/companies");
        if (!data || data.length === 0) {
          toast.info("No companies found. Please create one first.");
          router.push("/create-company");
        } else {
          setCompanies(data);
          setForm((prev) => ({ ...prev, companyId: data[0].id }));
        }
      } catch (err) {
        toast.error("Failed to load companies");
      } finally {
        setCompanyLoading(false);
      }
    };

    fetchCompanies();
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/jobs", form);
      toast.success("🎉 Job posted successfully!");
      router.push("/profile/jobs");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to post job.");
    } finally {
      setLoading(false);
    }
  };

  if (!allowed)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-600 text-xl font-semibold">
          🚫 Unauthorized: Only admins and recruiters can post jobs.
        </div>
      </div>
    );

  if (companyLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-gray-600">
        <FaSpinner className="animate-spin mr-2" /> Loading companies...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          📌 Post a New Job
        </h1>

        <form onSubmit={handleSubmit} className="grid gap-6">

          {/* Company Selector */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase mb-1">
              <FaBuilding /> Select Company
            </label>
            <select
              name="companyId"
              value={form.companyId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase mb-1">
              <FaBriefcase /> Job Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g., Frontend Developer"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase mb-1">
              <FaFileAlt /> Job Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              required
              placeholder="Describe the role, responsibilities, and qualifications..."
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          {/* Location, Type, Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase mb-1">
                <FaMapMarkerAlt /> Location
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                placeholder="e.g., Bengaluru"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase mb-1">
                  <FaBriefcase /> Type
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Internship">Internship</option>
                  <option value="Full-Time">Full-Time</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase mb-1">
                  <FaLaptop /> Mode
                </label>
                <select
                  name="mode"
                  value={form.mode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Remote">Remote</option>
                  <option value="On-Site">On-Site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Salary & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase mb-1">
                <FaMoneyBillWave /> Salary (Optional)
              </label>
              <input
                type="text"
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="e.g., 5LPA"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase mb-1">
                <FaCalendarAlt /> Application Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 justify-center bg-blue-600 hover:bg-blue-700 transition-all text-white font-semibold py-2 px-6 rounded-xl shadow-md ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Posting...
                </>
              ) : (
                <>
                  ➕ Post Job
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
