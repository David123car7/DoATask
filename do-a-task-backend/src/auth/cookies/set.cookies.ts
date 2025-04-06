import { AUTH_COOKIES} from "../../lib/constants/auth/cookies";
import {Response} from "express";
//MUST ADD CHECKS BEFORE SETTING COOKIES TO AVOID PROBLEMS

export class SetAuthCookies{
    async setAuthCookie(res: Response, acess_token: string){
        if(!acess_token)
            throw new Error("Access token is required to set the cookie.");
          
        res.cookie(AUTH_COOKIES.ACCESS_TOKEN, acess_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 15 * 60 * 1000, // 900000 ms = 15 minutes in milliseconds) //to test use maxAge: 15 * 1000 (15sec)
          });
        return res;
    }

    async setRefreshCookie(res: Response, refresh_token: string){
        if(!refresh_token)
            throw new Error("Refresh token is required to set the cookie.");

        res.cookie(AUTH_COOKIES.REFRESH_TOKEN, refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
          });
        return res;    
    }
}   