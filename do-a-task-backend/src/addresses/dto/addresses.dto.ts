import { IsInt, IsNotEmpty, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class CreateAddressDto{

    @IsInt()
    @Transform(({ value}) => parseInt(value, 10))
    port: number

    @IsNotEmpty()
    @IsString()
    street: string
}