import { SupabaseService } from "../supabase/supabase.service";
import { PrismaService } from "../prisma/prisma.service";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateCommunityDto } from "./dto/community.dto";
import { AddressService } from "../addresses/addresses.service";
import { MemberService } from "../member/member.service";
import { UserCommunityService } from "../userCommunity/userCommunity.service";
import { StoreService } from "../store/store.service";

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
            throw new HttpException("The user allready has a community", HttpStatus.BAD_REQUEST)
        }

        const community = await this.prisma.community.findFirst({
            where:{
                communityName: dto.communityName
            }
        })
        if(community){
            throw new HttpException("Community with this name allready exists", HttpStatus.BAD_REQUEST)
        }

       
        const locality = await this.prisma.locality.findFirst({
            where:{
                name: dto.location
            }
        })
        if(!locality){
            throw new HttpException("Location with this name does not exist", HttpStatus.BAD_REQUEST)
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
                Community: {
                    select:{
                        communityName: true,
                        Locality: {
                            select:{
                                name: true,
                            }
                        }
                    },
                },
                PointsMember: true,
                coins: true,
            }
        });

        const membersCount = []
        for (const community of communities) {
            const aux = await this.CountMembers(community.Community.communityName)
            membersCount.push(aux)
        }

        return {communities: communities, membersCount: membersCount};
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
                Locality:{},
                communityName: true,
            },
        });

        const validCommunities = [];
        const membersCount = []

        let index
        for (const community of communities) {
            const verify = await this.addressService.VefifyAdressses(userId, community.Locality.minPostalNumber, community.Locality.maxPostalNumber);
            if(verify.length != 0){
                validCommunities.push(community);
                const aux = await this.CountMembers(community.communityName)
                membersCount.push(aux)
            }
            index++
        }
        return {communities: validCommunities, membersCount: membersCount};
    }
    

    async CountMembers(communityName: string){
        const community = await this.prisma.community.findFirst({
            where: {
                communityName: communityName
            }
        })
        if(!community){
            throw new HttpException("Error finding communities", HttpStatus.BAD_REQUEST)
        }

        const membersCount = await this.prisma.member.count({
            where: {
                communityId: community.id
            }
        })

        return membersCount
    }

    async UserEnterCommunity(userId: string, communityName: string){
        const community = await this.prisma.community.findFirst({
            where:{
                communityName: communityName
            },
            select: {
                id: true,
                    communityName: true,
                    Locality: true
                }
        })
        if(!community){
            throw new HttpException("Community with this name does not exist", HttpStatus.BAD_REQUEST)
        }

        const check = await this.CheckUserBelongsCommunity(userId, community.id)
        if(check){
            throw new HttpException("The user allready is in the community", HttpStatus.BAD_REQUEST)
        }

        const addresses = await this.addressService.VefifyAdressses(userId, community.Locality.minPostalNumber, community.Locality.maxPostalNumber)
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
                Locality: true
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

    async GetLocalityUser(userId: string) {
        
        const user = await this.prisma.user.findFirst({
          where: { id: userId }
        });
      
        if (!user) {
          throw new HttpException("User does not exist", HttpStatus.BAD_REQUEST);
        }
      
        const result: typeof allLocalities = [];

        const addresses = await this.prisma.address.findMany({
          where: { userId }
        });
        if (addresses.length === 0) {
          return result
        }
      
        const allLocalities = await this.prisma.locality.findMany();
      
        const matchingLocalities = new Set<number>(); 
      
    
        for (const address of addresses) {
          if (!address.postalCode) continue; 
      
          const cleanedPostalCode = address.postalCode.replace(/\D/g, '');
          const postalCode = parseInt(cleanedPostalCode);
      
          
          for (const loc of allLocalities) {
            const min = parseInt(loc.minPostalNumber.replace(/\D/g, '')); 
            const max = parseInt(loc.maxPostalNumber.replace(/\D/g, ''));
      
            if (postalCode >= min && postalCode <= max && !matchingLocalities.has(loc.id)) {
              matchingLocalities.add(loc.id); 
              result.push(loc); 
            }
          }
        }
      
        return result; 
    }
}