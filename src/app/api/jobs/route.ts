import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jobSchema } from "@/lib/validations/jobSchema";
import { getSessionUser } from "@/lib/getSessionUser";
// GET: Fetch all jobs
export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        postedBy: {
          select: {
            id: true,
            name: true,
            role: true,
            company: true,
            profileImage: true,
          }
        },
        _count: {
          select: { applications: true }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

// POST: Create a new job
export async function POST(req: Request) {
    try {
      const sessionUser = await getSessionUser();
  
      if (!sessionUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      if (sessionUser.role !== "recruiter" && sessionUser.role !== "admin") {
        return NextResponse.json({ error: "Only recruiters or admins can post jobs" }, { status: 403 });
      }
  
      const body = await req.json();
      const parsed = jobSchema.safeParse(body);
  
      if (!parsed.success) {
        const formattedErrors = parsed.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        }));
      
        return NextResponse.json({ error: formattedErrors }, { status: 400 });
      }
  
      const newJob = await prisma.job.create({
        data: {
          ...parsed.data,
          postedById: sessionUser.id,
        },
      });
  
      return NextResponse.json(newJob, { status: 201 });
  
    } catch (error) {
      console.error("Job creation failed:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }
