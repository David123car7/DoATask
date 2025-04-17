import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class RankService {
    constructor(private readonly supabaseService: SupabaseService, private prisma: PrismaService) {}

    async getRankCommunity(communityName: string){

        const community = await this.prisma.community.findFirst({
            where:{
                communityName: communityName,
            }
        });
        if(!community){
            throw new HttpException("The Community does not exist", HttpStatus.BAD_REQUEST)
        }
        const members = await this.prisma.member.findMany({
            where:{
                communityId : community.id
            },
        });

        if(!members){
            throw new HttpException("The Community does not have members", HttpStatus.BAD_REQUEST)
        }

        const rank = await this.prisma.pointsMember.findMany({
            where:{
                memberId: {in: members.map(m => m.id)}
            },
            orderBy:{
                points: 'desc'
            },
            select:{
                points:true, 
                member:{
                    select:{
                        user:{
                            select:{
                                name:true,
                            }
                        }
                    }
                }
            }
        });
/*
        const membersFilter = await this.prisma.member.findMany({
            where:{
                id: {in: rank.map(m => m.memberId)}
            }
        })

        const user = await this.prisma.user.findMany({
            where:{
                id: {in: membersFilter.map(m => m.userId)}
            },
            select:{
                name:true,
            }
        });
        if(!user){
            throw new HttpException("The Community does not have users", HttpStatus.BAD_REQUEST)
        }
        console.log(rank)*/

        return {rank: rank}
    }

    async getUserPoints(userId: string, communityName: string){

        const community = await this.prisma.community.findFirst({
            where:{
                communityName: communityName,
            },
        });
        if(!community){
            throw new HttpException("The Community does not exist", HttpStatus.BAD_REQUEST)
        }
        const user = await this.prisma.user.findUnique({
            where:{
                id: userId,
            },
        });
        if(!user){
            throw new HttpException("The Community does not have users", HttpStatus.BAD_REQUEST)
        }

        const member = await this.prisma.member.findFirst({
            where:{
                userId: user.id,
                communityId: community.id
            },
        });
        if(!member){
            throw new HttpException("Cant find the Member", HttpStatus.BAD_REQUEST)
        }

        const pointsMember = await this.prisma.pointsMember.findFirst({
            where:{
                memberId : member.id
            },
            select:{
                points: true,
            }
        });
        if(!user){
            throw new HttpException("The user dont have points", HttpStatus.BAD_REQUEST)
        }

        console.log(pointsMember)
        return {pointsMember: pointsMember}
    }
}