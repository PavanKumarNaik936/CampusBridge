// app/api/applications/update-status/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { status } = await req.json();

    const updated = await prisma.application.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
}
