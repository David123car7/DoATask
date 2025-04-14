import { SupabaseService } from "../supabase/supabase.service";
import { PrismaService } from "../prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { LocalityService } from "src/locality/locality.service";
import { CommunityService } from "src/community/community.service";


@Injectable({})
export class MemberService{
    constructor(private readonly supabaseService: SupabaseService, private prisma: PrismaService,
        private readonly localityService: LocalityService,
        private readonly communityService: CommunityService,
    ) {}

    async createMember(userId: string, addressId: number, parish: string){


        const locality = await this.localityService.getLocalityDataByParish(parish);
        const existCommunity = await this.communityService.getDataCommunity(locality.id);

        if(!existCommunity){
            throw new Error("Nao Existe Comunidade")
        }
        
            const createMember = await this.prisma.member.create({
                data:{
                    userId: userId, 
                    addressId: addressId, 
                    communityId: existCommunity.id,
                }
            });
            return createMember;
    }
}

