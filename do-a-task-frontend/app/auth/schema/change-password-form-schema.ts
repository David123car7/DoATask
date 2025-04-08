import { z } from 'zod'; 

export const signInSchema = z.object({
  currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword2: z.string().min(6, 'Password must be at least 6 characters'),
});

export type SignInSchema = z.infer<typeof signInSchema>;
