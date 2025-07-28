// components/DownloadPlacementReport.tsx
"use client";

import { FiDownload } from "react-icons/fi";
import { useState } from "react";
import axios from "axios";

export default function DownloadPlacementReport() {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/placements/report", {
        responseType: "blob", // important for binary file download
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "placement-report.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mb-4"
    >
      <FiDownload className="text-lg" />
      {loading ? "Downloading..." : "Download Report"}
    </button>
  );
}
