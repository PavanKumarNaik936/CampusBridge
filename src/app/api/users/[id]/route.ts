import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { userSchema } from '@/lib/validations/userSchema';
import bcrypt from 'bcryptjs';


export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });
    // console.log(user);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
     // Avoid returning password
    const { password, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
    
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
      const json = await req.json();
      const parsed = userSchema.partial().safeParse(json);
  
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
      }

      if (parsed.data.password) {
        parsed.data.password = await bcrypt.hash(parsed.data.password, 10);
      }
  
      const updated = await prisma.user.update({
        where: { id: params.id },
        data: parsed.data,
      });
  
      const { password, ...userWithoutPassword } = updated;
      return NextResponse.json(userWithoutPassword);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Failed to update user' }, { status: 400 });
    }
  }
