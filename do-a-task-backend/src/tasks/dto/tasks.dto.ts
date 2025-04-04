import { Value } from "@prisma/client/runtime/library";
import { IsArray, IsDate, IsDateString, IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";
import internal from "stream";

export class CreateTasksDto{

    @IsString()
    @IsNotEmpty()
    tittle: string

    /*@IsString()
    @IsNotEmpty()
    description: string*/

    
    /*@IsString()
    @IsNotEmpty()
    name: string

    @IsEmail()
    @IsNotEmpty()
    email: string*/

    /*@IsString()
    @IsNotEmpty()
    contactNumber: string*/

    @IsString()
    @IsNotEmpty()
    difficulty: string

    @IsString()
    @IsNotEmpty()
    coins: string

    @IsString()
    @IsNotEmpty()
    points: string
}

export class EndingTasksDto{

    @IsString()
    @IsNotEmpty()
    status: string

    @IsNumber()
    @IsNotEmpty()
    score: number
}
