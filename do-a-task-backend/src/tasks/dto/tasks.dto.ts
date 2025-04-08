import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator";


export class CreateTasksDto{

    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    difficulty: 'easy' | 'medium' | 'hard'
}

export class EvaluateTaskDto{

    @IsInt()
    @Min(1)
    @Max(5)
    @Transform(({ value}) => parseInt(value, 10))
    score: number;
}
