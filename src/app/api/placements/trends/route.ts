// /app/api/placements/trends/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const placements = await prisma.placement.findMany({
      include: {
        user: {
          select: {
            graduationYear: true,
          },
        },
      },
    });

    const trendsMap = new Map<number, number>();

    placements.forEach((placement) => {
      const year = placement.user?.graduationYear;
      if (year && year > 0) {
        trendsMap.set(year, (trendsMap.get(year) || 0) + 1);
      }
    });

    const result = Array.from(trendsMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([year, placed]) => ({ year: year.toString(), placed }));

    return NextResponse.json(result);
  } catch (err) {
    console.error("Failed to fetch placement trends:", err);
    return NextResponse.json({ error: "Error fetching trends" }, { status: 500 });
  }
}
