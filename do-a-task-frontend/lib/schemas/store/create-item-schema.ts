import { z } from 'zod'; 

export const createItemSchema = z.object({
    name: z.string().min(1, 'O titulo é obrigatorio'),
    price: z.number().min(1, 'O minimo é 1'),
    stock: z.number().min(1, 'O minimo é 1'),
});

export type CreateItemSchema = z.infer<typeof createItemSchema>;
