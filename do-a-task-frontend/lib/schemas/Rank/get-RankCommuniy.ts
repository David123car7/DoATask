import { z } from "zod";

export const rankSchema = z.object({
  member: z.object({
    user: z.object({
      name: z.string(),
    }),
  }),
  points: z.number(),
});

export const rankArraySchema = z.array(rankSchema);
