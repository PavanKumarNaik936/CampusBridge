import { useEffect, useState } from "react";
import axios from "axios";

interface Stats {
  totalPlaced: number;
  totalOffers: number;
  companiesVisited: number;
  placementRate: number;
  highestPackage: number;
  averagePackage: number;
}

export default function PlacementStatsCards() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [graduationYear, setGraduationYear] = useState<string>("");

  const fetchStats = async (year?: string) => {
    setLoading(true);
    try {
      const url = year ? `/api/placements/stats?graduationYear=${year}` : "/api/placements/stats";
      const { data } = await axios.get(url);
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch placement stats:", error);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(graduationYear);
  }, [graduationYear]);

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

  if (loading) return <p>Loading placement stats...</p>;
  if (!stats) return <p>Failed to load stats.</p>;

  const formattedStats = [
    { label: "Total Students Placed", value: stats.totalPlaced },
    { label: "Total Offers Made", value: stats.totalOffers },
    { label: "Companies Visited", value: stats.companiesVisited },
    { label: "Placement Rate", value: `${stats.placementRate}%` },
    { label: "Highest Package", value: `₹${stats.highestPackage} LPA` },
    { label: "Average Package", value: `₹${stats.averagePackage} LPA` },
  ];

  return (
    <div className="space-y-6">
      {/* Filter UI */}
      <div className="flex gap-4 items-center">
        <label className="text-sm font-semibold text-gray-700">Filter by Graduation Year:</label>
        <select
          value={graduationYear}
          onChange={(e) => setGraduationYear(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1 text-sm"
        >
          <option value="">All Years</option>
          {graduationYears.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {formattedStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow p-4 border border-gray-200"
          >
            <p className="text-gray-600 text-sm">{stat.label}</p>
            <p className="text-xl font-bold text-blue-700">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
