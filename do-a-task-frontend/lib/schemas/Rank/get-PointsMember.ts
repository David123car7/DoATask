import { z } from 'zod';

// Schema para o usuário
export const pointsSchema = z.object({
    points: z.number(),
});

export const pointsMemberArraySchema = z.array(pointsSchema);


