import { db } from "@/db";
import { all_subjects } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import Elysia, { t } from "elysia";
import jwt from "jsonwebtoken";


export const subjectRoutes = new Elysia()
.resolve(async ({cookie}) => {
    const token = cookie.auth_token.value as string;
    if (!token || token === "") {
      return {message: "Unauthorized", error: true};
    }
    const jwtdata = await jwt.verify(token, process.env.ARGON2_SECRET!) as {userId: string, username: string};
    if (!jwtdata) {
      return {message: "Unauthorized", error: true};
    }
    return {jwtdata, error: false};
  })
.group("/subject", (app) => {
        return app
            .get("/all/:userId", async ({ params }) => {
                const { userId } = params;
                if (!userId) {
                    return { message: "User id is required", error: true };
                }
                const subjects = await db.select().from(all_subjects).where(eq(all_subjects.userId, userId));
                
                if (subjects.length === 0) {
                    return { message: "No subjects found", error: true };
                }
                return { subjects, error: false };
            })
            .post("/create", async ({ body, jwtdata }) => {
                const { subject_name, description } = await body
                if (!subject_name) {
                    return { message: "Subject name is required", error: true };
                }
                if (!jwtdata || !jwtdata.userId) {
                    return { message: "Unauthorized", error: true };
                }
                const [newSubject] = await db.insert(all_subjects).values({
                    userId: jwtdata.userId,
                    subject_name,
                    description
                }).returning();
                if (!newSubject || !newSubject.id) {
                    return { message: "Subject creation failed", error: true };
                }
                return { message: "Subject created successfully", error: false };
            }, {
                body: t.Object({
                    subject_name: t.String(),
                    description: t.Optional(t.String()),
                })
            })
            .put("/update/:subjectId", async ({ body, jwtdata, params }) => {
                const { subjectId } = params;
                if (!subjectId) {
                    return { message: "Subject ID is required", error: true };
                }
                const { subject_name, description } = await body
                if (!subjectId || !subject_name) {
                    return { message: "Subject ID and name are required", error: true };
                }
                if (!jwtdata || !jwtdata.userId) {
                    return { message: "Unauthorized", error: true };
                }
                const [updatedSubject] = await db.update(all_subjects).set({
                    subject_name,
                    description
                }).where(
                    and(
                        eq(all_subjects.id, subjectId),
                        eq(all_subjects.userId, jwtdata.userId)
                    )
                ).returning();
                if (!updatedSubject) {
                    return { message: "Subject update failed", error: true };
                }
                return { message: "Subject updated successfully", error: false };
            }, {
                body: t.Object({
                    subject_name: t.String(),
                    description: t.Optional(t.String()),
                })
            })
            .delete("/del/:subjectId", async ({ params, jwtdata }) => {
                const { subjectId } = params;
                if (!subjectId) {
                    return { message: "Subject ID is required", error: true };
                }
                if (!jwtdata || !jwtdata.userId) {
                    return { message: "Unauthorized", error: true };
                }
                const [deletedCount] = await db.delete(all_subjects).where(
                    and(
                        eq(all_subjects.id, subjectId),
                        eq(all_subjects.userId, jwtdata.userId)
                    )
                ).returning();
                if (!deletedCount) {
                    return { message: "Subject deletion failed", error: true };
                }
                return { message: "Subject deleted successfully", error: false };
            });
    })