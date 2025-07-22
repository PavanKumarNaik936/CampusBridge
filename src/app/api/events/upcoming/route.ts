import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date();
  const upcoming = await prisma.event.findMany({
    where: { startDate: { gt: now } },
    orderBy: { startDate: "asc" },
  });
  return NextResponse.json(upcoming);
}
