// File: src/app/api/prep/categories/[id]/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const deleted = await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Category deleted", deleted },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete category:", error);
    return NextResponse.json(
      { message: "Error deleting category", error },
      { status: 500 }
    );
  }
}
