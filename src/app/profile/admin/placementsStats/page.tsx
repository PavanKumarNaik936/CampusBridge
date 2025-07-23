"use client";

import PlacementStatsCards from "./PlacementStatsCards";
import CompanyWiseStats from "./CompanyWiseStats";
import BranchWisePlacement from "./BranchWisePlacement";
import OfferTypePieChart from "./OfferTypePieChart";
import PlacementTrends from "./PlacementTrends";
import TopPlacedStudents from "./TopPlacedStudents";

export default function PlacementStats() {
  return (
    <section className="p-6 bg-gray-50 rounded-2xl shadow-inner">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">📊 Placement Statistics</h2>
      <PlacementStatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
        <CompanyWiseStats />
        <BranchWisePlacement />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <OfferTypePieChart />
        <PlacementTrends />
      </div>

      <TopPlacedStudents />

      <div className="flex justify-end mt-6">
        <button className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-xl shadow">
          ⬇️ Export as PDF / CSV
        </button>
      </div>
    </section>
  );
}