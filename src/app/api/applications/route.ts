import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { CreateApplicationSchema } from "@/lib/validations/applicationSchema";
import { getSessionUser } from "@/lib/getSessionUser";
// POST: Apply to a job
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = CreateApplicationSchema.safeParse(body);
    if (!parsed.success) {
        const formattedErrors = parsed.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        }));
      
        return NextResponse.json({ error: formattedErrors }, { status: 400 });
      }

    const user = await getSessionUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
          

    const {jobId, resumeSnapshotUrl, coverLetter } = parsed.data;

    // Check for duplicate application
    const alreadyApplied = await prisma.application.findFirst({
      where: {
        userId:user?.id,
        jobId,
      },
    });

    if (alreadyApplied) {
      return NextResponse.json({ error: "Already applied to this job" }, { status: 400 });
    }

    const newApplication = await prisma.application.create({
      data: {
        userId:user?.id!,
        jobId,
        resumeSnapshotUrl,
        coverLetter,
      },
    });

    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to apply" }, { status: 500 });
  }
}

// GET: Get all applications of the current user
export async function GET(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    
    const applications = await prisma.application.findMany({
      where: { userId:user.id },
      include: {
        job: true,
      },
    });

    return NextResponse.json(applications);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}
