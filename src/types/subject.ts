import z from "zod";

export const SubjectZodSchema = z.object({
  subjectName: z
    .string()
    .min(1, "Subject name is required")
    .max(100, "Subject name is too long"),
  description: z.string().max(500, "Description is too long").optional(),
});

export type SubjectType = z.infer<typeof SubjectZodSchema>;
