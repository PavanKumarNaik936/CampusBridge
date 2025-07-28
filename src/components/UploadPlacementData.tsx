"use client";

import * as XLSX from "xlsx";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

interface PlacementEntry {
  userEmail: string;
  companyName: string;
  jobTitle?: string;
  package: string;
  date: string;
}

interface UploadError {
  row: number;
  reason: string;
  data: PlacementEntry;
}

export default function UploadPlacementData() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<PlacementEntry[] | null>(null);
  const [uploadSummary, setUploadSummary] = useState<{
    successCount: number;
    skippedCount: number;
    errors: UploadError[];
  } | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    const data = await selectedFile.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const raw = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
    const [header, ...rows] = raw;

    const json: PlacementEntry[] = rows.map((row) => ({
      userEmail: row[0]?.toString().trim() || "",
      companyName: row[1]?.toString().trim() || "",
      jobTitle: row[2]?.toString().trim() || "",
      package: row[3]?.toString().trim() || "",
      date: row[4]?.toString().trim() || "",
    }));

    setParsedData(json);
    toast.info("✅ File parsed successfully. Click 'Upload' to continue.");
  };

  const handleUpload = async () => {
    if (!parsedData) return;
  
    const toastId = toast.loading("Uploading placement data...");
  
    try {
      const res = await axios.post("/api/placements/upload", {
        placements: parsedData,
      });
  
      const result = res.data;
      setUploadSummary(result);
  
      toast.success("✅ Upload completed successfully!", {
        id: toastId, // Replaces the loading toast
      });
    } catch (err: any) {
      toast.error("❌ Upload failed", {
        id: toastId, // Replaces the loading toast
      });
      setUploadSummary(null);
    }
  };
  

  return (
    <div className="my-6">
      <label className="block font-medium text-blue-700 mb-2">
        Upload Placement Excel
      </label>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileSelect}
        className="p-2 border rounded-md mb-4"
      />

      {parsedData && (
        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
        >
          Upload
        </button>
      )}

      {/* 📄 Expected Format */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          📋 Expected Excel Format:
        </h3>
        <table className="table-auto border border-gray-300 text-sm w-full">
          <thead className="bg-blue-100">
            <tr>
              <th className="border px-2 py-1">userEmail</th>
              <th className="border px-2 py-1">companyName</th>
              <th className="border px-2 py-1">jobTitle (optional)</th>
              <th className="border px-2 py-1">package</th>
              <th className="border px-2 py-1">date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-2 py-1">student@example.com</td>
              <td className="border px-2 py-1">Google</td>
              <td className="border px-2 py-1">SWE Intern</td>
              <td className="border px-2 py-1">12.5</td>
              <td className="border px-2 py-1">2023-12-01</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ✅ Upload Summary */}
      {uploadSummary && (
        <div className="bg-gray-100 p-4 rounded-md shadow">
          <h3 className="font-bold text-green-700 mb-2">✅ Upload Summary</h3>
          <p className="text-sm mb-1">Success: {uploadSummary.successCount}</p>
          <p className="text-sm mb-3">Skipped: {uploadSummary.skippedCount}</p>

          {uploadSummary.errors.length > 0 && (
            <>
              <h4 className="font-semibold text-red-600 mb-1">❌ Failed Rows</h4>
              <table className="table-auto border border-gray-300 text-sm w-full">
                <thead className="bg-red-100">
                  <tr>
                    <th className="border px-2 py-1">Row</th>
                    <th className="border px-2 py-1">Reason</th>
                    <th className="border px-2 py-1">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadSummary.errors.map((err, index) => (
                    <tr key={index}>
                      <td className="border px-2 py-1">{err.row}</td>
                      <td className="border px-2 py-1">{err.reason}</td>
                      <td className="border px-2 py-1 whitespace-pre-wrap">
                        {JSON.stringify(err.data, null, 2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </div>
  );
}
