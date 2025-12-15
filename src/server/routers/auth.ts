import { UserZodSchema } from "@/types/auth";
import {
  createNewRoute,
  protectedProcedure,
  publicProcedure,
} from "../rpc/init";
import { setCookie, getCookie, deleteCookie } from "hono/cookie";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword } from "@/lib/hash";
import { sign, verify } from "hono/jwt";

export const authRoute = createNewRoute({
  signUp: publicProcedure
    .input(UserZodSchema)
    .mutation(async ({ input, c }) => {
      const input_validated = UserZodSchema.safeParse(input);
      if (!input_validated.success) {
        return c.json({ success: false, message: "Invalid input data" });
      }
      try {
        const is_user_exists = await db
          .select()
          .from(users)
          .where(eq(users.username, input.username));
        if (is_user_exists.length > 0) {
          return c.json({ success: false, message: "User already exists" });
        }
        const hashedPassword = await hashPassword(input.password);

        if (!hashedPassword) {
          return c.json({ success: false, message: "Failed to Create User" });
        }
        const [newUser] = await db
          .insert(users)
          .values({
            username: input.username,
            password_hash: hashedPassword,
          })
          .returning();

        if (!newUser) {
          return c.json({ success: false, message: "Failed to Create User" });
        }
        const jwt_payload = {
          userId: newUser?.id,
          username: newUser?.username,
        };
        const token = await sign(
          jwt_payload,
          process.env.ARGON2_SECRET!,
          "HS256",
        );
        setCookie(c, process.env.COOKIE_NAME!, token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
        return c.json({
          success: true,
          message: "User Registered Successfully",
        });
      } catch {
        throw new Error("User Registration Failed");
      }
    }),
  logIn: publicProcedure.input(UserZodSchema).mutation(async ({ input, c }) => {
    const input_validated = UserZodSchema.safeParse(input);
    if (!input_validated.success) {
      return c.json({ success: false, message: "Invalid input data" });
    }
    try {
      const [is_user_exists] = await db
        .select()
        .from(users)
        .where(eq(users.username, input.username))
        .limit(1);
      if (!is_user_exists) {
        return c.json({ success: false, message: "User not found" });
      }
      const isPasswordValid = await verifyPassword(
        is_user_exists.password_hash,
        input.password,
      );

      if (!isPasswordValid) {
        return c.json({ success: false, message: "Invalid Credentials" });
      }
      const jwt_payload = {
        userId: is_user_exists?.id,
        username: is_user_exists?.username,
      };
      const token = await sign(
        jwt_payload,
        process.env.ARGON2_SECRET!,
        "HS256",
      );
      setCookie(c, process.env.COOKIE_NAME!, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      return c.json({ success: true, message: "User Logged In Successfully" });
    } catch {
      throw new Error("User Registration Failed");
    }
  }),
  verifyAuth: publicProcedure.query(async ({ c }) => {
    try {
      const authToken = await getCookie(c, process.env.COOKIE_NAME!);

      if (!authToken) {
        return c.json({
          success: false,
          message: "No auth token found",
          user: null,
        });
      }

      const payload = await verify(
        authToken,
        process.env.ARGON2_SECRET!,
        "HS256",
      );

      if (!payload || !payload.userId) {
        return c.json({ success: false, message: "Invalid token", user: null });
      }
      return c.json({
        success: true,
        isAuthenticated: true,
        user: {
          id: payload.userId,
          username: payload.username,
        },
      });
    } catch {
      return c.json({
        success: false,
        message: "Invalid or expired token",
        user: null,
      });
    }
  }),
  logOut: protectedProcedure.mutation(async ({ c }) => {
    try {
      await deleteCookie(c, process.env.COOKIE_NAME!);
      return c.json({ success: true, message: "User Logged Out Successfully" });
    } catch {
      return c.json({ success: false, message: "User Logout Failed" });
    }
  }),
  allUser: protectedProcedure.query(async ({ c }) => {
    try {
      const all_users = await db.select().from(users);
      return c.json({ success: true, users: all_users });
    } catch {
      return c.json({ success: false, message: "Failed to fetch users" });
    }
  }),
});
