"use server"

import { AUTH_COOKIES} from "@/lib/constants/auth/cookies";
import {NextResponse } from 'next/server';

export class SetCookies{
    async setAuthCookie(response: NextResponse, acess_token: string){
      if(!acess_token)
        throw new Error("Access token is required to set the cookie.");

        response.cookies.set(AUTH_COOKIES.ACCESS_TOKEN, acess_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax' as "lax" | "strict" | "none" | undefined,
          path: '/',
          maxAge: 900, // 15 minutes in seconds (900 seconds)
          });
        return response;
    }

    async setRefreshCookie(response: NextResponse, refresh_token: string){
      if(!refresh_token)
        throw new Error("Refresh token is required to set the cookie.");

        response.cookies.set(AUTH_COOKIES.REFRESH_TOKEN, refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 3600, // 1 hour in seconds (3600 seconds)
          });
        return response;    
    }
}   