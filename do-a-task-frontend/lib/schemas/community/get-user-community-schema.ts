import { z } from "zod";

const pointsMemberSchema = z.object({
  id: z.number(),
  points: z.number().nullable(),
  memberId: z.number(),
});

const communityInfoSchema = z.object({
  Locality: z.object({
    name: z.string(),
  }),
  communityName: z.string(),
});

const communitySchema = z.object({
  coins: z.number(),
  PointsMember: z.array(pointsMemberSchema),
  Community: communityInfoSchema,
});

export const getCommunitiesWithMembersCountSchema = z.object({
  communities: z.array(communitySchema),
  membersCount: z.array(z.number()),
});