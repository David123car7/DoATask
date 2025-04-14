import { z } from "zod";

export const communityNameSchema = z.object({
    parish: z.string()
});

export const communityNameSchemaArray = z.array(communityNameSchema)

export type CommunityNameSchemaArray = z.infer<typeof communityNameSchemaArray>;
