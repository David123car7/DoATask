import { SupabaseService } from "../supabase/supabase.service";
import { PrismaService } from "../prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { CreateAddressDto } from "./dto/addresses.dto";


@Injectable({})
export class AddressService{
    constructor(private readonly supabaseService: SupabaseService, private prisma: PrismaService) {}

    async createAddress(dto: CreateAddressDto){

        const searchAddress = await this.prisma.address.findFirst({
            where:{
                port: dto.port,
                street: dto.street,
            }
        });
        if(searchAddress) return searchAddress.id;

        const createAddress = await this.prisma.address.create({
            data:{
                port: dto.port,
                street: dto.street
            }
        });
        return createAddress;
    }

    async updateAddress(dto: CreateAddressDto, addressId: number){
         
        const findAddress = await this.prisma.address.findFirst({
            where:{
                id: addressId 
            }
        });

        if(!findAddress){
            throw new Error("Morada Inválida");

        }else{

            const updateAddress = await this.prisma.address.update({
                where:{
                    id: addressId,
                },
                data:{
                    port: dto.port,
                    street: dto.street,
                }
            });

            return updateAddress;
        }

    }
}