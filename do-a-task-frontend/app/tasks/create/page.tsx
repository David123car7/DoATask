"use server";

import CreateTaskForm from "@/lib/components/layouts/forms/create.tasks.form";
import { GetUserCommunities } from "@/lib/api/communities/get.user.communities";
import { CommunityNameSchemaArray, communityNameSchemaArray } from "@/lib/schemas/community/get-community-shema";
import HeaderWrapper from "@/lib/components/layouts/header/HeaderWrapper";
import Footer from "@/lib/components/layouts/footer/page";

export default async function PublishTask() {
  const communities = await GetUserCommunities()
  const communitiesValidated = communityNameSchemaArray.parse(communities);
  
  return (
    <>
      <HeaderWrapper/>
      <CreateTaskForm communityData={communitiesValidated}/>
      <Footer/>
    </>
  );
}