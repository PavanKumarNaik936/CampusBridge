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
      // Handle string input safely
      if (typeof json.year === "string") {
        json.year = json.year.trim() === "" ? undefined : parseInt(json.year);
      }
      if (typeof json.cgpa === "string") {
        json.cgpa = json.cgpa.trim() === "" ? undefined : parseFloat(json.cgpa);
      }
     
  

      const parsed = userSchema.partial().strip().safeParse(json);

  
      if (!parsed.success) {
        console.error("Validation Errors:", parsed.error.format());
      
        // Create a list of errors with field names and messages
        const errorDetails = parsed.error.issues.map(issue => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
      
        return NextResponse.json({ error: "Invalid input", details: errorDetails }, { status: 400 });
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
