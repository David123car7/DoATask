import { PrismaService } from "../prisma/prisma.service";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { SupabaseService } from "../supabase/supabase.service";

@Injectable({})
export class LocalityService{
    constructor(private readonly supabaseService: SupabaseService, private prisma: PrismaService) {}

    async getLocalityDataById(localityId: number){  
        const locality = await this.prisma.locality.findFirst({
            where:{
                id: localityId,
            },
        })
        if(!locality){
            throw new HttpException("Locality does not exist", HttpStatus.BAD_REQUEST)
        }

        try{
            const getData  = await this.prisma.locality.findUnique({
                where:{
                    id: localityId,
                },
                select:{
                    id:true,
                    name: true,
                    Community: true,
                },
            });
            return getData;
        }
        catch(error){
            this.prisma.handlePrismaError("Find Locality", error)
        }
    }
}