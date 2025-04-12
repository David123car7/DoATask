'use server'

import { GetUserData } from "@/lib/api/user/get-user";
import { Header } from "./header";
import { userDataSchema } from "@/app/user/schema/user-data-schema";

export default async function HeaderWrapper() {
  const result = await GetUserData();
  const parseResult = userDataSchema.safeParse(result);
  const validatedData = parseResult.success ? parseResult.data : null;

  return <Header userData={validatedData} />;
}
