import { SupabaseService } from "../supabase/supabase.service";
import { PrismaService } from "../prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { LocalityService } from "src/locality/locality.service";
import { CommunityService } from "src/community/community.service";


@Injectable({})
export class MemberService{
    constructor(private supabaseService: SupabaseService, private prisma: PrismaService) {}

    async createMember(userId: string, communityId: number){
        try{
            const member = await this.prisma.member.create({
                data:{
                    userId: userId,
                    communityId: communityId,
                    coins: 0,
                }
            })
            return member
        }
        catch(error){
            this.prisma.handlePrismaError("Creating Member", error)
        }
    }
}

