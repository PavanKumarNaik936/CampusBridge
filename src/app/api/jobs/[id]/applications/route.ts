import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const jobId = params.id;

    const applications = await prisma.application.findMany({
      where: { jobId },
      include: {
        user: true,
        job: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ applications });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to fetch applications" }, { status: 500 });
  }
}
