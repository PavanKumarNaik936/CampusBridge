import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { notifyUser } from "@/lib/notify";
import { z } from "zod";

// Step 1: Define the schema for validation

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

const EventSchema = z.object({
  title: z.string(),
  description: z.string(),
  imageUrl: z.string().optional(),
  type: z.enum(["workshop", "webinar", "seminar", "hackathon","culturals"]),
  startDate: z.string().transform((val) => new Date(val)),
  endDate: z.string().transform((val) => new Date(val)),
  venue: z.string(),
  status: z.enum(["upcoming", "completed", "cancelled"]),
  isOnline: z.boolean(),
  meetLink: z.string().optional(),
  registrationLink: z.string().optional(),
  maxAttendees: z.number().nullable().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();
    const body = EventSchema.parse(json);

    const newEvent = await prisma.event.create({
      data: {
        ...body,
        createdById: userId,
        attendees: [],
        attended: [],
      },
    });

     // ✅ Notify all students
    //  console.info("notifying all users about new Event");
     const students = await prisma.user.findMany({
       where: { role: "student" },
       select: { id: true },
     });

     await Promise.all(
       students.map((student) =>
         notifyUser(
           student.id,
           `📢 New Event scheduled: ${newEvent.title}`,
           `${process.env.NEXT_PUBLIC_BASE_URL}/jobs`
         )
       )
     );
    return NextResponse.json(newEvent, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }

    console.error("❌ Event Creation Error:", err);
    return NextResponse.json({ error: "Error creating event" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const location = searchParams.get("location");
  const status = searchParams.get("status");

  const filters: any = {};
  if (location) filters.venue = location;
  if (status) filters.status = status;

  try {
    const events = await prisma.event.findMany({
      where: filters,
      orderBy: { startDate: "asc" },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true, // Optional: Add other fields if needed
          },
        },
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("❌ Failed to fetch events:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}