import { SupabaseService } from "../supabase/supabase.service";
import { PrismaService } from "../prisma/prisma.service";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateCommunityDto } from "./dto/community.dto";
import { AddressService } from "src/addresses/addresses.service";
import { MemberService } from "src/member/member.service";
import { UserCommunityService } from "src/userCommunity/userCommunity.service";
import { StoreService } from "src/store/store.service";

@Injectable({})
export class CommunityService{
    constructor(private readonly supabaseService: SupabaseService, private prisma: PrismaService, 
        private addressService: AddressService, private memberService: MemberService, private userCommunityService: UserCommunityService,
        private storeService: StoreService
    ) {}

    async createCommunity(dto: CreateCommunityDto, userId: string){
        const countCommunitys = await this.prisma.community.findMany({
            where:{
                creatorId: userId
            }
        })
        if(countCommunitys.length >= 1){
            throw new HttpException("You allready have a community", HttpStatus.BAD_REQUEST)
        }

        const checkName = await this.prisma.community.findFirst({
            where:{
            communityName: dto.communityName
            }
        })
        if(checkName){
            throw new HttpException("Community with this name allready exists", HttpStatus.BAD_REQUEST)
        }

       
        const checkName2 = await this.prisma.locality.findFirst({
            where:{
                name: dto.location
            }
        })
        if(!checkName2){
            throw new HttpException("Location with this name does not exist", HttpStatus.BAD_REQUEST)
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
            const result = await this.prisma.$transaction(async (prisma) => {
                const c = await this.prisma.community.create({
                    data:{
                        communityName: dto.communityName,
                        localityId: locality.id,
                        creatorId: userId,
                    }
                });
                this.storeService.createStore(c.id)
            })
        }
        catch(error){
            this.prisma.handlePrismaError("Create community", error)
        }
    }

    //Gets all communities the user is in
    async GetUserCommunities(userId: string){
        const userCommunitys = await this.prisma.userCommunity.findMany({
            where:{
                userId: userId
            }
        });
        if(!userCommunitys){
            throw new HttpException("User does not belong to any community", HttpStatus.BAD_REQUEST)
        }

        const communities = await this.prisma.member.findMany({
            where:{
                communityId: {
                    in: userCommunitys.map(c => c.communityId)
                }, 
                userId: userId,
            },
            select:{
                community: true,
                coins: true,
            }
        });
        return communities;
    }

        //Gets all communities names the user is in
        async GetUserCommunitiesNames(userId: string){
        
            const userCommunitys = await this.prisma.userCommunity.findMany({
                where:{
                    userId: userId
                }
            });
            if(!userCommunitys){
                throw new HttpException("User does not belong to any community", HttpStatus.BAD_REQUEST)
            }

            const communities = await this.prisma.community.findMany({
                where:{
                    id: {
                        in: userCommunitys.map(c => c.communityId)
                    } 
                },
                select:{
                    communityName: true
                 }
            });
            return communities;
        }

    //Gets all communities that the user is not in and has address in the community location
    async GetAllCommunitiesWithLocality(userId: string){
        try{
            const userCommunities = await this.prisma.userCommunity.findMany({
                where:{
                    userId: userId
                }
            });

            const communities = await this.prisma.community.findMany({
                where:{
                    id: {
                        notIn: userCommunities.map(c => c.communityId)
                    } 
                },
                select: {
                    locality:{},
                    communityName: true,
                },
            });

            const validCommunities = [];

            for (const community of communities) {
                console.log(community.locality.minPostalNumber)
                console.log(community.locality.maxPostalNumber)
                const verify = await this.addressService.VefifyAdressses(userId, community.locality.minPostalNumber, community.locality.maxPostalNumber);
                if(verify.length != 0){
                    validCommunities.push(community);
                }
            }

            return validCommunities;
        }
        catch(error){
            this.prisma.handlePrismaError("Get User Communities",error)
        }
    }

    async UserEnterCommunity(userId: string, communityName: string){
        const community = await this.prisma.community.findFirst({
            where:{
                communityName: communityName
            },
            select: {
                id: true,
                    communityName: true,
                    locality: true
                }
        })
        if(!community){
            throw new HttpException("Community with this name does not exist", HttpStatus.BAD_REQUEST)
        }

        const check = await this.CheckUserBelongsCommunity(userId, community.id)
            if(check){
            throw new HttpException("The user allready is in the community", HttpStatus.BAD_REQUEST)
        }

        const addresses = await this.addressService.VefifyAdressses(userId, community.locality.minPostalNumber, community.locality.maxPostalNumber)
        if(!addresses){
            throw new HttpException("The user has not any address that belongs to the community location", HttpStatus.BAD_REQUEST)
        }
        try{
            const result = await this.prisma.$transaction(async (prisma) => {
                await this.userCommunityService.CreateUserCommunity(userId, community.id)
                await this.memberService.createMember(userId, community.id)
            });
        }
        catch(error){
            this.prisma.handlePrismaError("Enter Community",error)
        }
    }


    async ExitCommunity(userid: string, communityName: string){
        const community = await this.prisma.community.findFirst({
            where:{
                communityName: communityName
            },
            select: {
                id: true,
                communityName: true,
                locality: true
            }
        })
        if(!community)
            throw new HttpException("The community with this name does not exist", HttpStatus.BAD_REQUEST)
        
        try{
            const result = await this.prisma.$transaction(async (prisma) => {
                await this.memberService.DeleteMember(userid,community.id)
                await this.userCommunityService.DeleteUserCommunity(userid,community.id)
            });
        }
        catch(error){
            this.prisma.handlePrismaError("Exit Community", error)
        }
    }

    async CheckUserBelongsCommunity(userId: string, communityId: number){
        try{
            const userCommunity = await this.prisma.userCommunity.findFirst({
                where:{
                    userId: userId,
                    communityId: communityId,
                }
            })
            if(!userCommunity){
                return false
            }
            else{
                return true
            }
        }
        catch(error){
            this.prisma.handlePrismaError("Check User",error)
        }
    }
}