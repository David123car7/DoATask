import { z } from "zod";

export const getItemSchema = z.object({
  imageUrl: z.object({
    signedUrl: z.string(),
  }),
  id: z.number(),
  name: z.string(),
  price: z.number(),
  storeId: z.number().nullable(),
  stock: z.number(),
  available: z.boolean(),
  imagePath: z.string().nullable(),
});

export const getItemSchemaArray = z.array(getItemSchema);

export type GetItemSchemaArray = z.infer<typeof getItemSchemaArray>;
