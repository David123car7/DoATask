import { Body, Controller, HttpCode, HttpStatus, Post, Res, Get, UseGuards, Req} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { AuthDtoSignup, AuthDtoSignin} from "./dto";
import { JwtAuthGuard} from "./guard/jwt.auth.guard";
import {RequestWithUser} from './types/jwt-payload.type'

@Controller("auth")
export class AuthController{
    constructor(private authService: AuthService) {}

    @Post("signup")
    signup(@Body() dto: AuthDtoSignup){
        return this.authService.signup(dto);
    }

    @Post('verify')
    @UseGuards(JwtAuthGuard)
    verify(@Req() req: RequestWithUser) {
      return {
        ok: true,
        user: {
          id: req.user.sub,
          email: req.user.email,
        },
      };
    }
  
    @UseGuards(JwtAuthGuard)
    @Get("test")
    hello(){
        return "ola";
    }

    @HttpCode(HttpStatus.OK)
    @Post("signin")
    async sighin(@Body() dto: AuthDtoSignin, @Res() res: Response)
    {
        const loginData = await this.authService.sighin(dto);

        res.cookie('accessToken', loginData.session.access_token, {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none', // Allows cross-origin cookies
            path: '/', // Important!
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        return res.json({ message: 'Signin successful', user: loginData.user, session: loginData.session});
    }
}