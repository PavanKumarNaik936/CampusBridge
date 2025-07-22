import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date();
  const past = await prisma.event.findMany({
    where: { endDate: { lt: now } },
    orderBy: { endDate: "desc" },
  });
  return NextResponse.json(past);
}
