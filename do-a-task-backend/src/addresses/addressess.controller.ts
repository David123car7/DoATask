import { Body, Controller, Post, Get, UseGuards, Req, Res } from "@nestjs/common";
import { AddressService } from "./addresses.service";
import { CreateAddressDto } from "./dto/addresses.dto";
import { JwtAuthGuard } from "src/auth/guard/jwt.auth.guard";
import { RequestWithUser } from "src/auth/types/jwt-payload.type";
import { Response } from 'express';

@Controller("addresses")
export class AddressesController {
    constructor(private addressesService: AddressService) {}


    @Post("createAdressses")
    @UseGuards(JwtAuthGuard)
    async CreateAdressses(@Body() dto: CreateAddressDto, @Res() res: Response, @Req() req: RequestWithUser){
        const data = await this.addressesService.createAddress(dto, req.user.sub)
        return res.json({message: "Address Created", address: data})
    }

    @Get("getAllAddresses")
    @UseGuards(JwtAuthGuard)
    async getAllAddresses(@Req()req: RequestWithUser, @Res()res: Response){
        const data = await this.addressesService.getAllAddresses(req.user.sub)
        return res.json({message: "Address Found", address: data})
    }

    @Post("vefifyAdressses")
    @UseGuards(JwtAuthGuard)
    async VefifyAdressses(@Body() body: { minPostalCode: string; maxPostalCode: string }, @Res() res: Response, @Req() req: RequestWithUser){
        const data = await this.addressesService.VefifyAdressses(req.user.sub,body.minPostalCode, body.maxPostalCode)
        return res.json({message: "Address Verified", address: data})
    }
}