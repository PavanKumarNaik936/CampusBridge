"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Student {
  name: string;
  company: string;
  package: string;
}

export default function TopPlacedStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [graduationYears, setGraduationYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");

  // Fetch graduation years
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const { data } = await axios.get("/api/placements/years");
        setGraduationYears(data);
      } catch (err) {
        console.error("Failed to fetch years", err);
      }
    };
    fetchYears();
  }, []);

  // Fetch top placed students
  useEffect(() => {
    const fetchTopStudents = async () => {
      setLoading(true);
      try {
        const url = selectedYear
          ? `/api/placements/top-placed?graduationYear=${selectedYear}`
          : `/api/placements/top-placed`;
        const { data } = await axios.get(url);
        console.log(data);
        setStudents(data);
      } catch (err) {
        console.error("Failed to fetch students", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopStudents();
  }, [selectedYear]);

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-blue-700 mb-4">🏆 Top Placed Students</h3>

      {/* Filter by graduation year */}
      <div className="mb-4">
        <label className="text-sm font-medium mr-2">Graduation Year:</label>
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
        <p className="text-sm text-gray-500">Loading...</p>
      ) : students.length === 0 ? (
        <p className="text-sm text-gray-500">No data available.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {students.map((student) => (
            <div
              key={student.name + student.company}
              className="bg-white p-4 rounded-xl shadow border border-gray-200"
            >
              <p className="font-semibold text-gray-800">{student.name}</p>
              <p className="text-sm text-gray-600">{student.company}</p>
              <p className="text-sm text-green-600 font-medium">
                {student.package}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
