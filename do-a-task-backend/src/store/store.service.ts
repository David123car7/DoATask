import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BUCKETS } from 'src/lib/constants/storage/buckets';

@Injectable()
export class StoreService {
    constructor(private readonly supabaseService: SupabaseService, private prisma: PrismaService) {}

    async createItem(userId: string, itemName: string, itemPrice: number, stock: number, imageName: string){
        const store = await this.getUserStore(userId)

        const item = await this.prisma.item.findFirst({
            where:{
                name: itemName
            }
        })
        if(item){
            throw new HttpException("This item allready exists", HttpStatus.BAD_REQUEST)
        }

        try{
            await this.prisma.item.create({
                data:{
                   name: itemName,
                   price: itemPrice,
                   storeId: store.id, 
                   stock: stock,
                   available: true,
                   imagePath: `${userId}/${itemName}/${imageName}`
                }
            })
        }
        catch(error){
            this.prisma.handlePrismaError("Create Item", error)
        }
    }

    async hideItem(userId: string, itemId: number){
        const store = await this.getUserStore(userId)

        const item = await this.prisma.item.findUnique({
            where:{
                id: itemId
            }
        })
        if(!item){
            throw new HttpException("The item does not exist", HttpStatus.BAD_REQUEST)
        }

        try{
            await this.prisma.item.update({
                where:{
                    id: item.id,
                },
                data:{
                    available: false
                }
            })
        }
        catch(error){
            this.prisma.handlePrismaError("Delete Item", error)
        }
    }

    async showItem(userId: string, itemId: number){
        const store = await this.getUserStore(userId)

        const item = await this.prisma.item.findUnique({
            where:{
                id: itemId
            }
        })
        if(!item){
            throw new HttpException("The item does not exist", HttpStatus.BAD_REQUEST)
        }

        try{
            await this.prisma.item.update({
                where:{
                    id: item.id,
                },
                data:{
                    available: true
                }
            })
        }
        catch(error){
            this.prisma.handlePrismaError("Show Item", error)
        }
    }

    async createStore(communityId: number){
        const community = await this.prisma.community.findUnique({
            where: {
                id: communityId,
            }
        })
        if(!community){
            throw new HttpException("The community does not exist", HttpStatus.BAD_REQUEST)
        }

        try{
            await this.prisma.store.create({
                data:{
                    communityId: community.id
                }
            })
        }
        catch(error){
            this.prisma.handlePrismaError("Create Store", error)
        }
    }

    async buyItem(userId: string, communityName: string,itemId: number){
        const community = await this.prisma.community.findFirst({
            where:{
                communityName: communityName,
            }
        })
        if(!community){
            throw new HttpException("The community does not exist", HttpStatus.BAD_REQUEST)
        }

        const member = await this.prisma.member.findFirst({
            where:{
                userId: userId,
                communityId: community.id,
            }
        })
        if(!member){
            throw new HttpException("The user does not belong to a community", HttpStatus.BAD_REQUEST)
        }

        const store = await this.prisma.store.findFirst({
            where:{
                communityId: community.id
            }
        })
        if(!store){
            throw new HttpException("The community does not have a store", HttpStatus.BAD_REQUEST)
        }

        const item = await this.prisma.item.findUnique({
            where:{
                id: itemId,
                storeId: store.id
            }
        })
        if(!item){
            throw new HttpException("The item does not exist", HttpStatus.BAD_REQUEST)
        }

        if(item.stock == 0){
            throw new HttpException("The item does not have stock", HttpStatus.BAD_REQUEST)
        }

        if(member.coins < item.price){
            throw new HttpException("The member does not have enough coins", HttpStatus.BAD_REQUEST)
        }

        try{
            const result = await this.prisma.$transaction(async () => {
                await this.prisma.member.update({
                    where:{
                        id: member.id
                    },
                    data:{
                        coins: member.coins - item.price
                    }
                })

                await this.prisma.item.update({
                    where:{
                        id: item.id
                    },
                    data:{
                        stock: item.stock - 1
                    }
                })

                await this.prisma.purchase.create({
                    data:{
                        date: new Date(),
                        itemId: item.id,
                        totalPrice: item.price,
                        memberId: member.id
                    }
                })
            })
        }
        catch(error){
            this.prisma.handlePrismaError("Buy Item", error)
        }
    
    }

