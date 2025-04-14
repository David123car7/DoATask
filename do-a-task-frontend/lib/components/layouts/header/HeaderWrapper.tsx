'use server'

import { GetUserData } from "@/lib/api/user/get-user";
import { GetNotifications } from "@/lib/api/notifications/get.notifications";
import { Header } from "./header";
import { userDataSchema } from "@/app/user/schema/user-data-schema";
import { notificationDataSchema } from "@/app/notificationList/schema/notification-data-schema";
import { CountNotifications } from "@/lib/api/notifications/count.notifications";

export default async function HeaderWrapper() {
  const result = await GetUserData();
  const parseResult = userDataSchema.safeParse(result);
  const validatedData = parseResult.success ? parseResult.data : null;
  return <Header userData={validatedData} />;
}
