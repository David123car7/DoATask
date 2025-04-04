"use server"

import { AUTH_COOKIES } from "@/lib/constants/auth/cookies";
import {type NextRequest } from 'next/server';

export class GetCookies{
    async getAuthCookie(request: NextRequest){
        return request.cookies.get(AUTH_COOKIES.ACCESS_TOKEN)?.value; 
    }

    async getRefreshCookie(request: NextRequest){
        return request.cookies.get(AUTH_COOKIES.REFRESH_TOKEN)?.value; 
    }
}   