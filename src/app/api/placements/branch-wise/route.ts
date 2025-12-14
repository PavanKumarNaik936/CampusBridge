import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const graduationYearParam = url.searchParams.get("graduationYear");
    const graduationYear = graduationYearParam ? parseInt(graduationYearParam) : undefined;

    // Fetch placements with graduationYear and branch
    const placements = await prisma.placement.findMany({
      where: graduationYear ? { graduationYear } : {},
      select: {
        branch: true,
        graduationYear: true,
        userId: true,
      },
    });

    // Group placements by branch
    const branchGroups: Record<string, { placed: number; total?: number }> = {};

    placements.forEach((p) => {
      const branchName = p.branch ?? "Unknown";
      if (!branchGroups[branchName]) branchGroups[branchName] = { placed: 0, total: 0 };
      branchGroups[branchName].placed += 1;
    });

    const stats = Object.entries(branchGroups).map(([branch, data]) => {
      if ((graduationYear && graduationYear >= 2025) || (!graduationYear && placements.some(p => p.graduationYear && p.graduationYear >= 2025))) {
        // For 2025+, include total users (same as placed count here)
        const totalUsers = data.placed; // You can modify if you have user table data
        const rate = totalUsers ? Math.round((data.placed / totalUsers) * 100) : 0;
        return {
          branch,
          totalUsers,
          totalPlaced: data.placed,
          rate: `${rate}%`,
        };
      } else {
        // For <2025, only show branch and total placed
        return {
          branch,
          totalPlaced: data.placed,
        };
      }
    });

    return NextResponse.json(stats);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch branch-wise stats" }, { status: 500 });
  }
}
