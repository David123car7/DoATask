'use server'

import React from "react";
import Footer from "@/lib/components/layouts/footer/page";
import HeaderWrapper from "@/lib/components/layouts/header/HeaderWrapper";
import { ShowRank } from "@/lib/components/layouts/rank/page";
import { GetUserCommunitiesNames } from "@/lib/api/communities/get.user.communities.names";
import { getNameCommunitySchemaArray } from "@/lib/schemas/community/get-communityName-schema";

export default async function rank(){
      const data = await GetUserCommunitiesNames();
      const validatedData = getNameCommunitySchemaArray.parse(data);
    return (
      <div className="page">
       <HeaderWrapper/> 
        <main> 
            <ShowRank community={validatedData}/>
        </main>
        <Footer/>
      </div>
    );
}