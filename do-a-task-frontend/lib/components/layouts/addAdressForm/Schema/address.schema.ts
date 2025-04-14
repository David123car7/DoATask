import { z } from 'zod';

// Schema para o endereço
const addressSchema = z.object({
    id: z.number(),
    street: z.string(),
    port: z.number(),
});

// Agora, cada item no array terá um objeto com a chave 'address'
const addressSchemaData = z.array(
  z.object({
    userId: z.string(),
    addressId: z.number(),
    communityId: z.number(),
    address: addressSchema,  // Valida o campo 'address' que contém os campos 'street' e 'port'
  })
);

export type AddressSchema = z.infer<typeof addressSchemaData>;
export { addressSchemaData };