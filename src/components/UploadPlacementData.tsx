"use client";

import * as XLSX from "xlsx";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

interface PlacementEntry {
  userName?: string;             // New
  branch?: string;           // New
  contactNumber?: string;    // New
  userEmail: string;
  companyName: string;
  jobTitle?: string;
  package: string;
  date: string;
  graduationYear?: number;
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

  // Parse Excel file
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
      userName: row[0]?.toString().trim() || "",
      branch: row[1]?.toString().trim() || "",
      contactNumber: row[2]?.toString().trim() || "",
      userEmail: row[3]?.toString().trim() || "",
      companyName: row[4]?.toString().trim() || "",
      jobTitle: row[5]?.toString().trim() || "",
      package: row[6]?.toString().trim() || "",
      date: row[7]?.toString().trim() || "",
      graduationYear: row[8] ? Number(row[8]) : undefined,
    }));

    setParsedData(json);
    toast.info("✅ File parsed successfully. Click 'Upload' to continue.");
  };

  // Upload placements
  const handleUpload = async () => {
    if (!parsedData || parsedData.length === 0) return;

    const toastId = toast.loading("Uploading placement data...");

    try {
      const res = await axios.post("/api/placements/upload", {
        placements: parsedData,
      });

      const result = res.data;
      setUploadSummary(result);

      toast.success("✅ Upload completed successfully!", { id: toastId });
    } catch (err: any) {
      toast.error("❌ Upload failed. Please check your file and try again.", { id: toastId });
      setUploadSummary(null);
      console.error("Upload Error:", err);
    }
  };

  return (
    <div className="my-6">
      <label className="block font-medium text-blue-700 mb-2">Upload Placement Excel</label>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileSelect}
        className="p-2 border rounded-md mb-4"
      />

      {parsedData && parsedData.length > 0 && (
        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
        >
          Upload
        </button>
      )}

      {/* Expected Excel Format */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">📋 Expected Excel Format:</h3>
        <table className="table-auto border border-gray-300 text-sm w-full">
          <thead className="bg-blue-100">
            <tr>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Branch</th>
              <th className="border px-2 py-1">Contact Number</th>
              <th className="border px-2 py-1">userEmail</th>
              <th className="border px-2 py-1">companyName</th>
              <th className="border px-2 py-1">jobTitle (optional)</th>
              <th className="border px-2 py-1">package</th>
              <th className="border px-2 py-1">date</th>
              <th className="border px-2 py-1">graduationYear</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-2 py-1">John Doe</td>
              <td className="border px-2 py-1">CSE</td>
              <td className="border px-2 py-1">9876543210</td>
              <td className="border px-2 py-1">student@example.com</td>
              <td className="border px-2 py-1">Google</td>
              <td className="border px-2 py-1">SWE Intern</td>
              <td className="border px-2 py-1">12.5</td>
              <td className="border px-2 py-1">2023-12-01</td>
              <td className="border px-2 py-1">2024</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Upload Summary */}
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
