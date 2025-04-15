import { z } from 'zod';

const addressSchema = z.object({
    id: z.number(),
    street: z.string(),
    port: z.number(),
    postalCode: z.string(),
});

export const addressSchemaData = z.array(addressSchema);

export type AddressSchema = z.infer<typeof addressSchemaData>;
