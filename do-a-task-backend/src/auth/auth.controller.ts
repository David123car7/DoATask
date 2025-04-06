import { Body, Controller, HttpCode, HttpStatus, Post, Res, Get, UseGuards, Req} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { AuthDtoSignup, AuthDtoSignin} from "./dto";
import { JwtAuthGuard} from "./guard/jwt.auth.guard";
import {RequestWithUser} from './types/jwt-payload.type'
import {AUTH_COOKIES} from "../lib/constants/auth/cookies";
import { SetAuthCookies, DeleteAuthCookies} from "./cookies";

@Controller("auth")
export class AuthController{
    constructor(private authService: AuthService, private setCookies: SetAuthCookies, private deleteCookies: DeleteAuthCookies) {}

    @Post("test")
    @UseGuards(JwtAuthGuard)
    test(){
        return { message: "Hello from auth controller" };
    }

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

        return res.json({ message: 'Signin successful', user: data.user, session: data.session});
    }

    @UseGuards(JwtAuthGuard)
    @Post('signout')
    async logout(@Res() res: Response) {
      try {
        await this.authService.signout();
        return res.json({ message: 'Logged out successfully' });
      } catch (error) {
        throw new Error(error.message);
      }
    }

    @Post('refreshSession')
    async refreshSession(@Body("refreshToken") refreshToken: string, @Res() res: Response,){
      try{
        const data = await this.authService.refreshSession(refreshToken);
        if(!data.error){
          this.setCookies.setAuthCookie(res, data.session.access_token);
          this.setCookies.setRefreshCookie(res, data.session.refresh_token);
          return res.json({ session: data.session});
        }
      }
      catch(error){
        throw new Error(error.message);
      }
    }
}