// app/api/companies/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      logo,
      website,
      sector,
      location,
      hrContactEmail,
      hrPhone,
      highestPackage,
      averagePackage,
      totalOffers,
    } = body;

    // Check if company already exists
    const existing = await prisma.company.findUnique({ where: { name } });
    if (existing) {
      return NextResponse.json({ error: "Company already exists" }, { status: 409 });
    }

    const company = await prisma.company.create({
      data: {
        name,
        logo,
        website,
        sector,
        location,
        hrContactEmail,
        hrPhone,
        highestPackage,
        averagePackage,
        totalOffers,
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (err) {
    console.error("Failed to create company:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
    try {
      const companies = await prisma.company.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      });
      return NextResponse.json(companies);
    } catch (err) {
      return new NextResponse("Failed to fetch companies", { status: 500 });
    }
  }