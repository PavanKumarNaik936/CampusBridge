"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

const COLORS = ["#4F46E5", "#22C55E", "#FACC15", "#EC4899", "#06B6D4"];

type OfferTypeData = {
  name: string;
  value: number;
};

export default function OfferTypePieChart() {
  const [data, setData] = useState<OfferTypeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOfferTypes = async () => {
      try {
        const res = await axios.get("/api/placements/offer-types");
        setData(res.data); // Array of { name: string; value: number }
      } catch (err) {
        console.error("Error fetching offer type data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOfferTypes();
  }, []);

  return (
    <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
      <h3 className="text-lg font-semibold text-blue-700 mb-4">
        🎯 Offer Type Distribution
      </h3>

      {loading ? (
        <p className="text-sm text-gray-500">Loading chart...</p>
      ) : error ? (
        <p className="text-sm text-red-500">Failed to load chart data.</p>
      ) : data.length === 0 ? (
        <p className="text-sm text-gray-500">No data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
