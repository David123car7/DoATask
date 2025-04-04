import { Body, Controller, HttpCode, HttpStatus, Post, Res, Get, UseGuards, Req} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { AuthDtoSignup, AuthDtoSignin} from "./dto";
import { JwtAuthGuard} from "./guard/jwt.auth.guard";
import {RequestWithUser} from './types/jwt-payload.type'
import {AUTH_COOKIES} from "../constants/auth/cookies";

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
  
    @HttpCode(HttpStatus.OK)
    @Post("signin")
    async sighin(@Body() dto: AuthDtoSignin, @Res() res: Response)
    {
        const data = await this.authService.sighin(dto);

        res.cookie(AUTH_COOKIES.ACCESS_TOKEN, data.session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 10 * 1000, // 10 seconds
          //maxAge: data.session.expires_in * 1000,
        });
      
        res.cookie(AUTH_COOKIES.REFRESH_TOKEN, data.session.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        console.log("AcessToken SignIN: ",data.session.access_token);
        console.log("RefreshToken: SignIN",data.session.refresh_token);

        return res.json({ message: 'Signin successful', user: data.user, session: data.session});
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard) 
    async logout(@Res() res: Response) {
      await this.authService.signout();
      // Clear auth tokens in cookies
      res.clearCookie(AUTH_COOKIES.ACCESS_TOKEN);
      res.clearCookie(AUTH_COOKIES.REFRESH_TOKEN);
      
      return res.json({ message: 'Logged out successfully' });
    }

    @Post('refreshSession')
    async refreshSession(@Body("refreshToken") refreshToken: string, @Res() res: Response,){
      const data = await this.authService.refreshSession(refreshToken);

      res.cookie(AUTH_COOKIES.ACCESS_TOKEN, data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 10 * 1000, // 10 seconds in milliseconds
      });
    
      res.cookie(AUTH_COOKIES.REFRESH_TOKEN, data.session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 1 * 60 * 60 * 1000, // 1 hour in milliseconds
      });
      console.log("AcessToken Refresh: ",data.session.access_token);
      console.log("RefreshToken Refresh: ",data.session.refresh_token);

      return res.json({ session: data.session});
    }
}