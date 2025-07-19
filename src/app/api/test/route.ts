// app/api/test/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await prisma.$connect(); // Check connection only
    return NextResponse.json({ message: "MongoDB connected successfully!" });
  } catch (error) {
    console.error("Connection error:", error);
    return NextResponse.json({ error: "Failed to connect to MongoDB" });
  }
}
