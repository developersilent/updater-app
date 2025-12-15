import { authRoute } from "@/server/routers/auth";
import { j } from "@/server/rpc/init";
import { subjectRoute } from "../routers/subject";
import { todoRoute } from "../routers/todo";
import { chapterRouter } from "../routers/chapter";

const app = j
  .router()
  .basePath("/api")
  .use(j.defaults.cors)
  .onError(j.defaults.errorHandler);

const appRouter = j.mergeRouters(app, {
  user: authRoute,
  subject: subjectRoute,
  todo: todoRoute,
  chapter: chapterRouter,
});

export type AppRouter = typeof appRouter;

export default appRouter;
