import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Role } from "@/generated/prisma";

export async function GET(req: NextRequest) {
  try {

    const url = new URL(req.url);
    const graduationYear = url.searchParams.get("graduationYear");

    // Step 1: Get all students grouped by branch, filter by graduation year if provided
    // const studentFilter = graduationYear
    //   ? {
    //       role: "student",
    //       graduationYear: parseInt(graduationYear),
    //     }
    //   : {
    //       role: "student",
    //     };
        const studentFilter = graduationYear
        ? { role: Role.student, graduationYear: parseInt(graduationYear) }
        : { role: Role.student };
      

    const students = await prisma.user.findMany({
      where: studentFilter,
      select: { id: true, branch: true },
    });

    const branchGroups: Record<string, string[]> = {};

    students.forEach((s) => {
      const branchName = s.branch ?? "Unknown";
      if (!branchGroups[branchName]) branchGroups[branchName] = [];
      branchGroups[branchName].push(s.id);
    });

    // Step 2: Fetch placements
    const placements = await prisma.placement.findMany({
      select: { userId: true },
    });

    const placedUserIds = new Set(placements.map((p) => p.userId));

    const stats = Object.entries(branchGroups).map(([branch, studentIds]) => {
      const placedCount = studentIds.filter((id) => placedUserIds.has(id)).length;
      const totalCount = studentIds.length;
      const rate = totalCount ? Math.round((placedCount / totalCount) * 100) : 0;

      return {
        branch,
        placed: placedCount,
        total: totalCount,
        rate: `${rate}%`,
      };
    });

    return NextResponse.json(stats);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch branch-wise stats" },
      { status: 500 }
    );
  }
}
