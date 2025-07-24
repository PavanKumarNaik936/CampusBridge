import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const placements = await prisma.placement.findMany({
      include: {
        job: true,
      },
    });

    let fullTime = 0;
    let internshipOnly = 0;
    let unknown = 0;

    for (const placement of placements) {
      const type = placement.job?.type?.toLowerCase();
      if (type === "full-time") fullTime++;
      else if (type === "internship") internshipOnly++;
      else unknown++;
    }

    const response = [
      { name: "Full-Time", value: fullTime },
      { name: "Internship Only", value: internshipOnly },
    ];

    if (unknown > 0) {
      response.push({ name: "Unknown", value: unknown });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch offer types" }, { status: 500 });
  }
}
