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
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: user.id,
      },
      include: {
        job: true,
        // event: true,
        // material: true,
      },
    });

    return NextResponse.json(bookmarks);
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

  if (!targetId || !["job", "event", "material"].includes(type)) {
    return NextResponse.json({ error: "Invalid bookmark target." }, { status: 400 });
  }

  try {
    const where: any = { userId: user.id };
    if (type === "job") where.jobId = targetId;
    else if (type === "event") where.eventId = targetId;
    else if (type === "material") where.materialId = targetId;

    // 🔍 Check if it already exists
    const existing = await prisma.bookmark.findFirst({ where });
    if (existing) {
      return NextResponse.json({ error: "Already bookmarked" }, { status: 409 }); // 409 Conflict
    }

    const bookmark = await prisma.bookmark.create({ data: where });
    return NextResponse.json(bookmark);
  } catch (err) {
    console.error("Bookmark creation failed:", err);
    return NextResponse.json({ error: "Failed to create bookmark" }, { status: 500 });
  }
}

