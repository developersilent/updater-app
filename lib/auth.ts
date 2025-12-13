import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export interface UserPayload {
  userId: string;
  username: string;
}

export async function getUser(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");

  if (!token) {
    return null;
  }

  try {
    const payload = jwt.verify(token.value, process.env.ARGON2_SECRET!);
    if (!payload || typeof payload === "string") {
      return null;
    }
    return payload as UserPayload;
  } catch {
    return null;
  }
}