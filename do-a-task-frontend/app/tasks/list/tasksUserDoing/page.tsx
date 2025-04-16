'use server'

import React from "react";
import Footer from "@/lib/components/layouts/footer/page";
import HeaderWrapper from "@/lib/components/layouts/header/HeaderWrapper";
import style from "./page.module.css"
import { GetUserCommunitiesNames } from "@/lib/api/communities/get.user.communities.names";
import { getNameCommunitySchemaArray } from "@/lib/schemas/community/get-communityName-schema";
import { UserTasks } from "@/lib/components/layouts/tasks/userTasks/page";
import TaskNavBar from "@/lib/components/layouts/tasks/navbar/nav.bar";

export default async function ListTasksUser(){

    const data = await GetUserCommunitiesNames();
    const validatedData = getNameCommunitySchemaArray.parse(data);
    
    return(
        <div className="page">
            <HeaderWrapper/>
            <TaskNavBar/>
            <main className={style.main2}>
            <UserTasks community={validatedData}/>
            </main>
            <Footer/>
        </div>
    );
}