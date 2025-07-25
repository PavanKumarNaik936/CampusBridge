import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      isOnline: false,
      lastSeen: new Date(),
    },
  });
//   console.log(session.user);
  return NextResponse.json({ success: true });
}
