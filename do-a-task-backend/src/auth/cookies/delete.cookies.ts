import { HttpException, HttpStatus } from "@nestjs/common";
import {Response} from "express";

export class DeleteAuthCookies{
    async deleteCookie(res: Response, cookieName: string){
        if(!cookieName)
            throw new HttpException("Cookie name was not found", HttpStatus.BAD_REQUEST)
        res.clearCookie(cookieName)
        return res;
    }
}   