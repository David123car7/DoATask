import { z } from "zod";

export const getCommunitySchema = z.object({
  communityName: z.string(),
  locality: z.object({
    name: z.string(),
  }),
});

export const getCommunitySchemaArray = z.array(getCommunitySchema);

export type GetCommunitySchemaSchemaArray = z.infer<typeof getCommunitySchemaArray>;