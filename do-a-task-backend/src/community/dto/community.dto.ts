import { IsInt, IsNotEmpty, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class CreateCommunityDto{

    @IsNotEmpty()
    @IsString()
    communityName: string

    @IsNotEmpty()
    @IsString()
    location: string
}

export class EnterCommunityDto{

    @IsNotEmpty()
    @IsString()
    communityName: string
}
