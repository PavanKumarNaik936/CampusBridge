import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
        placements: {
          select: {
            package: true,
          },
        },
      },
    });

    const companyStats = companies
      .filter((c) => c.placements.length > 0)
      .map((company) => {
        const packages = company.placements.map((p) => p.package);
        const highest = Math.max(...packages);
        const average = (
          packages.reduce((sum, pkg) => sum + pkg, 0) / packages.length
        ).toFixed(2);

        return {
          name: company.name,
          offers: company.placements.length,
          highest: `₹${highest} LPA`,
          average: `₹${average} LPA`,
        };
      });

    return NextResponse.json(companyStats);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch company-wise stats" }, { status: 500 });
  }
}
