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
    max: 10,
    connectionString: process.env.DATABASE_URL,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

// pool.on("connect", () => {
//   console.log("Connected to the database");
// });

// pool.on("acquire", () => {
//   console.log("Client checked out from the pool");
// });

global.pgPool = pool;

export const db = drizzle(pool, { schema });
