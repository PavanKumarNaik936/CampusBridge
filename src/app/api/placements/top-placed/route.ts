import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const graduationYear = searchParams.get("graduationYear");

    const placements = await prisma.placement.findMany({
      where: graduationYear
        ? { graduationYear: parseInt(graduationYear) }
        : {},
      include: {
        company: true,
      },
      orderBy: {
        package: "desc",
      },
      take: 6, // top 6
    });
    console.log(placements);
    const result = placements.map((p) => ({
      name: p.userName ?? "Unknown",
      branch: p.branch ?? "Unknown",
      contactNumber: p.contactNumber ?? "N/A",
      company: p.company?.name ?? "Unknown",
      package: `₹${p.package} LPA`,
      graduationYear: p.graduationYear ?? "N/A",
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching top placed students:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
