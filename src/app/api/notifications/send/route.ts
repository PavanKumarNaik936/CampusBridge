import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendEmailNotification } from "@/lib/mailer"; // you’ll define this

export async function POST(req: Request) {
  try {
    const { userId, message, link } = await req.json();

    if (!userId || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Save the notification in DB
    const notification = await prisma.notification.create({
      data: {
        userId,
        message,
        link,
      },
    });
    // console.log(notification);
    // Fetch the user to check their online status
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user && !user.isOnline && user.email) {
      await sendEmailNotification(user.email, message, link);
    }

    return NextResponse.json({ success: true, notification });
  } catch (error) {
    console.error("[NOTIFICATION_SEND]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
