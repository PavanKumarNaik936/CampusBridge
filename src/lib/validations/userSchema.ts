import { z } from "zod";

// Common schema
export const baseUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["student", "admin", "recruiter"]),

  // Shared optional fields
  phone: z.string().optional(),
  profileImage: z.url().optional(),
  linkedIn: z.url().optional(),

  // Student-specific
  branch: z.string().optional(),
  year: z.number().min(1).max(6).optional(),
  rollNumber: z.string().optional(),
  cgpa: z.number().min(0).max(10).optional(),
  resumeUrl: z.url().optional(),
  portfolioUrl: z.url().optional(),
  achievements: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  admissionYear: z.number().min(2000).max(new Date().getFullYear() + 1).optional(),
  graduationYear: z.number().optional(), // will be calculated
  
  // Recruiter-specific
  companyId: z.string().optional(), // ✅ Add this field
});

// Refined schema with role-based conditional validation
export const userSchema = baseUserSchema.refine((data) => {
  if (data.role === "student") {
    return (
      typeof data.branch === "string" &&
      data.branch.trim() !== "" &&
      typeof data.rollNumber === "string" &&
      data.rollNumber.trim() !== "" &&
      typeof data.year === "number"
    );
  }

  if (data.role === "recruiter") {
    return (
      typeof data.companyId === "string" && data.companyId.trim() !== ""
    );
  }
  
  return true; // admin
}, {
  message: "Missing required fields for selected role",
  path: ["role"],
});
