"use server";

import Footer from "@/lib/components/layouts/footer/page";
import HeaderWrapper from "@/lib/components/layouts/header/HeaderWrapper";
import { TasksPage } from "@/lib/components/layouts/tasks/page";
import React from "react";
import { GetUserCommunitiesNames } from "@/lib/api/communities/get.user.communities.names";
import { getNameCommunitySchemaArray } from "@/lib/schemas/community/get-communityName-schema";
import TaskNavBar from "@/lib/components/layouts/tasks/navbar/nav.bar";
import { Toaster } from "@/lib/components/layouts/toaster/toaster";

export default async function ListAllTasksCommunity() {
  const data = await GetUserCommunitiesNames();
  const validatedData = getNameCommunitySchemaArray.parse(data);

  return (
    <div className="page">
      <HeaderWrapper />
      <main>
        <Toaster />
        <TasksPage />
      </main>
      <Footer />
    </div>
  );
}
