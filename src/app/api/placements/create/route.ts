// /app/api/placements/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId, jobId, companyId, package: pkg } = await req.json();

    if (!userId || !companyId || !pkg) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Check if already placed for this job
    const existing = await prisma.placement.findFirst({
      where: { userId, jobId },
    });

    if (existing) {
      return NextResponse.json({ error: "User already placed for this job" }, { status: 400 });
    }

    // ✅ Fetch user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        phone: true,
        branch: true,
        graduationYear: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Create placement record (auto-filling user details)
    const placement = await prisma.placement.create({
      data: {
        userId,
        companyId,
        jobId,
        package: pkg,
        date: new Date(),
        userName: user.name || "Unknown",
        userEmail: user.email || null,
        contactNumber: user.phone || null,
        branch: user.branch || null,
        graduationYear: user.graduationYear || null,
        createdAt: new Date(),
      },
      include: {
        company: true,
        job: true,
        user: true,
      },
    });

    return NextResponse.json({ message: "Placement created successfully", placement });
  } catch (error) {
    console.error("Error creating placement:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
