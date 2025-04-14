'use server'

import { GetUserData } from "@/lib/api/user/get-user";
import { GetNotifications } from "@/lib/api/notifications/get.notifications";
import { Header } from "./header";
import { userDataSchema } from "@/app/user/schema/user-data-schema";
import { notificationDataSchema } from "@/app/notificationList/schema/notification-data-schema";
import { CountNotifications } from "@/lib/api/notifications/count.notifications";
import { GetUser } from "@/lib/utils/supabase/user/get-user";

export default async function HeaderWrapper() {
  const result = await GetUserData();
  let validatedData
  if(!result){
    console.log("wdadwad")
    validatedData = null
  }
  else{
    const parseResult = userDataSchema.safeParse(result);
    validatedData = parseResult.success ? parseResult.data : null;
  }
  return <Header userData={validatedData} />;
}
