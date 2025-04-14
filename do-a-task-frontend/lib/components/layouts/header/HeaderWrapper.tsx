'use server'

import { GetUserData } from "@/lib/api/user/get-user";
import { GetNotifications } from "@/lib/api/notifications/get.notifications";
import { Header } from "./header";
import { userDataSchema } from "@/app/user/schema/user-data-schema";
import { notificationDataSchema } from "@/app/notificationList/schema/notification-data-schema";

export default async function HeaderWrapper() {
  const resultUser = await GetUserData();
  return <Header userData={resultUser}/>;
}
