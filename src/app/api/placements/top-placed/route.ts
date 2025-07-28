import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const graduationYear = searchParams.get("graduationYear");

    const placements = await prisma.placement.findMany({
      where: graduationYear
        ? { user: { graduationYear: parseInt(graduationYear) } }
        : {},
      include: {
        user: true,
        company: true,
      },
      orderBy: {
        package: "desc",
      },
      take: 6, // Top 6 highest packages
    });

    // ✅ Filter out entries with null user or company
    const result = placements
      .filter((p) => p.user && p.company)
      .map((p) => ({
        name: p.user?.name ?? "Unknown",
        company: p.company?.name ?? "Unknown",
        package: `₹${p.package} LPA`,
      }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching top placed students:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
