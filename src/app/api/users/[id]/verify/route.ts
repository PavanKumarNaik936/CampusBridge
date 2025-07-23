// /app/api/users/[id]/verify/route.ts (PATCH)
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  await prisma.user.update({
    where: { id },
    data: { isVerified: true },
  });
  return NextResponse.json({ message: "User verified" });
}
