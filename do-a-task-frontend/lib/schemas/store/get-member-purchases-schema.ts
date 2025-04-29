import { z } from "zod";

const communitySchema = z.object({
    id: z.number(),
    localityId: z.number(),
    communityName: z.string(),
    creatorId: z.string(),
  });

const itemSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  storeId: z.number().nullable(),
  stock: z.number(),
  imageId: z.number(),
  available: z.boolean()
});

const purchaseSchema = z.object({
  Item: itemSchema,
  id: z.number(),
  date: z.coerce.date().nullable(), 
  totalPrice: z.number().nullable(),
  memberId: z.number(),
  itemId: z.number(),
});

export const getMemberPurchasesSchema = z.object({
    purchases: z.array(purchaseSchema),
    communities: z.array(communitySchema),
});

export type GetMemberPurchasesSchema = z.infer<typeof getMemberPurchasesSchema>;
