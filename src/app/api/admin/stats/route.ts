// /app/api/admin/stats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adjust path as needed

export async function GET() {
  const [students, jobs, events, resources] = await Promise.all([
    prisma.user.count({ where: { role: "student" } }),
    prisma.job.count(),
    prisma.event.count(),
    prisma.resource.count(),
  ]);

  return NextResponse.json({
    totalStudents: students,
    jobsPosted: jobs,
    eventsCreated: events,
    resourcesShared: resources,
  });
}
