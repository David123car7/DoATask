import { z } from 'zod'; 

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword2: z.string().min(6, 'Password must be at least 6 characters'),
});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
