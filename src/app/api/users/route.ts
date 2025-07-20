import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { userSchema } from '@/lib/validations/userSchema';
import bcrypt from 'bcryptjs';

// GET all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
            image: true,
            role: true,
            isVerified: true,
            createdAt: true,
        
            phone: true,
            profileImage: true,
            linkedIn: true,
        
            branch: true,
            year: true,
            rollNumber: true,
            cgpa: true,
            skills: true,
            resumeUrl: true,
            portfolioUrl: true,
            achievements: true,
        
            company: true,
            companyLogo: true,
        
            // Relations
            accounts: true,
            sessions: true,
            jobs: true,
            applications: true,
          }
    });
  
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST create new user
export async function POST(req: Request) {
    try {
      const body = await req.json();
      console.log(body);
  
      // ✅ Validate the body using Zod
      const parsedData = userSchema.parse(body);
    //   console.log(parsedData);
  
       // ✅ Hash the password before saving
    if (parsedData.password) {
        parsedData.password = await bcrypt.hash(parsedData.password, 10);
      }

      // ✅ Proceed to create user if validation passes
      const newUser = await prisma.user.create({ data: parsedData });
  
      // ✅ Remove password before sending response
    const { password, ...userWithoutPassword } = newUser;

    return NextResponse.json(userWithoutPassword, { status: 201 });
    } catch (error: any) {
      if (error.name === "ZodError") {
        // console.log(error);
        // Return validation errors
        return NextResponse.json({ error: error.message}, { status: 400 });
      }
       // ✅ Prisma unique constraint error (duplicate email)
        if (
            error.code === 'P2002' &&
            error.meta?.target?.includes('email')
        ) {
            return NextResponse.json({ error: "Email already exists" }, { status: 400 });
        }
  
      // Return generic error
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
