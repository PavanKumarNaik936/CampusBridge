import { z } from "zod";

export const jobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string(),
  type: z.string(),  // You can later restrict to enum like "Internship", "Full-Time"
  mode: z.string(),  // "Remote", "On-site", "Hybrid"
  salary: z.string().optional(),
  deadline: z.coerce.date().optional(), // Handles string to date conversion
});
