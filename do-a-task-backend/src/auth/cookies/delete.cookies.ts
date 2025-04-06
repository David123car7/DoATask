import {Response} from "express";

export class DeleteAuthCookies{
    async deleteCookie(res: Response, cookieName: string){
        if(!cookieName)
            throw new Error("Cookie name is required to delete the cookie.");
        res.clearCookie(cookieName)
        return res;
    }
}   