import { Body, Controller, HttpCode, HttpStatus, Post, Res, Get, UseGuards} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { AuthDtoSignup, AuthDtoSignin} from "./dto";
import { JwtAuthGuard} from "./guard/jwt.auth.guard";


@Controller("auth")
export class AuthController{
    constructor(private authService: AuthService) {}

    @Post("signup")
    signup(@Body() dto: AuthDtoSignup){
        return this.authService.signup(dto);
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

        res.cookie('auth_token', loginData.session.access_token, {
            httpOnly: true,
            sameSite: 'strict',
            path: '/',
        });

        return res.json({ message: 'Signin successful', user: loginData.user, session: loginData.session});
    }
}