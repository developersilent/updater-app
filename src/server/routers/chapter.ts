import z from "zod";
import { createNewRoute, protectedProcedure } from "../rpc/init";
import { all_chapters_for_each_subject } from "@/db/schema";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";

const chapterSchema = z.object({
  subjectId: z.string(),
  chapterTitle: z.string().min(1, "Chapter title is required").max(100),
  compeleted_percentage: z.string().optional(),
  chapterNumber: z.string().min(1, "Chapter number is required"),
  status: z
    .enum(["COMPLETED", "DOING_IT_CURRENTLY", "NOT_STARTED"])
    .default("NOT_STARTED"),
});

export const chapterRouter = createNewRoute({
  addChapter: protectedProcedure
    .input(chapterSchema)
    .mutation(async ({ input, c }) => {
      const validatedInput = chapterSchema.safeParse(input);
      if (!validatedInput.success) {
        return c.json({ success: false, message: "Invalid input data" });
      }
      const {
        subjectId,
        chapterTitle,
        chapterNumber,
        status,
        compeleted_percentage,
      } = validatedInput.data;
      try {
        const [newChapter] = await db
          .insert(all_chapters_for_each_subject)
          .values({
            chapter_name: chapterTitle,
            chapter_number: chapterNumber,
            status: status,
            subject_id: subjectId,
            compeleted_percentage,
          })
          .returning();

        if (!newChapter) {
          return c.json({ success: false, message: "Failed to add chapter" });
        }

        return c.json({
          success: true,
          message: "Chapter added successfully",
        });
      } catch {
        return c.json({ success: false, message: "Failed to add chapter" });
      }
    }),
  updateChapter: protectedProcedure
    .input(chapterSchema.extend({ chapterId: z.string() }))
    .mutation(async ({ input, c }) => {
      const validatedInput = chapterSchema
        .extend({ chapterId: z.string() })
        .safeParse(input);
      if (!validatedInput.success) {
        return c.json({ success: false, message: "Invalid input data" });
      }
      const {
        subjectId,
        chapterTitle,
        chapterNumber,
        status,
        chapterId,
        compeleted_percentage,
      } = validatedInput.data;
      if (!chapterId) {
        return c.json({ success: false, message: "Chapter ID is required" });
      }

      try {
        const [updatedChapter] = await db
          .update(all_chapters_for_each_subject)
          .set({
            chapter_name: chapterTitle,
            chapter_number: chapterNumber,
            compeleted_percentage,
            status: status,
          })
          .where(
            and(
              eq(all_chapters_for_each_subject.id, chapterId),
              eq(all_chapters_for_each_subject.subject_id, subjectId),
            ),
          )
          .returning();

        if (!updatedChapter) {
          return c.json({
            success: false,
            message: "Failed to update chapter",
          });
        }

        return c.json({
          success: true,
          message: "Chapter updated successfully",
        });
      } catch {
        return c.json({ success: false, message: "Failed to update chapter" });
      }
    }),
  deleteChapter: protectedProcedure
    .input(z.object({ chapterId: z.string(), subjectId: z.string() }))
    .mutation(async ({ input, c }) => {
      const { chapterId, subjectId } = input;
      try {
        const [deletedChapter] = await db
          .delete(all_chapters_for_each_subject)
          .where(
            and(
              eq(all_chapters_for_each_subject.id, chapterId),
              eq(all_chapters_for_each_subject.subject_id, subjectId),
            ),
          )
          .returning();

        if (!deletedChapter) {
          return c.json({ success: false, message: "Chapter not found" });
        }

        return c.json({
          success: true,
          message: "Chapter deleted successfully",
        });
      } catch {
        return c.json({ success: false, message: "Failed to delete chapter" });
      }
    }),
  getAllChaptersBySubject: protectedProcedure
    .input(z.object({ subjectId: z.string() }))
    .mutation(async ({ input, c }) => {
      const { subjectId } = input;
      try {
        const chapters = await db.query.all_chapters_for_each_subject.findMany({
          where: eq(all_chapters_for_each_subject.subject_id, subjectId),
        });

        return c.json({
          success: true,
          message: "Chapters fetched successfully",
          chapter_data: chapters,
        });
      } catch {
        return c.json({
          success: false,
          message: "Failed to fetch chapters",
          chapter_data: [],
        });
      }
    }),
});
