"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface CompanyStat {
  name: string;
  offers: number;
  highest: string;
  average: string;
}

export default function CompanyWiseStats() {
  const [companies, setCompanies] = useState<CompanyStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyStats = async () => {
      try {
        const res = await axios.get("/api/placements/company-wise");
        setCompanies(res.data);
      } catch (err) {
        console.error("Failed to fetch company stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyStats();
  }, []);

  return (
    <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
      <h3 className="text-lg font-semibold text-blue-700 mb-4">🏢 Company-wise Stats</h3>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : companies.length === 0 ? (
        <p className="text-gray-500">No placement data available yet.</p>
      ) : (
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b">
              <th>Company</th>
              <th>Offers</th>
              <th>Highest</th>
              <th>Average</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c.name} className="border-b hover:bg-gray-50">
                <td>{c.name}</td>
                <td>{c.offers}</td>
                <td>{c.highest}</td>
                <td>{c.average}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
