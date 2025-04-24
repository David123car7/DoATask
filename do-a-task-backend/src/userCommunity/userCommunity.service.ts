import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { PrismaService } from '../prisma/prisma.service';

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

    async DeleteUserCommunity(userId: string ,communityId: number){
        const userCommunity = await this.prisma.userCommunity.findFirst({
            where:{
                communityId: communityId,
                userId: userId
            }
        })
        if(!userCommunity){
            throw new HttpException("No usercommunity found to delete", HttpStatus.BAD_REQUEST)
        }

        try{
            await this.prisma.userCommunity.delete({
                where:{
                    id: userCommunity.id
                }
            })
        }
        catch(error){
            this.prisma.handlePrismaError("Delete user community", error)
        }
    }
}