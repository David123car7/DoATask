import {Injectable } from "@nestjs/common";
import { AuthDtoSignup, AuthDtoSignin } from "./dto";
import { SupabaseService } from "../supabase/supabase.service";
import { PrismaService } from "../prisma/prisma.service";

@Injectable({})
export class AuthService{
    constructor(private readonly supabaseService: SupabaseService, private prisma: PrismaService) {}


    async signup(dto: AuthDtoSignup) {
        const email = dto.email;
        const password = dto.password;
        const { data, error } = await this.supabaseService.supabase.auth.signUp({
            email,
            password
        });
        
        if (error) {
            throw new Error(`Signup error: ${error.message}`);
        }

        const contact = await this.prisma.contact.create({
            data:{
                number: dto.contactNumber,
            },
        });

        const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                birthDate: new Date(),  
                createdAt: new Date(),
                updatedAt: new Date(),
                totalCoins: 0,
                contactId: contact.id
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
            throw new Error(`Signup error: ${error.message}`);
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
} 
