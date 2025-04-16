import { Controller, Post, Body, Query,  Put, HttpCode,HttpStatus, Req, UseGuards, Res, UseInterceptors, UploadedFiles, Get, HttpException} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTasksDto,EvaluateTaskDto, AssignTaskDto} from './dto/tasks.dto';
import { RequestWithUser } from 'src/auth/types/jwt-payload.type';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { StorageService } from 'src/storage/storage.service';
import { BUCKETS } from 'src/lib/constants/storage/buckets';
import { ParseIntPipe } from '@nestjs/common';



@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService, private storageService: StorageService) {}

    @Get('getTasksMemberDoing')
    @UseGuards(JwtAuthGuard)
    async GetTasksMemberDoing(@Query('communityName') communityName: string,@Req() req: RequestWithUser, @Res() res: Response) {
      if (!communityName) {
        throw new HttpException("Community name is required", HttpStatus.BAD_REQUEST)
      }
      const tasks = await this.tasksService.GetTasksMemberDoing(req.user.sub, communityName);
      return res.json({ message: 'Task Found', tasks: tasks.tasks, memberTasks: tasks.memberTasks})
    }

    @Get('getTasksMemberCreated')
    @UseGuards(JwtAuthGuard)
    async GetTasksMemberCreated(@Req() req: RequestWithUser, @Res() res: Response) {
      const data = await this.tasksService.GetTasksMemberCreated(req.user.sub);
      return res.json({ message: 'Tasks Found', tasks: data.tasks, memberTasks: data.memberTasks, community: data.community});
    }

    @Post("createTask")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor("images"))
    async createTask(@Body() dto: CreateTasksDto, @UploadedFiles() files: Express.Multer.File[] ,@Req() req: RequestWithUser, @Res() res: Response) {
      const task = await this.tasksService.createTask(dto, req.user.sub);
      const upload = await this.storageService.uploadImage(BUCKETS.TASK_IMAGES, req.user.sub, dto.tittle, files)
      return res.json({ message: 'Task was created'});
    }

    @Put("assignTask")
    @UseGuards(JwtAuthGuard)
    async assignTask(@Query('taskId', ParseIntPipe) taskId: number, @Req() req: RequestWithUser, @Res() res: Response) {
      await this.tasksService.assignTask(req.user.sub, taskId);
      return res.json({ message: 'Task was assigned'});
    }

    @Put("finishTask")
    @UseGuards(JwtAuthGuard)
    async finishTask(@Query('memberTaskId', ParseIntPipe) memberTaskId: number, @Req() req: RequestWithUser, @Res() res: Response){
      await this.tasksService.finishTask(memberTaskId)
      return res.json({ message: 'Task was finished'});
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

    @Get('getTasksByCommunity')
    async GetTasksMemberCommunity(@Query('communityName') communityName: string,@Req() req,@Res() res: Response) {
      console.log('Received communityName in backend:', communityName); 
      if (!communityName) {
        throw new HttpException("Community name is required", HttpStatus.BAD_REQUEST)
      }
      const tasks = await this.tasksService.getTaskBeDoneCommunity(communityName);
      return res.json({ message: 'Task Found', tasks: tasks.tasks, memberTasks: tasks.memberTasks});
    }
}
