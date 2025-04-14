import { Body, Controller, Post } from "@nestjs/common";
import { AddressService } from "./addresses.service";
import { CreateAddressDto } from "./dto/addresses.dto";

@Controller("addresses")
export class AddressesController {
    constructor(private addressesService: AddressService) {}

    @Post("createAddress")
    async createAdrress(@Body() dto: CreateAddressDto){

        const createAdrress = await this.addressesService.createAddress(dto);

        return createAdrress;
    }

}