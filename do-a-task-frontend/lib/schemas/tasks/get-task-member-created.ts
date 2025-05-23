import { z } from "zod";

export const getTaskSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  difficulty: z.number().nullable(),
  creatorId: z.number(),
  coins: z.number().nullable(),
  points: z.number().nullable(),
  location: z.string(),
});

export const getMemberTaskSchema = z.object({
  id: z.number(),
  status: z.string(),
  assignedAt: z.coerce.date().nullable(),
  completedAt: z.coerce.date().nullable(),
  volunteerId: z.number().nullable(),
  taskId: z.number(),
  score: z.number().nullable(),
});

export const communitySchema = z.object({
  communityName: z.string(),
});

export const getTasksAndMemberTasksCreatedSchema = z.object({
  tasks: z.array(getTaskSchema),
  memberTasks: z.array(getMemberTaskSchema),
  community: z.array(communitySchema),
});

export type GetTasksAndMemberTasksCreatedSchema = z.infer<
  typeof getTasksAndMemberTasksCreatedSchema
>;
