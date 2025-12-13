import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword, verifyPassword } from "@/lib/hash";
import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import jwt from "jsonwebtoken";

interface jwtData {
  userId: string;
  username: string;
}

export const userRoutes = new Elysia()
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
  .group("/auth", (app) => {
    return app
    .get("/all", async () => {
        const allUsers = await db.select().from(users);
        return { users: allUsers, error: false };
    })
      .post("/signup", async ({ body, cookie }) => {
        const { username, password } = body;

        const isUserExit = await db.select().from(users).where(eq(users.username, username));
        if (isUserExit.length > 0) {
          return { message: "User already exists", error: true };
        }

        const hashedPassword = await hashPassword(password);
        const [newUser] = await db.insert(users).values({
          username,
          password_hash: hashedPassword,
        }).returning();

        if (!newUser.id || !newUser) {
          return { message: "User registration failed", error: true };
        }

        const token = await jwt.sign({ userId: newUser.id, username: newUser.username }, process.env.ARGON2_SECRET!)
        if (!token) {
          return { message: "Failed to auto login.", error: true };
        }

        cookie.auth_token.set({
          value: token,
          httpOnly: true,
          secure: true,
          path: "/",
          maxAge: 7 * 24 * 60 * 60 // 7 days
        });

        return { message: "User registered successfully", error: false };
      }, {
        body: t.Object({
          username: t.String(),
          password: t.String(),
        })
      })
      .post("/login", async ({ body, cookie }) => {
        const { username, password } = body;

        const isUserExit = await db.select().from(users).where(eq(users.username, username)).then(res => res[0]);
        if (!isUserExit) {
          return { message: "User does not exist", error: true };
        }

        const verify_password = await verifyPassword(isUserExit.password_hash, password);
        if (!verify_password) {
          return { message: "Invalid credentials", error: true };
        }

        const jwtData: jwtData = {
          userId: isUserExit.id,
          username: isUserExit.username
        }
        const token = await jwt.sign(jwtData, process.env.ARGON2_SECRET!)
        if (!token) {
          return { message: "Failed to login.", error: true };
        }

        cookie.auth_token.set({
          value: token,
          httpOnly: true,
          secure: true,
          path: "/",
          maxAge: 7 * 24 * 60 * 60 // 7 days
        });

        return { message: "User logged in successfully", error: false };
      }, {
        body: t.Object({
          username: t.String(),
          password: t.String(),
        })
      })
      .post("/logout", async ({ cookie, jwtdata }) => {
        if (!jwtdata || !jwtdata.userId) {
          return { message: "Unauthorized", error: true };
        }
        await cookie.auth_token.remove();
        return { message: "User logged out successfully", error: false };
      })
  })