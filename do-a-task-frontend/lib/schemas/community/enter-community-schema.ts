import { z } from "zod";

export const enterExitCommunitySchema = z.object({
    communityName: z.string().min(1, 'É obrigatorio escolher'),
});

export type EnterExitCommunitySchema = z.infer<typeof enterExitCommunitySchema>;
