import { Body, Controller, HttpCode, HttpStatus, Post, Res, Get, UseGuards, Req, HttpException, NotFoundException} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { AuthDtoSignup, AuthDtoSignin, AuthDtoChangePassword, AuthDtoRequestResetPassword, AuthDtoResetPassword} from "./dto";
import { JwtAuthGuard} from "./guard/jwt.auth.guard";
import {RequestWithUser} from './types/jwt-payload.type'
import {AUTH_COOKIES} from "../lib/constants/auth/cookies";
import { SetAuthCookies, DeleteAuthCookies} from "./cookies";

@Controller("auth")
export class AuthController{
    constructor(private authService: AuthService, private setCookies: SetAuthCookies, private deleteCookies: DeleteAuthCookies) {}

    @Post("testNotifications")
    async testNotifications(@Body() body: {userId: string, tittle: string ,message: string}){
     const data = await this.authService.testNotifications(body.userId, body.tittle, body.message)
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
    async signIn(@Body() dto: AuthDtoSignin, @Res() res: Response)
    {
      const data = await this.authService.signIn(dto);
      await this.setCookies.setAuthCookie(res, data.session.access_token);
      await this.setCookies.setRefreshCookie(res, data.session.refresh_token);
      return res.json({ message: 'Signin successful', user: data.user, session: data.session});
    }

    @HttpCode(HttpStatus.OK)
    @Post("changePassword")
    @UseGuards(JwtAuthGuard)
    async changePassword(@Body() dto: AuthDtoChangePassword, @Req() req: RequestWithUser)
    {
      console.log("Change Password")
      return await this.authService.changePassword(dto, req.user.email);
    }

    @Post("requestResetPassword")
    async requestResetPassword(@Body() dto: AuthDtoRequestResetPassword, @Res() res: Response)
    {
      const reset = await this.authService.requestResetPassword(dto);
      return res.json(reset)
    }

    @HttpCode(HttpStatus.OK)
    @Post("resetPassword")
    @UseGuards(JwtAuthGuard)
    async resetPassword(@Body() dto: AuthDtoResetPassword, @Req() req: RequestWithUser, @Res() res: Response)
    {
      console.log(req.user.email)
      const reset = await this.authService.resetPassword(dto, req.user.sub)
      return res.json(reset)
    }

    @Post('signout')
    @UseGuards(JwtAuthGuard)
    async logout(@Res() res: Response) {
      await this.authService.signout();
      return res.json({ message: 'Logged out successfully' });
    }

    @Post('refreshSession')
    async refreshSession(@Body("refreshToken") refreshToken: string, @Res() res: Response,){
      const data = await this.authService.refreshSession(refreshToken);
      this.setCookies.setAuthCookie(res, data.session.access_token);
      this.setCookies.setRefreshCookie(res, data.session.refresh_token);
      return res.json({ session: data.session});
    }
}