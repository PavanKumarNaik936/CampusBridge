// app/api/applications/update-status/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { notifyUser } from "@/lib/notify";
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { status } = await req.json();

    const updated = await prisma.application.update({
      where: { id },
      data: { status },
      include: {
        user: true,
        job: {
          include: {
            company: true,
          },
        },
      },
    });
    
    let message = "";
    if (status === "accepted") {
      message = `🎉 Congratulations! You've been placed for "${updated.job.title}" at ${updated.job.company.name}. Best wishes!`;
    } else {
      message = `📄 Your application for "${updated.job.title}" has been updated to "${status}".`;
    }

    await notifyUser(
      updated.user.id,
      message,
      `${process.env.NEXT_PUBLIC_BASE_URL}/applications`
    );

    return NextResponse.json({ success: true, updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
}
