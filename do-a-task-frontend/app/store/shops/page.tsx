'use server'

import Footer from "@/lib/components/layouts/footer/page";
import HeaderWrapper from "@/lib/components/layouts/header/HeaderWrapper";
import React from "react";
import { GetUserCommunitiesNames } from "@/lib/api/communities/get.user.communities.names";
import { getNameCommunitySchemaArray } from "@/lib/schemas/community/get-communityName-schema";
import ShopNavBar from "@/lib/components/layouts/shop/navbar/mainPage/nav.bar";
import { AvaiableItems } from "@/lib/components/layouts/shop/availableItems/page";

export default async function ShopsPage(){

  const data = await GetUserCommunitiesNames();
  const validatedData = getNameCommunitySchemaArray.parse(data);

  return(
    <div className="page">   

      <HeaderWrapper/>
      <main>
        <ShopNavBar/>
        <AvaiableItems community={validatedData}/>
      </main>
      <Footer/>
    </div>


  );
}