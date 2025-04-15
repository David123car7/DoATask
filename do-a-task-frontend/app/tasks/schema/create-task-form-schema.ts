import { z } from 'zod'; 

export const createTaskSchema = z.object({
    tittle: z.string().min(1, 'O titulo é obrigatorio'),
    description: z.string().min(1, 'A descrição é obrigatoria'),
    location: z.string().min(1, 'A descrição é obrigatoria'),
    difficulty: z.preprocess(val => Number(val), z.number().int().refine(val => [1, 2, 3].includes(val), {
        message: "Difficulty must be 1, 2, or 3"
      })),
    communityName:  z.string(),
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
