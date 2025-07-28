import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Role } from "@/generated/prisma";
import ExcelJS from "exceljs";

// ✅ Force Node.js runtime (not Edge)
export const runtime = "nodejs";

export async function GET() {
  try {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Placement Report");

    // Helper to add a section
    const addSection = (title: string, headers: string[], rows: any[]) => {
      sheet.addRow([]);
      sheet.addRow([title]).font = { bold: true };
      sheet.addRow(headers);
      rows.forEach((row) => {
        sheet.addRow(headers.map((h) => row[h] ?? ""));
      });
    };

    // 1. Branch-wise Stats
    const students = await prisma.user.findMany({
      where: { role: Role.student },
      select: { id: true, branch: true },
    });

    const branchGroups: Record<string, string[]> = {};
    students.forEach((s) => {
      const branch = s.branch ?? "Unknown";
      if (!branchGroups[branch]) branchGroups[branch] = [];
      branchGroups[branch].push(s.id);
    });

    const placements = await prisma.placement.findMany({
      select: { userId: true },
    });

    const placedUserIds = new Set(placements.map((p) => p.userId));
    const branchStats = Object.entries(branchGroups).map(([branch, ids]) => {
      const placed = ids.filter((id) => placedUserIds.has(id)).length;
      const total = ids.length;
      const rate = total ? Math.round((placed / total) * 100) : 0;
      return {
        Branch: branch,
        Placed: placed,
        Total: total,
        Rate: `${rate}%`,
      };
    });

    addSection("Branch Stats", ["Branch", "Placed", "Total", "Rate"], branchStats);

    // 2. Company-wise Stats
    const companies = await prisma.company.findMany({
      select: {
        name: true,
        placements: { select: { package: true } },
      },
    });

    const companyStats = companies
      .filter((c) => c.placements.length > 0)
      .map((company) => {
        const packages = company.placements.map((p) => p.package);
        const highest = Math.max(...packages);
        const average = (
          packages.reduce((sum, p) => sum + p, 0) / packages.length
        ).toFixed(2);
        return {
          Company: company.name,
          Offers: company.placements.length,
          Highest: `₹${highest} LPA`,
          Average: `₹${average} LPA`,
        };
      });

    addSection("Company Stats", ["Company", "Offers", "Highest", "Average"], companyStats);

    // 3. Offer Types
    const placementsWithJob = await prisma.placement.findMany({
      include: { job: true },
    });

    let fullTime = 0,
      internship = 0,
      unknown = 0;
    placementsWithJob.forEach((p) => {
      const type = p.job?.type?.toLowerCase();
      if (type === "full-time") fullTime++;
      else if (type === "internship") internship++;
      else unknown++;
    });

    const offerTypeStats = [
      { Type: "Full-Time", Count: fullTime },
      { Type: "Internship", Count: internship },
    ];
    if (unknown > 0)
      offerTypeStats.push({ Type: "Unknown", Count: unknown });

    addSection("Offer Types", ["Type", "Count"], offerTypeStats);

    // 4. Overall Stats
    const totalOffers = placementsWithJob.length;
    const totalPlaced = new Set(placementsWithJob.map((p) => p.userId)).size;
    const jobs = await prisma.job.findMany({ select: { companyId: true } });
    const companiesVisited = new Set(jobs.map((j) => j.companyId)).size;
    const highestPackage = Math.max(...placementsWithJob.map((p) => p.package));
    const avgPackage = (
      placementsWithJob.reduce((sum, p) => sum + p.package, 0) / totalOffers
    ).toFixed(2);
    const totalStudents = await prisma.user.count({
      where: { role: Role.student },
    });

    const overallStats = [
      { Metric: "Total Students", Value: totalStudents },
      { Metric: "Total Placed", Value: totalPlaced },
      { Metric: "Total Offers", Value: totalOffers },
      { Metric: "Companies Visited", Value: companiesVisited },
      { Metric: "Highest Package", Value: `₹${highestPackage} LPA` },
      { Metric: "Average Package", Value: `₹${avgPackage} LPA` },
      {
        Metric: "Placement Rate",
        Value: `${((totalPlaced / totalStudents) * 100).toFixed(0)}%`,
      },
    ];

    addSection("Overall Stats", ["Metric", "Value"], overallStats);

    // 5. Top Placements
    const topPlacements = await prisma.placement.findMany({
      include: { user: true, company: true },
      orderBy: { package: "desc" },
      take: 6,
    });

    const topPlacementStats = topPlacements.map((p) => ({
      Name: p.user?.name ?? "Unknown",
      Company: p.company?.name ?? "Unknown",
      Package: `₹${p.package} LPA`,
    }));

    addSection("Top Students", ["Name", "Company", "Package"], topPlacementStats);

    // 6. Yearly Trends
    const trendData = await prisma.placement.findMany({
      include: { user: { select: { graduationYear: true } } },
    });

    const trendMap = new Map<number, number>();
    trendData.forEach((p) => {
      const year = p.user?.graduationYear;
      if (year) trendMap.set(year, (trendMap.get(year) || 0) + 1);
    });

    const trends = Array.from(trendMap.entries()).map(([year, count]) => ({
      Year: year,
      Placed: count,
    }));

    addSection("Yearly Trends", ["Year", "Placed"], trends);

    // 🔄 Return Excel file as response
    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer as unknown as Buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=placement-report.xlsx",
      },
    });
  } catch (err) {
    console.error("Error generating Excel report:", err);
    return NextResponse.json(
      { error: "Failed to generate Excel report" },
      { status: 500 }
    );
  }
}
