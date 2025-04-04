import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { SupabaseService } from "src/supabase/supabase.service";
import { CreateTasksDto } from "./dto/tasks.dto";
import { EndingTasksDto } from "./dto/tasks.dto";
import { empty } from "@prisma/client/runtime/library";

@Injectable({})
export class TasksService{
    constructor(private readonly supabaseService: SupabaseService, private prisma: PrismaService) {}


    async createTask(dto : CreateTasksDto){
        
        console.log("Kazzio");
        const user = (await this.supabaseService.supabase.auth.getUser()).data;
        const id = parseInt(user.user.id); 
        const task = await this.prisma.task.create({
            data: {
                title: dto.tittle,
                difficulty: dto.difficulty,
                coins: dto.coins,
                points : dto.points,
                creatorId: id,    
            },
        });
    }


//  FAlTA  TESTAR !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    async createMemberTask(dto :EndingTasksDto, taskId: number ){
        
        console.log("Kazzio");
        const user = (await this.supabaseService.supabase.auth.getUser()).data;
        const id = parseInt(user.user.id); // <------ É o Id do USER OK!!!!!
        const idTask = taskId;// <--- É o Id da TASK OK!!!!!
        const task = await this.prisma.memberTask.create({
            data: {
                //id: taskID
                status: dto.status,
                assignedAt: new Date(),
                completedAt: new Date(1900,1,1,12,12,12,12),
                score: 0,
                volunteerId: id,
                taskId: idTask,
            },
        });
    }

    //  FAlTA  TESTAR  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    async endingTask(dto : EndingTasksDto/*, taskId: number*/){
        const user = (await this.supabaseService.supabase.auth.getUser()).data;
        //const id = taskId;
        const task = await this.prisma.memberTask.update({
            where: {
                id: 4,       
            },
            data: {
                status: dto.status,
                completedAt: new Date(), // Marking the task as completed
                score: dto.score,
            },
        });
    }

}