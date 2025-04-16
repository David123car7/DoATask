import { z } from 'zod'; 

export const finishTaskSchema = z.object({
    memberTaskId: z.number()
});

export type FinishTaskSchema = z.infer<typeof finishTaskSchema>;
