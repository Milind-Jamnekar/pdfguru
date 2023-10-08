import { db } from "@/db";
import { privateProcedure, publicProcedure, router } from "@/server/trpc";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = getUser();

    if (!user.id || !user.email) throw new TRPCError({ code: "UNAUTHORIZED" });
    const dbUser = await db.user.findFirst({ where: { id: user.id } });

    if (!dbUser) {
      await db.user.create({ data: { id: user.id, email: user.email } });
    }
    return { success: true };
  }),

  getUserFiles: privateProcedure.query(async ({ ctx: { userId } }) => {
    return await db.file.findMany({ where: { userId } });
  }),

  deleteFile: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx: { userId }, input }) => {
      const file = await db.file.findFirst({ where: { id: input.id, userId } });
      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      return db.file.delete({ where: { id: input.id } });
    }),
});

export type AppRouter = typeof appRouter;
