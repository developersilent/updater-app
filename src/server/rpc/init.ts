import { getCookie } from "hono/cookie";
import { jstack } from "jstack";
import { verify } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";

type Env = {
  Variables: {
    jwtPayload: JWTPayload;
  };
};

export const j = jstack.init<Env>();

export const createNewRoute = j.router;
export const publicProcedure = j.procedure;
export const protectedProcedure = j.procedure.use(async ({ next, c }) => {
  const authToken = getCookie(c, process.env.COOKIE_NAME!);
  if (!authToken) {
    throw new Error("Unauthorized");
  }

  try {
    const payload = (await verify(
      authToken,
      process.env.ARGON2_SECRET!,
      "HS256",
    )) as JWTPayload & { userId: string; username: string };

    if (!payload || !payload.userId) {
      throw new Error("Invalid token");
    }

    // Pass to procedure context - clean typing without union
    return next({
      user: {
        userId: payload.userId,
        username: payload.username,
      },
    });
  } catch {
    throw new Error("Unauthorized");
  }
});
