import { Controller, HttpException, HttpStatus, Post, UploadedFiles, UseGuards, UseInterceptors, Res, Body, Req, Delete} from '@nestjs/common';
import { StorageService } from './storage.service';
import { BUCKETS } from '../lib/constants/storage/buckets';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { Response } from "express";
import { FilesInterceptor } from '@nestjs/platform-express';
import { RequestWithUser } from '../auth/types/jwt-payload.type';
import {UploadDeleteFile} from './dto/file.dto'

@Controller("storage")
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post("uploadImage")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor("image"))
  async uploadImage(@Body() dto: UploadDeleteFile, @UploadedFiles() files: Express.Multer.File[],@Req() req: RequestWithUser, @Res() res: Response){
    console.log(dto.folderName)
    files.map((file) => {
        if (!file) {
          throw new HttpException(`File invalid: ${file.originalname}`, HttpStatus.BAD_REQUEST);
        }
    });

    const data = await this.storageService.uploadImage(BUCKETS.TASK_IMAGES, req.user.sub, dto.folderName, files)
    return res.json({message: "Image uploaded"})
  }

  @Delete("deleteImage")
  @UseGuards(JwtAuthGuard)
  async deleteImage(@Body() dto: UploadDeleteFile ,@Req() req: RequestWithUser, @Res() res: Response){
    const data = await this.storageService.deleteImage(BUCKETS.TASK_IMAGES, req.user.sub, dto.folderName)
    return res.json({message: "Image Deleted"})
  }

  @Post("createBucket")
  @UseGuards(JwtAuthGuard)
  private async createBucket(@Body("bucketName") bucketName: string, @Res() res: Response){
    const data = await this.storageService.createBucket(bucketName)
    return res.json({message: "Bucket Created", data: data})
  }
}