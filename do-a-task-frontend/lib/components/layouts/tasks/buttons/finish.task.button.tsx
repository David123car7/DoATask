"use client"

import { FinishTaskSchema, finishTaskSchema } from "@/lib/schemas/tasks/finish-task-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Toaster } from "@/lib/components/layouts/toaster/toaster";
import { toast } from 'react-toastify';
import { FinishTask } from "@/lib/api/tasks/finish.task";

export function FinishTaskButton({memberTaskId} : {memberTaskId: number}){
  const {handleSubmit} = useForm<any>()
  
  const onSubmit = async () => {
    try {
      const responseData = await FinishTask(memberTaskId)
      toast.success(responseData.message)
    } catch (error: any) {
      toast.error(error.message)
    }
  };
  
    return(
        <>
            <Toaster/>
            <form onSubmit={handleSubmit(onSubmit)}>
            <button type="submit">Terminar Tarefa</button>
            </form>
        </>
    )
}
