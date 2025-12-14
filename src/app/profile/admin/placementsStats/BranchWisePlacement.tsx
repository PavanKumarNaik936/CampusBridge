"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface BranchStat {
  branch: string;
  totalPlaced: number;
  totalUsers?: number;   // optional for <2025
  rate?: string;    // optional for <2025
}

export default function BranchWisePlacement() {
  const [branches, setBranches] = useState<BranchStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>(""); 
  const [graduationYears, setGraduationYears] = useState<string[]>([]);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const { data } = await axios.get("/api/placements/years");
        setGraduationYears(data);
      } catch (error) {
        console.error("Failed to fetch graduation years:", error);
      }
    };
    fetchYears();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const url = selectedYear
          ? `/api/placements/branch-wise?graduationYear=${selectedYear}`
          : `/api/placements/branch-wise`;
        const res = await axios.get(url);
        setBranches(res.data);
        // console.log(res.data);
      } catch (err) {
        console.error("Failed to fetch branch stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [selectedYear]);

  // Determine if total & rate columns should be shown
  const showTotalRate = selectedYear && parseInt(selectedYear) >= 2025;

  return (
    <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
      <h3 className="text-lg font-semibold text-blue-700 mb-4">🏫 Branch-wise Stats</h3>

      {/* Graduation Year Filter */}
      <div className="mb-4">
        <label className="mr-2 font-medium text-sm">Graduation Year:</label>
        <select
          className="border p-1 rounded"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="">All</option>
          {graduationYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : branches.length === 0 ? (
        <p className="text-gray-500">No data available.</p>
      ) : (
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b">
              <th>Branch</th>
              <th>Placed</th>
              {showTotalRate && (
                <>
                  <th>Total</th>
                  <th>Rate</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {branches.map((b) => (
              <tr key={b.branch} className="border-b hover:bg-gray-50">
                <td>{b.branch}</td>
                <td>{b.totalPlaced}</td>
                {showTotalRate && (
                  <>
                    <td>{b.totalPlaced ?? b.totalPlaced}</td>
                    <td>{b.rate ?? "0%"}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
