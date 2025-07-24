"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PlacementTrends() {
  const [data, setData] = useState<{ year: string; placed: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const res = await axios.get("/api/placements/trends");
        setData(res.data); // Expects: [{ year: "2021", placed: 80 }, ...]
      } catch (err) {
        console.error("Failed to fetch trends:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  return (
    <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
      <h3 className="text-lg font-semibold text-blue-700 mb-4">
        📈 Placement Trends
      </h3>
      {loading ? (
        <p className="text-sm text-gray-500">Loading trends...</p>
      ) : error ? (
        <p className="text-sm text-red-500">Failed to load data.</p>
      ) : data.length === 0 ? (
        <p className="text-sm text-gray-500">No placement data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="placed"
              stroke="#3B82F6"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