    async getUserStore(userId: string){
        const community = await this.prisma.community.findFirst({
            where:{
                creatorId: userId,
            }
        })
        if(!community){
            throw new HttpException("The user does not have a community", HttpStatus.BAD_REQUEST)
        }

        const store = await this.prisma.store.findFirst({
            where:{
                communityId: community.id
            }
        })
        if(!store){
            throw new HttpException("The community does not have a store", HttpStatus.BAD_REQUEST)
        }
        
        return store
    }

    async getMemberPurchases(userId: string) {
        const members = await this.prisma.member.findMany({
          where: { userId }
        })
        if (!members) {
            throw new HttpException("The user does not belong to any community", HttpStatus.BAD_REQUEST);
        }
      
        const purchases = await this.prisma.purchase.findMany({
          where: {
            memberId: { in: members.map(m => m.id) }
          },
          include: {
            Item: true
          }
        })
        if (!purchases) {
            throw new HttpException("The user does not have any purchases", HttpStatus.BAD_REQUEST);
        }
      
        const memberIdToCommunityId: Record<number, number> = {};
        for (const m of members) {
          memberIdToCommunityId[m.id] = m.communityId;
        }
      
        const uniqueCommunityIds = Array.from(
          new Set(members.map(m => m.communityId))
        );

        const communities = await this.prisma.community.findMany({
          where: { id: { in: uniqueCommunityIds } }
        });
      
        const communityMap: Record<number, typeof communities[number]> = {};
        for (const c of communities) {
          communityMap[c.id] = c;
        }
      
        const communitiesPerPurchase = purchases.map(p => {
          const cid = memberIdToCommunityId[p.memberId];
          return communityMap[cid];
        });
      
        return {purchases: purchases, communities: communitiesPerPurchase };
      }

    async getCommunityItems(userId: string, communityName: string){
        const community = await this.prisma.community.findFirst({
            where:{
                communityName: communityName,
            }
        })
        if(!community){
            throw new HttpException("The community does not exist", HttpStatus.BAD_REQUEST)
        }

        const member = await this.prisma.member.findFirst({
            where:{
                userId: userId,
                communityId: community.id,
            }
        })
        if(!member){
            throw new HttpException("The user does not belong to the community", HttpStatus.BAD_REQUEST)
        }

        const store = await this.prisma.store.findFirst({
            where:{
                communityId: community.id
            }
        })
        if(!store){
            throw new HttpException("The community is not assigned to any store", HttpStatus.BAD_REQUEST)
        }

        const items = await this.prisma.item.findMany({
            where:{
                storeId: store.id,
                available: true
            }
        })

        const storage = this.supabaseService.getAdminClient().storage.from(BUCKETS.ITEM_IMAGES)
        if(!storage){
            throw new HttpException("The bucket storage does not exist", HttpStatus.BAD_REQUEST)
        }

        const itemsWithImages = await Promise.all (items.map(async (item) => {
            const {data, error} = await storage.createSignedUrl(item.imagePath, 3600)
            console.log(data)
            if (error) {
              return { ...item, imageUrl: null };
            }
            return { ...item, imageUrl: data };
        }));

        return itemsWithImages
    }

    async getMemberShopItems(userid: string){
        const community = await this.prisma.community.findFirst({
            where:{
                creatorId: userid
            }
        })
        if(!community){
            throw new HttpException("The user does not have any community", HttpStatus.BAD_REQUEST)
        }

        const store = await this.prisma.store.findFirst({
            where:{
                communityId: community.id
            }
        })
        if(!store){
            throw new HttpException("The community is not assigned to any store", HttpStatus.BAD_REQUEST)
        }

        const items = await this.prisma.item.findMany({
            where:{
                storeId: store.id,
            }
        })

        const storage = this.supabaseService.getAdminClient().storage.from(BUCKETS.ITEM_IMAGES)
        if(!storage){
            throw new HttpException("The bucket storage does not exist", HttpStatus.BAD_REQUEST)
        }

        const itemsWithImages = await Promise.all (items.map(async (item) => {
            const {data, error} = await storage.createSignedUrl(item.imagePath, 3600)
            console.log(data)
            if (error) {
              return { ...item, imageUrl: null };
            }
            return { ...item, imageUrl: data };
        }));

        return itemsWithImages
    }
}