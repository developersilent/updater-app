import { Elysia} from "elysia";
import { userRoutes } from "../user/controller";
import { cookie } from "@elysiajs/cookie";
import { subjectRoutes } from "../subject/controller";
import { chapterRoutes } from "../chapter/controller";

const app = new Elysia({ prefix: "/api" })
  .use(cookie())
  .use(userRoutes)
  .use(subjectRoutes)
  .use(chapterRoutes)

export type app = typeof app;
export const GET = app.fetch;
export const POST = app.fetch;
export const PUT = app.fetch;
export const DELETE = app.fetch;

