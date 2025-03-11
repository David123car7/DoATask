import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthService{

    signup(){
        return {message: "i am signup"};
    }

    sighin(){
        return {message: "i am signin"};
    }
}