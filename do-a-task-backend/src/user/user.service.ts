import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtHeader, JwtPayload } from '@supabase/supabase-js';

@Injectable()
export class UserService {
    constructor(private readonly supabaseService: SupabaseService, private prisma: PrismaService) {}

    async getUserData(userEmail : string){
        try{
            const user = await this.prisma.user.findUnique({
                where: {
                    email: userEmail
                }
            })
            return user
        }
        catch(error) {
            this.prisma.handlePrismaError("GetUserData", error)
        }
    }
}
