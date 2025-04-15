import { z } from 'zod';

export const taskSchema = z.object({
  id: z.number(),  // Corrigido para número
  title: z.string(),
  difficulty: z.number().nullable(),
  creatorId: z.number(),  // Corrigido para número
  coins: z.number().nullable(),
  points: z.number().nullable(),
  location: z.string(),
  description: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  members: z.array(
    z.object({
      volunteerId: z.number(),  // Corrigido para número
      completedAt: z.union([ // Permite tanto string quanto Date
        z.string().transform((str) => new Date(str)),
        z.date()      
      ]),
    })
  ),
});

// Definir o esquema para um conjunto de tarefas
export const taskDataSchema = z.array(taskSchema);

export type TasksDataSchema = z.infer<typeof taskDataSchema >
