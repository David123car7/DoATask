import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import { Transform } from "class-transformer";

export class CreateItemDto{

    @IsNotEmpty()
    @IsString()
    name: string

    @IsInt()
    @Transform(({ value}) => parseInt(value, 10))
    price: number

    @IsInt()
    @Transform(({ value}) => parseInt(value, 10))
    stock: number
}
