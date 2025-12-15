import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

config({ path: ".env" });

declare global {
  var pgPool: Pool | undefined;
}

const pool =
  global.pgPool ??
  new Pool({
    max: 5,
    connectionString: process.env.DATABASE_URL,
  });

// pool.on("connect", () => {
//   console.log("Connected to the database");
// });

// pool.on("acquire", () => {
//   console.log("Client checked out from the pool");
// });

if (process.env.NODE_ENV !== "production") global.pgPool = pool;

export const db = drizzle(pool, { schema });
