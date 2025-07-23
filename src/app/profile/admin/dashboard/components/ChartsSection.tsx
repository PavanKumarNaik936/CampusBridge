"use client";
import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis
} from "recharts";
import axios from "axios";

const COLORS = ["#3498db", "#2ecc71", "#e67e22", "#f39c12", "#9b59b6", "#1abc9c"];

export default function ChartsSection() {
  const [appData, setAppData] = useState([]);
  const [branchData, setBranchData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get("/api/admin/charts");
        const { applicationChartData, studentsByBranch } = res.data;

        setAppData(applicationChartData);
        setBranchData(
          studentsByBranch.map((b: any) => ({
            name: b.branch,
            value: b._count.branch,
          }))
        );
      } catch (err) {
        console.error("Failed to load chart data:", err);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* 📈 Applications Over Time */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4">📈 Applications This Month</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={appData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="applications" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🧑‍🎓 Students Branch-wise Pie */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4">🧑‍🎓 Students Branch-wise</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={branchData}
              cx="50%"
              cy="50%"
              label
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {branchData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
