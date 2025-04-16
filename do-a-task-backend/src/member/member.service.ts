import { SupabaseService } from "../supabase/supabase.service";
import { PrismaService } from "../prisma/prisma.service";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { LocalityService } from "src/locality/locality.service";
import { CommunityService } from "src/community/community.service";


@Injectable({})
export class MemberService{
    constructor(private supabaseService: SupabaseService, private prisma: PrismaService) {}

    async createMember(userId: string, communityId: number){
        try{
            const result = await this.prisma.$transaction(async () => {
                const member = await this.prisma.member.create({
                    data:{
                        userId: userId,
                        communityId: communityId,
                        coins: 0,
                    }
                })

                const pointsMember = await this.prisma.pointsMember.create({
                    data:{
                        memberId: member.id,
                        points: 0,
                    }
                })
                return member
            })
        }
        catch(error){
            this.prisma.handlePrismaError("Creating Member", error)
        }
    }

    async DeleteMember(userId: string, communityId: number){
        const member = await this.prisma.member.findFirst({
            where:{
                communityId: communityId,
                userId: userId
            }
        })
        if(!member){
            throw new HttpException("No member was found to delete", HttpStatus.BAD_REQUEST)
        }

        const pointsMember = await this.prisma.pointsMember.findFirst({
            where:{
                memberId: member.id
            }
        })
        if(!pointsMember){
            throw new HttpException("No points member was assigned to member", HttpStatus.BAD_REQUEST)
        }
        
        try{
            const result = await this.prisma.$transaction(async () => {
                await this.prisma.pointsMember.delete({
                    where:{
                        id: pointsMember.id
                    }
                })
                await this.prisma.member.delete({
                    where:{
                        id: member.id
                    }
                })
            })
        }
        catch(error){
            this.prisma.handlePrismaError("Delete Member", error)
        }
    }
}

