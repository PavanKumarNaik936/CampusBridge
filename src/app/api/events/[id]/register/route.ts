import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/getSessionUser";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const event = await prisma.event.findUnique({ where: { id: params.id } });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  if (event.attendees.includes(user.id)) {
    return NextResponse.json({ error: "Already registered" }, { status: 400 });
  }

  const updated = await prisma.event.update({
    where: { id: params.id },
    data: {
      attendees: { push: user.id },
    },
  });

  return NextResponse.json({ message: "Registered", event: updated });
}
