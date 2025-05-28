"use client"

import { FinishTaskSchema, finishTaskSchema } from "@/lib/schemas/tasks/finish-task-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Toaster } from "@/lib/components/layouts/toaster/toaster";
import { toast } from 'react-toastify';
import { AssignTask } from "@/lib/api/tasks/assign.task";
import { useRouter } from 'next/navigation';
import { ROUTES } from "@/lib/constants/routes";
import style from './page.module.css'

export function AssignTaskButton({taskId} : {taskId: number}){
  const {handleSubmit} = useForm<any>()
  const router = useRouter(); 
  
  
  const onClick = async () => {
    try {
      const responseData = await AssignTask(taskId)
      toast.success(responseData.message)
      router.push(ROUTES.TASKS_USER__DOING_LIST)
    } catch (error: any) {
      toast.error(error.message)
    }
  };
  
    return(
        <>
            <button className={style.button3} onClick={onClick}>
              Aceitar voluntariado
            </button>
        </>
    )
}
