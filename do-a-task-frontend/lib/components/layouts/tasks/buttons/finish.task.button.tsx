"use client"

import { FinishTaskSchema, finishTaskSchema } from "@/lib/schemas/tasks/finish-task-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Toaster } from "@/lib/components/layouts/toaster/toaster";
import { toast } from 'react-toastify';
import { FinishTask } from "@/lib/api/tasks/finish.task";
import { useRouter } from 'next/navigation';   
import styles from './page.module.css' 


export function FinishTaskButton({memberTaskId} : {memberTaskId: number}){
  const {handleSubmit} = useForm<any>()
  const router = useRouter(); 

  const onClick = async () => {
    try {
      const responseData = await FinishTask(memberTaskId)
      toast.success(responseData.message)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    }
  };
  
    return(
        <>
            <button className={styles.button} onClick={onClick} >Terminar</button>
        </>
    )
}
