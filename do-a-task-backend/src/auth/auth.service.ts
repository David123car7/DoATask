import {HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthDtoSignup, AuthDtoSignin, AuthDtoChangePassword, AuthDtoResetPassword, AuthDtoRequestResetPassword} from "./dto";
import { SupabaseService } from "../supabase/supabase.service";
import { PrismaService } from "../prisma/prisma.service";
import { FRONTEND_ROUTES } from "src/lib/constants/routes/frontend";

@Injectable({})
export class AuthService{
    constructor(private readonly supabaseService: SupabaseService, private prisma: PrismaService) {}

    async signup(dto: AuthDtoSignup) {
        const email = dto.email;
        const password = dto.password;

        const { data, error } = await this.supabaseService.getPublicClient().auth.signUp({
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

        const { data, error } = await this.supabaseService.getPublicClient().auth.signInWithPassword({
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
        const { data, error } = await this.supabaseService.getPublicClient().auth.refreshSession({refresh_token: refreshToken,});
        if (error) {
            this.supabaseService.handleSupabaseError(error, "Refresh Session")
        }
        return { user: data.user, session: data.session, };
    }

    async signout() {
        const { error } = await this.supabaseService.getPublicClient().auth.signOut();
        if (error) {
            this.supabaseService.handleSupabaseError(error, "SignOut User")
        }
    }

    async changePassword(dto: AuthDtoChangePassword, email: string){
        const currentPassword = dto.currentPassword
        const password = dto.newPassword
        const password2 = dto.newPassword2
        if(password != password2)
            throw new HttpException("The passwords are different", HttpStatus.BAD_REQUEST)

        if(password == currentPassword)
            throw new HttpException("The current password is the same", HttpStatus.BAD_REQUEST)

        const {data: signInData, error: signInError} = await this.supabaseService.getPublicClient().auth.signInWithPassword({email, password: currentPassword})
        if(signInError){
            this.supabaseService.handleSupabaseError(signInError, "Change Password");
        }

        const {data: updateUserData, error: updateUserError} = await this.supabaseService.getPublicClient().auth.updateUser({password: password})
        if (updateUserError) {
            this.supabaseService.handleSupabaseError(updateUserError, "Change Password");
        }
        return { 
            message: 'Passord changed successfully'
        };
    }

    async requestResetPassword(dto: AuthDtoRequestResetPassword){
        const {data, error} = await this.supabaseService.getPublicClient().auth.resetPasswordForEmail(dto.email, {redirectTo: FRONTEND_ROUTES.RESET_PASSWORD})
        if (error) {
            this.supabaseService.handleSupabaseError(error, "Request Reset Password");
        }
        return { 
             message: 'Password reset request successfull'
        };
    }

    async resetPassword(dto: AuthDtoResetPassword, userId : string){
        const password = dto.newPassword
        const password2 = dto.newPassword2
        if(password != password2)
            throw new HttpException("The passwords are different", HttpStatus.BAD_REQUEST)

        const { data, error } = await this.supabaseService.getAdminClient().auth.admin.updateUserById(userId, {password: password})
        if (error) {
            this.supabaseService.handleSupabaseError(error, "Reset Password");
        }
        return { 
             message: 'Passord changed successfully'
        };
    }
} 
