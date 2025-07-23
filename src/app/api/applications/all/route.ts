// app/api/applications/all/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const apps = await prisma.application.findMany({
    include: {
      user: { select: { name: true, email: true } },
      job: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(apps);
}
