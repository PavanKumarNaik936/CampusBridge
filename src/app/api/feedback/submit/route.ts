// app/api/feedback/submit/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust path if needed
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options"; 

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  const body = await req.json();
  const { message, category, rating } = body;

  if (!message || !category) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
//   console.log("Session User ID:", session?.user?.id);


  const feedback = await prisma.feedback.create({
    data: {
      message,
      category,
      rating,
      userId: session?.user?.id || null,
    },
  });

  return NextResponse.json({ success: true, feedback });
}
