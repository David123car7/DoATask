import { PrismaService } from "../prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { CreateLocalityDto } from "./dto/locality.dto";
import { SupabaseService } from "../supabase/supabase.service";


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
}