// POST /api/bookmarks
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/getSessionUser";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getSessionUser();

  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [jobBookmarks, eventBookmarks, resourceBookmarks] = await Promise.all([
      prisma.jobBookmark.findMany({
        where: { userId: user.id },
        include: { job: true },
      }),
      prisma.eventBookmark.findMany({
        where: { userId: user.id },
        include: { event: true },
      }),
      prisma.resourceBookmark.findMany({
        where: { userId: user.id },
        include: { resource: true },
      }),
    ]);
    // console.log("returning bookmarks")
    return NextResponse.json({
      jobs: jobBookmarks,
      events: eventBookmarks,
      resources: resourceBookmarks,
    });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await getSessionUser();

  if (!user?.id) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const { targetId, type } = body;

  if (!targetId || !["job", "event", "resource"].includes(type)) {
    return NextResponse.json({ error: "Invalid bookmark target." }, { status: 400 });
  }

  try {
    if (type === "job") {
      const existing = await prisma.jobBookmark.findFirst({
        where: { userId: user.id, jobId: targetId },
      });
      if (existing) return NextResponse.json({ error: "Already bookmarked" }, { status: 409 });

      const bookmark = await prisma.jobBookmark.create({
        data: {
          userId: user.id,
          jobId: targetId,
        },
      });
      return NextResponse.json(bookmark);
    }

    if (type === "event") {
      const existing = await prisma.eventBookmark.findFirst({
        where: { userId: user.id, eventId: targetId },
      });
      if (existing) return NextResponse.json({ error: "Already bookmarked" }, { status: 409 });

      const bookmark = await prisma.eventBookmark.create({
        data: {
          userId: user.id,
          eventId: targetId,
        },
      });
      return NextResponse.json(bookmark);
    }

    if (type === "resource") {
      const existing = await prisma.resourceBookmark.findFirst({
        where: { userId: user.id, resourceId: targetId },
      });
      if (existing) return NextResponse.json({ error: "Already bookmarked" }, { status: 409 });

      const bookmark = await prisma.resourceBookmark.create({
        data: {
          userId: user.id,
          resourceId: targetId,
        },
      });
      return NextResponse.json(bookmark);
    }

    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  } catch (err) {
    console.error("Bookmark creation failed:", err);
    return NextResponse.json({ error: "Failed to create bookmark" }, { status: 500 });
  }
}
