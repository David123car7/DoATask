"use server"

import { AUTH_COOKIES, ACESS_TOKEN_OPTIONS, REFRESH_TOKEN_OPTIONS} from "@/lib/constants/auth/cookies";
import {NextResponse } from 'next/server';

//MUST ADD CHECKS BEFORE SETTING COOKIES TO AVOID PROBLEMS

export class SetCookies{
    async setAuthCookie(response: NextResponse, acess_token: string){
        response.cookies.set(AUTH_COOKIES.ACCESS_TOKEN, acess_token, {
            httpOnly: ACESS_TOKEN_OPTIONS.httpOnly,
            secure: ACESS_TOKEN_OPTIONS.secure,
            sameSite: ACESS_TOKEN_OPTIONS.sameSite,
            path: ACESS_TOKEN_OPTIONS.path,
            maxAge: ACESS_TOKEN_OPTIONS.maxAge
          });
        return response;
    }

    async setRefreshCookie(response: NextResponse, refresh_token: string){
        response.cookies.set(AUTH_COOKIES.REFRESH_TOKEN, refresh_token, {
            httpOnly: REFRESH_TOKEN_OPTIONS.httpOnly,
            secure: REFRESH_TOKEN_OPTIONS.secure,
            sameSite: REFRESH_TOKEN_OPTIONS.sameSite,
            path: REFRESH_TOKEN_OPTIONS.path,
            maxAge: REFRESH_TOKEN_OPTIONS.maxAge
          });
        return response;    
    }
}   