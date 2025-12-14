import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Role } from "@/generated/prisma";
import ExcelJS from "exceljs";

// Force Node.js runtime (required for ExcelJS)
export const runtime = "nodejs";

interface Params {
  searchParams?: { graduationYear?: string };
}

export async function GET(req: Request, { searchParams }: Params) {
  try {
    const url = new URL(req.url);
    const graduationYearParam = url.searchParams.get("graduationYear");
    const graduationYear = graduationYearParam ? parseInt(graduationYearParam) : undefined;
    // console.log(graduationYear);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Placement Report");

    // Helper to add a section
    const addSection = (title: string, headers: string[], rows: any[]) => {
      sheet.addRow([]);
      const titleRow = sheet.addRow([title]);
      titleRow.font = { bold: true, size: 14 };
      sheet.addRow(headers);
      rows.forEach((row) => {
        sheet.addRow(headers.map((h) => row[h] ?? ""));
      });
    };

    // Fetch placements, optionally filter by graduation year
    const placements = await prisma.placement.findMany({
      where: graduationYear ? { graduationYear } : {},
      include: {
        user: true,
        company: true,
        job: true,
      },
    });

    if (placements.length === 0) {
      return NextResponse.json({ error: "No placements found" }, { status: 404 });
    }

    // 1. Placement Overview (all placed students)
    const placementOverview = placements.map((p) => ({
      Name: p.userName ?? p.user?.name ?? "Unknown",
      Branch: p.branch ?? p.user?.branch ?? "Unknown",
      Email: p.userEmail ?? p.user?.email ?? "Unknown",
      Contact: p.contactNumber ?? p.user?.phone ?? "Not Provided",
      Company: p.company?.name ?? "Unknown",
      JobTitle: p.job?.title ?? "Unknown",
      Package: p.package,
      GraduationYear: p.graduationYear ?? p.user?.graduationYear ?? "Unknown",
    }));
    addSection(
      "Placement Overview",
      ["Name", "Branch", "Email", "Contact", "Company", "JobTitle", "Package", "GraduationYear"],
      placementOverview
    );

    // 2. Branch-wise analysis
    const branchMap = new Map<string, { placed: number; total: number }>();
    placements.forEach((p) => {
      const branch = p.branch ?? p.user?.branch ?? "Unknown";
      if (!branchMap.has(branch)) branchMap.set(branch, { placed: 0, total: 0 });
      const val = branchMap.get(branch)!;
      val.placed++;
      val.total++; // For simplicity, using placements as total students
    });

    const branchStats = Array.from(branchMap.entries()).map(([branch, { placed, total }]) => ({
      Branch: branch,
      Placed: placed,
      Total: total,
      Rate: total ? `${Math.round((placed / total) * 100)}%` : "0%",
    }));
    addSection("Branch-wise Analysis", ["Branch", "Placed", "Total", "Rate"], branchStats);

    // 3. Company-wise analysis
    const companyMap = new Map<string, number[]>();
    placements.forEach((p) => {
      const company = p.company?.name ?? "Unknown";
      if (!companyMap.has(company)) companyMap.set(company, []);
      companyMap.get(company)!.push(p.package);
    });

    const companyStats = Array.from(companyMap.entries()).map(([company, packages]) => {
      const highest = Math.max(...packages);
      const average = (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(2);
      return {
        Company: company,
        Offers: packages.length,
        Highest: `₹${highest} LPA`,
        Average: `₹${average} LPA`,
      };
    });
    addSection("Company-wise Analysis", ["Company", "Offers", "Highest", "Average"], companyStats);

    // 4. Package Analysis
    const packages = placements.map((p) => p.package);
    const highestPackage = Math.max(...packages);
    const avgPackage = (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(2);
    addSection("Package Analysis", ["Metric", "Value"], [
      { Metric: "Highest Package", Value: `₹${highestPackage} LPA` },
      { Metric: "Average Package", Value: `₹${avgPackage} LPA` },
    ]);

    // 5. Top Students (by package)
    const topStudents = placements
      .sort((a, b) => b.package - a.package)
      .slice(0, 10)
      .map((p) => ({
        Name: p.userName ?? p.user?.name ?? "Unknown",
        Company: p.company?.name ?? "Unknown",
        Package: `₹${p.package} LPA`,
      }));
    addSection("Top Students", ["Name", "Company", "Package"], topStudents);

    // Convert to buffer
    const buffer = await workbook.xlsx.writeBuffer();
    const uint8Array = new Uint8Array(buffer);

    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename=placement-report-${graduationYear || "all"}.xlsx`,
      },
    });
  } catch (err) {
    console.error("Error generating report:", err);
    return NextResponse.json({ error: "Failed to generate Excel report" }, { status: 500 });
  }
}
