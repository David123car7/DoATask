import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as argon from "argon2";
import { JwtService } from "@nestjs/jwt";
import { AuthDtoSignup, AuthDtoSignin } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ConfigService } from "@nestjs/config";

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
                    birthDate: dto.birthDate,          
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

            //returns the user token
            return this.signToken(user.id, user.email);  
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

        //returns the user token
        return this.signToken(user.id, user.email);  
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
            expiresIn: '15m',
            secret: secret,
          },
        );
    
        return {
          access_token: token,
        };
    }
}