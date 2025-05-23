import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MIN,
  Min,
} from 'class-validator';

export class CreateTasksDto {
  @IsString()
  @IsNotEmpty()
  tittle: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  difficulty: '1' | '2' | '3';

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  communityName: string;
}

export class AssignTaskDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  communityId: number;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  taskId: number;
}

export class EvaluateTaskDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  memberTaskId: number;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  @Min(0)
  @Max(5)
  score: number;
}

export class GetTasksCommunity {
  @IsString()
  @IsNotEmpty()
  communityName: string;
}

export class UpdateTaskDto {
  @IsString()
  tittle?: string;

  @IsString()
  description?: string;

  @IsString()
  location?: string;

  @IsNumber()
  coins?: number;

  @IsNumber()
  points?: number;

  @IsString()
  difficulty?: string;
}
