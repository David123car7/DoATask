import { z } from 'zod'; 

export const changeUserDataSchema = z.object({
      name: z.string(),
      birthDate: z.string().datetime(),
      number: z.string().min(9).max(9),
});

export type ChangeUserDataSchema = z.infer<typeof changeUserDataSchema>;
