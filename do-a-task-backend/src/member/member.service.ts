import { SupabaseService } from "../supabase/supabase.service";
import { PrismaService } from "../prisma/prisma.service";
import { Injectable } from "@nestjs/common";


@Injectable({})
export class MemberService{
    constructor(private readonly supabaseService: SupabaseService, private prisma: PrismaService) {}

    async createMember(/*userId: number, street: string, communityId: number*/){

        const existCommunity = await this.prisma.community.findFirst({
            where:{
                id: 15,
            }
        });

        if(!existCommunity){
            throw new Error("Nao Existe Comunidade")
        }

        const streetName = await this.prisma.address.findFirst({
            where:{
                id: 3,
            }
        });

        if(streetName){

            const existAdrressesCommunity = await this.prisma.streetCommunity.findFirst({
                where:{
                    communityId: existCommunity.id,
                    street: streetName.street
                }
            });

            if(existAdrressesCommunity){

                const createMember = await this.prisma.member.create({
                    data:{
                        userId:36, 
                        addressId:3, 
                        communityId:15, 
                    }
                });
                return createMember;
            }
            if(!streetName){
                throw new Error("Essa Rua nao existe")
            }
            if(!existAdrressesCommunity){
                throw new Error("Essa Rua nao existe nesta comunidade")
            }
        }
   
    }
}

