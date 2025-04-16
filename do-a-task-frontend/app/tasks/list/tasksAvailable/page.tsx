'use server'

import Footer from "@/lib/components/layouts/footer/page";
import HeaderWrapper from "@/lib/components/layouts/header/HeaderWrapper";
import { ListTasksCommunity } from "@/lib/components/layouts/tasks/listAllTaskCommunity/page";
import React from "react";
import { GetUserCommunitiesNames } from "@/lib/api/communities/get.user.communities.names";
import { getNameCommunitySchemaArray } from "@/lib/schemas/community/get-communityName-schema";

export default async function ListAllTasksCommunity(){

  const data = await GetUserCommunitiesNames();
  const validatedData = getNameCommunitySchemaArray.parse(data);

  return(
    <div className="page">   

      <HeaderWrapper/>

      <main>
        <ListTasksCommunity community={validatedData}/>
      </main>

      <Footer/>
    </div>


  );
}