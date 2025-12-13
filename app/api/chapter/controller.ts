import { db } from "@/db";
import { all_chapters_for_each_subject } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import Elysia, { t } from "elysia";
import jwt from "jsonwebtoken";


export const chapterRoutes = new Elysia()
    .resolve(async ({ cookie }) => {
        const token = cookie.auth_token.value as string;
        if (!token || token === "") {
            return { message: "Unauthorized", error: true };
        }
        const jwtdata = await jwt.verify(token, process.env.ARGON2_SECRET!) as { userId: string, username: string };
        if (!jwtdata) {
            return { message: "Unauthorized", error: true };
        }
        return { jwtdata, error: false };
    })
    .group("/chapter", (app) => {
        return app
            .get("/all/:subjectId", async ({ params }) => {
                const { subjectId } = params;
                const chapters = await db.select().from(all_chapters_for_each_subject).where(
                    eq(all_chapters_for_each_subject.subject_id, subjectId),
                ).orderBy(all_chapters_for_each_subject.chapter_number);
                return { chapter_data: chapters, error: false };
            }, {
                params: t.Object({
                    subjectId: t.String()
                })
            })
            .post("/create", async ({ body }) => {
                const { subject_id, chapter_name, chapter_number, compeleted_percentage, status } = body
                if (!subject_id || !chapter_name || !chapter_number) {
                    return { message: "Subject ID, Chapter name and Chapter number are required", error: true };
                }
                const [newChapter] = await db.insert(all_chapters_for_each_subject).values({
                    subject_id,
                    chapter_name,
                    chapter_number,
                    compeleted_percentage,
                    status
                }).returning();

                if (!newChapter.id || !newChapter) {
                    return { message: "Chapter creation failed", error: true };
                }
                return { message: "Chapter created successfully", error: false };
            }, {
                body: t.Object({
                    subject_id: t.String(),
                    chapter_name: t.String(),
                    chapter_number: t.String(),
                    compeleted_percentage: t.Optional(t.String()),
                    status: t.Optional(t.Union([
                        t.Literal('COMPLETED'),
                        t.Literal('DOING_IT_CURRENTLY'),
                        t.Literal('NOT_STARTED')
                    ])),
                })
            })
            .put("/edit/:chapterId", async ({ params, body }) => {
                const { chapterId } = params;
                const { chapter_name, chapter_number, compeleted_percentage, status, subject_id } = body;
                if (!chapter_name || !chapter_number) {
                    return { message: "Chapter name and Chapter number are required", error: true };
                }
                const updatedChapter = await db.update(all_chapters_for_each_subject).set({
                    chapter_name,
                    chapter_number,
                    compeleted_percentage,
                    status
                }).where(and(
                    eq(all_chapters_for_each_subject.id, chapterId),
                    eq(all_chapters_for_each_subject.subject_id, subject_id)
                ))
                if (!updatedChapter) {
                    return { message: "Chapter update failed", error: true };
                }
                return { message: "Chapter updated successfully", error: false };
            }, {
                params: t.Object({
                    chapterId: t.String()
                }),
                body: t.Object({
                    chapter_name: t.String(),
                    subject_id: t.String(),
                    chapter_number: t.String(),
                    compeleted_percentage: t.Optional(t.String()),
                    status: t.Optional(t.Union([
                        t.Literal('COMPLETED'),
                        t.Literal('DOING_IT_CURRENTLY'),
                        t.Literal('NOT_STARTED')
                    ])),
                })
            })
            .delete("/del/:chapterId", async ({ params, body }) => {
                const { chapterId } = params;
                const { subject_id } = body;
                const deletedChapter = await db.delete(all_chapters_for_each_subject).where(and(
                    eq(all_chapters_for_each_subject.id, chapterId),
                    eq(all_chapters_for_each_subject.subject_id, subject_id)
                ));
                if (!deletedChapter) {
                    return { message: "Chapter deletion failed", error: true };
                }
                return { message: "Chapter deleted successfully", error: false };
            }, {
                params: t.Object({
                    chapterId: t.String()
                }),
                body: t.Object({
                    subject_id: t.String()
                })
            });
    });