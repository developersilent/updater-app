import z from "zod";
import { createNewRoute, protectedProcedure } from "../rpc/init";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { and, eq, lt, sql } from "drizzle-orm";

const todoSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
});

export const todoRoute = createNewRoute({
  createTodo: protectedProcedure
    .input(todoSchema)
    .mutation(async ({ input, ctx, c }) => {
      const validatedInput = todoSchema.safeParse(input);
      if (!validatedInput.success) {
        return c.json({ success: false, message: "Invalid input data" });
      }
      const { title, description } = validatedInput.data;
      try {
        const [newTodo] = await db
          .insert(todos)
          .values({
            title,
            description,
            userId: ctx.user.userId,
            isCompleted: false,
          })
          .returning();

        if (!newTodo) {
          return c.json({ success: false, message: "Failed to create todo" });
        }

        return c.json({
          success: true,
          message: "Todo created successfully",
        });
      } catch {
        return c.json({ success: false, message: "Failed to create todo" });
      }
    }),
  updateTodoStatus: protectedProcedure
    .input(z.object({ todoId: z.string(), isCompleted: z.boolean() }))
    .mutation(async ({ input, ctx, c }) => {
      const { todoId, isCompleted } = input;
      try {
        const [updatedTodo] = await db
          .update(todos)
          .set({
            isCompleted,
          })
          .where(and(eq(todos.id, todoId), eq(todos.userId, ctx.user.userId)))
          .returning();

        if (!updatedTodo) {
          return c.json({
            success: false,
            message: "Failed to update todo status",
          });
        }

        return c.json({
          success: true,
          message: "Todo status updated successfully",
        });
      } catch {
        return c.json({
          success: false,
          message: "Failed to update todo status",
        });
      }
    }),
  updateTodoDetails: protectedProcedure
    .input(todoSchema.extend({ todoId: z.string() }))
    .mutation(async ({ input, ctx, c }) => {
      const validatedInput = todoSchema
        .extend({ todoId: z.string() })
        .safeParse(input);
      if (!validatedInput.success) {
        return c.json({ success: false, message: "Invalid input data" });
      }
      const { title, description, todoId } = validatedInput.data;
      try {
        const [updatedTodo] = await db
          .update(todos)
          .set({
            title,
            description,
          })
          .where(and(eq(todos.id, todoId), eq(todos.userId, ctx.user.userId)))
          .returning();

        if (!updatedTodo) {
          return c.json({ success: false, message: "Failed to update todo" });
        }

        return c.json({
          success: true,
          message: "Todo updated successfully",
        });
      } catch {
        return c.json({ success: false, message: "Failed to update todo" });
      }
    }),
  deleteTodo: protectedProcedure
    .input(z.object({ todoId: z.string() }))
    .mutation(async ({ input, ctx, c }) => {
      const { todoId } = input;
      try {
        const deletedCount = await db
          .delete(todos)
          .where(and(eq(todos.id, todoId), eq(todos.userId, ctx.user.userId)))
          .returning();

        if (deletedCount.length === 0) {
          return c.json({ success: false, message: "Failed to delete todo" });
        }

        return c.json({
          success: true,
          message: "Todo deleted successfully",
        });
      } catch {
        return c.json({ success: false, message: "Failed to delete todo" });
      }
    }),
  getAllTodos: protectedProcedure.query(async ({ ctx, c }) => {
    try {
      // Delete todos older than 1 minute for this user
      await db
        .delete(todos)
        .where(
          and(
            eq(todos.userId, ctx.user.userId),
            lt(todos.createdAt, sql`NOW() - INTERVAL '24 hours'`),
          ),
        );

      // Fetch remaining todos
      const userTodos = await db.query.todos.findMany({
        where: eq(todos.userId, ctx.user.userId),
      });

      return c.json({
        success: true,
        todos: userTodos,
      });
    } catch {
      return c.json({ success: false, message: "Failed to fetch todos" });
    }
  }),
  getAllTodosByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input, c }) => {
      const validatedInput = z.object({ userId: z.string() }).safeParse(input);
      if (!validatedInput.success) {
        return c.json({ success: false, message: "Invalid input data" });
      }
      const { userId } = validatedInput.data;
      try {
        const userTodos = await db.query.todos.findMany({
          where: eq(todos.userId, userId),
        });

        return c.json({
          success: true,
          todos: userTodos,
        });
      } catch {
        return c.json({ success: false, message: "Failed to fetch todos" });
      }
    }),
});
