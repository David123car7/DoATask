import { Controller, Post, Body, Query,  Put, HttpCode,HttpStatus, Req, UseGuards, Res, UseInterceptors, UploadedFile, Get, HttpException, Delete} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTasksDto,EvaluateTaskDto, AssignTaskDto} from './dto/tasks.dto';
import { RequestWithUser } from '../auth/types/jwt-payload.type';
import { JwtAuthGuard } from '../auth/guard/jwt.auth.guard';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from '../storage/storage.service';
import { BUCKETS } from '../lib/constants/storage/buckets';
import { ParseIntPipe } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService, private storageService: StorageService) {}

    @Get('getTasksMemberDoing')
    @UseGuards(JwtAuthGuard)
    async GetTasksMemberDoing(@Req() req: RequestWithUser, @Res() res: Response) {
      const tasks = await this.tasksService.GetTasksMemberDoing(req.user.sub);
      return res.json({ message: 'Task Found', tasks: tasks.tasks, memberTasks: tasks.memberTasks, community: tasks.community})
    }

    @Get('getTasksMemberCreated')
    @UseGuards(JwtAuthGuard)
    async GetTasksMemberCreated(@Req() req: RequestWithUser, @Res() res: Response) {
      const data = await this.tasksService.GetTasksMemberCreated(req.user.sub);
      return res.json({ message: 'Tasks Found', tasks: data.tasks, memberTasks: data.memberTasks, community: data.community});
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

    @Post("createTask")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor("image"))
    async createTask(@Body() dto: CreateTasksDto, @UploadedFile() file: Express.Multer.File ,@Req() req: RequestWithUser, @Res() res: Response) {
      const task = await this.tasksService.createTask(dto, req.user.sub, file.originalname);
      const upload = await this.storageService.uploadImage(BUCKETS.TASK_IMAGES, req.user.sub, dto.tittle, file)
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

    @Delete("deleteTask")
    @UseGuards(JwtAuthGuard)
    async deleteTask(@Query('taskId', ParseIntPipe) taskId: number, @Req() req: RequestWithUser, @Res() res: Response){
      await this.tasksService.DeleteTask(taskId)
      return res.json({ message: 'Task was deleted'});
    }

    @Put("cancelTask")
    @UseGuards(JwtAuthGuard)
    async cancelTask(@Query('taskId', ParseIntPipe) taskId: number, @Req() req: RequestWithUser, @Res() res: Response){
      await this.tasksService.CancelTask(taskId)
      return res.json({ message: 'Task was canceled'});
    }


    @Put("evaluateTask")
    async evaluateTask(@Body() dto: EvaluateTaskDto, @Res() res: Response) {
      console.log("Score", dto.score)
      console.log("Id", dto.memberTaskId)
        await this.tasksService.evaluateTask(dto.memberTaskId, dto.score);
        await this.tasksService.assignBonus(dto.memberTaskId, dto.score)
        return res.json({ message: 'Task was evaluated'});
    }
}
