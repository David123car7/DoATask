import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserCommunityService {
    constructor(private readonly supabaseService: SupabaseService, private prisma: PrismaService) {}

    async CreateUserCommunity(userId: string, communityId: number){
        try{
            const userCommunity = await this.prisma.userCommunity.create({
                data:{
                    joinedAt: new Date(),
                    userId: userId,
                    communityId: communityId
                }
            })
        }
        catch(error){
            this.prisma.handlePrismaError("Create user community", error)
        }
    }
}