import { z } from "zod";

export const getNameCommunitySchema = z.object({
  communityName: z.string(),
});

export const getNameCommunitySchemaArray = z.array(getNameCommunitySchema);

export type GetNameCommunitySchemaArray = z.infer<typeof getNameCommunitySchemaArray>;