import { SubjectZodSchema } from "@/types/subject";
import { createNewRoute, protectedProcedure } from "../rpc/init";
import { db } from "@/db";
import { all_subjects } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import z from "zod";

export const subjectRoute = createNewRoute({
  addNewSubject: protectedProcedure
    .input(SubjectZodSchema)
    .mutation(async ({ input, ctx, c }) => {
      const velidateInput = SubjectZodSchema.safeParse(input);
      if (!velidateInput.success) {
        return c.json({ success: false, message: "Invalid input data" });
      }
      const { subjectName, description } = velidateInput.data;
      try {
        const [newSubject] = await db
          .insert(all_subjects)
          .values({
            subject_name: subjectName,
            description: description,
            userId: ctx.user.userId,
          })
          .returning();
        if (!newSubject) {
          return c.json({ success: false, message: "Failed to add subject" });
        }
        return c.json({
          success: true,
          message: "Subject added successfully",
          subject: newSubject,
        });
      } catch {
        return c.json({ success: false, message: "Failed to add subject" });
      }
    }),
  updateSubjectData: protectedProcedure
    .input(SubjectZodSchema.extend({ subjectId: z.string() }))
    .mutation(async ({ input, ctx, c }) => {
      const velidateInput = SubjectZodSchema.extend({
        subjectId: z.string(),
      }).safeParse(input);
      if (!velidateInput.success) {
        return c.json({ success: false, message: "Invalid input data" });
      }
      const { subjectName, description, subjectId } = velidateInput.data;
      if (!subjectId) {
        return c.json({ success: false, message: "Subject ID is required" });
      }

      try {
        const [updatedSubject] = await db
          .update(all_subjects)
          .set({
            subject_name: subjectName,
            description: description,
          })
          .where(
            and(
              eq(all_subjects.id, subjectId),
              eq(all_subjects.userId, ctx.user.userId),
            ),
          )
          .returning();

        if (!updatedSubject) {
          return c.json({ success: false, message: "Subject not found" });
        }

        return c.json({
          success: true,
          message: "Subject updated successfully",
          subject: updatedSubject,
        });
      } catch {
        return c.json({ success: false, message: "Failed to update subject" });
      }
    }),
  deleteSubject: protectedProcedure
    .input(z.object({ subjectId: z.string() }))
    .mutation(async ({ input, ctx, c }) => {
      const velidateInput = z
        .object({ subjectId: z.string() })
        .safeParse(input);
      if (!velidateInput.success) {
        return c.json({ success: false, message: "Invalid input data" });
      }
      const { subjectId } = velidateInput.data;
      if (!subjectId) {
        return c.json({ success: false, message: "Subject ID is required" });
      }

      try {
        const [deletedCount] = await db
          .delete(all_subjects)
          .where(
            and(
              eq(all_subjects.id, subjectId),
              eq(all_subjects.userId, ctx.user.userId),
            ),
          )
          .returning();

        if (!deletedCount) {
          return c.json({ success: false, message: "Subject not found" });
        }

        return c.json({
          success: true,
          message: "Subject deleted successfully",
        });
      } catch {
        return c.json({ success: false, message: "Failed to delete subject" });
      }
    }),
  getUserSubjects: protectedProcedure.query(async ({ ctx, c }) => {
    try {
      const subjects = await db
        .select()
        .from(all_subjects)
        .where(eq(all_subjects.userId, ctx.user.userId));

      if (!subjects) {
        return c.json({ success: false, message: "No subjects found" });
      }

      return c.json({ success: true, subjects });
    } catch {
      return c.json({ success: false, message: "Failed to fetch subjects" });
    }
  }),
  getAllSubjectsById: protectedProcedure
    .input(z.object({ subjectId: z.string() }))
    .mutation(async ({ input, ctx, c }) => {
      const validatedInput = z
        .object({ subjectId: z.string() })
        .safeParse(input);
      if (!validatedInput.success) {
        return c.json({ success: false, message: "Invalid input data" });
      }
      const { subjectId } = validatedInput.data;
      try {
        const subject = await db
          .select()
          .from(all_subjects)
          .where(
            and(
              eq(all_subjects.id, subjectId),
              eq(all_subjects.userId, ctx.user.userId),
            ),
          );

        if (subject.length === 0) {
          return c.json({ success: false, message: "Subject not found" });
        }

        return c.json({ success: true, subject });
      } catch {
        return c.json({ success: false, message: "Failed to fetch subject" });
      }
    }),
  getSubjectsByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input, c }) => {
      const validatedInput = z.object({ userId: z.string() }).safeParse(input);
      if (!validatedInput.success) {
        return c.json({ success: false, message: "Invalid input data" });
      }
      const { userId } = validatedInput.data;
      try {
        const subjects = await db
          .select()
          .from(all_subjects)
          .where(eq(all_subjects.userId, userId));

        return c.json({ success: true, subjects });
      } catch {
        return c.json({ success: false, message: "Failed to fetch subjects" });
      }
    }),
});
