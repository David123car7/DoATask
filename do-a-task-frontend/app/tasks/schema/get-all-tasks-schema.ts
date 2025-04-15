import { z } from 'zod'; 

export const getTaskSchema = z.object({
    assignedAt: z.date(),
    completedAt: z.date(),
});

export type GetTaskSchema = z.infer<typeof getTaskSchema>;
