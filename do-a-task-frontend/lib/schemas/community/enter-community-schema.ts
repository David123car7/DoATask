import { z } from "zod";

export const enterCommunitySchema = z.object({
    communityName: z.string().min(1, 'É obrigatorio escolher'),
});

export type EnterCommunitySchema = z.infer<typeof enterCommunitySchema>;
