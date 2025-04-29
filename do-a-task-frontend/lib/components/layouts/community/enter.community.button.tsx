"use client"

import { EnterExitCommunitySchema, enterExitCommunitySchema} from "@/lib/schemas/community/enter-community-schema"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Toaster } from "@/lib/components/layouts/toaster/toaster";
import { toast } from 'react-toastify';
import { EnterCommunity } from "@/lib/api/communities/enter.community";
import styles from "./navbar/page.module.css"

export function EnterCommunityButton({communityName} : {communityName: string}){
  const { register, handleSubmit} = useForm<EnterExitCommunitySchema>({resolver: zodResolver(enterExitCommunitySchema)});
  
  const onSubmit = async (data: EnterExitCommunitySchema) => {
    try {
      const responseData = await EnterCommunity(data)
      toast.success(responseData.message)
    } catch (error: any) {
      toast.error(error.message)
    }
  };
  
    return(
        <div className={styles.buttonBox}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.formButton}>
            <input type="hidden" value={communityName} {...register("communityName")} />  
            <button type="submit" className={styles.button}>Entrar</button>
            </form>
        </div>
    )
}
