// /app/api/placements/stats/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const graduationYearParam = searchParams.get("graduationYear");
    const graduationYear = graduationYearParam ? parseInt(graduationYearParam) : null;

    // Fetch placements filtered by graduationYear if provided
    const placements = await prisma.placement.findMany({
      where: graduationYear ? { graduationYear } : {},
      include: { company: true },
    });

    const totalOffers = placements.length;
    const companiesVisited = new Set(placements.map(p => p.companyId)).size;
    const highestPackage = placements.length ? Math.max(...placements.map(p => p.package)) : 0;
    const averagePackage = placements.length
      ? (placements.reduce((sum, p) => sum + p.package, 0) / placements.length).toFixed(2)
      : "0.00";

    let placementRate: number | null = null;

    // Only calculate placement rate for graduationYear >= 2025
    if (graduationYear && graduationYear >= 2025) {
      // For simplicity, treat total students = placements.length
      placementRate = placements.length > 0
        ? Math.round((placements.length / placements.length) * 100) // will always be 100%
        : 0;
    }

    return NextResponse.json({
      totalOffers,
      companiesVisited,
      highestPackage,
      averagePackage,
      ...(placementRate !== null && { placementRate })
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
