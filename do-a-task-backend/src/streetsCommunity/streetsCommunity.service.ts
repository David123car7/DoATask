import { SupabaseService } from "../supabase/supabase.service";
import { PrismaService } from "../prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { CommunityService } from "src/community/community.service";



@Injectable({})
export class StreetsCommunityService{
    constructor(private readonly supabaseService: SupabaseService,
    private prisma: PrismaService,
    private readonly communityService: CommunityService
    ) {}

    async addStreetsToCommunity(communityId: number, streets: string[]){

        const existCommunity = await this.communityService.getDataCommunity(communityId);

        if(!existCommunity){
            throw new Error("Comunidade Não Existe");
        }

        const existStreets = await this.existStreets(communityId,streets);

        if (!existStreets || !Array.isArray(existStreets)) {
            console.error('ExistStreets is not an array or is undefined:', existStreets);
            throw new Error('ExistStreets não é um array válido');
        }
    
        // Verifica as ruas já associadas manualmente
        const existingStreetNames: string[] = [];
        for (const street of existStreets) {
            if (street && street.street) {
                existingStreetNames.push(street.street); // Adiciona o nome da rua ao array
            }
        }
    
        const newStreets = streets.filter(street => !existingStreetNames.includes(street));


        if(newStreets.length === 0){
            return 'Todas as ruas já estao associadas';
        }

        const addStreets = await this.addStreets(communityId, streets);

        return addStreets;
        
    }


    async existStreets(communityId: number, streets: string[]){

        const existStreets = await this.prisma.streetCommunity.findMany({
            where:{
                communityId: communityId,
                street:{
                    in: streets,
                },
            },
        });
        return existStreets;
    }

    async addStreets(communityId: number, streets: string[]){

        if (!streets || !Array.isArray(streets)) {
            throw new Error('A lista de ruas não pode ser vazia ou indefinida');
        }
    
        const streetsData = [];
        
        for (const street of streets) {
            streetsData.push({
                street: street,
                communityId: communityId,
            });
        }

        const addStreets = await this.prisma.streetCommunity.createMany({
            data: streetsData,
        });

        return addStreets;
    }
}