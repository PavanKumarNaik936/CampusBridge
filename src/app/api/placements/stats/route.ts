// /app/api/placements/stats/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Role } from "@/generated/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const graduationYear = searchParams.get("graduationYear");

    const placementFilter = graduationYear
      ? {
          user: {
            graduationYear: parseInt(graduationYear),
          },
        }
      : {};

    const placements = await prisma.placement.findMany({
      where: placementFilter,
      include: {
        user: true,
        company: true,
      },
    });

    const totalOffers = placements.length;
    const uniqueStudentsPlaced = new Set(placements.map((p) => p.userId)).size;

    const jobs = await prisma.job.findMany({ select: { companyId: true } });
    const companiesVisited = new Set(jobs.map((j) => j.companyId)).size;

    const highestPackage = placements.length
      ? Math.max(...placements.map((p) => p.package))
      : 0;

    const averagePackage = placements.length
      ? (placements.reduce((sum, p) => sum + p.package, 0) / placements.length).toFixed(2)
      : "0.00";

      const studentFilter = graduationYear
      ? { role: Role.student, graduationYear: parseInt(graduationYear) }
      : { role: Role.student };
    

    const totalStudents = await prisma.user.count({
      where: studentFilter,
    });

    const placementRate: string = totalStudents > 0
        ? ((uniqueStudentsPlaced / totalStudents) * 100).toFixed(0)
        : "0";

    return NextResponse.json({
      totalPlaced: uniqueStudentsPlaced,
      totalOffers,
      companiesVisited,
      placementRate: parseInt(placementRate),
      highestPackage,
      averagePackage,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
