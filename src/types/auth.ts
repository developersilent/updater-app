import z from "zod";

export const UserZodSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(30),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(100),
});

export type UserType = z.infer<typeof UserZodSchema>;
