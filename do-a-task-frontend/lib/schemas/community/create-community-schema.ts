import { z } from "zod";

export const createCommunitySchema = z.object({
    communityName: z.string().min(1, 'É obrigatorio escolher'),
    location: z.string().min(1, 'É obrigatorio escolher'),
});

export type CreateCommunitySchema = z.infer<typeof createCommunitySchema>;
