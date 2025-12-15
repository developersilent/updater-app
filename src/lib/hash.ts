import argon from "argon2";

export const hashPassword = async (password: string) => {
  try {
    return await argon.hash(password, {
      secret: Buffer.from(process.env.ARGON2_SECRET!),
    });
  } catch {
    throw new Error("Password hashing failed");
  }
};

export const verifyPassword = async (hash: string, password: string) => {
  try {
    return await argon.verify(hash, password, {
      secret: Buffer.from(process.env.ARGON2_SECRET!),
    });
  } catch {
    throw new Error("Password verification failed");
  }
};
