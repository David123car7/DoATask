import { z } from "zod";

const recipientSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  birthDate: z.string().datetime(),
  totalCoins: z.number(),
  contactId: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const notificationSchema = z.object({
  title: z.string(),
  message: z.string(),
  read: z.boolean(),
  createdAt: z.string().datetime(),
});

export const notificationDataSchema = z.array(notificationSchema)




export type NotificationDataSchema = z.infer<typeof notificationDataSchema>;
