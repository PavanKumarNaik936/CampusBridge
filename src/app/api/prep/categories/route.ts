// /app/api/prep/categories/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
    const body = await req.json();
    const { name, createdBy } = body;
  
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { message: "Category name is required" },
        { status: 400 }
      );
    }
  
    const normalizedName = name.trim().toLowerCase();
  
    try {
      // Check for existing category (case-insensitive)
      const existing = await prisma.category.findFirst({
        where: {
          name: {
            equals: normalizedName,
            mode: "insensitive", // 👈 Case-insensitive search
          },
        },
      });
  
      if (existing) {
        return NextResponse.json(
          { message: "Category already exists." },
          { status: 409 }
        );
      }
  
      // Optionally: store with first letter capitalized
      const formattedName =
        normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1);
  
      const category = await prisma.category.create({
        data: { name: formattedName, createdBy },
      });
  
      return NextResponse.json(category, { status: 201 });
    } catch (error) {
      console.error("Category creation error:", error);
      return NextResponse.json(
        { message: "Error creating category", error },
        { status: 500 }
      );
    }
  }
