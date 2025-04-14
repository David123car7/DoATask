"use server"

import { createClient } from "../server"
import { getCookie } from "../../cookies/auth"; 
import { AUTH_COOKIES } from "@/lib/constants/auth/cookies";

export async function GetUser(){
    const cookie = await getCookie(AUTH_COOKIES.ACCESS_TOKEN);
    if(!cookie) {
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
    return {user: data.user, access_token: cookie}
}