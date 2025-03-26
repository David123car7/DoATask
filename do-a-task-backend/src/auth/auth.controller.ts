import { Body, Controller, HttpCode, HttpStatus, Post, Res} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDtoSignup, AuthDtoSignin} from "./dto";
import { Response } from 'express';

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
    sighin(@Body() dto: AuthDtoSignin)
    {
        return this.authService.sighin(dto);
    }
}