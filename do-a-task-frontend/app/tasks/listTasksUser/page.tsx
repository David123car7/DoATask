'use server'

import React from "react";
import Footer from "@/lib/components/layouts/footer/page";
import HeaderWrapper from "@/lib/components/layouts/header/HeaderWrapper";
import { ListTask } from "@/lib/components/layouts/Tasks/listTasks/page";
import style from "./page.module.css"
import { GetUserCommunitiesNames } from "@/lib/api/communities/get.user.communities.names";
import { getNameCommunitySchemaArray } from "@/lib/schemas/community/get-communityName-schema";
import { GetAllTasks } from "@/lib/api/tasks/get.all.task";
import { taskDataSchema } from "@/lib/schemas/tasks/get-tasksByCommunity-schema";
import { OtherTasks } from "@/lib/components/layouts/Tasks/otherTasks/page";


export default async function ListTasksUser(){

    const data = await GetUserCommunitiesNames();
    const validatedData = getNameCommunitySchemaArray.parse(data);

    return(
        <div className="page">
            <HeaderWrapper/>
            <main className={style.main2}>
                
                <OtherTasks community={validatedData}/>
            </main>
            <Footer/>
        </div>
    );
}