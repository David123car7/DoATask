import { Body, Controller, Post, Get, UseGuards, Req, Res, Delete, Put, Param } from "@nestjs/common";
import { AddressService } from "./addresses.service";
import { CreateAddressDto } from "./dto/addresses.dto";
import { JwtAuthGuard } from "../auth/guard/jwt.auth.guard";
import { RequestWithUser } from "../auth/types/jwt-payload.type";
import { Response } from 'express';
import {UpdateAddressDto} from "./dto/update.address.dto"


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

    @Delete(":id")
    @UseGuards(JwtAuthGuard)
    async deleteAddress(
        @Param('id') id: number,
        @Req() req: RequestWithUser,
        @Res() res: Response
    ) {
        await this.addressesService.deleteAddress(id, req.user.sub);
        return res.json({ message: "Address deleted successfully" });
    }

    @Put(":id")
    @UseGuards(JwtAuthGuard)
    async updateAddress(
        @Param('id') id: number,
        @Body() dto: UpdateAddressDto,
        @Req() req: RequestWithUser,
        @Res() res: Response
    ) {
        const updatedAddress = await this.addressesService.updateAddress(id, dto, req.user.sub);
        return res.json({ message: "Address updated", address: updatedAddress });
    }
}