import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as argon from "argon2";
import { JwtService } from "@nestjs/jwt";
import { AuthDtoSignup, AuthDtoSignin } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ConfigService } from "@nestjs/config";
import { Response } from 'express';
import { Console } from "console";

@Injectable({})
export class AuthService{
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService){

    }

    async signup(dto: AuthDtoSignup){
        //generate a hash password
        const hash = await argon.hash(dto.password);

        try{
            //save the new user in the db
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    name: dto.name,  
                    //birthDate: dto.birthDate,        
                    birthDate: new Date(),  
                    hash,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    totalCoins: 0,
                }, 
            });

            const address = await this.prisma.address.create({});

            const locality = await this.prisma.locality.create({});

            const community = await this.prisma.community.create({
                data:{
                    localityId: locality.id,
                }
            });

            const member = await this.prisma.member.create({
                data: {
                    userId: user.id,
                    addressId: address.id,
                    communityId: community.id,
                }, 
            });

            const acessToken = this.signToken(user.id, user.email);  
            return {
                acessToken,
                message: "User Signed Up successfully"
            }
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

    /**
     * User Sign-In Service Function
     *
     * @param {AuthDtoSignin} dto - Object containing user credentials:
     *   - email: User's registered email address.
     *   - password: User's password.
     * @param {Response} response - Express response object for setting authentication cookies.
     * @returns {Promise<string>} - A JWT access token if authentication is successful.
     *
     * @throws {ForbiddenException}
     *   - Thrown if the user does not exist.
     *   - Thrown if the provided password does not match the stored hash.
     *
     * This function handles user authentication:
     * - Finds the user by their email in the database.
     * - Verifies the provided password against the stored hash.
     * - If valid, generates a signed JWT access token.
     * - Sets the token as an HTTP-only secure cookie.
     * - Returns the generated access token.
     */
    async sighin(dto: AuthDtoSignin, response: Response){
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

        const acessToken = await this.signToken(user.id, user.email);  

        response.cookie('Authentication', acessToken, {
            secure: true,
            httpOnly: true,
        });

        
        return {
            acessToken,
            message: "User Signed In successfully"
        }
    }

    async signToken( userId: number, email: string,): Promise<{ access_token: string }> {
        const payload = {
          sub: userId,
          email,
        };
        const secret = this.config.get('JWT_SECRET');
    
        const token = await this.jwt.signAsync(
          payload,
          {
            expiresIn: '1m',
            secret: secret,
          },
        );
    
        return {
          access_token: token,
        };
    }
}