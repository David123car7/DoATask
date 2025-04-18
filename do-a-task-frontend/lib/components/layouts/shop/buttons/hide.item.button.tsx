"use client"

import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { HideItem } from "@/lib/api/store/hide.item";
import style from "@/lib/components/layouts/tasks/availableTasks/page.module.css"
import { useRouter } from 'next/navigation';

export function HideItemButton({itemId} : {itemId: number}){
  const router = useRouter(); 

  const onClick  = async () => {
    try {
      const responseData = await HideItem(itemId)
      toast.success(responseData.message)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    }
  };
  
    return(
        <>
            <button className={style.buttonTask} onClick={onClick}>
                Esconder
            </button>
        </>
    )
}
