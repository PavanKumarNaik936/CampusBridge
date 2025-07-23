// /app/api/admin/activities/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [recentUsers, recentJobs, recentApps, recentResources] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        where: { role: "student" }, // Only students
        select: { name: true, createdAt: true },
      }),
      prisma.job.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { title: true, createdAt: true },
      }),
      prisma.application.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          createdAt: true,
          user: { select: { name: true } },
          job: { select: { title: true } },
        },
      }),
      prisma.resource.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { title: true, createdAt: true },
      }),
    ]);

    const formatTime = (date: Date) => `${Math.floor((Date.now() - date.getTime()) / 60000)} mins ago`;

    const activities = [
      ...recentUsers.map((u) => ({
        text: `🆕 ${u.name} signed up`,
        time: formatTime(u.createdAt),
      })),
      ...recentJobs.map((j) => ({
        text: `📤 New job posted: ${j.title}`,
        time: formatTime(j.createdAt),
      })),
      ...recentApps.map((a) => ({
        text: `📥 ${a.user.name} applied for ${a.job.title}`,
        time: formatTime(a.createdAt),
      })),
      ...recentResources.map((r) => ({
        text: `📚 New resource: ${r.title}`,
        time: formatTime(r.createdAt),
      })),
    ];

    // Sort by time descending
    activities.sort((a, b) => {
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    });

    return NextResponse.json({ activities: activities.slice(0, 8) }); // Limit to 8
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return new NextResponse("Server Error", { status: 500 });
  }
}
