import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ Convert Excel serial number to JS Date
function excelDateToJSDate(serial: number): Date {
  const excelEpoch = new Date(Date.UTC(1899, 11, 30));
  return new Date(excelEpoch.getTime() + serial * 86400 * 1000);
}

// ✅ Check if Date is valid
function isValidDate(d: Date): boolean {
  return d instanceof Date && !isNaN(d.getTime()) && d.getFullYear() >= 2000 && d.getFullYear() <= 2100;
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

      const {
        userEmail,
        userName,
        branch,
        contactNumber,
        companyName,
        jobTitle,
        package: pkg,
        date,
        graduationYear,
      } = entry;

      // ✅ Required fields
      if (!companyName || !pkg || !date || graduationYear === undefined) {
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

      // ✅ Parse date
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
      let company = await prisma.company.findFirst({ where: { name: companyName.trim() } });
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
        job = await prisma.job.findFirst({ where: { title: jobTitle.trim(), companyId: company.id } });
      }

      // ✅ Duplicate check
      const duplicate = await prisma.placement.findFirst({
        where: {
          userEmail: userEmail?.trim(),
          companyId: company.id,
          jobId: job?.id ?? undefined,
        },
      });

      if (duplicate) {
        summary.skippedCount++;
        summary.errors.push({ row: rowNum, reason: "Duplicate placement record", data: entry });
        continue;
      }

      // ✅ Get user if exists (2025+)
      const user = userEmail
        ? await prisma.user.findUnique({ where: { email: userEmail.trim() } })
        : null;

      // ✅ Create placement
      await prisma.placement.create({
        data: {
          userId: user?.id ?? null,
          userEmail: userEmail?.trim() ?? null,
          userName: user?.name ?? userName ?? null,
          branch: user?.branch ?? branch ?? null,
          contactNumber: user?.phone ?? contactNumber ?? null,
          companyId: company.id,
          jobId: job?.id ?? null,
          package: parsedPackage,
          date: parsedDate,
          graduationYear,
        },
      });

      summary.successCount++;
    }

    return NextResponse.json({ success: true, ...summary });
  } catch (error: unknown) {
    console.error("Upload failed:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, message: "Upload failed", error: errorMessage }, { status: 500 });
  }
}
