// /app/api/admin/charts/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Count students by branch
    const studentsByBranch = await prisma.user.groupBy({
      by: ["branch"],
      where: { role: "student", branch: { not: null } },
      _count: { branch: true },
    });

    // Applications by createdAt (group by week or month)
    const apps = await prisma.application.findMany({
      select: { createdAt: true },
    });

    // Group applications by week (simple JS logic)
    const appCounts: Record<string, number> = {};
    apps.forEach((app) => {
      const week = `Week ${Math.ceil(app.createdAt.getDate() / 7)}`;
      appCounts[week] = (appCounts[week] || 0) + 1;
    });

    const applicationChartData = Object.entries(appCounts).map(([week, count]) => ({
      name: week,
      applications: count,
    }));

    return NextResponse.json({
      studentsByBranch,
      applicationChartData,
    });
  } catch (error) {
    console.error("❌ Error fetching chart data:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
