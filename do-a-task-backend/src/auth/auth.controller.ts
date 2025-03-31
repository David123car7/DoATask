import { Body, Controller, HttpCode, HttpStatus, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { AuthDtoSignup, AuthDtoSignin} from "./dto";



@Controller("auth")
export class AuthController{
    constructor(private authService: AuthService) {}

    @Post("signup")
    signup(@Body() dto: AuthDtoSignup){
        return this.authService.signup(dto);
    }

    @Post("tuamae")
    test(){
        return "tuamae"
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