import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ Convert Excel serial number to JS Date
function excelDateToJSDate(serial: number): Date {
  const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // Dec 30, 1899
  return new Date(excelEpoch.getTime() + serial * 86400 * 1000);
}

// ✅ Check if Date is valid
function isValidDate(d: Date): boolean {
  return (
    d instanceof Date &&
    !isNaN(d.getTime()) &&
    d.getFullYear() >= 2000 &&
    d.getFullYear() <= 2100
  );
}

// ✅ Flexible parser for Excel serials and string dates
function parseDateFlexible(input: any): Date | null {
  const asNumber = Number(input);
  if (!isNaN(asNumber) && asNumber > 10000) {
    const date = excelDateToJSDate(asNumber);
    return isValidDate(date) ? date : null;
  }

  const date = new Date(input);
  return isValidDate(date) ? date : null;
}

export async function POST(req: NextRequest) {
  const { placements } = await req.json();

  const summary = {
    successCount: 0,
    skippedCount: 0,
    errors: [] as { row: number; reason: string; data: any }[],
  };

  let rowNum = 1;

  try {
    for (const entry of placements) {
      rowNum++;

      const { userEmail, companyName, jobTitle, package: pkg, date } = entry;

      // ✅ Required field check
      if (!userEmail || !companyName || !pkg || !date) {
        summary.skippedCount++;
        summary.errors.push({
          row: rowNum,
          reason: "Missing required fields",
          data: entry,
        });
        continue;
      }

      // ✅ Validate package
      const parsedPackage = parseFloat(pkg);
      if (isNaN(parsedPackage)) {
        summary.skippedCount++;
        summary.errors.push({
          row: rowNum,
          reason: "Invalid package format",
          data: entry,
        });
        continue;
      }

      // ✅ Parse and validate date
      const parsedDate = parseDateFlexible(date);
      if (!parsedDate) {
        summary.skippedCount++;
        summary.errors.push({
          row: rowNum,
          reason: "Invalid or unsupported date format",
          data: entry,
        });
        continue;
      }

      // ✅ Get or create company
      let company = await prisma.company.findFirst({
        where: { name: companyName.trim() },
      });

      if (!company) {
        company = await prisma.company.create({
          data: {
            name: companyName.trim(),
            sector: "Unknown",
            location: "N/A",
            hrContactEmail: "notprovided@example.com",
          },
        });
      }

      // ✅ Get job if available
      let job = null;
      if (jobTitle) {
        job = await prisma.job.findFirst({
          where: {
            title: jobTitle.trim(),
            companyId: company.id,
          },
        });
      }

      // ✅ Duplicate check
      const duplicate = await prisma.placement.findFirst({
        where: {
          userEmail: userEmail.trim(),
          companyId: company.id,
          jobId: job?.id ?? undefined,
        },
      });

      if (duplicate) {
        summary.skippedCount++;
        summary.errors.push({
          row: rowNum,
          reason: "Duplicate placement record",
          data: entry,
        });
        continue;
      }

      // ✅ Save placement
      const user = await prisma.user.findUnique({
        where: { email: userEmail.trim() },
      });

      await prisma.placement.create({
        data: {
          userId: user?.id ?? null,
          userEmail: userEmail.trim(),
          companyId: company.id,
          jobId: job?.id ?? null,
          package: parsedPackage,
          date: parsedDate,
        },
      });

      summary.successCount++;
    }

    return NextResponse.json({ success: true, ...summary });
  } catch (error: unknown) {
    console.error("Upload failed:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json(
      { success: false, message: "Upload failed", error: errorMessage },
      { status: 500 }
    );
  }
}
