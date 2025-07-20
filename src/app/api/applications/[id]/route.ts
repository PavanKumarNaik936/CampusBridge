import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/getSessionUser"; // adjust the path accordingly
import { ApplicationStatus } from "@/generated/prisma";

// GET: Application by ID
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const application = await prisma.application.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        job: true,
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json(application);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch application" }, { status: 500 });
  }
}



export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser();

    if (!user || (user.role !== "admin" && user.role !== "recruiter")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { status, feedback } = body;

    if (!Object.values(ApplicationStatus).includes(status)) {
        return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
      }

    const updated = await prisma.application.update({
      where: { id: params.id },
      data: {
        status,
        feedback,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}




export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const app = await prisma.application.findUnique({
      where: { id: params.id },
    });

    if (!app) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.application.delete({ where: { id: params.id } });

    return NextResponse.json({ message: "Application deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 });
  }
}
