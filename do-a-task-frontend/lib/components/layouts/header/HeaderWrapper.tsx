'use server'

import { GetUserData } from "@/lib/api/user/get-user";
import { GetNotifications } from "@/lib/api/notifications/get.notifications";
import { Header } from "./header";
import { userDataSchema } from "@/app/user/schema/user-data-schema";
import { notificationDataSchema } from "@/app/user/schema/notification-data-schema";

export default async function HeaderWrapper() {
  const resultUser = await GetUserData();

  const userParse = userDataSchema.safeParse(resultUser);

  if(!userParse.success){
    console.log("Erro de validação:", userParse.error);
    return <Header userData={null} notifications={{notifications : []}} />;
  }
  
  const resultNotif = await GetNotifications();
  const notifParse = notificationDataSchema.safeParse(resultNotif);

  const validatedUserData = userParse.success ? userParse.data : null;
  const validatedNotifications = notifParse.success ? notifParse.data : { notifications: [] };

  return <Header userData={validatedUserData} notifications={validatedNotifications} />;
}
