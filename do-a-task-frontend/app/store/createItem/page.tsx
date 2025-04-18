"use server";

import CreateItemForm from "@/lib/components/layouts/forms/create.item.form";
import { GetUserCommunitiesNames } from "@/lib/api/communities/get.user.communities.names";
import { GetNameCommunitySchemaArray, getNameCommunitySchemaArray } from "@/lib/schemas/community/get-communityName-schema";
import HeaderWrapper from "@/lib/components/layouts/header/HeaderWrapper";
import Footer from "@/lib/components/layouts/footer/page";

export default async function PublishTask() {
  return (
    <>
      <HeaderWrapper/>
      <CreateItemForm/>
      <Footer/>
    </>
  );
}