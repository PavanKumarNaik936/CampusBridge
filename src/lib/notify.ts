// lib/notify.ts

import axios from "axios";

export async function notifyUser(userId: string, message: string, link?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  await axios.post(`${baseUrl}/api/notifications/send`, {
    userId,
    message,
    link,
  });
}
