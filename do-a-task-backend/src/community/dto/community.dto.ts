import { IsInt, IsNotEmpty, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class CreateCommunityDto{

    @IsNotEmpty()
    @IsString()
    name: string
}
