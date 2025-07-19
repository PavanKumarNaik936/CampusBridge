// lib/prisma.ts
import { PrismaClient } from "@/generated/prisma"; // instead of '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma || new PrismaClient();
  // new PrismaClient({
  //   log: ['query'],
  // });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
