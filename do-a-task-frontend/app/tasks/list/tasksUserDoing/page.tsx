'use server'

import React from "react";
import Footer from "@/lib/components/layouts/footer/page";
import HeaderWrapper from "@/lib/components/layouts/header/HeaderWrapper";
import style from "./page.module.css"
import { GetTasksMemberDoing } from "@/lib/api/tasks/get.tasks.member.doing";
import { getTasksMemberDoingSchema, GetTasksMemberDoingSchema } from "@/lib/schemas/tasks/get-task-member-doing";
import { UserTasks } from "@/lib/components/layouts/tasks/userTasks/page";
import TaskNavBar from "@/lib/components/layouts/tasks/navbar/nav.bar";

export default async function ListTasksUser(){

    const result = await GetTasksMemberDoing();
    const validatedData = getTasksMemberDoingSchema.parse(result);
    
    return(
        <div className="page">
            <HeaderWrapper/>
            <main className={style.main2}>
            <TaskNavBar/>
            <UserTasks data={validatedData}/>
            </main>
            <Footer/>
        </div>
    );
}