import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options"; 
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find all jobs posted by the current user
    const jobs = await prisma.job.findMany({
      where: { postedById: userId },
      select: { id: true },
    });

    const jobIds = jobs.map((job) => job.id);

    // Get all applications for those jobs
    const applications = await prisma.application.findMany({
      where: { jobId: { in: jobIds } },
      include: {
        user: true,
        job: true,
      },
      orderBy: {
        createdAt: "desc", // newest first
      },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json({ message: "Error fetching applications" }, { status: 500 });
  }
}
