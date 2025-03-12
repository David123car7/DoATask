import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from "argon2";
import { AuthDtoSignup, AuthDtoSignin } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable({})
export class AuthService{
    constructor(private prisma: PrismaService){

    }

    async signup(dto: AuthDtoSignup){
        //generate a hash password
        const hash = await argon.hash(dto.password);

        try{
            //save the new user in the db
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    hash,
                },
            });

            // Create a new user without the hash property
            const userNoHash = {...user, hash: undefined};

            //return the saved user
            return userNoHash;
        }
        catch(error){
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code === "P2002"){
                    throw new ForbiddenException("Credentials Taken");
                }
            }
            throw error;
        }
        
    }

    async sighin(dto: AuthDtoSignin){
        //find the user
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        });

        if(!user)
            throw new ForbiddenException("Invalid Credentials");

        //Compares the password
        const pwMatches = await argon.verify(user.hash, dto.password);
        if(!pwMatches)
            throw new ForbiddenException("Invalid Credentials");

        const userNoHash = {...user, hash: undefined};
        return userNoHash;  
    }
}