import { Body, Controller, HttpCode, HttpStatus, Post, Res, Get, Session, Req} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDtoSignup, AuthDtoSignin} from "./dto";
import { Request, Response } from 'express';
import { LOADIPHLPAPI } from "dns";

@Controller("auth")
export class AuthController{
    constructor(private authService: AuthService) {}

    @Post("signup")
    signup(@Body() dto: AuthDtoSignup){
        return this.authService.signup(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post("signin")
    sighin(@Body() dto: AuthDtoSignin, @Res({ passthrough: true }) response: Response, @Req() req: Request)
    {
        return this.authService.sighin(dto, response, req);
    }

    @Get('')
    async getAuthSession(@Session() session: Record<string, any>){
        console.log(session.user);
        console.log(session.id);
        return session.user;
    }
    
}