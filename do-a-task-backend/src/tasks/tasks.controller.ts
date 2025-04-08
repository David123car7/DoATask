import { Controller, Post, Body, Put } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTasksDto,EvaluateTaskDto} from './dto/tasks.dto';




@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Post("createtask")
    @HttpCode(HttpStatus.CREATED)  // Garantir que o status 201 seja retornado
    async createTask(@Body() dto: CreateTasksDto) {
      // Criação da tarefa usando o serviço
      const task = await this.tasksService.createTask(dto);
      
      // Retorna o status e os dados da tarefa criada
      return {
        status: 'success',  // Corrigido o typo para "success"
        task,               // Tarefa criada
      };
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
