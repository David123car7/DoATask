import { z } from "zod";

// Define the schema for each point in the points array.
const pointSchema = z.object({
  id: z.number(),
  points: z.number().nullable(),
  memberId: z.number(),
});

// Define the schema for the community object.
const communitySchema = z.object({
  id: z.number(),
  localityId: z.number(),
  communityName: z.string(),
  creatorId: z.string(),
});

// Define the schema for each community entry which includes community, coins, and points.
const getUserCommunitySchema = z.object({
  Community: communitySchema,
  coins: z.number(),
});

// Define the top-level schema as an array of community entries.
export const getUserCommunitySchemaArray = z.array(getUserCommunitySchema);

export type GetUserCommunitySchemaArray = z.infer<typeof getUserCommunitySchemaArray>;