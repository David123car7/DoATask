import { SupabaseService } from "../supabase/supabase.service";
import { PrismaService } from "../prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { CreateAddressDto } from "./dto/addresses.dto";
import { error } from "console";
import { HttpException, HttpStatus } from "@nestjs/common";


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

    async getAllAddresses(userId:string){
        try{
            const findUser = await this.prisma.member.findMany({
                where:{
                    userId: userId
                },
                include:{
                    address: true,
                }
            });
            const addresses = findUser.map(member => member.address).filter(address => address !== null);
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

        const parsePostalCode = (code: string) => {
            const parts = code.split('-').map(part => part.trim());
            // Convert prefix. If parsing fails, it becomes NaN.
            const prefix = parseInt(parts[0], 10);
            // If suffix is missing, set it to zero. Otherwise, parse it.
            const suffix = parts[1] ? parseInt(parts[1], 10) : 0;
            return { prefix, suffix };
        };
        
            // Parse the min and max postal codes from the inputs.
            const { prefix: minPrefix, suffix: minSuffix } = parsePostalCode(minPostalCode);
            const { prefix: maxPrefix, suffix: maxSuffix } = parsePostalCode(maxPostalCode);
        
            // Validate that we got numbers.
            if (isNaN(minPrefix) || isNaN(minSuffix) || isNaN(maxPrefix) || isNaN(maxSuffix)) {
                throw new HttpException("Invalid postal code range", HttpStatus.BAD_REQUEST);
            }
        
            // Check if at least one address falls within the specified range.
            const hasValidAddress = addresses.some(address => {
            if (!address.postalCode) return false;
        
            const { prefix: addrPrefix, suffix: addrSuffix } = parsePostalCode(address.postalCode);
            if (isNaN(addrPrefix) || isNaN(addrSuffix)) return false;
        
            // Compare prefixes first.
            const isAboveMin = addrPrefix > minPrefix || (addrPrefix === minPrefix && addrSuffix >= minSuffix);
            const isBelowMax = addrPrefix < maxPrefix || (addrPrefix === maxPrefix && addrSuffix <= maxSuffix);
            return isAboveMin && isBelowMax;
        });

        if (!hasValidAddress) {
            return false
        }
        else
            return true
    }
}