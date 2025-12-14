// GET /api/placements?graduationYear=2024
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const graduationYear = searchParams.get("graduationYear");

    // Fetch placements
    const placements = await prisma.placement.findMany({
      where: graduationYear
        ? {
            // Option 1: If graduationYear is stored in Placement
            graduationYear: Number(graduationYear),
          }
        : {},

      // Option 2: If you want to fetch graduationYear from the user relation
      // where: graduationYear ? { user: { graduationYear: Number(graduationYear) } } : {},

      include: {
        user: true,
        company: true,
        job: true,
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ success: true, placements });
  } catch (error: unknown) {
    console.error("Failed to fetch placements:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
