// utils/signOutUser.ts
import { signOut } from "next-auth/react";

export async function customSignOut() {
  try {
    await fetch("/api/users/set-offline", { method: "POST" });
  } catch (err) {
    console.error("Failed to update user status before sign-out", err);
  }
  signOut({ callbackUrl: '/' });
}
