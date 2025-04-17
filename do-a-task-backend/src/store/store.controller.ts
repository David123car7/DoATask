import { Controller, Post, Body, Req, Res, UseGuards, UseInterceptors, Query, Put, HttpException, HttpStatus, Get} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { StoreService } from './store.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { CreateItemDto } from './dto/store.dto';
import { UploadedFile } from '@nestjs/common';
import { RequestWithUser } from 'src/auth/types/jwt-payload.type';
import { Response } from 'express';
import { StorageService } from 'src/storage/storage.service';
import { ParseIntPipe } from '@nestjs/common';
import { BUCKETS } from 'src/lib/constants/storage/buckets';

@Controller('store')
export class StoreController {
    constructor(private storeService: StoreService, private storageService: StorageService) {}

    @Post("createItem")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor("image"))
    async createItem(@Body() dto: CreateItemDto, @UploadedFile() file: Express.Multer.File ,@Req() req: RequestWithUser, @Res() res: Response){
        await this.storeService.createItem(req.user.sub, dto.name, dto.price, dto.stock)
        await this.storageService.uploadImage(BUCKETS.ITEM_IMAGES, req.user.sub, dto.name, file)
        return res.json({ message: 'Item was created'});
    }

    @Put("hideItem")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor("image"))
    async hideItem(@Query('itemId', ParseIntPipe) itemId: number, @UploadedFile() files: Express.Multer.File ,@Req() req: RequestWithUser, @Res() res: Response){
        await this.storeService.hideItem(req.user.sub, itemId)
        return res.json({ message: 'Item was Hided'});
    }

    @Put("buyItem")
    @UseGuards(JwtAuthGuard)
    async buyItem(@Query('itemId', ParseIntPipe) itemId: number, @Query('communityName') communityName: string,@UploadedFile() files: Express.Multer.File ,@Req() req: RequestWithUser, @Res() res: Response){
        if(!communityName)
            throw new HttpException("communityName invalid", HttpStatus.BAD_REQUEST)

        if(!itemId)
            throw new HttpException("itemId invalid", HttpStatus.BAD_REQUEST)

        await this.storeService.buyItem(req.user.sub, communityName, itemId)
        return res.json({ message: 'Item was bought'});
    }

    @Put("showItem")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor("image"))
    async showItem(@Query('itemId', ParseIntPipe) itemId: number, @UploadedFile() files: Express.Multer.File ,@Req() req: RequestWithUser, @Res() res: Response){
        await this.storeService.showItem(req.user.sub, itemId)
        return res.json({ message: 'Item was Showed'});
    }

    @Get("getMemberPurchases")
    @UseGuards(JwtAuthGuard)
    async getMemberPurchases(@Query('communityName') communityName: string,@Req() req: RequestWithUser, @Res() res: Response){
        const data = await this.storeService.getMemberPurchases(req.user.sub, communityName)
        return res.json(data);
    }

    @Get("getCommunityItems")
    @UseGuards(JwtAuthGuard)
    async getCommunityItems(@Query('communityName') communityName: string,@Req() req: RequestWithUser, @Res() res: Response){
        const data = await this.storeService.getCommunityItems(req.user.sub, communityName)
        return res.json(data);
    }
}