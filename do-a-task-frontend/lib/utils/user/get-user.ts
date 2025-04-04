"use server"

import { createClient } from "../supabase/server"

export async function GetUser(){
    const supabase = await createClient()
    const {error, data} = await supabase.auth.getUser()
    if(error) {
        throw error;
    }
    if(!data?.user) {
        throw new Error("User not found")
    }
    return data.user
}