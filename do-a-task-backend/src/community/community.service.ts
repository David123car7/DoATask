import { SupabaseService } from "../supabase/supabase.service";
import { PrismaService } from "../prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { CreateCommunityDto } from "./dto/community.dto";
import { error } from "console";


@Injectable({})
export class CommunityService{
    constructor(private readonly supabaseService: SupabaseService, private prisma: PrismaService) {}

    async createCommunity(dto: CreateCommunityDto/*,locality: number*/){

        const existCommunity = await this.prisma.community.findFirst({
            where:{
                name:dto.name
            }
        });

        if(!existCommunity){
            const createCommunity = await this.prisma.community.create({
                data:{
                    name: dto.name,
                    localityId: 13,
                }
            });
            return createCommunity;
        }

        throw new Error("O nome que escolheu já existe");
    }

    async addAdrresses(dto: CreateCommunityDto/*, localityId: number, name: string, communityId: number*/){
        
        const existCommunity = await this.prisma.community.findFirst({
            where:{
                id: 15,
            }
        });

        if(!existCommunity){
            throw new Error("Nao Existe Comunidade")
        }

        const existAdrresses = await this.prisma.streetCommunity.findFirst({
            where:{
                communityId: existCommunity.id,
                street: dto.name,
            }
        });

        if(!existAdrresses){
            const addAdrresses = await this.prisma.streetCommunity.create({
                data:{
                    street: dto.name,
                    community:{
                        connect:{
                            id: existCommunity.id,
                        },
                    },
                },
            });
            return addAdrresses;
        }

        if(existAdrresses){
            throw new Error("Rua ja existe na comunidade");
        }

        
    }

    async getDataCommunity(communityId: number){

        const data = await this.prisma.community.findMany({
            where:{
                id:communityId,
            },
            select:{
                id:true, 
                name: true,
                localityId: true,
            }
        });
        return data;
    }
}