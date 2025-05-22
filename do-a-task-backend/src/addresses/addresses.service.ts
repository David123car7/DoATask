import { SupabaseService } from "../supabase/supabase.service";
import { PrismaService } from "../prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { CreateAddressDto } from "./dto/addresses.dto";
import { error } from "console";
import { HttpException, HttpStatus } from "@nestjs/common";
import {UpdateAddressDto} from "./dto/update.address.dto"


@Injectable({})
export class AddressService{
    constructor(private readonly supabaseService: SupabaseService, private prisma: PrismaService) {}

    async createAddress(dto: CreateAddressDto, userId: string){
      
        const address = await this.prisma.address.findFirst({
            where:{
                port: dto.port,
                street: dto.street,
                postalCode: dto.postalCode
            }
        })
        if(address){
            throw new HttpException("The address allready exist", HttpStatus.BAD_REQUEST)
        }
    
        const locality = await this.prisma.locality.findFirst({
            where:{
                name: dto.locality
            }
        });
        if(!locality){
            throw new HttpException("The Locality does not exist", HttpStatus.BAD_REQUEST)
        }

        try{
            const createAddress = await this.prisma.address.create({
                data:{
                    port: dto.port,
                    street: dto.street,
                    postalCode: dto.postalCode,
                    userId: userId,
                }
            });
        }
        catch(error){
            this.prisma.handlePrismaError("Create Adresses", error);
        }
    }

    async getAllAddresses(userId:string){
        try{
            const findUser = await this.prisma.address.findMany({
                where:{
                    userId: userId
                },
            });
            const addresses = findUser.map(address => address).filter(address => address !== null);
            return addresses
        }
        catch(error){
            this.prisma.handlePrismaError("Getting All Adresses", error);
        }
    }

    //Verifys the user adresses to see if he can enter a community 
    async VefifyAdressses(userId: string, minPostalCode: string, maxPostalCode: string){

        const addresses = await this.getAllAddresses(userId)
        if(!addresses)
            throw new HttpException("User does not contain addresses", HttpStatus.BAD_REQUEST)
       
        // Clean and parse the min/max postal codes: remove any non-digit characters
        const minCode = parseInt(minPostalCode.replace(/[^0-9]/g, ""), 10);
        const maxCode = parseInt(maxPostalCode.replace(/[^0-9]/g, ""), 10);

        if (isNaN(minCode) || isNaN(maxCode)) {
            throw new HttpException("Invalid postal codes provided", HttpStatus.BAD_REQUEST);
        }

        // Helper function to parse a postal code into prefix and suffix.
        const parsePostalCode = (code: string) => {
            const parts = code.split('-').map(part => part.trim());
            const prefix = parseInt(parts[0], 10);
            const suffix = parts[1] ? parseInt(parts[1], 10) : 0;
            return { prefix, suffix };
        };

        // Parse the min and max postal codes.
        const { prefix: minPrefix, suffix: minSuffix } = parsePostalCode(minPostalCode);
        const { prefix: maxPrefix, suffix: maxSuffix } = parsePostalCode(maxPostalCode);

        // Validate that both the min and max postal codes were parsed correctly.
        if (isNaN(minPrefix) || isNaN(minSuffix) || isNaN(maxPrefix) || isNaN(maxSuffix)) {
            throw new HttpException("Invalid postal code range", HttpStatus.BAD_REQUEST);
        }

        // Filter addresses that fall within the specified range.
        const validAddresses = addresses.filter(address => {
            if (!address.postalCode) return false;

            const { prefix: addrPrefix, suffix: addrSuffix } = parsePostalCode(address.postalCode);
            if (isNaN(addrPrefix) || isNaN(addrSuffix)) return false;

            // Check if address is within the lower bound.
            const isAboveMin = addrPrefix > minPrefix || (addrPrefix === minPrefix && addrSuffix >= minSuffix);
            // Check if address is within the upper bound.
            const isBelowMax = addrPrefix < maxPrefix || (addrPrefix === maxPrefix && addrSuffix <= maxSuffix);
            return isAboveMin && isBelowMax;
        });

        return validAddresses;
    }

    async deleteAddress(id: number, userId: string) {
        try {
            const address = await this.prisma.address.findFirst({
                where: { id, userId }
            });
            if (!address) {
                throw new HttpException("Address not found or not owned by user", HttpStatus.NOT_FOUND);
            }

            await this.prisma.address.delete({ where: { id } });
        } catch (error) {
            this.prisma.handlePrismaError("Delete Address", error);
        }
    }

    async updateAddress(id: number, dto: UpdateAddressDto, userId: string) {
        try {
            const address = await this.prisma.address.findFirst({
                where: { id, userId }
            });
            if (!address) {
                throw new HttpException("Address not found or not owned by user", HttpStatus.NOT_FOUND);
            }

            return await this.prisma.address.update({
                where: { id },
                data: {
                    port: dto.port,
                    street: dto.street,
                    postalCode: dto.postalCode
                }
            });
        } catch (error) {
            this.prisma.handlePrismaError("Update Address", error);
        }
    }
}