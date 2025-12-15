import { cookies } from "next/headers";
import { verify } from "hono/jwt";

export async function auth() {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get(process.env.COOKIE_NAME!)?.value;

    if (!authToken) {
      return null;
    }

    const payload = await verify(
      authToken,
      process.env.ARGON2_SECRET!,
      "HS256",
    );

    if (!payload || !payload.userId) {
      return null;
    }

    return {
      isAuthenticated: true,
      user: {
        id: payload.userId,
        username: payload.username,
      },
    };
  } catch {
    return null;
  }
}
