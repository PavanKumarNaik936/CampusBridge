import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { Role } from '@/generated/prisma'; // ✅ Optional, for typesafety

export async function GET(_: Request, { params }: { params: { role: string } }) {
  const validRoles: Role[] = ['student', 'admin', 'recruiter'];

  // Validate role
  if (!validRoles.includes(params.role as Role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  try {
    const users = await prisma.user.findMany({
      where: { role: params.role as Role },
    });

    // Optionally exclude passwords or sensitive fields
    const safeUsers = users.map(({ password, ...user }) => user);

    return NextResponse.json(safeUsers);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch users by role' }, { status: 500 });
  }
}
