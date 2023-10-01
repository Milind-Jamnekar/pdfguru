import { publicProcedure, router } from "@/server/trpc";

export const appRouter = router({
  getTodos: publicProcedure.query(async () => [10, 20, 30]),
});

export type AppRouter = typeof appRouter;
