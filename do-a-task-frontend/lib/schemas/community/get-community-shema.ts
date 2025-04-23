import { z } from "zod";

// Schema for a single Locality
const localitySchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  maxPostalNumber: z.string(),
  minPostalNumber: z.string(),
});

// Schema for a single Community
const communitySchema = z.object({
  communityName: z.string(),
  Locality: localitySchema,
});

// Schema for your entire return object
export const getCommunitiesSchema = z.object({
  communities: z.array(communitySchema),
  membersCount: z.array(z.number()), // ← updated to reflect that it's an array
});


export type GetCommunitiesSchema = z.infer<typeof getCommunitiesSchema>;