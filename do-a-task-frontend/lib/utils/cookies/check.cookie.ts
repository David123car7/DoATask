"use server"

import { AUTH_COOKIES } from "@/lib/constants/auth/cookies";
import { cookies } from "next/headers";


export async function checkAuthCookie(){
    const cookieStore = cookies();
    return (await cookieStore).has(AUTH_COOKIES.ACCESS_TOKEN)
}   