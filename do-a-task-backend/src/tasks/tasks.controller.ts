import { Controller, Post, Body, Put, HttpCode,HttpStatus, Req, UseGuards, Res, UseInterceptors, UploadedFiles} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTasksDto,EvaluateTaskDto} from './dto/tasks.dto';
import { RequestWithUser } from 'src/auth/types/jwt-payload.type';
import { stat } from 'fs';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { StorageService } from 'src/storage/storage.service';
import { BUCKETS } from 'src/lib/constants/storage/buckets';


@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService, private storageService: StorageService) {}

    @Post("createTask")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor("images"))
    async createTask(@Body() dto: CreateTasksDto, @UploadedFiles() files: Express.Multer.File[] ,@Req() req: RequestWithUser, @Res() res: Response) {
      const task = await this.tasksService.createTask(dto, req.user.sub);
      const upload = await this.storageService.uploadImage(BUCKETS.TASK_IMAGES, req.user.sub, dto.tittle, files)
      return res.json({ message: 'Task was created'});
    }

    @Put("endingtaskvolunteer")
    async endingTask(/*taskID: number*/){
        const task = await this.tasksService.endingTaskVolunteer();
        return {
            status: 'success',
            task,
        };
    }

    @Post("createMemberTask")
    async createMemberTask(/*, taskID: number*/){
        const task = await this.tasksService.createMemberTask(/*, taskID*/);
        return {
            status: 'success',
            task,
        };
    }

    @Put("evaluateTask")
    async evaluateTask(@Body() dto: EvaluateTaskDto/*, taskId: number*/) {
        const task = await this.tasksService.evaluateTask(dto);
        return {
            status: 'success',
            task,
        };
    }

    @Post("assignBonus")
    async assignBonus(volunteerId: number,evaluation: number,memberTaskId:number){
        const task = await this.tasksService.assignBonus(volunteerId,evaluation,memberTaskId);
        return{ 
            status : 'success',
            task,
        };
    }

    


}
