import { z } from 'zod';

export const createAddressSchema = z.object({
    street: z.string(),
    port: z.number(),
    postalCode: z.string().regex(/^\d{4}-\d{3}$/, {
        message: "Formato inválido. Use o formato 1234-567",
      }),
    locality: z.string(),

});

export type CreateAddressSchema = z.infer<typeof createAddressSchema>;
