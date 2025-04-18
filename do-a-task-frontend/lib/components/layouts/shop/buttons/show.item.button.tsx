"use client"

import { toast } from 'react-toastify';
import { ShowItem } from '@/lib/api/store/show.item';
import style from "@/lib/components/layouts/tasks/availableTasks/page.module.css"
import { useRouter } from 'next/navigation';

export function ShowItemButton({itemId} : {itemId: number}){
  const router = useRouter(); 

  const onClick  = async () => {
    try {
      const responseData = await ShowItem(itemId)
      toast.success(responseData.message)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    }
  };
  
    return(
        <>
            <button className={style.buttonTask} onClick={onClick}>
                Mostrar
            </button>
        </>
    )
}
