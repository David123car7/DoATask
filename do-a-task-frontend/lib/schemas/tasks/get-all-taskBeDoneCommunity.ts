import { z } from 'zod';

const dateStringToDate = z.string().transform((val) => new Date(val));

export const taskSchema = z.object({
  id: z.number(),
  title: z.string(),
  difficulty: z.number().nullable(),
  creatorId: z.number(),
  coins: z.number().nullable(),
  points: z.number().nullable(),
  location: z.string(),
  description: z.string(),
  imageId: z.number(),
  imageUrl: z.object({
    signedUrl: z.string(),
  }),
});

export const memberTaskSchema = z.object({
  id: z.number(),
  status: z.string(),
  assignedAt: z.string().nullable().transform(val => val ? new Date(val) : null),
  completedAt: z.string().nullable().transform(val => val ? new Date(val) : null),
  volunteerId: z.number().nullable(),
  taskId: z.number(),
  score: z.number().nullable(),
});

export const taskResponseSchema = z.object({
  tasks: z.array(taskSchema),
  memberTasks: z.array(memberTaskSchema),
});
