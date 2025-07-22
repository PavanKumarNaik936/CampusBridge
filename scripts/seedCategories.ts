
import { prisma } from "@/lib/prisma";


const defaultCategories = [
  "Aptitude",
  "Technical",
  "HR/Resume",
  "Mock Tests",
  "Interview Questions",
  "Company-wise Preparation",
];

async function seed() {
  for (const name of defaultCategories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("✅ Categories seeded.");
}

seed()
  .catch((e) => {
    console.error("❌ Error while seeding categories:", e);
  })
  .finally(() => process.exit());
