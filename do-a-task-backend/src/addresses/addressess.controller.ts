import { Body, Controller, Post, Get, UseGuards, Req, Res } from "@nestjs/common";
import { AddressService } from "./addresses.service";
import { CreateAddressDto } from "./dto/addresses.dto";
import { JwtAuthGuard } from "src/auth/guard/jwt.auth.guard";
import { RequestWithUser } from "src/auth/types/jwt-payload.type";
import { Response } from 'express';

@Controller("addresses")
export class AddressesController {
    constructor(private addressesService: AddressService) {}

    @Post("createAddress")
    async createAdrress(@Body() dto: CreateAddressDto){

        const createAdrress = await this.addressesService.createAddress(dto);

        return createAdrress;
    }

    @Get("getAllAddresses")
    @UseGuards(JwtAuthGuard)
    async getAllAddresses(@Req()req: RequestWithUser, @Res()res: Response){
        const data = await this.addressesService.getAllAddresses(req.user.sub)
        return res.json({message: "Address Found", address: data})
    }

}