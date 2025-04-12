'use server'

import { GetUser } from "@/lib/api/user/get-user";
import Header from "./header";

export default async function HeaderWrapper() {
  const user = await GetUser();
  return <Header user={user} />;
}
