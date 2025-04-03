import { Controller, Post, Body, Put } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTasksDto, EndingTasksDto } from './dto/tasks.dto';



@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Post("createtask")
    async createTask(@Body() dto: CreateTasksDto){
        return await this.tasksService.createTask(dto);
    }

    @Put("endingtask")
    async endingTask(@Body() dto: EndingTasksDto){
        return await this.tasksService.endingTask(dto);
    }

    @Post("createMemberTask")
    async createMemberTask(@Body() dto: EndingTasksDto, taskID: number){
        return await this.tasksService.createMemberTask(dto, taskID);
    }

}
