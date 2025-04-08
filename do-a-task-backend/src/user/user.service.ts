import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { PrismaService } from 'src/prisma/prisma.service';

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

            const contact = await this.prisma.contact.findUnique({
                where:{
                    id: user.contactId
                }
            })
            return {user: user, contact: contact}
        }
        catch(error) {
            this.prisma.handlePrismaError("GetUserData", error)
        }
    }
}
