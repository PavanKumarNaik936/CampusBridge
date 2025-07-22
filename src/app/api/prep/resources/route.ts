// src/app/api/prep/resources/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ResourceType } from "@/generated/prisma";
import { getSessionUser } from "@/lib/getSessionUser";
// import { ResourceBookmark } from "@/generated/prisma";
// src/app/api/prep/resources/route.ts

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const categoryId = searchParams.get("categoryId");
    const user = await getSessionUser(); // helper to get logged-in user
  if (!user) return NextResponse.json([], { status: 200 });

    const where: any = {
      AND: [
        {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        },
      ],
    };

    if (categoryId) {
      where.AND.push({ categoryId });
    }

    const validTypes: ResourceType[] = ["PDF", "LINK", "MCQ"];
    if (validTypes.includes(search.toUpperCase() as ResourceType)) {
      where.AND.push({ type: search.toUpperCase() });
    }

    const resources = await prisma.resource.findMany({
      where, // ✅ USE IT!
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get all resource IDs the user has bookmarked
  const userBookmarks = await prisma.resourceBookmark.findMany({
    where: {
      userId: user.id,
    //   type: "resource",
    },
    select: {
      userId: true,
    },
  });

  const bookmarkedIds = new Set(userBookmarks.map((b:any) => b.targetId));



    const resourcesWithBookmarks = resources.map((res) => ({
      ...res,
      bookmarked: bookmarkedIds.has(res.id),
    }));
//   console.log(resourcesWithBookmarks)
    return NextResponse.json(resourcesWithBookmarks);
  } catch (error) {
    console.error("❌ Error fetching resources:", error);
    return NextResponse.json(
      { message: "Failed to fetch resources", error },
      { status: 500 }
    );
  }
}


// ✅ POST new resource
export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      let { title, description, type, url, fileUrl, createdById, categoryId, isPublic } = body;
    //   console.log(body);
        
      // Basic validation
      if (!title || !type || !createdById || !categoryId) {
        console.warn("Missing Fields:", { title, type, createdById, categoryId });
        return NextResponse.json(
          { message: "Missing required fields" },
          { status: 400 }
        );
      }
  
      // ✅ Clean values
      title = title.trim();
      description = description?.trim() || null;
      type = type.toUpperCase();
  
      // Validate type-specific fields
      const validTypes = ["PDF", "MCQ", "LINK"];
      if (!validTypes.includes(type)) {
        return NextResponse.json({ message: "Invalid resource type" }, { status: 400 });
      }
  
      if (type === "PDF" && !fileUrl) {
        return NextResponse.json({ message: "File is required for PDF" }, { status: 400 });
      }
  
      if ((type === "LINK" || type === "MCQ") && !url) {
        return NextResponse.json({ message: "URL is required for this type" }, { status: 400 });
      }
  
      const newResource = await prisma.resource.create({
        data: {
          title,
          description,
          type,
          url,
          fileUrl,
          createdById,
          categoryId,
          isPublic: isPublic ?? true,
        },
      });
  
      return NextResponse.json(newResource, { status: 201 });
    } catch (error) {
      return NextResponse.json(
        { message: "Failed to create resource", error },
        { status: 500 }
      );
    }
  }
  