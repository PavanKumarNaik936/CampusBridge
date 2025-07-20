import { z } from "zod";

export const CreateApplicationSchema = z.object({
    jobId: z.string().min(1, "Job ID is required"),
    resumeSnapshotUrl: z.string().url("Invalid resume URL"), // now required
    coverLetter: z.string().max(2000, "Cover letter is too long").optional(),
  });