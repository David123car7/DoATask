"use client"

import { useForm } from "react-hook-form";
import { Toaster } from "@/lib/components/layouts/toaster/toaster";
import { toast } from 'react-toastify';
import style from './page.module.css'
import { CancelTask } from "@/lib/api/tasks/cancel.task";
import { useRouter } from 'next/navigation'; 

export function CancelTaskButton({taskId} : {taskId: number}){
  const {handleSubmit} = useForm<any>()
  const router = useRouter(); 

  const onClick = async () => {
    try {
      const responseData = await CancelTask(taskId)
      toast.success(responseData.message)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    }
  };
  
    return(
        <>
            <button className={style.button2} onClick={onClick}>Cancelar</button>
        </>
    )
}
