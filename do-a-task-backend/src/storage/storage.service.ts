import { Injectable } from '@nestjs/common';
import {SupabaseService} from "../supabase/supabase.service"
import { PrismaService } from '../prisma/prisma.service';
import e from 'express';

@Injectable()
export class StorageService {
    constructor(private readonly supabaseService: SupabaseService, private prisma: PrismaService) {}

    async uploadImages(bucketName: string, userId: string, folderName: string, files: Express.Multer.File[]){
        const data = await Promise.all(
            files.map((file) =>
            this.supabaseService.getAdminClient().storage.from(bucketName).upload(`${userId}/${folderName}/${file.originalname}`, file.buffer, { contentType: file.mimetype})         
            ),
        );

        const errors = data.filter(r => r.error);
        if (errors.length > 0) {
            this.supabaseService.handleSupabaseError(errors[0], "Upload Image")
        }
        return data
    }

    async uploadImage(bucketName: string, userId: string, folderName: string, file: Express.Multer.File){
        const {data, error} = await this.supabaseService.getAdminClient().storage.from(bucketName).upload(`${userId}/${folderName}/${file.originalname}`, file.buffer, { contentType: file.mimetype})         
        if (error) {
            this.supabaseService.handleSupabaseError(error, "Upload Image")
        }
    }

    async deleteImage(bucketName: string, userId: string, folderName: string){
        const {data: filesList, error: getDataError} = await this.supabaseService.getAdminClient().storage.from(bucketName).list(`${userId}/${folderName}`);
        if(getDataError){
            this.supabaseService.handleSupabaseError(getDataError, "Delete Image")
        }

        const filePaths = filesList.map(file => `${userId}/${folderName}/${file.name}`);

        const {data: deleteImageData, error: deleteImageError} = await this.supabaseService.getAdminClient().storage.from(bucketName).remove(filePaths);
        if(deleteImageError){
            this.supabaseService.handleSupabaseError(deleteImageError, "Delete Image")
        }

        return deleteImageData
    }

    async createBucket(bucketName:  string){
        const {data, error} = await this.supabaseService.getAdminClient().storage.createBucket(bucketName)
        if(error){
            this.supabaseService.handleSupabaseError(error, "Upload Image")
        }
        return data
    }
}