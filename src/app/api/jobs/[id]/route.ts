import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jobSchema } from "@/lib/validations/jobSchema";
import { getSessionUser } from "@/lib/getSessionUser";
// Get job by ID
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: {
        postedBy: {
          select: {
            id: true,
            name: true,
            role: true,
            company: true,
          },
        },
        applications: true,
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

// Update job
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
      const body = await req.json();
  
      // 1. Validate input (partial to allow partial updates)
      const parsed = jobSchema.partial().safeParse(body);
      if (!parsed.success) {
        const formattedErrors = parsed.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        }));
      
        return NextResponse.json({ error: formattedErrors }, { status: 400 });
      }
  
      // 2. Check if job exists
      const existingJob = await prisma.job.findUnique({ where: { id: params.id } });
      if (!existingJob) {
        return NextResponse.json({ error: "Job not found" }, { status: 404 });
      }
  
      // 3. Get current user from session
      const currentUserId = await getSessionUser(); // Should return string | null
      if (!currentUserId) {
        return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
      }
  
      // 4. Fetch user
      const user = await prisma.user.findUnique({ where: { id: currentUserId.id } });
      if (!user || (user.id !== existingJob.postedById && user.role !== "admin")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
  
      // 5. Update job
      const updatedJob = await prisma.job.update({
        where: { id: params.id },
        data: parsed.data,
      });
  
      return NextResponse.json(updatedJob, { status: 200 });
  
    } catch (error) {
      console.error("Error updating job:", error);
      return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
    }
  }
  
// Delete job
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const existingJob = await prisma.job.findUnique({ where: { id: params.id } });

    if (!existingJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const currentUserId = await getSessionUser(); // Should return { id: string }
    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: currentUserId.id } });

    if (!user || (user.id !== existingJob.postedById && user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.application.deleteMany({
      where: {
        jobId: params.id,
      },
    });
    
    await prisma.job.delete({
      where: { id: params.id },
    });
    
    // await prisma.job.delete({ where: { id: params.id } });

    return NextResponse.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting job:", error);
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
