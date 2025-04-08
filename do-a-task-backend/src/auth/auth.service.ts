import {HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthDtoSignup, AuthDtoSignin } from "./dto";
import { SupabaseService } from "../supabase/supabase.service";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable({})
export class AuthService{
    constructor(private readonly supabaseService: SupabaseService, private prisma: PrismaService) {}

//Create a user
    async signup(dto: AuthDtoSignup) {
        const email = dto.email;
        const password = dto.password;


        const { data, error } = await this.supabaseService.supabase.auth.signUp({
            email,
            password
        });
        if (error) {
            this.supabaseService.handleSupabaseError(error, "SignUp User")
        }

        let contact;
        try{
            contact = await this.prisma.contact.create({
                data:{
                    number: dto.contactNumber,
                },
            });
        }
        catch(error){
            this.prisma.handlePrismaError(error, "Creating Contact")
        }

        let user
        try{
            user = await this.prisma.user.create({
                data: {
                name: dto.name,
                email: dto.email,
                birthDate: new Date(),  
                createdAt: new Date(),
                updatedAt: new Date(),
                totalCoins: 0,
                contactId: contact.id
                }, 
            });
        } catch (error) {
            this.prisma.handlePrismaError(error, "Creating User")
        }
/*
        let address
        try{
            address = await this.prisma.address.create({});
        }
        catch(error){
            this.prisma.handlePrismaError(error, "Creating Adress")
        }

        let locality
        try{
            locality = await this.prisma.locality.create({});
        }
        catch(error){
            this.prisma.handlePrismaError(error, "Creating Locality")
        }

        let community
        try{
            community = await this.prisma.community.create({
                data:{
                    localityId: locality.id,
                }
            });
        }
            
        catch(error){
            this.prisma.handlePrismaError(error, "Creating Community")
        }
        */

        /*let member
        try{
            member = await this.prisma.member.create({
                data: {
                    userId: user.id,
                    addressId: address.id,
                    communityId: community.id,
                }, 
            });
        }
        catch(error){
            this.prisma.handlePrismaError(error, "Creating Member")
        }*/

        return { message: "Signup successful", user: data.user };
      }
    
    async sighin(dto: AuthDtoSignin){
        const email = dto.email;
        const password = dto.password;

        const { data, error } = await this.supabaseService.supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            this.supabaseService.handleSupabaseError(error, "SignIn User");
        }

        return { 
            user: data.user,
            session: data.session,
        };
    }

    
    async refreshSession(refreshToken: string){
        const { data, error } = await this.supabaseService.supabase.auth.refreshSession({refresh_token: refreshToken,});
        if (error) {
            return { error: error.message };
        }
        return { user: data.user, session: data.session, };
    }

    async signout() {
        const { error } = await this.supabaseService.supabase.auth.signOut();
        if (error) {
          throw new Error(error.message)
        }
    }

    private handleSignupError(error: any){
        if(error == "P2002"){}
    }
} 
