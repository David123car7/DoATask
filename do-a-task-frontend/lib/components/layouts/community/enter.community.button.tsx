"use client"

import { EnterExitCommunitySchema, enterExitCommunitySchema} from "@/lib/schemas/community/enter-community-schema"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Toaster } from "@/lib/components/layouts/toaster/toaster";
import { toast } from 'react-toastify';
import { EnterCommunity } from "@/lib/api/communities/enter.community";

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
        <>
            <Toaster/>
            <form onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" value={communityName} {...register("communityName")} />  
            <button type="submit">Entrar</button>
            </form>
        </>
    )
}
