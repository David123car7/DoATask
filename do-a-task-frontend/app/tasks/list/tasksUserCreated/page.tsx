'use server'

import React from "react";
import Footer from "@/lib/components/layouts/footer/page";
import HeaderWrapper from "@/lib/components/layouts/header/HeaderWrapper";
import style from "./page.module.css"
import { UserCreatedTasks } from "@/lib/components/layouts/tasks/userCreatedTasks/page";
import { GetTasksMemberCreated } from "@/lib/api/tasks/get.tasks.member.created";
import {getTasksAndMemberTasksCreatedSchema} from "@/lib/schemas/tasks/get-task-member-created";
import TaskNavBar from "@/lib/components/layouts/tasks/navbar/nav.bar";
import { Toaster } from "@/lib/components/layouts/toaster/toaster";


export default async function ListUserCreatedTasks(){

    const data = await GetTasksMemberCreated()
    let validatedData
    if(data != null){
        validatedData = getTasksAndMemberTasksCreatedSchema.parse(data)
    }
    else{
        validatedData = null
    }
    
    return(
        <div className="page">
            <HeaderWrapper/>
            <main className={style.main2}>
            <Toaster/>
            <TaskNavBar/>
            <UserCreatedTasks taskMemberCreated={validatedData}/>
            </main>
            <Footer/>
        </div>
    );
}