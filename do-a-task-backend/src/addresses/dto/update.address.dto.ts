import { IsString, IsNumber, IsOptional } from "class-validator";

export class UpdateAddressDto {
    @IsNumber()
    @IsOptional()
    port?: number;

    @IsString()
    @IsOptional()
    street?: string;

    @IsString()
    @IsOptional()
    postalCode?: string;
}