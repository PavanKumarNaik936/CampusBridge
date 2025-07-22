// app/api/events/registered-events/route.ts

import { prisma } from "@/lib/prisma"; // adjust path to your prisma instance
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required." }, { status: 400 });
  }

  try {
    const events = await prisma.event.findMany({
      where: {
        attendees: {
          has: userId, // filters events where attendees[] contains userId
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        venue: true,
        startDate: true,
        status: true,
        createdBy: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("[REGISTERED_EVENTS_ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch registered events" }, { status: 500 });
  }
}
