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
            this.supabaseService.handleSupabaseError(error, "SignUp User")
        }

        
            const result = await this.prisma.$transaction(async (prisma) => {
                const contact = await prisma.contact.create({
                    data: { number: dto.contactNumber },
                });
              
                const user = await prisma.user.create({
                    data: {
                    name: dto.name,
                    email: dto.email,
                    birthDate: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    totalCoins: 0,
                    contactId: contact.id,
                    },
                });
              
                const address = await prisma.address.create({});

                const locality = await prisma.locality.create({});

                const community = await prisma.community.create({
                    data: { localityId: locality.id },
                });
                
                const member = await prisma.member.create({
                    data: {
                        userId: user.id,
                        addressId: address.id,
                        communityId: community.id,
                    },
                });
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
            this.supabaseService.handleSupabaseError(error, "Refresh Session")
        }
        return { user: data.user, session: data.session, };
    }

    async signout() {
        const { error } = await this.supabaseService.supabase.auth.signOut();
        if (error) {
            this.supabaseService.handleSupabaseError(error, "SignOut User")
        }
    }
} 
