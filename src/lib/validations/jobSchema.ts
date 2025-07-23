import { z } from "zod";

export const jobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  location: z.string(),
  type: z.enum(["Internship", "Full-Time"], { message: "Type must be Internship or Full-Time" }),
  mode: z.enum(["Remote", "On-Site", "Hybrid"], { message: "Mode must be Remote, On-Site or Hybrid" }),
  salary: z.string().optional().transform((val) => val?.trim() === "" ? undefined : val),
  deadline: z.coerce.date().optional().refine(
    (date) => !date || date > new Date(),
    { message: "Deadline must be a future date" }
  ),
  companyId: z.string().min(1), // ✅ REQUIRED
});
