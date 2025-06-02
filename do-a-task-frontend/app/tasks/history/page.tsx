"use server";

import CreateTaskForm from "@/lib/components/layouts/forms/create.tasks.form";
import { GetUserCommunitiesNames } from "@/lib/api/communities/get.user.communities.names";
import {
  GetNameCommunitySchemaArray,
  getNameCommunitySchemaArray,
} from "@/lib/schemas/community/get-communityName-schema";
import HeaderWrapper from "@/lib/components/layouts/header/HeaderWrapper";
import Footer from "@/lib/components/layouts/footer/page";
import { Toaster } from "@/lib/components/layouts/toaster/toaster";
import { GetUser } from "@/lib/utils/supabase/user/get-user";

export default async function TasksHistory() {
  const communities = await GetUserCommunitiesNames();
  const communitiesValidated = getNameCommunitySchemaArray.parse(communities);

  const user = await GetUser();

  return (
    <>
      <HeaderWrapper />
      <Toaster />
      <CreateTaskForm communityData={communitiesValidated} />
      <Footer />
    </>
  );
}
