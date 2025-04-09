import { SupabaseService } from "../supabase/supabase.service";
import { PrismaService } from "../prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { CommunityService } from "src/community/community.service";
import { AddressService } from "src/addresses/addresses.service";
import { LocalityService } from "src/locality/locality.service";


@Injectable({})
export class MemberService{
    constructor(private readonly supabaseService: SupabaseService, private prisma: PrismaService,
        private readonly communityService : CommunityService, 
        private readonly addressService : AddressService,
        private readonly localityService : LocalityService
    ) {}

    async createMember(userId: number, addressId: number, parish: string){


        const locality = await this.localityService.getLocalityDataByParish(parish);
        const existCommunity = await this.communityService.getDataCommunity(locality.id);

        if(!existCommunity){
            throw new Error("Nao Existe Comunidade")
        }
        
            const createMember = await this.prisma.member.create({
                data:{
                    userId:userId, 
                    addressId: addressId, 
                    communityId: existCommunity.id,
                }
            });
            return createMember;
 
    }
}

