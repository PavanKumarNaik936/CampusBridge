"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Application } from "@/generated/prisma";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface FullApplication extends Application {
  user: {
    name: string;
    email: string;
    resumeUrl?: string;
  };
  job: {
    title: string;
    companyId: true,
  };
  isPlaced: boolean;
}

export default function JobApplicationsPage() {
    const router = useRouter();

  const { jobId } = useParams();
  const [applications, setApplications] = useState<FullApplication[]>([]);
  const [jobTitle, setJobTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedApp, setSelectedApp] = useState<FullApplication | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [packageInput, setPackageInput] = useState("6.0");
  const [loadingPlacement, setLoadingPlacement] = useState(false);


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
  // const handleMarkAsPlaced = async (app: FullApplication) => {
  //   const confirmed = window.confirm(`Are you sure you want to mark ${app.user.name} as placed?`);
  //   if (!confirmed) return;
  
  //   try {
  //     const pkg = window.prompt("Enter the package offered (in LPA):", "6.0");
  //     if (!pkg) return;
  
  //     await axios.post("/api/placements/create", {
  //       userId: app.userId,
  //       jobId: app.jobId,
  //       companyId: app.job.companyId, // make sure this exists in the data
  //       package: parseFloat(pkg),
  //     });
  
  //     alert("✅ Placement recorded successfully.");
  
  //     // Optional: update UI state
  //     setApplications((prev) =>
  //       prev.map((a) =>
  //         a.id === app.id ? { ...a, isPlaced: true } : a
  //       )
  //     );
  //   } catch (err) {
  //     console.error(err);
  //     alert("❌ Failed to create placement entry.");
  //   }
  // };
  const openConfirmation = (app: FullApplication) => {
    setSelectedApp(app);
    setShowConfirm(true);
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
              <th className="px-4 py-3 text-left">Placement</th> {/* Add this */}
            </tr>
          </thead>

            {/* <tbody>
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
                  {app.status === "accepted" && (
              <div className="mt-2">
                {app.isPlaced ? (
                  <span className="text-green-600 font-semibold">✔️ Placed</span>
                ) : (
                  <button
                onClick={() => openConfirmation(app)}
                className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md ml-3"
                disabled={app.isPlaced}
              >
                {app.isPlaced ? "✅ Placed" : "Mark as Placed"}
              </button>

                )}
              </div>
            )}

                </tr>
              ))}
            </tbody> */}
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
                      disabled={app.isPlaced && app.status === "accepted"}
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="pending">Pending</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                      <option value="accepted">Accepted</option>
                    </select>
                  </td>

                  <td className="px-4 py-3">
                    {app.status === "accepted" && (
                      app.isPlaced ? (
                        <span className="text-green-600 font-semibold">✔️ Placed</span>
                      ) : (
                        <button
                          onClick={() => openConfirmation(app)}
                          className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md"
                          disabled={app.isPlaced}
                        >
                          Mark as Placed
                        </button>
                      )
                    )}
                    
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
      {showConfirm && selectedApp && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Confirm Placement
          </h2>
          <p className="mb-4 text-gray-600">
            Are you sure you want to mark <strong>{selectedApp.user.name}</strong> as placed?
          </p>
    
          <label className="block mb-4">
            <span className="text-gray-700">Package (in LPA):</span>
            <input
              type="number"
              value={packageInput}
              onChange={(e) => setPackageInput(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-blue-200"
              placeholder="e.g., 6.5"
            />
          </label>
    
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                setLoadingPlacement(true); // start loading
                try {
                  await axios.post("/api/placements/create", {
                    userId: selectedApp.userId,
                    jobId: selectedApp.jobId,
                    companyId: selectedApp.job.companyId,
                    package: parseFloat(packageInput),
                  });
    
                  toast.success("Placement recorded successfully ✅");
                  setApplications((prev) =>
                    prev.map((a) =>
                      a.id === selectedApp.id ? { ...a, isPlaced: true } : a
                    )
                  );
                  setShowConfirm(false);
                } catch (err) {
                  console.error(err);
                  toast.error("Failed to create placement entry ❌");
                } finally {
                  setLoadingPlacement(false); // end loading
                }
              }}
                disabled={loadingPlacement}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-60"
            >
               {loadingPlacement ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              <span>Placing...</span>
            </>
          ) : (
            "Confirm & Place"
          )}
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
    
    
    
  );
}
