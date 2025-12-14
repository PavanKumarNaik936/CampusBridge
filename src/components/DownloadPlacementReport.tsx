"use client";

import { FiDownload } from "react-icons/fi";
import { useState, useEffect } from "react";
import axios from "axios";

export default function DownloadPlacementReport() {
  const [loading, setLoading] = useState(false);
  const [graduationYear, setGraduationYear] = useState(""); // "" means all years
  const [years, setYears] = useState<number[]>([]);

  // Fetch available graduation years from API
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await axios.get("/api/placements/years");
        const fetchedYears: number[] = response.data || [];

        // Sort descending so latest year is first
        fetchedYears.sort((a, b) => b - a);

        setYears(fetchedYears);
      } catch (err) {
        console.error("Failed to fetch graduation years:", err);
        alert("Failed to load graduation years.");
      }
    };
    fetchYears();
  }, []);

  const handleDownload = async () => {
    setLoading(true);
    try {
      // Only include graduationYear query if a specific year is selected
      const queryParam = graduationYear ? `?graduationYear=${graduationYear}` : "";
      const response = await axios.get(`/api/placements/report${queryParam}`, {
        responseType: "blob", // important for binary file download
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = graduationYear
        ? `placement-report-${graduationYear}.xlsx`
        : `placement-report-all-years.xlsx`;
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
    <div className="flex items-center gap-4 mb-4">
      <select
        value={graduationYear}
        onChange={(e) => setGraduationYear(e.target.value)}
        className="border px-3 py-2 rounded-lg shadow-sm"
      >
        <option value="">All Years</option>
        {years.map((year) => (
          <option key={year} value={year.toString()}>
            {year}
          </option>
        ))}
      </select>

      <button
        onClick={handleDownload}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        disabled={loading}
      >
        <FiDownload className="text-lg" />
        {loading ? "Downloading..." : "Download Report"}
      </button>
    </div>
  );
}
