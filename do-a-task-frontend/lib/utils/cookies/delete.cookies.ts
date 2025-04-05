"use server"

import { AUTH_COOKIES} from "@/lib/constants/auth/cookies";
import {NextResponse } from 'next/server';

export class DeleteCookies{
    async deleteAuthCookie(response: NextResponse, acess_token: string){
      if(!acess_token)
        throw new Error("Access token is required to set the cookie.");

        return response.cookies.delete(AUTH_COOKIES.ACCESS_TOKEN)
    }

    async deleteRefreshCookie(response: NextResponse, refresh_token: string){
      if(!refresh_token)
        throw new Error("Refresh token is required to set the cookie.");

        return response.cookies.delete(AUTH_COOKIES.REFRESH_TOKEN)
    }
}   