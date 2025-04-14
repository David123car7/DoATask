import { SupabaseService } from "../supabase/supabase.service";
import { PrismaService } from "../prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { CreateCommunityDto } from "./dto/community.dto";
import { LocalityService } from "src/locality/locality.service";
import { RequestWithUser } from "src/auth/types/jwt-payload.type";

@Injectable({})
export class CommunityService{
    constructor(private readonly supabaseService: SupabaseService, private prisma: PrismaService, private readonly localityService: LocalityService) {}

    async createCommunity(dto: CreateCommunityDto,locality: number){

        const existCommunity = await this.localityService.getLocalityDataById(locality);

        if(!existCommunity){
            const createCommunity = await this.prisma.community.create({
                data:{
                    parish: dto.name,
                    localityId: locality,
                }
            });
            return createCommunity;
        }

        throw new Error("O nome que escolheu já existe");
    }

    async GetUserCommunities(userId: string){
        try{
            const communitys = await this.prisma.userCommunity.findMany({
                where:{
                    userId: userId
                }
            });

            const communities = await this.prisma.community.findMany({
                where:{
                    id: {
                        in: communitys.map(c => c.communityId)
                    } 
                },
                select:{
                    parish: true
                }
            });
            console.log("dwnujadnbhwabnda")

            return communities;
        }
        catch(error){
            this.prisma.handlePrismaError("Get User Communities",error)
        }
    }



    ///Tenho de ver se faz sentido ter esta tabela no prisma, uso a tabela de streetsCommunity e o user apenas adicona o numero de porta
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


    ///Atraves de um id de uma comunidade devolve o id da comunidade, o nome e o id da localidade
    async getDataCommunity(communityId: number){

        const data = await this.prisma.community.findUnique({
            where:{
                id:communityId,
            },
            select:{
                id:true, 
                parish: true,
                localityId: true,
            }
        });
        return data;
    }
}