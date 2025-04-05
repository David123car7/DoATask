import { Body, Controller, HttpCode, HttpStatus, Post, Res, Get, UseGuards, Req} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { AuthDtoSignup, AuthDtoSignin} from "./dto";
import { JwtAuthGuard} from "./guard/jwt.auth.guard";
import {RequestWithUser} from './types/jwt-payload.type'
import {AUTH_COOKIES} from "../lib/constants/auth/cookies";
import { SetAuthCookies } from "./cookies/set.cookies";

@Controller("auth")
export class AuthController{
    constructor(private authService: AuthService, private setCookies: SetAuthCookies) {}

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

        this.setCookies.setAuthCookie(res, data.session.access_token);
        this.setCookies.setRefreshCookie(res, data.session.refresh_token);

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

      this.setCookies.setAuthCookie(res, data.session.access_token);
      this.setCookies.setRefreshCookie(res, data.session.refresh_token);

      console.log("AcessToken Refresh: ",data.session.access_token);
      console.log("RefreshToken Refresh: ",data.session.refresh_token);

      return res.json({ session: data.session});
    }
}