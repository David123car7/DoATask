import { z } from 'zod'; 

export const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  contactNumber: z.string().min(9).max(9),
  birthDate: z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in the format YYYY-MM-DD') // Validate the format
  .transform((val) => new Date(val)) // Transform the string into a Date object
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
