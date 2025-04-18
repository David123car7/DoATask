"use client"

import { FinishTaskSchema, finishTaskSchema } from "@/lib/schemas/tasks/finish-task-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Toaster } from "@/lib/components/layouts/toaster/toaster";
import { toast } from 'react-toastify';
import { BuyItem } from "@/lib/api/store/buy-item";
import style from "@/lib/components/layouts/tasks/availableTasks/page.module.css"
import { useRouter } from 'next/navigation';
import { ROUTES } from "@/lib/constants/routes";
import { useState } from "react";

export function BuyItemButton({itemId, communityName} : {itemId: number, communityName: string}){
  const {handleSubmit} = useForm<any>()
  const router = useRouter(); 

  
  const onClick  = async () => {
    try {
      const responseData = await BuyItem(itemId, communityName)
      toast.success(responseData.message)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    }
  };
  
    return(
        <>
            <button className={style.buttonTask} onClick={onClick}>
                Comprar
            </button>
        </>
    )
}
