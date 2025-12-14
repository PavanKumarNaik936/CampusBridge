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
        
            company: {
              select: {
                name: true,
                logo: true, // 👈 assuming "logo" exists on your Company model
              },
            },
        
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
  // Define course duration mapping
const courseDurationByBranch: Record<string, number> = {
  CSE: 6,
  ECE: 6,
  MECH: 6,
  MME:6,
  CIVIL:6,
  EEE:6,
  CHEM:6,
  "AI/ML":6,
  // Add other branches if needed
};
    try {
      const body = await req.json();
      // console.log(body);
  
      // ✅ Validate the body using Zod
      const parsedData = userSchema.parse(body);
    //   console.log(parsedData);
  
       // ✅ Hash the password before saving
    if (parsedData.password) {
        parsedData.password = await bcrypt.hash(parsedData.password, 10);
      }

      // ✅ Proceed to create user if validation passes
      // const { companyId, ...rest } = parsedData;

      // const newUser = await prisma.user.create({
      //   data: {
      //     ...rest,
      //     ...(companyId && { company: { connect: { id: companyId } } }),
      //   },
      // });
            const { companyId, ...rest } = parsedData;

      // Auto-fill graduation year if role is student
      if (rest.role === "student" && rest.branch && rest.admissionYear) {
        const duration = courseDurationByBranch[rest.branch] || 6; // default 4 years
        rest.graduationYear = rest.admissionYear + duration;
      }

      const newUser = await prisma.user.create({
        data: {
          ...rest,
          ...(companyId && { company: { connect: { id: companyId } } }),
        },
      });

  
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
