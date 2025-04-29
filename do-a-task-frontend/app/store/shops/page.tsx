'use server'

import Footer from "@/lib/components/layouts/footer/page";
import HeaderWrapper from "@/lib/components/layouts/header/HeaderWrapper";
import React from "react";
import { GetUserCommunitiesNames } from "@/lib/api/communities/get.user.communities.names";
import { getNameCommunitySchemaArray } from "@/lib/schemas/community/get-communityName-schema";
import ShopNavBar from "@/lib/components/layouts/shop/navbar/mainPage/nav.bar";
import { AvaiableItems } from "@/lib/components/layouts/shop/availableItems/page";
import { Toaster } from "@/lib/components/layouts/toaster/toaster";
import { GetUserData } from "@/lib/api/user/get-user";
import { userDataSchema } from "@/app/user/schema/user-data-schema";
import { GetUserStores } from "@/lib/api/store/get-userStores";

export default async function ShopsPage(){

  const communityData = await GetUserCommunitiesNames();
  const validatedCommunityData = getNameCommunitySchemaArray.parse(communityData);
  const UserStore = await GetUserStores();

  const result = await GetUserData();
  let validatedUserData
  if(!result){
    validatedUserData = null
  }
  else{
    const parseResult = userDataSchema.safeParse(result);
    validatedUserData = parseResult.success ? parseResult.data : null;
  }

  return(
    <div className="page">   
      <main>
        <AvaiableItems community={validatedCommunityData} userData={validatedUserData} UserStore={!!UserStore}/>
      </main>
      <Footer/>
    </div>
  );
}