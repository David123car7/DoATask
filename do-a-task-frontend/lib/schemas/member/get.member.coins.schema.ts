import { z } from "zod";

export const memberCoinsSchema = z.object({
  memberCoins: z.object({
    coins: z.number(),
  }),
});

export type MemberCoinsSchema = z.infer<typeof memberCoinsSchema>;