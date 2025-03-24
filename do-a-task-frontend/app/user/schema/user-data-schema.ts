import { z } from 'zod'; 

const contactSchema = z.object({
    number: z.number()
  });
  
  export const userDataSchema = z.object({
    user: z.object({
      name: z.string(),
      email: z.string().email(),
      birthDate: z.string().datetime(),
      contact: contactSchema
    })
  });

export type UserDataSchema = z.infer<typeof userDataSchema>;
