// app/api/applications/update-status/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth"; // if using NextAuth
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { notifyUser } from "@/lib/notify";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { status } = await req.json();

    // ✅ Fetch the application with job + recruiter
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: { include: { company: true } },
        user: true,
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // ✅ Check ownership — only job poster can update
    if (application.job.postedById !== session.user.id) {
      return NextResponse.json({ error: "Not authorized to update this application" }, { status: 403 });
    }

    // ✅ Update status
    const updated = await prisma.application.update({
      where: { id },
      data: { status },
      include: {
        user: true,
        job: { include: { company: true } },
      },
    });

    // ✅ Notify user
    let message =
      status === "accepted"
        ? `🎉 Congratulations! You've been placed for "${updated.job.title}" at ${updated.job.company.name}.`
        : `📄 Your application for "${updated.job.title}" has been updated to "${status}".`;

    await notifyUser(
      updated.user.id,
      message,
      `${process.env.NEXT_PUBLIC_BASE_URL}/applications`
    );

    return NextResponse.json({ success: true, updated });
  } catch (err) {
    console.error("Error updating status:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
