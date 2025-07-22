// /app/api/events/registered/route.ts (or /pages/api/events/registered.ts)
import { prisma } from "@/lib/prisma"; // adjust import based on your setup
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) return NextResponse.json({ error: "User ID is required" }, { status: 400 });

  const events = await prisma.event.findMany({
    where: {
      attendees: {
        has: userId, // ✅ assuming attendees is string[]
      },
    },
    include: {
      createdBy: true,
    },
  });

  return NextResponse.json(events);
}
