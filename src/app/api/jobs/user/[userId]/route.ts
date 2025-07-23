import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        postedById: params.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        applications: true, // optional: include application count/details
        company:true,
      },
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({ error: "Failed to fetch jobs." }, { status: 500 });
  }
}
