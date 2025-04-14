"use server"

import { createClient } from "../server"
import {checkAuthCookie} from "@/lib/utils/cookies/auth/check.cookie"


export async function GetUser(){
    const hasAccessToken = await checkAuthCookie();
    console.log("hasAccessToken", hasAccessToken);
    if(!hasAccessToken) {
        return null; //the token does not exist, so the user is not authenticated
    }
    const supabase = await createClient()
    const {error, data} = await supabase.auth.getUser()
    if (error) {
        if (error.message.includes("Auth session missing")) {
          console.log(error.message);
          return null;
        }
        throw error; 
      }
    if(!data?.user) {
        return null; //the token is invalid, so the user is not authenticated
    }
    return {user: data.user}
}