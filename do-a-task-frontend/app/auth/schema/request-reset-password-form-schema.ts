import { z } from 'zod'; 

export const requestResetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type RequestResetPasswordSchema = z.infer<typeof requestResetPasswordSchema>;
