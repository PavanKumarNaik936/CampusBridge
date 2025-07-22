import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/getSessionUser";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const events = await prisma.event.findMany({
      where: {
        createdById: sessionUser.id,
      },
      orderBy: {
        startDate: "desc",
      },
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("[MY_EVENTS_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to fetch your events." },
      { status: 500 }
    );
  }
}
