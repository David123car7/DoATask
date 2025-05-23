import * as z from "zod";

export const updateTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().optional(),
  difficulty: z.string().optional(),
  coins: z.number().optional(),
  points: z.number().optional(),
  imageUrl: z.string().optional(),
});

export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;
