import { IsDate, IsDateString, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ChangeUserDataDto{
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsDateString()
    @IsNotEmpty()
    birthDate: string;

    @IsString()
    @IsNotEmpty()
    number: string
}

