import { IsInt, IsNotEmpty, IsString,Matches } from "class-validator";
import { Transform } from "class-transformer";

export class CreateAddressDto{

    @IsInt()
    @Transform(({ value}) => parseInt(value, 10))
    port: number

    @IsNotEmpty()
    @IsString()
    street: string

    @IsNotEmpty()
    @IsString()
    locality: string

    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.toString())
    postalCode: string

}