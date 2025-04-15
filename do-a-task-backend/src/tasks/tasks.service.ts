import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { SupabaseService } from "src/supabase/supabase.service";
import { CreateTasksDto } from "./dto/tasks.dto";
import { baseReward } from "src/lib/constants/tasks/tasks.constants";
import { EvaluateTaskDto } from "./dto/tasks.dto";
import { find } from "rxjs";

@Injectable({})
export class TasksService{
    constructor(private readonly supabaseService: SupabaseService, private prisma: PrismaService) {}

    async createTask(dto: CreateTasksDto, userId: string) {
        const reward = baseReward[dto.difficulty]
        const memberId = (await this.getMemberByParish(userId,dto.parish)).id
        console.log("MemberID", memberId)
        let task
        try{
            task = await this.prisma.task.create({
                data: {
                    title: dto.tittle,
                    difficulty: parseInt(dto.difficulty),
                    location: dto.location,
                    coins: 1,
                    points: 2,
                    creatorId: memberId,  // Usar o id do usuário autenticado
                },
                include: {
                    creator: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    contact: true,
                                },
                            },
                        },
                    },
                },
            });
        }
        catch(error){
            this.prisma.handlePrismaError("Creating Task" ,error)
        }
    
        return { message: "Created task with sucess", taskData: task}
    }

    async getMemberByParish(userId: string, parish: string){
        try{
            const community = await this.prisma.community.findFirst({
                where:{
                    communityName: parish
                }
            })

            const member = await this.prisma.member.findFirst({
                where:{
                    communityId: community.id
                }
            })
            return member
        }
        catch(error){
            this.prisma.handlePrismaError("Getting Member" ,error)
        }
    }

    //  FAlTA  TESTAR !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    async createMemberTask(/*, taskId: number*/ ){ 
        
        //const user = (await this.supabaseService.supabase.auth.getUser()).data;////troca por getTask
        //const id = parseInt(user.user.id); // <------ É o Id do USER OK!!!!!
        //const idTask = taskId;// <--- É o Id da TASK OK!!!!!
        let task
        try{
            task = await this.prisma.memberTask.create({
                data: {
                    status: 'pending',
                    assignedAt: new Date(),
                    completedAt: new Date(1900,1,1,12,12,12,12),
                    score: 0,
                    volunteerId: 6,
                    taskId: 27,
                },
            });
        }
        catch(error){
            this.prisma.handlePrismaError("Creating MemberTask", error)
        }

        return { message: "Created member task with sucess", memberTaskData: task}
    }

    async endingTaskVolunteer(/*, memberTaskId: number*/){
        try{
            const result = await this.prisma.$transaction(async (prisma) => {
                const memberTask = await this.prisma.memberTask.update({
                    where: {
                        id: 7,     
                    },
                    data: {
                        status: 'completed',
                        completedAt: new Date(), // Marking the task as completed
                    },
                    include: {
                        task: {
                            include: {
                                creator: {
                                    include: {
                                        user: {
                                            select: {
                                                email: true,
                                                id: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
            
                await this.prisma.notification.create({
                    data:{
                        title: 'Tarefa Concluída - Avaliação Necessária',
                        message: `Olá, a tarefa ${memberTask.task.title} que você criou foi concluída por um voluntário. Por favor, avalie o desempenho do voluntário.`,
                        recipientId: memberTask.task.creator.user.id,
                    }
                });
            });
        }
        catch(error){
            this.prisma.handlePrismaError("Ending Task Volunteer" , error);
        }

        return {message: 'Task updated successfully'};
    }

    async evaluateTask(/*memberTaskId: number,*/ dto:EvaluateTaskDto) {
        let memberTask
        try{
            memberTask = await this.prisma.memberTask.findUnique({
                where: {
                    id: 7,
                },
            });
        }
        catch(error){
            this.prisma.handlePrismaError("Evaluate Task (Find MemberTask)" , error);
        }

        let updatedMemberTask
        try{
            updatedMemberTask = await this.prisma.memberTask.update({
                where: {
                    id: 7,
                },
                data: {
                    score: dto.score,
                },
            });
        }
        catch(error){
            this.prisma.handlePrismaError("Evaluate Task (Update MemberTask)" , error);
        }

        return {message: 'Task evaluated successfully'};
    }



    async assignBonus(volunteerId: number, evaluation: number, memberTaskId: number) {
        
        let volunteerTask
        try{
            volunteerTask = await this.prisma.memberTask.findUnique({
                where: {
                    id: 7,
                },
                include: {
                    task: true,
                },
            });
        }
        catch(error){
            this.prisma.handlePrismaError("Assign Bonus (Find Volunteer Task)" , error);
        }

        const reward = baseReward[volunteerTask.task.difficulty];
        const { totalCoins, totalPoints } = this.calculateReward(volunteerTask.task.difficulty, 5);
        
        try{
            const result = await this.prisma.$transaction(async (prisma) => {
                let pointsMember = await this.prisma.pointsMember.findFirst({
                    where: {
                        memberId: 6,
                    },
                });

                const updatedCoins = await this.prisma.member.update({
                    where: {
                        id: 6,
                    },
                    data: {
                        user: {
                            update: {
                                totalCoins: {
                                    increment: totalCoins,
                                },
                            },
                        },
                    },
                });

                if (!pointsMember) {
                    pointsMember = await this.prisma.pointsMember.create({
                        data: {
                            memberId: 6,
                            points: totalPoints,
                        },
                    });
                } else {
                    // Se houver, atualiza os pontos
                    pointsMember = await this.prisma.pointsMember.update({
                        where: {
                            id: pointsMember.id,
                        },
                        data: {
                            points: {
                                increment: totalPoints,
                            },
                        },
                    });
                }
            
                // Criação da notificação
                await this.prisma.notification.create({
                    data: {
                        title: 'Avaliação Concluída',
                        message: `Você recebeu ${evaluation}/5 na tarefa. Bônus: ${totalCoins} moedas e ${totalPoints} pontos`,  // Correção aqui, usando crase
                        recipientId: "7", 
                    },
                });
            });
        }
        catch(error){
            this.prisma.handlePrismaError("Assign Bonus" , error);
        }
    
        return { success: true, bonus: { totalCoins, totalPoints }, evaluation };
    }
    


    private  calculateReward(difficulty: string, score: number){    
        const diff = difficulty.toLowerCase();
        const reward = baseReward[diff] || {coins: 5, points:10}; // Default reward if difficulty is not recognized (Default reward tem que ser guardada nas constans)
    
        const performanceFactor = (score -1) /4;
        const bonusMultiplier = 0.2; // 20% bonus for performance
    
        const bonusCoins = performanceFactor * bonusMultiplier * reward.coins;
        const bonusPoints = performanceFactor * bonusMultiplier * reward.points;
    
        return {
            totalCoins : reward.coins + bonusCoins,
            totalPoints : reward.points + bonusPoints,
        };
    }

    async getTaskByCommunity(userId: string, communityName: string){
        try{   

            const community = await this.prisma.community.findFirst({
                where:{
                    communityName: communityName,
                }
            });

            const findMember = await this.prisma.member.findFirst({
                where:{
                    communityId : community.id,
                    userId : userId
                },
            });

            const findTasks = await this.prisma.task.findMany({
                where:{
                    creatorId : findMember.id
                },
                include:{
                    members:{
                        select:{
                            volunteerId: true,
                            completedAt: true,
                        }
                    }
                }
            });
            console.log(findTasks)
            return findTasks;
        }
        catch(error){
            console.error('Error getting done tasks in community:', error); 
        }
    }

    
    async getDoneTasks(userId: string) {
        try {
          // Busca os membros relacionados ao usuário
          const user = await this.prisma.member.findMany({
            where: {
              userId: userId,
            },
            select: {
              id: true,
            },
          });
      
          const memberIds = user.map((m) => m.id);
      
          // Busca as tarefas com pelo menos um membro que completou a tarefa
          const tasksCommunity = await this.prisma.task.findMany({
            where: {
              creatorId: {
                in: memberIds, // Filtra tarefas criadas pelos membros
              },
              members: {
                some: {
                  completedAt: { not: null }, // Filtra tarefas com pelo menos um membro que completou
                },
              },
            },
            select: {
              title: true, 
              difficulty: true, 
              coins: true, 
              points: true, 
              location: true, 
              members: {
                where: {
                  completedAt: { not: null }, 
                },
                select: {
                  volunteerId: true,
                  completedAt: true,
                },
              },
            },
          });
      
          return tasksCommunity;
      
        } catch (error) {
          console.error('Error getting done tasks in community:', error);
        }
      }
      
      

}