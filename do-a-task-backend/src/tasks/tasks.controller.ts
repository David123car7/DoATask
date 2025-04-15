import { Controller, Post, Body, Query,  Put, HttpCode,HttpStatus, Req, UseGuards, Res, UseInterceptors, UploadedFiles, Get} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTasksDto,EvaluateTaskDto, AssignTaskDto} from './dto/tasks.dto';
import { RequestWithUser } from 'src/auth/types/jwt-payload.type';
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

    @Post("assignTask")
    @UseGuards(JwtAuthGuard)
    async assignTask(@Body() dto: AssignTaskDto,@Req() req: RequestWithUser, @Res() res: Response) {
      await this.tasksService.assignTask(req.user.sub, dto);
      return res.json({ message: 'Task was assigned'});
    }

    @Put("endingtaskvolunteer")
    async endingTask(/*taskID: number*/){
        const task = await this.tasksService.endingTaskVolunteer();
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

    
    @Get("tasksDone")
    async tasksDone(@Req()req: RequestWithUser, @Res()res: Response){
        const data = await this.tasksService.getDoneTasks(req.user.sub)
        return res.json({message: "Task Found", task: data})
    }

    @Get('tasksDoneCommunity')
    @UseGuards(JwtAuthGuard)
    async tasksDoneCommunity(
      @Query('communityName') communityName: string,  // Recebendo o parâmetro via query string
      @Req() req,
    ) {
      console.log('Received communityName in backend:', communityName);  // Verifique o valor do communityName
  
      if (!communityName) {
        console.log('Error: communityName is missing');
        throw new Error('Community name is required');
      }
  
      const userId = req.user.sub;
      const tasks = await this.tasksService.getTaskByCommunity(userId, communityName);
      return { message: 'Task Found', task: tasks};
    }

    @Get('tasksVolunteerCommunity')
    @UseGuards(JwtAuthGuard)
    async tasksVolunteerCommunity(
      @Query('communityName') communityName: string,  // Recebendo o parâmetro via query string
      @Req() req,
    ) {
      console.log('Received communityName in backend:', communityName);  // Verifique o valor do communityName
  
      if (!communityName) {
        console.log('Error: communityName is missing');
        throw new Error('Community name is required');
      }
  
      const userId = req.user.sub;
      const tasks = await this.tasksService.GetVolunteerTasks(userId, communityName);
      return { message: 'Task Found', task: tasks};
    }


}
