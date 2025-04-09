import { PrismaService } from "../prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { CreateLocalityDto } from "./dto/locality.dto";
import { SupabaseService } from "../supabase/supabase.service";
import { getDefaultResultOrder } from "dns";


@Injectable({})
export class LocalityService{
    constructor(private readonly supabaseService: SupabaseService, private prisma: PrismaService) {}

    async createLocality(dto: CreateLocalityDto){

        const createLocality = await this.prisma.locality.create({
            data:{
                name: dto.name
            }
        });
        return createLocality;
    }

    
    async getLocalityDataById(localityId: number){

        const getData  = await this.prisma.locality.findUnique({
            where:{
                id: localityId,
            },
            select:{
                id:true,
                name: true,
                communities: true,
            },
        });
        return getData;
    }

    async getLocalityDataByParish(localityId: string){

        const getData  = await this.prisma.locality.findFirst({
            where:{
                name:localityId,
            },
            select:{
                id:true,
                name: true,
                communities: true,
            },
        });
        return getData;
    }
}