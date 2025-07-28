"use client";

import PlacementStatsCards from "./PlacementStatsCards";
import CompanyWiseStats from "./CompanyWiseStats";
import BranchWisePlacement from "./BranchWisePlacement";
import OfferTypePieChart from "./OfferTypePieChart";
import PlacementTrends from "./PlacementTrends";
import TopPlacedStudents from "./TopPlacedStudents";
import UploadPlacementData from "@/components/UploadPlacementData";
import { useSession } from "next-auth/react";
import { useState } from "react";
import DownloadPlacementReport from "@/components/DownloadPlacementReport";

export default function PlacementStats() {
  const { data: session } = useSession();
  const role = session?.user?.role; // adjust this based on your session shape
  const [showUpload, setShowUpload] = useState(false);

  return (
    <section className="p-6 bg-gray-50 rounded-2xl shadow-inner">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">📊 Placement Statistics</h2>
      <div className="flex justify-end mb-4">
      <DownloadPlacementReport />
    </div>
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
      {role === "admin" && (
        <div className="mt-6">
          {!showUpload ? (
            <button
              onClick={() => setShowUpload(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Upload Placement Data
            </button>
          ) : (
            <UploadPlacementData />
          )}
        </div>
      )}
      
    </section>
  );
}