import { SupabaseService } from "../supabase/supabase.service";
import { PrismaService } from "../prisma/prisma.service";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateCommunityDto } from "./dto/community.dto";
import { LocalityService } from "src/locality/locality.service";
import { RequestWithUser } from "src/auth/types/jwt-payload.type";

@Injectable({})
export class CommunityService{
    constructor(private readonly supabaseService: SupabaseService, private prisma: PrismaService, private readonly localityService: LocalityService) {}

    async createCommunity(dto: CreateCommunityDto, userId: string){

        try{
            const checkName = await this.prisma.community.findFirst({
                where:{
                    communityName: dto.communityName
                }
            })
            if(checkName){
                throw new HttpException("Community with this name allready exists", HttpStatus.BAD_REQUEST)
            }
        }
        catch(error){
            this.prisma.handlePrismaError("Find Community", error)
        }

        try{
            const checkName2 = await this.prisma.locality.findFirst({
                where:{
                    name: dto.location
                }
            })
            if(!checkName2){
                throw new HttpException("Location with this name does not exist", HttpStatus.BAD_REQUEST)
            }
        }
        catch(error){
            this.prisma.handlePrismaError("Find Location", error)
        }

        let locality
        try{
            locality = await this.prisma.locality.findFirst({
                where:{
                    name: dto.location,
                }
            })
        }
        catch(error){
            this.prisma.handlePrismaError("Find Community", error)
        }

        try{
            const createCommunity = await this.prisma.community.create({
                data:{
                    communityName: dto.communityName,
                    localityId: locality.id,
                    creatorId: userId,
                }
            });
            return createCommunity;
        }
        catch(error){
            this.prisma.handlePrismaError("Create community", error)
        }
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
                    communityName: true
                }
            });

            return communities;
        }
        catch(error){
            this.prisma.handlePrismaError("Get User Communities",error)
        }
    }

    //Gets all communities that the user is not in
    async GetAllCommunitiesWithLocality(userId: string){
        try{
            const communitys = await this.prisma.userCommunity.findMany({
                where:{
                    userId: userId
                }
            });

            const communities = await this.prisma.community.findMany({
                where:{
                    id: {
                        notIn: communitys.map(c => c.communityId)
                    } 
                },
                select: {
                    locality: {
                      select: { name: true },
                    },
                    communityName: true,
                },
            });

            return communities;
        }
        catch(error){
            this.prisma.handlePrismaError("Get User Communities",error)
        }
    }

    async UserEnterCommunity(userId: string, communityName: string){
        try{
            const result = await this.prisma.$transaction(async (prisma) => {
            }

        }
        catch(error){
            this.prisma.handlePrismaError("Enter Community",error)
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
                street: dto.communityName,
            }
        });

        if(!existAdrresses){
            const addAdrresses = await this.prisma.streetCommunity.create({
                data:{
                    street: dto.communityName,
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
                communityName: true,
                localityId: true,
            }
        });
        return data;
    }
}