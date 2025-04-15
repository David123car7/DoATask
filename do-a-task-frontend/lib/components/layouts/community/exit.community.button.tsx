"use client"

import { EnterExitCommunitySchema, enterExitCommunitySchema} from "@/lib/schemas/community/enter-community-schema"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Toaster } from "@/lib/components/layouts/toaster/toaster";
import { toast } from 'react-toastify';
import { ExitCommunity } from "@/lib/api/communities/exit.community";

export function ExitCommunityButton({communityName} : {communityName: string}){
  const { register, handleSubmit} = useForm<EnterExitCommunitySchema>({resolver: zodResolver(enterExitCommunitySchema)});
  
  const onSubmit = async (data: EnterExitCommunitySchema) => {
    try {
      const responseData = await ExitCommunity(data)
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
            <button type="submit">Sair</button>
            </form>
        </>
    )
}
