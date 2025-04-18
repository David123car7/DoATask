"use client"

import { useForm } from "react-hook-form";
import { Toaster } from "@/lib/components/layouts/toaster/toaster";
import { toast } from 'react-toastify';
import style from "@/lib/components/layouts/tasks/availableTasks/page.module.css"
import { DeleteTask } from "@/lib/api/tasks/delete.task";
import { useRouter } from 'next/navigation'; 

export function DeleteTaskButton({taskId} : {taskId: number}){
  const {handleSubmit} = useForm<any>()
  const router = useRouter(); 

  const onClick = async () => {
    try {
      const responseData = await DeleteTask(taskId)
      toast.success(responseData.message)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    }
  };
  
    return(
        <>
            <button className={style.buttonTask} onClick={onClick}>Eliminar</button>
        </>
    )
}
