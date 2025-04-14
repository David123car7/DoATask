import { IsNotEmpty, IsString } from "class-validator";

export class UploadDeleteFile{
    @IsString()
    @IsNotEmpty()
    folderName: string
}