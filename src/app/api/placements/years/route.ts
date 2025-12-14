// /app/api/placements/years/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch distinct graduation years from Placement
    const years = await prisma.placement.findMany({
      where: {
        graduationYear: {
          not: null,
        },
      },
      distinct: ["graduationYear"],
      select: {
        graduationYear: true,
      },
      orderBy: {
        graduationYear: "asc",
      },
    });

    const graduationYears = years.map((item) => item.graduationYear);

    return NextResponse.json(graduationYears);
  } catch (err) {
    console.error("Error fetching graduation years:", err);
    return NextResponse.json(
      { error: "Failed to fetch graduation years" },
      { status: 500 }
    );
  }
}
