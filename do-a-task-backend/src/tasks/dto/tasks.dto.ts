
import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";


export class CreateTasksDto{

    @IsString()
    @IsNotEmpty()
    tittle: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsString()
    difficulty: "1" | "2" | "3"

    @IsString()
    @IsNotEmpty()
    location: string

    @IsString()
    @IsNotEmpty()
    parish: string
}

export class EvaluateTaskDto{

    @IsInt()
    @Min(1)
    @Max(5)
    @Transform(({ value}) => parseInt(value, 10))
    score: number;
}

export class GetTasksCommunity{

    @IsString()
    @IsNotEmpty()
    communityName: string
}