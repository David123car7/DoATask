'use server'

import React from "react";
import Footer from "@/lib/components/layouts/footer/page";
import HeaderWrapper from "@/lib/components/layouts/header/HeaderWrapper";
import style from "./page.module.css"
import { UserCreatedTasks } from "@/lib/components/layouts/tasks/userCreatedTasks/page";
import { GetTasksMemberCreated } from "@/lib/api/tasks/get.tasks.member.created";
import { GetTasksAndMemberTasksCreatedSchema, getTasksAndMemberTasksCreatedSchema} from "@/lib/schemas/tasks/get-task-member-created";
import TaskNavBar from "@/lib/components/layouts/tasks/navbar/nav.bar";

export default async function ListUserCreatedTasks(){

    const data = await GetTasksMemberCreated()
    const validatedData = getTasksAndMemberTasksCreatedSchema.parse(data)
    
    return(
        <div className="page">
            <HeaderWrapper/>
            <TaskNavBar/>
            <main className={style.main2}>
            <UserCreatedTasks taskMemberCreated={validatedData}/>
            </main>
            <Footer/>
        </div>
    );
}