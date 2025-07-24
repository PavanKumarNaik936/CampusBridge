// POST /api/placements/create
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { userId, jobId, companyId, package: pkg } = await req.json();

  if (!userId || !companyId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }


  const existing = await prisma.placement.findFirst({
    where: {
      userId,
      jobId,
    },
  });
  
  if (existing) {
    return NextResponse.json({ error: "Already placed" }, { status: 400 });
  }
  

  const placement = await prisma.placement.create({
    data: {
      userId,
      companyId,
      jobId,
      package: parseFloat(pkg || "6.0"),
    },
  });

  return NextResponse.json({ placement });
}
