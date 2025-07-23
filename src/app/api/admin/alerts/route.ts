// /app/api/admin/alerts/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// import { subDays } from "date-fns";

export async function GET() {
  const today = new Date();
  const threeDaysLater = new Date();
  threeDaysLater.setDate(today.getDate() + 3);

//   const incompleteProfiles = await prisma.user.findMany({
    // where: {
    //   role: "student",
    //   OR: [
        // { linkedIn: { equals: null } },
    //     { linkedIn: { equals: "" } },
    //     { phone: { equals: null } },
    //     { phone: { equals: "" } },
    //     { cgpa: null },
    //   ],
    // },
//   });
  
//   const noResumeUsers = await prisma.user.findMany({
//     where: {
//         role: "student",
//         OR: [
//           { phone: { equals: null } },
//           { phone: "" },
//         ],
//       },
//   });
//   const users = await prisma.user.findMany({
//     select: { id: true, name: true, role: true, phone: true },
//   });
//   console.log("All users:", users);
  
  
//   console.log("incomplete profile: ",incompleteProfiles);
//   console.log("no resumes :",noResumeUsers);
  // 3. Jobs expiring in 3 days
  const expiringJobs = await prisma.job.findMany({
    where: {
      deadline: {
        gte: today,
        lte: threeDaysLater,
      },
    },
    select: {
      id: true,
      title: true,
      deadline: true,
    },
  });

  // 4. Events expiring in 3 days
  const expiringEvents = await prisma.event.findMany({
    where: {
        startDate: {
          gte: today,
          lte: threeDaysLater,
        }
      },
      
    select: {
      id: true,
      title: true,
      startDate: true,
    },
  });

  // 5. Unread Feedback
//   const unreadFeedbackCount = await prisma.feedback.count({
//     where: {
//       read: false,
//     },
//   });

  return NextResponse.json({
    alerts: [
    //   {
    //     type: "warning",
    //     message: `⚠️ ${noResumeUsers} users haven't uploaded resumes.`,
    //   },
    //   {
    //     type: "danger",
    //     message: `🚫 ${incompleteProfiles} users have incomplete profiles.`,
    //   },
      {
        type: "info",
        message: `📅 ${expiringJobs.length} job(s) expiring within 3 days.`,
      },
      {
        type: "info",
        message: `📅 ${expiringEvents.length} event(s) expiring within 3 days.`,
      },
    //   {
    //     type: "notice",
    //     message: `🧾 ${unreadFeedbackCount} unread feedback(s).`,
    //   },
    ],
  });
}
