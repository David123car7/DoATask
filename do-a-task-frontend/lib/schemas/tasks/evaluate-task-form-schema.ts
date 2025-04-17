import { z } from 'zod'; 

export const evaluateTaskSchema = z.object({
    memberTaskId: z.number(),
    score: z.number().min(1).max(5),
});

export type EvaluateTaskSchema = z.infer<typeof evaluateTaskSchema>;
