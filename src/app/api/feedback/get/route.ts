// app/api/feedback/get/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options"; // adjust if needed
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 });
  }
//   console.log(session.user.id);

  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error("[FEEDBACK_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
