// /api/notifications/mark-read/route.ts
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  const { notificationIds } = await req.json();

  await prisma.notification.updateMany({
    where: { id: { in: notificationIds }, userId: session.user.id },
    data: { read: true },
  });

  return NextResponse.json({ success: true });
}
